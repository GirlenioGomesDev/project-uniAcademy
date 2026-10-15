import { createApp } from './app.js';
import { env } from './config/env.js';
import { pool } from './config/database.js';
const server = createApp().listen(env.PORT, () =>
  console.log(`UniAcademy API: http://localhost:${env.PORT}/api/docs`),
);
for (const signal of ['SIGINT', 'SIGTERM'])
  process.on(signal, () => {
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  });
