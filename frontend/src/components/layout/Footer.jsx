import { useState } from 'react';
import Brand from '../ui/Brand';
import { navigationLinks as links } from '../../config/navigation';

export default function Footer({ contact }) {
  const [privacy, setPrivacy] = useState(false);
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
          </div>
          <div>
            <strong>Explore a UniAcademy</strong>
            <nav aria-label="Rodapé">
              {links.map(([name, id]) => (
                <a key={id} href={`#${id}`}>
                  {name}
                </a>
              ))}
            </nav>
          </div>
          <div>
            <strong>Vamos conversar</strong>
            <p className="muted">
              WhatsApp:{' '}
              {contact?.whatsapp_url ? (
                <a href={contact.whatsapp_url} target="_blank" rel="noreferrer">
                  fale com a equipe
                </a>
              ) : (
                'a confirmar'
              )}
              <br />
              Telefone: a confirmar
              <br />
              Instagram: a confirmar
            </p>
            <button
              className="text-button"
              onClick={() => setPrivacy(!privacy)}
              aria-expanded={privacy}
            >
              Privacidade e dados
            </button>
          </div>
        </div>
        {privacy && (
          <div className="privacy" id="privacidade">
            <h3>Política de privacidade • versão demonstrativa</h3>
            <p>
              Nome, telefone, e-mail e modalidade são usados para atender sua solicitação. O envio
              exige sua autorização. Ao continuar para o WhatsApp, seu nome e modalidade são
              enviados ao serviço externo. Não coletamos dados de saúde. O responsável e canal de
              direitos serão definidos pela academia antes da operação comercial. Proposta de
              retenção: excluir solicitações inativas após 90 dias; a rotina operacional deve ser
              configurada pelo responsável. Não envie dados reais em ambientes de demonstração.
            </p>
          </div>
        )}
        <div className="footer-bottom">
          <small>Projeto demonstrativo • Dados e imagens ilustrativos</small>
          <small>© 2026 UniAcademy • Desenvolvido com cuidado.</small>
        </div>
      </div>
    </footer>
  );
}
