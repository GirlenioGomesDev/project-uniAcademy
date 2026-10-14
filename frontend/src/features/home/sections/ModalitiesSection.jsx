import { ArrowUpRight } from 'lucide-react';
import SectionTitle from '../../../components/ui/SectionTitle';

export default function ModalitiesSection({ data, error, onRetry, onTrial }) {
  return (
    <section id="modalidades" className="section">
      <div className="container">
        <SectionTitle
          label="MODALIDADES"
          title="O que move você?"
          text="Quatro maneiras de entrar em movimento. Escolha a sua e confira o acesso em cada plano."
        />
        {data?.demo && (
          <p className="catalog-status" role="status">
            Catálogo demonstrativo • planos, aulas e horários ilustrativos.
            {data.source === 'offline-demo' && (
              <button className="text-button" onClick={onRetry}>
                Atualizar catálogo
              </button>
            )}
          </p>
        )}
        {error ? (
          <div className="error-panel" role="alert">
            <p>{error}</p>
            <button className="button" onClick={onRetry}>
              Tentar novamente
            </button>
          </div>
        ) : !data ? (
          <div className="four-grid" aria-label="Carregando catálogo" aria-busy="true">
            {[1, 2, 3, 4].map((i) => (
              <div className="skeleton" key={i} />
            ))}
          </div>
        ) : (
          <div className="four-grid modalities">
            {data.modalities.map((m) => (
              <article key={m.id}>
                <img src={m.image_url} alt={`Imagem ilustrativa de ${m.name}`} loading="lazy" />
                <h3>{m.name}</h3>
                <p className="muted">{m.description}</p>
                <small>{m.schedule_summary}</small>
                <button className="text-button" onClick={onTrial}>
                  Quero experimentar <ArrowUpRight size={18} />
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
