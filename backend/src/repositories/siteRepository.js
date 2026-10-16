import { pool } from '../config/database.js';

export const siteRepository = {
  // Busca os planos, modalidades e horários no banco.
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

  // Verifica se uma modalidade existe.
  async modalityExists(name) {
    const [rows] = await pool.execute('SELECT id FROM modalities WHERE name = ?', [name]);

    return rows.length > 0;
  },

  // Cadastra uma solicitação de aula experimental.
  async createTrial(data) {
    const [result] = await pool.execute(
      `INSERT INTO trial_requests (
        client_name,
        phone,
        email,
        preferred_modality
      ) VALUES (?, ?, ?, ?)`,
      [data.client_name, data.phone, data.email, data.preferred_modality],
    );

    return result.insertId;
  },

  // Busca um plano pelo ID diretamente no MySQL.
  // O preço sempre vem do banco, nunca do navegador.
  async findPlanById(planId) {
    const [rows] = await pool.execute(
      `SELECT
        id,
        name,
        price,
        duration_months
       FROM plans
       WHERE id = ?
       LIMIT 1`,
      [planId],
    );

    return rows[0] ?? null;
  },

  // Verifica se uma solicitação já foi registrada.
  // Usa a chave de idempotência para identificar
  // tentativas repetidas do mesmo cadastro.
  async findPlanInterestByKey(key) {
    const [rows] = await pool.execute(
      `SELECT
        id,
        plan_id,
        client_name,
        phone,
        email,
        DATE_FORMAT(preferred_date, '%Y-%m-%d') AS preferred_date,
        experience_level,
        marketing_consent,
        status
       FROM plan_interests
       WHERE idempotency_key = ?
       LIMIT 1`,
      [key],
    );

    return rows[0] ?? null;
  },

  // Registra o interesse do cliente em um plano.
  // Os dados são armazenados no MySQL da Aiven.
  async createPlanInterest(data) {
    const [result] = await pool.execute(
      `INSERT INTO plan_interests (
        plan_id,
        client_name,
        phone,
        email,
        preferred_date,
        experience_level,
        marketing_consent,
        idempotency_key
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.plan_id,
        data.client_name,
        data.phone,
        data.email,
        data.preferred_date,
        data.experience_level ?? null,
        data.marketing_consent === true,
        data.idempotency_key,
      ],
    );

    return result.insertId;
  },

  // Verifica se o banco de dados está respondendo.
  async health() {
    await pool.query('SELECT 1');
  },
};
