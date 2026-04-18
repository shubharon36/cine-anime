// Venue and Auditorium data for Ahmedabad cinemas

export type ScreenFormat = "2D" | "3D" | "IMAX 2D" | "IMAX 3D" | "4DX" | "4DX 3D";

export interface SeatSection {
  name: string; // "Recliner", "Prime Plus", "Prime", "Classic"
  price: number;
  rows: AudiRow[];
  color: string; // tailwind text color token
}

export interface AudiRow {
  label: string; // "A", "B", etc.
  // Seat layout: array of segments separated by gaps
  // Each segment is an array of seat numbers (0 = no seat / gap within segment)
  segments: number[][]; // e.g. [[1,2,3,4,5], [6,7,8,9,10,11,12,13], [14,15,16,17,18]]
}

export interface Auditorium {
  id: string;
  name: string; // "Audi 1", "IMAX 2D (Audi 9)"
  format: ScreenFormat;
  sections: SeatSection[];
}

export interface Venue {
  id: string;
  name: string;
  shortName: string;
  address: string;
  auditoriums: Auditorium[];
}

// Helper to create a simple row with evenly distributed segments
function row(label: string, ...segments: number[][]): AudiRow {
  return { label, segments };
}

// Helper to create sequential seats: seats(1, 10) => [1,2,3,4,5,6,7,8,9,10]
function seats(from: number, to: number): number[] {
  const arr: number[] = [];
  for (let i = from; i <= to; i++) arr.push(i);
  return arr;
}

// ─── PVR Palladium Mall & IMAX ───────────────────────────────────────────────

const palladiumAudi9_IMAX: Auditorium = {
  id: "palladium-audi-9",
  name: "IMAX 2D (Audi 9)",
  format: "IMAX 2D",
  sections: [
    {
      name: "Recliner",
      price: 750,
      color: "text-cinema-gold",
      rows: [
        row("M", seats(1, 4), seats(5, 10), seats(11, 16)),
      ],
    },
    {
      name: "Prime Plus",
      price: 540,
      color: "text-anime-cyan",
      rows: [
        row("L", seats(1, 6), seats(7, 16), seats(17, 24)),
        row("K", seats(1, 6), seats(7, 16), seats(17, 25)),
        row("J", seats(1, 5), seats(6, 15), seats(16, 23)),
      ],
    },
    {
      name: "Prime",
      price: 490,
      color: "text-foreground",
      rows: [
        row("H", seats(1, 6), seats(7, 16), seats(17, 24)),
        row("G", seats(1, 6), seats(7, 16), seats(17, 24)),
        row("F", seats(1, 5), seats(6, 15), seats(16, 23)),
        row("E", seats(1, 6), seats(7, 16), seats(17, 24)),
        row("D", seats(1, 3), seats(4, 13), seats(14, 22)),
      ],
    },
    {
      name: "Classic",
      price: 360,
      color: "text-muted-foreground",
      rows: [
        row("C", seats(1, 6), seats(7, 12), seats(13, 22)),
        row("B", seats(1, 6), seats(7, 14), seats(15, 24)),
        row("A", seats(1, 6), seats(7, 15), seats(16, 25)),
      ],
    },
  ],
};

