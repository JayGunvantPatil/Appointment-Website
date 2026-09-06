import React from 'react';
import { CLINIC_NAME } from '../data/doctorConfig';
import { MedicalIcon } from './MedicalIcon';

export const Navbar = ({ activeSection, setActiveSection }) => {
    return (
        <nav className="fixed-navbar">
            <div className="navbar-container">
                {/* Logo & Name */}
                <a href="#dashboard" className="navbar-logo" onClick={(e) => { e.preventDefault(); setActiveSection('dashboard'); }}>
                    <div className="logo-icon-wrapper">
                        <img src="/logo.png" alt="Logo" style={{ maxHeight: '32px', filter: 'brightness(0) invert(1)' }} />
                    </div>
                    <div className="logo-text-wrapper">
                        <span className="logo-title" style={{ fontSize: '1.2rem', color: 'white' }}>OmniMedix Supercare</span>
                        <span className="logo-subtitle" style={{ color: 'rgba(255,255,255,0.7)' }}>Medical Care</span>
                    </div>
                </a>

                {/* Vertical Links */}
                <div className="navbar-links">
                    <a
                        href="#dashboard"
                        onClick={(e) => { e.preventDefault(); setActiveSection('dashboard'); }}
                        className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
                    >
                        <MedicalIcon name="LayoutDashboard" size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} /> Dashboard
                    </a>

                    <a
                        href="#appointment"
                        onClick={(e) => { e.preventDefault(); setActiveSection('appointment'); }}
                        className={`nav-link ${activeSection === 'appointment' ? 'active' : ''}`}
                    >
                        <MedicalIcon name="CalendarHeart" size={18} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} /> Appointment
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
