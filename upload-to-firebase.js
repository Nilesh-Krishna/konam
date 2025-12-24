/**
 * Automated Firebase Upload Script
 *
 * This script uploads all project data and images to Firebase
 * Run: node upload-to-firebase.js
 */

const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set } = require("firebase/database");
const {
  getStorage,
  ref: storageRef,
  getDownloadURL,
  listAll,
} = require("firebase/storage");
const fs = require("fs");
const path = require("path");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGu-iruaaM7g9K0m8fMX4lr33TnfqNxEo",
  authDomain: "konamarchi.firebaseapp.com",
  projectId: "konamarchi",
  storageBucket: "konamarchi.firebasestorage.app",
  messagingSenderId: "562990635889",
  appId: "1:562990635889:web:426462e9b2babea188b4d0",
  measurementId: "G-K902NNER9P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

// Project data to upload
const projectsData = [
  {
    id: 1,
    title: "Mithila Nagar 3BHK",
    description:
      "A 3BHK flat in Hyderabad featuring mud-textured walls and a blend of earthy tones with modern design.",
    longDescription:
      "This 3BHK flat, spread across 1800 square feet in Hyderabad, was envisioned as a departure from conventional urban interiors — a reimagination of space through texture, tone, and thoughtful boldness. At the heart of the design lies a continuous thread of mud-textured walls, lending the entire home an earthy, grounded character that softens the edges of modernity.\n\nThe approach was to expand spatial perception and push boundaries, creating a home that feels both open and intimate. Each room carries its own unique vibe, yet all are tied together by a subtle narrative — one that balances bold design gestures with understated details, creating moments of visual surprise and comfort in equal measure.\n\nThis project is a celebration of contrasts — raw and refined, organic and structured — coming together to form a living space that feels distinct, soulful, and quietly luxurious.",
    images: [
      "Mithila Nagar/img36.jpg",
      "Mithila Nagar/img45.jpg",
      "Mithila Nagar/img49.jpg",
      "Mithila Nagar/img53.jpg",
      "Mithila Nagar/img57.jpg",
      "Mithila Nagar/img61.jpg",
      "Mithila Nagar/img65.jpg",
      "Mithila Nagar/img69.jpg",
      "Mithila Nagar/img73.jpg",
      "Mithila Nagar/img77.jpg",
      "Mithila Nagar/img80.jpg",
      "Mithila Nagar/img84.jpg",
      "Mithila Nagar/img88.jpg",
      "Mithila Nagar/img92.jpg",
      "Mithila Nagar/img96.jpg",
      "Mithila Nagar/img100.jpg",
      "Mithila Nagar/img104.jpg",
      "Mithila Nagar/img108.jpg",
      "Mithila Nagar/img112.jpg",
      "Mithila Nagar/img116.jpg",
      "Mithila Nagar/img120.jpg",
    ],
    category: "Residential",
    year: "2024",
    location: "Hyderabad, India",
    area: "1,800 sq ft",
    services: ["Interior Design", "Space Planning", "Custom Furniture"],
    featured: true,
  },
  {
    id: 2,
    title: "Vinith 3BHK",
    description:
      "A light-filled 3BHK flat in Hyderabad embracing pastel tones and airy textures for a serene urban sanctuary.",
    longDescription:
      "A Light-Filled Haven in the Heart of the City\nThis 3BHK flat, spread across 1,800 square feet in Hyderabad, embraces a light, uplifting design language — a refreshing take on urban living that prioritizes brightness, softness, and ease. Bathed in natural light, the home is a serene canvas of pastel tones and airy textures, carefully composed to evoke a sense of calm and openness.\n\nThe vision was to create a space that feels effortlessly fluid — open yet cozy, expressive yet restrained. Every room carries its own gentle rhythm, unified by a palette of blush pinks, powder blues, soft sage, and warm neutrals. The interplay of light materials, subtle patterns, and tactile finishes brings the interiors to life without overwhelming the senses.\n\nThis home is a study in quiet elegance — where thoughtful minimalism meets inviting warmth. It celebrates the joy of simplicity, crafting a modern sanctuary that feels fresh, soulful, and full of light.",
    images: [
      "Vinith 3bhk/0.png",
      "Vinith 3bhk/1.png",
      "Vinith 3bhk/2.png",
      "Vinith 3bhk/3.png",
      "Vinith 3bhk/4.png",
      "Vinith 3bhk/5.png",
      "Vinith 3bhk/6.png",
      "Vinith 3bhk/7.png",
      "Vinith 3bhk/8.png",
      "Vinith 3bhk/9.png",
      "Vinith 3bhk/10.png",
      "Vinith 3bhk/11.png",
      "Vinith 3bhk/12.png",
      "Vinith 3bhk/13.png",
      "Vinith 3bhk/14.png",
      "Vinith 3bhk/15.jpg",
      "Vinith 3bhk/16.png",
      "Vinith 3bhk/17.png",
      "Vinith 3bhk/18.png",
      "Vinith 3bhk/19.png",
      "Vinith 3bhk/20.png",
    ],
    category: "Residential",
    year: "2024",
    location: "Hyderabad, India",
    area: "1,800 sq ft",
    services: ["Interior Design", "Space Planning", "Lighting Design"],
    featured: true,
  },
];