const palladiumAudi3: Auditorium = {
  id: "palladium-audi-3",
  name: "Audi 3",
  format: "2D",
  sections: [
    {
      name: "Recliner",
      price: 570,
      color: "text-cinema-gold",
      rows: [
        row("N", seats(1, 6), seats(7, 12)),
      ],
    },
    {
      name: "Prime Plus",
      price: 360,
      color: "text-anime-cyan",
      rows: [
        row("M", seats(1, 6), seats(7, 16), seats(17, 22)),
        row("L", seats(1, 5), seats(6, 10), seats(11, 18)),
        row("K", seats(1, 3), seats(4, 14)),
        row("J", seats(1, 12), seats(13, 20)),
      ],
    },
    {
      name: "Prime",
      price: 250,
      color: "text-foreground",
      rows: [
        row("H", seats(1, 4), seats(5, 10), seats(11, 16)),
        row("G", seats(1, 7), seats(8, 10), seats(11, 17)),
        row("F", seats(1, 10), seats(11, 18)),
        row("E", seats(1, 4), seats(5, 14), seats(15, 22)),
        row("D", seats(1, 10), seats(11, 18)),
      ],
    },
    {
      name: "Classic",
      price: 220,
      color: "text-muted-foreground",
      rows: [
        row("C", seats(1, 10), seats(11, 20)),
        row("B", seats(1, 8), seats(9, 18)),
        row("A", seats(1, 10), seats(11, 20)),
      ],
    },
  ],
};

const palladiumAudi2: Auditorium = {
  id: "palladium-audi-2",
  name: "Audi 2",
  format: "2D",
  sections: [
    {
      name: "Prime Plus",
      price: 790,
      color: "text-anime-cyan",
      rows: [
        row("G", seats(1, 2), seats(3, 10)),
        row("F", seats(1, 2), seats(3, 7), seats(8, 11), seats(12, 14)),
        row("E", seats(1, 2), seats(3, 6), seats(7, 9), seats(10, 12), seats(13, 14)),
      ],
    },
    {
      name: "Prime",
      price: 670,
      color: "text-foreground",
      rows: [
        row("D", seats(1, 3), seats(4, 8), seats(9, 10)),
        row("C", seats(1, 3), seats(4, 9), seats(10, 11)),
      ],
    },
    {
      name: "Classic",
      price: 570,
      color: "text-muted-foreground",
      rows: [
        row("B", seats(1, 4), seats(5, 8), seats(9, 10)),
        row("A", seats(1, 2), seats(3, 6), seats(7, 9)),
      ],
    },
  ],
};

const palladiumAudi4: Auditorium = {
  id: "palladium-audi-4",
  name: "Audi 4",
  format: "2D",
  sections: [
    {
      name: "Recliner",
      price: 530,
      color: "text-cinema-gold",
      rows: [
        row("O", seats(1, 15)),
      ],
    },
    {
      name: "Prime Plus",
      price: 320,
      color: "text-anime-cyan",
      rows: [
        row("N", seats(1, 9), seats(10, 18)),
        row("M", seats(1, 10), seats(11, 20)),
        row("L", seats(1, 8), seats(9, 18)),
        row("K", seats(1, 10), seats(11, 20)),
        row("J", seats(1, 10), seats(11, 14)),
        row("H", seats(1, 10), seats(11, 18)),
      ],
    },
    {
      name: "Prime",
      price: 270,
      color: "text-foreground",
      rows: [
        row("G", seats(1, 4), seats(5, 10), seats(11, 14)),
        row("F", seats(1, 4), seats(5, 10), seats(11, 14)),
        row("E", seats(1, 11), seats(12, 15)),
        row("D", seats(1, 11), seats(12, 15)),
      ],
    },
    {
      name: "Classic",
      price: 250,
      color: "text-muted-foreground",
      rows: [
        row("C", seats(1, 10), seats(11, 14)),
        row("B", seats(1, 10), seats(11, 14)),
        row("A", seats(1, 10), seats(11, 14)),
      ],
    },
  ],
};

const palladiumAudi7: Auditorium = {
  id: "palladium-audi-7",
  name: "Audi 7",
  format: "2D",
  sections: [
    {
      name: "Recliner",
      price: 590,
      color: "text-cinema-gold",
      rows: [
        row("G", seats(1, 6), seats(7, 8)),
      ],
    },
    {
      name: "Prime Plus",
      price: 350,
      color: "text-anime-cyan",
      rows: [
        row("F", seats(1, 12), seats(13, 16)),
        row("E", seats(1, 3), seats(4, 12), seats(13, 16)),
      ],
    },
    {
      name: "Prime",
      price: 300,
      color: "text-foreground",
      rows: [
        row("D", seats(1, 11)),
        row("C", seats(1, 12)),
      ],
    },
    {
      name: "Classic",
      price: 250,
      color: "text-muted-foreground",
      rows: [
        row("B", seats(1, 12)),
        row("A", seats(1, 12)),
      ],
    },
  ],
};

