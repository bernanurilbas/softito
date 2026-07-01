import { useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';

export default function Toast() {
  const { toastMessage, clearToast } = useContext(CartContext);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        clearToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, clearToast]);

  if (!toastMessage) return null;

  return (
    <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 9999 }} id="toast-wrapper">
      <div className="toast show align-items-center text-white bg-khaki border-0" role="alert" aria-live="assertive" aria-atomic="true" id="toast-box">
        <div className="d-flex">
          <div className="toast-body">
            <i className="bi bi-check-circle-fill me-2"></i>{toastMessage}
          </div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={clearToast} id="btn-close-toast"></button>
        </div>
      </div>
    </div>
  );
}
