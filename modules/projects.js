const projectData = require("../data/projectData");
const sectorData = require("../data/sectorData");

let projects = [];

// Initialize function
function initialize() {
  return new Promise((resolve, reject) => {
    try {
      projects = []; // reset before filling
      projectData.forEach((proj) => {
        // find matching sector
        const sectorObj = sectorData.find(
          (sec) => sec.id === proj.sector_id
        );
        const sectorName = sectorObj ? sectorObj.sector_name : "Unknown";

        // copy project and add sector
        projects.push({ ...proj, sector: sectorName });
      });
      resolve();
    } catch (err) {
      reject("Error initializing projects: " + err);
    }
  });
}

// Get all projects
function getAllProjects() {
  return new Promise((resolve, reject) => {
    if (projects.length > 0) {
      resolve(projects);
    } else {
      reject("No projects available");
    }
  });
}

// Get project by ID
function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      resolve(project);
    } else {
      reject(`Unable to find project with id: ${projectId}`);
    }
  });
}

// Get projects by sector (case-insensitive, partial match)
function getProjectsBySector(sector) {
  return new Promise((resolve, reject) => {
    const results = projects.filter((p) =>
      p.sector.toLowerCase().includes(sector.toLowerCase())
    );

    if (results.length > 0) {
      resolve(results);
    } else {
      reject(`Unable to find projects for sector: ${sector}`);
    }
  });
}

// Export functions
module.exports = {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector,
};
