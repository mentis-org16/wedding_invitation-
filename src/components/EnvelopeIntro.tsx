import { useEffect, useRef, useState } from "react";
import { invitation } from "../data/invitation";

type EnvelopeIntroProps = {
  onStart: () => void;
  onOpen: () => void;
};

export function EnvelopeIntro({ onStart, onOpen }: EnvelopeIntroProps) {
  const [opening, setOpening] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const openInvitation = () => {
    if (opening) return;
    setOpening(true);
    onStart();
    timers.current.push(
      window.setTimeout(() => setLeaving(true), 1_250),
      window.setTimeout(onOpen, 1_760),
    );
  };

  return (
    <div className={`env-scene${opening ? " is-opening" : ""}${leaving ? " is-leaving" : ""}`}>
      <div className="env-paper-grain" aria-hidden="true" />
      <p className="env-kicker">
        You are invited
        <span className="env-sub">to the Walima of {invitation.groom}</span>
      </p>

      <div className="env-wrap">
        <div className="env-visual">
          <div className="env-back" aria-hidden="true">
            <div className="env-liner" />
            <div className="env-card-preview">
              <span className="eyebrow">The Walima of</span>
              <span className="names">{invitation.groom}</span>
              <span className="env-preview-date">{invitation.date.display}</span>
            </div>
            <div className="env-top-liner" />
            <div className="env-flap" />
            <div className="env-side env-side-left" />
            <div className="env-side env-side-right" />
            <div className="env-bottom-flap" />
            <div className="env-seal">
              <button
                type="button"
                className="seal-btn"
                onClick={openInvitation}
                disabled={opening}
                aria-label="Break the seal and open the invitation"
              >
                <img src="/decor/wax-seal.webp" alt="" draggable={false} />
                {!opening && <span className="seal-halo" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <img className="env-silk" src="/decor/silk.webp" alt="" aria-hidden="true" draggable={false} />
      <p className="env-hint">Tap the seal to open</p>
    </div>
  );
}
