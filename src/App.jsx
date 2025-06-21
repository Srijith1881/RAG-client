import { useState } from 'react'
import api from './services/api'


function App() {
  const [file, setFile] = useState(null)
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [uploadStatus, setUploadStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [fileKey, setFileKey] = useState(null)
  const [darkMode, setDarkMode] = useState(false)
  const [currentStep, setCurrentStep] = useState('upload') // 'upload' or 'chat'
  const [chatHistory, setChatHistory] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Typewriter effect
  const typewriterEffect = (text, callback) => {
    setIsTyping(true)
    let i = 0
    const tempResponse = ''
    setResponse('')
    
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        setResponse(text.substring(0, i + 1))
        i++
      } else {
        clearInterval(typeInterval)
        setIsTyping(false)
        if (callback) callback()
      }
    }, 30)
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setUploadStatus('')
    setResponse('')
    setFileKey(null)
    setUploadProgress(0)
    setChatHistory([])
  }

  const handleUpload = async () => {
    if (!file) return alert("Please choose a file first!")
    setUploadStatus('Uploading...')
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + Math.random() * 10
      })
    }, 200)

    try {
      const res = await api.uploadFile(file)
      setUploadProgress(100)
      setTimeout(() => {
        setUploadStatus('Uploaded successfully!')
        setFileKey(res.file_id + ".pdf")
        setCurrentStep('chat')
        clearInterval(progressInterval)
      }, 500)
      console.log(res)
    } catch (error) {
      setUploadStatus('Upload failed.')
      setUploadProgress(0)
      clearInterval(progressInterval)
      console.error(error)
    }
  }

const handleQuery = async () => {
  if (!query.trim()) return alert("Enter a query.")
  if (!fileKey) return alert("Please upload a file first.")

  const userMessage = { type: 'user', content: query, timestamp: new Date() }
  setChatHistory(prev => [...prev, userMessage])
  setQuery('')
  setLoading(true)

  try {
    const res = await api.askQuery(query, fileKey)

    // Typewriter effect first
    typewriterEffect(res.reply, () => {
      const botMessage = { type: 'bot', content: res.reply, timestamp: new Date() }
      setChatHistory(prev => [...prev, botMessage])
      setResponse('')
    })

  } catch (error) {
    typewriterEffect('Error getting response.', () => {
      const errorMessage = { type: 'bot', content: 'Error getting response.', timestamp: new Date() }
      setChatHistory(prev => [...prev, errorMessage])
      setResponse('')
    })
    console.error(error)
  } finally {
    setLoading(false)
  }
}

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleQuery()
    }
  }

  const resetToUpload = () => {
    setCurrentStep('upload')
    setFile(null)
    setFileKey(null)
    setChatHistory([])
    setResponse('')
    setUploadStatus('')
    setUploadProgress(0)
  }

  const themeClasses = darkMode 
    ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white'
    : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900'

  const cardClasses = darkMode
    ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700'
    : 'bg-white/70 backdrop-blur-sm border border-white/20'

  const inputClasses = darkMode
    ? 'bg-gray-700/50 border-gray-600 text-white placeholder-gray-300 focus:border-purple-400'
    : 'bg-white/50 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-purple-500'

  return (
    <div className={`min-h-screen transition-all duration-500 ${themeClasses}`}>
      {/* Header */}
      <div className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-xl">🧠</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            SR's RAG
          </h1>
        </div>
        
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-full transition-all duration-300 ${
            darkMode 
              ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
              : 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
          }`}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {currentStep === 'upload' ? (
          /* Upload Section */
          <div className={`${cardClasses} rounded-2xl p-8 shadow-2xl`}>
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-3xl">📄</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">Upload Your PDF</h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Get started by uploading a PDF document to analyze
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
              <label
                htmlFor="pdf-upload"
                onDragOver={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.add("ring-2", "ring-purple-400")
                }}
                onDragLeave={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove("ring-2", "ring-purple-400")
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.currentTarget.classList.remove("ring-2", "ring-purple-400")
                  const droppedFile = e.dataTransfer.files[0]
                  if (droppedFile && droppedFile.type === "application/pdf") {
                    setFile(droppedFile)
                    setUploadStatus('')
                    setResponse('')
                    setFileKey(null)
                    setUploadProgress(0)
                    setChatHistory([])
                  } else {
                    alert("Please drop a valid PDF file.")
                  }
                }}
                className={`block w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? 'border-gray-600 hover:border-purple-400 bg-gray-700/30' 
                    : 'border-gray-300 hover:border-purple-400 bg-gray-50/50'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-lg font-medium">Choose PDF File</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Click here or drag and drop
                  </p>
                </div>
              </label>

              </div>

              {file && (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-blue-50'}`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📄</span>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || uploadStatus === 'Uploading...'}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {uploadStatus === 'Uploading...' ? 'Uploading...' : 'Upload PDF'}
              </button>

              {uploadStatus === 'Uploading...' && (
                <div className="space-y-2">
                  <div className={`w-full bg-gray-200 rounded-full h-2 ${darkMode ? 'bg-gray-700' : ''}`}>
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-sm">{Math.round(uploadProgress)}% uploaded</p>
                </div>
              )}

              {uploadStatus && uploadStatus !== 'Uploading...' && (
                <div className={`p-4 rounded-lg text-center ${
                  uploadStatus.includes('success') 
                    ? (darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-50 text-green-700')
                    : (darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-50 text-red-700')
                }`}>
                  {uploadStatus}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Chat Section */
          <div className="space-y-6">
            {/* Chat Header */}
            <div className={`${cardClasses} rounded-2xl p-6 shadow-lg`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                    <span className="text-lg">💬</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Chat with your PDF</h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {file?.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetToUpload}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Upload New PDF
                </button>
              </div>
            </div>

            {/* Chat History */}
            <div className={`${cardClasses} rounded-2xl p-6 shadow-lg min-h-96 max-h-96 overflow-y-auto`}>
              {chatHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🤖</div>
                  <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Ask me anything about your PDF!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                            : darkMode 
                              ? 'bg-gray-700 text-gray-100' 
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm font-medium">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Live response display */}
                  {(response || isTyping) && (
                    <div className="flex justify-start">
                      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'
                      }`}>
                        <p className="text-sm font-medium">
                          {response}
                          {isTyping && <span className="animate-pulse">|</span>}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Query Input */}
            <div className={`${cardClasses} rounded-2xl p-6 shadow-lg`}>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Type your question here..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className={`flex-1 px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 ${inputClasses}`}
                />
                <button
                  onClick={handleQuery}
                  disabled={loading || !query.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Thinking...</span>
                    </div>
                  ) : (
                    '🚀 Send'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

