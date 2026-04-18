export type ScreenType = "imax" | "4dx" | "normal";
export type ScreenFormat = "2D" | "3D" | "IMAX 2D" | "IMAX 3D" | "4DX" | "4DX 3D";

export interface Screening {
  id: string;
  title: string;
  type: "cinema" | "anime";
  date: string;
  time: string;
  venue: string;
  venueId: string;
  venueFull: string;
  audiId: string;
  audiName: string;
  screenType: ScreenType;
  format: ScreenFormat;
  image: string;
  description: string;
  director: string;
  duration: string;
  language: string;
  price: number;
  status: "upcoming" | "past";
  seatsTotal: number;
  seatsBooked: number;
  themeColor?: string;
  themeGradient?: string;
  posterUrl?: string;
}

export interface CinemaEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  community: "Cinema EZ" | "Anime EZ" | "Both";
  type: "meetup" | "cosplay" | "screening" | "workshop" | "festival";
  image: string;
  attendees: number;
  maxAttendees: number;
}

export const AHMEDABAD_CINEMAS = [
  "All Cinemas",
  "PVR Palladium Mall & IMAX",
  "PVR Acropolis",
  "Cinepolis Nexus",
  "Miraj City Pulse",
  "Havelock",
  "Connplex Shilaj",
  "Narol",
  "Prahladnagar",
  "SBR",
] as const;

export const mockScreenings: Screening[] = [
  {
    id: "1",
    title: "Interstellar",
    type: "cinema",
    date: "2026-05-10",
    time: "7:00 PM",
    venue: "PVR Palladium Mall & IMAX",
    venueId: "palladium-pvr",
    venueFull: "PVR Palladium Mall & IMAX, Paldi, Ahmedabad",
    audiId: "palladium-audi-9",
    audiName: "IMAX 2D (Audi 9)",
    screenType: "imax",
    format: "IMAX 2D",
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80",
    description: "Experience Nolan's masterpiece on the biggest screen in Ahmedabad. A journey through space and time.",
    director: "Christopher Nolan",
    duration: "2h 49min",
    language: "English",
    price: 490,
    status: "upcoming",
    seatsTotal: 180,
    seatsBooked: 67,
  },
  {
    id: "2",
    title: "Your Name (Kimi no Na wa)",
    type: "anime",
    date: "2026-05-14",
    time: "6:30 PM",
    venue: "PVR Palladium Mall & IMAX",
    venueId: "palladium-pvr",
    venueFull: "PVR Palladium Mall & IMAX, Paldi, Ahmedabad",
    audiId: "palladium-audi-3",
    audiName: "Audi 3",
    screenType: "normal",
    format: "2D",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80",
    description: "Makoto Shinkai's breathtaking love story across time. Japanese audio with English subtitles.",
    director: "Makoto Shinkai",
    duration: "1h 52min",
    language: "Japanese (Eng Sub)",
    price: 250,
    status: "upcoming",
    seatsTotal: 150,
    seatsBooked: 112,
  },
  {
    id: "3",
    title: "The Dark Knight",
    type: "cinema",
    date: "2026-05-20",
    time: "8:00 PM",
    venue: "PVR Palladium Mall & IMAX",
    venueId: "palladium-pvr",
    venueFull: "PVR Palladium Mall & IMAX, Paldi, Ahmedabad",
    audiId: "palladium-audi-4",
    audiName: "Audi 4",
    screenType: "normal",
    format: "2D",
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=600&q=80",
    description: "Heath Ledger's iconic Joker on the big screen. A cinema experience not to be missed.",
    director: "Christopher Nolan",
    duration: "2h 32min",
    language: "English",
    price: 270,
    status: "upcoming",
    seatsTotal: 200,
    seatsBooked: 45,
  },
  {
    id: "4",
    title: "Spirited Away",
    type: "anime",
    date: "2026-05-25",
    time: "5:00 PM",
    venue: "PVR Palladium Mall & IMAX",
    venueId: "palladium-pvr",
    venueFull: "PVR Palladium Mall & IMAX, Paldi, Ahmedabad",
    audiId: "palladium-audi-7",
    audiName: "Audi 7",
    screenType: "normal",
    format: "2D",
    image: "https://images.unsplash.com/photo-1607604276583-3eabe4f46cfc?w=600&q=80",
    description: "Studio Ghibli's Oscar-winning masterpiece by Hayao Miyazaki. A magical adventure.",
    director: "Hayao Miyazaki",
    duration: "2h 5min",
    language: "Japanese (Eng Sub)",
    price: 300,
    status: "upcoming",
    seatsTotal: 120,
    seatsBooked: 98,
  },
  {
    id: "5",
    title: "Oppenheimer",
    type: "cinema",
    date: "2026-04-01",
    time: "7:30 PM",
    venue: "PVR Palladium Mall & IMAX",
    venueId: "palladium-pvr",
    venueFull: "PVR Palladium Mall & IMAX, Paldi, Ahmedabad",
    audiId: "palladium-audi-9",
    audiName: "IMAX 2D (Audi 9)",
    screenType: "imax",
    format: "IMAX 2D",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&q=80",
    description: "Nolan's biographical epic about J. Robert Oppenheimer. An intense cinematic experience.",
    director: "Christopher Nolan",
    duration: "3h 0min",
    language: "English",
    price: 750,
    status: "past",
    seatsTotal: 180,
    seatsBooked: 175,
  },
  {
    id: "6",
    title: "Demon Slayer: Mugen Train",
    type: "anime",
    date: "2026-03-15",
    time: "6:00 PM",
    venue: "PVR Palladium Mall & IMAX",
    venueId: "palladium-pvr",
    venueFull: "PVR Palladium Mall & IMAX, Paldi, Ahmedabad",
    audiId: "palladium-audi-5",
    audiName: "Audi 5",
    screenType: "normal",
    format: "2D",
    image: "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=600&q=80",
    description: "The record-breaking anime film. Tanjiro and the Hashira face a new threat aboard the Mugen Train.",
    director: "Haruo Sotozaki",
    duration: "1h 57min",
    language: "Japanese (Eng Sub)",
    price: 149,
    status: "past",
    seatsTotal: 150,
    seatsBooked: 148,
  },
];

