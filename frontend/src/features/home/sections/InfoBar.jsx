import { MapPin, Clock, HeartHandshake } from 'lucide-react';
import { OPENING_SUMMARY } from '../../../config/academy';

export default function InfoBar() {
  return (
    <div className="info-bar">
      <div className="container info-grid">
        {[
          [MapPin, 'Bem perto de você', 'Recife • Pernambuco'],
          [Clock, 'Seu tempo, seu treino', OPENING_SUMMARY],
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
