const BASE_URL = 'http://127.0.0.1:8001';
const QUERY_URL = 'http://127.0.0.1:8002';

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json(); // { file_id: "...", message: "..." }
};

const askQuery = async (query, fileKey) => {
  const res = await fetch(`${QUERY_URL}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, file_key: fileKey }),
  });

  if (!res.ok) throw new Error(await res.text());
  return await res.json();
};

export default { uploadFile, askQuery };
