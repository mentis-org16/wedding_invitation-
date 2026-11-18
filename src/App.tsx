import { useCallback, useEffect, useRef, useState } from "react";
import { EnvelopeIntro } from "./components/EnvelopeIntro";
import { InvitationPanels } from "./components/InvitationPanels";
import { MusicDock } from "./components/MusicDock";
import { sections } from "./data/invitation";

type PetalStyle = React.CSSProperties & {
  "--petal-delay": string;
  "--petal-duration": string;
  "--petal-rotation": string;
};

const petalSpecs = [
  [4, 0.1, 8.4, -28], [13, 0.8, 9.3, 18], [22, 0.3, 7.8, -42],
  [31, 1.1, 10.2, 36], [43, 0.5, 8.9, 12], [54, 1.5, 9.7, -18],
  [64, 0.2, 8.2, 44], [74, 0.9, 10.5, -32], [84, 0.4, 8.7, 25],
  [93, 1.3, 9.6, -12], [37, 1.7, 10.7, 52], [70, 1.8, 9.1, -55],
] as const;

function readDevelopmentPanel(): number | null {
  if (!import.meta.env.DEV) return null;
  const requested = new URLSearchParams(window.location.search).get("panel");
  const panelIndexes: Record<string, number> = { couple: 0, day: 1, venue: 2, rsvp: 3 };
  return requested ? panelIndexes[requested] ?? null : null;
}

const developmentPanelIndex = readDevelopmentPanel();

function readSoundPreference() {
  try {
    return window.localStorage.getItem("walima-sound") !== "off";
  } catch {
    return true;
  }
}

function PetalReveal({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 12_700);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="petals" aria-hidden="true">
      {petalSpecs.map(([left, delay, duration, rotation], index) => {
        const style: PetalStyle = {
          left: `${left}%`,
          "--petal-delay": `${delay}s`,
          "--petal-duration": `${duration}s`,
          "--petal-rotation": `${rotation}deg`,
        };
        return (
          <img
            key={`${left}-${index}`}
            className="petal"
            src={`/decor/petal-${(index % 3) + 1}.webp`}
            alt=""
            style={style}
            draggable={false}
          />
        );
      })}
    </div>
  );
}

function RotateNote() {
  return (
    <div className="rotate-note" aria-hidden="true">
      <span className="rotate-icon">↻</span>
      <p>A moment, please</p>
      <span>Turn your screen upright to enjoy the invitation</span>
    </div>
  );
}