const palladiumAudi1: Auditorium = {
  id: "palladium-audi-1",
  name: "Audi 1",
  format: "2D",
  sections: [
    {
      name: "Prime Plus",
      price: 690,
      color: "text-anime-cyan",
      rows: [
        row("G", seats(1, 6)),
        row("F", seats(1, 3), seats(4, 7), seats(8, 11)),
        row("E", seats(1, 3), seats(4, 7), seats(8, 10)),
        row("D", seats(1, 3), seats(4, 8), seats(9, 10)),
      ],
    },
    {
      name: "Prime",
      price: 570,
      color: "text-foreground",
      rows: [
        row("C", seats(1, 4), seats(5, 8)),
      ],
    },
    {
      name: "Classic",
      price: 470,
      color: "text-muted-foreground",
      rows: [
        row("B", seats(1, 4), seats(5, 8)),
        row("A", seats(1, 4), seats(5, 8)),
      ],
    },
  ],
};

const palladiumAudi5: Auditorium = {
  id: "palladium-audi-5",
  name: "Audi 5",
  format: "2D",
  sections: [
    {
      name: "Recliner",
      price: 299,
      color: "text-cinema-gold",
      rows: [
        row("N", seats(1, 13)),
      ],
    },
    {
      name: "Prime Plus",
      price: 149,
      color: "text-anime-cyan",
      rows: [
        row("M", seats(1, 6), seats(7, 10)),
        row("L", seats(1, 6), seats(7, 13)),
        row("K", seats(1, 6), seats(7, 13)),
        row("H", seats(1, 9)),
        row("G", seats(1, 3), seats(4, 10), seats(11, 13)),
      ],
    },
    {
      name: "Prime",
      price: 149,
      color: "text-foreground",
      rows: [
        row("F", seats(1, 5), seats(6, 12)),
        row("E", seats(1, 5), seats(6, 13)),
        row("D", seats(1, 6), seats(7, 14)),
      ],
    },
    {
      name: "Classic",
      price: 92,
      color: "text-muted-foreground",
      rows: [
        row("C", seats(1, 6), seats(7, 13)),
        row("B", seats(1, 6), seats(7, 14)),
        row("A", seats(1, 6), seats(7, 13)),
      ],
    },
  ],
};

const palladiumAudi8: Auditorium = {
  id: "palladium-audi-8",
  name: "Audi 8",
  format: "2D",
  sections: [
    {
      name: "Recliner",
      price: 299,
      color: "text-cinema-gold",
      rows: [
        row("H", seats(1, 9)),
      ],
    },
    {
      name: "Prime Plus",
      price: 149,
      color: "text-anime-cyan",
      rows: [
        row("G", seats(1, 3), seats(4, 7), seats(8, 14)),
        row("F", seats(1, 4), seats(5, 11)),
        row("E", seats(1, 8)),
      ],
    },
    {
      name: "Prime",
      price: 149,
      color: "text-foreground",
      rows: [
        row("D", seats(1, 9)),
        row("C", seats(1, 9)),
      ],
    },
    {
      name: "Classic",
      price: 92,
      color: "text-muted-foreground",
      rows: [
        row("B", seats(1, 9)),
        row("A", seats(1, 10)),
      ],
    },
  ],
};

