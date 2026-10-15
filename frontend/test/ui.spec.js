import { test, expect } from '@playwright/test';
import fs from 'node:fs';

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

test('simulação não transmite dados e política fica disponível antes do envio', async ({
  page,
}) => {
  let requests = 0;
  page.on('request', (request) => {
    if (request.url().includes('trial-request')) requests++;
  });
  await page.goto('/');
  await expect(page.locator('.plans .plan')).toHaveCount(4);
  await page.locator('.hero').getByRole('button', { name: 'Solicitar aula experimental' }).click();
  await page.getByLabel('Nome completo').fill('Pessoa Teste');
  await page.getByLabel('Telefone com DDD').fill('81999999999');
  await page.getByLabel('E-mail', { exact: true }).fill('teste@example.com');
  await page.getByLabel('Modalidade', { exact: true }).selectOption({ label: 'Musculação' });
  await page.getByText('Leia a política de privacidade').click();
  await expect(page.locator('.form-privacy')).toContainText('Seus direitos');
  await page.locator('input[name="consent"]').check();
  await page.getByRole('button', { name: 'Simular solicitação' }).click();
  await expect(page.getByRole('dialog')).toContainText('Nenhum dado foi armazenado');
  expect(requests).toBe(0);
});

test('frontend isolado recupera catálogo demonstrativo após falha de conexão', async ({ page }) => {
  await page.route('**/api/site-data', (route) => route.abort());
  await page.goto('/');
  await expect(page.locator('.plans .plan')).toHaveCount(4);
  await expect(page.getByRole('button', { name: 'Atualizar catálogo' })).toBeVisible();
});
