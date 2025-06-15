import { useState } from 'react'
import api from './services/api'

function App() {
  const [file, setFile] = useState(null)
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [uploadStatus, setUploadStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setUploadStatus('')
    setResponse('')
  }

  const handleUpload = async () => {
    if (!file) return alert("Please choose a file first!")
    setUploadStatus('Uploading...')

    try {
      const res = await api.uploadFile(file)
      setUploadStatus('Uploaded successfully!')
      console.log(res)
    } catch (error) {
      setUploadStatus('Upload failed.')
      console.error(error)
    }
  }

  const handleQuery = async () => {
    if (!query.trim()) return alert("Enter a query.")
    setLoading(true)
    setResponse("Thinking...")

    try {
      const res = await api.askQuery(query)
      setResponse(res.reply)
    } catch (error) {
      setResponse('Error getting response.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>🧠 Ask Your PDF</h2>

      <div>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload PDF</button>
        <p>{uploadStatus} {file?.name && `(${file.name})`}</p>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Ask your query..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '60%', marginRight: '1rem' }}
        />
        <button onClick={handleQuery}>Submit</button>
      </div>

      <div style={{ marginTop: '1rem', background: '#f0f0f0', padding: '1rem' }}>
        <strong>Response:</strong>
        <p>{loading ? 'Thinking...' : response}</p>
      </div>
    </div>
  )
}

export default App
