import { HeartHandshake, Dumbbell, Sparkles } from 'lucide-react';

export default function ValuesSection() {
  return (
    <section className="dark section values">
      <div className="container">
        <span className="eyebrow">O JEITO UNIACADEMY</span>
        <div className="three-grid">
          {[
            [
              HeartHandshake,
              'Você não treina sozinho.',
              'Orientação para adaptar o treino ao seu nível e aos seus objetivos.',
            ],
            [
              Dumbbell,
              'Espaço para evoluir.',
              'Força, cardio e salas dedicadas para diferentes formas de se movimentar.',
            ],
            [
              Sparkles,
              'Bem-estar por inteiro.',
              'Uma proposta de ambiente confortável, cuidado e acolhimento.',
            ],
          ].map(([Icon, title, text]) => (
            <article key={title}>
              <Icon className="accent" size={32} />
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
