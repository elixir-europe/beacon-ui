export async function loadConfig() {
  const res = await fetch("/config/config.json", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Can not load config.json: " + res.status);
  }
  return res.json();
}