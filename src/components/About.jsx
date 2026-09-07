import React from 'react';
import { DOCTOR_NAME, CLINIC_NAME } from '../data/doctorConfig';
import { MedicalIcon } from './MedicalIcon';

export const About = () => {
    return (
        <section id="about" className="about-section section-padding bg-white">
            <div className="container">

                {/* Section Header */}
                <div className="section-header animate-slide-up">
                    <span className="section-subtitle">About MedNivo</span>

                    <h2 className="section-title">
                        About MedNivo
                    </h2>

                    <div className="title-bar"></div>

                    <p className="section-desc">
                        MedNivo is a doctor appointment platform designed to make
                        healthcare access simple and convenient. Patients can
                        explore doctors, view available medical services, check
                        appointment availability, and book consultations online.
                    </p>
                </div>

                {/* Core Pillars Grid */}
                <div className="about-grid">

                    {/* Card 1: About MedNivo */}
                    <div className="about-card col-span-2">
                        <div className="about-card-icon bg-blue-pale text-blue-600">
                            <MedicalIcon name="HeartHandshake" size={28} />
                        </div>

                        <div className="about-card-body">
                            <h3>What is MedNivo?</h3>

                            <p>
                                MedNivo connects patients with doctors through
                                an easy-to-use online appointment platform.
                                Our goal is to simplify the process of finding
                                healthcare professionals and scheduling
                                consultations.
                            </p>

                            <div className="tech-badge-container">
                                <span className="tech-badge">Doctor Discovery</span>
                                <span className="tech-badge">Online Appointments</span>
                                <span className="tech-badge">Doctor Profiles</span>
                                <span className="tech-badge">Medical Services</span>
                                <span className="tech-badge">Appointment Availability</span>
                                <span className="tech-badge">Patient-Friendly Platform</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: How MedNivo Works */}
                    <div className="about-card">
                        <div className="about-card-icon bg-blue-pale text-blue-600">
                            <MedicalIcon name="Calendar" size={28} />
                        </div>

                        <div className="about-card-body">
                            <h3>How MedNivo Works</h3>

                            <p>
                                Find a suitable doctor, explore their profile
                                and available services, choose an available
                                appointment slot, and book your consultation.
                            </p>

                            <span
                                className="synergy-subtext"
                                style={{
                                    fontSize: '0.85rem',
                                    color: 'var(--text-light)',
                                    fontStyle: 'italic'
                                }}
                            >
                                Simple healthcare appointment scheduling.
                            </span>
                        </div>
                    </div>

                    {/* Card 3: Doctor Information */}
                    <div
                        className="about-card border-emergency"
                        style={{ borderColor: 'var(--border-color)' }}
                    >
                        <div className="about-card-icon bg-blue-pale text-blue-600">
                            <MedicalIcon name="UserCircle" size={28} />
                        </div>

                        <div className="about-card-body">
                            <div className="flex-header">
                                <h3>Our Doctor</h3>

                                <span
                                    className="card-badge bg-primary"
                                    style={{
                                        backgroundColor:
                                            'var(--primary-blue-light)'
                                    }}
                                >
                                    Healthcare
                                </span>
                            </div>

                            <p>
                                MedNivo provides patients with clear information
                                about available doctors, their areas of practice,
                                services, and appointment availability.
                            </p>

                            <ul
                                className="about-list"
                                style={{
                                    listStyle: 'none',
                                    padding: 0
                                }}
                            >
                                <li
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <MedicalIcon
                                        name="CheckCircle"
                                        size={14}
                                        className="list-check text-green-500"
                                    />
                                    <span>{DOCTOR_NAME}</span>
                                </li>

                                <li
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <MedicalIcon
                                        name="CheckCircle"
                                        size={14}
                                        className="list-check text-green-500"
                                    />
                                    <span>{CLINIC_NAME}</span>
                                </li>

                                <li
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <MedicalIcon
                                        name="CheckCircle"
                                        size={14}
                                        className="list-check text-green-500"
                                    />
                                    <span>Online appointment scheduling</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Card 4: Patient Experience */}
                    <div className="about-card col-span-2">
                        <div className="about-card-icon bg-blue-pale text-blue-600">
                            <MedicalIcon name="Shield" size={28} />
                        </div>

                        <div className="about-card-body">
                            <h3>Designed for a Better Patient Experience</h3>

                            <p>
                                MedNivo focuses on making the appointment
                                process clear, convenient, and accessible.
                                Patients can get relevant doctor and service
                                information before choosing an appointment.
                            </p>

                            <div className="compassion-grid">
                                <div className="compassion-item">
                                    <strong>Easy Doctor Discovery</strong>
                                    <span>
                                        Explore available doctors and their
                                        professional information.
                                    </span>
                                </div>

                                <div className="compassion-item">
                                    <strong>Simple Booking</strong>
                                    <span>
                                        Choose an available appointment slot
                                        through a straightforward booking process.
                                    </span>
                                </div>

                                <div className="compassion-item">
                                    <strong>Clear Information</strong>
                                    <span>
                                        View relevant services and appointment
                                        information before booking.
                                    </span>
                                </div>

                                <div className="compassion-item">
                                    <strong>Patient Convenience</strong>
                                    <span>
                                        Access appointment information through
                                        a modern, responsive web platform.
                                    </span>
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
