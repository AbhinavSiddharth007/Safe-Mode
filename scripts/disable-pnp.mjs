import Module from "node:module";

if (typeof Module.findPnpApi === "function") {
  Module.findPnpApi = () => null;
}

if ("pnp" in process.versions) {
  delete process.versions.pnp;
}
