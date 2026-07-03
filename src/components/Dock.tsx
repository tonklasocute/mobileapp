const icons = [
  { key: "phone", src: "/logo/phone.png" },
  { key: "safari", src: "/logo/safari.webp" },
  { key: "messages", src: "/logo/message.png", badge: 332 },
  { key: "music", src: "/logo/musicios.webp" },
];

export function Dock() {
  return (
    <div className="absolute inset-x-3 bottom-9 flex justify-center">
      <div className="flex justify-between w-full gap-3 px-4 py-4 rounded-[36px] bg-white/25 backdrop-blur-2xl shadow-lg shadow-black/20">
        {icons.map((app) => (
          <div key={app.key} className="relative w-[72px] h-[72px] shrink-0">
            <div
              className={`w-full h-full rounded-[20px] flex items-center justify-center overflow-hidden ${app.key === "safari" ? "bg-white" : ""}`}
            >
              <img
                src={app.src}
                alt=""
                className={app.key === "safari" ? "w-[86%] h-[86%] object-contain" : "w-full h-full object-cover"}
              />
            </div>
            {app.badge ? (
              <span className="absolute -top-2 -right-2 min-w-[26px] h-[26px] px-1.5 rounded-full bg-[#ff3b30] ring-2 ring-white/25 text-white text-sm font-medium flex items-center justify-center">
                {app.badge}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
