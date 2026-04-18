import { useEffect, useState } from "react";
import { WelcomeAnimation } from "./WelcomeAnimation";
import {
  consumeShouldGreet,
  getStoredUser,
  isLoggedIn,
  isWelcomeAnimationEnabled,
} from "@/lib/auth-store";

/**
 * Triggers the anime character welcome animation on the homepage when:
 * - The user just logged in (showGreeting=true with name bubble), OR
 * - A logged-in user opens the site (no greeting bubble) AND the toggle is on
 */
export function WelcomePopup() {
  const [show, setShow] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [username, setUsername] = useState<string | undefined>();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isLoggedIn()) return;
    if (!isWelcomeAnimationEnabled()) return;

    const user = getStoredUser();
    setUsername(user?.name);
    setShowGreeting(consumeShouldGreet());
    // small delay so home renders first
    const t = setTimeout(() => setShow(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (!show) return null;
  return (
    <WelcomeAnimation
      username={username}
      showGreeting={showGreeting}
      onDone={() => setShow(false)}
    />
  );
}
