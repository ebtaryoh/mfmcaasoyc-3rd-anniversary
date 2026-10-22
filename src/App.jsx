import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import Header from './components/Header';
import FlyerCanvas from './components/FlyerCanvas';
import Controls from './components/Controls';
import EventInfo from './components/EventInfo';
import PreviewModal from './components/PreviewModal';
import { Download, Share2 } from 'lucide-react';

export default function App() {
  const [frameImage, setFrameImage] = useState(null);
  const [originalFlyer, setOriginalFlyer] = useState(null);
  const [userImage, setUserImage] = useState(null);

  // Transformation states
  const [transform, setTransform] = useState({
    zoom: 1.0,
    panX: 0,
    panY: 0,
    rotation: 0,
    flipH: false
  });

  // Optional Name badge state
  const [attendeeTitle, setAttendeeTitle] = useState('BRO.');
  const [attendeeName, setAttendeeName] = useState('');
  const [showName, setShowName] = useState(false);

  // UI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const canvasRef = useRef(null);

  // Preload flyer frame and original flyer on initial load
  useEffect(() => {
    const frame = new Image();
    frame.src = '/flyer-frame.png';
    frame.onload = () => setFrameImage(frame);

    const orig = new Image();
    orig.src = '/flyer.jpg';
    orig.onload = () => setOriginalFlyer(orig);
  }, []);

  // Upload photo handler (from file input or drop)
  const handleImageSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setUserImage(img);
        // Reset transform to default center and natural zoom
        setTransform({
          zoom: 1.0,
          panX: 0,
          panY: 0,
          rotation: 0,
          flipH: false
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Sample attendee handler
  const handleSampleSelect = (url) => {
    const isSister = url.includes('female');
    setAttendeeTitle(isSister ? 'SIS.' : 'BRO.');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setUserImage(img);
      setTransform({
        zoom: 1.0,
        panX: 0,
        panY: 0,
        rotation: 0,
        flipH: false
      });
    };
    img.src = url;
  };

  // Reset transform
  const handleResetTransform = () => {
    setTransform({
      zoom: 1.0,
      panX: 0,
      panY: 0,
      rotation: 0,
      flipH: false
    });
  };

  // Center photo
  const handleCenterPhoto = () => {
    setTransform((prev) => ({
      ...prev,
      panX: 0,
      panY: 0
    }));
  };

  // Trigger confetti effect
  const launchCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#d97706', '#ffffff', '#ec4899']
      });
    } catch {
      // ignore
    }
  };

  // Download high-resolution flyer
  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setIsProcessing(true);

    try {
      const blob = await canvasRef.current.getHighResBlob(2, 'image/jpeg', 0.95);
      if (!blob) throw new Error('Failed to create flyer blob');

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeName = attendeeName.trim()
        ? `MFM-CAASO-Anniversary-${attendeeName.trim().replace(/\s+/g, '_')}.jpg`
        : 'MFM-CAASO-3rd-Anniversary-Flyer.jpg';
      link.download = safeName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 2000);

      launchCelebration();
    } catch (err) {
      console.error('Download error:', err);
      // Fallback: open full preview for user to save
      handleOpenPreview();
    } finally {
      setIsProcessing(false);
    }
  };

  // Share or Save to Photos (iPhone & Android native share sheet)
  const handleShare = async () => {
    if (!canvasRef.current) return;
    setIsProcessing(true);

    try {
      const blob = await canvasRef.current.getHighResBlob(2, 'image/jpeg', 0.95);
      if (!blob) throw new Error('Blob generation failed');

      const file = new File([blob], 'MFM-CAASO-3rd-Anniversary-Flyer.jpg', { type: 'image/jpeg' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'MFM CAASO Youth Church - 3rd Year Anniversary',
          text: 'I will be attending the 3rd Year Anniversary Thanksgiving at MFM CAASO Youth Church! My Season of Open Doors (Rev 3:8). Join me!',
          files: [file]
        });
        launchCelebration();
      } else {
        // If web share with files is not supported, open the preview modal
        handleOpenPreview();
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('Share error fallback to modal:', err);
        handleOpenPreview();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Open full-size preview modal
  const handleOpenPreview = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.getHighResDataURL(2, 'image/jpeg', 0.95);
    setPreviewUrl(url);
    setIsPreviewOpen(true);
  };

  return (
    <div className="app-container">
      <Header />

      <main className="main-workspace">
        {/* Left Column: Canvas Preview */}
        <section aria-label="Flyer Canvas Area">
          <FlyerCanvas
            ref={canvasRef}
            userImage={userImage}
            frameImage={frameImage}
            originalFlyer={originalFlyer}
            transform={transform}
            onTransformChange={setTransform}
            attendeeTitle={attendeeTitle}
            attendeeName={attendeeName}
            showName={showName}
            onTriggerUpload={() => {
              const fileInput = document.querySelector('input[type="file"]');
              if (fileInput) fileInput.click();
            }}
          />

          <div style={{ marginTop: '20px' }}>
            <EventInfo />
          </div>
        </section>

        {/* Right Column: Controls & Actions */}
        <section aria-label="Flyer Customization Controls">
          <Controls
            userImage={userImage}
            onImageSelect={handleImageSelect}
            onSampleSelect={handleSampleSelect}
            transform={transform}
            onTransformChange={setTransform}
            onResetTransform={handleResetTransform}
            onCenterPhoto={handleCenterPhoto}
            attendeeTitle={attendeeTitle}
            setAttendeeTitle={setAttendeeTitle}
            attendeeName={attendeeName}
            setAttendeeName={setAttendeeName}
            showName={showName}
            setShowName={setShowName}
            onDownload={handleDownload}
            onShare={handleShare}
            onOpenPreview={handleOpenPreview}
            isProcessing={isProcessing}
          />
        </section>
      </main>

      {/* Sticky Bottom Action Bar for Mobile View */}
      {userImage && (
        <div className="sticky-mobile-bar" role="toolbar" aria-label="Quick Actions">
          <button
            type="button"
            className="btn-download-primary"
            onClick={handleDownload}
            disabled={isProcessing}
            style={{ flex: 1 }}
          >
            <Download size={18} />
            {isProcessing ? 'Saving...' : 'Download Flyer'}
          </button>
          <button
            type="button"
            className="btn-share"
            onClick={handleShare}
            disabled={isProcessing}
            title="Share or Save to Photos"
          >
            <Share2 size={18} />
          </button>
        </div>
      )}

      {/* Preview Modal for iOS Safari / Android long-press save */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        previewUrl={previewUrl}
        onDownload={handleDownload}
        onShare={handleShare}
        isProcessing={isProcessing}
      />
    </div>
  );
}
