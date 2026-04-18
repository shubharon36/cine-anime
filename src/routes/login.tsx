import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Film, Tv, LogIn, Mail, Lock, User as UserIcon } from "lucide-react";
import { markFreshLogin } from "@/lib/auth-store";
import { WelcomeAnimation } from "@/components/WelcomeAnimation";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Cinema EZ & Anime EZ" },
      { name: "description", content: "Login to Cinema EZ & Anime EZ — Ahmedabad's film & anime community." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showAnim, setShowAnim] = useState(false);
  const [pendingUser, setPendingUser] = useState<{ id: string; name: string; email: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill in all fields");
      return;
    }
    const user = {
      id: `u-${Date.now()}`,
      name: mode === "signup" ? name : email.split("@")[0],
      email,
    };
    setPendingUser(user);
    setShowAnim(true);
  };

  const handleAnimDone = () => {
    if (pendingUser) markFreshLogin(pendingUser);
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center px-4">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, var(--cinema-gold), transparent 70%)" }}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, var(--anime-purple), transparent 70%)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl">
          <Link to="/" className="flex items-center justify-center gap-2 mb-6">
            <Film className="w-5 h-5 text-cinema-gold" />
            <span className="font-display text-2xl tracking-wider text-gradient-gold">CINEMA</span>
            <span className="font-display text-base text-muted-foreground">&</span>
            <span className="font-display text-2xl tracking-wider text-gradient-anime">ANIME</span>
            <span className="font-display text-sm text-muted-foreground">EZ</span>
            <Tv className="w-5 h-5 text-anime-cyan" />
          </Link>

          <h1 className="font-display text-3xl tracking-wider text-center mb-1">
            {mode === "login" ? "WELCOME BACK" : "JOIN THE COMMUNITY"}
          </h1>
          <p className="text-center text-sm text-muted-foreground font-body mb-6">
            {mode === "login" ? "Login to continue your journey" : "Sign up to access exclusive screenings & events"}
          </p>

          <div className="flex gap-2 p-1 bg-secondary rounded-xl mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-lg text-sm font-body font-medium transition-all ${
                mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-lg text-sm font-body font-medium transition-all ${
                mode === "signup" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <Field icon={UserIcon} placeholder="Your Name" value={name} onChange={setName} />
            )}
            <Field icon={Mail} type="email" placeholder="Email" value={email} onChange={setEmail} />
            <Field icon={Lock} type="password" placeholder="Password" value={password} onChange={setPassword} />

            {error && <p className="text-xs text-destructive font-body">{error}</p>}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-body font-semibold hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-4 h-4" />
              {mode === "login" ? "Login" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground font-body mt-6">
            By continuing you agree to our community guidelines.
          </p>
        </div>

        <Link
          to="/"
          className="block text-center text-xs text-muted-foreground font-body mt-4 hover:text-foreground transition-colors"
        >
          ← Back to home
        </Link>
      </motion.div>

      {showAnim && pendingUser && (
        <WelcomeAnimation
          username={pendingUser.name}
          showGreeting={true}
          onDone={handleAnimDone}
        />
      )}
    </div>
  );
}

function Field({
  icon: Icon, type = "text", placeholder, value, onChange,
}: { icon: typeof Mail; type?: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring"
      />
    </div>
  );
}
