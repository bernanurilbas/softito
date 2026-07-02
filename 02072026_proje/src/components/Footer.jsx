import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container-fluid px-md-5 px-3">
        <div className="row justify-content-between align-items-center gap-3">
          <div className="col-md-6 text-center text-md-start">
            <span className="fw-bold fs-5 text-hz-primary">hızlısepet</span> clone • Tüm hakları saklıdır © 2026.
          </div>
          <div className="col-md-4 text-center text-md-end">
            <span className="text-muted small">React + Bootstrap 5 + json-server Premium SPA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
