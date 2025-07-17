# Gemini Frontend Clone – Kuvaka Tech Assignment

A modern, fully responsive frontend application simulating a Gemini-style conversational AI. Built using **Next.js 15 App Router**, **Zustand**, **React Hook Form + Zod**, and **Tailwind CSS**.

Live Demo: [https://your-netlify-or-vercel-link.com](https://your-netlify-or-vercel-link.com)  
GitHub Repo: [https://github.com/yourusername/gemini-chat](https://github.com/yourusername/gemini-chat)

---

## 🧠 Project Overview

This project replicates a conversational AI app with OTP-based login, chatroom management, and a simulated Gemini-like AI messaging experience. It features form validation, loading skeletons, chatroom search, image uploads, reverse infinite scrolling, and rich UX interactions like dark mode, toasts, and auto-scroll.

---

## 🚀 Tech Stack

| Feature               | Stack / Library                        |
|----------------------|----------------------------------------|
| Framework            | Next.js 15 (App Router)                |
| State Management     | Zustand                                |
| Form Validation      | React Hook Form + Zod                  |
| Styling              | Tailwind CSS                           |
| Deployment           | Vercel / Netlify                       |
| Image Upload         | Base64/local preview (no backend)      |
| Simulated AI Chat    | `setTimeout`, throttling               |

---

## 🔧 Setup Instructions

1. **Clone the Repo**
```bash
git clone https://github.com/aliasif72/gemini-chat.git
cd gemini-chat



Install Dependencies
pnpm install


Run Development Server
pnpm dev


Build for Production
pnpm build

Run Production
pnpm start


/app                  → Next.js App Router
  /auth/login         → OTP-based login page
  /auth/verify        → OTP verification page
  /dashboard          → Chatroom listing and creation
/components           → Reusable UI components
/hooks                → Custom hooks (e.g. useChat, useOTP)
/lib                  → Utility functions (e.g. fake API, throttling)
/store                → Zustand state store
/styles               → Tailwind global styles
/types                → Type definitions


✅ Feature Implementation Details

🔐 OTP Login Flow
Country code selection fetched from restcountries.com

Form validation with React Hook Form + Zod

OTP send/verify simulated via setTimeout

Validates phone input and mock OTP

💬 Chatroom Interface
Lists chatrooms with Create/Delete functionality

Chat interface with:

Simulated Gemini responses with setTimeout

Typing indicator: "Gemini is typing..."

Timestamps and auto-scroll to latest message

Reverse infinite scroll (fetches older dummy messages)

Pagination: loads 20 messages per scroll

Copy-to-clipboard on message hover

Image upload with preview (no backend)

🌍 Global UX
Mobile responsive layout (Tailwind)

Dark Mode toggle via Zustand state

Search bar to filter chatrooms (debounced)

Skeleton loaders while loading messages

Toast notifications for:

OTP sent

Chatroom deleted

Message sent

Keyboard accessibility for:

Enter to send message

Tab/Shift+Tab for navigation

⚙️ Local Storage Usage
Stores user session (mock auth) and chat history

Dark mode and preferences persist between sessions

⚡ Performance & Optimization
Gemini reply throttled using setTimeout + delay queues

Debounced search input with setTimeout to reduce re-renders

Minimal re-renders using shallow Zustand selectors

Dynamic imports for heavy components (e.g., Image Preview)

🧪 Testing
Basic manual testing performed for:

Chatroom creation/deletion

Image upload preview

OTP validation flow

Scroll behaviors and message fetch simulation

Optional: Cypress or Playwright tests can be added.