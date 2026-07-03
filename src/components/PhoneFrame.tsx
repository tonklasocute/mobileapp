import type { ReactNode } from "react";
import { DynamicIsland } from "./DynamicIsland";

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div
        className="relative w-full h-full overflow-hidden bg-ink text-white
          sm:w-[430px] sm:h-[min(932px,100dvh)] sm:rounded-phone sm:shadow-[0_0_0_10px_#050409,0_30px_80px_rgba(0,0,0,0.6)]"
      >
        {children}
        <DynamicIsland />
      </div>
    </div>
  );
}
