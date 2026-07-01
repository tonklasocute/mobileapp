import type { ReactNode } from "react";
import clsx from "clsx";

export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("glass rounded-card", className)}>{children}</div>
  );
}
