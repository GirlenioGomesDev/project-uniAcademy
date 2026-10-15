import { CreditCard, Wallet, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../../../config/academy';
import { getBillingPreview } from '../services/billingPreview';

const formatDate = (value) =>
  new Intl.DateTimeFormat('pt-BR').format(new Date(`${value}T12:00:00Z`));

export default function PlanBillingSummary({ plan, date }) {
  const preview = getBillingPreview(plan, date);
  return (
    <div className="plan-billing-summary">
      <div className="plan-contract-total">
        <div>
          <span>Plano {plan.name}</span>
          <strong>{formatCurrency(preview.amount)}</strong>
        </div>
        <div className="contract-total-row">
          <b>Total previsto</b>
          <strong>{formatCurrency(preview.amount)}</strong>
        </div>
      </div>
      <h4 className="billing-section-title">
        Cobranças detalhadas <span>prévia</span>
      </h4>
      <div className="billing-charge">
        <div>
          <strong>1ª cobrança prevista</strong>
          <time dateTime={preview.firstDate}>{formatDate(preview.firstDate)}</time>
        </div>
        <div>
          <span>{preview.label}</span>
          <span>{formatCurrency(preview.amount)}</span>
        </div>
      </div>
      {preview.nextDate ? (
        <div className="billing-charge">
          <div>
            <strong>Próxima mensalidade prevista</strong>
            <time dateTime={preview.nextDate}>{formatDate(preview.nextDate)}</time>
          </div>
          <div>
            <span>{preview.label}</span>
            <span>{formatCurrency(preview.amount)}</span>
          </div>
        </div>
      ) : (
        <p className="billing-single-use">
          Pagamento único previsto. O Day-use não tem cobrança recorrente.
        </p>
      )}
      <p className="billing-estimate-note">
        Valores e datas ilustrativos, sujeitos à confirmação. Nenhum contrato ou pagamento é criado
        nesta prévia.
      </p>
      <div className="plan-payment-preview">
        <span>Formas de pagamento previstas</span>
        <div>
          <span>
            <Wallet size={18} />
            Pix
          </span>
          <span>
            <CreditCard size={18} />
            Cartão
          </span>
        </div>
        <small>Disponibilidade depende da futura integração de pagamentos.</small>
      </div>
      <div className="plan-safe-preview">
        <ShieldCheck size={24} />
        <p>
          <strong>Sem dados bancários nesta etapa</strong>Não solicitamos número de cartão, código
          de segurança ou pagamento.
        </p>
      </div>
    </div>
  );
}
