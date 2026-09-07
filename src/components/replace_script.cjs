const fs = require('fs');
const file = 'a:/Hospital Website/src/components/AppointmentForm.jsx';
const content = fs.readFileSync(file, 'utf8').split(/\r?\n/);
const start = 217;
const end = 227;

const replacement = `                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem', color: 'var(--text-medium)', marginBottom: '0.5rem', display: 'block' }}>Booking With</label>
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
                                    )}
                                    {errors.doctor && <span style={{ color: 'var(--emergency-red)', fontSize: '0.8rem', display: 'block', marginTop: '0.2rem', fontWeight: 600 }}>{errors.doctor}</span>}
                                </div>`.split('\n');

content.splice(start, end - start, ...replacement);
fs.writeFileSync(file, content.join('\n'), 'utf8');
console.log('Successfully replaced lines.');
