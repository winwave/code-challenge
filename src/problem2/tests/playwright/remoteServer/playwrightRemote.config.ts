// https://vgcpaulino.medium.com/playwright-visual-tests-and-the-environment-flakiness-6fae79a5e4dd
// https://github.com/vgcpaulino/playwright-visual-tests-remote-server/blob/main/playwrightRemote.config.ts
import config from "../../../playwright.config";

const updateConfig = config;

updateConfig.testDir = "../../";
updateConfig.use = {
  ...config.use,
  baseURL: process.env.HOST_URL || "http://host.docker.internal:5173/",
};
updateConfig.projects?.map((project) => {
  const name: string = project.name || "";

  let port;

  switch (name) {
    case "chromium":
      port = 1010;
      break;
    case "firefox":
      port = 1011;
      break;
    case "webkit":
      port = 1012;
      break;
    default:
      throw new Error("Browser Not Found!");
  }

  project.use = {
    ...project.use,
    connectOptions: {
      wsEndpoint: `ws://localhost:${port}/${name}`,
      exposeNetwork: "*",
      timeout: 30000,
    },
  };
});

export default updateConfig;