const palladiumAudi6: Auditorium = {
  id: "palladium-audi-6",
  name: "Audi 6",
  format: "2D",
  sections: [
    {
      name: "Recliner",
      price: 299,
      color: "text-cinema-gold",
      rows: [
        row("K", seats(1, 12), seats(13, 14)),
      ],
    },
    {
      name: "Prime Plus",
      price: 149,
      color: "text-anime-cyan",
      rows: [
        row("J", seats(1, 3), seats(4, 11), seats(12, 15)),
        row("H", seats(1, 2), seats(3, 10), seats(11, 15)),
        row("G", seats(1, 4), seats(5, 12), seats(13, 16)),
      ],
    },
    {
      name: "Prime",
      price: 149,
      color: "text-foreground",
      rows: [
        row("F", seats(1, 8), seats(9, 13)),
        row("E", seats(1, 8), seats(9, 14)),
        row("D", seats(1, 9), seats(10, 14)),
      ],
    },
    {
      name: "Classic",
      price: 92,
      color: "text-muted-foreground",
      rows: [
        row("C", seats(1, 7), seats(8, 12)),
        row("B", seats(1, 9), seats(10, 14)),
        row("A", seats(1, 8), seats(9, 13)),
      ],
    },
  ],
};

// ─── PVR Acropolis (Thaltej) ─────────────────────────────────────────────────

// Screen 1 = Audi 1: S(recliner), R-Q(prime plus), P-J(prime), gap, H, G-A(classic)
const acropolisAudi1: Auditorium = {
  id: "acropolis-audi-1",
  name: "Screen 1 (Audi 1)",
  format: "2D",
  sections: [
    {
      name: "Recliner",
      price: 530,
      color: "text-cinema-gold",
      rows: [
        row("S", seats(1, 5), seats(6, 9)),
      ],
    },
    {
      name: "Prime Plus",
      price: 360,
      color: "text-anime-cyan",
      rows: [
        row("R", seats(1, 7), seats(8, 13)),
        row("Q", seats(1, 7), seats(8, 13)),
      ],
    },
    {
      name: "Prime",
      price: 320,
      color: "text-foreground",
      rows: [
        row("P", seats(1, 10), seats(11, 20), seats(21, 23)),
        row("N", seats(1, 10), seats(11, 20), seats(21, 23)),
        row("M", seats(1, 10), seats(11, 20), seats(21, 23)),
        row("L", seats(1, 10), seats(11, 20), seats(21, 23)),
        row("K", seats(1, 10), seats(11, 20), seats(21, 23)),
        row("J", seats(1, 10), seats(11, 20), seats(21, 23)),
        row("H", seats(1, 10), seats(11, 20)),
      ],
    },
    {
      name: "Classic",
      price: 250,
      color: "text-muted-foreground",
      rows: [
        row("G", seats(1, 10), seats(11, 20)),
        row("F", seats(1, 10), seats(11, 20)),
        row("E", seats(1, 10), seats(11, 20)),
        row("D", seats(1, 10), seats(11, 20)),
        row("C", seats(1, 10), seats(11, 20)),
        row("B", seats(1, 10), seats(11, 20)),
        row("A", seats(1, 10), seats(11, 20)),
      ],
    },
  ],
};

// Screen 2 = Audi 2: N(recliner), M-J(prime plus), gap, H-A(prime/classic)
const acropolisAudi2: Auditorium = {
  id: "acropolis-audi-2",
  name: "Screen 2 (Audi 2)",
  format: "2D",
  sections: [
    {
      name: "Recliner",
      price: 530,
      color: "text-cinema-gold",
      rows: [
        row("N", seats(1, 5), seats(6, 9)),
      ],
    },
    {
      name: "Prime Plus",
      price: 360,
      color: "text-anime-cyan",
      rows: [
        row("M", seats(1, 9), seats(10, 17)),
        row("L", seats(1, 9), seats(10, 17)),
        row("K", seats(1, 9), seats(10, 17)),
        row("J", seats(1, 9), seats(10, 15)),
      ],
    },
    {
      name: "Prime",
      price: 320,
      color: "text-foreground",
      rows: [
        row("H", seats(1, 9), seats(10, 13)),
        row("G", seats(1, 9), seats(10, 13)),
        row("F", seats(1, 9), seats(10, 13)),
        row("E", seats(1, 9), seats(10, 13)),
        row("D", seats(1, 9), seats(10, 13)),
      ],
    },
    {
      name: "Classic",
      price: 250,
      color: "text-muted-foreground",
      rows: [
        row("C", seats(1, 9), seats(10, 13)),
        row("B", seats(1, 9), seats(10, 13)),
        row("A", seats(1, 9), seats(10, 13)),
      ],
    },
  ],
};

