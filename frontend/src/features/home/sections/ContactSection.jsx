import { Phone, MessageCircle, Instagram, ArrowUpRight } from 'lucide-react';

export default function ContactSection({ contact }) {
  return (
    <section id="contato" className="dark section">
      <div className="container">
        <div className="contact">
          <div>
            <span className="eyebrow">08 / VAMOS CONVERSAR</span>
            <h2>Sua dúvida também é bem-vinda.</h2>
            <p className="muted">
              Planos, aulas ou aquele empurrão para começar. Nosso time está aqui para ajudar.
            </p>
          </div>
          <article className="contact-card">
            <Phone className="accent" size={28} />
            <p className="contact-label">Telefone</p>
            <h3>Número a confirmar</h3>
            <span>Atendimento na recepção</span>
          </article>
          <article className="contact-card">
            <MessageCircle className="accent" size={28} />
            <p className="contact-label">WhatsApp</p>
            <h3>{contact?.whatsapp_url ? 'Fale com a equipe' : 'Número a confirmar'}</h3>
            {contact?.whatsapp_url ? (
              <a href={contact.whatsapp_url} target="_blank" rel="noreferrer">
                Fale com nossa equipe <ArrowUpRight size={16} />
              </a>
            ) : (
              <span>Contato oficial em breve</span>
            )}
          </article>
          <article className="contact-card">
            <Instagram className="accent" size={28} />
            <p className="contact-label">Instagram</p>
            <h3>Perfil a confirmar</h3>
            <span>Acompanhe nossa rotina em breve</span>
          </article>
        </div>
        <p className="contact-hours muted">
          Atendimento: segunda a sexta, 06h às 23h; sábado, 08h às 14h. Mensagens fora desse período
          serão respondidas no próximo dia de funcionamento.
        </p>
      </div>
    </section>
  );
}
