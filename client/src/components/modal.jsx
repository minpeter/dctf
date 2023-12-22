import { useState, useEffect } from "preact/hooks";
import { createPortal } from "preact/compat";

const ANIMATION_DURATION = 150;

export default function Modal({ open, onClose, children }) {
  const [isLinger, setIsLinger] = useState(open);

  useEffect(() => {
    if (open) {
      setIsLinger(true);
    } else {
      const timer = setTimeout(() => {
        setIsLinger(false);
      }, ANIMATION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    function listener(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    if (open) {
      document.addEventListener("keyup", listener);
      return () => document.removeEventListener("keyup", listener);
    }
  }, [open, onClose]);

  return (
    (open || isLinger) &&
    createPortal(
      <div
        class={`modal modal--visible  ${open ? "" : " leaving"}`}
        hidden={!(open || isLinger)}
      >
        <div class="modal-overlay" onClick={onClose} aria-label="Close" />
        <div class={`modal-content  `} role="document">
          {children}
        </div>
      </div>,
      document.body
    )
  );
}
