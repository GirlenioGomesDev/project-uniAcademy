import { MapPin, Check } from 'lucide-react';
import Brand from '../../../components/ui/Brand';

export default function LocationSection() {
  return (
    <section id="localizacao" className="section location-section">
      <div className="container about">
        <div>
          <span className="eyebrow">07 / PERTO DE VOCÊ</span>
          <h2>
            Seu novo ponto
            <br />
            de encontro.
          </h2>
          <div className="location-box">
            <MapPin /> Recife, Pernambuco <Check size={18} />
          </div>
          <h3>UniAcademy • Recife</h3>
          <p className="muted">
            Localização regional do projeto.
            <br />
            Endereço da unidade a confirmar.
          </p>
          <a
            className="button black"
            href="https://www.google.com/maps/search/?api=1&query=Recife+Pernambuco"
            target="_blank"
            rel="noreferrer"
          >
            Explorar Recife no Maps <MapPin size={18} />
          </a>
        </div>
        <div className="map-art" aria-label="Mapa ilustrativo de Recife">
          <div className="map-river" />
          <div className="map-road one" />
          <div className="map-road two" />
          <div className="map-road three" />
          <div className="map-marker">
            <Brand />
            <MapPin size={42} />
          </div>
          <small>Mapa ilustrativo • endereço a confirmar</small>
        </div>
      </div>
    </section>
  );
}
