# MongoDB Setup Guide — Windows 11
## Agriculture Expert System

---

## ✅ STEP 1 — Download MongoDB

1. Open your browser and go to:
   👉 https://www.mongodb.com/try/download/community

2. On the download page, select:
   - **Version:** 7.0 (or latest)
   - **Platform:** Windows
   - **Package:** MSI

3. Click **Download**

---

## ✅ STEP 2 — Install MongoDB

1. Open the downloaded `.msi` file (e.g., `mongodb-windows-x86_64-7.0.x-signed.msi`)

2. Follow the installation wizard:
   - Click **Next**
   - Accept license agreement → **Next**
   - Choose **Complete** installation type
   - ✅ Check **"Install MongoDB as a Service"** (very important!)
   - Service Name: `MongoDB`
   - Data directory: `C:\Program Files\MongoDB\Server\7.0\data\`
   - Log directory: `C:\Program Files\MongoDB\Server\7.0\log\`
   - Click **Next**

3. On the **MongoDB Compass** screen:
   - ✅ Check **"Install MongoDB Compass"** (optional but useful GUI tool)
   - Click **Next**

4. Click **Install** (you may get a UAC prompt — click Yes)

5. Click **Finish** when done

---

## ✅ STEP 3 — Verify MongoDB is Running

Open **Command Prompt** (as Administrator) and run:

```
net start MongoDB
```

You should see:
```
The MongoDB Server (MongoDB) service was started successfully.
```

To check MongoDB status:
```
sc query MongoDB
```

You should see:
```
STATE : 4  RUNNING
```

---

## ✅ STEP 4 — Test MongoDB Connection

Open Command Prompt and type:
```
mongosh
```

You should see the MongoDB shell:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/
...
test>
```

Type `exit` to quit.

---

## ✅ STEP 5 — MongoDB is Ready!

Your MongoDB is now:
- Running at: `mongodb://localhost:27017/`
- Auto-starting when Windows boots
- Our app will create database: `agriculture_expert_db`

---

## ✅ STEP 6 — Set Up Python Backend

Open **Command Prompt** in the `backend` folder:

```
cd "C:\Users\koner\Downloads\AI\Agriculture Expert System\backend"
```

Run the setup script:
```
setup_backend.bat
```

This will:
- Create Python virtual environment
- Install all packages (Flask, pymongo, scikit-learn, etc.)
- Train the ML Decision Tree model
- Takes about 2-3 minutes

---

## ✅ STEP 7 — Start the Backend Server

```
start_backend.bat
```

You will see:
```
✅  MongoDB connected → database: 'agriculture_expert_db'
📦  Database is empty — running auto-seed …
    ✅ Created admin: admin@agri.com
    ✅ Created farmer: farmer@agri.com
    ✅ Created student: student@agri.com
    ✅ Inserted 25 expert rules
    ✅ Inserted 10 crops
🤖  ML model training...
✅  ML model saved

🌾  Agriculture Expert System Backend
🚀  Running on  http://localhost:5000
📖  API Docs    http://localhost:5000/api/docs
```

---

## ✅ STEP 8 — Start the Frontend

Open a **second** Command Prompt in the `frontend` folder:

```
cd "C:\Users\koner\Downloads\AI\Agriculture Expert System\frontend"
start_frontend.bat
```

This will:
- Install npm packages (first time ~2 minutes)
- Start React dev server at http://localhost:3000

---

## ✅ STEP 9 — Access the Application

Open your browser and go to:

```
http://localhost:3000
```

You will see the Login page. Use these demo accounts:

| Role    | Email                | Password   |
|---------|----------------------|------------|
| Admin   | admin@agri.com       | admin123   |
| Farmer  | farmer@agri.com      | farmer123  |
| Student | student@agri.com     | student123 |

---

## 📖 STEP 10 — Swagger API Documentation

The interactive API documentation is available at:
```
http://localhost:5000/api/docs
```

Here you can:
- See all API endpoints
- Test APIs directly in the browser
- View request/response examples

---

## 🗄️ MongoDB Compass (GUI Tool)

If you installed MongoDB Compass, open it and connect to:
```
mongodb://localhost:27017/
```

You can browse:
- `agriculture_expert_db` database
- `users` collection
- `rules` collection (25 rules)
- `predictions` collection
- `crops` collection

---

## 🔧 Troubleshooting

### MongoDB won't start
```
net start MongoDB
```
If error: Run Command Prompt **as Administrator**

### Port 5000 already in use
Edit `app.py` last line:
```python
app.run(host="0.0.0.0", port=5001, ...)
```

### Port 3000 already in use
```
set PORT=3001 && npm start
```

### Python packages fail to install
```
pip install -r requirements.txt --upgrade
```

### MongoDB connection refused
Make sure MongoDB service is running:
```
net start MongoDB
```

---

## 📋 Quick Reference — All Commands

```bash
# Start MongoDB
net start MongoDB

# Stop MongoDB
net stop MongoDB

# Start Backend
cd backend
venv\Scripts\activate
python app.py

# Start Frontend
cd frontend
npm start

# Access App
http://localhost:3000

# API Docs
http://localhost:5000/api/docs

# MongoDB GUI
mongosh   (command line)
# or open MongoDB Compass app
```
