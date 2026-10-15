
import { useEffect, useRef } from 'react';
import { X, ArrowUpRight, CheckCircle } from 'lucide-react';
import useTrialRequest from '../hooks/useTrialRequest';

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
      <button
        className="modal-close"
        onClick={onClose}
        aria-label="Fechar"
      >
        <X />
      </button>

      <span className="eyebrow">SEU PRIMEIRO MOVIMENTO</span>
      <h2 id="trial-title">Vamos começar juntos.</h2>

      {state === 'success' ? (
        <div role="status">
          <CheckCircle className="accent" />

          <h3>Cadastro realizado com sucesso!</h3>

          <p>
            Sua solicitação #{result?.id} foi registrada.
          </p>

          <p>
            Nossa equipe poderá entrar em contato pelos dados
            informados para confirmar a disponibilidade.
          </p>

          <button
            type="button"
            className="button primary"
            onClick={onClose}
          >
            Concluir
          </button>
        </div>
      ) : (
        <form onSubmit={submit}>
          <p className="muted">
            Aula experimental gratuita e sem compromisso.
            Escolha sua modalidade.
          </p>

          <label>
            Nome completo
            <input
              name="client_name"
              autoComplete="name"
              required
              minLength={3}
              maxLength={120}
            />
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
            <input
              name="email"
              autoComplete="email"
              type="email"
              required
              maxLength={254}
            />
          </label>

          <label>
            Modalidade
            <select name="preferred_modality" required>
              <option value="">Selecione</option>
              {modalities.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>

          <label className="consent">
            <input
              type="checkbox"
              name="consent"
              required
            />
            Autorizo o uso dos dados para atender esta
            solicitação. Consulte a política de privacidade
            no rodapé.
          </label>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="button primary"
            disabled={state === 'loading'}
          >
            {state === 'loading'
              ? 'Enviando…'
              : 'Solicitar aula experimental'}
            <ArrowUpRight size={18} />
          </button>

          <small>
            A solicitação não garante uma reserva.
          </small>
        </form>
      )}
    </dialog>
  );
}
