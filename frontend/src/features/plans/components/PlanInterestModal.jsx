import { useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, Check, ClipboardCheck, ShieldCheck } from 'lucide-react';
import Modal from '../../../components/ui/Modal';
import { formatCurrency, getRecifeDate } from '../../../config/academy';
import usePlanInterest from '../hooks/usePlanInterest';
import { getPlanBenefits } from '../services/planPresentation';
import PlanBillingSummary from './PlanBillingSummary';

export default function PlanInterestModal({ plan, onClose }) {
  const { fields, draft, error, update, review, edit } = usePlanInterest(plan);
  const heading = useRef(null);
  const dayUse = Number(plan.duration_months) === 0;
  const onChange = (event) =>
    update(
      event.target.name,
      event.target.type === 'checkbox' ? event.target.checked : event.target.value,
    );
  useEffect(() => {
    if (draft) {
      heading.current?.focus({ preventScroll: true });
      heading.current?.closest('dialog')?.scrollTo({ top: 0 });
    }
  }, [draft]);

  return (
    <Modal titleId="plan-interest-title" onClose={onClose} className="plan-interest-modal">
      <div className="plan-interest-layout">
        <aside className="plan-selection-summary">
          <span className="plan-step-label">SEU PRÓXIMO MOVIMENTO</span>
          <span className="plan-selected-tag">Plano selecionado</span>
          <h2 id="plan-interest-title">{plan.name}</h2>
          <p className="plan-summary-price">
            {formatCurrency(plan.price)}
            <span>/{dayUse ? 'dia' : 'mês'}</span>
          </p>
          <p className="plan-summary-terms">{plan.payment_terms}</p>
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
          <div className="plan-progress" aria-label={`Etapa ${draft ? '2' : '1'} de 2`}>
            <span
              className={draft ? 'complete' : 'current'}
              aria-current={draft ? undefined : 'step'}
            >
              1 <b>Seus dados</b>
            </span>
            <i aria-hidden="true" />
            <span className={draft ? 'current' : ''} aria-current={draft ? 'step' : undefined}>
              2 <b>Revisão</b>
            </span>
          </div>
          {draft ? (
            <section className="plan-preview" aria-labelledby="plan-preview-title">
              <ClipboardCheck size={38} className="plan-preview-icon" />
              <h3 id="plan-preview-title" ref={heading} tabIndex={-1}>
                Confira seu interesse no {plan.name}
              </h3>
              <p className="plan-preview-description">Sua prévia está pronta para revisão.</p>
              <details className="plan-review-contact">
                <summary>Conferir dados de contato e data</summary>
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
                    <dt>{dayUse ? 'Dia da visita' : 'Início desejado'}</dt>
                    <dd>
                      {new Intl.DateTimeFormat('pt-BR').format(
                        new Date(`${draft.preferred_date}T12:00:00Z`),
                      )}
                    </dd>
                  </div>
                </dl>
              </details>
              <PlanBillingSummary plan={plan} date={draft.preferred_date} />
              <div className="plan-local-notice" role="status">
                <ShieldCheck size={21} />
                <p>
                  <strong>Prévia somente neste navegador.</strong> Nada foi enviado, registrado ou
                  cobrado. A solicitação de interesse ficará disponível após a integração do
                  cadastro de planos.
                </p>
              </div>
              <div className="plan-review-total">
                <span>
                  <strong>Total</strong> <small>1ª cobrança prevista</small>
                </span>
                <strong>{formatCurrency(plan.price)}</strong>
              </div>
              <div className="plan-form-actions">
                <button type="button" className="button" onClick={edit}>
                  <ArrowLeft size={17} />
                  Editar dados
                </button>
                <button type="button" className="button primary" onClick={onClose}>
                  Finalizar prévia <Check size={17} />
                </button>
              </div>
            </section>
          ) : (
            <form className="plan-interest-form" onSubmit={review}>
              <h3>Vamos encontrar seu ritmo.</h3>
              <p>
                Preencha seus dados para revisar o interesse no <strong>{plan.name}</strong>. Esta
                etapa é uma prévia, sem envio.
              </p>
              <label htmlFor="plan-client-name">Nome completo</label>
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
                  <label htmlFor="plan-phone">Telefone com DDD</label>
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
                  <label htmlFor="plan-email">E-mail</label>
                  <input
                    id="plan-email"
                    name="email"
                    value={fields.email}
                    onChange={onChange}
                    type="email"
                    autoComplete="email"
                    maxLength={254}
                    required
                    placeholder="voce@exemplo.com"
                  />
                </div>
              </div>
              <div className="plan-form-grid">
                <div>
                  <label htmlFor="plan-date">{dayUse ? 'Dia da visita' : 'Início desejado'}</label>
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
              <small id="plan-date-help" className="plan-field-help">
                Todos os planos: seg–sex, 06h–23h; sábado, 08h–14h; domingos e feriados, fechado.{' '}
                Datas sujeitas à confirmação da equipe.
              </small>
              <label htmlFor="plan-experience">
                Como está sua rotina de treino? <span>(opcional)</span>
              </label>
              <select
                id="plan-experience"
                name="experience_level"
                value={fields.experience_level}
                onChange={onChange}
              >
                <option value="">Prefiro informar depois</option>
                <option value="beginner">Estou começando</option>
                <option value="returning">Estou voltando a treinar</option>
                <option value="regular">Já treino com frequência</option>
              </select>
              <label className="consent" htmlFor="plan-marketing-consent">
                <input
                  id="plan-marketing-consent"
                  type="checkbox"
                  name="marketing_consent"
                  checked={fields.marketing_consent}
                  onChange={onChange}
                />
                <span>
                  Aceito receber comunicações com novidades e promoções pelos contatos informados.{' '}
                  <strong>Opcional.</strong> Esta preferência só será enviada após a futura
                  integração.
                </span>
              </label>
              <label className="consent" htmlFor="plan-consent">
                <input
                  id="plan-consent"
                  type="checkbox"
                  name="consent"
                  checked={fields.consent}
                  onChange={onChange}
                  required
                />
                <span>
                  Li as informações de privacidade e os termos abaixo e autorizo o uso dos dados
                  para elaborar esta prévia local, sem envio ou armazenamento.
                </span>
              </label>
              <details className="plan-legal">
                <summary>Política de privacidade e termos de uso</summary>
                <p>
                  Os dados são usados somente para montar a revisão neste navegador e são
                  descartados ao fechar o modal. Nesta etapa não há conta, contratação, cobrança ou
                  envio de comunicações. O cadastro e as condições de pagamento precisam de
                  integração e confirmação da equipe. Nos testes acadêmicos, utilize dados
                  fictícios.
                </p>
              </details>
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              <button className="button primary plan-review-button">
                Revisar interesse <ArrowRight size={19} />
              </button>
              <p className="plan-form-footnote">
                Sem cobrança, sem envio e sem confirmação de matrícula.
              </p>
            </form>
          )}
        </div>
      </div>
    </Modal>
  );
}
