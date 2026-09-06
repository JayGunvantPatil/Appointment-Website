import React, { useState, useEffect } from 'react';
import AppointmentForm from './components/AppointmentForm';
import Footer from './components/Footer';
import LoginPanel from './components/LoginPanel';
import AdminDashboard from './components/AdminDashboard';
import { MedicalIcon } from './components/MedicalIcon';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('omnimedix_auth') === 'true');
  const [userRole, setUserRole] = useState(() => localStorage.getItem('omnimedix_role') || null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

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
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MedicalIcon name="Stethoscope" size={24} style={{ color: '#000000' }} />
          <h1 style={{ color: '#000000', fontSize: '1.5rem', fontWeight: 'bold', margin: '0' }}>OmniMedix Supercare</h1>
        </div>
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '3rem' }}>
                {managedDoctors.map((doc, index) => (
                  <div key={doc.id} className="card-premium">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                      {doc.photo_url ? (
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                          <img src={doc.photo_url} alt={doc.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ) : (
                        <div style={{ padding: '0.75rem', backgroundColor: '#e2e8f0', color: 'var(--text-medium)', borderRadius: '50%' }}>
                          <MedicalIcon name="UserCircle" size={28} />
                        </div>
                      )}
                      <h4 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-dark)', fontWeight: '600' }}>{doc.name}</h4>
                      {doc.department && <span style={{ display: 'block', fontSize: '0.85rem', color: '#64748b', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.2rem' }}>{doc.department}</span>}
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

          {/* Appointment Form Section */}
          <section style={{ padding: '3rem 2rem 1rem 2rem' }}>
            <AppointmentForm onAddAppointment={handleAddAppointment} managedDoctors={managedDoctors} appointments={appointments} />
          </section>

        </div>

        {/* Footer (With Doctor Login) */}
        <Footer setShowAdminLogin={setShowAdminLogin} />
      </main>

    </div>
  );
}

export default App;





