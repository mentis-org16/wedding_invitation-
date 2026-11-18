type MusicDockProps = {
  soundOn: boolean;
  onToggleSound: () => void;
  onReseal: () => void;
};

export function MusicDock({ soundOn, onToggleSound, onReseal }: MusicDockProps) {
  return (
    <div className="dock" aria-label="Invitation controls">
      <button
        className="dock-btn"
        type="button"
        onClick={onReseal}
        aria-label="Reseal the envelope and start again"
        title="Reseal the envelope"
      >
        <img src="/decor/wax-seal.webp" alt="" width="23" height="28" draggable={false} />
      </button>
      <span className="dock-sep" aria-hidden="true" />
      <button
        className={`dock-btn${soundOn ? "" : " dock-muted"}`}
        type="button"
        onClick={onToggleSound}
        aria-label={soundOn ? "Turn music off" : "Turn music on"}
        aria-pressed={soundOn}
        title={soundOn ? "Music on" : "Music off"}
      >
        <span className={`dock-bars${soundOn ? " on" : ""}`} aria-hidden="true">
          {[0, 1, 2, 3].map((bar) => (
            <span key={bar} style={{ animationDuration: `${0.55 + bar * 0.085}s`, animationDelay: `${-bar * 0.23}s` }} />
          ))}
        </span>
      </button>
    </div>
  );
}
