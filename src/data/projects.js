import { fetchProjects, fetchProjectById } from "../firebase/services";

// All data is fetched from Firebase - no local fallback
export let projects = [];

// Cache promise to prevent multiple simultaneous fetches
let projectsPromise = null;

/**
 * Main function to fetch all projects from Firebase
 * Projects now contain direct Firebase Storage URLs
 */
export const getProjects = async () => {
  try {
    const projects = await fetchProjects();
    return projects;
  } catch (error) {
    console.error("Error loading projects from Firebase:", error);
    return [];
  }
};

/**
 * Initialize projects on module load
 * Implements singleton pattern to prevent duplicate fetches
 */
export const initializeProjects = () => {
  if (!projectsPromise) {
    projectsPromise = getProjects().then((data) => {
      projects = data;
      return data;
    });
  }
  return projectsPromise;
};

/**
 * Fetch featured projects only
 * @returns {Promise<Array>} Array of featured projects
 */
export const getFeaturedProjects = async () => {
  try {
    const allProjects = await getProjects();
    return allProjects.filter((project) => project.featured);
  } catch (error) {
    console.error("Error loading featured projects:", error);
    return [];
  }
};

/**
 * Fetch a single project by ID
 * @param {string|number} id - Project ID
 * @returns {Promise<Object|null>} Project object or null
 */
export const getProjectById = async (id) => {
  try {
    // First try to fetch from Firebase directly
    const project = await fetchProjectById(id);
    if (project) return project;

    // Fallback to fetching all projects
    const allProjects = await getProjects();
    return allProjects.find((project) => project.id === parseInt(id));
  } catch (error) {
    console.error("Error loading project by ID:", error);
    return null;
  }
};

/* 
==============================================
INSTRUCTIONS FOR UPDATING PROJECT DATA
==============================================

All data is stored in Firebase Realtime Database.

To update projects:
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: konamarchi
3. Navigate to: Realtime Database
4. Edit the 'projects' node

To upload images:
1. Go to Firebase Console
2. Navigate to: Storage
3. Upload images to appropriate folders (e.g., 'Mithila Nagar/', 'Vinith 3bhk/')
4. Update image paths in Realtime Database to match uploaded paths

Firebase Realtime Database Structure:
{
  "projects": [
    {
      "id": 1,
      "title": "Project Title",
      "description": "Short description",
      "longDescription": "Detailed description",
      "images": ["path/to/image1.jpg", "path/to/image2.jpg"],
      "category": "Residential",
      "year": "2024",
      "location": "Hyderabad, India",
      "area": "1,800 sq ft",
      "services": ["Interior Design", "Space Planning"],
      "featured": true
    }
  ]
}
*/
