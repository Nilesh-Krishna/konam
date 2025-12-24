# Firebase Setup Guide for Konam Interiors

## Overview

This guide will help you set up and use Firebase Realtime Database and Storage for your Konam Interiors project.

## What's Been Done

### 1. Firebase Configuration

- ✅ Installed Firebase SDK (`npm install firebase`)
- ✅ Created `src/firebase/config.js` with your Firebase credentials
- ✅ Initialized Realtime Database, Storage, and Analytics

### 2. Firebase Services

- ✅ Created `src/firebase/services.js` with helper functions to:
  - Fetch all projects from database
  - Fetch single project by ID
  - Get image URLs from Storage
  - Subscribe to real-time updates

### 3. Updated Components

- ✅ Modified `src/data/projects.js` to fetch data from Firebase
- ✅ Updated `Home.js` to load featured projects asynchronously
- ✅ Updated `Projects.js` to load all projects asynchronously
- ✅ Updated `ProjectDetails.js` to load individual projects asynchronously
- ✅ Added loading states to all pages

## What You Need to Do

### Step 1: Upload Project Data to Firebase Realtime Database

1. **Go to Firebase Console**

   - Visit: https://console.firebase.google.com/
   - Select your project: `konamarchi`

2. **Navigate to Realtime Database**

   - Click "Realtime Database" from the left sidebar
   - If not set up, click "Create Database"
   - Choose your region (prefer closer to your users)
   - Start in "Test mode" (we'll set proper rules later)

3. **Import Your Data**

   - Click on the three dots menu (...) at the top
   - Select "Import JSON"
   - Copy the JSON from `src/firebase/uploadHelper.js` (lines marked between JSON START and JSON END)
   - Paste and click "Import"

   OR manually create:

   ```json
   {
     "projects": [
       {
         "id": 1,
         "title": "Mithila Nagar 3BHK",
         "description": "A 3BHK flat in Hyderabad...",
         "longDescription": "This 3BHK flat...",
         "images": [
           "Mithila Nagar/img36.jpg",
           "Mithila Nagar/img45.jpg",
           ...
         ],
         "category": "Residential",
         "year": "2024",
         "location": "Hyderabad, India",
         "area": "1,800 sq ft",
         "services": ["Interior Design", "Space Planning", "Custom Furniture"],
         "featured": true
       }
     ]
   }
   ```

### Step 2: Upload Images to Firebase Storage

1. **Go to Firebase Console**

   - Visit: https://console.firebase.google.com/
   - Select your project: `konamarchi`

2. **Navigate to Storage**

   - Click "Storage" from the left sidebar
   - Click "Get Started"
   - Accept the default security rules
   - Click "Done"

3. **Create Folder Structure**

   - Click "Create folder" button
   - Create folders matching your project structure:
     - `Mithila Nagar`
     - `Vinith 3bhk`

4. **Upload Images**

   - Open each folder
   - Click "Upload files"
   - Select all images from your local folders:
     - Upload images from `public/Mithila Nagar/` to `Mithila Nagar` folder
     - Upload images from `public/Vinith 3bhk/` to `Vinith 3bhk` folder

   **IMPORTANT**: Keep the same filenames as in your local folders!

### Step 3: Configure Firebase Security Rules

#### Realtime Database Rules

1. Go to Realtime Database → Rules tab
2. Replace with:

```json
{
  "rules": {
    "projects": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

This allows:

- Everyone can READ projects (your website visitors)
- Only authenticated users can WRITE (you, when updating)

#### Storage Rules

1. Go to Storage → Rules tab
2. Replace with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

This allows:

- Everyone can READ images (your website visitors)
- Only authenticated users can WRITE (you, when uploading)

### Step 4: Test Your Website

1. **Start your development server:**

   ```bash
   npm start
   ```

2. **Check the browser console for any errors**

3. **Verify:**
   - Home page loads with featured projects
   - Projects page shows all projects
   - Clicking on a project shows its details
   - All images load correctly

## Database Structure

Your Firebase Realtime Database should follow this structure:

```
konamarchi-default-rtdb/
└── projects/
    ├── 0/
    │   ├── id: 1
    │   ├── title: "Mithila Nagar 3BHK"
    │   ├── description: "..."
    │   ├── longDescription: "..."
    │   ├── images: ["Mithila Nagar/img36.jpg", ...]
    │   ├── category: "Residential"
    │   ├── year: "2024"
    │   ├── location: "Hyderabad, India"
    │   ├── area: "1,800 sq ft"
    │   ├── services: ["Interior Design", ...]
    │   └── featured: true
    └── 1/
        └── (similar structure)
```

## Storage Structure

Your Firebase Storage should follow this structure:

```
konamarchi.firebasestorage.app/
├── Mithila Nagar/
│   ├── img36.jpg
│   ├── img45.jpg
│   ├── img49.jpg
│   └── ...
└── Vinith 3bhk/
    ├── 0.png
    ├── 1.png
    ├── 2.png
    └── ...
```

## How to Add New Projects

### Option 1: Using Firebase Console (Easier)

1. Go to Realtime Database
2. Click on "projects" node
3. Click "+" to add a new child
4. Add a new object with all required fields
5. Upload images to Storage in a new folder
6. Reference the folder path in the images array

### Option 2: Using Code (Advanced)

Create an admin script using Firebase Admin SDK to programmatically add projects.

## How to Update Existing Projects

1. Go to Firebase Console → Realtime Database
2. Navigate to the project you want to edit
3. Click on the field you want to change
4. Edit the value
5. Press Enter to save

## Troubleshooting

### Images Not Loading

- **Check Storage Rules**: Make sure read access is allowed
- **Check Image Paths**: Ensure paths in database match Storage folder structure
- **Check Console**: Look for 403 or 404 errors in browser console

### Data Not Loading

- **Check Database Rules**: Make sure read access is allowed
- **Check Internet Connection**: Firebase requires internet to fetch data
- **Check Console**: Look for Firebase errors in browser console

### Slow Loading

- **Optimize Images**: Compress images before uploading to Storage
- **Use CDN**: Firebase Storage automatically uses CDN for faster delivery
- **Enable Caching**: Images are cached by browser after first load

## Environment Variables (Optional - For Security)

For production, you should move Firebase config to environment variables:

1. Create `.env` file in root:

```
REACT_APP_FIREBASE_API_KEY=AIzaSyAGu-iruaaM7g9K0m8fMX4lr33TnfqNxEo
REACT_APP_FIREBASE_AUTH_DOMAIN=konamarchi.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=konamarchi
REACT_APP_FIREBASE_STORAGE_BUCKET=konamarchi.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=562990635889
REACT_APP_FIREBASE_APP_ID=1:562990635889:web:426462e9b2babea188b4d0
REACT_APP_FIREBASE_MEASUREMENT_ID=G-K902NNER9P
```

2. Update `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
```

3. Add `.env` to `.gitignore` if not already there

## Firebase Pricing

- **Spark Plan (Free)**:

  - 1 GB Storage
  - 10 GB/month downloads
  - 100 simultaneous connections
  - Perfect for small to medium portfolios

- **Blaze Plan (Pay as you go)**:
  - Same free tier as Spark
  - Then pay for what you use
  - Recommended if you expect high traffic

## Support

If you encounter any issues:

1. Check browser console for errors
2. Check Firebase Console for quota limits
3. Verify all rules are set correctly
4. Ensure internet connection is stable

## Quick Reference Commands

```bash
# Install Firebase
npm install firebase

# Start development server
npm start

# Build for production
npm run build

# View JSON data structure
node src/firebase/uploadHelper.js
```

## Next Steps

1. ✅ Upload data to Realtime Database
2. ✅ Upload images to Storage
3. ✅ Configure security rules
4. ✅ Test your website
5. 🎉 Go live!

Your website will now fetch all data and images from Firebase, making it easy to update content without touching code!
