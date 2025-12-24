# Firebase Storage CORS Configuration

## The Issue

You're getting CORS errors because Firebase Storage needs to be configured to allow requests from localhost during development.

## Quick Fix - Update Firebase Storage Rules

### Step 1: Go to Firebase Console

https://console.firebase.google.com/project/konamarchi/storage/konamarchi.firebasestorage.app/rules

### Step 2: Update Storage Rules

Replace your current rules with:

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

Click **"Publish"**

### Step 3: Add CORS Configuration (If rules don't fix it)

You need to set up CORS for Firebase Storage using Google Cloud Console:

1. **Install Google Cloud SDK** (if not already installed):
   https://cloud.google.com/sdk/docs/install

2. **Create a cors.json file** in your project root:

```json
[
  {
    "origin": ["*"],
    "method": ["GET"],
    "maxAgeSeconds": 3600
  }
]
```

3. **Apply CORS settings using gsutil**:

```bash
gsutil cors set cors.json gs://konamarchi.firebasestorage.app
```

## Alternative: Use Firebase Hosting (Production Solution)

For production, deploy your app to Firebase Hosting, which automatically works with Firebase Storage without CORS issues.

## Temporary Workaround (Development Only)

Add this to your browser for development:

- Install "CORS Unblock" or "Allow CORS" browser extension
- Enable it only for localhost development

---

**Try updating the Storage Rules first (Step 2) - this usually fixes the issue!**
