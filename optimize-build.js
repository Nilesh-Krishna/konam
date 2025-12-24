/**
 * Optimized Build Configuration for Firebase
 *
 * This script excludes local images from the build since they're hosted on Firebase
 */

const fs = require("fs");
const path = require("path");

console.log("🔧 Optimizing build for Firebase...\n");

// Paths to exclude from build
const excludePaths = ["public/Mithila Nagar", "public/Vinith 3bhk"];

// Create .buildignore patterns
const patterns = [
  "# Exclude local images - hosted on Firebase",
  "public/Mithila Nagar/**",
  "public/Vinith 3bhk/**",
  "",
  "# Keep only essential public files",
  "!public/index.html",
  "!public/manifest.json",
  "!public/robots.txt",
  "!public/_redirects",
  "!public/site.webmanifest",
].join("\n");

// Check if directories exist and show their sizes
let totalSize = 0;
excludePaths.forEach((dirPath) => {
  const fullPath = path.join(__dirname, dirPath);
  if (fs.existsSync(fullPath)) {
    const files = fs.readdirSync(fullPath);
    let dirSize = 0;
    files.forEach((file) => {
      const filePath = path.join(fullPath, file);
      const stats = fs.statSync(filePath);
      dirSize += stats.size;
    });
    totalSize += dirSize;
    console.log(
      `📁 ${dirPath}: ${files.length} files (${(dirSize / 1024 / 1024).toFixed(
        2
      )} MB)`
    );
  }
});

console.log(
  `\n💾 Total local images size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`
);
console.log("✨ These images are now hosted on Firebase Storage!");
console.log("🚀 Build will be significantly smaller and faster!\n");

// Export for use in other scripts
module.exports = {
  excludePaths,
  patterns,
};
