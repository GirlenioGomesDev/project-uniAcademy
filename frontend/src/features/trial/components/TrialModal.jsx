import { useEffect, useRef } from 'react';
import { X, ArrowUpRight, CheckCircle } from 'lucide-react';
import useTrialRequest from '../hooks/useTrialRequest';
import PrivacyNotice from '../../../components/ui/PrivacyNotice';
export default function TrialModal({ modalities, onClose }) {
  const dialog = useRef(null);
  const { state, error, result, submit } = useTrialRequest();
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
          <h3>Cadastro realizado com sucesso!</h3>
          <p>Sua solicitação #{result.id} foi registrada.</p>
          <p>
            Nossa equipe poderá entrar em contato pelos dados informados para confirmar a
            disponibilidade.
          </p>
          <button type="button" className="button primary" onClick={onClose}>
            Concluir
          </button>
        </div>
      ) : (
        <form onSubmit={submit}>
          <p className="muted">
            Escolha sua modalidade. Ao enviar, os dados serão cadastrados para atender à sua
            solicitação. Neste projeto acadêmico, utilize informações fictícias.
          </p>
          {!modalities.length && (
            <p className="error" role="status">
              Aguarde o catálogo de modalidades. Se não carregar, feche o formulário e tente
              atualizar o catálogo.
            </p>
          )}
          <label>
            Nome completo
            <input name="client_name" autoComplete="name" required minLength={3} maxLength={120} />
          </label>
          <label>
            Telefone com DDD
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
          <button className="button primary" disabled={state === 'loading' || !modalities.length}>
            {state === 'loading' ? 'Enviando…' : 'Solicitar aula experimental'}{' '}
            <ArrowUpRight size={18} />
          </button>
          <small>A solicitação não garante uma reserva.</small>
        </form>
      )}
    </dialog>
  );
}
