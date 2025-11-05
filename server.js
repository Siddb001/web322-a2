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

/* ------------------------ Static assets (CSS / images) --------------------- */
// Serve Tailwind build
app.use("/css", express.static(path.join(__dirname, "public", "css")));
// Serve images under /images (your files live here)
app.use("/images", express.static(path.join(__dirname, "public", "images")));
// Optional legacy alias if you referenced /img somewhere
app.use("/img", express.static(path.join(__dirname, "public", "img")));
// Fallback for any other files in /public (e.g., favicon)
app.use(express.static(path.join(__dirname, "public")));

/* ----------------------------- View engine: EJS ----------------------------- */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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
// Home: show 6 featured projects
app.get("/", async (_req, res) => {
  try {
    const all = await projectData.getAllProjects();
    const featured = all.slice(0, 6); // first six
    return res.render("home", { projects: featured });
  } catch {
    return res.render("home", { projects: [] });
  }
});

app.get("/about", (_req, res) => res.render("about"));

/* ---------------------------- Project list (Step 6) ------------------------- */
app.get("/solutions/projects", async (req, res) => {
  try {
    const { sector } = req.query;
    const projects = sector
      ? await projectData.getProjectsBySector(sector)
      : await projectData.getAllProjects();

    return res.render("projects", { projects, sector });
  } catch (_err) {
    return res
      .status(404)
      .render("projects", { projects: [], sector: req.query.sector || "" });
  }
});

/* ---------------------------- Single project (Step 7) ----------------------- */
app.get("/solutions/projects/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const project = await projectData.getProjectById(id);
    if (!project) {
      return res.status(404).render("404", { message: `No project with id ${id}` });
    }
    return res.render("project", { project });
  } catch (_err) {
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
