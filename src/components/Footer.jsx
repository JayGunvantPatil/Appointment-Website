import React from 'react';
import { MedicalIcon } from './MedicalIcon';

export const Footer = ({ setShowAdminLogin }) => {
    return (
        <footer style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
            <button
                onClick={() => setShowAdminLogin(true)}
                style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem',
                    background: 'transparent', border: '1px solid var(--primary-navy)',
                    padding: '0.2rem 0.5rem', borderRadius: '4px',
                    fontSize: '0.65rem', color: 'var(--primary-navy)', cursor: 'pointer',
                    fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.01em',
                    opacity: '0.6'
                }}
            >
                <MedicalIcon name="LockKeyhole" size={10} />
                <span>Admin Login</span>
            </button>
        </footer>
    );
};

export default Footer;
