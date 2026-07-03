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
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    ),
  },
];

export function Dock() {
  return (
    <div className="absolute inset-x-6 bottom-[86px] flex justify-center">
      <div className="flex gap-4 px-4 py-3 rounded-[32px] bg-white/25 backdrop-blur-2xl shadow-lg shadow-black/20">
        {icons.map((app) => (
          <div key={app.key} className="relative w-14 h-14">
            <div
              className="w-full h-full rounded-2xl flex items-center justify-center overflow-hidden"
              style={{ background: app.bg }}
            >
              {app.key === "safari" ? (
                <div className="w-9 h-9 rounded-full bg-white ring-1 ring-black/10 flex items-center justify-center">
                  <div
                    className="w-5 h-5 rotate-45"
                    style={{
                      background:
                        "linear-gradient(to bottom right, #ff3b30 50%, #d1d1d6 50%)",
                    }}
                  />
                </div>
              ) : (
                <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                  {app.glyph}
                </svg>
              )}
            </div>
            {app.badge ? (
              <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 rounded-full bg-[#ff3b30] ring-2 ring-white/25 text-white text-[11px] font-medium flex items-center justify-center">
                {app.badge}
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
