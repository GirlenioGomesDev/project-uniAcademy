import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createSiteService } from '../src/services/siteService.js';
import { demoRepository } from '../src/repositories/demoRepository.js';
const payload = {
  client_name: 'Maria Silva',
  phone: '81999999999',
  email: 'maria@example.com',
  preferred_modality: 'Musculação',
  consent: true,
};
function fixture(overrides = {}, number = '5581999999999') {
  let calls = 0;
  const repository = {
    getSiteData: async () => ({ plans: [], modalities: [], schedules: [] }),
    modalityExists: async () => true,
    createTrial: async () => {
      calls++;
      return 42;
    },
    health: async () => {},
    ...overrides,
  };
  return { app: createApp(createSiteService(repository, number)), calls: () => calls };
}
test('GET catálogo consolidado e saúde', async () => {
  const { app } = fixture();
  await request(app)
    .get('/api/site-data')
    .expect(200)
    .expect((r) => assert.deepEqual(r.body.plans, []));
  await request(app)
    .get('/api/health')
    .expect(200)
    .expect((r) => assert.equal(r.body.database, 'connected'));
});
test('POST persiste antes de produzir URL codificada', async () => {
  const f = fixture();
  const r = await request(f.app).post('/api/trial-request').send(payload).expect(201);
  assert.equal(f.calls(), 1);
  const url = new URL(r.body.whatsapp_url);
  assert.equal(url.hostname, 'wa.me');
  assert.ok(url.searchParams.get('text').includes('Musculação'));
  assert.ok(url.searchParams.get('text').includes('#42'));
});
test('payload inválido não chega à persistência', async () => {
  const f = fixture();
  await request(f.app)
    .post('/api/trial-request')
    .send({ ...payload, email: 'invalid', consent: false })
    .expect(400);
  assert.equal(f.calls(), 0);
});
test('modalidade inválida rejeitada', async () => {
  const f = fixture({ modalityExists: async () => false });
  await request(f.app).post('/api/trial-request').send(payload).expect(400);
  assert.equal(f.calls(), 0);
});
test('contato ausente não grava solicitação', async () => {
  const f = fixture({}, '');
  await request(f.app).post('/api/trial-request').send(payload).expect(503);
  assert.equal(f.calls(), 0);
});
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
test('CORS rejeita origem desconhecida', async () => {
  await request(fixture().app)
    .get('/api/site-data')
    .set('Origin', 'https://evil.example')
    .expect(403);
});
test('JSON malformado tem erro padronizado', async () => {
  await request(fixture().app)
    .post('/api/trial-request')
    .set('Content-Type', 'application/json')
    .send('{')
    .expect(400)
    .expect((r) => assert.ok(r.body.error.code));
});
test('OpenAPI inclui todos os contratos', async () => {
  await request(fixture().app)
    .get('/api/openapi.json')
    .expect(200)
    .expect((r) => {
      assert.equal(r.body.openapi, '3.0.3');
      assert.ok(r.body.paths['/api/trial-request'].post.responses['201']);
    });
});
test('limite de solicitações impede abuso', async () => {
  const f = fixture();
  for (let i = 0; i < 10; i++)
    await request(f.app).post('/api/trial-request').send(payload).expect(201);
  await request(f.app).post('/api/trial-request').send(payload).expect(429);
  assert.equal(f.calls(), 10);
});

test('documentação desativada não publica contratos nem interface', async () => {
  const service = createSiteService({ health: async () => {} }, '');
  const app = createApp(service, { documentationEnabled: false });
  await request(app).get('/api/openapi.json').expect(404);
  await request(app).get('/api/docs').expect(404);
  await request(app).get('/api/health').expect(200);
});

test('catálogo demonstrativo mantém planos e grade completos sem MySQL', async () => {
  const app = createApp(createSiteService(demoRepository, '', { demoMode: true }));
  const response = await request(app).get('/api/site-data').expect(200);
  assert.equal(response.body.demo, true);
  assert.deepEqual(
    response.body.plans.map((plan) => plan.name),
    ['Light', 'Plus', 'MegaPlus', 'Day-use'],
  );
  assert.equal(response.body.modalities.length, 4);
  assert.equal(response.body.schedules.length, 10);
});

test('simulação com contato configurado também não persiste nem gera redirecionamento', async () => {
  const app = createApp(createSiteService(demoRepository, '5581999999999', { demoMode: true }));
  const response = await request(app).post('/api/trial-request').send(payload).expect(200);
  assert.equal(response.body.stored, false);
  assert.equal(response.body.whatsapp_url, null);
  assert.equal(response.body.id, null);
});

test('saúde demonstrativa não alega conexão real com banco', async () => {
  const app = createApp(createSiteService(demoRepository, '', { demoMode: true }));
  const response = await request(app).get('/api/health').expect(200);
  assert.equal(response.body.database, 'demo');
});
