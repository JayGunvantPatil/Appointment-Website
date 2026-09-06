import React from 'react';
import { MedicalIcon } from './MedicalIcon';

export const HospitalStats = () => {
    const stats = [
        {
            id: "stat-1",
            number: "25+",
            label: "Years of Excellence",
            icon: "Award",
            color: "text-blue-500"
        },
        {
            id: "stat-2",
            number: "50,000+",
            label: "Patients Treated",
            icon: "User",
            color: "text-teal"
        },
        {
            id: "stat-3",
            number: "120+",
            label: "Specialist Physicians",
            icon: "Stethoscope",
            color: "text-indigo-500"
        },
        {
            id: "stat-4",
            number: "300+",
            label: "Bed Capacity",
            icon: "Bed",
            color: "text-green-500"
        },
        {
            id: "stat-5",
            number: "50",
            label: "ICU Beds",
            icon: "HeartPulse",
            color: "text-red-500"
        },
        {
            id: "stat-6",
            number: "99.2%",
            label: "Surgical Success Rate",
            icon: "Activity",
            color: "text-teal"
        }
    ];

    return (
        <section className="stats-section">
            <div className="container">
                <div className="stats-grid">
                    {stats.map((stat) => (
                        <div key={stat.id} className="stat-card">
                            <div className="stat-icon-wrapper">
                                <MedicalIcon name={stat.icon} size={28} className={stat.color} />
                            </div>
                            <div className="stat-metric-wrapper">
                                <span className="stat-number">{stat.number}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HospitalStats;
