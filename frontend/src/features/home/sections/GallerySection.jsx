import SectionTitle from '../../../components/ui/SectionTitle';
import { gallery, photo } from '../data/content';

export default function GallerySection() {
  return (
    <section id="estrutura" className="section">
      <div className="container">
        <SectionTitle
          label="NOSSA ESTRUTURA"
          title={
            <>
              Um espaço que faz
              <br />
              você querer voltar.
            </>
          }
          text="Da recepção ao último exercício, uma proposta pensada para um treino confortável."
        />
        <div className="gallery">
          {gallery.map(([name, text, id]) => (
            <figure key={name}>
              <img src={photo(id, 1000)} alt={`Referência ilustrativa: ${name}`} loading="lazy" />
              <figcaption>
                <h3>{name}</h3>
                <p className="muted">{text}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <small>Fotografias ilustrativas; não representam uma unidade física confirmada.</small>
      </div>
    </section>
  );
}
