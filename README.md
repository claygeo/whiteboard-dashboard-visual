# Whiteboard Visual Dashboard

A React-based web application that serves as a real-time visualization dashboard for batch tracking data, integrated with Supabase for data management. Paired with the Whiteboard Project, this dashboard displays production line metrics, shift performance, and visualizations such as weekly goal timelines and shift leaderboards. It auto-refreshes every 30 seconds to provide up-to-date insights, using data from the batch_data and weekly_batch_summary tables, filtered by shift and effective_date columns.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Database Setup](#database-setup)
- [Visuals](#visuals)
- [Notes](#notes)


## Features

- Real-Time Dashboard: Displays current date/time and a dynamic production table with active lines for the current shift.
- Weekly Goal Timeline: Visualizes weekly actual_units from the weekly_batch_summary table as a percentage timeline,     segmented by shift.
- Production Table: Features dynamic font sizing, totals, and real-time updates for production metrics.
- Line Cards: Showcases batch metrics with progress circles for key performance indicators.
- Shift Leaderboard: Presents a visualization of shift performance.
- Visual Enhancements: Includes UI fillers for an engaging and polished interface.
- Auto-Refresh: Updates every 30 seconds to ensure data accuracy.

## Prerequisites
Before setting up the project, ensure you have the following:

- Node.js and npm: Install from nodejs.org.
- Supabase Account: Sign up at supabase.com and create a project.
- Environment Variables: Obtain VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY from your Supabase project settings.
- Tailwind CSS: Used for styling, installed via npm.
- Git: For cloning the repository.

## Setup
Follow these steps to set up the project locally:

1. Clone the Repository: git clone https://github.com/claygeo/whiteboard-dashboard-visual.git


2. Navigate to the Project Directory: cd whiteboard-dashboard-visual


3. Install Dependencies: npm install


4. Configure Environment Variables:
- Create a .env file in the project root.
- Add the following: VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

5. Run the Development Server: npm run start

6. Build for Production: npm run build

## Database Setup
This dashboard relies on the same Supabase database as the Whiteboard Project. To configure the database, copy and paste the following SQL code into the Supabase SQL Editor (found in your Supabase dashboard under SQL Editor). This will set up the required tables:

-- Enable UUID extension (if needed for other tables)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create batch_data table
CREATE TABLE batch_data (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    actual_units INTEGER,
    batch_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date TIMESTAMP WITHOUT TIME ZONE,
    delta_percentage DOUBLE PRECISION,
    effective_date DATE,
    employee_count INTEGER,
    end_time TEXT,
    is_locked BOOLEAN DEFAULT FALSE,
    line TEXT,
    line_lead TEXT,
    line_status VARCHAR DEFAULT 'Open',
    packing_format TEXT,
    product TEXT,
    product_status TEXT,
    running_takt DOUBLE PRECISION,
    shift TEXT,
    start_time TEXT,
    submission_time TEXT,
    takt_time DOUBLE PRECISION,
    target_delta DOUBLE PRECISION,
    target_units INTEGER,
    total_time DOUBLE PRECISION,
    ubi_no TEXT,
    CHECK (id IS NOT NULL)
);

-- Create employee_pace table
CREATE TABLE employee_pace (
    employees INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    percentage DOUBLE PRECISION NOT NULL,
    seconds DOUBLE PRECISION,
    time_reduction DOUBLE PRECISION,
    PRIMARY KEY (employees, created_at, percentage, seconds, time_reduction),
    CHECK (employees IS NOT NULL),
    CHECK (percentage IS NOT NULL)
);

-- Create product_master_list table
CREATE TABLE product_master_list (
    id BIGINT PRIMARY KEY,
    product_name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    current_takt DOUBLE PRECISION,
    delta_percentage DOUBLE PRECISION,
    original_takt DOUBLE PRECISION,
    CHECK (id IS NOT NULL),
    CHECK (product_name IS NOT NULL)
);

-- Create products table
CREATE TABLE products (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    product_name TEXT UNIQUE,
    packing_format TEXT,
    CHECK (id IS NOT NULL)
);

-- Create weekly_batch_summary table
CREATE TABLE weekly_batch_summary (
    actual_units INTEGER NOT NULL DEFAULT 0,
    CHECK (actual_units IS NOT NULL)
);

## Visuals

Main Dashboard: ![image](https://github.com/user-attachments/assets/91a99249-d142-4f56-9b69-a8533b3fbb52)

## Notes

Environment Security: Ensure the .env file is not committed to version control (it’s excluded via .gitignore).
Deployment: The app is deployed and accessible via [Insert deployment URL]. (Update with the actual URL once available.)
Data Source: This dashboard visualizes data from the Whiteboard Project. Ensure the Supabase tables are populated with data from that project.
Auto-Refresh: The 30-second refresh interval can be adjusted in the source code if needed.

