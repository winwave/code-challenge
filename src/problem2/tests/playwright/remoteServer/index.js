// https://vgcpaulino.medium.com/playwright-visual-tests-and-the-environment-flakiness-6fae79a5e4dd
// https://github.com/vgcpaulino/playwright-visual-tests-remote-server/blob/main/tests/playwrightRemoteServer.js
const { chromium, firefox, webkit } = require("@playwright/test");

(async () => {
  const serverCr = await chromium.launchServer({
    headless: true,
    port: 1010,
    wsPath: "chromium",
  });
  console.log(serverCr.wsEndpoint());

  const serverFr = await firefox.launchServer({
    headless: true,
    port: 1011,
    wsPath: "firefox",
  });
  console.log(serverFr.wsEndpoint());

  const serverWk = await webkit.launchServer({
    headless: true,
    port: 1012,
    wsPath: "webkit",
  });
  console.log(serverWk.wsEndpoint());
})();
