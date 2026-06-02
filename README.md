<div align="center">

# 🌾 Agriculture Expert System

### AI-powered crop recommendation and yield prediction platform for Indian agriculture

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-Decision_Tree-F7931E?style=flat-square&logo=scikitlearn&logoColor=white)](https://scikit-learn.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![Railway](https://img.shields.io/badge/Backend-Railway-7B2FBE?style=flat-square&logo=railway&logoColor=white)](https://railway.app)

<br/>

> **75 expert rules** · **31 crop types** · **632 training samples** · **Train R² 98.9%**

<br/>

```
  🌱 Expert System    🤖 ML Prediction    🎮 Crop Game    📊 Dashboard
  ─────────────────   ──────────────────  ─────────────   ─────────────
  IF soil = clay      Decision Tree       Guess crops     Live weather
  AND weather = humid Regressor model     earn points     analytics &
  AND season = kharif 31 crops, 7         streak bonus    prediction
  → Rice (Paddy) 97%  soil/climate feats  75-rule based   history
```

</div>

---

## ✨ Features

| Module | Description | Status |
|--------|-------------|--------|
| 🌿 **Expert System** | Forward-chaining IF-THEN inference engine — 75 rules across 5 soils × 5 weathers × 3 seasons | ✅ Live |
| 🤖 **ML Prediction** | Decision Tree Regressor predicting crop yield (t/ha) from 7 soil & climate features | ✅ Live |
| 🎮 **Crop Master Game** | Quiz game with 75-rule answer key — guess the right crop, race the clock, build streaks | ✅ Live |
| 📊 **Dashboard** | Real-time weather strip, weekly prediction charts, crop distribution, recent activity | ✅ Live |
| 📜 **History** | Full prediction log with filtering, export, and confidence breakdown | ✅ Live |
| 👤 **Auth** | JWT-based login with roles (admin / farmer / student) | ✅ Live |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        FRONTEND  (Vercel)                        │
│                                                                  │
│   React 18 + Tailwind CSS + Recharts + React Router v6           │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│   │Dashboard │ │ Expert   │ │   ML     │ │  Crop Master     │   │
│   │          │ │ System   │ │ Predict  │ │  Game  🎮        │   │
│   └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
│          │            │           │                │             │
│          └────────────┴───────────┴────────────────┘             │
│                              │                                   │
│                    Offline-first fallback                        │
│            (mock data when backend unreachable)                  │
└─────────────────────┬────────────────────────────────────────────┘
                      │ REST API  /api/*
┌─────────────────────▼────────────────────────────────────────────┐
│                         BACKEND  (Railway)                       │
│                                                                  │
│   Flask 3 + Flask-JWT-Extended + PyMongo + scikit-learn          │
│   ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│   │ Expert Engine│  │  ML Module   │  │   Auth / Users      │   │
│   │ 75 IF-THEN   │  │ Decision Tree│  │   JWT + bcrypt      │   │
│   │ rules        │  │ auto-trains  │  │   Role-based        │   │
│   └──────────────┘  └──────────────┘  └─────────────────────┘   │
│          │                 │                     │               │
│          └─────────────────┴─────────────────────┘               │
│                            │                                     │
│                    ┌───────▼────────┐                            │
│                    │  MongoDB Atlas │                            │
│                    │  users/rules   │                            │
│                    │  predictions   │                            │
│                    └────────────────┘                            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🧠 Expert System — 75 Rules

The knowledge base covers **every combination** of soil type × weather condition × season, mapping to the scientifically recommended crop for Indian agriculture.

```
5 Soil Types    ×    5 Weather Conditions    ×    3 Seasons    =    75 Rules
────────────────     ──────────────────────       ──────────         ───────
🏜️  Sandy             🌡️  Hot                     🌾 Kharif (Jun–Oct)
🟤  Clay              ☀️  Dry                     🌿 Rabi   (Nov–Mar)
🌿  Loamy             💦  Humid                   🌱 Zaid   (Apr–Jun)
⚫  Black             🌧️  Rainy
💧  Silt              ❄️  Cool
```

**Example rules:**

| Soil | Weather | Season | Recommended Crop | Confidence |
|------|---------|--------|-----------------|-----------|
| Clay | Humid | Kharif | 🍚 Rice (Paddy) | 97% |
| Loamy | Hot | Kharif | 🌸 Cotton | 91% |
| Silt | Cool | Rabi | 🌿 Wheat | 96% |
| Sandy | Cool | Zaid | 🍉 Watermelon | 84% |
| Black | Humid | Kharif | 🫘 Soybean | 91% |
| Silt | Humid | Kharif | 🍌 Banana | 88% |

Each rule also provides **fertilizer dosage**, **pest control**, **water requirement**, **expected yield range**, and **farming tips**.

---

## 🤖 ML Model — Decision Tree Regressor

| Metric | Value |
|--------|-------|
| Algorithm | Decision Tree Regressor |
| Dataset | 632 samples across 31 crop types |
| Input features | Soil pH, N, P, K, Temperature, Rainfall, Crop Type |
| Train R² | **98.9%** |
| Test R² | **78.3%** |
| Output | Yield (t/ha), Grade, Confidence, Feature Importance |

**Supported crops (31):**
`wheat` · `rice` · `maize` · `cotton` · `soybean` · `potato` · `sugarcane` · `tomato` · `onion` · `banana` · `groundnut` · `sunflower` · `chickpea` · `barley` · `mustard` · `lentil` · `bajra` · `sorghum` · `moong` · `jute` · `watermelon` · `cucumber` · `muskmelon` · `okra` · `bitter_gourd` · `bottle_gourd` · `cowpea` · `sesame` · `oats` · `pumpkin` · `taro`

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- MongoDB (local or Atlas URI)

### 1. Clone

```bash
git clone https://github.com/vamsikoneru06/Agriculture-Expert-System.git
cd Agriculture-Expert-System
```

### 2. Backend

```bash
cd backend
python -m venv venv
# Windows:  venv\Scripts\activate
# macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017
DB_NAME=agriculture_db
JWT_SECRET_KEY=your-secret-key-here
```

```bash
python app.py          # auto-seeds DB + trains ML model on first run
```

### 3. Frontend

```bash
cd frontend
npm install
npm start              # http://localhost:3000
```

### 4. One-click (Windows)

```bat
START_ALL.bat          # starts backend + frontend together
```

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 🔑 Admin | `admin@agri.com` | `admin123` |
| 🌾 Farmer | `farmer@agri.com` | `farmer123` |
| 📚 Student | `student@agri.com` | `student123` |

---

## 📁 Project Structure

```
Agriculture Expert System/
├── backend/
│   ├── app.py                    # Flask app entry point
│   ├── config/
│   │   ├── database.py           # PyMongo init
│   │   └── settings.py           # AppConfig (env vars)
│   ├── expert_system/
│   │   ├── engine.py             # Forward-chaining inference
│   │   └── rules_data.py         # 75 IF-THEN rules
│   ├── ml_model/
│   │   ├── train_model.py        # Decision Tree training
│   │   ├── predict.py            # Inference + grading
│   │   └── dataset.csv           # 632-row training data
│   ├── routes/
│   │   ├── auth_routes.py        # /api/auth/*
│   │   ├── expert_routes.py      # /api/expert/*
│   │   ├── ml_routes.py          # /api/ml/*
│   │   └── prediction_routes.py  # /api/predictions/*
│   ├── models/
│   │   └── crop_model.py         # Crop catalogue
│   └── seed/
│       └── seed_db.py            # DB seeder (upsert-safe)
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Dashboard.jsx     # Stats, charts, weather
        │   ├── ExpertSystem.jsx  # Rule-based recommendation
        │   ├── MLPrediction.jsx  # 31-crop yield predictor
        │   ├── Game.jsx          # Crop Master quiz game
        │   └── History.jsx       # Prediction log
        ├── data/
        │   └── expertRules.js    # JS mirror of 75 rules (offline)
        ├── components/
        │   └── ui/               # GlassButton, AgriShaderCards…
        └── context/
            ├── AuthContext.jsx
            └── ThemeContext.jsx
```

---

## 🌐 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | Auto-deploy on `git push main` |
| Backend | Railway | Auto-deploy on `git push main` |
| Database | MongoDB Atlas | Shared cluster |

> **Note:** The ML model (`.pkl` files) is **not** committed to git. Railway auto-retrains from `dataset.csv` on first prediction request after each deploy.

---

## 🔌 API Reference

```
POST /api/auth/login              → JWT token
GET  /api/auth/me                 → current user

POST /api/expert/predict          → rule-based crop recommendation
     body: { soilType, weather, season }

POST /api/ml/predict              → yield prediction
     body: { cropType, soilPH, nitrogen, phosphorus,
             potassium, temperature, rainfall, farmArea }

GET  /api/predictions/history     → user prediction history
GET  /api/crops                   → full crop catalogue
GET  /api/rules                   → all 75 expert rules (admin)
```

---

## 🛠️ Tech Stack

**Frontend**
- [React 18](https://react.dev) — UI framework
- [Tailwind CSS](https://tailwindcss.com) — utility-first styling (dark mode)
- [Recharts](https://recharts.org) — charts & visualisations
- [React Router v6](https://reactrouter.com) — SPA routing
- [Lucide React](https://lucide.dev) — icons

**Backend**
- [Flask 3](https://flask.palletsprojects.com) — REST API
- [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io) — auth
- [PyMongo](https://pymongo.readthedocs.io) — MongoDB driver
- [scikit-learn](https://scikit-learn.org) — Decision Tree model
- [pandas](https://pandas.pydata.org) + [NumPy](https://numpy.org) — data processing
- [bcrypt](https://github.com/pyca/bcrypt) — password hashing

**Infrastructure**
- [MongoDB Atlas](https://cloud.mongodb.com) — database
- [Vercel](https://vercel.com) — frontend hosting
- [Railway](https://railway.app) — backend hosting

---

<div align="center">

Made with 🌱 for smarter, data-driven farming

</div>
