import { useState, useCallback } from "preact/hooks";
import Modal from "./modal";
import { logout } from "../api/auth";

const LogoutDialog = ({ onClose, ...props }) => {
  const wrappedOnClose = useCallback(
    (e) => {
      e.preventDefault();
      onClose();
    },
    [onClose]
  );
  const doLogout = useCallback(
    (e) => {
      e.preventDefault();
      logout();
      onClose();
    },
    [onClose]
  );

  return (
    <Modal {...props} onClose={onClose}>
      <div class="modal-header">
        <div class="modal-title">Logout</div>
      </div>
      <div class="modal-body">
        <div>This will log you out on your current device.</div>
      </div>
      <div class="modal-footer u-flex u-justify-flex-end u-gap-2">
        <button class={`btn--sm outline `} onClick={wrappedOnClose}>
          Cancel
        </button>
        <button class={`btn--sm btn-danger outline  `} onClick={doLogout}>
          Logout
        </button>
      </div>
    </Modal>
  );
};

function LogoutButton({ ...props }) {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const onClick = useCallback((e) => {
    e.preventDefault();
    setIsDialogVisible(true);
  }, []);
  const onClose = useCallback(() => setIsDialogVisible(false), []);

  return (
    <>
      <a {...props} href="#" native onClick={onClick}>
        Logout
      </a>
      <LogoutDialog open={isDialogVisible} onClose={onClose} />
    </>
  );
}

export default LogoutButton;
