import React, { useRef } from 'react';
import {
  Upload,
  Camera,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  Move,
  RefreshCw,
  Download,
  Share2,
  Eye,
  Sparkles,
  UserCheck,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';

export default function Controls({
  userImage,
  onImageSelect,
  onSampleSelect,
  transform,
  onTransformChange,
  onResetTransform,
  onCenterPhoto,
  attendeeTitle,
  setAttendeeTitle,
  attendeeName,
  setAttendeeName,
  showName,
  setShowName,
  onDownload,
  onShare,
  onOpenPreview,
  isProcessing
}) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleZoomChange = (e) => {
    const val = parseFloat(e.target.value);
    onTransformChange((prev) => ({ ...prev, zoom: val }));
  };

  const stepZoom = (delta) => {
    onTransformChange((prev) => ({
      ...prev,
      zoom: Math.min(3.5, Math.max(0.2, Number((prev.zoom + delta).toFixed(2))))
    }));
  };

  const nudge = (dx, dy) => {
    onTransformChange((prev) => ({
      ...prev,
      panX: prev.panX + dx,
      panY: prev.panY + dy
    }));
  };

  const rotateBy = (deg) => {
    onTransformChange((prev) => ({
      ...prev,
      rotation: (prev.rotation + deg) % 360
    }));
  };

  const toggleFlip = () => {
    onTransformChange((prev) => ({
      ...prev,
      flipH: !prev.flipH
    }));
  };

  return (
    <div className="controls-column">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Upload photo file"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Take selfie photo"
      />

      {/* Step 1: Upload Photo Card */}
      <div className="control-card">
        <h3 className="card-title">
          <span className="step-num">1</span>
          Choose Your Photo
        </h3>

        <div className="upload-grid">
          <button
            type="button"
            className="btn-upload-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={18} />
            {userImage ? 'Choose Different Photo' : 'Upload Your Photo'}
          </button>

          <button
            type="button"
            className="btn-upload-secondary"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera size={16} /> Take Selfie
          </button>

          <button
            type="button"
            className="btn-upload-secondary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} /> Browse Gallery
          </button>
        </div>

        {/* Quick Demo Sample Photos */}
        <div className="presets-section">
          <span className="presets-label">Try Demo:</span>
          <div className="preset-chip-group">
            <button
              type="button"
              className="preset-chip"
              onClick={() => onSampleSelect('/samples/male.jpg')}
              title="Test with Brother sample photo"
            >
              <img src="/samples/male.jpg" alt="Brother" />
              <span>Brother</span>
            </button>
            <button
              type="button"
              className="preset-chip"
              onClick={() => onSampleSelect('/samples/female.jpg')}
              title="Test with Sister sample photo"
            >
              <img src="/samples/female.jpg" alt="Sister" />
              <span>Sister</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step 2: Adjust & Fit Photo Card */}
      <div className="control-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="card-title" style={{ marginBottom: 0 }}>
            <span className="step-num">2</span>
            Adjust & Fit Photo
          </h3>
          {userImage && (
            <button
              type="button"
              onClick={onResetTransform}
              className="btn-tool"
              style={{ minWidth: 'auto', padding: '6px 10px', fontSize: '0.72rem' }}
              title="Reset position and zoom"
            >
              <RefreshCw size={13} /> Reset
            </button>
          )}
        </div>

        {!userImage ? (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
            Upload a photo above to unlock zoom, drag, and rotation adjustments.
          </p>
        ) : (
          <div className="control-group">
            {/* Zoom Slider */}
            <div className="control-item">
              <div className="control-item-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ZoomIn size={15} color="var(--gold-400)" /> Zoom Level
                </span>
                <span className="control-value">{Math.round(transform.zoom * 100)}%</span>
              </div>
              <div className="slider-container">
                <button
                  type="button"
                  className="icon-btn-step"
                  onClick={() => stepZoom(-0.1)}
                  aria-label="Zoom out"
                >
                  <ZoomOut size={16} />
                </button>
                <input
                  type="range"
                  min="0.2"
                  max="3.5"
                  step="0.05"
                  value={transform.zoom}
                  onChange={handleZoomChange}
                  aria-label="Zoom range slider"
                />
                <button
                  type="button"
                  className="icon-btn-step"
                  onClick={() => stepZoom(0.1)}
                  aria-label="Zoom in"
                >
                  <ZoomIn size={16} />
                </button>
              </div>
            </div>

            {/* Position / Pan Nudge Pad */}
            <div className="control-item">
              <div className="control-item-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Move size={15} color="var(--gold-400)" /> Nudge Position
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  (or drag on flyer)
                </span>
              </div>
              <div className="dpad-container">
                <button
                  type="button"
                  className="dpad-btn"
                  style={{ gridColumn: 2, gridRow: 1 }}
                  onClick={() => nudge(0, -12)}
                  title="Nudge Up"
                  aria-label="Nudge photo up"
                >
                  <ChevronUp size={18} />
                </button>
                <button
                  type="button"
                  className="dpad-btn"
                  style={{ gridColumn: 1, gridRow: 2 }}
                  onClick={() => nudge(-12, 0)}
                  title="Nudge Left"
                  aria-label="Nudge photo left"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  className="dpad-btn dpad-center"
                  onClick={onCenterPhoto}
                  title="Center Photo"
                  aria-label="Center photo in frame"
                >
                  <Maximize2 size={16} />
                </button>
                <button
                  type="button"
                  className="dpad-btn"
                  style={{ gridColumn: 3, gridRow: 2 }}
                  onClick={() => nudge(12, 0)}
                  title="Nudge Right"
                  aria-label="Nudge photo right"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  type="button"
                  className="dpad-btn"
                  style={{ gridColumn: 2, gridRow: 3 }}
                  onClick={() => nudge(0, 12)}
                  title="Nudge Down"
                  aria-label="Nudge photo down"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>

            {/* Rotation & Flip Row */}
            <div className="control-item">
              <div className="control-item-header">
                <span>Orientation & Mirror</span>
                {transform.rotation !== 0 && (
                  <span className="control-value">{transform.rotation}°</span>
                )}
              </div>
              <div className="button-row">
                <button
                  type="button"
                  className="btn-tool"
                  onClick={() => rotateBy(-90)}
                  title="Rotate -90 degrees"
                >
                  <RotateCcw size={15} /> Rotate -90°
                </button>
                <button
                  type="button"
                  className="btn-tool"
                  onClick={() => rotateBy(90)}
                  title="Rotate +90 degrees"
                >
                  <RotateCw size={15} /> Rotate +90°
                </button>
                <button
                  type="button"
                  className={`btn-tool ${transform.flipH ? 'active' : ''}`}
                  onClick={toggleFlip}
                  title="Flip photo horizontally (mirror selfie)"
                >
                  <FlipHorizontal size={15} /> {transform.flipH ? 'Mirrored' : 'Flip Mirror'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 3: Optional Name Tag Badge */}
      <div className="control-card">
        <h3 className="card-title">
          <span className="step-num">3</span>
          Personalize Name (Optional)
        </h3>

        <div className="name-input-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
            <input
              type="checkbox"
              checked={showName}
              onChange={(e) => setShowName(e.target.checked)}
              style={{ accentColor: 'var(--gold-500)', width: '16px', height: '16px' }}
            />
            <span>Include my name badge on the flyer</span>
          </label>

          {showName && (
            <div className="name-input-row" style={{ marginTop: '8px' }}>
              <select
                className="title-select"
                value={attendeeTitle}
                onChange={(e) => setAttendeeTitle(e.target.value)}
                aria-label="Select title"
              >
                <option value="BRO.">BRO.</option>
                <option value="SIS.">SIS.</option>
                <option value="PST.">PST.</option>
                <option value="EVANG.">EVANG.</option>
                <option value="DCN.">DCN.</option>
                <option value="DCNS.">DCNS.</option>
                <option value="MIN.">MIN.</option>
                <option value="ELDER">ELDER</option>
                <option value="MR.">MR.</option>
                <option value="MRS.">MRS.</option>
                <option value="">NONE</option>
              </select>

              <input
                type="text"
                className="name-input"
                placeholder="Enter Full Name (e.g. ADEOLA JOY)"
                value={attendeeName}
                onChange={(e) => setAttendeeName(e.target.value)}
                maxLength={28}
                aria-label="Enter attendee name"
              />
            </div>
          )}
          <span className="name-hint">
            {showName 
              ? 'Your name will appear in an official golden celebration badge.' 
              : 'Leave unchecked for the standard official church flyer.'}
          </span>
        </div>
      </div>

      {/* Step 4: Download & Share Card */}
      <div className="control-card download-card">
        <h3 className="card-title" style={{ color: 'var(--gold-300)' }}>
          <Sparkles size={18} className="title-icon" />
          Download & Share
        </h3>

        <div className="download-actions-grid">
          <button
            type="button"
            className="btn-download-primary"
            onClick={onDownload}
            disabled={!userImage || isProcessing}
          >
            <Download size={20} />
            {isProcessing ? 'Generating HD Flyer...' : 'Download HD Flyer'}
          </button>

          <div className="share-buttons-row">
            <button
              type="button"
              className="btn-share"
              onClick={onShare}
              disabled={!userImage || isProcessing}
              title="Share or Save to Photos on iPhone/Android"
            >
              <Share2 size={16} /> Share / Save
            </button>

            <button
              type="button"
              className="btn-share"
              onClick={onOpenPreview}
              disabled={!userImage}
              title="Preview full size and save"
            >
              <Eye size={16} /> Full Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
