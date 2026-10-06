"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type MemorialAudioProps = {
  videoId: string;
  sectionId: string;
  playLabel: string;
  pauseLabel: string;
};

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (volume: number) => void;
  destroy: () => void;
};

type YTNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      host: string;
      playerVars: Record<string, number | string>;
      events: {
        onReady: () => void;
        onStateChange: (event: { data: number }) => void;
      };
    }
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const TARGET_VOLUME = 55;
const FADE_IN_MS = 5000;
const FADE_OUT_MS = 1500;
const PLAYING = 1;

let apiPromise: Promise<YTNamespace> | null = null;

function loadApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  apiPromise ??= new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT as YTNamespace);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
  return apiPromise;
}

export default function MemorialAudio({
  videoId,
  sectionId,
  playLabel,
  pauseLabel,
}: MemorialAudioProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const readyRef = useRef(false);
  const activatedRef = useRef(false);
  const mutedByUserRef = useRef(false);
  const inViewRef = useRef(false);
  const playingRef = useRef(false);
  const fadeRef = useRef(0);
  const volumeRef = useRef(0);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);

  const fadeTo = useCallback((target: number, duration: number, onDone?: () => void) => {
    cancelAnimationFrame(fadeRef.current);
    const player = playerRef.current;
    if (!player) return;
    const from = volumeRef.current;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      volumeRef.current = from + (target - from) * progress;
      player.setVolume(Math.round(volumeRef.current));
      if (progress < 1) fadeRef.current = requestAnimationFrame(step);
      else onDone?.();
    };
    fadeRef.current = requestAnimationFrame(step);
  }, []);

  const start = useCallback(() => {
    const player = playerRef.current;
    if (!player || !readyRef.current) return;
    volumeRef.current = 0;
    player.setVolume(0);
    player.playVideo();
    fadeTo(TARGET_VOLUME, FADE_IN_MS);
  }, [fadeTo]);

  const stop = useCallback(() => {
    fadeTo(0, FADE_OUT_MS, () => playerRef.current?.pauseVideo());
  }, [fadeTo]);

  useEffect(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some(
          (entry) => entry.isIntersecting || entry.boundingClientRect.bottom < 0
        );
        inViewRef.current = visible;
        setInView(visible);
        if (!visible) stop();
        else if (activatedRef.current && !mutedByUserRef.current) start();
      },
      { threshold: 0, rootMargin: "0px 0px -15% 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [sectionId, start, stop]);

  useEffect(() => {
    const activate = () => {
      activatedRef.current = true;
      if (inViewRef.current && !mutedByUserRef.current && !playingRef.current) start();
    };
    const events = ["pointerdown", "keydown", "touchend"] as const;
    events.forEach((name) => window.addEventListener(name, activate, { once: true }));
    return () => events.forEach((name) => window.removeEventListener(name, activate));
  }, [start]);

  useEffect(() => {
    let cancelled = false;
    loadApi().then((YT) => {
      if (cancelled || !mountRef.current) return;
      playerRef.current = new YT.Player(mountRef.current, {
        videoId,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          controls: 0,
          disablekb: 1,
          playsinline: 1,
          rel: 0,
          loop: 1,
          playlist: videoId,
          origin: window.location.origin,
        },
        events: {
          onReady: () => {
            readyRef.current = true;
            if (inViewRef.current && activatedRef.current && !mutedByUserRef.current) start();
          },
          onStateChange: (event) => {
            playingRef.current = event.data === PLAYING;
            setPlaying(playingRef.current);
          },
        },
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(fadeRef.current);
      playerRef.current?.destroy();
      playerRef.current = null;
      readyRef.current = false;
    };
  }, [videoId, start]);

  const toggle = () => {
    activatedRef.current = true;
    if (playing) {
      mutedByUserRef.current = true;
      stop();
    } else {
      mutedByUserRef.current = false;
      start();
    }
  };

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed -left-[9999px] h-px w-px">
        <div ref={mountRef} />
      </div>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-hidden={!inView}
        tabIndex={inView ? 0 : -1}
        className={`focus-halo fixed bottom-5 left-5 z-50 flex min-h-11 items-center gap-2 rounded-full border border-white/30 bg-[#0d0c0b] px-4 text-sm text-white shadow-lg transition-opacity duration-200 hover:bg-white/10 ${
          inView ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4.5 w-4.5 shrink-0">
          {playing ? (
            <path d="M6 5h2.5v10H6zM11.5 5H14v10h-2.5z" fill="currentColor" />
          ) : (
            <path d="M7 4.5v11l9-5.5z" fill="currentColor" />
          )}
        </svg>
        {playing ? pauseLabel : playLabel}
      </button>
    </>
  );
}
