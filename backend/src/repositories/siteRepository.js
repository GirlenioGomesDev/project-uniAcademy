import { pool } from '../config/database.js';
export const siteRepository = {
  async getSiteData() {
    const [[plans], [modalities], [schedules]] = await Promise.all([
      pool.query('SELECT * FROM plans ORDER BY id'),
      pool.query('SELECT * FROM modalities ORDER BY id'),
      pool.query('SELECT * FROM schedules ORDER BY weekday, time_slot'),
    ]);
    return {
      plans: plans.map((p) => ({
        ...p,
        benefits: typeof p.benefits === 'string' ? JSON.parse(p.benefits) : p.benefits,
        is_featured: Boolean(p.is_featured),
      })),
      modalities,
      schedules,
    };
  },
  async modalityExists(name) {
    const [rows] = await pool.execute('SELECT id FROM modalities WHERE name = ?', [name]);
    return rows.length > 0;
  },
  async createTrial(data) {
    const [result] = await pool.execute(
      'INSERT INTO trial_requests (client_name,phone,email,preferred_modality) VALUES (?,?,?,?)',
      [data.client_name, data.phone, data.email, data.preferred_modality],
    );
    return result.insertId;
  },
  async health() {
    await pool.query('SELECT 1');
  },
};
