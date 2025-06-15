const BASE_URL = 'http://127.0.0.1:8000' // Or your deployed backend URL

const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: formData
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error('File upload failed: ' + errText)
  }

  return await res.json() // { message: "File processed" }
}

const askQuery = async (query) => {
  const res = await fetch(`${BASE_URL}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query }) // ✅ Backend expects { query: "..." }
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error('Query failed: ' + errText)
  }

  return await res.json() // { reply: "..." }
}

export default { uploadFile, askQuery }
