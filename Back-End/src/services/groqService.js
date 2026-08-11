import fs from 'fs';
import path from 'path';
import Groq from 'groq-sdk';
import config from '../config/env.js';
import { moodResponseSchema } from '../utils/validation.js';

const groq = new Groq({ apiKey: config.GROQ_API_KEY });

/**
 * Transcribe an audio file using Groq Whisper endpoint.
 * @param {string} filePath — absolute path to audio file
 * @returns {Promise<string>} transcript text
 */
export async function transcribeAudio(filePath) {
  const start = Date.now();
  try {
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: 'whisper-large-v3-turbo',
      language: 'en',
      response_format: 'json',
    });
    const elapsed = Date.now() - start;
    console.log(`[Groq] Transcription completed in ${elapsed}ms`);
    return transcription.text || '';
  } catch (err) {
    const elapsed = Date.now() - start;
    console.error(`[Groq] Transcription failed after ${elapsed}ms:`, err.message);
    throw err;
  }
}

/**
 * Classify mood/stress from a transcript using Groq chat completion.
 * Retries once on failure; returns { mood: 'unknown', confidence: 0 } on total failure.
 */
export async function classifyMood(transcript) {
  const systemPrompt = `You are a racing driver stress analyst. Given a radio message transcript, classify the driver's emotional state.

Return ONLY a JSON object with these exact fields:
- "mood": one of "Calm", "Stressed", "Tired", "Frustrated"
- "confidence": a number from 0 to 1 indicating how confident you are
- "reasoning": a single sentence explaining your classification

Do not include any other text or markdown. Only output valid JSON.`;

  const attempt = async () => {
    const start = Date.now();
    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Driver radio transcript: "${transcript}"` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 200,
      });

      const elapsed = Date.now() - start;
      console.log(`[Groq] Mood classification completed in ${elapsed}ms`);

      const raw = completion.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(raw);
      const validated = moodResponseSchema.parse(parsed);
      return validated;
    } catch (err) {
      const elapsed = Date.now() - start;
      console.error(`[Groq] Mood classification failed after ${elapsed}ms:`, err.message);
      throw err;
    }
  };

  // Try once, retry once on failure, then return unknown
  try {
    return await attempt();
  } catch {
    console.log('[Groq] Retrying mood classification...');
    try {
      return await attempt();
    } catch {
      console.error('[Groq] Mood classification failed after retry — returning unknown');
      return { mood: 'unknown', confidence: 0, reasoning: 'Classification failed' };
    }
  }
}
