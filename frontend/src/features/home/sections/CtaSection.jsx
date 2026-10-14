import { ArrowUpRight } from 'lucide-react';

export default function CtaSection({ onTrial }) {
  return (
    <section className="cta section">
      <div className="container cta-layout">
        <div>
          <span className="eyebrow">SEU PRIMEIRO MOVIMENTO</span>
          <h2>
            Você traz a vontade.
            <br />A gente começa junto.
          </h2>
          <p className="muted">Conheça a proposta, encontre seu ritmo e dê o próximo passo.</p>
        </div>
        <div>
          <button className="button primary" onClick={onTrial}>
            Solicitar aula experimental <ArrowUpRight size={20} />
          </button>
          <small>
            Gratuita • Sem compromisso
            <br />
            Confirmação da disponibilidade pelo WhatsApp.
          </small>
        </div>
      </div>
    </section>
  );
}
