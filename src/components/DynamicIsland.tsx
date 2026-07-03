export function DynamicIsland() {
  return (
    <div className="absolute top-[calc(11px+env(safe-area-inset-top))] inset-x-0 flex justify-center z-50 pointer-events-none">
      <div className="w-[114px] h-[34px] rounded-full bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" />
    </div>
  );
}
