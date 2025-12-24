import { database } from "./config";
import { ref, get, onValue } from "firebase/database";

// Cache for project data
let projectsCache = null;
let projectsCacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchProjects = async () => {
  if (
    projectsCache &&
    projectsCacheTime &&
    Date.now() - projectsCacheTime < CACHE_DURATION
  ) {
    console.log("✅ Using cached projects");
    return projectsCache;
  }

  try {
    console.log("🔍 Fetching projects from Firebase...");
    const projectsRef = ref(database, "projects");
    const snapshot = await get(projectsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      if (Array.isArray(data)) {
        projectsCache = data;
      } else {
        projectsCache = Object.values(data);
      }
      projectsCacheTime = Date.now();
      console.log(
        `✅ Fetched ${projectsCache.length} projects with direct URLs`
      );
      return projectsCache;
    } else {
      console.log("⚠️ No projects data available");
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching projects:", error);
    throw error;
  }
};

export const fetchProjectById = async (id) => {
  try {
    const allProjects = await fetchProjects();
    const project = allProjects.find((p) => p.id === parseInt(id));

    if (project) {
      console.log(`✅ Found project ${id} in cache`);
      return project;
    }

    console.log(`⚠️ Project ${id} not found`);
    return null;
  } catch (error) {
    console.error("❌ Error fetching project:", error);
    throw error;
  }
};

export const subscribeToProjects = (callback) => {
  const projectsRef = ref(database, "projects");

  const unsubscribe = onValue(
    projectsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const projects = Array.isArray(data) ? data : Object.values(data);
        console.log("🔄 Real-time update received");
        callback(projects);
      } else {
        callback([]);
      }
    },
    (error) => {
      console.error("❌ Error subscribing to projects:", error);
      callback([]);
    }
  );

  return unsubscribe;
};

export const clearCache = () => {
  projectsCache = null;
  projectsCacheTime = null;
  console.log("🗑️ Cache cleared");
};
