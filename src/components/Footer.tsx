import { Film, Tv, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-display text-xl tracking-wider text-gradient-gold">CINEMA</span>
              <span className="text-muted-foreground">&</span>
              <span className="font-display text-xl tracking-wider text-gradient-anime">ANIME</span>
              <span className="font-display text-sm text-muted-foreground">EZ</span>
            </div>
            <p className="text-sm text-muted-foreground font-body max-w-xs">
              Ahmedabad's premier film & anime community. Join us for exclusive screenings, events, and more.
            </p>
          </div>

          {/* Cinema EZ */}
          <div>
            <h3 className="font-display text-lg tracking-wider text-cinema-gold mb-3 flex items-center gap-2">
              <Film className="w-4 h-4" />
              CINEMA EZ
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground font-body">
              <li>Screenings at PVR, Cinepolis, Miraj & more</li>
              <li>Film discussions & reviews</li>
              <li>Community meetups</li>
            </ul>
          </div>

          {/* Anime EZ */}
          <div>
            <h3 className="font-display text-lg tracking-wider text-anime-cyan mb-3 flex items-center gap-2">
              <Tv className="w-4 h-4" />
              ANIME EZ
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground font-body">
              <li>Anime screenings on big screen</li>
              <li>Cosplay events</li>
              <li>Otaku community gatherings</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-6 text-center">
          <p className="text-xs text-muted-foreground font-body flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-cinema-red" /> in Ahmedabad
          </p>
          <p className="text-xs text-muted-foreground/50 font-body mt-1">
            © 2026 Cinema EZ & Anime EZ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
