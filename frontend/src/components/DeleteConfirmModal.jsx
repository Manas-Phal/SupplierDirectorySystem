import React, { useEffect } from 'react';
import { AlertTriangle, X, Trash2, Loader2 } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  supplier,
  onClose,
  onConfirm,
  isDeleting = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isDeleting]);

  if (!isOpen || !supplier) return null;

  const displayId = supplier.supplierId || supplier.id;
  const targetId = supplier._id || supplier.id;

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="modal-delete-title"
    >
      <div className="modal-dialog" style={{ maxWidth: '460px' }}>
        <div className="modal-header" style={{ borderBottomColor: 'var(--danger-border)', background: '#fffbfa' }}>
          <h2 id="modal-delete-title" style={{ color: 'var(--danger)' }}>
            <AlertTriangle size={20} />
            Confirm Deletion
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            disabled={isDeleting}
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.92rem' }}>
            Are you sure you want to delete supplier{' '}
            <strong style={{ color: 'var(--text-main)' }}>{supplier.name}</strong> (
            <code>{displayId}</code>)?
          </p>

          <div
            style={{
              padding: '12px 16px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.84rem',
              color: 'var(--text-muted)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div>
              <strong>City:</strong> {supplier.city}
            </div>
            <div>
              <strong>Category:</strong> {supplier.category}
            </div>
            <div>
              <strong>Rating:</strong> ★ {supplier.rating}
            </div>
          </div>

          <p style={{ marginTop: '14px', fontSize: '0.82rem', color: 'var(--danger)', fontWeight: 500 }}>
            This action will permanently remove the record from MongoDB.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(targetId)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="spinner" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Supplier</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
