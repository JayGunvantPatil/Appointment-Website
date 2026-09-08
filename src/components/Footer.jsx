import React from 'react';
import { MedicalIcon } from './MedicalIcon';

export const Footer = ({ setModalContent, setShowAdminLogin }) => {
    return (
        <footer style={{ backgroundColor: '#ffffff', color: '#000000', padding: '2rem 1rem 1.5rem', textAlign: 'center', borderTop: '2px solid #e2e8f0' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0', letterSpacing: '0.01em', color: '#000000' }}>Doctor Appointment Platform</h3>

                <p style={{ fontSize: '0.95rem', color: '#334155', maxWidth: '550px', margin: '0 auto', lineHeight: '1.5' }}>
                    Empowering your healthcare journey with seamless online bookings, premier physician accessibility, and modern clinical simplicity.
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
                    <button onClick={() => setModalContent('about')} style={{ background: 'transparent', border: 'none', color: '#000000', fontSize: '0.95rem', cursor: 'pointer', fontWeight: '600' }}>About</button>
                    <span style={{ color: '#94a3b8' }}>|</span>
                    <button onClick={() => setModalContent('contact')} style={{ background: 'transparent', border: 'none', color: '#000000', fontSize: '0.95rem', cursor: 'pointer', fontWeight: '600' }}>Contact</button>
                    <span style={{ color: '#94a3b8' }}>|</span>
                    <button onClick={() => setModalContent('privacy')} style={{ background: 'transparent', border: 'none', color: '#000000', fontSize: '0.95rem', cursor: 'pointer', fontWeight: '600' }}>Privacy Policy</button>
                </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>&copy; {new Date().getFullYear()} MedNivo. All rights reserved.</span>
            </div>
        </footer>
    );
};

export default Footer;
