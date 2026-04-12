# AeroNexus
### AI-Powered Weather-Aware Flight Route Optimization System

<img width="2816" height="1536" alt="Gemini_Generated_Image_4ezl9t4ezl9t4ezl" src="https://github.com/user-attachments/assets/7315151e-af6d-4671-8769-c289c0ce4e31" />


AeroNexus is a high-performance aviation route optimization platform that computes **fuel-efficient and weather-safe flight paths** using **C++ algorithms, geospatial data, and machine learning models**.

The system integrates **real-time weather data, airspace constraints, and predictive ML models** to dynamically recommend optimized routes for airlines.

---

# ✈️ Features

• Weather-aware route optimization  
• Fuel-efficient flight path planning  
• Real-time weather integration  
• Machine learning based weather prediction  
• 3D airspace pathfinding using A* algorithm  
• Interactive flight visualization on map  
• Airspace restriction avoidance  
• Route recalculation when weather changes  

---

# 🧠 Key Idea

Traditional flight route planning is often static and cannot adapt quickly to changing weather conditions.

AeroNexus solves this problem by:

1. Collecting **real-time weather data**
2. Predicting future weather patterns using **machine learning**
3. Modeling the airspace as a **graph**
4. Running **A* pathfinding algorithm** to compute the best route

The result is a **safe, fuel-efficient, and optimized flight path**.

---

# 🏗️ System Architecture

---

# 🛠 Tech Stack

### Backend

- C++20
- Drogon / Crow / Oat++
- libpqxx

### Machine Learning

- LibTorch
- ONNX Runtime
- TensorFlow C++ API

### Database

- PostgreSQL
- PostGIS (Geospatial queries)

### Frontend

- React
- Mapbox GL JS / Leaflet

### Build System

- CMake
- vcpkg / Conan

### External APIs

Weather Data
- NOAA
- OpenWeatherMap

Flight Data
- OpenSky Network

---

# 🧩 Core Algorithm

AeroNexus models the airspace as a **weighted graph**.

Nodes represent:

• waypoints  
• airports  
• navigation beacons  

Edges represent possible flight paths.

### Cost Function

---

### A* Pathfinding

The system uses the **A\*** algorithm for optimal routing.

Heuristic uses **great-circle distance**.

---

# 🌦 Weather-Aware Routing

Weather conditions are integrated into route cost.

