import type { ReactNode } from "react";
import { HomeIndicator } from "./HomeIndicator";

export function AppShell({
  title,
  onBack,
  children,
  transparent = false,
  action,
  bottomBar,
}: {
  title: string;
  onBack: () => void;
  children: ReactNode;
  transparent?: boolean;
  action?: ReactNode;
  bottomBar?: ReactNode;
}) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div
        className={`flex items-center justify-between px-4 pt-12 pb-3 shrink-0 ${
          transparent ? "" : "border-b border-white/10"
        }`}
      >
        <div className="w-9 h-9" />
        <span className="text-[15px] font-semibold">{title}</span>
        <div className="w-9 h-9 flex items-center justify-center">{action}</div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
        {children}
      </div>
      {bottomBar}
      <HomeIndicator onSwipeUp={onBack} />
    </div>
  );
}
