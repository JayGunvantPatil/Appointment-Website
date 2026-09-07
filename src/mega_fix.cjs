const fs = require('fs');
const file = 'a:/Hospital Website/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add ReactDOM import
content = content.replace(
    "import React, { useState, useEffect } from 'react';",
    "import React, { useState, useEffect } from 'react';\nimport ReactDOM from 'react-dom';"
);

// 2. Add activeBookingDoctor state
content = content.replace(
    "const [showAdminLogin, setShowAdminLogin] = useState(false);",
    "const [showAdminLogin, setShowAdminLogin] = useState(false);\n  const [activeBookingDoctor, setActiveBookingDoctor] = useState(null);"
);

// 3. Fix the Profile Header structure logically and robustly
const oldHeaderRegex = /<div style=\{\{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1\.5rem', borderBottom: '1px solid var\(--border-color\)', paddingBottom: '1rem' \}\}>[\s\S]*?<div style=\{\{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0\.2rem' \}\}>[\s\S]*?<\/div>\s*<\/div>/g;
const newHeader = `<div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                      {doc.photo_url ? (
                        <div style={{ flexShrink: 0, width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border-color)', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img src={doc.photo_url} alt={doc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<span style="font-size: 2px;">No Photo</span>'; }} />
                        </div>
                      ) : (
                        <div style={{ flexShrink: 0, width: '48px', height: '48px', padding: '0.5rem', backgroundColor: '#e2e8f0', color: 'var(--text-medium)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <MedicalIcon name="User" size={24} />
                        </div>
                      )}
                      <div style={{ display: 'block', width: '100%' }}>
                        <h4 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-dark)', fontWeight: '600', display: 'block', wordWrap: 'break-word', whiteSpace: 'normal', width: '100%' }}>{doc.name}</h4>
                        {doc.department && <span style={{ display: 'inline-block', fontSize: '0.8rem', color: '#ffffff', backgroundColor: 'var(--primary-navy)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.4rem' }}>{doc.department}</span>}
                      </div>
                    </div>`;
content = content.replace(oldHeaderRegex, newHeader);

// 4. Transform Grid layout to single vertical stack & inject onClick handler
content = content.replace(
    "<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '3rem' }}>",
    "<div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>"
);

content = content.replace(
    /managedDoctors\.map\(\(doc, index\) => \(\s*<div key=\{doc\.id\} className="card-premium">/g,
    `managedDoctors.map((doc, index) => (\n                  <div key={doc.id} className="card-premium" onClick={() => setActiveBookingDoctor(doc)} style={{ cursor: 'pointer' }}>`
);

// 5. Replace Global Appointment form with ReactDOM.createPortal Modal
const formRegex = /\{\/\* Appointment Form Section \*\/\}\s*<section style=\{\{ padding: '3rem 2rem 1rem 2rem' \}\}>\s*<AppointmentForm.*?\/>\s*<\/section>/g;
const newForm = `{/* Dedicated Doctor Appointment Overlay Modal */}
          {activeBookingDoctor && ReactDOM.createPortal(
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '700px', position: 'relative', margin: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
                <button onClick={(e) => { e.stopPropagation(); setActiveBookingDoctor(null); }} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--bg-white)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-medium)', zIndex: 10 }} title="Close">
                  <MedicalIcon name="X" size={18} />
                </button>
                <div style={{ paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>Consultation Booking</h2>
                  <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.95rem' }}>Secure an upcoming appointment block tailored explicitly for your selection.</p>
                </div>
                <AppointmentForm onAddAppointment={handleAddAppointment} managedDoctors={managedDoctors} appointments={appointments} prefilledDoctor={activeBookingDoctor} onClose={() => setActiveBookingDoctor(null)} />
              </div>
            </div>,
            document.body
          )}`;
content = content.replace(formRegex, newForm);

fs.writeFileSync(file, content, 'utf8');
console.log('App.jsx fully upgraded successfully.');
