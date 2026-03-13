interface AdminSessionResponse {
  authenticated: boolean;
  error?: string;
}

async function parseResponse(response: Response): Promise<AdminSessionResponse> {
  const data = (await response.json().catch(() => null)) as AdminSessionResponse | null;

  if (!response.ok) {
    throw new Error(data?.error || 'Admin request failed.');
  }

  return data || { authenticated: false };
}

export async function fetchAdminSession(): Promise<boolean> {
  const response = await fetch('/api/admin/session', {
    credentials: 'same-origin',
  });
  const data = await parseResponse(response);
  return data.authenticated;
}

export async function loginAdmin(password: string): Promise<void> {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
    body: JSON.stringify({ password }),
  });

  await parseResponse(response);
}

export async function logoutAdmin(): Promise<void> {
  const response = await fetch('/api/admin/logout', {
    method: 'POST',
    credentials: 'same-origin',
  });

  await parseResponse(response);
}
