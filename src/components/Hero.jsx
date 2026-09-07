import React from 'react';
import { MedicalIcon } from './MedicalIcon';

export const Hero = ({ setActiveSection, managedDoctors = [] }) => {
    const handleCtaClick = (e, sectionId) => {
        e.preventDefault();
        setActiveSection(sectionId);
    };

    return (
        <section id="home" className="hero-section flex items-center justify-center text-center bg-navy-section" style={{ minHeight: '80vh', padding: '8rem 1.5rem 4rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* Minimal Centered Hero Content */}
                <div className="hero-content animate-slide-up" style={{ textAlign: 'center', margin: '0 auto' }}>
                    <div className="badge-emergency" style={{ display: 'inline-flex', marginBottom: '2rem' }}>
                        <MedicalIcon name="HeartPulse" size={14} />
                        <span>Clinical Service Provider</span>
                    </div>

                    <h1 className="hero-title" style={{ fontSize: '3.75rem', fontWeight: '800', margin: '0 0 2rem', lineHeight: '1.25' }}>
                        MedNivo - Doctor Appointment Platform
                    </h1>

                    <p className="hero-subtitle" style={{ fontSize: '1.25rem', margin: '0 auto 3rem', maxWidth: '600px', opacity: 0.9 }}>
                        MedNivo is a doctor appointment platform that helps patients
                        discover doctors, explore medical services, check availability,
                        and book appointments online.
                    </p>

                    <div className="hero-cta-group" style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '0' }}>
                        <a
                            href="#appointment"
                            onClick={(e) => handleCtaClick(e, 'appointment')}
                            className="btn btn-primary btn-lg"
                        >
                            <MedicalIcon name="Calendar" size={18} />
                            <span>Book Consultation</span>
                        </a>
                        <a
                            href="#services"
                            onClick={(e) => handleCtaClick(e, 'services')}
                            className="btn btn-secondary btn-lg"
                        >
                            <span>Our Clinical Services</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Doctor Availability Board */}
            {managedDoctors && managedDoctors.length > 0 && (
                <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'left' }}>
                    <div style={{ marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--primary-navy)' }}>Current Doctor Availability</h3>
                        <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>Check schedules and leave periods before booking your consultation.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {managedDoctors.map(doc => (
                            <div key={doc.id} style={{ border: '1px solid #cbd5e1', borderRadius: '0.75rem', padding: '1.5rem', backgroundColor: '#f8fafc', boxShadow: 'var(--shadow-sm)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <div style={{ padding: '0.5rem', backgroundColor: 'var(--primary-blue)', color: 'white', borderRadius: '0.5rem' }}>
                                        <MedicalIcon name="UserCircle" size={24} />
                                    </div>
                                    <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a' }}>{doc.name}</h4>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#334155' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                        <MedicalIcon name="Clock" size={14} style={{ marginTop: '0.2rem', color: '#64748b' }} />
                                        <div>
                                            <span style={{ fontWeight: 600, display: 'block' }}>Consultation Slots:</span>
                                            <span>{doc.slots || 'Not specified'}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                        <MedicalIcon name="Coffee" size={14} style={{ marginTop: '0.2rem', color: '#64748b' }} />
                                        <div>
                                            <span style={{ fontWeight: 600, display: 'block' }}>Lunch Break:</span>
                                            <span>{doc.lunchTime || 'Not specified'}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                                        <MedicalIcon name="CalendarOff" size={14} style={{ marginTop: '0.2rem', color: 'var(--emergency-red)' }} />
                                        <div>
                                            <span style={{ fontWeight: 600, display: 'block', color: 'var(--emergency-red)' }}>Leave / Away:</span>
                                            <span style={{ color: 'var(--emergency-red)' }}>{doc.leavePeriods || 'None scheduled'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Hero;
