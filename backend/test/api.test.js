import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import { createApp } from '../src/app.js';
import { createSiteService } from '../src/services/siteService.js';

// Dados válidos para simular uma solicitação de aula experimental.
const payload = {
  client_name: 'Maria Silva',
  phone: '81999999999',
  email: 'maria@example.com',
  preferred_modality: 'Musculação',
  consent: true,
};

// Cria uma aplicação de teste com repositório simulado.
// Assim, os testes não alteram o banco de dados real.
function fixture(overrides = {}, number = '5581999999999') {
  let calls = 0;

  const repository = {
    getSiteData: async () => ({
      plans: [],
      modalities: [],
      schedules: [],
    }),

    modalityExists: async () => true,

    createTrial: async () => {
      calls++;
      return 42;
    },

    health: async () => {},

    ...overrides,
  };

  return {
    app: createApp(createSiteService(repository, number)),
    calls: () => calls,
  };
}

// TESTE 1
// Verifica se o catálogo e a API de saúde funcionam.
test('GET catálogo consolidado e saúde', async () => {
  const { app } = fixture();

  await request(app)
    .get('/api/site-data')
    .expect(200)
    .expect((r) => {
      assert.deepEqual(r.body.plans, []);
    });

  await request(app)
    .get('/api/health')
    .expect(200)
    .expect((r) => {
      assert.equal(r.body.database, 'connected');
    });
});

// TESTE 2
// Verifica se o cadastro retorna confirmação sem WhatsApp.
test('POST cadastra solicitação e retorna confirmação', async () => {
  const f = fixture();

  const r = await request(f.app).post('/api/trial-request').send(payload).expect(201);

  assert.equal(f.calls(), 1);
  assert.equal(r.body.id, 42);
  assert.equal(r.body.status, 'pending');

  assert.equal(r.body.message, 'Solicitação cadastrada com sucesso!');

  assert.equal(r.body.whatsapp_url, undefined);
});

// TESTE 3
// Dados inválidos não devem ser enviados para persistência.
test('payload inválido não chega à persistência', async () => {
  const f = fixture();

  await request(f.app)
    .post('/api/trial-request')
    .send({
      ...payload,
      email: 'invalid',
      consent: false,
    })
    .expect(400);

  assert.equal(f.calls(), 0);
});

// TESTE 4
// Impede cadastro com modalidade inexistente.
test('modalidade inválida rejeitada', async () => {
  const f = fixture({
    modalityExists: async () => false,
  });

  await request(f.app).post('/api/trial-request').send(payload).expect(400);

  assert.equal(f.calls(), 0);
});

// TESTE 5
// O cadastro deve funcionar sem WhatsApp configurado.
test('cadastro funciona sem WhatsApp configurado', async () => {
  const f = fixture({}, '');

  const r = await request(f.app).post('/api/trial-request').send(payload).expect(201);

  assert.equal(f.calls(), 1);
  assert.equal(r.body.id, 42);
  assert.equal(r.body.status, 'pending');

  assert.equal(r.body.message, 'Solicitação cadastrada com sucesso!');

  assert.equal(r.body.whatsapp_url, undefined);
});

// TESTE 6
// Erros internos do banco não devem revelar informações sensíveis.
test('erro de banco não vaza detalhes internos', async () => {
  const f = fixture({
    createTrial: async () => {
      throw new Error('secret SQL password');
    },
  });

  const r = await request(f.app).post('/api/trial-request').send(payload).expect(500);

  assert.ok(r.body.error.requestId);

  assert.ok(!JSON.stringify(r.body).includes('secret'));
});

// TESTE 7
// Bloqueia requisições vindas de origens não autorizadas.
test('CORS rejeita origem desconhecida', async () => {
  await request(fixture().app)
    .get('/api/site-data')
    .set('Origin', 'https://evil.example')
    .expect(403);
});

// TESTE 8
// Verifica tratamento de JSON malformado.
test('JSON malformado tem erro padronizado', async () => {
  await request(fixture().app)
    .post('/api/trial-request')
    .set('Content-Type', 'application/json')
    .send('{')
    .expect(400)
    .expect((r) => {
      assert.ok(r.body.error.code);
    });
});

// TESTE 9
// Verifica se a documentação OpenAPI está disponível.
test('OpenAPI inclui todos os contratos', async () => {
  await request(fixture().app)
    .get('/api/openapi.json')
    .expect(200)
    .expect((r) => {
      assert.equal(r.body.openapi, '3.0.3');

      assert.ok(r.body.paths['/api/trial-request'].post.responses['201']);
    });
});

// TESTE 10
// Verifica se o limite de requisições protege a API.
test('limite de solicitações impede abuso', async () => {
  const f = fixture();

  for (let i = 0; i < 10; i++) {
    await request(f.app).post('/api/trial-request').send(payload).expect(201);
  }

  await request(f.app).post('/api/trial-request').send(payload).expect(429);

  assert.equal(f.calls(), 10);
});
