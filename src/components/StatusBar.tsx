import { useEffect, useState } from "react";

export function StatusBar({ light = false }: { light?: boolean }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 15);
    return () => clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const tone = light ? "text-black" : "text-white";

  return (
    <div
      className={`absolute top-0 inset-x-0 z-40 flex items-center justify-between px-7 pt-3 h-11 text-[15px] font-semibold ${tone}`}
    >
      <span>{time}</span>
      <div className="flex items-center gap-1.5">
        <div className="flex items-end gap-[2px] h-2.5">
          {[3, 5, 7, 9].map((h) => (
            <span
              key={h}
              className={`w-[3px] rounded-sm ${light ? "bg-black" : "bg-white"}`}
              style={{ height: h }}
            />
          ))}
        </div>
        <div
          className={`w-5 h-2.5 rounded-[3px] border ${light ? "border-black" : "border-white"} relative`}
        >
          <span
            className={`absolute inset-[1.5px] right-[3px] rounded-[1px] ${light ? "bg-black" : "bg-white"}`}
          />
        </div>
      </div>
    </div>
  );
}
