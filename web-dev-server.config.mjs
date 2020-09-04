// @ts-check

import { esbuildPlugin } from '@web/dev-server-esbuild';
import { importMapsPlugin } from '@web/dev-server-import-maps';

export default /** @type {import('@web/dev-server').DevServerConfig */ {
  nodeResolve: true,
  port: 9380,
  plugins: [
    esbuildPlugin({ ts: true }),
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            leaflet: '/node_modules/leaflet/dist/leaflet-src.esm.js',
          },
        },
      },
    }),
  ],
};
