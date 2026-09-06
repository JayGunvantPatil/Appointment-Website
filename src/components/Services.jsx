import React from 'react';
import { services } from '../data/services';
import { MedicalIcon } from './MedicalIcon';

export const Services = () => {
    return (
        <section id="services" className="services-section section-padding bg-light">
            <div className="container">

                {/* Section Header */}
                <div className="section-header animate-slide-up">
                    <span className="section-subtitle">Clinical Care</span>
                    <h2 className="section-title">Our Practice Services</h2>
                    <div className="title-bar"></div>
                    <p className="section-desc">
                        Explore our comprehensive range of clinical and diagnostic provisions. We provide individual care systems to support patient health.
                    </p>
                </div>

                {/* Services Responsive Grid */}
                <div className="services-grid">
                    {services.map((service) => (
                        <div key={service.id} className="service-card animate-fade-in">
                            <div className="service-card-icon-box">
                                <MedicalIcon name={service.icon} className="service-icon text-primary" size={24} />
                            </div>
                            <div className="service-card-body">
                                <h3 className="service-card-title">{service.name}</h3>
                                <p className="service-card-desc">{service.description}</p>
                            </div>
                            <div className="service-card-footer">
                                <span className="service-learn-more-btn">
                                    <span>Service Detail</span>
                                    <MedicalIcon name="ChevronRight" size={14} />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Services;
