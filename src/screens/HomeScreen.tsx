import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { StatusBar } from "../components/StatusBar";
import { HomeIndicator } from "../components/HomeIndicator";
import { AppIcon } from "../components/AppIcon";
import { DadaWidget } from "../components/DadaWidget";
import { Dock } from "../components/Dock";
import { apps } from "../data/apps";
import type { AppId } from "../types";

export function HomeScreen({
  onOpenApp,
  dimmed = false,
}: {
  onOpenApp: (id: AppId) => void;
  dimmed?: boolean;
}) {
  const [jiggling, setJiggling] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPress = () => {
    pressTimer.current = setTimeout(() => setJiggling(true), 500);
  };
  const endPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{
        opacity: 1,
        scale: dimmed ? 1.06 : 1,
        filter: dimmed ? "blur(18px) brightness(0.55)" : "blur(0px) brightness(1)",
      }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(130% 90% at 20% 0%, #ffe9d6 0%, #ffdcef 45%, #e3d9ff 100%)",
        pointerEvents: dimmed ? "none" : "auto",
      }}
      onClick={() => jiggling && setJiggling(false)}
    >
      <StatusBar light />

      <div className="absolute inset-0 pt-24 px-7">
        <div className="mb-7">
          <DadaWidget />
        </div>
        <div
          className="grid grid-cols-3 gap-x-4 gap-y-7"
          onPointerDown={startPress}
          onPointerUp={endPress}
          onPointerLeave={endPress}
        >
          {apps.map((app) => (
            <AppIcon
              key={app.id}
              app={app}
              jiggling={jiggling}
              onOpen={() => {
                if (jiggling) return;
                onOpenApp(app.id);
              }}
            />
          ))}
        </div>
      </div>

      <Dock />
      <HomeIndicator light />
    </motion.div>
  );
}
