import { Phone, MessageCircle, Instagram, ArrowUpRight } from 'lucide-react';
import { demoContact } from '../../../../../shared/siteCatalog.js';
import { OPENING_SUMMARY } from '../../../config/academy';

export default function ContactSection({ contact }) {
  const details = { ...demoContact, ...contact };
  return (
    <section id="contato" className="dark section">
      <div className="container">
        <div className="contact">
          <div>
            <span className="eyebrow">VAMOS CONVERSAR</span>
            <h2>Sua dúvida também é bem-vinda.</h2>
            <p className="muted">
              Planos, aulas ou aquele empurrão para começar. Nosso time está aqui para ajudar.
            </p>
          </div>
          <article className="contact-card">
            <Phone className="accent" size={28} />
            <p className="contact-label">Telefone</p>
            <h3>{details.phone}</h3>
            <span>Exemplo fictício • recepção</span>
          </article>
          <article className="contact-card">
            <MessageCircle className="accent" size={28} />
            <p className="contact-label">WhatsApp</p>
            <h3>{details.whatsapp}</h3>
            {details.whatsapp_url ? (
              <a href={details.whatsapp_url} target="_blank" rel="noreferrer">
                Fale com nossa equipe <ArrowUpRight size={16} />
              </a>
            ) : (
              <span>Exemplo fictício • sem envio de mensagens</span>
            )}
          </article>
          <article className="contact-card">
            <Instagram className="accent" size={28} />
            <p className="contact-label">Instagram</p>
            <h3>{details.instagram}</h3>
            <span>Perfil demonstrativo</span>
          </article>
        </div>
        <p className="contact-hours muted">
          Atendimento: {OPENING_SUMMARY}. Domingos e feriados: fechado. Contatos fictícios nesta
          demonstração.
        </p>
      </div>
    </section>
  );
}
