import Brand from '../ui/Brand';
import PrivacyNotice from '../ui/PrivacyNotice';
import { navigationLinks } from '../../config/navigation';
import { demoContact } from '../../../../shared/siteCatalog.js';

export default function Footer({ contact }) {
  const details = { ...demoContact, ...contact };
  return (
    <footer className="dark">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Brand />
            <p className="muted">
              Movimento para a vida real.
              <br />
              Recife • Pernambuco.
            </p>
            <p className="footer-notice">
              Projeto acadêmico de maturidade de desenvolvimento de software.
            </p>
          </div>
          <div>
            <strong>Explore a UniAcademy</strong>
            <nav aria-label="Rodapé">
              {navigationLinks.map(([name, id]) => (
                <a key={id} href={`#${id}`}>
                  {name}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <strong>Vamos conversar</strong>
            <dl className="footer-contact">
              <div>
                <dt>Telefone</dt>
                <dd>{details.phone}</dd>
              </div>
              <div>
                <dt>WhatsApp</dt>
                <dd>{details.whatsapp}</dd>
              </div>
              <div>
                <dt>Instagram</dt>
                <dd>{details.instagram}</dd>
              </div>
            </dl>
            <small className="footer-notice">Contatos fictícios para demonstração.</small>
          </div>
        </div>
        <details className="legal-details" id="privacidade">
          <summary>Privacidade e proteção de dados • LGPD</summary>
          <PrivacyNotice />
        </details>
        <details className="legal-details">
          <summary>Termos de uso da demonstração</summary>
          <div className="privacy-content">
            <p>
              Este site apresenta um projeto acadêmico. Valores, contatos, endereço, profissionais e
              horários são demonstrativos. Nenhuma solicitação de teste confirma matrícula, cobrança
              ou reserva. Imagens ilustrativas não representam uma unidade física real. O modo
              demonstrativo não envia dados pessoais.
            </p>
          </div>
        </details>
        <div className="footer-bottom">
          <small>Projeto acadêmico • Dados e imagens ilustrativos</small>
          <small>© {new Date().getFullYear()} UniAcademy • Feito para evoluir.</small>
        </div>
      </div>
    </footer>
  );
}
