import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Camera, Image as ImageIcon, Move, ZoomIn, Sparkles } from 'lucide-react';

const FLYER_WIDTH = 739;
const FLYER_HEIGHT = 1024;
const CIRCLE_CX = 369;
const CIRCLE_CY = 359;
const CIRCLE_R = 174;

const FlyerCanvas = forwardRef(function FlyerCanvas(
  {
    userImage,
    frameImage,
    originalFlyer,
    transform,
    onTransformChange,
    attendeeTitle,
    attendeeName,
    showName,
    onTriggerUpload
  },
  ref
) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const touchStartRef = useRef({ dist: 0, zoom: 1, x: 0, y: 0, panX: 0, panY: 0, touchCount: 0 });

  // Core render method capable of rendering at any scale (1x for interactive preview, 2x for high-res export)
  const drawFlyer = useCallback(
    (targetCanvas, scaleMult = 1) => {
      if (!targetCanvas) return;
      const ctx = targetCanvas.getContext('2d', { willReadFrequently: false });
      if (!ctx) return;

      const w = FLYER_WIDTH * scaleMult;
      const h = FLYER_HEIGHT * scaleMult;
      const cx = CIRCLE_CX * scaleMult;
      const cy = CIRCLE_CY * scaleMult;
      const r = CIRCLE_R * scaleMult;

      targetCanvas.width = w;
      targetCanvas.height = h;

      ctx.clearRect(0, 0, w, h);

      // If no user photo uploaded, draw the original flyer
      if (!userImage) {
        if (originalFlyer && originalFlyer.complete) {
          ctx.drawImage(originalFlyer, 0, 0, w, h);
        } else if (frameImage && frameImage.complete) {
          ctx.drawImage(frameImage, 0, 0, w, h);
        }
        return;
      }

      // 1. Draw subtle warm background inside circle for transparent images
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r + 1, 0, Math.PI * 2);
      ctx.fillStyle = '#f8fafc';
      ctx.fill();
      ctx.restore();

      // 2. Draw user photo clipped to the circular frame
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r + 1, 0, Math.PI * 2);
      ctx.clip();

      // Base scale: scale user photo to cover the circular diameter (2 * r)
      const minDim = Math.min(userImage.naturalWidth || userImage.width, userImage.naturalHeight || userImage.height);
      const baseScale = (2 * r) / (minDim || 1);
      const totalScale = baseScale * transform.zoom;

      ctx.translate(cx + transform.panX * scaleMult, cy + transform.panY * scaleMult);
      ctx.rotate((transform.rotation * Math.PI) / 180);
      ctx.scale(totalScale * (transform.flipH ? -1 : 1), totalScale);

      const uW = userImage.naturalWidth || userImage.width;
      const uH = userImage.naturalHeight || userImage.height;
      ctx.drawImage(userImage, -uW / 2, -uH / 2, uW, uH);
      ctx.restore();

      // 3. Draw flyer frame on top (golden ring + glowing border + "I WILL BE ATTENDING" banner)
      if (frameImage && frameImage.complete) {
        ctx.drawImage(frameImage, 0, 0, w, h);
      }

      // 4. Draw optional attendee name badge if provided
      if (showName && attendeeName && attendeeName.trim()) {
        ctx.save();
        const fullName = `${attendeeTitle ? attendeeTitle + ' ' : ''}${attendeeName.trim().toUpperCase()}`;

        // Badge position: moved up so it does NOT cover 'I WILL BE ATTENDING' banner (y = 438)
        const badgeY = 438 * scaleMult;
        const fontSize = Math.round(14 * scaleMult);
        ctx.font = `800 ${fontSize}px "Plus Jakarta Sans", -apple-system, sans-serif`;
        const textMetrics = ctx.measureText(fullName);
        const textWidth = textMetrics.width;

        const padX = 18 * scaleMult;
        const padY = 6 * scaleMult;
        const badgeW = textWidth + padX * 2;
        const badgeH = fontSize + padY * 2;
        const badgeX = cx - badgeW / 2;
        const badgeTop = badgeY - badgeH / 2;
        const radius = badgeH / 2;

        // Badge background (deep obsidian with gold border)
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeTop, badgeW, badgeH, radius);
        ctx.fillStyle = 'rgba(10, 14, 23, 0.92)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 12 * scaleMult;
        ctx.shadowOffsetY = 4 * scaleMult;
        ctx.fill();

        // Gold border
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.8 * scaleMult;
        ctx.stroke();

        // Gold text with soft glow
        ctx.shadowColor = 'rgba(251, 191, 36, 0.5)';
        ctx.shadowBlur = 6 * scaleMult;
        ctx.fillStyle = '#fef08a';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(fullName, cx, badgeY);

        ctx.restore();
      }
    },
    [userImage, frameImage, originalFlyer, transform, attendeeTitle, attendeeName, showName]
  );

  // Re-draw preview canvas whenever dependencies update
  useEffect(() => {
    drawFlyer(canvasRef.current, 1);
  }, [drawFlyer]);

  // Expose export methods to parent
  useImperativeHandle(
    ref,
    () => ({
      // High-resolution data URL export (2x = 1478 x 2048)
      getHighResDataURL: (scale = 2, type = 'image/jpeg', quality = 0.95) => {
        const offscreenCanvas = document.createElement('canvas');
        drawFlyer(offscreenCanvas, scale);
        return offscreenCanvas.toDataURL(type, quality);
      },
      // High-resolution Blob export
      getHighResBlob: (scale = 2, type = 'image/jpeg', quality = 0.95) => {
        return new Promise((resolve) => {
          const offscreenCanvas = document.createElement('canvas');
          drawFlyer(offscreenCanvas, scale);
          offscreenCanvas.toBlob((blob) => resolve(blob), type, quality);
        });
      }
    }),
    [drawFlyer]
  );

  // Mouse interaction: Drag to pan photo
  const handleMouseDown = (e) => {
    if (!userImage) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: transform.panX,
      panY: transform.panY
    };
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleFactor = FLYER_WIDTH / rect.width;

      const deltaX = (e.clientX - dragStartRef.current.x) * scaleFactor;
      const deltaY = (e.clientY - dragStartRef.current.y) * scaleFactor;

      onTransformChange((prev) => ({
        ...prev,
        panX: Math.round(dragStartRef.current.panX + deltaX),
        panY: Math.round(dragStartRef.current.panY + deltaY)
      }));
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onTransformChange]);

  // Mouse wheel: Zoom in / out
  const handleWheel = (e) => {
    if (!userImage) return;
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.08 : -0.08;
    onTransformChange((prev) => ({
      ...prev,
      zoom: Math.min(4.0, Math.max(0.2, Number((prev.zoom + zoomDelta).toFixed(2))))
    }));
  };

  // Touch interaction: Pan & Pinch to zoom (for iPhone & Android)
  const handleTouchStart = (e) => {
    if (!userImage) return;
    const touches = e.touches;

    if (touches.length === 1) {
      setIsDragging(true);
      touchStartRef.current = {
        touchCount: 1,
        x: touches[0].clientX,
        y: touches[0].clientY,
        panX: transform.panX,
        panY: transform.panY,
        zoom: transform.zoom,
        dist: 0
      };
    } else if (touches.length === 2) {
      setIsDragging(true);
      const dist = Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
      );
      touchStartRef.current = {
        touchCount: 2,
        dist,
        zoom: transform.zoom,
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2,
        panX: transform.panX,
        panY: transform.panY
      };
    }
  };

  const handleTouchMove = (e) => {
    if (!userImage || !canvasRef.current) return;
    // Prevent iOS Safari page rubber-banding during photo manipulation
    if (e.cancelable) e.preventDefault();

    const touches = e.touches;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleFactor = FLYER_WIDTH / rect.width;

    if (touches.length === 1 && touchStartRef.current.touchCount === 1) {
      const deltaX = (touches[0].clientX - touchStartRef.current.x) * scaleFactor;
      const deltaY = (touches[0].clientY - touchStartRef.current.y) * scaleFactor;

      onTransformChange((prev) => ({
        ...prev,
        panX: Math.round(touchStartRef.current.panX + deltaX),
        panY: Math.round(touchStartRef.current.panY + deltaY)
      }));
    } else if (touches.length === 2) {
      const currentDist = Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
      );

      if (touchStartRef.current.dist > 0) {
        const pinchScale = currentDist / touchStartRef.current.dist;
        const newZoom = Math.min(4.0, Math.max(0.2, Number((touchStartRef.current.zoom * pinchScale).toFixed(2))));

        // Also handle mid-point pan during two-finger pinch
        const midX = (touches[0].clientX + touches[1].clientX) / 2;
        const midY = (touches[0].clientY + touches[1].clientY) / 2;
        const deltaX = (midX - touchStartRef.current.x) * scaleFactor;
        const deltaY = (midY - touchStartRef.current.y) * scaleFactor;

        onTransformChange((prev) => ({
          ...prev,
          zoom: newZoom,
          panX: Math.round(touchStartRef.current.panX + deltaX),
          panY: Math.round(touchStartRef.current.panY + deltaY)
        }));
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchStartRef.current.dist = 0;
  };

  return (
    <div className="flyer-card">
      <div className="canvas-header-bar">
        <span className="live-badge">
          <span className="live-dot" /> Live Flyer Preview
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {userImage ? '✓ Photo Fitted' : 'Awaiting Photo'}
        </span>
      </div>

      <div
        ref={wrapperRef}
        className={`canvas-wrapper ${isDragging ? 'is-dragging' : ''}`}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        role="region"
        aria-label="Interactive Church Anniversary Flyer Canvas"
      >
        <canvas
          ref={canvasRef}
          className="flyer-canvas"
          width={FLYER_WIDTH}
          height={FLYER_HEIGHT}
        />

        {/* Hotspot overlay when no image is loaded */}
        {!userImage && (
          <div className="upload-prompt-overlay">
            <button
              type="button"
              className="circle-hotspot"
              onClick={onTriggerUpload}
              aria-label="Upload your photo to fit in this frame"
            >
              <Camera className="circle-hotspot-icon" />
              <span className="circle-hotspot-text">Tap to Add Photo</span>
              <span className="circle-hotspot-subtext">Click or Touch Here</span>
            </button>
          </div>
        )}

        {/* Floating gesture tip when photo is loaded */}
        {userImage && (
          <div className="gesture-hint">
            <Move size={13} /> Drag to position • Pinch / scroll to zoom
          </div>
        )}
      </div>
    </div>
  );
});

export default FlyerCanvas;
