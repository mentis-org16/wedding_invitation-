import { useEffect, useState } from "react";
import { hosts, invitation, rsvpNames, sections } from "../data/invitation";

type InvitationPanelsProps = {
  activeIndex: number;
  onJump: (index: number) => void;
};

const eventStart = new Date(invitation.eventStartIso).getTime();
const backgroundImages = [
  { src: "/decor/arch.webp", className: "bg-hero" },
  { src: "/decor/paper-embossed.webp", className: "bg-day" },
  { src: "/decor/linen-florals.webp", className: "bg-venue" },
  { src: "/decor/paper-embossed.webp", className: "bg-rsvp" },
];

function CouplePanel() {
  const brideName = invitation.brideDisplay;
  const hyphenatedSurname = "Sibt-e-Hassan";
  const surnameIndex = brideName.indexOf(hyphenatedSurname);
  return (
    <>
      <p className="arabic" lang="ar" dir="rtl">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>
      <p className="family-note">Together with their families</p>
      <h1 className="names groom-name">{invitation.groom}</h1>
      <span className="script ampersand" aria-hidden="true">&amp;</span>
      <h2 className="names bride-name">
        {brideName.slice(0, surnameIndex)}
        <span className="name-no-break">{hyphenatedSurname}</span>
        {brideName.slice(surnameIndex + hyphenatedSurname.length)}
      </h2>
      <p className="invitation-copy">warmly invite you to celebrate the occasion of their</p>
      <p className="event-type">{invitation.eventType}</p>
      <span className="ornament-rule" aria-hidden="true"><i /></span>
    </>
  );
}

type CountdownValues = { done: boolean; days: number; hours: number; minutes: number; seconds: number };

function getCountdown(): CountdownValues {
  const remaining = eventStart - Date.now();
  if (remaining <= 0) return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    done: false,
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor(remaining / 3_600_000) % 24,
    minutes: Math.floor(remaining / 60_000) % 60,
    seconds: Math.floor(remaining / 1_000) % 60,
  };
}

function Countdown() {
  const [countdown, setCountdown] = useState(getCountdown);

  useEffect(() => {
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1_000);
    return () => window.clearInterval(timer);
  }, []);

  if (countdown.done) {
    return <p className="countdown-complete">Alhamdulillah, the day has arrived.</p>;
  }

  const values = [
    { value: countdown.days, label: "Days" },
    { value: countdown.hours, label: "Hours" },
    { value: countdown.minutes, label: "Minutes" },
    { value: countdown.seconds, label: "Seconds" },
  ];

  return (
    <div
      className="countdown"
      role="timer"
      aria-label={`${countdown.days} days, ${countdown.hours} hours and ${countdown.minutes} minutes until the Walima on ${invitation.date.display} at ${invitation.dinnerTime}`}
    >
      {values.map(({ value, label }) => (
        <div className="countdown-item" key={label}>
          <span className="countdown-number">{String(value).padStart(2, "0")}</span>
          <span className="eyebrow countdown-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

function DayPanel() {
  return (
    <>
      <div className="keepsake keepsake-gajras" aria-hidden="true">
        <img src="/decor/gajras.webp" alt="" width="132" height="103" draggable={false} />
      </div>
      <p className="eyebrow orn">Save the evening</p>
      <div className="date-line" aria-label={invitation.date.display}>
        <span className="date-weekday">{invitation.date.weekday}</span>
        <span className="date-day">{invitation.date.day}</span>
        <span className="date-month">{invitation.date.month}</span>
      </div>
      <p className="date-year">{invitation.date.year}</p>
      <p className="date-time"><span>{invitation.dinnerLabel}</span><strong>{invitation.dinnerTime}</strong></p>
      <div className="date-script script">Until we celebrate together</div>
      <Countdown />
    </>
  );
}

function PinIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21.5S5 15.2 5 9.8a7 7 0 1 1 14 0c0 5.4-7 11.7-7 11.7Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="9.8" r="2.7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function VenuePanel() {
  return (
    <>
      <div className="venue-pin-wrap" aria-hidden="true"><span className="venue-pin-pulse" /><span className="venue-pin"><PinIcon /></span></div>
      <p className="eyebrow orn venue-eyebrow">The Venue</p>
      <a className="venue-title-link" href={invitation.mapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${invitation.venue} in Google Maps`}>
        <h2 className="venue-title">{invitation.venue}</h2>
      </a>
      <address className="venue-address">
        <a href={invitation.mapsUrl} target="_blank" rel="noopener noreferrer">{invitation.address}</a>
      </address>
      <a className="btn btn-primary venue-map-button" href={invitation.mapsUrl} target="_blank" rel="noopener noreferrer">
        <PinIcon />
        <span>Open in Google Maps</span>
      </a>
    </>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function RsvpPanel() {
  return (
    <>
      <div className="keepsake keepsake-bow" aria-hidden="true">
        <img src="/decor/bow.webp" alt="" width="78" height="70" draggable={false} />
      </div>
      <p className="eyebrow orn rsvp-eyebrow">With joy</p>
      <h2 className="script rsvp-title">RSVP</h2>
      <p className="rsvp-note">We look forward to celebrating this blessed day with you.</p>
      <ul className="rsvp-names" aria-label="RSVP names">
        {rsvpNames.map((name) => <li key={name}>{name}</li>)}
      </ul>
      <div className="hosts">
        <p className="eyebrow orn hosts-title">Looking Forward</p>
        <ul className="hosts-list">
          {hosts.map((host) => (
            <li className="host" key={host.name}>
              <span className="host-name">{host.name}</span>
              <a className="host-phone" href={host.tel}>{host.displayPhone}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="btn-row rsvp-actions">
        <a className="btn btn-primary" href="/walima.ics" download="walima-invitation.ics">
          <CalendarIcon />
          <span>Add to Calendar</span>
        </a>
      </div>
      <p className="rsvp-signoff script">With love · the families</p>
    </>
  );
}

export function InvitationPanels({ activeIndex, onJump }: InvitationPanelsProps) {
  return (
    <>
      <div className="backgrounds" aria-hidden="true">
        {backgroundImages.map(({ src, className }, index) => (
          <div
            key={src + className}
            className={`bg-layer ${className}${index === activeIndex ? " is-live" : ""}`}
            style={{ backgroundImage: `url("${src}")` }}
          />
        ))}
      </div>
      {sections.map((section, index) => {
        const active = index === activeIndex;
        const position = index < activeIndex ? "screen--before" : "screen--after";
        const panelClass = ["hero", "day", "venue", "rsvp"][index];
        return (
          <section
            className={`screen ${active ? "screen--active" : position}`}
            key={section}
            aria-label={section}
            aria-hidden={!active}
            inert={!active}
          >
            <div className={`screen-inner ${panelClass}`}>
              {index === 0 && <CouplePanel />}
              {index === 1 && <DayPanel />}
              {index === 2 && <VenuePanel />}
              {index === 3 && <RsvpPanel />}
            </div>
          </section>
        );
      })}
      <nav className="dots" aria-label="Invitation sections">
        {sections.map((section, index) => (
          <button
            key={section}
            type="button"
            className={`dot${index === activeIndex ? " active" : ""}`}
            aria-label={`Go to ${section}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => onJump(index)}
          />
        ))}
      </nav>
      <div className="hint" aria-hidden="true">
        <span>Scroll to explore</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </>
  );
}