// Screen 3 = Audi 3: N(recliner), M-J(prime plus), gap, H-A(prime/classic)
const acropolisAudi3: Auditorium = {
  id: "acropolis-audi-3",
  name: "Screen 3 (Audi 3)",
  format: "2D",
  sections: [
    {
      name: "Recliner",
      price: 530,
      color: "text-cinema-gold",
      rows: [
        row("N", seats(1, 4), seats(5, 8)),
      ],
    },
    {
      name: "Prime Plus",
      price: 360,
      color: "text-anime-cyan",
      rows: [
        row("M", seats(1, 8), seats(9, 17)),
        row("L", seats(1, 8), seats(9, 17)),
        row("K", seats(1, 8), seats(9, 17)),
        row("J", seats(1, 6), seats(7, 15)),
      ],
    },
    {
      name: "Prime",
      price: 320,
      color: "text-foreground",
      rows: [
        row("H", seats(1, 4), seats(5, 13)),
        row("G", seats(1, 4), seats(5, 13)),
        row("F", seats(1, 4), seats(5, 13)),
        row("E", seats(1, 4), seats(5, 13)),
        row("D", seats(1, 4), seats(5, 13)),
      ],
    },
    {
      name: "Classic",
      price: 250,
      color: "text-muted-foreground",
      rows: [
        row("C", seats(1, 4), seats(5, 13)),
        row("B", seats(1, 4), seats(5, 13)),
        row("A", seats(1, 4), seats(5, 13)),
      ],
    },
  ],
};

// Screen 4 = Audi 4: U(recliner), T-S(prime plus 15), gap, R-N(prime plus 18-19), gap, M-A(prime/classic 16)
const acropolisAudi4: Auditorium = {
  id: "acropolis-audi-4",
  name: "Screen 4 (Audi 4)",
  format: "2D",
  sections: [
    {
      name: "Recliner",
      price: 530,
      color: "text-cinema-gold",
      rows: [
        row("U", seats(1, 6), seats(7, 10)),
      ],
    },
    {
      name: "Prime Plus",
      price: 360,
      color: "text-anime-cyan",
      rows: [
        row("T", seats(1, 9), seats(10, 15)),
        row("S", seats(1, 9), seats(10, 15)),
        row("R", seats(1, 9), seats(10, 19)),
        row("Q", seats(1, 9), seats(10, 19)),
        row("P", seats(1, 9), seats(10, 19)),
        row("N", seats(1, 9), seats(10, 18)),
      ],
    },
    {
      name: "Prime",
      price: 320,
      color: "text-foreground",
      rows: [
        row("M", seats(1, 9), seats(10, 16)),
        row("L", seats(1, 9), seats(10, 16)),
        row("K", seats(1, 9), seats(10, 16)),
        row("J", seats(1, 9), seats(10, 16)),
        row("H", seats(1, 9), seats(10, 16)),
        row("G", seats(1, 9), seats(10, 16)),
        row("F", seats(1, 9), seats(10, 16)),
        row("E", seats(1, 9), seats(10, 16)),
        row("D", seats(1, 9), seats(10, 16)),
      ],
    },
    {
      name: "Classic",
      price: 250,
      color: "text-muted-foreground",
      rows: [
        row("C", seats(1, 9), seats(10, 16)),
        row("B", seats(1, 9), seats(10, 16)),
        row("A", seats(1, 9), seats(10, 16)),
      ],
    },
  ],
};

