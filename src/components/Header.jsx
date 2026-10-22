import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';

export default function Header() {
  // Target date: October 25, 2026, 07:25 AM WAT (UTC+1)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2026-10-25T07:25:00+01:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = target - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="header" role="banner">
      <div className="header-top">
        <img 
          src="/church-logo.png" 
          alt="MFM CAASO Youth Church Seal" 
          className="church-badge-img"
          width="48"
          height="48"
        />
        <div>
          <h2 className="ministry-title">Mountain of Fire and Miracles Ministries</h2>
          <p className="tabernacle-subtitle">CAASO Youth Church (Upperroom Tabernacle)</p>
        </div>
      </div>

      <h1 className="anniversary-title-main">
        3<sup style={{ fontSize: '0.6em', color: 'var(--gold-400)' }}>rd</sup> Year Anniversary Thanksgiving
      </h1>

      <div className="theme-pill">
        <Sparkles size={16} className="title-icon" />
        MY SEASON OF <span>OPEN DOORS</span> (REV. 3:8)
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center', marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <Calendar size={14} color="var(--gold-400)" /> Sun 25th Oct 2026
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <Clock size={14} color="var(--gold-400)" /> 7:25 AM
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <MapPin size={14} color="var(--gold-400)" /> Youth Auditorium, Alagbado
        </span>
      </div>
    </header>
  );
}
