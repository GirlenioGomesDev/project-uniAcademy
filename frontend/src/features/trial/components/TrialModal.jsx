import { useEffect, useRef } from 'react';
import { X, ArrowUpRight, CheckCircle } from 'lucide-react';
import useTrialRequest from '../hooks/useTrialRequest';
import PrivacyNotice from '../../../components/ui/PrivacyNotice';
export default function TrialModal({ modalities, onClose, demo = false }) {
  const dialog = useRef(null);
  const { state, error, result, submit } = useTrialRequest(demo);
  useEffect(() => {
    dialog.current.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      onCancel={onClose}
      aria-labelledby="trial-title"
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
    >
      <button className="modal-close" onClick={onClose} aria-label="Fechar">
        <X />
      </button>
      <span className="eyebrow">SEU PRIMEIRO MOVIMENTO</span>
      <h2 id="trial-title">Vamos começar juntos.</h2>
      {state === 'success' ? (
        <div role="status">
          <CheckCircle className="accent" />
          <p>
            {result.demo
              ? 'Simulação concluída. Nenhum dado foi armazenado ou enviado ao WhatsApp.'
              : `Solicitação #${result.id} registrada. A equipe confirma a disponibilidade pelo WhatsApp.`}
          </p>
          {result.whatsapp_url && (
            <a
              className="button primary"
              href={result.whatsapp_url}
              target="_blank"
              rel="noreferrer"
            >
              Continuar no WhatsApp <ArrowUpRight />
            </a>
          )}
        </div>
      ) : (
        <form onSubmit={submit}>
          <p className="muted">
            {demo
              ? 'Demonstração: use dados fictícios. O formulário simula o envio sem armazenar ou transmitir suas informações.'
              : 'Gratuita. Sem compromisso. Escolha sua modalidade.'}
          </p>
          <label>
            Nome completo
            <input name="client_name" autoComplete="name" required minLength={3} maxLength={120} />
          </label>
          <label>
            WhatsApp com DDD
            <input
              name="phone"
              autoComplete="tel"
              type="tel"
              required
              maxLength={20}
              placeholder="(81) 99999-9999"
            />
          </label>
          <label>
            E-mail
            <input name="email" autoComplete="email" type="email" required maxLength={254} />
          </label>
          <label>
            Modalidade
            <select name="preferred_modality" aria-label="Modalidade" required>
              <option value="">Selecione</option>
              {modalities.map((m) => (
                <option key={m.id}>{m.name}</option>
              ))}
            </select>
          </label>
          <label className="consent">
            <input type="checkbox" name="consent" required />
            Autorizo o uso dos dados para atender esta solicitação. Consulte a política de
            privacidade no rodapé.
          </label>
          <details className="form-privacy">
            <summary>Leia a política de privacidade</summary>
            <PrivacyNotice />
          </details>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button className="button primary" disabled={state === 'loading'}>
            {state === 'loading'
              ? 'Enviando…'
              : demo
                ? 'Simular solicitação'
                : 'Solicitar aula experimental'}{' '}
            <ArrowUpRight size={18} />
          </button>
          <small>A solicitação não garante uma reserva.</small>
        </form>
      )}
    </dialog>
  );
}
