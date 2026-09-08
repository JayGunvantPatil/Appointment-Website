import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import AppointmentForm from './components/AppointmentForm';
import Footer from './components/Footer';
import LoginPanel from './components/LoginPanel';
import AdminDashboard from './components/AdminDashboard';
import { MedicalIcon } from './components/MedicalIcon';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('omnimedix_auth') === 'true');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('omnimedix_role') || null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [activeBookingDoctor, setActiveBookingDoctor] = useState(null);
  const [modalContent, setModalContent] = useState(null);

  const [managedDoctors, setManagedDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [patientRecords, setPatientRecords] = useState([]);

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
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MedicalIcon name="Stethoscope" size={24} style={{ color: '#000000' }} />
          <h1 style={{ color: '#000000', fontSize: '1.5rem', fontWeight: 'bold', margin: '0' }}>MedNivo</h1>
        </div>
        <button onClick={() => setShowAdminLogin(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-dark)', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MedicalIcon name="Menu" size={24} />
        </button>
      </header>

      <main style={{ backgroundColor: '#faf8f5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        <div style={{ flex: 1, paddingBottom: '4rem' }}>

          {/* Doctor Profiles Section */}
          <section style={{ padding: '4rem 2rem 2rem 2rem', backgroundColor: 'transparent', borderBottom: 'none' }}>
            <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--text-dark)', letterSpacing: '-0.02em', lineHeight: 1.1, paddingBottom: '1rem' }}>Doctor Profiles.</h2>
                <p style={{ color: 'var(--text-medium)', fontSize: '1.1rem', margin: '1rem auto 2rem', maxWidth: '600px' }}>Discover our leading specialists dedicated to providing tailored medical excellence.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
                {managedDoctors.map((doc, index) => (

                  <div key={doc.id} className="card-premium" onClick={() => setActiveBookingDoctor(doc)} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
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
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.95rem', color: 'var(--text-medium)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <MedicalIcon name="Clock" size={18} style={{ color: 'var(--text-medium)', flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <span style={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', color: 'rgb(107, 114, 128)', marginBottom: '0.2rem' }}>Consultation Slots</span>
                          <span style={{ color: '#6b7280', fontWeight: '500' }}>{doc.slots || 'Not specified'}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <MedicalIcon name="Coffee" size={18} style={{ color: 'var(--text-medium)', flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <span style={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', color: 'rgb(107, 114, 128)', marginBottom: '0.2rem' }}>Lunch Break</span>
                          <span style={{ color: '#6b7280', fontWeight: '500' }}>{doc.lunch_time || 'Not specified'}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <MedicalIcon name="CalendarOff" size={18} style={{ color: 'var(--text-medium)', flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <span style={{ fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', color: 'rgb(107, 114, 128)', marginBottom: '0.2rem' }}>On Leave</span>
                          <span style={{ fontWeight: '500', color: '#6b7280' }}>{doc.leave_periods || 'Available'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {managedDoctors.length === 0 && (
                  <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-medium)' }}>No doctors are currently available.</div>
                )}
              </div>
            </div>
          </section>

          {/* Dedicated Doctor Appointment Overlay Modal */}
          {activeBookingDoctor && ReactDOM.createPortal(
            <div className="hide-scrollbar" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#ffffff', zIndex: 999999, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <div style={{ width: '100%', maxWidth: '100%', padding: '3rem 1rem 5rem 1rem', position: 'relative', margin: '0 auto' }}>
                <button onClick={(e) => { e.stopPropagation(); setActiveBookingDoctor(null); }} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', cursor: 'pointer', color: 'var(--text-dark)', zIndex: 10 }}>
                  <MedicalIcon name="X" size={24} />
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
            <div style={{ width: '90%', maxWidth: '600px', backgroundColor: '#ffffff', borderRadius: '12px', padding: '2rem', position: 'relative', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
              <button onClick={(e) => { e.stopPropagation(); setModalContent(null); }} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', cursor: 'pointer', color: 'var(--text-dark)', zIndex: 10 }}>
                <MedicalIcon name="X" size={18} />
              </button>

              {modalContent === 'about' && (
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#0f172a' }}>About MedNivo</h2>
                  <p style={{ marginBottom: '1rem', color: '#475569', lineHeight: '1.6', fontSize: '1.05rem' }}>MedNivo is a doctor appointment platform designed to make healthcare access simple and convenient. It helps patients find suitable doctors and explore relevant healthcare information in one place. Patients can easily search for doctors and view their details before booking an appointment. Our platform aims to make the appointment booking process faster, easier, and more organized.</p>
                  <p style={{ color: '#475569', lineHeight: '1.6', fontSize: '1.05rem' }}>MedNivo uses technology to simplify the way patients connect with healthcare professionals. We focus on providing a user-friendly experience that is accessible across different devices. Our goal is to save patients time and make finding the right doctor more convenient. With MedNivo, we strive to make the doctor appointment journey simple, clear, and hassle-free.</p>
                </div>
              )}

              {modalContent === 'contact' && (
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#0f172a' }}>Contact Us</h2>
                  <p style={{ marginBottom: '1.5rem', color: '#475569', lineHeight: '1.6', fontSize: '1.05rem' }}>We'd love to hear from you. For support or general inquiries, please contact us.</p>
                  <div style={{ padding: '1.25rem', backgroundColor: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <MedicalIcon name="Mail" size={20} style={{ color: 'var(--primary-navy)' }} />
                    <a href="mailto:jaygpatil01@gmail.com" style={{ color: 'var(--primary-navy)', fontWeight: 'bold', textDecoration: 'none', fontSize: '1.1rem' }}>jaygpatil01@gmail.com</a>
                  </div>
                </div>
              )}

              {modalContent === 'privacy' && (
                <div>
                  <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#0f172a' }}>Privacy Policy</h2>
                  <ul style={{ color: '#475569', lineHeight: '1.7', paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '1.05rem', margin: 0 }}>
                    <li><strong>1. Information Collection:</strong> We collect standard information to facilitate your appointments.</li>
                    <li><strong>2. Data Sharing:</strong> Your personal details are never sold to external third parties.</li>
                    <li><strong>3. Medical Independence:</strong> Your medical records belong entirely to you and your consulting physician.</li>
                    <li><strong>4. Data Protection:</strong> We enforce state-of-the-art encryption across our database servers.</li>
                    <li><strong>5. Communications:</strong> We only email regarding direct updates to your scheduled bookings.</li>
                    <li><strong>6. User Rights:</strong> Contact us at any time to have your data scrubbed completely from our systems.</li>
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









