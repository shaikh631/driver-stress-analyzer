import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const driverConnectSchema = z.object({
  pairingToken: z
    .string()
    .length(6, 'Pairing token must be 6 characters')
    .regex(/^[A-Z0-9]+$/, 'Token must be uppercase alphanumeric'),
  driverName: z.string().min(1, 'Driver name is required').max(100),
});

export const lapTimeSchema = z.object({
  driverId: z.string().min(1, 'Driver ID is required'),
  lapNumber: z.number().int().positive(),
  lapTimeMs: z.number().int().positive(),
  timestamp: z.string().datetime().optional(),
});

export const moodResponseSchema = z.object({
  mood: z.enum(['Calm', 'Stressed', 'Tired', 'Frustrated']),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
});

/** Express middleware factory — validates req.body against a zod schema */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join(', ');
      return res.status(400).json({ error: message });
    }
    req.validated = result.data;
    next();
  };
}