// Screen 6 = Audi 6: M(recliner 11), L(prime plus, two segments), K-A(prime/classic, two segments 1-7, 8-14)
const acropolisAudi6: Auditorium = {
  id: "acropolis-audi-6",
  name: "Screen 6 (Audi 6)",
  format: "2D",
  sections: [
    {
      name: "Recliner",
      price: 530,
      color: "text-cinema-gold",
      rows: [
        row("M", seats(1, 11)),
      ],
    },
    {
      name: "Prime Plus",
      price: 360,
      color: "text-anime-cyan",
      rows: [
        row("L", seats(1, 7), seats(8, 14)),
      ],
    },
    {
      name: "Prime",
      price: 320,
      color: "text-foreground",
      rows: [
        row("K", seats(1, 7), seats(8, 14)),
        row("J", seats(1, 7), seats(8, 14)),
        row("H", seats(1, 7), seats(8, 14)),
        row("G", seats(1, 7), seats(8, 14)),
        row("F", seats(1, 7), seats(8, 14)),
        row("E", seats(1, 7), seats(8, 14)),
        row("D", seats(1, 7), seats(8, 14)),
      ],
    },
    {
      name: "Classic",
      price: 250,
      color: "text-muted-foreground",
      rows: [
        row("C", seats(1, 7), seats(8, 14)),
        row("B", seats(1, 7), seats(8, 14)),
        row("A", seats(1, 7), seats(8, 14)),
      ],
    },
  ],
};

// ─── Cinepolis Nexus (SG Highway) ────────────────────────────────────────────

const cinepolisAudi1: Auditorium = {
  id: "cinepolis-audi-1",
  name: "Audi 1",
  format: "2D",
  sections: [
    {
      name: "Premium", price: 290, color: "text-anime-cyan",
      rows: [
        row("J", seats(1, 2), [], seats(13, 18)),
        row("H", seats(1, 10), seats(11, 14)),
        row("G", seats(1, 10), seats(11, 14)),
        row("F", seats(1, 10), seats(11, 14)),
      ],
    },
    {
      name: "Executive", price: 240, color: "text-foreground",
      rows: [
        row("E", seats(1, 10), seats(11, 14)),
        row("D", seats(1, 10), seats(11, 14)),
        row("C", seats(1, 10), seats(11, 14)),
      ],
    },
    {
      name: "Normal", price: 220, color: "text-muted-foreground",
      rows: [
        row("B", seats(1, 4), seats(5, 14), seats(15, 18)),
        row("A", seats(1, 4), seats(5, 14), seats(15, 18)),
      ],
    },
  ],
};

const cinepolisAudi2: Auditorium = {
  id: "cinepolis-audi-2",
  name: "Audi 2",
  format: "2D",
  sections: [
    {
      name: "Premium", price: 270, color: "text-anime-cyan",
      rows: [
        row("H", seats(1, 6), seats(7, 12), seats(13, 19)),
        row("G", seats(1, 6), seats(7, 10), seats(11, 15)),
        row("F", seats(1, 10), seats(11, 15)),
        row("E", seats(1, 10), seats(11, 15)),
      ],
    },
    {
      name: "Executive", price: 180, color: "text-foreground",
      rows: [
        row("D", seats(1, 10), seats(11, 15)),
        row("C", seats(1, 10), seats(11, 15)),
        row("B", seats(1, 10), seats(11, 15)),
      ],
    },
    {
      name: "Normal", price: 170, color: "text-muted-foreground",
      rows: [
        row("A", seats(1, 4), seats(5, 14), seats(15, 19)),
      ],
    },
  ],
};

