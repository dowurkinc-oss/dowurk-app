import { useEffect, useRef } from 'react';

function VideoBackground({ videoUrl, opacity = 0.3, overlay = true }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log('Video autoplay blocked:', err));
    }
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {overlay && (
        <div 
          className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/80"
          style={{ backdropFilter: 'blur(1px)' }}
        />
      )}
    </div>
  );
}

export default VideoBackground;
