/********************************************************************************
*  WEB322 – Assignment 01
*  
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
*  Name: Siddhant Bisht
*  Student ID: 190872234
*  Date: 25 sept 2025
********************************************************************************/

const express = require("express");
const projectData = require("./modules/projects");

const app = express();
const PORT = process.env.PORT || 8080; // Vercel uses process.env.PORT

// Routes
app.get("/", (req, res) => {
  res.send("Assignment 1:Siddhant Bisht - 190872234");
});

app.get("/solutions/projects", (req, res) => {
  projectData.getAllProjects()
    .then((data) => res.json(data))
    .catch((err) => res.send(err));
});

app.get("/solutions/projects/id-demo", (req, res) => {
  projectData.getProjectById(9) // Example ID
    .then((data) => res.json(data))
    .catch((err) => res.send(err));
});

app.get("/solutions/projects/sector-demo", (req, res) => {
  projectData.getProjectsBySector("agriculture") // Example sector
    .then((data) => res.json(data))
    .catch((err) => res.send(err));
});

// Start server after initialization
projectData.initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.log("Failed to initialize:", err);
});
