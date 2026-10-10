import { useState } from 'react';
import { Menu, X, ArrowUpRight, MessageCircle } from 'lucide-react';
import Brand from '../ui/Brand';
import { navigationLinks } from '../../config/navigation';

export default function Header({ onTrial, whatsappUrl }) {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <div className="container nav">
        <Brand />
        <nav
          id="main-navigation"
          aria-label="Principal"
          className={open ? 'navlinks open' : 'navlinks'}
        >
          {navigationLinks.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a
            className="button whatsapp-button"
            href={whatsappUrl || '#contato'}
            {...(whatsappUrl ? { target: '_blank', rel: 'noreferrer' } : {})}
          >
            WhatsApp <MessageCircle size={23} />
          </a>
          <button className="button primary nav-cta" onClick={onTrial}>
            Aula experimental <ArrowUpRight size={21} />
          </button>
        </div>
        <button
          className="menu"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
