const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "public");
const buildDir = path.join(__dirname, "build");

// Ensure build directory exists
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Function to copy and prepare images for optimization
function optimizeImages() {
  console.log("🚀 Starting image preparation...");

  try {
    // Copy all files from public to build directory
    copyDirectory(publicDir, buildDir);

    console.log("✅ Images prepared for optimization!");
    console.log("📝 Note: For full optimization, consider using:");
    console.log("   - ImageMagick: convert input.jpg -quality 85 output.jpg");
    console.log("   - Sharp: npm install sharp");
    console.log("   - Or online tools like TinyPNG, ImageOptim");
  } catch (error) {
    console.error("❌ Error during image preparation:", error);
    process.exit(1);
  }
}

// Function to recursively copy directory
function copyDirectory(source, destination) {
  const items = fs.readdirSync(source);

  items.forEach((item) => {
    const sourcePath = path.join(source, item);
    const destPath = path.join(destination, item);
    const stat = fs.statSync(sourcePath);

    if (stat.isDirectory()) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

// Run optimization
optimizeImages();
