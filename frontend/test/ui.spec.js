import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { demoCatalog } from '../../shared/siteCatalog.js';

const catalog = { ...demoCatalog, demo: false };
test.beforeEach(async ({ page }) => {
  // Isolate browser checks from production: no test writes to a real database.
  await page.route('**/site-data', (route) => route.fulfill({ json: catalog }));
  await page.route('**/trial-request', (route) =>
    route.fulfill({
      status: 201,
      json: { id: 42, status: 'pending', message: 'Solicitação cadastrada com sucesso!' },
    }),
  );
});

async function fillTrial(page) {
  await page.goto('/');
  await expect(page.locator('.plans .plan')).toHaveCount(4);
  await page.locator('.hero').getByRole('button', { name: 'Solicitar aula experimental' }).click();
  await page.getByLabel('Nome completo').fill('Pessoa Teste');
  await page.getByLabel('Telefone com DDD').fill('(81) 99999-9999');
  await page.getByLabel('E-mail', { exact: true }).fill('teste@example.com');
  await page.getByLabel('Modalidade', { exact: true }).selectOption({ label: 'Musculação' });
  await page.locator('input[name="consent"]').check();
}

for (const width of [360, 768, 1440]) {
  test(`composição responsiva e identidade em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('.plans .plan')).toHaveCount(4);
    await expect(page.locator('.modalities article')).toHaveCount(4);
    await expect(page.locator('.brand-sub')).toHaveCount(0);
    await expect(page.locator('.hero-logo')).toBeVisible();
    await expect(page.locator('.hero-location')).not.toContainText('Recife');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    );
    expect(overflow).toBe(false);
    await expect(page.locator('.location-map svg')).toBeVisible();
    if (width < 1100) {
      await page.getByRole('button', { name: 'Abrir menu' }).click();
      await expect(page.locator('#main-navigation')).toBeVisible();
      await page
        .locator('#main-navigation')
        .getByRole('link', { name: 'Planos', exact: true })
        .click();
      await expect(page.locator('#main-navigation')).not.toBeVisible();
    }
    fs.mkdirSync('artifacts/qa', { recursive: true });
    await page.screenshot({
      path: `artifacts/qa/home-${width}.png`,
      fullPage: true,
      animations: 'disabled',
    });
    if (width === 1440) {
      await page.locator('.hero').screenshot({ path: 'artifacts/qa/hero.png' });
      await page.locator('#horarios').screenshot({ path: 'artifacts/qa/schedule.png' });
      await page.locator('#localizacao').screenshot({ path: 'artifacts/qa/location.png' });
    }
  });
}

test('grade diária e filtro de combinação vazia', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.plans .plan')).toHaveCount(4);
  await page.getByRole('button', { name: 'DOM', exact: true }).click();
  await expect(page.locator('.schedule-empty')).toContainText('descanso');
  await page.getByRole('button', { name: 'SEG', exact: true }).click();
  await expect(page.locator('.schedule-cards')).toContainText('Dança');
  await page.getByRole('button', { name: 'Ver grade completa e filtros' }).click();
  await page.locator('.filters select').nth(0).selectOption('7');
  await expect(page.locator('.table-wrap')).toContainText('Nenhuma aula');
});

test('cadastro envia dados, aguarda confirmação e apresenta ID sem abrir abas', async ({
  page,
  context,
}) => {
  let submitted;
  await page.route('**/trial-request', async (route) => {
    submitted = route.request().postDataJSON();
    await new Promise((resolve) => setTimeout(resolve, 300));
    await route.fulfill({
      status: 201,
      json: { id: 42, status: 'pending', message: 'Solicitação cadastrada com sucesso!' },
    });
  });
  await fillTrial(page);
  await page.getByText('Leia a política de privacidade').click();
  await expect(page.locator('.form-privacy')).toContainText(
    'transmitidos ao serviço e armazenados',
  );
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Solicitar aula experimental' })
    .click();
  await expect(page.getByRole('button', { name: 'Enviando…' })).toBeDisabled();
  await expect(page.getByRole('dialog')).toContainText('Cadastro realizado com sucesso!');
  await expect(page.getByRole('dialog')).toContainText('#42');
  expect(submitted).toMatchObject({
    client_name: 'Pessoa Teste',
    phone: '81999999999',
    email: 'teste@example.com',
    preferred_modality: 'Musculação',
    consent: true,
  });
  expect(context.pages()).toHaveLength(1);
  await page.getByRole('button', { name: 'Concluir', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('erro de gravação mantém formulário e não exibe sucesso', async ({ page }) => {
  await page.route('**/trial-request', (route) =>
    route.fulfill({
      status: 500,
      json: { error: { message: 'Serviço indisponível. Tente novamente mais tarde.' } },
    }),
  );
  await fillTrial(page);
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Solicitar aula experimental' })
    .click();
  await expect(page.getByRole('alert')).toContainText('Serviço indisponível');
  await expect(page.getByRole('dialog')).not.toContainText('Cadastro realizado com sucesso');
  await expect(page.getByLabel('Nome completo')).toHaveValue('Pessoa Teste');
});

test('resposta sem ID não é tratada como cadastro confirmado', async ({ page }) => {
  await page.route('**/trial-request', (route) =>
    route.fulfill({ status: 201, json: { status: 'pending' } }),
  );
  await fillTrial(page);
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Solicitar aula experimental' })
    .click();
  await expect(page.getByRole('alert')).toContainText('não confirmou o cadastro');
});

test('sinalizador demo legado não interrompe mais o cadastro integrado', async ({ page }) => {
  await page.route('**/site-data', (route) => route.fulfill({ json: { ...catalog, demo: true } }));
  await fillTrial(page);
  const submitted = page.waitForRequest((request) => request.url().endsWith('/trial-request'));
  await page
    .getByRole('dialog')
    .getByRole('button', { name: 'Solicitar aula experimental' })
    .click();
  await submitted;
  await expect(page.getByRole('dialog')).toContainText('#42');
});

test('falha de catálogo mostra erro e permite recuperação sem inventar dados', async ({ page }) => {
  let unavailable = true;
  await page.route('**/site-data', (route) =>
    unavailable ? route.abort() : route.fulfill({ json: catalog }),
  );
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Não foi possível carregar o catálogo');
  await expect(page.locator('.plans .plan')).toHaveCount(0);
  unavailable = false;
  await page.getByRole('button', { name: 'Tentar novamente', exact: true }).click();
  await expect(page.locator('.plans .plan')).toHaveCount(4);
});
