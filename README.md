# Whiteboard Visual Dashboard

A React-based web app functioning as a whiteboard for real-time batch tracking, integrated with Supabase for data management. It visualizes data sourced from a JavaScript whiteboard, displaying production line metrics, shift performance, and visualizations like a weekly goal timeline and shift leaderboard. The app auto-refreshes every 30 seconds to ensure up-to-date insights.

## Features
- Dashboard with real-time date/time and production table
- Weekly goal percentage timeline by shift
- Production table with dynamic font sizing and totals
- Line cards for batch metrics with progress circles
- Shift leaderboard with podium visualization
- Bilingual support (English/Spanish)
- Visual filler for UI enhancement

## Prerequisites
- Node.js and npm
- Supabase account with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables
- Tailwind CSS for styling

## Setup
1. Clone the repository: `git clone [your-repo-url]`
2. Navigate to the project directory: `cd batch-tracker-web`
3. Install dependencies: `npm install`
4. Create a `.env` file with Supabase credentials
5. Start the app: `npm run start`
6. Build for production: `npm run build`

## Notes
- Ensure `.env` is not committed (excluded via `.gitignore`).
- The app is deployed and accessible via [URL] (replace with actual URL).
