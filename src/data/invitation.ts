export const invitation = {
  eventType: "WALIMA",
  groom: "Mobeen Khalid Sherazi",
  brideDisplay: "Daughter of Syed Sibt-e-Hassan Raza",
  date: {
    weekday: "Sunday",
    day: "29",
    month: "November",
    year: "2026",
    display: "Sunday, 29 November 2026",
  },
  dinnerLabel: "Dinner",
  dinnerTime: "8:00 PM",
  eventStartIso: "2026-11-29T20:00:00+05:00",
  timeZone: "Asia/Karachi",
  venue: "The Mark Suites & Banquet Halls",
  address: "01, Club Road, Near Rawal Dam, Islamabad, Pakistan.",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=The+Mark+Suites+%26+Banquet+Halls%2C+01+Club+Road%2C+Islamabad%2C+Pakistan",
} as const;

export const hosts = [
  { name: "Syed Tehsin Ali Sherazi", displayPhone: "0302-8567941", tel: "tel:+923028567941" },
  { name: "Syed Aleem Ali Sherazi", displayPhone: "0335-5255275", tel: "tel:+923355255275" },
] as const;

export const rsvpNames = [
  "Muhammad Ghazi Sherazi",
  "Muhammad Ghamaz Sherazi",
  "Kumail Haider Sherazi",
  "Muhammad Batish Sherazi",
] as const;

export const sections = ["The couple", "The day", "The venue", "RSVP"] as const;
