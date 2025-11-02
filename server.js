/********************************************************************************
*  WEB322 – Assignment 02
*  
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
*  Name: Siddhant Bisht
*  Student ID: 190872234
*  Date: 4 Nov 2025
********************************************************************************/

const path = require("path");
const express = require("express");
const projectData = require("./modules/projects");

const app = express();
const PORT = process.env.PORT || 8080;

/* ------------------------ Static assets (Tailwind CSS) ---------------------- */
app.use(express.static("public")); // serves /css/main.css, images, etc

/* ----------------------------- View engine: EJS ----------------------------- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // explicit for Vercel/local

/* ---------------------------- Data initialization --------------------------- */
let initialized = false;
const initPromise = projectData
  .initialize()
  .then(() => { initialized = true; })
  .catch((err) => {
    console.error("Failed to initialize:", err);
    throw err;
  });

app.use(async (_req, res, next) => {
  if (!initialized) {
    try { await initPromise; }
    catch { return res.status(500).send("Initialization failed."); }
  }
  next();
});

/* --------------------------------- Views ----------------------------------- */
app.get("/", (_req, res) => res.render("home"));
app.get("/about", (_req, res) => res.render("about"));

/* ---------------------------- Project list (Step 6) ------------------------- */
/* Renders views/projects.ejs with projects data (table).
   NOTE: we pass { sector } so your badge & "Clear" link in the EJS can show. */
app.get("/solutions/projects", async (req, res) => {
  try {
    const { sector } = req.query;
    const projects = sector
      ? await projectData.getProjectsBySector(sector)
      : await projectData.getAllProjects();

    return res.render("projects", { projects, sector });
  } catch (err) {
    return res.status(404).render("projects", { projects: [], sector: req.query.sector || "" });
  }
});

/* ---------------------------- Single project (Step 7) ----------------------- */
/* Renders views/project.ejs for a single project's details + random quote. */
app.get("/solutions/projects/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const project = await projectData.getProjectById(id);
    if (!project) {
      return res.status(404).render("404", { message: `No project with id ${id}` });
    }
    return res.render("project", { project });
  } catch (err) {
    return res.status(404).render("404", { message: "Error fetching project" });
  }
});

/* ------------------------------ Custom 404 page ----------------------------- */
app.use((_req, res) => {
  res.status(404).render("404", { message: "Page not found." });
});

/* --------------------------- Local vs Vercel start -------------------------- */
if (!process.env.VERCEL) {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
}

module.exports = app;
