import React, { useState } from 'react';
import { CLINIC_NAME } from '../data/doctorConfig';
import { MedicalIcon } from './MedicalIcon';

export const LoginPanel = ({ onLoginSuccess, onCancel }) => {
    const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleAdminChange = (e) => {
        const { name, value } = e.target;
        setAdminCreds({ ...adminCreds, [name]: value });
        setError('');
    };

    const handleAdminSubmit = (e) => {
        e.preventDefault();
        if (!adminCreds.username.trim() || !adminCreds.password.trim()) {
            setError('Please fill in admin username and password.');
            return;
        }

        // Strict check for admin credentials
        if (adminCreds.username === 'jay' && adminCreds.password === 'ram') {
            onLoginSuccess('admin');
        } else {
            setError('Unauthorized access. Only admin can log in.');
        }
    };

    return (
        <div className="login-panel-overlay flex items-center justify-center bg-light" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(241, 245, 249, 0.95)', padding: '1.5rem' }}>
            <div className="login-card animate-scale-up" style={{ width: '100%', maxWidth: '440px', backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #cbd5e1', boxShadow: 'var(--shadow-xl)', overflow: 'hidden', position: 'relative' }}>

                {/* Close Button */}
                <button
                    onClick={onCancel}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                    <MedicalIcon name="X" size={24} />
                </button>

                {/* White Header Banner using custom image logo */}
                <div style={{ backgroundColor: '#ffffff', padding: '2.5rem 2rem 1.5rem', textAlign: 'center', color: '#0f172a', borderBottom: '1px solid #f1f5f9' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}><MedicalIcon name="Stethoscope" size={48} style={{ color: '#0f172a' }} /><h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#0f172a' }}>OmniMedix Supercare</h2></div>
                    <span style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem', display: 'block', fontWeight: 'bold' }}>Authorized Admin Portal</span>
                </div>

                {/* Form Body */}
                <div style={{ padding: '2rem' }}>
                    {error && (
                        <div style={{ backgroundColor: 'var(--emergency-red-pale)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--emergency-red)', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MedicalIcon name="ShieldAlert" size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleAdminSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '0.5rem' }}>Admin Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={adminCreds.username}
                                    onChange={handleAdminChange}
                                    placeholder="Username"
                                    className="form-input"
                                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', outline: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)', display: 'block', marginBottom: '0.5rem' }}>Admin Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={adminCreds.password}
                                    onChange={handleAdminChange}
                                    placeholder="Password"
                                    className="form-input"
                                    style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', outline: 'none' }}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: '600', textAlign: 'center', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', backgroundColor: '#0f172a', color: '#ffffff' }}>
                                <MedicalIcon name="LockKeyhole" size={16} />
                                <span>Secure Login</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPanel;



