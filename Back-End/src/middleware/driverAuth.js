import Driver from '../models/Driver.js';

/** Protect driver-level routes — expects x-driver-session header */
export default async function driverAuth(req, res, next) {
  const sessionToken = req.headers['x-driver-session'];
  if (!sessionToken) {
    return res.status(401).json({ error: 'Driver session required' });
  }

  try {
    const driver = await Driver.findOne({ sessionToken }).populate('teamId');
    if (!driver) {
      return res.status(401).json({ error: 'Invalid driver session' });
    }

    req.driver = driver;
    req.driverId = driver._id;
    req.teamId = driver.teamId._id;
    req.teamName = driver.teamId.name;
    next();
  } catch {
    return res.status(500).json({ error: 'Driver auth failed' });
  }
}
