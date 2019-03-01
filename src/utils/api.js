export class AuthorizationError extends Error {
  constructor() {
    super('Authorization failed');
  }
}

export async function listFiles(authToken, path = '') {
  const result = await fetch(`/lms_files?path=${encodeURIComponent(path)}`, {
    headers: {
      Authorization: authToken,
    },
  });
  if (result.status === 403) {
    throw new AuthorizationError();
  }
  const { files } = await result.json();
  return files;
}
