import React from 'react';
import { MedicalIcon } from './MedicalIcon';

export const Footer = ({ setModalContent, setShowAdminLogin }) => {
    return (
        <footer style={{ backgroundColor: '#ffffff', color: 'var(--text-body)', padding: '1.25rem 1rem', textAlign: 'center', borderTop: '1px solid var(--border-card)' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.65rem', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '500', margin: '0', letterSpacing: '0.02em', color: 'var(--navy-deep)' }}>MedNivo Portal</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.25rem' }}>
                    <button onClick={() => setModalContent('about')} style={{ background: 'transparent', border: 'none', color: 'var(--text-body)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '300', transition: 'color 0.2s', padding: 0 }} onMouseOver={(e) => e.target.style.color = 'var(--teal-main)'} onMouseOut={(e) => e.target.style.color = 'var(--text-body)'}>About</button>
                    <span style={{ color: 'var(--border-color)', fontSize: '0.8rem' }}>|</span>
                    <button onClick={() => setModalContent('contact')} style={{ background: 'transparent', border: 'none', color: 'var(--text-body)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '300', transition: 'color 0.2s', padding: 0 }} onMouseOver={(e) => e.target.style.color = 'var(--teal-main)'} onMouseOut={(e) => e.target.style.color = 'var(--text-body)'}>Contact</button>
                    <span style={{ color: 'var(--border-color)', fontSize: '0.8rem' }}>|</span>
                    <button onClick={() => setModalContent('privacy')} style={{ background: 'transparent', border: 'none', color: 'var(--text-body)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '300', transition: 'color 0.2s', padding: 0 }} onMouseOver={(e) => e.target.style.color = 'var(--teal-main)'} onMouseOut={(e) => e.target.style.color = 'var(--text-body)'}>Privacy Policy</button>
                </div>

                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '300', marginTop: '0.25rem' }}>&copy; {new Date().getFullYear()} MedNivo. All rights reserved.</span>
            </div>
        </footer>
    );
};

export default Footer;
