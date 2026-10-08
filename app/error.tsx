'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Client-Side Error caught by Next.js Error Boundary:', error);
  }, [error]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#090d16',
      color: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      padding: '24px',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '520px',
        background: '#111827',
        border: '1px solid #dc2626',
        borderRadius: '12px',
        padding: '28px',
        boxShadow: '0 12px 36px rgba(220, 38, 38, 0.25)'
      }}>
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚠️</div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#f87171', marginBottom: '8px' }}>
          Attenzione: Si è verificato un errore temporaneo
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '20px' }}>
          {error?.message || "Si è verificato un errore nell'interfaccia. Clicca sul pulsante qui sotto per ripristinare la sessione."}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => reset()}
            style={{
              background: '#D43F4A',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            🔄 Ripristina Schermata
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#1f2937',
              color: '#e2e8f0',
              border: '1px solid #374151',
              padding: '10px 20px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Ricarica Pagina
          </button>
        </div>
      </div>
    </div>
  );
}
