# ✈️ AeroNexus
### AI-Powered Weather-Aware Flight Route Optimization System

🚀 **AeroNexus** is an enterprise-grade aviation platform that computes optimal flight trajectories using AI, live satellite weather data, and advanced geospatial graph algorithms. It is designed to improve operational efficiency, reduce fuel consumption, and enforce mathematical safety boundaries around severe weather cells.

---

## 🌍 Overview
AeroNexus operates as a fault-tolerant, multi-language microservice architecture. It helps airlines determine the most efficient flight paths by analyzing:

* 🌦 **Real-time satellite weather & wind conditions** (OpenWeather API)
* ⛽ **3D Physics & Fuel consumption models** (Node.js Routing Engine)
* 🧠 **Machine Learning Delay Predictions** (Python/Flask Microservice)
* 🤖 **Algorithmic pathfinding** (A* and Dijkstra over Indian Airspace)

---

## 🧠 Key Features

* ✈️ **3D Algorithmic Route Optimization:** Utilizes the A-Star (A*) search algorithm and the Haversine formula to compute the absolute shortest paths across a geospatial graph. The engine dynamically calculates whether it is more fuel-efficient to fly at 25,000 ft or climb to 35,000 ft based on wind resistance and distance.
* 🌩️ **Live Weather-Aware Rerouting:** Ingests live weather data to validate proposed routes. If severe weather is detected, the engine dynamically calculates the cost of flying *over* the storm versus generating geospatial detours around the storm cell.
* 🤖 **Machine Learning Delay Prediction:** A dedicated Python microservice utilizing `scikit-learn` ingests destination wind speeds and storm proximity to calculate a live probability score for flight delays.
* ⚡ **High-Performance Redis Caching:** Employs an Upstash Serverless Redis cache to store regional weather data, drastically reducing external API latency and preventing rate-limiting during high-volume dispatch requests.
* 🗺 **Interactive React Dashboard:** A sleek, accessible command center built with React and Tailwind CSS, featuring a customized `react-leaflet` integration to visualize dynamic flight vectors, glowing origin/destination nodes, and weather hazard zones.
* 🐳 **Docker Orchestrated:** Fully containerized architecture using Docker Compose, allowing the frontend, Node engine, and Python ML service to boot up simultaneously within an isolated network.

---

## 🛠 Tech Stack

### Frontend Architecture
* **Framework:** React (Vite)
* **Styling:** Tailwind CSS
* **Components:** Shadcn UI, Framer Motion
* **Visualization:** React-Leaflet (Custom 2D WebGL Mapping)

### Backend Architecture (Routing Engine)
* **Server:** Node.js, Express.js
* **Algorithms:** A* (A-Star) 3D Pathfinding, Haversine Geospatial Formula
* **Caching Layer:** Upstash Redis Cloud

### Machine Learning Microservice
* **Server:** Python, Flask
* **Libraries:** Scikit-Learn, Pandas, NumPy, Joblib
* **Model:** Predictive Flight Delay Probability

### DevOps & Orchestration
* **Containerization:** Docker, Docker Compose

---

## 📂 Project Structure
```text
AeroNexus/
│
├── frontend/                   # React Command Center
│   ├── src/
│   │   ├── components/         # MapView, WeatherPanel, Sidebar
│   │   ├── App.jsx             # Main Dashboard Layout
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
│
├── backend/                    # Node.js Routing API
│   ├── src/
│   │   ├── routeEngine.js      # A* Graph algorithms & 3D altitude math
│   │   ├── weatherService.js   # OpenWeather integration & Redis cache
│   │   ├── dataBuilder.js      # CSV to JSON geospatial graph compiler
│   │   └── server.js           # Express API
│   ├── data/                   # Compiled airspace graphs
│   ├── Dockerfile
│   └── package.json
│
├── ml_service/                 # Python Machine Learning API
│   ├── app.py                  # Flask server
│   ├── flight_delay_model.pkl  # Trained ML model
│   ├── requirements.txt        # Python dependencies
│   └── Dockerfile
│
├── docker-compose.yml          # Master container orchestrator
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
