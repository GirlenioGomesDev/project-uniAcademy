import PlanCard from '../components/PlanCard';
import SectionTitle from '../../../components/ui/SectionTitle';

export default function PlansSection({ data, error, onTrial }) {
  return (
    <section id="planos" className="section plans-section">
      <div className="container">
        <SectionTitle
          label="PLANOS SEM COMPLICAÇÃO"
          title="Invista no seu próximo passo."
          text="Preços acessíveis, escolhas claras. Sem taxa de adesão e com benefícios para cada rotina."
        />
        {data ? (
          <div className="four-grid plans">
            {data.plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onTrial={onTrial} />
            ))}
          </div>
        ) : (
          <p className="muted">
            {error ? 'Planos indisponíveis. Tente recarregar o catálogo.' : 'Carregando planos…'}
          </p>
        )}
        <small className="disclaimer">
          Proposta comercial demonstrativa. Valores, benefícios e condições precisam ser aprovados
          pela academia antes de divulgação comercial.
        </small>
      </div>
    </section>
  );
}
