# MFM CAASO Youth Church - 3rd Year Anniversary DP Generator

An interactive, responsive React web application that allows church members, youth, and attendees to upload their photos, adjust position and scale to fit the circular frame, and generate/download their personalized **"I WILL BE ATTENDING"** anniversary display picture (DP).

Designed specifically for **Mountain of Fire and Miracles Ministries - CAASO Youth Church (Upperroom Tabernacle)** 3rd Year Anniversary Thanksgiving (**"My Season of Open Doors" - Revelation 3:8**).

---

## Key Features

- **Photo Upload & Camera Capture**:
  - Upload from device gallery / files (JPG, PNG, WEBP, HEIC).
  - Take instant selfies using mobile front camera (`capture="user"`).
  - Drag-and-drop on desktop.
  - Interactive hotspot on the flyer circle ("Tap to Add Photo").
  - Instant demo attendee presets (Brother & Sister sample portraits).

- **Full Touch & Mouse Image Adjustment**:
  - **Pan / Drag**: Smooth touch-drag on mobile and click-and-drag on desktop.
  - **Pinch-to-Zoom**: Two-finger pinch-to-zoom on iOS Safari and Android Chrome.
  - **Zoom Slider & Fine-Tuning**: Continuous slider (20% to 350%) with `+` and `-` buttons.
  - **Nudge D-Pad**: Pixel-precise positioning buttons (Up, Down, Left, Right) and Center button.
  - **Rotation & Mirror**: Rotate ±90° and Flip Horizontal (mirror selfie mode).
  - **Reset**: Instantly restore default alignment and scale.

- **Cross-Platform iPhone & Android Compatibility**:
  - **High-Definition Rendering**: Renders 2x retina output (1478 × 2048) for crisp WhatsApp status and Instagram posts.
  - **Web Share API**: Native mobile share sheet (`navigator.share`) allowing direct saving to iPhone Photos, Android Gallery, or sharing to WhatsApp.
  - **Direct Download**: High-speed blob download with automatic sanitized filename.
  - **iPhone Long-Press Save Modal**: Full-size inspection modal with guidance for iOS Safari users to touch and hold then tap *"Save to Photos"*.
  - **Clipboard Copy**: Direct image-to-clipboard support.

- **Authentic Composition & Aesthetics**:
  - Transparent frame overlay preserves the golden circular rim, ambient glow, and yellow brush strokes of *"I WILL BE ATTENDING"*, seamlessly tucking the attendee photo behind the banner.
  - Optional personalized Attendee Name Badge (e.g. `BRO. EMMANUEL ADELEKE`) with selectable titles.
  - Celebratory confetti animation on download and share.
  - Live anniversary event countdown to Sunday 25th October 2026.

---

## Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm (v9 or newer)

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser or test on your mobile device connected to the same Wi-Fi.

### Production Build
```bash
npm run build
```
The optimized bundle will be in `dist/`, ready for deployment to Vercel, Netlify, Firebase Hosting, or Cloud Run.
