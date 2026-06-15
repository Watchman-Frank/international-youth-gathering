"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Gauge,
  Captions,
} from "lucide-react";
import { cn, formatDuration } from "@/lib/utils";

interface VideoPlayerProps {
  src?: string;
  youtubeId?: string;
  thumbnailUrl: string;
  title: string;
  onProgressUpdate?: (seconds: number) => void;
  initialProgress?: number;
  captionsSrc?: string;
}

const SPEEDS = [0.5, 1, 1.25, 1.5, 2, 4];

export function VideoPlayer({
  src,
  youtubeId,
  thumbnailUrl,
  title,
  onProgressUpdate,
  initialProgress = 0,
  captionsSrc,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialProgress);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [started, setStarted] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = initialProgress;
  }, [initialProgress]);

  const togglePlay = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (!started) setStarted(true);
    if (vid.paused) {
      vid.play();
      setPlaying(true);
    } else {
      vid.pause();
      setPlaying(false);
    }
    resetHideTimer();
  };

  const skip = (s: number) => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.currentTime = Math.max(0, Math.min(vid.duration, vid.currentTime + s));
    resetHideTimer();
  };

  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid) return;
    setCurrentTime(vid.currentTime);
    onProgressUpdate?.(Math.floor(vid.currentTime));
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vid = videoRef.current;
    if (!vid) return;
    const t = Number(e.target.value);
    vid.currentTime = t;
    setCurrentTime(t);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vid = videoRef.current;
    if (!vid) return;
    const v = Number(e.target.value);
    vid.volume = v;
    setVolume(v);
    setMuted(v === 0);
  };

  const toggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !muted;
    setMuted(!muted);
  };

  const cycleSpeed = () => {
    const next = (speedIdx + 1) % SPEEDS.length;
    setSpeedIdx(next);
    if (videoRef.current) videoRef.current.playbackRate = SPEEDS[next];
    setShowSpeedMenu(false);
  };

  const setSpeed = (idx: number) => {
    setSpeedIdx(idx);
    if (videoRef.current) videoRef.current.playbackRate = SPEEDS[idx];
    setShowSpeedMenu(false);
  };

  const enterFullscreen = () => {
    containerRef.current?.requestFullscreen?.();
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (youtubeId) {
    return (
      <div className="video-player-container w-full aspect-video bg-black rounded-xl overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1${initialProgress > 0 ? `&start=${Math.floor(initialProgress)}` : ""}`}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="video-player-container relative w-full aspect-video bg-black rounded-xl overflow-hidden group"
      onMouseMove={resetHideTimer}
      onTouchStart={resetHideTimer}
      onClick={togglePlay}
    >
      {!started && (
        <div className="absolute inset-0 z-10">
          <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <button
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              aria-label="Play video"
              className="w-16 h-16 rounded-full bg-[#F2B134] flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Play size={28} className="text-[#1B2A4A] ml-1" fill="currentColor" />
            </button>
          </div>
        </div>
      )}

      {src && (
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
          onEnded={() => setPlaying(false)}
          onClick={(e) => e.stopPropagation()}
          crossOrigin="anonymous"
        >
          {captionsSrc && captionsOn && (
            <track kind="captions" src={captionsSrc} default label="English" />
          )}
        </video>
      )}

      {/* Controls overlay */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 transition-opacity duration-300",
          showControls || !playing ? "opacity-100" : "opacity-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress bar */}
        <div className="mb-3 relative h-1.5 group/progress">
          <div className="absolute inset-0 bg-white/30 rounded-full" />
          <div
            className="absolute inset-y-0 left-0 bg-[#F2B134] rounded-full"
            style={{ width: `${progress}%` }}
          />
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.5}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-1.5"
            aria-label="Seek video"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className="text-white hover:text-[#F2B134] transition-colors">
            {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
          </button>

          {/* Skip */}
          <button onClick={() => skip(-10)} aria-label="Rewind 10 seconds" className="text-white hover:text-[#F2B134] transition-colors">
            <RotateCcw size={18} />
          </button>
          <button onClick={() => skip(10)} aria-label="Forward 10 seconds" className="text-white hover:text-[#F2B134] transition-colors">
            <RotateCw size={18} />
          </button>

          {/* Time */}
          <span className="text-white text-xs tabular-nums">
            {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}
          </span>

          <div className="flex-1" />

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className="text-white hover:text-[#F2B134] transition-colors">
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 accent-[#F2B134]"
              aria-label="Volume"
            />
          </div>

          {/* Captions */}
          {captionsSrc && (
            <button
              onClick={() => setCaptionsOn(!captionsOn)}
              aria-label={captionsOn ? "Hide captions" : "Show captions"}
              aria-pressed={captionsOn}
              className={cn("transition-colors", captionsOn ? "text-[#F2B134]" : "text-white hover:text-[#F2B134]")}
            >
              <Captions size={18} />
            </button>
          )}

          {/* Speed */}
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              aria-label="Playback speed"
              className="text-white hover:text-[#F2B134] transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <Gauge size={16} />
              {SPEEDS[speedIdx]}x
            </button>
            {showSpeedMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg overflow-hidden py-1 min-w-[80px]">
                {SPEEDS.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(i)}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-xs text-white hover:bg-white/10 transition-colors",
                      speedIdx === i && "text-[#F2B134]"
                    )}
                  >
                    {s}x {speedIdx === i && "✓"}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button onClick={enterFullscreen} aria-label="Enter fullscreen" className="text-white hover:text-[#F2B134] transition-colors">
            <Maximize size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
