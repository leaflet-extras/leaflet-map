// @ts-check
import devServerConfig from './web-dev-server.config.mjs';

export default /** @type {import('@web/test-runner').TestRunnerConfig */ {
  ...devServerConfig,
  files: './*.test.ts',
  port: 9381,
};
