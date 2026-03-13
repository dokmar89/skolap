import { clearSessionCookie, hasValidSession, isPasswordConfigured } from './_session.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isPasswordConfigured()) {
    res.setHeader('Set-Cookie', clearSessionCookie());
    return res.status(500).json({
      authenticated: false,
      error: 'Admin password is not configured on the server.',
    });
  }

  return res.status(200).json({ authenticated: hasValidSession(req) });
}
