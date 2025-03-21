import React, { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import screenfull from "screenfull";
import {
  FaPlay,
  FaPause,
  FaExpand,
  FaCompress,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { PiCaretDoubleRightBold, PiCaretDoubleLeftBold } from "react-icons/pi";
import {
  TbMultiplier05X,
  TbMultiplier1X,
  TbMultiplier15X,
  TbMultiplier2X,
} from "react-icons/tb";
const VideoPlayer = ({ videoSrc }) => {
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const togglePlayPause = () => {
    setPlaying(!playing);
    setControlsVisible(true); // Show controls immediately after clicking play/pause
  };
  const toggleMute = () => setMuted(!muted);
  const skipForward = () =>
    playerRef.current.seekTo(
      playerRef.current.getCurrentTime() + 10,
      "seconds"
    );
  const skipBackward = () =>
    playerRef.current.seekTo(
      playerRef.current.getCurrentTime() - 10,
      "seconds"
    );

  const handleProgress = (state) => setPlayed(state.playedSeconds);
  const handleDuration = (duration) => setDuration(duration);

  const toggleFullScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle(playerContainerRef.current);
    }
  };

  const speedIcons = {
    0.5: <TbMultiplier05X className="text-background text-3xl" />,
    1: <TbMultiplier1X className="text-background text-3xl" />,
    1.5: <TbMultiplier15X className="text-background text-3xl" />,
    2: <TbMultiplier2X className="text-background text-3xl" />,
  };

  useEffect(() => {
    if (screenfull.isEnabled) {
      const handleFullscreenChange = () => {
        setIsFullScreen(screenfull.isFullscreen);
      };
      screenfull.on("change", handleFullscreenChange);
      return () => {
        screenfull.off("change", handleFullscreenChange);
      };
    }
  }, []);

  // Auto-hide controls after 5 seconds of play/pause
  useEffect(() => {
    if (playing) {
      const timer = setTimeout(() => setControlsVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [playing]);

  const handleKeyboardEvents = (event) => {
    switch (event.key) {
      case "m":
        setMuted((prevMuted) => !prevMuted);
        break;
      case " ":
        event.preventDefault();
        setPlaying((prevPlaying) => !prevPlaying);
        setControlsVisible(true);
        break;
      case "f":
        // Full-Screen
        toggleFullScreen();
        break;
      case "ArrowLeft":
        // Left Arrow: Skip Backward
        skipBackward();
        break;
      case "ArrowRight":
        // Right Arrow: Skip Forward
        skipForward();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyboardEvents);
    return () => {
      // Clean up event listener on component unmount
      window.removeEventListener("keydown", handleKeyboardEvents);
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Handle click on the center of the video to make controls visible again
  const handleCenterClick = () => {
    setControlsVisible(true);
    // Reset the timeout to hide controls again after 5 seconds
    if (playing) {
      const timer = setTimeout(() => setControlsVisible(false), 1000);
      return () => clearTimeout(timer);
    }
  };

  const handlePlaybackSpeedChange = () => {
    const speeds = [0.5, 1, 1.5, 2]; // Available speeds
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length]; // Cycle through speeds
    setPlaybackSpeed(nextSpeed);
  };

  return (
    <div
      ref={playerContainerRef}
      className={`relative flex flex-col items-center bg-tertiary rounded-lg shadow-lg w-[60%] mx-auto mt-10 ${
        isFullScreen ? "fixed inset-0 w-full h-full z-10 bg-black" : ""
      }`}
      onClick={handleCenterClick}
    >
      <div className="absolute top-4 left-4 text-background font-highlight font-bold text-lg">
        Shree Kalam Academy
      </div>
      {/* Playback Speed Button (Top Right) */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handlePlaybackSpeedChange}
          className="p-2 rounded-full hover:bg-tertiary transition text-background text-3xl z-100"
        >
          {speedIcons[playbackSpeed]}
        </button>
      </div>
      ;{/* Video Player */}
      <ReactPlayer
        ref={playerRef}
        url={videoSrc}
        playing={playing}
        muted={muted}
        controls={false}
        playbackRate={playbackSpeed}
        onProgress={handleProgress}
        onDuration={handleDuration}
        width="560"
        height="315" // Ensures video maintains aspect ratio
        style={{ maxHeight: isFullScreen ? "100%" : "500px" }} // Full height in fullscreen mode
      />
      {/* Controls */}
      <div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-4 transition-opacity duration-500 ${
          controlsVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Skip Backward Button */}
        <button
          onClick={skipBackward}
          className="p-3 rounded-full hover:-translate-x-1 transition"
        >
          <PiCaretDoubleLeftBold className="text-background text-xl" />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="bg-accent p-4 rounded-full hover:bg-secondary transition"
        >
          {playing ? (
            <FaPause className="text-background text-2xl" />
          ) : (
            <FaPlay className="text-background text-2xl" />
          )}
        </button>

        {/* Skip Forward Button */}
        <button
          onClick={skipForward}
          className="p-3 rounded-full hover:translate-x-1 transition"
        >
          <PiCaretDoubleRightBold className="text-background text-xl" />
        </button>
      </div>
      {/* Mute and Full-Screen Controls */}
      <div className="absolute bottom-3 flex items-center justify-between w-full px-6">
        {/* Mute Button (Left) */}
        <button
          onClick={toggleMute}
          className="p-3 rounded-full hover:bg-gray-600 transition"
        >
          {muted ? (
            <FaVolumeMute className="text-background text-xl" />
          ) : (
            <FaVolumeUp className="text-background text-xl" />
          )}
        </button>

        {/* Full-Screen Button (Right) */}
        <button
          onClick={toggleFullScreen}
          className="p-3 rounded-full hover:bg-gray-600 transition"
        >
          {isFullScreen ? (
            <FaCompress className="text-background text-xl" />
          ) : (
            <FaExpand className="text-background text-xl" />
          )}
        </button>
      </div>
      {/* Progress Bar */}
      <div className="w-full absolute bottom-[70px] px-6">
        <div className="flex justify-between text-background text-sm">
          <span>{formatTime(played)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <div className="relative w-full h-[3px] bg-tertiary  rounded-full">
          <div
            className="absolute top-0 left-0 h-full bg-tertiary rounded-full"
            style={{ width: `${(played / duration) * 100}%` }}
          ></div>
          <input
            type="range"
            min={0}
            max={duration}
            value={played}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value);
              playerRef.current.seekTo(newValue, "seconds");
            }}
            className="absolute top-0 left-0 w-full h-[6px] bg-transparent rounded-full appearance-none cursor-pointer z-20"
            style={{
              appearance: "none",
              background: "transparent",
            }}
            // To ensure it doesn't exceed the played time
            step="any"
          />
          <div
            className="absolute top-0 left-0 h-full bg-accent rounded-full z-10"
            style={{ width: `${(played / duration) * 100}%` }}
          ></div>
        </div>

        <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            background-color: hsl(41, 100%, 62%);
            border-radius: 50%;
            cursor: pointer;
            z-index: 10;
            transition: background-color 0.3s ease;
          }

          input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            background-color: hsl(41, 100%, 62%);
            border-radius: 50%;
            cursor: pointer;
            z-index: 10;
          }
        `}</style>
      </div>
    </div>
  );
};

export default VideoPlayer;
