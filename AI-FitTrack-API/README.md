# AI FitTrack API

Node.js + Express + MongoDB (Mongoose) backend with JWT auth and Google Gemini AI.

## Run
1. cd server
2. npm install
3. Edit `.env` (set GEMINI_API_KEY and JWT_SECRET; make sure MongoDB is running)
4. npm run dev   (or npm start)

## Endpoints
| Method | URL | Auth |
|---|---|---|
| POST | /api/auth/register | No |
| POST | /api/auth/login | No |
| GET | /api/auth/profile | Yes |
| POST | /api/workouts | Yes |
| GET | /api/workouts | Yes |
| GET | /api/workouts/search?name=&category=&date=YYYY-MM-DD | Yes |
| GET | /api/workouts/:id | Yes |
| PUT | /api/workouts/:id | Yes |
| DELETE | /api/workouts/:id | Yes |
| POST | /api/ai/workout-recommendation | Yes |
| POST | /api/ai/fitness-insights | Yes |

Send the token as: `Authorization: Bearer <token>`.
Import `server/FitTrack.postman_collection.json` into Postman / Thunder Client.
