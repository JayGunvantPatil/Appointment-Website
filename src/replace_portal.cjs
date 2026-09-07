const fs = require('fs');
const file = 'a:/Hospital Website/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add ReactDOM import
content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport ReactDOM from 'react-dom';");

// Replace modal with React Portal
const modalStartStr = `{activeBookingDoctor && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>`;

const modalReplacementStart = `{activeBookingDoctor && ReactDOM.createPortal(
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', zIndex: 9999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>`;

content = content.replace(modalStartStr, modalReplacementStart);

const modalEndStr = `                <AppointmentForm onAddAppointment={handleAddAppointment} managedDoctors={managedDoctors} appointments={appointments} prefilledDoctor={activeBookingDoctor} onClose={() => setActiveBookingDoctor(null)} />
              </div>
            </div>
          )}`;

const modalReplacementEnd = `                <AppointmentForm onAddAppointment={handleAddAppointment} managedDoctors={managedDoctors} appointments={appointments} prefilledDoctor={activeBookingDoctor} onClose={() => setActiveBookingDoctor(null)} />
              </div>
            </div>,
            document.body
          )}`;

content = content.replace(modalEndStr, modalReplacementEnd);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully applied React Portal configuration via Node script.');
