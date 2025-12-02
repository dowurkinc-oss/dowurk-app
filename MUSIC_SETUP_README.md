# Music Integration Setup Guide

## Overview
The DowUrk FramewUrk includes a background music player for peaceful, lo-fi nature sounds with hummingbird ambience.

## Current Status
✅ **Music Player UI:** Installed and visible (bottom-right corner)
⚠️ **Audio File:** Not added yet - placeholder active

## How to Add Your Audio File

### Option 1: Use Your Own Audio File

1. **Prepare your audio file:**
   - Format: MP3 (recommended) or OGG
   - Content: Peaceful lo-fi beats with nature sounds and hummingbird ambience
   - Duration: 3-5 minutes (will loop)
   - File size: Keep under 5MB for fast loading

2. **Add to project:**
   ```bash
   # Create audio directory if it doesn't exist
   mkdir -p /app/frontend/public/audio
   
   # Copy your audio file
   cp your-audio-file.mp3 /app/frontend/public/audio/nature-lofi-hummingbird.mp3
   ```

3. **Update MusicPlayer.js:**
   - File location: `/app/frontend/src/components/MusicPlayer.js`
   - Find the commented `<source>` tag
   - Uncomment and verify the path: `/audio/nature-lofi-hummingbird.mp3`

### Option 2: Use Free Nature Sounds

**Recommended Free Sources:**
1. **Freesound.org** - Search "hummingbird nature ambient lofi"
2. **YouTube Audio Library** - Download nature ambience tracks
3. **Pixabay** - Free music and sound effects
4. **Incompetech** - Royalty-free ambient music

**Search Terms:**
- "lo-fi nature beats"
- "hummingbird ambience"
- "peaceful forest sounds"
- "chill nature study music"

### Option 3: AI-Generated Audio

Use AI music generation tools:
- **Suno AI** - Generate custom lo-fi nature tracks
- **Mubert** - AI ambient music
- **Soundraw** - Customizable background music

## Testing

After adding your audio file:

```bash
# Restart frontend to ensure audio loads
sudo supervisorctl restart frontend

# Test by visiting http://localhost:3000
# Click the Music Player button (bottom-right)
# Click "Play" and adjust volume
```

## Customization

Edit `/app/frontend/src/components/MusicPlayer.js` to:
- Change player position
- Modify colors to match branding
- Add playlist support
- Customize controls

## Notes
- Music auto-plays only after user interaction (browser requirement)
- Volume defaults to 30% to not be intrusive
- Player can be minimized to a single button
- Loops continuously for ambient background

---

**Need help?** Contact DowUrk support or refer to the component code comments.
