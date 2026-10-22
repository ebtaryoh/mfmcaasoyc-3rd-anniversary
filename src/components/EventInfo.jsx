import React from 'react';
import { Calendar, Clock, MapPin, Users, Flame, BookOpen } from 'lucide-react';

export default function EventInfo() {
  return (
    <div className="event-info-card" role="region" aria-label="Church Anniversary Event Details">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Flame size={20} color="var(--gold-400)" />
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
          Program Details &amp; Venue
        </h3>
      </div>

      <div className="event-details-grid">
        <div className="event-item">
          <Calendar size={18} className="event-item-icon" />
          <div>
            <div className="event-item-label">Date</div>
            <div className="event-item-value">Sunday, 25th October 2026</div>
          </div>
        </div>

        <div className="event-item">
          <Clock size={18} className="event-item-icon" />
          <div>
            <div className="event-item-label">Time</div>
            <div className="event-item-value">7:25 AM Prompt</div>
          </div>
        </div>

        <div className="event-item" style={{ gridColumn: '1 / -1' }}>
          <MapPin size={18} className="event-item-icon" />
          <div>
            <div className="event-item-label">Venue / Location</div>
            <div className="event-item-value">
              The Youth Auditorium, CAASO Mega Region, 4, Suberu Oje Road CAASO Bus-Stop, Alagbado, Lagos.
            </div>
          </div>
        </div>

        <div className="event-item" style={{ gridColumn: '1 / -1' }}>
          <BookOpen size={18} className="event-item-icon" />
          <div>
            <div className="event-item-label">Theme Scripture</div>
            <div className="event-item-value" style={{ color: 'var(--gold-300)', fontStyle: 'italic' }}>
              &ldquo;I know thy works: behold, I have set before thee an open door, and no man can shut it...&rdquo; — Revelation 3:8
            </div>
          </div>
        </div>
      </div>

      <div className="ministers-list">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Users size={14} color="var(--gold-400)" />
          <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 700 }}>
            Ministers &amp; Leadership
          </span>
        </div>
        <div className="minister-badge">
          General Overseer MFM Worldwide: <strong>Dr. Daniel Kolawole Olukoya</strong>
        </div>
        <div className="minister-badge">
          Mega Regional Overseer: <strong>Pst. Wole Adeya</strong>
        </div>
        <div className="minister-badge">
          SRO/MRO Youth Governing Council: <strong>Pst. Samuel Olurinde</strong>
        </div>
        <div className="minister-badge">
          Host Pastor: <strong>Pst. Blessing Sanyaolu</strong>
        </div>
      </div>
    </div>
  );
}
