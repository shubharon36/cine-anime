import { Link, useNavigate } from "@tanstack/react-router";
import { Film, Calendar, Ticket, Menu, X, Settings, Users, LogIn, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isAdminOrOwner } from "@/lib/admin-store";
import { getStoredUser, logout } from "@/lib/auth-store";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(getStoredUser());
  const navigate = useNavigate();
  const showAdmin = user && isAdminOrOwner();

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    setMobileOpen(false);
    navigate({ to: "/" });
  };

  const navItems = [
    { label: "Home", to: "/", icon: Film },
    { label: "Screenings", to: "/screenings", icon: Ticket },
    { label: "Events", to: "/events", icon: Calendar },
    ...(showAdmin ? [{ label: "Admin", to: "/admin", icon: Users }] : []),
    { label: "Settings", to: "/settings", icon: Settings },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="font-display text-2xl tracking-wider text-gradient-gold">CINEMA</span>
              <span className="font-display text-lg text-muted-foreground">&</span>
              <span className="font-display text-2xl tracking-wider text-gradient-anime">ANIME</span>
            </div>
            <span className="font-display text-sm text-muted-foreground tracking-widest">EZ</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                activeProps={{ className: "text-foreground bg-accent" }}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                title={`Logout ${user.name}`}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body bg-primary text-primary-foreground hover:opacity-90 transition-opacity ml-1"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </nav>

          <button
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <nav className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  activeProps={{ className: "text-foreground bg-accent" }}
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout ({user.name})
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground"
                >
                  <LogIn className="w-5 h-5" />
                  Login / Sign Up
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
