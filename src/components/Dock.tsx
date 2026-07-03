const icons = [
  {
    key: "phone",
    bg: "#34c759",
    glyph: (
      <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1.1.5 1.1 1.1V20c0 .6-.5 1-1.1 1C10.6 21 3 13.4 3 4.1 3 3.5 3.5 3 4.1 3H7.4c.6 0 1.1.5 1.1 1.1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8z" />
    ),
  },
  {
    key: "safari",
    bg: "linear-gradient(180deg,#4dc8ff,#1c8fef)",
    glyph: null,
  },
  {
    key: "messages",
    bg: "linear-gradient(180deg,#3ee06a,#20c95a)",
    glyph: (
      <path d="M12 3C6.5 3 2 6.8 2 11.5c0 2.6 1.4 4.9 3.6 6.5-.1 1.1-.5 2.3-1.2 3.3-.1.2 0 .4.2.4 1.7-.2 3.2-.9 4.4-1.8 1 .3 2 .4 3 .4 5.5 0 10-3.8 10-8.5S17.5 3 12 3z" />
    ),
    badge: 332,
  },
  {
    key: "music",
    bg: "linear-gradient(160deg,#ff5f6d,#e0397a)",
    glyph: (
      <path d="M9 18a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm9-2a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zM9 15.5V6l9-1.5v9" />
    ),
  },
];

export function Dock() {
  return (
    <div className="absolute inset-x-6 bottom-[86px] flex justify-center">
      <div className="flex gap-4 px-4 py-3 rounded-[32px] bg-white/25 backdrop-blur-2xl shadow-lg shadow-black/20">
        {icons.map((app) => (
          <div
            key={app.key}
            className="relative w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden"
            style={{ background: app.bg }}
          >
            {app.key === "safari" ? (
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <div className="w-6 h-6 rotate-45 bg-gradient-to-b from-red-500 to-red-500 relative">
                  <div className="absolute inset-0 [clip-path:polygon(50%_50%,50%_0,100%_0)] bg-[#ff3b30]" />
                  <div className="absolute inset-0 [clip-path:polygon(50%_50%,50%_100%,0_100%)] bg-[#e5e5e5]" />
                </div>
              </div>
            ) : (
              <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                {app.glyph}
              </svg>
            )}
            {app.badge ? (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#ff3b30] text-white text-[11px] font-medium flex items-center justify-center">
                {app.badge}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
