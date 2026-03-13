import { createSessionCookie, isPasswordConfigured, verifyPassword } from './_session.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isPasswordConfigured()) {
    return res.status(500).json({ error: 'Admin password is not configured on the server.' });
  }

  const password = req.body?.password;
  if (!verifyPassword(password)) {
    return res.status(401).json({ error: 'Invalid password.' });
  }

  res.setHeader('Set-Cookie', createSessionCookie());
  return res.status(200).json({ authenticated: true });
}
