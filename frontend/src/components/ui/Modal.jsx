import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ titleId, onClose, children, className = '' }) {
  const ref = useRef(null);
  const triggerRef = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!triggerRef.current) triggerRef.current = document.activeElement;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      dialog.close();
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={className}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== ref.current) return;
        const bounds = ref.current.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          onClose();
      }}
    >
      <button type="button" className="modal-close" onClick={onClose} aria-label="Fechar">
        <X />
      </button>
      {children}
    </dialog>
  );
}