// Helper function to upload a single file
async function uploadFile(localPath, firebasePath) {
  try {
    const fileBuffer = fs.readFileSync(localPath);
    const fileRef = storageRef(storage, firebasePath);

    // Determine content type
    const ext = path.extname(localPath).toLowerCase();
    const contentType = ext === ".png" ? "image/png" : "image/jpeg";

    await uploadBytes(fileRef, fileBuffer, {
      contentType: contentType,
    });

    const downloadURL = await getDownloadURL(fileRef);
    console.log(`✅ Uploaded: ${firebasePath}`);
    return downloadURL;
  } catch (error) {
    console.error(`❌ Error uploading ${firebasePath}:`, error.message);
    throw error;
  }
}

// Fetch all existing image URLs from Firebase Storage folder
async function getExistingUrls(firebaseFolder) {
  console.log(`\n📁 Fetching existing URLs from ${firebaseFolder}...`);

  try {
    const folderRef = storageRef(storage, firebaseFolder);
    const listResult = await listAll(folderRef);

    const imageUrls = [];
    for (const itemRef of listResult.items) {
      const url = await getDownloadURL(itemRef);
      imageUrls.push(url);
      console.log(`   ✓ ${itemRef.name}`);
    }

    console.log(`✅ Fetched ${imageUrls.length} URLs from ${firebaseFolder}`);
    return imageUrls;
  } catch (error) {
    console.error(
      `❌ Error fetching URLs from ${firebaseFolder}:`,
      error.message
    );
    return [];
  }
}

// Upload project data to Realtime Database
async function uploadProjectData() {
  console.log("\n📊 Uploading project data to Realtime Database...");

  try {
    const projectsRef = ref(database, "projects");
    await set(projectsRef, projectsData);
    console.log("✅ Project data uploaded successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error uploading project data:", error.message);
    return false;
  }
}

// Main execution
async function main() {
  console.log("=".repeat(80));
  console.log("🔥 FIREBASE URL UPDATE SCRIPT");
  console.log("=".repeat(80));
  console.log("\nThis script will:");
  console.log(
    "  1. Fetch existing image URLs from Firebase Storage (Mithila Nagar)"
  );
  console.log(
    "  2. Fetch existing image URLs from Firebase Storage (Vinith 3bhk)"
  );
  console.log(
    "  3. Update project data with direct Firebase URLs in Realtime Database"
  );
  console.log("\n" + "=".repeat(80));

  try {
    // Step 1: Fetch Mithila Nagar image URLs
    console.log("\n📋 STEP 1: Fetching Mithila Nagar Image URLs");
    console.log("-".repeat(80));
    const mithilaUrls = await getExistingUrls("Mithila Nagar");

    // Step 2: Fetch Vinith 3bhk image URLs
    console.log("\n📋 STEP 2: Fetching Vinith 3bhk Image URLs");
    console.log("-".repeat(80));
    const vinithUrls = await getExistingUrls("Vinith 3bhk");

    // Step 3: Update project data with Firebase URLs
    console.log("\n📋 STEP 3: Updating Project Data with Direct Firebase URLs");
    console.log("-".repeat(80));

    // Update projects with actual Firebase URLs
    projectsData[0].images = mithilaUrls;
    projectsData[1].images = vinithUrls;

    const dataUploaded = await uploadProjectData();

    if (!dataUploaded) {
      console.log("\n❌ Failed to upload project data. Exiting...");
      process.exit(1);
    }

    // Success message
    console.log("\n" + "=".repeat(80));
    console.log("🎉 UPLOAD COMPLETE!");
    console.log("=".repeat(80));
    console.log("\n✅ All data and images have been uploaded to Firebase!");
    console.log("\n📋 Next steps:");
    console.log("   1. Verify uploads in Firebase Console:");
    console.log(
      "      - Database: https://console.firebase.google.com/project/konamarchi/database"
    );
    console.log(
      "      - Storage: https://console.firebase.google.com/project/konamarchi/storage"
    );
    console.log("   2. Set security rules (see QUICK_START.md)");
    console.log('   3. Run "npm start" to test your website');
    console.log("\n" + "=".repeat(80) + "\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Upload failed:", error.message);
    console.error("\nPlease check:");
    console.error("   1. Your internet connection");
    console.error("   2. Firebase configuration is correct");
    console.error("   3. You have write permissions in Firebase Console");
    process.exit(1);
  }
}

// Run the script
main();
