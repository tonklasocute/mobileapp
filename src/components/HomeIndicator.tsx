export function HomeIndicator({ light = false }: { light?: boolean }) {
  return (
    <div className="absolute bottom-1.5 inset-x-0 flex justify-center z-40">
      <div
        className={`w-32 h-[5px] rounded-full ${light ? "bg-black/60" : "bg-white/70"}`}
      />
    </div>
  );
}