const cinepolisAudi3: Auditorium = {
  id: "cinepolis-audi-3",
  name: "Audi 3",
  format: "2D",
  sections: [
    {
      name: "Premium", price: 270, color: "text-cinema-gold",
      rows: [
        row("I", seats(1, 2), [], seats(13, 19)),
        row("H", seats(1, 5), seats(6, 15)),
        row("G", seats(1, 5), seats(6, 15)),
        row("F", seats(1, 5), seats(6, 15)),
      ],
    },
    {
      name: "Executive", price: 180, color: "text-foreground",
      rows: [
        row("E", seats(1, 5), seats(6, 15)),
        row("D", seats(1, 5), seats(6, 15)),
        row("C", seats(1, 5), seats(6, 15)),
      ],
    },
    {
      name: "Normal", price: 170, color: "text-muted-foreground",
      rows: [
        row("B", seats(1, 4), seats(5, 14), seats(15, 19)),
        row("A", seats(1, 4), seats(5, 14), seats(15, 18)),
      ],
    },
  ],
};

const cinepolisAudi4: Auditorium = {
  id: "cinepolis-audi-4",
  name: "Audi 4",
  format: "2D",
  sections: [
    {
      name: "VIP", price: 440, color: "text-cinema-gold",
      rows: [
        row("M", seats(1, 2), seats(3, 4), seats(5, 6), seats(7, 8), seats(9, 10), seats(11, 12)),
      ],
    },
    {
      name: "Premium", price: 270, color: "text-anime-cyan",
      rows: [
        row("L", seats(1, 10), seats(11, 16)),
        row("K", seats(1, 10), seats(11, 16)),
        row("J", seats(1, 10), seats(11, 16)),
        row("I", seats(1, 10), seats(11, 16)),
        row("H", seats(1, 10), seats(11, 16)),
        row("G", seats(1, 10), seats(11, 16)),
        row("F", seats(1, 10), seats(11, 16)),
      ],
    },
    {
      name: "Executive", price: 180, color: "text-foreground",
      rows: [
        row("E", seats(1, 10), seats(11, 16)),
        row("D", seats(1, 10), seats(11, 16)),
        row("C", seats(1, 4), seats(5, 14), seats(15, 20)),
        row("B", seats(1, 4), seats(5, 14), seats(15, 20)),
      ],
    },
    {
      name: "Normal", price: 170, color: "text-muted-foreground",
      rows: [
        row("A", seats(1, 4), seats(5, 14), seats(15, 19)),
      ],
    },
  ],
};

const cinepolisAudi5: Auditorium = {
  id: "cinepolis-audi-5",
  name: "Audi 5",
  format: "2D",
  sections: [
    {
      name: "VIP", price: 440, color: "text-cinema-gold",
      rows: [
        row("O", seats(11, 12), seats(9, 10), seats(7, 8), seats(5, 6), seats(3, 4), seats(1, 2)),
      ],
    },
    {
      name: "Premium", price: 270, color: "text-anime-cyan",
      rows: [
        row("N", seats(1, 6), seats(7, 16)),
        row("M", seats(1, 6), seats(7, 16)),
        row("L", seats(1, 6), seats(7, 16)),
        row("K", seats(1, 6), seats(7, 16)),
        row("J", seats(1, 6), seats(7, 16)),
        row("I", seats(1, 6), seats(7, 16)),
        row("H", seats(1, 6), seats(7, 16)),
        row("G", seats(1, 6), seats(7, 16)),
      ],
    },
    {
      name: "Executive", price: 180, color: "text-foreground",
      rows: [
        row("F", seats(1, 6), seats(7, 16)),
        row("E", seats(1, 6), seats(7, 16)),
        row("D", seats(1, 5), seats(6, 15), seats(16, 20)),
        row("C", seats(1, 5), seats(6, 15), seats(16, 20)),
        row("B", seats(1, 5), seats(6, 15), seats(16, 20)),
      ],
    },
    {
      name: "Normal", price: 170, color: "text-muted-foreground",
      rows: [
        row("A", seats(1, 5), seats(6, 14), seats(15, 19)),
      ],
    },
  ],
};

