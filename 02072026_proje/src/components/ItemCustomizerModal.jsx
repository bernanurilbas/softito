import React from 'react';

export default function ItemCustomizerModal({
  customizeDialogRef,
  selectedMenuItem,
  customSize,
  setCustomSize,
  customExtras,
  setCustomExtras,
  customSauces,
  setCustomSauces,
  customInstructions,
  setCustomInstructions,
  customQty,
  setCustomQty,
  handleAddCustomToCart
}) {
  if (!selectedMenuItem) return null;

  const sizeObj = selectedMenuItem.options?.sizes?.find((s) => s.name === customSize);
  const sizeP = sizeObj ? sizeObj.price : 0;
  const extrasP = customExtras.reduce((sum, extName) => {
    const extObj = selectedMenuItem.options?.extras?.find((e) => e.name === extName);
    return sum + (extObj ? extObj.price : 0);
  }, 0);
  const singleItemPrice = selectedMenuItem.price + sizeP + extrasP;

  return (
    <dialog ref={customizeDialogRef} className="col-lg-4 col-md-6 col-10" style={{ background: '#FFF', borderRadius: '16px', border: '0', boxShadow: '0 10px 50px rgba(0,0,0,0.15)' }} closedby="any">
      <div>
        <div className="modal-header p-3 border-bottom d-flex justify-content-between align-items-center">
          <h5 className="modal-title fw-bold text-dark">{selectedMenuItem.name}</h5>
          <button type="button" className="btn-close" onClick={() => customizeDialogRef.current?.close()}></button>
        </div>
        <div className="modal-body p-3 text-dark">
          <p className="text-muted small mb-4">{selectedMenuItem.description}</p>

          {selectedMenuItem.options?.sizes && selectedMenuItem.options.sizes.length > 0 && (
            <div className="mb-3">
              <h6 className="fw-bold mb-2 text-dark">Boyut Seçin</h6>
              {selectedMenuItem.options.sizes.map((sz, idx) => (
                <div key={idx} className="form-check border p-2.5 rounded-3 mb-2 d-flex align-items-center">
                  <input
                    className="form-check-input ms-1 me-3"
                    type="radio"
                    name="size-select"
                    id={`size-${idx}`}
                    checked={customSize === sz.name}
                    onChange={() => setCustomSize(sz.name)}
                  />
                  <label className="form-check-label fw-semibold mb-0" htmlFor={`size-${idx}`} style={{ cursor: 'pointer' }}>
                    {sz.name}
                  </label>
                </div>
              ))}
            </div>
          )}

          {selectedMenuItem.options?.extras && selectedMenuItem.options.extras.length > 0 && (
            <div className="mb-3">
              <h6 className="fw-bold mb-2 text-dark">Ekstralar (İsteğe Bağlı)</h6>
              {selectedMenuItem.options.extras.map((ext, idx) => {
                const isChecked = customExtras.includes(ext.name);
                return (
                  <div key={idx} className="form-check border p-2.5 rounded-3 mb-2 d-flex align-items-center">
                    <input
                      className="form-check-input ms-1 me-3"
                      type="checkbox"
                      id={`extra-${idx}`}
                      checked={isChecked}
                      onChange={() => {
                        if (isChecked) {
                          setCustomExtras((prev) => prev.filter((e) => e !== ext.name));
                        } else {
                          setCustomExtras((prev) => [...prev, ext.name]);
                        }
                      }}
                    />
                    <label className="form-check-label fw-semibold mb-0" htmlFor={`extra-${idx}`} style={{ cursor: 'pointer' }}>
                      {ext.name}
                    </label>
                  </div>
                );
              })}
            </div>
          )}

          {selectedMenuItem.options?.sauces && selectedMenuItem.options.sauces.length > 0 && (
            <div className="mb-3">
              <h6 className="fw-bold mb-2 text-dark">Soslar (İsteğe Bağlı)</h6>
              <div className="row">
                {selectedMenuItem.options.sauces.map((sauce, idx) => {
                  const isChecked = customSauces.includes(sauce);
                  return (
                    <div key={idx} className="col-6 mb-2">
                      <div className="form-check border p-2 rounded-2 d-flex align-items-center">
                        <input
                          className="form-check-input ms-1 me-2"
                          type="checkbox"
                          id={`sauce-${idx}`}
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setCustomSauces((prev) => prev.filter((s) => s !== sauce));
                            } else {
                              setCustomSauces((prev) => [...prev, sauce]);
                            }
                          }}
                        />
                        <label className="form-check-label small mb-0" htmlFor={`sauce-${idx}`} style={{ cursor: 'pointer' }}>
                          {sauce}
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="form-label fw-bold mb-1 text-dark">Not Ekle</label>
            <input
              type="text"
              className="form-control"
              placeholder="Örn: Kapıyı çalmayın..."
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="input-group" style={{ maxWidth: '130px' }}>
              <button className="btn btn-outline-secondary" onClick={() => setCustomQty((prev) => Math.max(1, prev - 1))}>
                -
              </button>
              <input type="text" className="form-control text-center bg-white shadow-none" value={customQty} readOnly />
              <button className="btn btn-outline-secondary" onClick={() => setCustomQty((prev) => prev + 1)}>
                +
              </button>
            </div>

            <button className="btn btn-hz-primary px-4 py-2.5 rounded-3 fw-bold animate-hover text-white" onClick={handleAddCustomToCart}>
              Sepete Ekle ({singleItemPrice * customQty} TL)
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
