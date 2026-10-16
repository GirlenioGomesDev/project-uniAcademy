import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import { demoCatalog } from '../../shared/siteCatalog.js';
import { getRecifeDate } from '../src/config/academy.js';
import { buildSchedule, getScheduleSummary } from '../src/features/home/services/schedule.js';
import { preparePlanInterest } from '../src/features/plans/services/planInterest.js';
import { getBillingPreview } from '../src/features/plans/services/billingPreview.js';

const catalog = { ...demoCatalog, demo: false };
test.beforeEach(async ({ page }) => {
  await page.route('**/site-data', (route) => route.fulfill({ json: catalog }));
  // No plan enrollment or trial request should be written by this test suite.
  await page.route('**/trial-request', (route) => route.abort());
});

function nextDay(weekday) {
  const start = new Date(`${getRecifeDate()}T12:00:00Z`);
  while (start.getUTCDay() !== weekday) start.setUTCDate(start.getUTCDate() + 1);
  return start.toISOString().slice(0, 10);
}

async function openPlan(page, name) {
  await page.goto('/');
  await page.getByRole('button', { name: `Tenho interesse no plano ${name}`, exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
}

async function fillInterest(page, date) {
  await page.getByLabel('Nome completo', { exact: true }).fill('Pessoa Teste');
  await page.getByLabel('Telefone com DDD', { exact: true }).fill('(81) 99999-9999');
  await page.getByLabel('E-mail', { exact: true }).fill('teste@example.com');
  await page.locator('#plan-date').fill(date);
  await page.locator('#plan-consent').check();
}

for (const width of [360, 768, 1440]) {
  test(`cada plano abre sua própria prévia responsiva em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    for (const plan of catalog.plans) {
      const trigger = page.getByRole('button', {
        name: `Tenho interesse no plano ${plan.name}`,
        exact: true,
      });
      await trigger.click();
      const dialog = page.getByRole('dialog');
      await expect(dialog).toHaveAccessibleName(plan.name);
      await expect(dialog.locator('.plan-summary-price')).toContainText(
        Number(plan.price).toFixed(2).replace('.', ','),
      );
      await expect(dialog.getByRole('button', { name: 'Revisar interesse' })).toBeVisible();
      expect(
        await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth + 1),
      ).toBe(true);
      if (plan.name === 'Plus' && width !== 768) {
        fs.mkdirSync('artifacts/qa', { recursive: true });
        await dialog.screenshot({
          path: `artifacts/qa/plan-plus-${width}.png`,
          animations: 'disabled',
        });
      }
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(trigger).toBeFocused();
    }
  });
}

test('interesse no Plus revisa dados sem nenhuma requisição de cadastro', async ({ page }) => {
  let writes = 0;
  page.on('request', (request) => {
    if (request.method() !== 'GET' && request.method() !== 'HEAD') writes++;
  });
  await openPlan(page, 'Plus');
  await fillInterest(page, nextDay(1), '16:00-23:00');
  await page.getByRole('button', { name: 'Revisar interesse', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Confira seu interesse no Plus' })).toBeFocused();
  await page.getByText('Conferir dados de contato e data', { exact: true }).click();
  await expect(page.locator('.plan-review-list')).toContainText('Pessoa Teste');
  await expect(page.locator('.plan-review-list')).toContainText('81999999999');
  await expect(page.locator('.plan-local-notice')).toContainText(
    'Ao confirmar, seus dados serão enviados à academia',
  );
  expect(writes).toBe(0);
  await page.getByRole('button', { name: 'Editar dados' }).click();
  await expect(page.getByLabel('Nome completo', { exact: true })).toHaveValue('Pessoa Teste');
});

for (const plan of catalog.plans) {
  test(`${plan.name} tem acesso completo, sem preferência de horário, e abre a revisão`, async ({
    page,
  }) => {
    await openPlan(page, plan.name);
    await expect(page.getByRole('dialog')).not.toContainText('Acesso das 10h às 16h');
    await fillInterest(page, nextDay(1));
    await expect(page.locator('#plan-time')).toHaveCount(0);
    await page.getByRole('button', { name: 'Revisar interesse' }).click();
    await expect(
      page.getByRole('heading', { name: `Confira seu interesse no ${plan.name}` }),
    ).toBeVisible();
    await expect(page.locator('.plan-progress .current')).toContainText('Revisão');
    await expect(page.locator('.plan-contract-total')).toContainText('Total previsto');
    await expect(page.locator('.plan-billing-summary')).toContainText('1ª cobrança prevista');
    await page.getByRole('button', { name: 'Editar dados' }).click();
    await page.locator('#plan-date').fill(nextDay(6));
    await page.getByRole('button', { name: 'Revisar interesse' }).click();
    await expect(
      page.getByRole('heading', { name: `Confira seu interesse no ${plan.name}` }),
    ).toBeVisible();
    await expect(page.locator('.plan-review-list')).not.toContainText('Preferência de horário');
    if (plan.name === 'Light') {
      fs.mkdirSync('artifacts/qa', { recursive: true });
      await page
        .getByRole('dialog')
        .screenshot({ path: 'artifacts/qa/plan-review.png', animations: 'disabled' });
    }
  });
}

test('Day-use diferencia data de visita e respeita o sábado 08h–14h', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 900 });
  await openPlan(page, 'Day-use');
  await expect(page.getByLabel('Dia da visita', { exact: true })).toBeVisible();
  await fillInterest(page, nextDay(6));
  await page.getByRole('button', { name: 'Revisar interesse' }).click();
  await expect(page.locator('.billing-single-use')).toContainText('não tem cobrança recorrente');
  await expect(page.getByText('Próxima mensalidade prevista', { exact: true })).toHaveCount(0);
  await expect(
    page.getByRole('button', { name: 'Confirmar interesse', exact: true }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('dias, horários e nomes ficam sincronizados entre os cartões e a tabela', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'TER', exact: true }).click();
  await expect(page.locator('.schedule-cards')).toContainText('Treinamento funcional');
  await page.getByRole('button', { name: 'Ver grade completa e filtros' }).click();
  await expect(page.getByLabel('Dia da grade')).toHaveValue('2');
  await page.getByLabel('Dia da grade').selectOption('6');
  await expect(page.getByRole('button', { name: 'SÁB', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.locator('.schedule-cards')).toContainText('08h–14h');
  await expect(page.locator('.table-wrap')).toContainText('08:00–14:00');
  await page.getByRole('button', { name: 'TER', exact: true }).click();
  await page
    .getByRole('button', { name: 'Solicitar aula de Treinamento funcional 18:30', exact: true })
    .click();
  await expect(page.getByLabel('Modalidade', { exact: true })).toHaveValue('Funcional');
});

test('grade fora do expediente é sinalizada sem inventar horários ou permitir reserva', async ({
  page,
}) => {
  await page.route('**/site-data', (route) =>
    route.fulfill({
      json: {
        ...catalog,
        schedules: [
          {
            id: 90,
            weekday: 6,
            modality_name: 'Dança',
            time_slot: '19:00',
            instructor: 'Equipe',
            room: 'Estúdio',
          },
        ],
      },
    }),
  );
  await page.goto('/');
  await page.getByRole('button', { name: 'SÁB', exact: true }).click();
  await expect(page.locator('.schedule-invalid')).toContainText('Dança e ritmos');
  await expect(page.locator('.schedule-invalid')).toContainText('Fora do expediente');
  await expect(
    page.getByRole('button', { name: 'Solicitar aula de Dança e ritmos 19:00' }),
  ).toHaveCount(0);
});

test('modelo de horários e contrato de interesse usam dados consistentes', () => {
  const rows = buildSchedule(catalog.schedules);
  expect(rows.filter((row) => row.kind === 'gym')).toHaveLength(6);
  expect(rows.every((row) => row.withinHours)).toBe(true);
  expect(getScheduleSummary('Funcional', catalog.schedules)).toContain('18:30');
  const dto = preparePlanInterest(catalog.plans[1], {
    client_name: 'Pessoa Teste',
    phone: '(81) 99999-9999',
    email: 'teste@example.com',
    preferred_date: nextDay(1),
    consent: true,
  });
  expect(dto.plan_id).toBe(2);
  expect(dto.phone).toBe('81999999999');
  expect(dto).not.toHaveProperty('price');
  expect(dto).not.toHaveProperty('preferred_time');
  expect(dto.marketing_consent).toBe(false);
});

test('prévia mensal calcula próxima data sem ultrapassar o mês e Day-use não repete cobrança', () => {
  expect(getBillingPreview(catalog.plans[1], '2027-01-31').nextDate).toBe('2027-02-28');
  expect(getBillingPreview(catalog.plans[1], '2028-01-31').nextDate).toBe('2028-02-29');
  expect(getBillingPreview(catalog.plans[3], '2028-01-31').nextDate).toBe(null);
});

test('comunicações são opcionais e domingo não permite avançar à revisão', async ({ page }) => {
  await openPlan(page, 'Plus');
  await expect(page.locator('#plan-marketing-consent')).not.toBeChecked();
  await fillInterest(page, nextDay(0));
  await page.getByRole('button', { name: 'Revisar interesse' }).click();
  await expect(page.getByRole('alert')).toContainText('não funciona aos domingos');
  await expect(page.locator('.plan-billing-summary')).toHaveCount(0);
});
