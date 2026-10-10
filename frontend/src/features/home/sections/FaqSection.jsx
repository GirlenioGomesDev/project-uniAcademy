import { faq } from '../data/content';

export default function FaqSection() {
  return (
    <section className="section">
      <div className="container faq">
        <div>
          <span className="eyebrow">09 / SEM DÚVIDA</span>
          <h2>
            Antes do
            <br />
            primeiro treino.
          </h2>
          <p className="muted">As respostas para começar com tranquilidade.</p>
        </div>
        <div>
          {faq.map(([q, a]) => (
            <details key={q} open>
              <summary>{q}</summary>
              <p className="muted">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
