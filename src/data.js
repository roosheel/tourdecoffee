// Starting point: Apple Store, 5th Ave
export const START_COORDS = [40.7638, -73.9722];

// Run data with routes for the Journal/Map sections
export const runs = [
  {
    id: 1,
    date: "Feb 14, 2026",
    name: "Devoción",
    hood: "Flatiron",
    distance: 4.1,
    stars: 5,
    note: "The cortado here changed lives. We may never recover.",
    shopCoords: [40.741, -73.9897],
    route: [[40.7638,-73.9722],[40.7628,-73.9735],[40.7601,-73.9759],[40.757,-73.9785],[40.754,-73.981],[40.751,-73.9835],[40.748,-73.9855],[40.745,-73.987],[40.742,-73.9885],[40.741,-73.9897]],
    photos: 6,
  },
  {
    id: 2,
    date: "Feb 12, 2026",
    name: "Abraço",
    hood: "East Village",
    distance: 2.8,
    stars: 4,
    note: "Tiny spot, massive energy. The olive oil cake is not optional.",
    shopCoords: [40.7265, -73.9878],
    route: [[40.7638,-73.9722],[40.761,-73.974],[40.758,-73.976],[40.755,-73.9775],[40.751,-73.98],[40.746,-73.983],[40.74,-73.985],[40.735,-73.986],[40.73,-73.987],[40.7265,-73.9878]],
    photos: 4,
  },
  {
    id: 3,
    date: "Feb 10, 2026",
    name: "Blue Bottle",
    hood: "Midtown",
    distance: 3.2,
    stars: 4,
    note: "Solid pour-over, good vibes. Got a few new runners that morning.",
    shopCoords: [40.7555, -73.978],
    route: [[40.7638,-73.9722],[40.763,-73.973],[40.762,-73.9745],[40.761,-73.9755],[40.7595,-73.9765],[40.758,-73.977],[40.7565,-73.9775],[40.7555,-73.978]],
    photos: 5,
  },
  {
    id: 4,
    date: "Feb 7, 2026",
    name: "Sey Coffee",
    hood: "Bushwick",
    distance: 5.5,
    stars: 5,
    note: "Yes we ran to Brooklyn. Yes it was worth it.",
    shopCoords: [40.7065, -73.9235],
    route: [[40.7638,-73.9722],[40.76,-73.97],[40.756,-73.967],[40.751,-73.964],[40.746,-73.961],[40.74,-73.957],[40.734,-73.953],[40.728,-73.948],[40.721,-73.941],[40.715,-73.935],[40.71,-73.929],[40.7065,-73.9235]],
    photos: 8,
  },
  {
    id: 5,
    date: "Feb 5, 2026",
    name: "La Cabra",
    hood: "SoHo",
    distance: 3,
    stars: 4,
    note: "Scandinavian aesthetics, NYC hustle. Almond croissant mandatory.",
    shopCoords: [40.723, -73.9985],
    route: [[40.7638,-73.9722],[40.761,-73.974],[40.758,-73.976],[40.754,-73.98],[40.749,-73.984],[40.744,-73.988],[40.738,-73.992],[40.732,-73.995],[40.727,-73.9975],[40.723,-73.9985]],
    photos: 5,
  },
  {
    id: 6,
    date: "Feb 3, 2026",
    name: "787 Coffee",
    hood: "Midtown East",
    distance: 2.5,
    stars: 4,
    note: "Puerto Rican-grown beans in Manhattan. Enough said.",
    shopCoords: [40.756, -73.968],
    route: [[40.7638,-73.9722],[40.7625,-73.9715],[40.761,-73.971],[40.7595,-73.9705],[40.758,-73.9695],[40.757,-73.9685],[40.756,-73.968]],
    photos: 3,
  },
  {
    id: 7,
    date: "Jan 31, 2026",
    name: "Café Grumpy",
    hood: "Chelsea",
    distance: 3.8,
    stars: 4,
    note: "The name is a whole mood at 6:30am. Coffee fixed everything.",
    shopCoords: [40.7425, -74.001],
    route: [[40.7638,-73.9722],[40.762,-73.9745],[40.76,-73.977],[40.7575,-73.98],[40.755,-73.984],[40.752,-73.988],[40.749,-73.992],[40.746,-73.996],[40.7425,-74.001]],
    photos: 6,
  },
  {
    id: 8,
    date: "Jan 29, 2026",
    name: "Birch Coffee",
    hood: "Flatiron",
    distance: 3.1,
    stars: 3,
    note: "Reliable. Never flashy, always there for you.",
    shopCoords: [40.7395, -73.9905],
    route: [[40.7638,-73.9722],[40.7615,-73.9745],[40.759,-73.977],[40.756,-73.98],[40.753,-73.983],[40.75,-73.9855],[40.746,-73.9878],[40.743,-73.9895],[40.7395,-73.9905]],
    photos: 4,
  },
];

// Coffee log (simpler format for the list view)
export const coffeeLog = [
  { n: "Devoción", h: "Flatiron", d: 4.1, s: 5, t: "The cortado here changed lives. We may never recover.", dt: "Feb 14" },
  { n: "Abraço", h: "East Village", d: 2.8, s: 4, t: "Tiny spot, massive energy. The olive oil cake is not optional.", dt: "Feb 12" },
  { n: "Blue Bottle", h: "Midtown", d: 3.2, s: 4, t: "Solid pour-over, good vibes. Got a few new runners that morning.", dt: "Feb 10" },
  { n: "Sey Coffee", h: "Bushwick", d: 5.5, s: 5, t: "Yes we ran to Brooklyn. Yes it was worth it.", dt: "Feb 7" },
  { n: "La Cabra", h: "SoHo", d: 3, s: 4, t: "Scandinavian aesthetics, NYC hustle. Almond croissant mandatory.", dt: "Feb 5" },
  { n: "787 Coffee", h: "Midtown East", d: 2.5, s: 4, t: "Puerto Rican-grown beans in Manhattan. Enough said.", dt: "Feb 3" },
  { n: "Café Grumpy", h: "Chelsea", d: 3.8, s: 4, t: "The name is a whole mood at 6:30am. Coffee fixed everything.", dt: "Jan 31" },
  { n: "Birch Coffee", h: "Flatiron", d: 3.1, s: 3, t: "Reliable. Never flashy, always there for you.", dt: "Jan 29" },
];

// Schedule data
export const schedule = [
  { day: "MON", full: "Monday", time: "6:30am", type: "regular" },
  { day: "WED", full: "Wednesday", time: "6:30am", type: "regular" },
  { day: "FRI", full: "Friday", time: "6:30am", type: "regular" },
  { day: "SUN", full: "Select Sundays", time: "varies", type: "theme" },
];

// About stats
export const stats = [
  { num: "3x", label: "per week" },
  { num: "50+", label: "shops hit" },
  { num: "5-20", label: "runners" },
  { num: "6:30", label: "am sharp" },
];

// Marquee text
export const MARQUEE_TOP = "RUN · COFFEE · REPEAT · NYC · 5TH AVE · 6:30AM · ALL PACES · ALL PEOPLE · ";
export const MARQUEE_BOTTOM = "COFFEE SHOPS OF NYC · EVERY RUN A NEW SPOT · LATTE LOVERS WELCOME · NO PACE TOO SLOW · SUNRISE MILES · CROISSANTS MANDATORY · ";

// Map circle radius
export const MAP_RADIUS = 50;
