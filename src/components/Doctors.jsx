import React from 'react';
import { MedicalIcon } from './MedicalIcon';

export const Doctors = () => {
    // We represent three stylized wireframe cards to show where doctor information will go.
    // We explicitly state "Doctor Information Coming Soon" without inventing credentials.
    const placeholders = [1, 2, 3];

    return (
        <section id="doctors" className="doctors-section section-padding">
            <div className="container">

                {/* Section Header */}
                <div className="section-header animate-slide-up">
                    <span className="section-subtitle">Our Physicians</span>
                    <h2 className="section-title">Specialist Doctors Directory</h2>
                    <div className="title-bar"></div>
                    <p className="section-desc">
                        Our medical staff consists of board-certified clinical specialists, consultants, and surgeons. Below is a preview of the upcoming doctor catalog and scheduling system.
                    </p>
                </div>

                {/* Doctor Directory Status Notification */}
                <div className="doctors-coming-soon-banner">
                    <div className="banner-icon-bg">
                        <MedicalIcon name="Calendar" className="text-secondary" size={28} />
                    </div>
                    <div className="banner-text">
                        <h3>Doctor Profiles Coming Soon</h3>
                        <p>
                            We are currently onboarding our medical specialists. The directory will soon display verified qualifications, experience records, clinical focus areas, and available OPD scheduling blocks.
                        </p>
                    </div>
                </div>

                {/* Structural Doctor Wireframe Cards */}
                <div className="doctors-grid">
                    {placeholders.map((num) => (
                        <div key={num} className="doctor-wireframe-card">
                            {/* Photo Canvas placeholder */}
                            <div className="dr-photo-placeholder">
                                <MedicalIcon name="User" className="dr-placeholder-icon" size={48} />
                                <div className="dr-placeholder-tag">Specialist Profile</div>
                            </div>

                            <div className="dr-wireframe-body">
                                {/* Simulated Text Lines */}
                                <div className="dr-line name-line animate-pulse-placeholder">Dr. Doctor Name</div>
                                <div className="dr-line spec-line animate-pulse-placeholder">Clinical Specialization</div>

                                <div className="dr-metrics-rows">
                                    <div className="dr-metric-row">
                                        <MedicalIcon name="Award" size={14} className="text-light" />
                                        <span className="dr-text-line animate-pulse-placeholder">Qualifications: MD / MS / FRCS</span>
                                    </div>
                                    <div className="dr-metric-row">
                                        <MedicalIcon name="Activity" size={14} className="text-light" />
                                        <span className="dr-text-line animate-pulse-placeholder">Experience: 10+ Years</span>
                                    </div>
                                    <div className="dr-metric-row">
                                        <MedicalIcon name="Clock" size={14} className="text-light" />
                                        <span className="dr-text-line animate-pulse-placeholder">Available Days: Mon - Sat</span>
                                    </div>
                                </div>

                                <div className="dr-wireframe-footer">
                                    <button className="btn btn-secondary w-full btn-disabled" disabled>
                                        Scheduling Inactive
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Doctors;
