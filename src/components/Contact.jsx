import React from 'react';
import { CLINIC_NAME, DOCTOR_NAME } from '../data/doctorConfig';
import { MedicalIcon } from './MedicalIcon';

export const Contact = () => {
    return (
        <section id="contact" className="contact-section section-padding bg-white">
            <div className="container">

                {/* Section Header */}
                <div className="section-header animate-slide-up">
                    <span className="section-subtitle">Get In Touch</span>
                    <h2 className="section-title">Contact & Clinic Location</h2>
                    <div className="title-bar"></div>
                    <p className="section-desc">
                        Get in touch with the medical support team for **{DOCTOR_NAME}**. Below is the contact and appointment guidance detail.
                    </p>
                </div>

                {/* Coming Soon Notice Block */}
                <div className="contact-coming-soon-banner">
                    <div className="banner-icon-bg bg-blue-pale text-primary">
                        <MedicalIcon name="Phone" size={28} />
                    </div>
                    <div className="banner-text">
                        <h3>Direct Communication channels</h3>
                        <p>
                            Telephone hotlines, front-desk direct emails, geographical location maps, and interactive support channels for **{CLINIC_NAME}** will be active here.
                        </p>
                    </div>
                </div>

                {/* Wireframe Placeholder Layout */}
                <div className="contact-placeholder-grid">

                    {/* Card 1: Main Contacts */}
                    <div className="contact-wireframe-card-alt">
                        <div className="wireframe-item-header">
                            <div className="wireframe-icon-dot"></div>
                            <div className="wireframe-bar short"></div>
                        </div>

                        <div className="wireframe-details">
                            <div className="details-line long">Clinic Line: +00 XXXX XXXXX</div>
                            <div className="details-line medium">Scheduling Desk: help@{CLINIC_NAME.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</div>
                            <div className="details-line short">OPD Status: Inactive</div>
                        </div>
                    </div>

                    {/* Card 2: Location Details */}
                    <div className="contact-wireframe-card-alt">
                        <div className="wireframe-item-header">
                            <div className="wireframe-icon-dot bg-teal" style={{ backgroundColor: 'var(--primary-blue-light)' }}></div>
                            <div className="wireframe-bar short"></div>
                        </div>

                        {/* Map Canvas Wireframe */}
                        <div className="map-placeholder-canvas">
                            <MedicalIcon name="MapPin" className="text-light opacity-50" size={32} />
                            <span className="map-text">Clinic Address Coordinates Placeholder</span>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default Contact;
