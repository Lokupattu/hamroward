# Free Video Hosting Options for HamroWard

Since Firebase Storage requires billing, here are **free alternatives** for hosting your 15-second ward videos:

## 🎯 Recommended: Cloudinary (Best for Video)

**Free Tier:**
- 25 GB storage
- 25 GB bandwidth/month
- Automatic video optimization & transcoding
- CDN delivery (fast worldwide)
- Video player widgets

**Setup:**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your `cloud_name`, `api_key`, and `api_secret` from dashboard
3. Add to `.env.local`:
   ```
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_API_KEY=your_api_key
   ```
4. Install: `npm install cloudinary`
5. Upload videos via their upload widget or API

**Pros:** Free, fast, automatic optimization, great for mobile
**Cons:** 25GB/month limit (enough for ~1000 videos/month)

---

## 🎬 Alternative: YouTube API (Unlisted Videos)

**Free Tier:**
- Unlimited storage
- Unlimited bandwidth
- Built-in player
- Auto-captions

**Setup:**
1. Create a YouTube channel
2. Get API credentials from [Google Cloud Console](https://console.cloud.google.com)
3. Upload videos as "unlisted" via YouTube Data API
4. Embed using YouTube iframe player

**Pros:** Truly unlimited, familiar player
**Cons:** Videos appear on YouTube (even if unlisted), more complex setup

---

## 📹 Alternative: Vimeo API

**Free Tier:**
- 500 MB/week upload limit
- Basic player
- Privacy controls

**Setup:**
1. Sign up at [vimeo.com](https://vimeo.com)
2. Create an app, get API token
3. Upload via Vimeo API
4. Embed player

**Pros:** Privacy-focused, good player
**Cons:** Weekly upload limit (500MB ≈ ~30 videos/week)

---

## 💾 Current Solution: Local Blob URLs (Testing Only)

**What we're using now:**
- Videos stored as `blob:` URLs in browser memory
- Works for testing
- **Lost when page refreshes** (not permanent)

**When to upgrade:**
- When you need videos to persist
- When sharing videos between users
- Before production launch

---

## 🚀 Quick Migration Path

1. **For now:** Keep using local blob URLs (current setup)
2. **When ready:** Switch to Cloudinary (easiest, best free tier)
3. **Later:** Consider YouTube if you need unlimited storage

The upload service (`src/services/storageService.js`) is already abstracted, so switching providers is just changing one function!

---

## Implementation Example (Cloudinary)

```javascript
// src/services/cloudinaryService.js
import { upload } from 'cloudinary';

export async function uploadVideoToCloudinary(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'hamroward_videos');
  formData.append('resource_type', 'video');
  
  // Upload with progress tracking
  const xhr = new XMLHttpRequest();
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable && onProgress) {
      onProgress(Math.round((e.loaded / e.total) * 100));
    }
  });
  
  return new Promise((resolve, reject) => {
    xhr.addEventListener('load', () => {
      const response = JSON.parse(xhr.responseText);
      resolve({ downloadURL: response.secure_url });
    });
    xhr.addEventListener('error', reject);
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
    xhr.send(formData);
  });
}
```

Then update `storageService.js` to use Cloudinary when configured.

