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
const PORT = process.env.PORT || 8080;

/* ---------- Ensure data is initialized (works locally & on Vercel) ---------- */
let initialized = false;
const initPromise = projectData.initialize()
  .then(() => { initialized = true; })
  .catch((err) => {
    console.error("Failed to initialize:", err);
    // keep promise rejected so requests can report a failure
    throw err;
  });

// Middleware: wait for initialization before handling any route
app.use(async (req, res, next) => {
  if (!initialized) {
    try {
      await initPromise;
    } catch (e) {
      return res.status(500).send("Initialization failed.");
    }
  }
  next();
});

/* ---------------------------------- Routes --------------------------------- */
app.get("/", (req, res) => {
  res.send("Assignment 1: Siddhant Bisht - 190872234");
});

app.get("/solutions/projects", (req, res) => {
  projectData.getAllProjects()
    .then((data) => res.json(data))
    .catch((err) => res.status(500).send(err));
});

app.get("/solutions/projects/id-demo", (req, res) => {
  projectData.getProjectById(9)
    .then((data) => res.json(data))
    .catch((err) => res.status(404).send(err));
});

app.get("/solutions/projects/sector-demo", (req, res) => {
  projectData.getProjectsBySector("agriculture")
    .then((data) => res.json(data))
    .catch((err) => res.status(404).send(err));
});

/* --------- Local dev: listen; Vercel: export the app (no listen) ----------- */
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
