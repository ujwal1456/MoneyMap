# 💰 MoneyMap – Personal Finance Tracker

A full-stack **MERN (MongoDB, Express, React, Node.js)** application to track personal income and expenses with a clean dashboard, real-time balance updates, and categorized insights.

---

## 🚀 Features

* ➕ Add Income & Expenses
* 📊 Real-time Balance Calculation
* 🧾 Categorized Transactions (Food, etc.)
* 📅 Date-wise Tracking
* 📈 Expense Summary Visualization
* 📝 Notes for each transaction
* 📂 File attachment support
* 🔐 Authentication (if implemented)

---

## 🖥️ Tech Stack

**Frontend:**

* React.js
* CSS / Tailwind (if used)

**Backend:**

* Node.js
* Express.js

**Database:**

* MongoDB (MongoDB Atlas recommended)

---

## 📂 Project Structure

```
MoneyMap/
│
├── frontend/     # React application
├── backend/      # Node + Express API
├── README.md
```

---

## ⚙️ Setup Instructions (Local Development)

### 1️⃣ Clone the repository

```
git clone https://github.com/ujwal1456/MoneyMap.git
cd MoneyMap
```

---

### 2️⃣ Setup Backend

```
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```
PORT = 5000
MONGODB_URI= <your-uri>
JWT_SECRET= <your-secret-key>
#CORS
CLIENT_URL=http://localhost:5173

#Cloudinary
CLOUDINARY_CLOUD_NAME= <cloud-name>
CLOUDINARY_API_KEY= <api-key>
CLOUDINARY_API_SECRET=<api-secret>
```

Run backend:

```
node src/server.js
```

---

### 3️⃣ Setup Frontend

Open a new terminal:

Create a `.env` file inside `backend/`:

``` 
VITE_API_BASE_URL=http://localhost:5000
```

```
cd frontend
npm install
npm run dev
```

---

## 🌐 Application URLs

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:5000 |

---

## 🔗 API Configuration

Make sure your frontend is pointing to backend:

```
REACT_APP_API_URL=http://localhost:5000
```

---

## ⚠️ Notes

* Backend must be running before frontend
* MongoDB connection is required
---

## 👨‍💻 Author

* P Ujwal
---

## 📜 License

This project is for educational purposes.