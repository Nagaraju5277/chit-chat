#chit-chat(Connect) Real-Time Chat App 💬

A **full-stack real-time chat application**(Chit-Chat) built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) and **Socket.io** for instant messaging.  
Designed with a clean and modern UI for seamless communication.

---

## 🚀 Features

- 🔐 Secure User Authentication (Signup & Login) with JWT
- 📜 Real-time messaging using Socket.io
- 🖼️ Image sharing in chat (via Cloudinary)
- 🟢 Online/offline user status
- 🧑‍🤝‍🧑 One-to-one private messaging
- 🎨 Fully responsive UI
- 💾 Chat history stored in MongoDB

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- Axios

**Backend:**
- Node.js
- Express.js
- Socket.io
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- Bcrypt.js
- Cloudinary

---

## 📂 Folder Structure
┣ 📂 client # React frontend
┣ 📂 server # Node.js backend
┣ 📜 README.md





---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd chat-app

2.Install server dependencies:

-cd server
-npm install

Install client dependencies:
-cd ../client
-npm install

3.Create a .env file inside the server folder and add:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret



4.Run the application

Start the backend server:
cd server
npm run dev

Start the frontend:
cd ../client
npm start
