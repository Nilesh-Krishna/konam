/**
 * Firebase Data Upload Utility
 *
 * This script helps you upload your existing project data to Firebase.
 *
 * INSTRUCTIONS:
 *
 * 1. UPLOAD PROJECT DATA TO REALTIME DATABASE:
 *    - Go to Firebase Console: https://console.firebase.google.com/
 *    - Select your project: konamarchi
 *    - Navigate to "Realtime Database" from the left menu
 *    - Click on the "+" icon at the root level
 *    - Create a new node called "projects"
 *    - Copy the JSON data below and paste it into the Firebase console
 *
 * 2. UPLOAD IMAGES TO FIREBASE STORAGE:
 *    Option A - Using Firebase Console (Recommended for beginners):
 *    - Go to Firebase Console: https://console.firebase.google.com/
 *    - Navigate to "Storage" from the left menu
 *    - Create folders matching your local structure (e.g., "Mithila Nagar", "Vinith 3bhk")
 *    - Upload images from your local folders to the corresponding Firebase Storage folders
 *    - The paths in the database should match: "Mithila Nagar/img36.jpg"
 *
 *    Option B - Using Firebase CLI (For advanced users):
 *    - Install Firebase CLI: npm install -g firebase-tools
 *    - Login: firebase login
 *    - Deploy storage: Use the Firebase Storage REST API or Firebase Admin SDK
 *
 * 3. UPDATE IMAGE REFERENCES:
 *    The services.js file will automatically convert Firebase Storage paths to download URLs.
 *    Your image paths in the database should be stored as: "Mithila Nagar/img36.jpg"
 *    The app will automatically fetch the actual download URLs.
 */

// JSON DATA TO UPLOAD TO FIREBASE REALTIME DATABASE
// Copy everything between the /* JSON START */ and /* JSON END */ markers

/* JSON START */
const firebaseData = {
  projects: [
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
  ],
};
/* JSON END */

// Pretty-print the JSON for easy copying
console.log("=".repeat(80));
console.log("FIREBASE REALTIME DATABASE DATA");
console.log("=".repeat(80));
console.log("Copy the JSON below and paste it into Firebase Console:");
console.log("=".repeat(80));
console.log(JSON.stringify(firebaseData, null, 2));
console.log("=".repeat(80));

/**
 * STEP-BY-STEP GUIDE TO UPLOAD DATA:
 *
 * 1. Run this script to see the JSON output:
 *    node src/firebase/uploadHelper.js
 *
 * 2. Copy the JSON output from the console
 *
 * 3. Go to Firebase Console:
 *    https://console.firebase.google.com/project/konamarchi/database/konamarchi-default-rtdb/data
 *
 * 4. Click the three dots menu (...) and select "Import JSON"
 *
 * 5. Paste the JSON and click "Import"
 *
 * 6. For images, go to Storage:
 *    https://console.firebase.google.com/project/konamarchi/storage
 *
 * 7. Upload your images maintaining the folder structure:
 *    - Create folder "Mithila Nagar" and upload images from public/Mithila Nagar/
 *    - Create folder "Vinith 3bhk" and upload images from public/Vinith 3bhk/
 *
 * 8. Make sure your Storage Rules allow read access:
 *    rules_version = '2';
 *    service firebase.storage {
 *      match /b/{bucket}/o {
 *        match /{allPaths=**} {
 *          allow read: if true;
 *          allow write: if request.auth != null;
 *        }
 *      }
 *    }
 */

// Export for potential use in other scripts
export default firebaseData;
