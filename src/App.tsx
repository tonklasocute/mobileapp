import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { PhoneFrame } from "./components/PhoneFrame";
import { BootScreen } from "./screens/BootScreen";
import { LockScreen } from "./screens/LockScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { AppRoot } from "./apps/AppRoot";
import {
  NotificationBanner,
  type Notification,
} from "./components/NotificationBanner";
import type { AppId } from "./types";

type Screen = "boot" | "lock" | "unlocked";

const NUDGE: Notification = {
  id: 1,
  app: "Netflix",
  emoji: "🎬",
  message: "New episodes just dropped — perfect for movie night.",
};

function App() {
  const [screen, setScreen] = useState<Screen>("boot");
  const [activeApp, setActiveApp] = useState<AppId | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const nudgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setScreen("lock"), 2200);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (screen !== "unlocked") return;
    nudgeTimer.current = setTimeout(() => setNotification(NUDGE), 4000);
    return () => {
      if (nudgeTimer.current) clearTimeout(nudgeTimer.current);
    };
  }, [screen]);

  return (
    <PhoneFrame>
      <AnimatePresence mode="wait">
        {screen === "boot" && <BootScreen key="boot" />}
        {screen === "lock" && (
          <LockScreen key="lock" onUnlock={() => setScreen("unlocked")} />
        )}
      </AnimatePresence>

      {screen === "unlocked" && (
        <>
          <HomeScreen
            dimmed={activeApp !== null}
            onOpenApp={(id) => {
              setActiveApp(id);
              setNotification(null);
            }}
          />
          <AnimatePresence>
            {activeApp && (
              <AppRoot
                key={activeApp}
                appId={activeApp}
                onClose={() => setActiveApp(null)}
              />
            )}
          </AnimatePresence>
          <NotificationBanner
            notification={activeApp ? null : notification}
            onDismiss={() => setNotification(null)}
            onOpen={() => {
              setActiveApp("netflix");
              setNotification(null);
            }}
          />
        </>
      )}
    </PhoneFrame>
  );
}

export default App;
