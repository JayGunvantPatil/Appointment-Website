const fs = require('fs');

// Patch App.jsx
const appFile = 'a:/Hospital Website/src/App.jsx';
let appContent = fs.readFileSync(appFile, 'utf8');

const oldModalRegex = /\{activeBookingDoctor && ReactDOM\.createPortal\([\s\S]*?<div style=\{\{ paddingBottom: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1\.5rem' \}\}>[\s\S]*?<\/div>/g;

const newAppModal = `{activeBookingDoctor && ReactDOM.createPortal(
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#ffffff', zIndex: 999999, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <div style={{ width: '100%', maxWidth: '800px', position: 'relative', margin: '0 auto', padding: '2rem' }}>
                <button onClick={(e) => { e.stopPropagation(); setActiveBookingDoctor(null); }} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', cursor: 'pointer', color: 'var(--text-dark)', zIndex: 10 }}>
                  <MedicalIcon name="X" size={24} />
                </button>`;

appContent = appContent.replace(oldModalRegex, newAppModal);
fs.writeFileSync(appFile, appContent, 'utf8');
console.log('App.jsx modal upgraded.');

// Patch AppointmentForm.jsx
const formFile = 'a:/Hospital Website/src/components/AppointmentForm.jsx';
let formContent = fs.readFileSync(formFile, 'utf8');

formContent = formContent.replace(
    `export const AppointmentForm = ({ onAddAppointment, managedDoctors = [], appointments = [] }) => {`,
    `export const AppointmentForm = ({ onAddAppointment, managedDoctors = [], appointments = [], prefilledDoctor = null, onClose = null }) => {`
);

formContent = formContent.replace(
    `doctor: '',\n        symptoms: ''`,
    `doctor: prefilledDoctor ? prefilledDoctor.name : '',\n        symptoms: ''`
);

const oldHeaderRegex = /<div style=\{\{ marginBottom: '2\.5rem', textAlign: 'center' \}\}>[\s\S]*?<\/div>[\s\S]*?<form onSubmit=\{handleSubmit\} className="card-premium">[\s\S]*?<div style=\{\{ display: 'flex', flexDirection: 'column', gap: '0\.75rem' \}\}>[\s\S]*?<h3 style=\{\{ borderBottom: '1px solid var\(--border-color\)', paddingBottom: '0\.5rem', marginBottom: '0\.5rem', color: 'var\(--text-dark\)', fontSize: '1\.25rem', fontWeight: 600, letterSpacing: '-0\.02em' \}\}>Patient Details<\/h3>/g;

const newFormHeader = `<div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0' }}>Fill this form</h2>
                </div>
                <form onSubmit={handleSubmit} style={{ width: '100%' }} noValidate>
                        <div className="appointment-grid">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>`;
formContent = formContent.replace(oldHeaderRegex, newFormHeader);

const oldTitle2Regex = /<h3 style=\{\{ borderBottom: '1px solid var\(--border-color\)', paddingBottom: '0\.5rem', marginBottom: '0\.5rem', color: 'var\(--text-dark\)', fontSize: '1\.25rem', fontWeight: 600, letterSpacing: '-0\.02em' \}\}>Appointment Details<\/h3>/g;
formContent = formContent.replace(oldTitle2Regex, ``);

const dropDownRegex = /<label style=\{\{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0\.05em', fontSize: '0\.75rem', color: 'var\(--text-medium\)', marginBottom: '0\.5rem', display: 'block' \}\}>Select Doctor<\/label>[\s\S]*?<\/select>/g;
const newDropDown = `<label style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem', color: 'var(--text-medium)', marginBottom: '0.5rem', display: 'block' }}>Booking With</label>
                                    {prefilledDoctor ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.25rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: '#f8fafc', color: 'var(--text-dark)' }}>
                                            <MedicalIcon name="User" size={24} style={{ color: 'var(--primary-navy)' }} />
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                              <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{prefilledDoctor.name}</span>
                                              {prefilledDoctor.department && <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>{prefilledDoctor.department}</span>}
                                            </div>
                                        </div>
                                    ) : (
                                        <select name="doctor" value={formData.doctor} onChange={handleInputChange} style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-white)', transition: 'all var(--transition-fast)' }}>
                                            <option value="">-- Choose a Doctor --</option>
                                            {managedDoctors.map(doc => (
                                                <option key={doc.id} value={doc.name}>{doc.name}</option>
                                            ))}
                                        </select>
                                    )}`;
formContent = formContent.replace(dropDownRegex, newDropDown);

formContent = formContent.replace(
    `            doctor: '',\n            symptoms: ''\n        });`,
    `            doctor: '',\n            symptoms: ''\n        });\n        if (onClose) onClose();`
);

fs.writeFileSync(formFile, formContent, 'utf8');
console.log('AppointmentForm.jsx successfully upgraded.');
