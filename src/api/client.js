const BASE_URL = '/api';

const getToken = () => localStorage.getItem('ruado_token');

const request = async (method, path, body = null) => {
  const headers = {
    'Content-Type': 'application/json',
    'Accept':        'application/json',
  };

  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);

  const res  = await fetch(`${BASE_URL}${path}`, opts);
  const data = await res.json();

  if (!res.ok) {
    const msg =
      data.message ||
      (data.errors && Object.values(data.errors).flat().join(' ')) ||
      'Something went wrong.';
    throw new Error(msg);
  }

  return data;
};

export const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  put:    (path, body)  => request('PUT',    path, body),
  delete: (path)        => request('DELETE', path),
};

export default api;
