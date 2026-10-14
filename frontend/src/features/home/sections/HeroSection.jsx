import { ArrowUpRight, Check } from 'lucide-react';
import { photo } from '../data/content';

export default function HeroSection({ onTrial }) {
  return (
    <section
      id="inicio"
      className="hero"
      style={{
        backgroundImage: `linear-gradient(90deg,rgba(14,11,18,.96),rgba(14,11,18,.73) 45%,rgba(14,11,18,.15)),url(${photo('photo-1581009146145-b5ef050c2e1e', 2000)})`,
      }}
    >
      <div className="container hero-content">
        <span className="eyebrow">MAIS MOVIMENTO. MAIS VOCÊ.</span>
        <h1>
          Encontre seu
          <br />
          ritmo.
          <br />
          <span>Sinta o seu ritmo.</span>
        </h1>
        <p>
          Um lugar para começar, evoluir e se sentir bem. Treino com orientação,
          <br className="desktop" /> energia e espaço para ser você.
        </p>
        <div className="actions">
          <button className="button primary" onClick={onTrial}>
            Solicitar aula experimental <ArrowUpRight size={20} />
          </button>
          <a className="button white" href="#planos">
            Conhecer os planos <ArrowUpRight size={20} />
          </a>
        </div>
        <p className="hero-note">
          <Check size={20} /> Para iniciantes e para quem quer recomeçar.
        </p>
        <div className="hero-location">
          <img className="hero-logo" src="/logo.jpg" alt="Logo da UniAcademy" />
        </div>
      </div>
    </section>
  );
}
