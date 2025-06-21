# 🧠 PDF RAG Frontend

This is a React-based frontend application that allows users to upload a PDF file and interact with its contents using a chatbot interface powered by a RAG (Retrieval-Augmented Generation) system.

## 🚀 Features

- 📄 Upload PDF files
- 💬 Ask questions based on the uploaded document
- 🤖 Get AI-generated answers using document context
- 🌗 Light/Dark theme toggle
- 📈 Upload progress bar
- ⏱️ Typewriter-style animated responses
- 🧾 Chat history preserved during session

## 🧱 Architecture

This is a frontend-only app designed to interact with a backend RAG system. It expects the backend to provide two API endpoints:
- `POST /upload` – Accepts a PDF file and returns a `file_id`.
- `POST /query` – Accepts a question and a `file_id`, and returns an answer generated from the document context.

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone
npm i
cd <folder>
npm run dev
