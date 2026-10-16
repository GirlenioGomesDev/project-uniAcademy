import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import { createApp } from '../src/app.js';
import { createSiteService } from '../src/services/siteService.js';

// Escolhe uma data futura que não seja domingo.
function futureDate() {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 14);

  if (date.getUTCDay() === 0) {
    date.setUTCDate(date.getUTCDate() + 1);
  }

  return date.toISOString().slice(0, 10);
}

// Dados de teste, sem informações reais de clientes.
const payload = {
  schema_version: '1.1',
  plan_id: 2,
  client_name: 'Maria Silva',
  phone: '81999999999',
  email: 'maria@example.com',
  preferred_date: futureDate(),
  experience_level: 'beginner',
  consent: true,
  marketing_consent: false,
  idempotency_key: 'b8e54a42-d831-4f10-a25b-ec5102ef0c69',
};

// Banco simulado: não acessa a Aiven.
function fixture() {
  const saved = new Map();
  let inserts = 0;

  const repository = {
    findPlanById: async (id) =>
      id === 2
        ? {
            id: 2,
            name: 'Plus',
            price: 99.9,
            duration_months: 1,
          }
        : null,

    findPlanInterestByKey: async (key) => saved.get(key) ?? null,

    createPlanInterest: async (data) => {
      inserts++;

      const id = 100 + inserts;

      saved.set(data.idempotency_key, {
        ...data,
        id,
        experience_level: data.experience_level ?? null,
        marketing_consent: Number(data.marketing_consent),
        status: 'pending',
      });

      return id;
    },
  };

  const service = createSiteService(repository, '');

  return {
    app: createApp(service),
    inserts: () => inserts,
  };
}

// TESTE 1: Cadastro de interesse válido.
test('POST cadastra interesse no plano', async () => {
  const f = fixture();

  const response = await request(f.app).post('/api/plan-interest').send(payload).expect(201);

  assert.equal(response.body.id, 101);
  assert.equal(response.body.status, 'pending');
  assert.equal(response.body.plan.name, 'Plus');
  assert.equal(f.inserts(), 1);
});

// TESTE 2: Não aceita plano inexistente.
test('Rejeita plano inexistente', async () => {
  const f = fixture();

  const response = await request(f.app)
    .post('/api/plan-interest')
    .send({ ...payload, plan_id: 999 })
    .expect(400);

  assert.equal(response.body.error.code, 'INVALID_PLAN');
  assert.equal(f.inserts(), 0);
});

// TESTE 3: Não cadastra sem consentimento.
test('Rejeita cadastro sem consentimento', async () => {
  const f = fixture();

  const response = await request(f.app)
    .post('/api/plan-interest')
    .send({ ...payload, consent: false })
    .expect(400);

  assert.equal(response.body.error.code, 'VALIDATION_ERROR');
  assert.equal(f.inserts(), 0);
});

// TESTE 4: Não duplica a mesma solicitação.
test('Repetir a mesma chave nao duplica cadastro', async () => {
  const f = fixture();

  // Primeiro envio: cria o cadastro.
  const first = await request(f.app).post('/api/plan-interest').send(payload).expect(201);

  // Segundo envio: retorna o cadastro existente.
  const second = await request(f.app).post('/api/plan-interest').send(payload).expect(200);

  assert.equal(first.body.id, second.body.id);
  assert.equal(first.body.replayed, false);
  assert.equal(second.body.replayed, true);
  assert.equal(f.inserts(), 1);
});

// TESTE 5: Mesma chave com dados diferentes gera conflito.
test('Rejeita reutilizacao de chave com outros dados', async () => {
  const f = fixture();

  await request(f.app).post('/api/plan-interest').send(payload).expect(201);

  const response = await request(f.app)
    .post('/api/plan-interest')
    .send({ ...payload, client_name: 'Outra Pessoa' })
    .expect(409);

  assert.equal(response.body.error.code, 'IDEMPOTENCY_CONFLICT');
  assert.equal(f.inserts(), 1);
});
