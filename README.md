# The Silent Co-Driver

An AI-powered system that analyzes driver radio communications to detect stress, frustration, fatigue, and emotional changes using speech-to-text and voice analysis.

## Architecture

```
Front-End/    → Vite + React + Redux + Tailwind CSS
Back-End/     → Node.js + Express + MongoDB (Mongoose) + Socket.IO
```

## Quick Start

### 1. Backend Setup

```bash
cd Back-End
cp .env.example .env    # Edit .env with your credentials
npm install
npm run dev             # Starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd Front-End
npm install
npm run dev             # Starts on http://localhost:5173 (proxies API to :5000)
```

### 3. Environment Variables

Create `Back-End/.env` with:

| Variable | Description |
|---|---|
| `DATABASE_URL` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `GROQ_API_KEY` | Your [Groq](https://console.groq.com/) API key |
| `PORT` | Server port (default: 5000) |
| `AUDIO_STORAGE_PATH` | Path for uploaded audio files (default: `./uploads`) |

### 4. Groq API Key

1. Sign up at [console.groq.com](https://console.groq.com/)
2. Create an API key
3. Set `GROQ_API_KEY` in your `.env`

Used for:
- **Speech-to-text**: `whisper-large-v3-turbo` for transcription
- **Mood classification**: `llama-3.3-70b-versatile` for stress/mood analysis

## Usage Flow

1. **Team signs up** at `/team/auth` → gets JWT
2. **Team generates pairing code** on Team Dashboard → 6-char alphanumeric code (e.g. `UQUMER`)
3. **Driver enters code** via the Driver Access Modal → gets paired to the team
4. **Driver records radio** by holding the push-to-talk button on the Driver Portal
5. **Audio is transcribed & analyzed** by Groq AI → mood classification (Calm/Stressed/Tired/Frustrated)
6. **Results appear live** on Team Dashboard via Socket.IO

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | — | Team registration |
| POST | `/api/auth/login` | — | Team login |
| GET | `/api/team/me` | JWT | Team profile |
| POST | `/api/team/pairing-token` | JWT | Generate pairing code |
| POST | `/api/driver/connect` | — | Driver pairs with team |
| GET | `/api/driver/status` | Session | Check driver pairing |
| POST | `/api/radio/upload` | Session | Upload audio clip |
| GET | `/api/radio/messages` | JWT | Paginated radio messages |
| POST | `/api/laps` | Session | Record lap time |
| GET | `/api/laps` | JWT | Get lap times |
| GET | `/api/dashboard/summary` | JWT | Combined dashboard data |
