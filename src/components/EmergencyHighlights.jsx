import React from 'react';
import { MedicalIcon } from './MedicalIcon';

export const EmergencyHighlights = () => {
    const coreServices = [
        {
            id: "core-1",
            title: "Emergency Care (24/7)",
            desc: "Immediate clinical intervention for critical trauma, cardiorespiratory arrests, and severe injury cases.",
            icon: "ShieldAlert",
            colorTag: "bg-red-pale text-red-500 border-red-200"
        },
        {
            id: "core-2",
            title: "Diagnostic Imaging",
            desc: "Ultra-precise radiology scans including 3T MRI, Multi-slice CT, and high-resolution Sonography.",
            icon: "Scan",
            colorTag: "bg-blue-pale text-blue-600 border-blue-200"
        },
        {
            id: "core-3",
            title: "Laboratory Services",
            desc: "Fully robotic pathology assays, fluid chemistry scans, and microbiological cell profiling.",
            icon: "FlaskConical",
            colorTag: "bg-teal-pale text-teal border-teal-200"
        },
        {
            id: "core-4",
            title: "Surgical Procedures",
            desc: "Sophisticated surgical suites supporting keyhole laparoscopy and micro-surgical excisions.",
            icon: "Scissors",
            colorTag: "bg-purple-pale text-purple-600 border-purple-200"
        },
        {
            id: "core-5",
            title: "Rehabilitation Therapy",
            desc: "Post-op recovery systems, neural stimulation, and cardiac occupational rehab regimens.",
            icon: "Activity",
            colorTag: "bg-green-pale text-green-600 border-green-200"
        }
    ];

    return (
        <section className="core-highlights-section section-padding bg-light">
            <div className="container">

                {/* Section Header */}
                <div className="section-header text-center animate-slide-up">
                    <span className="section-subtitle">Clinical Pillars</span>
                    <h2 className="section-title">Core Hospital Operations</h2>
                    <div className="title-bar"></div>
                    <p className="section-desc max-w-2xl mx-auto">
                        Our specialized infrastructure handles high-volume patient caseloads with distinct operational pathways to ensure maximum safety.
                    </p>
                </div>

                {/* 5 Distinctive Horizontal Cards */}
                <div className="core-highlights-grid">
                    {coreServices.map((service) => (
                        <div key={service.id} className={`core-highlight-card border-card ${service.colorTag} animate-fade-in`}>
                            <div className="core-card-icon-wrapper">
                                <MedicalIcon name={service.icon} size={28} />
                            </div>
                            <div className="core-card-body">
                                <h3>{service.title}</h3>
                                <p>{service.desc}</p>
                            </div>
                            <div className="core-card-action">
                                <a href="#services" className="core-action-arrow" title="Read in Services">
                                    <MedicalIcon name="ChevronRight" size={16} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default EmergencyHighlights;