const cinepolisAudi6: Auditorium = {
  id: "cinepolis-audi-6",
  name: "Audi 6",
  format: "2D",
  sections: [
    {
      name: "Premium", price: 270, color: "text-cinema-gold",
      rows: [
        row("K", seats(1, 16)),
        row("J", seats(1, 12)),
        row("I", seats(1, 10)),
        row("H", seats(1, 10)),
      ],
    },
    {
      name: "Executive", price: 180, color: "text-foreground",
      rows: [
        row("G", seats(1, 12)),
        row("F", seats(1, 12)),
        row("E", seats(1, 10)),
        row("D", seats(1, 10)),
        row("C", seats(1, 4), seats(5, 14)),
      ],
    },
    {
      name: "Normal", price: 170, color: "text-muted-foreground",
      rows: [
        row("B", seats(1, 4), seats(5, 14)),
        row("A", seats(1, 4), seats(5, 13)),
      ],
    },
  ],
};

// ─── All Venues ──────────────────────────────────────────────────────────────

export const VENUES: Venue[] = [
  {
    id: "palladium-pvr",
    name: "PVR Palladium Mall & IMAX",
    shortName: "Palladium PVR",
    address: "Palladium Mall, Paldi, Ahmedabad",
    auditoriums: [
      palladiumAudi1,
      palladiumAudi2,
      palladiumAudi3,
      palladiumAudi4,
      palladiumAudi5,
      palladiumAudi6,
      palladiumAudi7,
      palladiumAudi8,
      palladiumAudi9_IMAX,
    ],
  },
  {
    id: "pvr-acropolis",
    name: "PVR Acropolis",
    shortName: "PVR Acropolis",
    address: "Acropolis Mall, Thaltej, Ahmedabad",
    auditoriums: [
      acropolisAudi1,
      acropolisAudi2,
      acropolisAudi3,
      acropolisAudi4,
      acropolisAudi6,
    ],
  },
  {
    id: "cinepolis-nexus",
    name: "Cinepolis Nexus",
    shortName: "Cinepolis",
    address: "Nexus Mall, SG Highway, Ahmedabad",
    auditoriums: [
      cinepolisAudi1,
      cinepolisAudi2,
      cinepolisAudi3,
      cinepolisAudi4,
      cinepolisAudi5,
      cinepolisAudi6,
    ],
  },
  {
    id: "miraj-citypulse",
    name: "Miraj City Pulse",
    shortName: "Miraj Cinemas",
    address: "City Pulse, Kankaria, Ahmedabad",
    auditoriums: [],
  },
  {
    id: "havelock",
    name: "Havelock",
    shortName: "Havelock",
    address: "Havelock, Navrangpura, Ahmedabad",
    auditoriums: [],
  },
  {
    id: "connplex-shilaj",
    name: "Connplex Shilaj",
    shortName: "Connplex",
    address: "Shilaj, Ahmedabad",
    auditoriums: [],
  },
  {
    id: "narol",
    name: "Narol",
    shortName: "Narol",
    address: "Narol, Ahmedabad",
    auditoriums: [],
  },
  {
    id: "prahladnagar",
    name: "Prahladnagar",
    shortName: "Prahladnagar",
    address: "Prahladnagar, Ahmedabad",
    auditoriums: [],
  },
  {
    id: "sbr",
    name: "SBR",
    shortName: "SBR",
    address: "SBR, Ahmedabad",
    auditoriums: [],
  },
];

export function getVenueById(venueId: string): Venue | undefined {
  return VENUES.find((v) => v.id === venueId);
}

export function getAuditorium(venueId: string, audiId: string): Auditorium | undefined {
  const venue = getVenueById(venueId);
  return venue?.auditoriums.find((a) => a.id === audiId);
}

export function getAllVenueNames(): string[] {
  return ["All Cinemas", ...VENUES.map((v) => v.name)];
}
