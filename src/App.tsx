import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { PhoneFrame } from "./components/PhoneFrame";
import { BootScreen } from "./screens/BootScreen";
import { LockScreen } from "./screens/LockScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { AppRoot } from "./apps/AppRoot";
import type { AppId } from "./types";

type Screen = "boot" | "lock" | "unlocked";

function App() {
  const [screen, setScreen] = useState<Screen>("boot");
  const [activeApp, setActiveApp] = useState<AppId | null>(null);

  useEffect(() => {
    const id = setTimeout(() => setScreen("lock"), 2200);
    return () => clearTimeout(id);
  }, []);

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
          <HomeScreen dimmed={activeApp !== null} onOpenApp={setActiveApp} />
          <AnimatePresence>
            {activeApp && (
              <AppRoot
                key={activeApp}
                appId={activeApp}
                onClose={() => setActiveApp(null)}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </PhoneFrame>
  );
}

export default App;
