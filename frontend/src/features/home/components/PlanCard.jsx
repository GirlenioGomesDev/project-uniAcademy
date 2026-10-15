import { ArrowUpRight, Check } from 'lucide-react';
import { getPlanBenefits } from '../../plans/services/planPresentation';

export default function PlanCard({ plan, onSelect }) {
  const [whole, cents] = Number(plan.price).toFixed(2).split('.');

  return (
    <article className={plan.is_featured ? 'plan featured' : 'plan'}>
      <div className="plan-top">
        <h3>{plan.name}</h3>
        {plan.is_featured && <span className="badge">MAIS ESCOLHIDO</span>}
      </div>
      <div className="price">
        <span>R$</span>
        <strong>{whole}</strong>
        <span>,{cents}</span>
        <small>/{plan.duration_months === 0 ? 'dia' : 'mês'}</small>
      </div>
      <p className="muted terms">{plan.payment_terms}</p>
      <ul>
        {getPlanBenefits(plan).map((benefit) => (
          <li key={benefit}>
            <Check size={18} />
            {benefit}
          </li>
        ))}
      </ul>
      <button
        className={`button ${plan.is_featured ? 'primary' : ''}`}
        onClick={() => onSelect(plan)}
        aria-label={`Tenho interesse no plano ${plan.name}`}
        aria-haspopup="dialog"
      >
        Tenho interesse <ArrowUpRight size={18} />
      </button>
    </article>
  );
}
