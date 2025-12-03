import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useLocation } from 'react-router-dom';

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMinimized, setIsMinimized] = useState(false);
  const audioRef = useRef(null);
  const location = useLocation();
  const hasAutoPlayed = useRef(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume]);

  // Auto-start music on homepage
  useEffect(() => {
    if (location.pathname === '/' && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      // Small delay to ensure audio element is ready
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch(err => {
              console.log('Auto-play blocked by browser:', err);
              // Auto-play blocked - user will need to click Play
            });
        }
      }, 500);
    }
  }, [location.pathname]);

  // Auto-minimize after 5 seconds (especially on mobile)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinimized(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume[0]);
  };

  return (
    <>
      {/* Audio element - Always rendered so music continues when minimized */}
      <audio ref={audioRef} loop preload="auto">
        <source src="/audio/nature-lofi-hummingbird.mp3" type="audio/mpeg" />
      </audio>

      {isMinimized ? (
        <div className="fixed bottom-28 left-6 z-30">
          <Button
            onClick={() => setIsMinimized(false)}
            className="rounded-full w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 shadow-lg relative"
            title="Open Music Player"
          >
            <Music className="h-5 w-5 text-[#006847]" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            )}
          </Button>
        </div>
      ) : (
        <div className="fixed bottom-28 left-6 z-30 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 p-3 w-64">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Music className="h-4 w-4 text-[#006847]" />
              <h3 className="font-semibold text-xs text-[#006847]">Ambient Sounds</h3>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              −
            </button>
          </div>

          <div className="space-y-2">
            <div className="bg-[#006847]/10 backdrop-blur-sm rounded-lg p-2">
              <p className="text-xs text-[#006847] font-medium truncate">
                🦜 Nature Lo-Fi
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={togglePlay}
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-[#006847] hover:bg-[#006847]/10"
              >
                {isPlaying ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              </Button>

              <div className="flex-1 flex items-center space-x-1">
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  step={0.1}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MusicPlayer;