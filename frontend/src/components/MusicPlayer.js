import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMinimized, setIsMinimized] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Note: Replace this URL with actual lo-fi nature/hummingbird audio file
    // For now, this is a placeholder for the audio integration
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch(err => console.log('Audio play failed:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, volume]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume[0]);
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-24 right-6 z-40">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-[#A4D65E] to-[#006847] hover:opacity-90 shadow-lg"
        >
          <Music className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 right-6 z-40 bg-white rounded-2xl shadow-2xl border-2 border-[#A4D65E] p-4 w-72">
      {/* Hidden audio element - Replace src with actual audio file */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
      >
        {/* TODO: Add your lo-fi nature/hummingbird audio file URL here */}
        {/* <source src="/audio/nature-lofi-hummingbird.mp3" type="audio/mpeg" /> */}
      </audio>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Music className="h-5 w-5 text-[#006847]" />
          <h3 className="font-semibold text-sm">Ambient Sounds</h3>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
        >
          −
        </button>
      </div>

      <div className="space-y-3">
        <div className="bg-gradient-to-r from-[#A4D65E]/10 to-[#006847]/10 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Now Playing:</p>
          <p className="text-sm font-semibold text-[#006847]">
            🦜 Nature Lo-Fi • Hummingbird Vibes
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={togglePlay}
            variant="outline"
            size="sm"
            className="border-[#006847] text-[#006847] hover:bg-[#006847] hover:text-white"
          >
            {isPlaying ? (
              <>
                <VolumeX className="h-4 w-4 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 mr-1" />
                Play
              </>
            )}
          </Button>

          <div className="flex-1 flex items-center space-x-2">
            <VolumeX className="h-4 w-4 text-gray-400" />
            <Slider
              value={[volume]}
              onValueChange={handleVolumeChange}
              max={1}
              step={0.1}
              className="flex-1"
            />
            <Volume2 className="h-4 w-4 text-gray-600" />
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          <p>Peaceful ambient sounds to enhance your browsing experience</p>
        </div>

        {/* Audio file setup instructions */}
        <details className="text-xs text-gray-500">
          <summary className="cursor-pointer hover:text-[#006847]">Setup Instructions</summary>
          <div className="mt-2 p-2 bg-gray-50 rounded space-y-1">
            <p>To add your audio file:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Add audio file to <code>/app/frontend/public/audio/</code></li>
              <li>Update src in MusicPlayer.js</li>
              <li>Recommended: Lo-fi nature sounds with hummingbird ambience</li>
            </ol>
          </div>
        </details>
      </div>
    </div>
  );
}

export default MusicPlayer;
