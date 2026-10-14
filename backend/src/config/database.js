
import mysql from 'mysql2/promise';
import { readFileSync } from 'node:fs';
import { env } from './env.js';

const sslConfig = env.DB_SSL
  ? {
      ca: readFileSync(
        new URL('../../certs/aiven-ca.pem', import.meta.url),
        'utf8'
      ),
      rejectUnauthorized: true,
    }
  : undefined;

export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 50,
  connectTimeout: 5000,
  decimalNumbers: true,
  charset: 'utf8mb4',
  timezone: 'Z',
  ...(sslConfig ? { ssl: sslConfig } : {}),
});
