import { MapPin, Clock, HeartHandshake } from 'lucide-react';

export default function InfoBar() {
  return (
    <div className="info-bar">
      <div className="container info-grid">
        {[
          [MapPin, 'Bem perto de você', 'Recife • Pernambuco'],
          [Clock, 'Seu tempo, seu treino', 'Seg–sex 06h–23h • Sáb 08h–14h'],
          [HeartHandshake, 'Comece com apoio', 'Orientação em cada etapa'],
        ].map(([Icon, title, text]) => (
          <div key={title}>
            <Icon />
            <div>
              <strong>{title}</strong>
              <span>{text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
