# MoodTune AI - AI Music for Your Emotions

MoodTune AI is an AI-powered emotion detection system that analyzes your facial expressions in real-time and plays music that matches your current mood. Using advanced face detection technology, it creates a personalized music experience based on your emotions.

## Features

- **Real-time Emotion Detection**: Uses face-api.js to analyze facial expressions through your camera
- **Mood-Based Music Playlists**: Curated music library with songs for different emotional states
- **YouTube Integration**: Streams music directly from YouTube
- **Manual Mood Override**: Option to manually select your mood
- **Beautiful UI**: Modern, responsive design with gradient themes that match your mood
- **Live Statistics**: Real-time confidence scores and emotion breakdowns

## Supported Emotions

- Happy
- Sad
- Angry
- Neutral
- Surprised
- Fearful
- Disgusted

## Prerequisites

Before setting up MoodSync, ensure you have:

- Node.js (version 16 or higher)
- npm or yarn package manager
- A modern web browser with camera access
- Stable internet connection (for YouTube music streaming)

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd moodtune-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`
   - Allow camera permissions when prompted
   - The app will automatically start detecting your emotions

## Production Build

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Hosting Setup

### Option 1: Bolt Hosting (Recommended)

1. **Deploy directly from the interface**
   - Click the "Deploy" button in the Bolt interface
   - Your app will be automatically built and deployed
   - You'll receive a live URL to share

### Option 2: Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to [Netlify Drop](https://app.netlify.com/drop)
   - Or connect your Git repository for automatic deployments

3. **Configure build settings** (if using Git integration)
   - Build command: `npm run build`
   - Publish directory: `dist`

### Option 3: Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 4: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json**
   ```json
   {
     "scripts": {
       "deploy": "npm run build && gh-pages -d dist"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## Important Hosting Considerations

### Camera Permissions
- **HTTPS Required**: Most browsers require HTTPS for camera access
- **Local Development**: Works on `localhost` without HTTPS
- **Production**: Ensure your hosting platform provides HTTPS (most modern platforms do)

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### Performance Optimization
- The app loads AI models (~6MB) on first visit
- Models are cached for subsequent visits
- Consider implementing a loading screen for better UX

## Troubleshooting

### Camera Access Issues
- **Permission Denied**: Check browser settings and allow camera access
- **No Camera Found**: Ensure a camera is connected and not being used by other applications
- **HTTPS Required**: Deploy to a platform that provides HTTPS

### Model Loading Issues
- **Slow Loading**: Models are loaded from CDN, check internet connection
- **Loading Failures**: Try refreshing the page or clearing browser cache

### Music Playback Issues
- **Videos Not Playing**: Check if YouTube is accessible in your region
- **Audio Issues**: Ensure browser allows autoplay (may require user interaction first)

## Customization

### Adding New Songs
Edit `src/data/musicLibrary.ts` to add new songs:

```typescript
{
  id: 'unique-id',
  title: 'Song Title',
  artist: 'Artist Name',
  youtubeId: 'YouTube-Video-ID',
  mood: 'happy', // or sad, angry, etc.
}
```

### Adjusting Detection Sensitivity
Modify the detection interval in `src/hooks/useFaceDetection.ts`:

```typescript
const interval = setInterval(detectEmotions, 1000); // Change 1000 to desired milliseconds
```

### Styling Customization
- Main styles are in `src/index.css` using Tailwind CSS
- Component-specific styles are inline using Tailwind classes
- Mood-specific gradients are defined in `src/components/MusicPlayer.tsx`

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI/ML**: face-api.js
- **Music**: YouTube Iframe API
- **Icons**: Lucide React

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Ensure camera permissions are granted
4. Verify internet connection for model loading

---

**Note**: This application requires camera access to function properly. Make sure to deploy on HTTPS-enabled platforms for production use.