
import { useEffect, useRef } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ClipboardCheck,
  ShieldCheck,
} from 'lucide-react';

import Modal from '../../../components/ui/Modal';
import {
  formatCurrency,
  getRecifeDate,
} from '../../../config/academy';
import usePlanInterest from '../hooks/usePlanInterest';
import { getPlanBenefits } from '../services/planPresentation';
import PlanBillingSummary from './PlanBillingSummary';

export default function PlanInterestModal({ plan, onClose }) {
  const {
    fields,
    draft,
    error,
    state,
    result,
    update,
    review,
    confirm,
    edit,
  } = usePlanInterest(plan);

  const heading = useRef(null);
  const dayUse = Number(plan.duration_months) === 0;
  const isLoading = state === 'loading';

  function onChange(event) {
    update(
      event.target.name,
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value,
    );
  }

  function handleClose() {
    if (!isLoading) {
      onClose();
    }
  }

  useEffect(() => {
    if (draft || result) {
      heading.current?.focus({ preventScroll: true });
      heading.current?.closest('dialog')?.scrollTo({ top: 0 });
    }
  }, [draft, result]);

  return (
    <Modal
      titleId="plan-interest-title"
      onClose={handleClose}
      className="plan-interest-modal"
    >
      <div className="plan-interest-layout">
        <aside className="plan-selection-summary">
          <span className="plan-step-label">
            SEU PRÓXIMO MOVIMENTO
          </span>

          <span className="plan-selected-tag">
            Plano selecionado
          </span>

          <h2 id="plan-interest-title">{plan.name}</h2>

          <p className="plan-summary-price">
            {formatCurrency(plan.price)}
            <span>/{dayUse ? 'dia' : 'mês'}</span>
          </p>

          <p className="plan-summary-terms">
            {plan.payment_terms}
          </p>

          <ul>
            {getPlanBenefits(plan).map((benefit) => (
              <li key={benefit}>
                <Check size={17} aria-hidden="true" />
                {benefit}
              </li>
            ))}
          </ul>

          <div className="plan-summary-note">
            <ShieldCheck size={20} />
            <p>
              Sem pagamento nesta etapa.
              <br />
              Nenhuma matrícula é confirmada.
            </p>
          </div>
        </aside>

        <div className="plan-interest-content">
          <div
            className="plan-progress"
            aria-label={`Etapa ${draft ? 2 : 1} de 2`}
          >
            <span
              className={draft ? 'complete' : 'current'}
              aria-current={draft ? undefined : 'step'}
            >
              1 <b>Seus dados</b>
            </span>

            <i aria-hidden="true" />

            <span
              className={draft ? 'current' : ''}
              aria-current={draft ? 'step' : undefined}
            >
              2 <b>Revisão</b>
            </span>
          </div>

          {result ? (
            <section
              className="plan-preview"
              aria-labelledby="plan-success-title"
              role="status"
            >
              <ClipboardCheck
                size={38}
                className="plan-preview-icon"
              />

              <h3
                id="plan-success-title"
                ref={heading}
                tabIndex={-1}
              >
                Interesse registrado com sucesso!
              </h3>

              <p className="plan-preview-description">
                Sua solicitação #{result.id} foi registrada
                para o plano {result.plan?.name || plan.name}.
              </p>

              <div className="plan-local-notice">
                <ShieldCheck size={21} />
                <p>
                  <strong>
                    Status: aguardando confirmação.
                  </strong>
                  <br />
                  {result.replayed
                    ? 'Esta solicitação já estava registrada. Nenhum cadastro duplicado foi criado.'
                    : 'Seu interesse foi recebido. A solicitação está pendente de análise pela equipe.'}
                </p>
              </div>

              <p>
                Este registro não representa matrícula
                confirmada nem pagamento realizado.
              </p>

              <div className="plan-form-actions">
                <button
                  type="button"
                  className="button primary"
                  onClick={onClose}
                >
                  Fechar <Check size={17} />
                </button>
              </div>
            </section>
          ) : draft ? (
            <section
              className="plan-preview"
              aria-labelledby="plan-preview-title"
            >
              <ClipboardCheck
                size={38}
                className="plan-preview-icon"
              />

              <h3
                id="plan-preview-title"
                ref={heading}
                tabIndex={-1}
              >
                Confira seu interesse no {plan.name}
              </h3>

              <p className="plan-preview-description">
                Revise os dados antes de registrar
                sua solicitação.
              </p>

              <details className="plan-review-contact">
                <summary>
                  Conferir dados de contato e data
                </summary>

                <dl className="plan-review-list">
                  <div>
                    <dt>Nome</dt>
                    <dd>{draft.client_name}</dd>
                  </div>

                  <div>
                    <dt>Telefone</dt>
                    <dd>{draft.phone}</dd>
                  </div>

                  <div>
                    <dt>E-mail</dt>
                    <dd>{draft.email}</dd>
                  </div>

                  <div>
                    <dt>
                      {dayUse
                        ? 'Dia da visita'
                        : 'Início desejado'}
                    </dt>
                    <dd>
                      {new Intl.DateTimeFormat('pt-BR').format(
                        new Date(
                          `${draft.preferred_date}T12:00:00Z`,
                        ),
                      )}
                    </dd>
                  </div>
                </dl>
              </details>

              <PlanBillingSummary
                plan={plan}
                date={draft.preferred_date}
              />

              <div className="plan-local-notice">
                <ShieldCheck size={21} />
                <p>
                  <strong>
                    Confirmação de interesse.
                  </strong>
                  <br />
                  Ao confirmar, seus dados serão enviados
                  à academia para registrar seu interesse
                  no plano. Não haverá cobrança ou
                  matrícula automática.
                </p>
              </div>

              <div className="plan-review-total">
                <span>
                  <strong>Total</strong>
                  <small> 1ª cobrança prevista</small>
                </span>

                <strong>{formatCurrency(plan.price)}</strong>
              </div>

              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}

              <div className="plan-form-actions">
                <button
                  type="button"
                  className="button"
                  onClick={edit}
                  disabled={isLoading}
                >
                  <ArrowLeft size={17} />
                  Editar dados
                </button>

                <button
                  type="button"
                  className="button primary"
                  onClick={confirm}
                  disabled={isLoading}
                  aria-busy={isLoading}
                >
                  {isLoading
                    ? 'Registrando...'
                    : 'Confirmar interesse'}

                  {!isLoading && <Check size={17} />}
                </button>
              </div>
            </section>
          ) : (
            <form
              className="plan-interest-form"
              onSubmit={review}
            >
              <h3>Vamos encontrar seu ritmo.</h3>

              <p>
                Preencha seus dados para revisar o
                interesse no <strong>{plan.name}</strong>.
                O envio acontecerá somente após sua
                confirmação.
              </p>

              <label htmlFor="plan-client-name">
                Nome completo
              </label>

              <input
                id="plan-client-name"
                name="client_name"
                value={fields.client_name}
                onChange={onChange}
                autoComplete="name"
                minLength={3}
                maxLength={120}
                required
                placeholder="Como você gostaria de ser chamado?"
              />

              <div className="plan-form-grid">
                <div>
                  <label htmlFor="plan-phone">
                    Telefone com DDD
                  </label>

                  <input
                    id="plan-phone"
                    name="phone"
                    value={fields.phone}
                    onChange={onChange}
                    type="tel"
                    autoComplete="tel"
                    maxLength={20}
                    required
                    placeholder="(81) 99999-9999"
                  />
                </div>

                <div>
                  <label htmlFor="plan-email">
                    E-mail
                  </label>

                  <input
                    id="plan-email"
                    name="email"
                    value={fields.email}
                    onChange={onChange}
                    type="email"
                    maxLength={254}
                    autoComplete="email"
                    required
                    placeholder="voce@exemplo.com"
                  />
                </div>
              </div>

              <div className="plan-form-grid">
                <div>
                  <label htmlFor="plan-date">
                    {dayUse
                      ? 'Dia da visita'
                      : 'Início desejado'}
                  </label>

                  <input
                    id="plan-date"
                    name="preferred_date"
                    type="date"
                    value={fields.preferred_date}
                    onChange={onChange}
                    min={getRecifeDate()}
                    required
                    aria-describedby="plan-date-help"
                  />
                </div>
              </div>

              <small
                id="plan-date-help"
                className="plan-field-help"
              >
                Todos os planos: seg–sex, 06h–23h;
                sábado, 08h–14h; domingos e feriados,
                fechado. Datas sujeitas à confirmação
                da equipe.
              </small>

              <label htmlFor="plan-experience">
                Como está sua rotina de treino?
                <span> (opcional)</span>
              </label>

              <select
                id="plan-experience"
                name="experience_level"
                value={fields.experience_level}
                onChange={onChange}
              >
                <option value="">
                  Prefiro informar depois
                </option>
                <option value="beginner">
                  Estou começando
                </option>
                <option value="returning">
                  Estou voltando a treinar
                </option>
                <option value="regular">
                  Já treino com frequência
                </option>
              </select>

              <label
                className="consent"
                htmlFor="plan-marketing-consent"
              >
                <input
                  id="plan-marketing-consent"
                  type="checkbox"
                  name="marketing_consent"
                  checked={fields.marketing_consent}
                  onChange={onChange}
                />

                <span>
                  Aceito receber comunicações com
                  novidades e promoções pelos contatos
                  informados. <strong>Opcional.</strong>
                </span>
              </label>

              <label
                className="consent"
                htmlFor="plan-consent"
              >
                <input
                  id="plan-consent"
                  type="checkbox"
                  name="consent"
                  checked={fields.consent}
                  onChange={onChange}
                  required
                />

                <span>
                  Autorizo o envio e o armazenamento dos
                  dados informados para registrar meu
                  interesse no plano e permitir o contato
                  da academia.
                </span>
              </label>

              <details className="plan-legal">
                <summary>
                  Informações de privacidade e termos
                </summary>

                <p>
                  Ao confirmar, nome, telefone, e-mail,
                  plano escolhido e data desejada serão
                  enviados ao serviço da academia e
                  armazenados para atendimento da
                  solicitação. A autorização para
                  comunicações promocionais é opcional.
                  Nenhuma matrícula ou cobrança é feita
                  nesta etapa. Para testes acadêmicos,
                  utilize dados fictícios.
                </p>
              </details>

              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="button primary plan-review-button"
              >
                Revisar interesse
                <ArrowRight size={19} />
              </button>

              <p className="plan-form-footnote">
                Sem cobrança e sem confirmação de
                matrícula nesta etapa.
              </p>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
}
