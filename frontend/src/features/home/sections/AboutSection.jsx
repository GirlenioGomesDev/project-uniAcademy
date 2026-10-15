import { photo } from '../data/content';

export default function AboutSection() {
  return (
    <section id="sobre" className="section">
      <div className="container about">
        <figure>
          <img src={photo('photo-1571019613454-1cb2f99b2d8b')} alt="Orientação durante um treino" />
          <figcaption>Do primeiro treino à sua próxima conquista.</figcaption>
        </figure>
        <div>
          <span className="eyebrow">01 / NOSSA ESSÊNCIA</span>
          <h2>Seu ritmo é o nosso ponto de partida.</h2>
          <p className="muted">
            A UniAcademy nasce como uma proposta para tornar o movimento mais acessível em Recife,
            com um ambiente acolhedor e atenção às pessoas.
          </p>
          <p className="muted">
            Força, saúde e constância. Uma experiência que reúne musculação, cardio e aulas em
            grupo, respeitando seu momento e seus objetivos.
          </p>
          <blockquote>
            “Não é sobre acompanhar os outros. É sobre encontrar o que move você.”
          </blockquote>
        </div>
      </div>
    </section>
  );
}
