import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, Sparkles, Save } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { currentUser } from "@/lib/admin-store";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Cinema EZ & Anime EZ" }] }),
  component: SettingsPage,
});

const ANIM_KEY = "ez:welcome-animation";

function SettingsPage() {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState("");
  const [animOn, setAnimOn] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const v = localStorage.getItem(ANIM_KEY);
    setAnimOn(v === null ? true : v === "true");
  }, []);

  const save = () => {
    localStorage.setItem(ANIM_KEY, String(animOn));
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-5xl tracking-wider mb-2">SETTINGS</h1>
          <p className="text-muted-foreground font-body text-sm">Manage your profile and preferences</p>
        </motion.div>

        <div className="space-y-6">
          <section className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-display text-xl tracking-wider mb-4">Profile</h2>
            <div className="space-y-3">
              <Field icon={User} label="Name" value={name} onChange={setName} />
              <Field icon={Mail} label="Email" value={email} onChange={setEmail} type="email" />
              <Field icon={Lock} label="New Password" value={password} onChange={setPassword} type="password" placeholder="Leave blank to keep current" />
            </div>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6">
            <h2 className="font-display text-xl tracking-wider mb-4">Preferences</h2>
            <label className="flex items-start gap-3 cursor-pointer">
              <div className="mt-0.5">
                <button
                  type="button"
                  onClick={() => setAnimOn(!animOn)}
                  className={`w-11 h-6 rounded-full relative transition-colors ${animOn ? "bg-primary" : "bg-secondary"}`}
                  aria-pressed={animOn}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background transition-transform ${animOn ? "translate-x-5" : ""}`} />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 font-body text-sm text-foreground">
                  <Sparkles className="w-4 h-4 text-primary" /> Welcome character animation
                </div>
                <p className="text-xs text-muted-foreground font-body mt-1">
                  Show a random anime character greeting when you open the site after login.
                </p>
              </div>
            </label>
          </section>

          <button
            onClick={save}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-body text-sm font-semibold hover:opacity-90"
          >
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : "Save changes"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({
  icon: Icon, label, value, onChange, type = "text", placeholder,
}: { icon: any; label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1 block">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary border border-border text-sm font-body focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>
    </div>
  );
}
