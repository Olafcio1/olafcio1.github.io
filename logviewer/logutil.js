export function getMinecraftVersion(log) {
  let lines = log.split("\n");

  for (let line of lines) {
    if (line.includes("Loading Minecraft ")) {
      return "Fabric " + line.split("Loading Minecraft ")[1].trim().split(" ")[0];
    } else if (line.includes("Launching target 'forge_client' with arguments [--version, ")) {
      return "Forge " + line.split("Launching target 'forge_client' with arguments [--version, ")[1].split(",")[0].trim().split(" ")[0];
    }
  }

  return "[missing?]";
}
