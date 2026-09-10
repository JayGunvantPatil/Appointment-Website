import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import AppointmentForm from './components/AppointmentForm';
import Footer from './components/Footer';
import LoginPanel from './components/LoginPanel';
import AdminDashboard from './components/AdminDashboard';
import { MedicalIcon } from './components/MedicalIcon';
import { About } from './components/About';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('omnimedix_auth') === 'true');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('omnimedix_role') || null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [activeBookingDoctor, setActiveBookingDoctor] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const [managedDoctors, setManagedDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patientRecords, setPatientRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  useEffect(() => {
    supabase.from('doctors').select('*').then(({ data, error }) => { if (!error && data) setManagedDoctors(data) });
    supabase.from('appointments').select('*').order('created_at', { ascending: false }).then(({ data, error }) => { if (!error && data) setAppointments(data) });
  }, []);


  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('omnimedix_auth', 'true');
    localStorage.setItem('omnimedix_role', role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('omnimedix_auth');
    localStorage.removeItem('omnimedix_role');
  };

  const handleAddAppointment = (newAppt) => {
    setAppointments((prev) => [newAppt, ...prev]);
  };

  if (showAdminLogin && !isAuthenticated) {
    return <LoginPanel onLoginSuccess={handleLogin} onCancel={() => setShowAdminLogin(false)} />;
  }

  if (isAuthenticated && userRole === 'admin') {
    return (
      <AdminDashboard
        managedDoctors={managedDoctors}
        setManagedDoctors={setManagedDoctors}
        appointments={appointments}
        setAppointments={setAppointments}
        patientRecords={patientRecords}
        setPatientRecords={setPatientRecords}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="app-wrapper">

      {/* Top Header - Grey and White variant */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', transition: 'background-color 0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MedicalIcon name="Stethoscope" size={24} style={{ color: 'var(--teal-main)' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0' }}>
            <span style={{ color: '#000000' }}>Med</span>
            <span style={{ color: '#10B981' }}>Nivo</span>
          </h1>
        </div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowDropdown(!showDropdown)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-dark)', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <MedicalIcon name="Menu" size={24} />
          </button>

          {showDropdown && (
            <div style={{ position: 'absolute', top: 'calc(100% + 0.5rem)', right: 0, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '0.5rem', minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '0.25rem', zIndex: 150, animation: 'fadeIn 0.2s ease' }}>
              <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setShowDropdown(false); }} style={{ display: 'block', background: 'transparent', border: 'none', color: '#334155', fontWeight: '600', fontSize: '0.95rem', padding: '0.75rem 1rem', textAlign: 'left', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Home</button>
              <button onClick={() => { setShowAdminLogin(true); setShowDropdown(false); }} style={{ display: 'block', background: 'transparent', border: 'none', color: '#10B981', fontWeight: '600', fontSize: '0.95rem', padding: '0.75rem 1rem', textAlign: 'left', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ecfdf5'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>Admin Login</button>
            </div>
          )}
        </div>
      </header>

      <main style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        <div style={{ flex: 1, paddingBottom: '0' }}>

          {/* New Giant Medial ICU Banner */}
          <section style={{ width: '100%', height: '80vh', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 2rem', overflow: 'hidden', borderBottom: '1px solid var(--border-card)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url(/src/assets/icu.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(6px)', zIndex: 1, transform: 'scale(1.05)' }}></div>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(12, 33, 53, 0.8)', zIndex: 2 }}></div>
            <div style={{ position: 'relative', zIndex: 10, maxWidth: '1100px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '40px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.15 }}>Take the Next Step Towards Better Healthcare</h2>
              <p style={{ fontSize: '1.35rem', fontWeight: 600, color: '#10B981', lineHeight: 1.6, margin: '1rem 0 0 0', textShadow: '0 4px 15px rgba(0,0,0,0.8)', maxWidth: '850px' }}>
                Find a suitable doctor, explore available consultation slots, and book your appointment effortlessly.
              </p>
            </div>
          </section>

          {/* Doctor Profiles Section */}
          <section id="doctor-profiles" style={{ padding: '4rem 2rem', backgroundColor: 'var(--bg-main)', borderBottom: 'none' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginBottom: '3rem', flexWrap: 'wrap' }}>
                {['All Doctors', 'Specialists', 'Available'].map(filter => (
                  <button
                    key={filter}
                    onClick={() => setFilterType(filter)}
                    style={{
                      padding: '0.6rem 1.25rem',
                      borderRadius: '20px',
                      border: filterType === filter ? '1px solid var(--teal-main)' : '1px solid var(--border-card)',
                      background: filterType === filter ? 'var(--teal-main)' : 'var(--white)',
                      color: filterType === filter ? 'var(--white)' : 'var(--text-body)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s',
                      boxShadow: filterType === filter ? '0 4px 12px rgba(21,154,156,0.2)' : 'none'
                    }}>
                    {filter}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', maxWidth: '850px', margin: '0 auto' }}>
                {managedDoctors.length === 0 ? (
                  <div style={{ padding: '6rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.5s ease' }}>
                    <style>{`
                      @keyframes customSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                    `}</style>
                    <div style={{ width: '48px', height: '48px', border: '4px solid #e2e8f0', borderTopColor: '#10B981', borderRadius: '50%', animation: 'customSpin 1s cubic-bezier(0.55, 0.085, 0.68, 0.53) infinite', marginBottom: '1.5rem', boxShadow: '0 4px 15px rgba(16,185,129,0.1)' }}></div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', fontWeight: '500', letterSpacing: '0.01em' }}>Connecting to our specialists...</p>
                  </div>
                ) : (
                  managedDoctors.filter(doc => {
                    if (searchQuery) {
                      const lowerQ = searchQuery.toLowerCase();
                      if (!doc.name.toLowerCase().includes(lowerQ) && !(doc.department && doc.department.toLowerCase().includes(lowerQ))) {
                        return false;
                      }
                    }
                    if (filterType === 'Available') {
                      if (doc.leave_periods && doc.leave_periods !== 'None' && doc.leave_periods !== 'Available') return false;
                    }
                    if (filterType === 'Specialists') {
                      if (!doc.department || doc.department === 'General') return false;
                    }
                    return true;
                  }).map((doc, index) => (

                    <div key={doc.id} className="premium-card" onClick={() => setActiveBookingDoctor(doc)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '1.5rem' }}>
                        {doc.photo_url ? (
                          <div style={{ flexShrink: 0, width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--white)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img src={doc.photo_url} alt={doc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML = '<span style="font-size: 2px;">No Photo</span>'; }} />
                          </div>
                        ) : (
                          <div style={{ flexShrink: 0, width: '72px', height: '72px', padding: '0.5rem', backgroundColor: 'var(--bg-main)', color: 'var(--navy-med)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-card)' }}>
                            <MedicalIcon name="UserCircle" size={32} />
                          </div>
                        )}
                        <div style={{ display: 'block', width: '100%' }}>
                          <h4 style={{ margin: '0 0 0.35rem', fontSize: '1.35rem', color: 'var(--navy-deep)', fontWeight: '700', display: 'block', wordWrap: 'break-word', whiteSpace: 'normal', width: '100%' }}>{doc.name}</h4>
                          {doc.department && <span style={{ display: 'inline-block', fontSize: '0.8rem', color: 'var(--badge-text)', backgroundColor: 'var(--badge-bg)', padding: '0.35rem 0.75rem', borderRadius: '6px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{doc.department}</span>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem', color: 'var(--text-body)', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                          <MedicalIcon name="Clock" size={18} style={{ color: 'var(--teal-main)', flexShrink: 0, marginTop: '0.1rem' }} />
                          <div>
                            <span style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Consultation Slots</span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{doc.slots || 'Not specified'}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                          <MedicalIcon name="Coffee" size={18} style={{ color: 'var(--teal-main)', flexShrink: 0, marginTop: '0.1rem' }} />
                          <div>
                            <span style={{ fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Lunch Break</span>
                            <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{doc.lunch_time || 'Not specified'}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                          <MedicalIcon name="CalendarOff" size={18} style={{ color: (!doc.leave_periods || doc.leave_periods === 'None' || doc.leave_periods === 'Available') ? 'var(--status-success)' : 'var(--status-leave)', flexShrink: 0, marginTop: '0.1rem' }} />
                          <div>
                            <span style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', color: (!doc.leave_periods || doc.leave_periods === 'None' || doc.leave_periods === 'Available') ? 'var(--status-success)' : 'var(--status-leave)', marginBottom: '0.2rem' }}>
                              {(!doc.leave_periods || doc.leave_periods === 'None' || doc.leave_periods === 'Available') ? 'AVAILABLE' : 'ON LEAVE'}
                            </span>
                            {doc.leave_periods && doc.leave_periods !== 'None' && doc.leave_periods !== 'Available' && (
                              <span style={{ fontWeight: '500', color: 'var(--status-leave)' }}>{doc.leave_periods}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button onClick={() => setActiveBookingDoctor(doc)} style={{ marginTop: '1.5rem', width: '100%', padding: '0.85rem', backgroundColor: '#10B981', color: 'var(--white)', borderRadius: '12px', fontWeight: '600', fontSize: '0.95rem', border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(16,185,129,0.2)' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>Book Appointment</button>

                    </div>
                  ))
                )}
                {managedDoctors.filter(doc => (!searchQuery || doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || (doc.department && doc.department.toLowerCase().includes(searchQuery.toLowerCase())))).length === 0 && (
                  <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>No doctors match your search.</div>
                )}
              </div>
            </div>
          </section>


          {/* Dedicated Doctor Appointment Overlay Modal (FULL SCREEN PAGE) */}
          {activeBookingDoctor && ReactDOM.createPortal(
            <div className="hide-scrollbar animate-fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', backgroundColor: 'var(--bg-main)', zIndex: 999999, padding: '3rem 1rem', overflowY: 'auto', display: 'block' }}>

              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--navy-deep)', margin: 0, letterSpacing: '-0.03em' }}>Book Appointment</h2>
                <p style={{ color: 'var(--text-medium)', fontSize: '1.15rem', marginTop: '0.5rem', fontWeight: '500' }}>Please fill out this form below to confirm your slot.</p>
              </div>

              <div style={{ width: '100%', maxWidth: '650px', backgroundColor: '#ffffff', borderRadius: '28px', position: 'relative', margin: '0 auto', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', paddingBottom: '2.5rem', overflow: 'hidden' }}>
                <button onClick={(e) => { e.stopPropagation(); setActiveBookingDoctor(null); }} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'var(--bg-main)', borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', cursor: 'pointer', color: 'var(--navy-deep)', zIndex: 10, transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.background = '#e2e8f0'; }} onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'var(--bg-main)'; }}>
                  <MedicalIcon name="X" size={18} />
                </button>

                <AppointmentForm onAddAppointment={handleAddAppointment} managedDoctors={managedDoctors} appointments={appointments} prefilledDoctor={activeBookingDoctor} onClose={() => setActiveBookingDoctor(null)} />
              </div>
            </div>,
            document.body
          )}

        </div>

        {/* Info Modal Overlay for Footer Links */}
        {modalContent && ReactDOM.createPortal(
          <div className="hide-scrollbar" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '90%', maxWidth: '650px', backgroundColor: '#ffffff', borderRadius: '24px', padding: '3rem 2.5rem', position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', maxHeight: '90vh', overflowY: 'auto' }}>
              <button onClick={(e) => { e.stopPropagation(); setModalContent(null); }} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f1f5f9', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', cursor: 'pointer', color: 'var(--text-dark)', zIndex: 10, transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'} onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}>
                <MedicalIcon name="X" size={18} />
              </button>

              {modalContent === 'about' && (
                <div style={{ color: '#334155' }}>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', color: '#0f172a', letterSpacing: '-0.03em', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>About MedNivo</h2>
                  <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: 0, lineHeight: '1.7', fontSize: '1.1rem' }}>MedNivo is a premier doctor appointment platform designed exclusively to make modern healthcare access completely frictionless. It connects patients directly to specialists, eliminating queues entirely.</p>
                  </div>
                  <p style={{ lineHeight: '1.7', fontSize: '1.1rem' }}>We operate by synthesizing real-time data seamlessly scheduling users according to actual clinical availability ensuring unmatched organizational perfection. Our ultimate goal is saving your strict schedules through absolute technological clarity.</p>
                </div>
              )}

              {modalContent === 'contact' && (
                <div style={{ color: '#334155' }}>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', color: '#0f172a', letterSpacing: '-0.03em', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>Contact Us</h2>
                  <p style={{ marginBottom: '2rem', lineHeight: '1.7', fontSize: '1.1rem' }}>Need immediate support for a booking? Or just a general inquiry regarding our physicians? Please reach out to our administration network below.</p>
                  <div style={{ padding: '1.5rem', backgroundColor: '#ecfdf5', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1.25rem', border: '1px solid #10b981' }}>
                    <div style={{ background: '#10b981', borderRadius: '50%', padding: '0.75rem', display: 'flex', color: '#fff' }}>
                      <MedicalIcon name="Mail" size={24} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '600', color: '#047857', marginBottom: '0.2rem' }}>Administration Email</span>
                      <a href="mailto:jaygpatil01@gmail.com" style={{ color: '#065f46', fontWeight: '800', textDecoration: 'none', fontSize: '1.25rem' }}>jaygpatil01@gmail.com</a>
                    </div>
                  </div>
                </div>
              )}

              {modalContent === 'privacy' && (
                <div style={{ color: '#334155' }}>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', color: '#0f172a', letterSpacing: '-0.03em', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>Privacy Policy</h2>
                  <p style={{ marginBottom: '1.5rem', lineHeight: '1.7', fontSize: '1.1rem' }}>We enforce maximum security over your medical records. Please review the following operating principles regulating your data usage:</p>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', margin: 0 }}>
                    {[
                      'Information Collection: We only trace information absolutely critical to your appointments.',
                      'Data Sharing: Complete isolation from third-parties. Your privacy is legally insulated.',
                      'Data Protection: World-class asymmetric AES-256 encryptions wrapping databases globally.',
                      'User Rights: You hold absolute termination rights triggering full autonomous data deletion.'
                    ].map((item, i) => (
                      <li key={i} style={{ backgroundColor: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'baseline', gap: '1rem', fontSize: '1.05rem', border: '1px solid #e2e8f0', lineHeight: '1.5' }}>
                        <span style={{ color: '#10B981', fontWeight: '800', fontSize: '1.1rem' }}>{i + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}

        {/* Footer (With Brand Separation and Info Links) */}
        <Footer setModalContent={setModalContent} setShowAdminLogin={setShowAdminLogin} />
      </main>

    </div>
  );
}

export default App;









