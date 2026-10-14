import { MapPin, ArrowUpRight } from 'lucide-react';
import { demoLocation as location } from '../../../../../shared/siteCatalog.js';
import IllustrativeMap from '../components/IllustrativeMap';

export default function LocationSection() {
  return (
    <section id="localizacao" className="section location-section">
      <div className="container location-layout">
        <div>
          <span className="eyebrow">PERTO DE VOCÊ</span>
          <h2>
            Seu novo ponto
            <br />
            de encontro.
          </h2>
          <div className="location-box">
            <MapPin size={23} /> {location.neighborhood} • {location.city}, PE
          </div>
          <h3>UniAcademy • {location.neighborhood}</h3>
          <address className="muted">
            {location.address}
            <br />
            {location.neighborhood} • {location.city} — {location.state}
            <br />
            {location.reference}
          </address>
          <p className="location-note">
            Endereço fictício para demonstração. O mapa apresenta a região; não indica uma academia
            em operação.
          </p>
          <a className="button black" href={location.mapsUrl} target="_blank" rel="noreferrer">
            Ver região no Google Maps <ArrowUpRight size={20} />
          </a>
        </div>
        <IllustrativeMap />
      </div>
    </section>
  );
}
