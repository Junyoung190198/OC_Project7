# OC_Project7


This documentation provides instructions on how to set up and run the "Groupomania" application locally. The application is built using React and Express, with a SQL Server database.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

Node.js (v14.x or later)  
npm (Node Package Manager)  
Sql Server (v14 or later)

## Getting Started

1. Clone the Repository: Clone the repository from GitHub to your local machine using the following command:  
   `git clone https://github.com/Junyoung190198/OC_Project7.git`
2. Install Dependencies: Navigate to the project directory and install the project dependencies for both the frontend and backend:  
   `cd P7_Kevan_code`  
   `cd frontend`  
   `npm install`  
   `cd backend`  
   `npm install`
3. Database Setup:  
    .Create a SQL Server database for your project.  
    .Create 'Employees, EmployeeAccount, Posts, Media, MarkAsRead, Reactions' tables
    .Populate those tables and test
4. Configuration:  
    .Create an uploads folder in the root of the backend directory.  
    .Create a .env file in the root of the backend directory.  
    .Provide the necessary environment variables in the .env file, including database credentials and other configurations. For example:  
   `DB_HOST=localhost`  
   `DB_USER=your-username`  
   `DB_PASSWORD=your-password`  
   `DB_DATABASE=your-database-name`
5. Run the backend:  
   `cd backend`  
   `npm start`
6. Run the frontend:  
   `cd frontend`  
   `npm run dev`

## Accessing the Application

Open your web browser and navigate to http://localhost:3000 to access the running React app.

## ATTENTION!

_It is crucial that you use http://localhost:3000 and not the other link in the terminal output!_

## Notes

This documentation provides a basic setup guide. Depending on your environment and requirements, you may need to modify some steps.
Remember to secure your environment variables and sensitive information.
Feel free to explore and customize the application to your needs!

## Github repository

[github repo] (https://github.com/Junyoung190198/OC_Project7.git)