export const mockEvents: CinemaEvent[] = [
  {
    id: "e1",
    title: "Sunday Film Discussion: Nolan's Filmography",
    description: "Join us for a deep dive into Christopher Nolan's films — from Memento to Oppenheimer. Share your theories, debate your favourites, and connect with fellow cinephiles over chai.",
    date: "2026-05-11",
    time: "4:00 PM",
    location: "Café EZ, CG Road, Ahmedabad",
    community: "Cinema EZ",
    type: "meetup",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
    attendees: 32,
    maxAttendees: 50,
  },
  {
    id: "e2",
    title: "Cosplay Meetup — Anime Edition",
    description: "Dress as your favourite anime character! Prizes for Best Costume, Most Creative, and Fan Favourite. Photo booth available. Open to all skill levels.",
    date: "2026-05-18",
    time: "11:00 AM",
    location: "Riverfront Event Centre, Ahmedabad",
    community: "Anime EZ",
    type: "cosplay",
    image: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=600&q=80",
    attendees: 55,
    maxAttendees: 80,
  },
  {
    id: "e3",
    title: "Attack on Titan: Final Season Watch Party",
    description: "Witness the epic finale together on the big screen. Themed snacks and merchandise available. Cosplay encouraged!",
    date: "2026-05-24",
    time: "6:00 PM",
    location: "Cinepolis, SG Highway, Ahmedabad",
    community: "Anime EZ",
    type: "screening",
    image: "https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?w=600&q=80",
    attendees: 40,
    maxAttendees: 60,
  },
  {
    id: "e4",
    title: "Film Photography Workshop",
    description: "Learn the art of film photography with local cinematographer Arjun Mehta. Bring your own camera or borrow one from the community.",
    date: "2026-06-01",
    time: "10:00 AM",
    location: "Heritage Walk Studio, Old City, Ahmedabad",
    community: "Cinema EZ",
    type: "workshop",
    image: "https://images.unsplash.com/photo-1495745966610-2a67f2297e5e?w=600&q=80",
    attendees: 15,
    maxAttendees: 25,
  },
  {
    id: "e5",
    title: "EZ Community Fest — Cinema x Anime",
    description: "Our biggest event! Live screenings, cosplay contest, film quiz, anime trivia, food stalls, and merch corner. Bringing both communities together.",
    date: "2026-06-15",
    time: "10:00 AM",
    location: "The Grand Bhagwati, SG Highway, Ahmedabad",
    community: "Both",
    type: "festival",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
    attendees: 70,
    maxAttendees: 200,
  },
];
