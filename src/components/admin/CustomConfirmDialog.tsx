import React from "react";
import { X, AlertTriangle } from "lucide-react";

interface CustomConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export default function CustomConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  showCancel = true,
  isLoading = false
}: CustomConfirmDialogProps & { showCancel?: boolean }) {
  if (!isOpen) return null;

  return (
    <div 
      className="admin-side-panel-overlay" 
      onClick={onCancel}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
        display: 'flex', justifyContent: 'center', alignItems: 'center'
      }}
    >
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: '90%', maxWidth: '400px', backgroundColor: 'var(--dash-bg)', 
          borderRadius: '12px', border: '1px solid var(--dash-border)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid var(--dash-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} color={type === "danger" ? "#ef4444" : type === "warning" ? "#f59e0b" : "#3b82f6"} />
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{title}</h2>
          </div>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--dash-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '20px', fontSize: '1rem', color: 'var(--dash-text)', lineHeight: 1.5 }}>
          {message}
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid var(--dash-border)', display: 'flex', gap: '12px', justifyContent: 'flex-end', backgroundColor: 'var(--dash-card)', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
          {showCancel && <button className="btn-ghost" onClick={onCancel}>{cancelText}</button>}
          <button 
            className="btn-primary" 
            onClick={onConfirm}
            disabled={isLoading}
            style={type === "danger" ? { backgroundColor: '#ef4444', borderColor: '#dc2626', opacity: isLoading ? 0.7 : 1 } : { opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
