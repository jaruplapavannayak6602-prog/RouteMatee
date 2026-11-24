# RouteMatee — Frontend + Backend starter

A separate React frontend and Node/Express backend for the RouteMatee passenger-matching platform.

## Project structure
- `frontend/` — React + Vite + React Router + responsive homepage
- `backend/` — Express API, Supabase server client, validation and route-search endpoint
- `supabase/schema.sql` — starter database schema and row-level security policies

## Requirements
- Node.js 20+
- A Supabase project (for database/auth features)

## Run locally

### 1. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
The API runs at `http://localhost:5000`.

### 2. Frontend
In another terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

### 3. Supabase
1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL Editor.
3. Add the project URL and anon key to `frontend/.env`.
4. Add the project URL and service-role key to `backend/.env`.
5. Never expose the Supabase service-role key in frontend code.

## Important product boundary
RouteMatee only helps passengers discover and contact people travelling along compatible routes. It does not book, dispatch, or integrate with Uber, Ola, Rapido, or other cab operators. Passengers independently arrange their transport and agree how to split expenses.

## Current implementation
- Responsive marketing homepage and navigation
- Travel Now / Schedule a Ride / Daily Commute selection
- Accessible journey search form with required-field validation
- API connection for ride-search requests
- Supabase-ready user and journey schema
- No fabricated matches, testimonials, or statistics

## Before production
Add OTP provider configuration, robust geospatial route matching, moderation workflows, verified identity checks, rate limiting, audit logs, secure chat, emergency escalation procedures, legal review, and privacy/security testing. Do not treat a phone/email verification badge as proof of identity.
