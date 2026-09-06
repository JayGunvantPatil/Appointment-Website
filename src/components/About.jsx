import React from 'react';
import { DOCTOR_NAME, CLINIC_NAME } from '../data/doctorConfig';
import { MedicalIcon } from './MedicalIcon';

export const About = () => {
    return (
        <section id="about" className="about-section section-padding bg-white">
            <div className="container">

                {/* Section Header */}
                <div className="section-header animate-slide-up">
                    <span className="section-subtitle">Clinical Profile</span>
                    <h2 className="section-title">About {DOCTOR_NAME}</h2>
                    <div className="title-bar"></div>
                    <p className="section-desc">
                        Providing patient-centric clinical diagnosis, treatment monitoring, and preventative consults under the custom banner of **{CLINIC_NAME}**. We integrate medical science and patient care to ensure long-term clinical safety.
                    </p>
                </div>

                {/* Core Pillars Grid */}
                <div className="about-grid">

                    {/* Card 1: Experience & Focus Areas */}
                    <div className="about-card col-span-2">
                        <div className="about-card-icon bg-blue-pale text-blue-600">
                            <MedicalIcon name="Award" size={28} />
                        </div>
                        <div className="about-card-body">
                            <h3>Experience & Focused Action</h3>
                            <p>
                                A senior physician combining decades of critical diagnostics with board-certified hospital residency practice. Specialized in primary care, chronic illnesses, and overall diagnostics.
                            </p>
                            <div className="tech-badge-container">
                                <span className="tech-badge">Board Certified Internist</span>
                                <span className="tech-badge">15+ Years Medical Experience</span>
                                <span className="tech-badge">Chronic Care Expert</span>
                                <span className="tech-badge">Primary Diagnostics</span>
                                <span className="tech-badge">Preventative Medicine</span>
                                <span className="tech-badge">Clinical Lifestyle Guidance</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Treatment Philosophy */}
                    <div className="about-card">
                        <div className="about-card-icon bg-blue-pale text-blue-600">
                            <MedicalIcon name="HeartHandshake" size={28} />
                        </div>
                        <div className="about-card-body">
                            <h3>Patient Philosophy</h3>
                            <p>
                                I believe in active patient collaboration. Therapeutic success is built on patient education, empathetic listening, and shared decision-making.
                            </p>
                            <span className="synergy-subtext" style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
                                Dedicated to your wellness pathway.
                            </span>
                        </div>
                    </div>

                    {/* Card 3: In-Clinic Diagnostics */}
                    <div className="about-card border-emergency" style={{ borderColor: 'var(--border-color)' }}>
                        <div className="about-card-icon bg-blue-pale text-blue-600">
                            <MedicalIcon name="Scan" size={28} />
                        </div>
                        <div className="about-card-body">
                            <div className="flex-header">
                                <h3>In-Clinic Testing Cap</h3>
                                <span className="card-badge bg-primary" style={{ backgroundColor: 'var(--primary-blue-light)' }}>On-site</span>
                            </div>
                            <p>
                                Equipped with basic testing tools to allow fast diagnostic checks during your OPD consultation slot.
                            </p>
                            <ul className="about-list" style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                    <MedicalIcon name="CheckCircle" size={14} className="list-check text-green-500" />
                                    <span>Immediate 12-lead ECG Rythm Scan</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                    <MedicalIcon name="CheckCircle" size={14} className="list-check text-green-500" />
                                    <span>Rapid blood sugar & urine analysis panels</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                    <MedicalIcon name="CheckCircle" size={14} className="list-check text-green-500" />
                                    <span>Structured diagnostic lab routing</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Card 4: Care Transparency & Data Privacy */}
                    <div className="about-card col-span-2">
                        <div className="about-card-icon bg-blue-pale text-blue-600">
                            <MedicalIcon name="Shield" size={28} />
                        </div>
                        <div className="about-card-body">
                            <h3>Care Privacy & Transparency</h3>
                            <p>
                                Integrity is at the center of medical support. We enforce high guidelines regarding records security, clear fees, and easy access.
                            </p>
                            <div className="compassion-grid">
                                <div className="compassion-item">
                                    <strong>No Hidden Charges</strong>
                                    <span>Consultation fees, dressings, and diagnostics details are explained clearly upfront.</span>
                                </div>
                                <div className="compassion-item">
                                    <strong>Data Privacy First</strong>
                                    <span>Your symptoms record and lab test histories are stored with absolute confidentiality.</span>
                                </div>
                                <div className="compassion-item">
                                    <strong>Follow-Up Coordination</strong>
                                    <span>Digital prescriptions summaries are generated and sent straight to your email.</span>
                                </div>
                                <div className="compassion-item">
                                    <strong>Reference Letter Desk</strong>
                                    <span>Fast assembly of medical referals for advanced hospital procedures.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default About;
