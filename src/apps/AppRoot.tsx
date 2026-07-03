import { motion } from "framer-motion";
import type { AppId } from "../types";
import { MemoryIG } from "./MemoryIG";
import { CmbOrigin } from "./CmbOrigin";
import { MusicPlayer } from "./MusicPlayer";
import { DentalGame } from "./DentalGame";
import { SoftPosts } from "./SoftPosts";
import { Netflix } from "./Netflix";

const registry: Record<AppId, (props: { onClose: () => void }) => React.ReactElement> = {
  memoryIg: MemoryIG,
  cmbOrigin: CmbOrigin,
  musicPlayer: MusicPlayer,
  dentalGame: DentalGame,
  softPosts: SoftPosts,
  netflix: Netflix,
};

export function AppRoot({ appId, onClose }: { appId: AppId; onClose: () => void }) {
  const AppComponent = registry[appId];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, borderRadius: 40 }}
      animate={{ opacity: 1, scale: 1, borderRadius: 0 }}
      exit={{ opacity: 0, scale: 0.85, borderRadius: 40 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="absolute inset-0 z-20 overflow-hidden bg-ink"
    >
      <AppComponent onClose={onClose} />
    </motion.div>
  );
}
