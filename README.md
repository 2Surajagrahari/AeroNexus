# ✈️ AeroNexus
### AI-Powered Weather-Aware Flight Route Optimization System

🚀 **AeroNexus** is an enterprise-grade aviation platform that computes optimal flight trajectories using AI, live satellite weather data, and advanced geospatial graph algorithms. It is designed to improve operational efficiency, reduce fuel consumption, and enforce mathematical safety boundaries around severe weather cells.

---

## 🌍 Overview
AeroNexus operates as a fault-tolerant microservice architecture, helping airlines determine the most efficient flight paths by analyzing:

* 🌦 **Real-time satellite weather conditions** (OpenWeather API)
* ⛽ **Predictive fuel consumption models** (Python-based physics engine)
* 📍 **Geospatial and live air traffic data** (ADS-B via OpenSky)
* 🤖 **Algorithmic pathfinding** (A* and Dijkstra over Indian Airspace)

---

## 🧠 Key Features

* ✈️ **Algorithmic Route Optimization:** Utilizes the A-Star (A*) search algorithm and the Haversine formula to compute the absolute shortest paths across a geospatial graph of 300+ aviation nodes in milliseconds.
* 🌩️ **"Two-Pass" Weather-Aware Rerouting:** Ingests live weather data to validate proposed routes. If severe weather is detected, the engine dynamically enforces a 50km safety penalty radius, automatically generating geospatial detours around the storm cell.
* ⚡ **Zero-Latency WebSocket Updates:** Integrates Socket.io to push real-time route recalculations to the client the exact moment a weather anomaly appears on the radar, eliminating the need for manual refreshes.
* 🛡️ **High-Performance Redis Caching:** Employs an in-memory Redis cache to store regional weather data, drastically reducing external API latency and preventing rate-limiting during high-volume dispatch requests.
* ⛽ **Predictive Fuel Analysis:** Evaluates flight trajectories to project Estimated Time Enroute (ETE) and fuel burn, reducing operational costs through weather-resistant routing.
* 🗺 **Interactive 3D Command Center:** A sleek, accessible dashboard built with React and Shadcn UI, featuring a Mapbox GL JS integration to visualize dynamic flight vectors, weather hazard zones, and live ADS-B air traffic in real-time.

---

## 🛠 Tech Stack

### Frontend Architecture
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **Components:** Shadcn UI, Framer Motion
* **Visualization:** Mapbox GL JS (3D WebGL Mapping)

### Backend Architecture
* **Server:** Node.js, Express.js
* **Microservices/Analysis:** Python
* **Caching Layer:** Redis
* **Real-Time Engine:** WebSockets (Socket.io)

### Core Algorithms
* A* (A-Star) Pathfinding
* Dijkstra's Algorithm
* Haversine Geospatial Formula
* Custom Priority Queues

### External APIs
* **OpenWeatherMap API** (Live atmospheric data)
* **OpenSky Network API** (Real-time ADS-B flight tracking)

---

## 📂 Project Structure

```text
AeroNexus/
│
├── public/                 # Static assets
├── src/
│   ├── frontend/           # React, Tailwind, and Shadcn UI components
│   │   ├── components/     # Reusable UI widgets (Radar, Alerts, Stats)
│   │   ├── hooks/          # Custom React hooks (WebSockets, Mapbox)
│   │   └── App.jsx         # Main Command Center interface
│   │
│   ├── backend/            # Node.js Express server
│   │   ├── routeEngine.js  # A* Graph algorithms & Haversine math
│   │   ├── weatherApi.js   # OpenWeather integration & 50km radius logic
│   │   ├── server.js       # Main API routes and Socket.io setup
│   │   └── redisCache.js   # In-memory caching logic
│   │
│   └── data/               # Geospatial JSON datasets
│       └── indian_airspace.json
│
├── .env                    # Hidden API Keys (Mapbox, OpenWeather)
├── .gitignore              # Git ignore rules
├── package.json            # Node dependencies
└── README.md               # Project documentation
