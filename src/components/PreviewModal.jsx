import React, { useState } from 'react';
import { X, Download, Share2, Copy, Check, Sparkles, Smartphone, Heart } from 'lucide-react';

export default function PreviewModal({
  isOpen,
  onClose,
  previewUrl,
  onDownload,
  onShare,
  isProcessing
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !previewUrl) return null;

  const handleCopy = async () => {
    try {
      // Fetch blob from dataURL and write to clipboard
      const res = await fetch(previewUrl);
      const blob = await res.blob();
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } else {
        alert('Clipboard image copy not supported on this browser. Use Download or Share!');
      }
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-preview-title"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--gold-400)" />
            <h2 id="modal-preview-title" className="modal-title">
              Your Anniversary Flyer
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close preview modal"
          >
            <X size={22} />
          </button>
        </div>

        {/* The rendered flyer image */}
        <img
          src={previewUrl}
          alt="Generated MFM CAASO Youth Church Anniversary Flyer"
          className="modal-image-preview"
        />

        {/* Mobile Instruction for iPhone & Android */}
        <div className="ios-instruction-banner">
          <Smartphone size={24} style={{ flexShrink: 0, color: 'var(--gold-400)' }} />
          <div>
            <strong>iPhone / Android Tip:</strong>
            <p style={{ margin: 0, fontSize: '0.78rem' }}>
              Touch &amp; hold (long-press) the flyer image above, then tap <strong>&ldquo;Save to Photos&rdquo;</strong> to save directly to your gallery!
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button
            type="button"
            className="btn-download-primary"
            onClick={onDownload}
            disabled={isProcessing}
          >
            <Download size={18} />
            {isProcessing ? 'Saving...' : 'Download to Device'}
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              className="btn-share"
              onClick={onShare}
              disabled={isProcessing}
            >
              <Share2 size={16} /> Share / Save
            </button>

            <button
              type="button"
              className="btn-share"
              onClick={handleCopy}
            >
              {copied ? <Check size={16} color="#4ade80" /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Image'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
