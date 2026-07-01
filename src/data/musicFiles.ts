const modules = import.meta.glob<string>("../assets/music/*.mp3", {
  eager: true,
  query: "?url",
  import: "default",
});

const files: Record<string, string> = {};
for (const [path, url] of Object.entries(modules)) {
  files[path.split("/").pop()!] = url;
}

export default files;
