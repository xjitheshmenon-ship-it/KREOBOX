interface ModalProps {
  children: React.ReactNode
  onClose?: () => void
}

export default function Modal({ children, onClose }: ModalProps) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(26,24,21,0.55)',
        backdropFilter: 'blur(4px)',
        zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        className="kb-slide-in"
        style={{
          background: 'var(--kb-paper)',
          borderRadius: 16,
          overflow: 'hidden',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
