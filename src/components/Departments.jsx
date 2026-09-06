import React, { useState } from 'react';
import { departments } from '../data/departments';
import { MedicalIcon } from './MedicalIcon';

export const Departments = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredDepartments = departments.filter((dept) =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section id="departments" className="departments-section section-padding bg-light">
            <div className="container">

                {/* Section Header */}
                <div className="section-header animate-slide-up">
                    <span className="section-subtitle">Our Specialties</span>
                    <h2 className="section-title">Medical Specialties & Departments</h2>
                    <div className="title-bar"></div>
                    <p className="section-desc">
                        Explore our comprehensive range of clinical departments. Select or search for a specialty to learn more about the advanced medical services we offer.
                    </p>
                </div>

                {/* Search Filter Bar */}
                <div className="search-bar-wrapper">
                    <div className="search-input-container">
                        <MedicalIcon name="Search" className="search-icon text-light" size={18} />
                        <input
                            type="text"
                            placeholder="Search departments (e.g. Cardiology, Orthopedics...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="dept-search-input"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="search-clear-btn"
                                aria-label="Clear search"
                            >
                                <MedicalIcon name="X" size={16} />
                            </button>
                        )}
                    </div>

                    <div className="search-results-info">
                        Showcasing <strong className="text-primary">{filteredDepartments.length}</strong> of <strong>{departments.length}</strong> departments
                    </div>
                </div>

                {/* Categories Grid */}
                {filteredDepartments.length > 0 ? (
                    <div className="departments-grid">
                        {filteredDepartments.map((dept) => (
                            <div key={dept.id} className="dept-card animate-fade-in">
                                <div className="dept-card-header">
                                    <div className="dept-icon-box">
                                        <MedicalIcon name={dept.icon} className="dept-icon text-primary" size={24} />
                                    </div>
                                    <h3 className="dept-card-title">{dept.name}</h3>
                                </div>
                                <div className="dept-card-body">
                                    <p>{dept.description}</p>
                                </div>
                                <div className="dept-card-footer">
                                    <span className="btn-text-link">
                                        <span>View Department Details</span>
                                        <MedicalIcon name="ArrowRight" size={14} />
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-results-card">
                        <div className="no-results-icon-box">
                            <MedicalIcon name="FlaskConical" className="text-light" size={48} />
                        </div>
                        <h3>No specialties found matching "{searchQuery}"</h3>
                        <p>Please double-check your typing or reset the search query to explore all departments.</p>
                        <button className="btn btn-secondary" onClick={() => setSearchQuery('')}>
                            Reset Search Filter
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
};

export default Departments;
