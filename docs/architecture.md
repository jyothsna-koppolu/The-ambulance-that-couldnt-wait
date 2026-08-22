# LifeLine AI architecture

## Current phase

Phase 1 — frontend foundation and dashboard.

## Intent

Optimize the **complete emergency journey** (ambulance + route + hospital) rather than shortest distance.

## Stack (Phase 1)

- React, Vite, JavaScript, Tailwind CSS, React Router, Lucide React
- Synthetic in-memory dashboard data (`frontend/src/data/dashboard.js`)
- Simulated SVG map (replaceable later; not real-time navigation)

## Later layers (not built yet)

- FastAPI services: severity, ambulance ranking, traffic/ETA, route optimization, hospital ranking, simulation
- PostgreSQL/Supabase-ready models; in-memory/JSON until the prototype works
- Provider abstractions for map and traffic APIs

## Safety labels

All traffic, ETA, time-saved, and hospital load values in Phase 1 are synthetic demo data.
