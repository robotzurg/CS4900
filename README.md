# CS 4900 Capstone Project (Waveform)
### By Jeff Turpin

Waveform is a music reviewing platform where users can share their insights on tracks, albums, EPs, and artists, and get tailored recommendations based on what genres and music they tend to rate highly. Waveform is designed to foster a community of music enthusiasts through users sharing their thoughts on various music genres and albums, and helping people find new music to listen to based on what they enjoy, as well as giving critics a place to spotlight their reviews and publications about music.

## Prerequisites:
- Git (https://git-scm.com/) 
- Node.js and npm (https://nodejs.org/) – Use the latest versions

## Installation:
- Clone the repository: git clone https://github.com/robotzurg/cs4900.git 
- Run cd cs-4900 with the terminal open in the repository folder.
- Install project dependencies: npm install
- Do the same for cs-4900-backend. (cd .., then cd cs-4900-backend, then npm install)

## Database Setup: 
- Running the create_db.sql script in 

## Running the Application:
- Ensure your database server is running.
- Start the backend services: npm run start (make sure this is run in the cs-4900-backend folder)
- Start the frontend (GUI): npm run start (make sure this is run in the cs-4900 folder)

## Running Test Cases
To run test cases, run the following commands in the cs-4900 folder.
- npm run vitest
- npm run playwright

## Default URLs (for development):
- Backend Services API: http://localhost:3000
- Graphical User Interface (GUI): http://localhost:5173