export function App() {
  const [opened, setOpened] = useState(developmentPanelIndex !== null);
  const [activeIndex, setActiveIndex] = useState(developmentPanelIndex ?? 0);
  const [soundOn, setSoundOn] = useState(() => developmentPanelIndex === null && readSoundPreference());
  const [showPetals, setShowPetals] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimer = useRef<number | undefined>(undefined);
  const navigationLock = useRef(false);
  const navigationTimer = useRef<number | undefined>(undefined);
  const wheelTotal = useRef(0);
  const wheelLastAt = useRef(0);
  const pointerStart = useRef<{ x: number; y: number; type: string } | null>(null);

  const fadeAudio = useCallback((target: number, duration: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeTimer.current !== undefined) window.clearInterval(fadeTimer.current);
    const initial = audio.volume;
    const started = performance.now();
    fadeTimer.current = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - started) / duration);
      audio.volume = Math.max(0, Math.min(1, initial + (target - initial) * progress));
      if (progress >= 1) {
        if (fadeTimer.current !== undefined) window.clearInterval(fadeTimer.current);
        fadeTimer.current = undefined;
        if (target === 0) audio.pause();
      }
    }, 60);
  }, []);

  const startAudio = useCallback(() => {
    if (!soundOn) return;
    const audio = audioRef.current ?? new Audio("/ambience.mp3");
    audioRef.current = audio;
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audio.play().then(() => fadeAudio(0.35, 2_800)).catch(() => {
      // The visible music control remains available for a browser-blocked playback attempt.
    });
  }, [fadeAudio, soundOn]);

  const stopAudio = useCallback(() => {
    fadeAudio(0, 900);
  }, [fadeAudio]);

  useEffect(() => () => {
    if (fadeTimer.current !== undefined) window.clearInterval(fadeTimer.current);
    if (navigationTimer.current !== undefined) window.clearTimeout(navigationTimer.current);
    audioRef.current?.pause();
  }, []);

  const go = useCallback((step: number) => {
    if (!opened || navigationLock.current) return;
    const next = Math.max(0, Math.min(sections.length - 1, activeIndex + step));
    if (next === activeIndex) return;
    navigationLock.current = true;
    setActiveIndex(next);
    if (navigationTimer.current !== undefined) window.clearTimeout(navigationTimer.current);
    navigationTimer.current = window.setTimeout(() => {
      navigationLock.current = false;
      navigationTimer.current = undefined;
    }, 950);
  }, [activeIndex, opened]);

  const jump = useCallback((next: number) => {
    if (!opened || navigationLock.current || next === activeIndex) return;
    navigationLock.current = true;
    setActiveIndex(next);
    if (navigationTimer.current !== undefined) window.clearTimeout(navigationTimer.current);
    navigationTimer.current = window.setTimeout(() => {
      navigationLock.current = false;
      navigationTimer.current = undefined;
    }, 950);
  }, [activeIndex, opened]);

  useEffect(() => {
    if (!opened) return;
    let lastWheelEvent = 0;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const now = performance.now();
      if (now - lastWheelEvent > 280) wheelTotal.current = 0;
      lastWheelEvent = now;
      wheelTotal.current += event.deltaY;
      if (Math.abs(wheelTotal.current) > 60) {
        go(wheelTotal.current > 0 ? 1 : -1);
        wheelTotal.current = 0;
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      const interactive = target instanceof HTMLElement && target.closest("button, a, input, textarea, select");
      if (interactive) return;
      if (["ArrowDown", "PageDown", " ", "Spacebar"].includes(event.key)) {
        event.preventDefault();
        go(1);
      } else if (["ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        go(-1);
      } else if (event.key === "Home") {
        event.preventDefault();
        jump(0);
      } else if (event.key === "End") {
        event.preventDefault();
        jump(sections.length - 1);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      wheelTotal.current = 0;
      wheelLastAt.current = 0;
    };
  }, [go, jump, opened]);

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.closest("button, a")) {
      pointerStart.current = null;
      return;
    }
    pointerStart.current = { x: event.clientX, y: event.clientY, type: event.pointerType };
  };

  const onPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    const start = pointerStart.current;
    pointerStart.current = null;
    if (!start || start.type === "mouse" || !opened) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 55) return;
    const forward = Math.abs(dy) >= Math.abs(dx) ? dy < 0 : dx < 0;
    go(forward ? 1 : -1);
  };

  const handleMusicToggle = () => {
    const next = !soundOn;
    setSoundOn(next);
    try {
      window.localStorage.setItem("walima-sound", next ? "on" : "off");
    } catch {
      // Storage can be unavailable in private or embedded browser contexts.
    }
    if (next) startAudio();
    else fadeAudio(0, 500);
  };

  const handleOpen = () => {
    setActiveIndex(0);
    setOpened(true);
    setShowPetals(true);
  };

  const handleReseal = () => {
    stopAudio();
    navigationLock.current = false;
    setActiveIndex(0);
    setOpened(false);
    setShowPetals(false);
  };

  return (
    <main
      className={`stage${opened ? " is-live" : ""}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { pointerStart.current = null; }}
    >
      <InvitationPanels activeIndex={activeIndex} onJump={jump} />
      {opened && <MusicDock soundOn={soundOn} onToggleSound={handleMusicToggle} onReseal={handleReseal} />}
      {opened && showPetals && <PetalReveal onComplete={() => setShowPetals(false)} />}
      {!opened && <EnvelopeIntro onStart={startAudio} onOpen={handleOpen} />}
      <RotateNote />
    </main>
  );
}
