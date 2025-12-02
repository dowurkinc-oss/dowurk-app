# Peaceful Video Background Setup

## Current Status
✅ Video background component installed on homepage
⚠️ Placeholder active - awaiting your video file

## Quick Setup (2 minutes)

### Option 1: Use Free Stock Videos

**Recommended Sites:**
1. **Mixkit** - https://mixkit.co/free-stock-video/nature/
   - Search: "peaceful forest loop" or "calm water"
   - Download MP4 (1080p recommended)
   
2. **Coverr** - https://coverr.co/stock-video-footage/nature
   - Filter by "looping" videos
   - Free for commercial use
   
3. **Pexels** - https://www.pexels.com/search/videos/nature%20loop/
   - High quality, royalty-free
   - MP4 format

**Recommended Video Types:**
- 🌊 Gentle ocean waves
- 🌲 Forest with sunlight filtering through trees
- ☁️ Peaceful clouds moving across sky
- 💧 Waterfall or flowing stream
- 🦜 Birds in nature (hummingbird perfect!)
- 🌅 Sunrise/sunset over Louisiana landscape

### Option 2: Use Sample URL

Add this free sample video URL directly in HomePage.js:

```javascript
<VideoBackground 
  videoUrl="https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4"
  opacity={0.4}
  overlay={true}
/>
```

### Option 3: Add Your Own Video

1. **Save video file:**
   ```bash
   # Place your video here:
   /app/frontend/public/video/peaceful-nature.mp4
   ```

2. **Video requirements:**
   - Format: MP4 (H.264 codec)
   - Duration: 10-30 seconds (will loop)
   - Resolution: 1080p or 720p
   - File size: Under 5MB (optimize for web)

3. **File already configured in code** - no changes needed!

## Customization Options

Edit `/app/frontend/src/components/VideoBackground.js`:

**Adjust opacity:**
```javascript
<VideoBackground videoUrl="/video/peaceful-nature.mp4" opacity={0.3} />
// 0.2 = very subtle, 0.5 = more visible
```

**Remove overlay:**
```javascript
<VideoBackground videoUrl="/video/peaceful-nature.mp4" overlay={false} />
// Shows video more prominently
```

## Performance Tips

1. **Compress video:** Use HandBrake or FFmpeg
   ```bash
   ffmpeg -i input.mp4 -vcodec h264 -crf 28 -preset slow output.mp4
   ```

2. **Lazy load:** Video only loads when visible
3. **Mobile fallback:** Consider static image on mobile

## Testing

After adding video:
1. Visit http://localhost:3000
2. Scroll to the "Find Your Peace" section
3. Video should autoplay and loop
4. Check loading speed
5. Test on mobile

---

**The peaceful video adds a serene, immersive element to your homepage - perfect for the DowUrk holistic wellness brand!** 🦜🌿✨
