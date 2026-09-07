const fs = require('fs');

const file = 'a:/Hospital Website/src/components/AppointmentForm.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Auto-Redirect Timeout to handleSubmit
const submitRegex = /setShowModal\(true\);\s*\}\);/g;
const newSubmit = `setShowModal(true);\n            setTimeout(() => {\n                setShowModal(false);\n                if (onClose) onClose();\n            }, 3500);\n        });`;
content = content.replace(submitRegex, newSubmit);

// 2. Replace Confirmation Modal UI
const modalRegex = /\{\/\* Confirmation Modal \*\/\}([\s\S]*?)<\/section>/g;
const premiumModal = `{/* Confirmation Modal */}
            {showModal && confirmedData && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10, 16, 32, 0.5)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                    <div style={{ background: 'linear-gradient(145deg, #ffffff, #f0fdf4)', padding: '4rem 3rem', borderRadius: '24px', maxWidth: '500px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.25)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <div style={{ color: '#10b981', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', background: '#d1fae5', width: '100px', height: '100px', borderRadius: '50%', alignItems: 'center', margin: '0 auto 2rem' }}>
                            <MedicalIcon name="Check" size={64} style={{ color: '#059669' }} />
                        </div>
                        <h2 style={{ margin: '0 0 1rem', color: '#059669', fontSize: '2.5rem', letterSpacing: '-0.03em', fontWeight: '800' }}>Confirmed!</h2>
                        <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '2rem' }}>Your priority consultation was successfully scheduled. Taking you back home automatically...</p>
                        <div style={{ textAlign: 'left', marginTop: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.1)', backdropFilter: 'blur(5px)' }}>
                            <p style={{ margin: '0 0 0.75rem', color: 'var(--text-dark)' }}><strong style={{ color: '#047857' }}>Patient:</strong> {confirmedData.name}</p>
                            <p style={{ margin: '0 0 0.75rem', color: 'var(--text-dark)' }}><strong style={{ color: '#047857' }}>Doctor:</strong> {confirmedData.doctor}</p>
                            <p style={{ margin: '0 0 0.75rem', color: 'var(--text-dark)' }}><strong style={{ color: '#047857' }}>Date & Time:</strong> {confirmedData.date} • {confirmedData.time}</p>
                        </div>
                    </div>
                </div>
            )}
        </section>`;

content = content.replace(modalRegex, premiumModal);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully upgraded modal aesthetic and redirect hook.');
