import React, { useState } from 'react';
import { timeSlots } from '../data/timeSlots';
import { MedicalIcon } from './MedicalIcon';
import { supabase } from '../supabaseClient';

export const AppointmentForm = ({ onAddAppointment, managedDoctors = [], appointments = [] }) => {
    const [formData, setFormData] = useState({
        patientName: '',
        age: '',
        phone: '',
        email: '',
        address: '',
        appointmentDate: '',
        timeSlot: '',
        doctor: '',
        symptoms: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [confirmedData, setConfirmedData] = useState(null);

    const getDayOfWeek = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { weekday: 'long' });
    };

    const parseTime = (timeStr) => {
        if (!timeStr || timeStr === 'None') return null;
        const [time, modifier] = timeStr.trim().split(' ');
        if (!time || !modifier) return null;
        let [hours, minutes] = time.split(':');
        if (hours === '12') hours = '00';
        let mins = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
        if (modifier === 'PM') mins += 12 * 60;
        return mins;
    };

    const isSlotAvailable = (docName, timeStr) => {
        const doc = managedDoctors.find(d => d.name === docName);
        if (!doc || !timeStr) return true;
        const selectedMins = parseTime(timeStr);
        if (selectedMins === null) return true;

        if (formData.appointmentDate) {
            const isBooked = appointments.some(appt =>
                appt.doctor === docName &&
                appt.appointment_date === formData.appointmentDate &&
                appt.appointment_time === timeStr &&
                appt.status !== 'Cancelled'
            );
            if (isBooked) return false;
        }

        if (doc.slots) {
            const [start, end] = doc.slots.split(' - ');
            const startMins = parseTime(start);
            const endMins = parseTime(end);
            if (startMins !== null && endMins !== null && (selectedMins < startMins || selectedMins >= endMins)) return false;
        }
        if (doc.lunch_time && !doc.lunch_time.includes('None')) {
            const [start, end] = doc.lunch_time.split(' - ');
            const startMins = parseTime(start);
            const endMins = parseTime(end);
            if (startMins !== null && endMins !== null && selectedMins >= startMins && selectedMins < endMins) return false;
        }
        return true;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.patientName.trim()) newErrors.patientName = 'Patient full name is required.';
        if (!formData.age) newErrors.age = 'Age is required.';
        if (!formData.address.trim()) newErrors.address = 'Address is required.';
        if (!formData.doctor) newErrors.doctor = 'Please select a doctor.';
        if (!formData.timeSlot) newErrors.timeSlot = 'Time slot is required.';

        const phoneRegex = /^[0-9]{10}$/;
        if (!formData.phone) {
            newErrors.phone = 'Phone number is required.';
        } else if (!phoneRegex.test(formData.phone.replace(/[- )(_]/g, ''))) {
            newErrors.phone = 'Valid 10-digit phone required.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email address is required.';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Valid email required.';
        }

        if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date is required.';

        if (formData.doctor && formData.timeSlot && !isSlotAvailable(formData.doctor, formData.timeSlot)) {
            newErrors.timeSlot = `${formData.doctor} is not available at this time.`;
        }

        if (!formData.symptoms.trim()) newErrors.symptoms = 'Symptoms are required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        const payload = {
            patient_name: formData.patientName,
            patient_age: formData.age,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            appointment_date: formData.appointmentDate,
            appointment_day: getDayOfWeek(formData.appointmentDate),
            appointment_time: formData.timeSlot,
            doctor: formData.doctor,
            symptoms: formData.symptoms,
            status: 'Pending',
            attended: false
        };

        supabase.from('appointments').insert([payload]).select().then(({ data, error }) => {
            setIsSubmitting(false);
            if (error) {
                console.error(error);
                alert('Failed to book appointment: ' + error.message);
                return;
            }
            if (onAddAppointment && data && data[0]) onAddAppointment(data[0]);
            setConfirmedData({ ...payload, name: payload.patient_name, age: payload.patient_age, date: payload.appointment_date, time: payload.appointment_time, day: getDayOfWeek(payload.appointment_date) });
            setShowModal(true);
        });
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({
            patientName: '',
            age: '',
            phone: '',
            email: '',
            address: '',
            appointmentDate: '',
            timeSlot: '',
            doctor: '',
            symptoms: ''
        });
    };

    return (
        <section id="appointment">
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>

                <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#ffffff', color: '#6b7280', padding: '0.5rem 1.25rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: '700', letterSpacing: '0.05em', marginBottom: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <MedicalIcon name="HeartPulse" size={18} style={{ color: '#6b7280' }} />
                        <span>Your Health, Our Priority</span>
                    </div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-dark)', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0' }}>Take the Next Step to Wellness.</h2>
                    <p style={{ color: '#6b7280', fontSize: '1.1rem', margin: '1rem auto 0', maxWidth: '600px', lineHeight: 1.5 }}>Schedule your priority consultation and experience medical care designed around you.</p>
                </div>

                <div className="card-premium appointment-card">
                    <form onSubmit={handleSubmit} noValidate>

                        <div className="appointment-grid">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-dark)', fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.02em' }}>Patient Details</h3>

                                <div>
                                    <label style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem', color: 'var(--text-medium)', marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
                                    <input type="text" name="patientName" value={formData.patientName} onChange={handleInputChange} style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-white)', transition: 'all var(--transition-fast)' }} />
                                    {errors.patientName && <span style={{ color: 'var(--emergency-red)', fontSize: '0.8rem', display: 'block', marginTop: '0.2rem', fontWeight: 600 }}>{errors.patientName}</span>}
                                </div>

                                <div className="appointment-sub-grid">
                                    <div>
                                        <label style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem', color: 'var(--text-medium)', marginBottom: '0.5rem', display: 'block' }}>Age</label>
                                        <input type="number" name="age" value={formData.age} onChange={handleInputChange} style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-white)', transition: 'all var(--transition-fast)' }} />
                                        {errors.age && <span style={{ color: 'var(--emergency-red)', fontSize: '0.8rem', display: 'block', marginTop: '0.2rem', fontWeight: 600 }}>{errors.age}</span>}
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem', color: 'var(--text-medium)', marginBottom: '0.5rem', display: 'block' }}>Phone</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-white)', transition: 'all var(--transition-fast)' }} />
                                        {errors.phone && <span style={{ color: 'var(--emergency-red)', fontSize: '0.8rem', display: 'block', marginTop: '0.2rem', fontWeight: 600 }}>{errors.phone}</span>}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem', color: 'var(--text-medium)', marginBottom: '0.5rem', display: 'block' }}>Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-white)', transition: 'all var(--transition-fast)' }} />
                                    {errors.email && <span style={{ color: 'var(--emergency-red)', fontSize: '0.8rem', display: 'block', marginTop: '0.2rem', fontWeight: 600 }}>{errors.email}</span>}
                                </div>

                                <div>
                                    <label style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem', color: 'var(--text-medium)', marginBottom: '0.5rem', display: 'block' }}>Address</label>
                                    <textarea name="address" value={formData.address} onChange={handleInputChange} rows="2" style={{ resize: 'none', width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-white)', transition: 'all var(--transition-fast)' }}></textarea>
                                    {errors.address && <span style={{ color: 'var(--emergency-red)', fontSize: '0.8rem', display: 'block', marginTop: '0.2rem', fontWeight: 600 }}>{errors.address}</span>}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-dark)', fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.02em' }}>Appointment Details</h3>

                                <div>
                                    <label style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem', color: 'var(--text-medium)', marginBottom: '0.5rem', display: 'block' }}>Select Doctor</label>
                                    <select name="doctor" value={formData.doctor} onChange={handleInputChange} style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-white)', transition: 'all var(--transition-fast)' }}>
                                        <option value="">-- Choose a Doctor --</option>
                                        {managedDoctors.map(doc => (
                                            <option key={doc.id} value={doc.name}>{doc.name}</option>
                                        ))}
                                    </select>
                                    {errors.doctor && <span style={{ color: 'var(--emergency-red)', fontSize: '0.8rem', display: 'block', marginTop: '0.2rem', fontWeight: 600 }}>{errors.doctor}</span>}
                                </div>

                                <div className="appointment-sub-grid">
                                    <div>
                                        <label style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem', color: 'var(--text-medium)', marginBottom: '0.5rem', display: 'block' }}>Date</label>
                                        <input type="date" name="appointmentDate" value={formData.appointmentDate} onChange={handleInputChange} min={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-white)', transition: 'all var(--transition-fast)' }} />
                                        {formData.appointmentDate && <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dark)', display: 'block', marginTop: '0.2rem', fontWeight: 600 }}>Day: {getDayOfWeek(formData.appointmentDate)}</span>}
                                        {errors.appointmentDate && <span style={{ color: 'var(--emergency-red)', fontSize: '0.8rem', display: 'block', marginTop: '0.2rem', fontWeight: 600 }}>{errors.appointmentDate}</span>}
                                    </div>
                                    <div>
                                        <label style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem', color: 'var(--text-medium)', marginBottom: '0.5rem', display: 'block' }}>Time Slot</label>
                                        <select name="timeSlot" value={formData.timeSlot} onChange={handleInputChange} style={{ width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-white)', transition: 'all var(--transition-fast)' }}>
                                            <option value="">-- Select Time --</option>
                                            {timeSlots.map(slot => (
                                                <option key={slot.id} value={slot.time}>{slot.time}</option>
                                            ))}
                                        </select>
                                        {formData.doctor && formData.timeSlot && !isSlotAvailable(formData.doctor, formData.timeSlot) && (
                                            <span style={{ color: 'var(--emergency-red)', fontSize: '0.8rem', display: 'block', marginTop: '0.4rem', fontWeight: 600 }}>
                                                <MedicalIcon name="AlertCircle" size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                                {formData.doctor} is not available
                                            </span>
                                        )}
                                        {formData.doctor && formData.timeSlot && isSlotAvailable(formData.doctor, formData.timeSlot) && (
                                            <span style={{ color: '#16a34a', fontSize: '0.8rem', display: 'block', marginTop: '0.4rem', fontWeight: 600 }}>
                                                <MedicalIcon name="Check" size={12} style={{ display: 'inline', marginRight: '4px' }} />
                                                Slot Available for {formData.doctor.split(' ')[1]}
                                            </span>
                                        )}
                                        {errors.timeSlot && <span style={{ color: 'var(--emergency-red)', fontSize: '0.8rem', display: 'block', marginTop: '0.2rem', fontWeight: 600 }}>{errors.timeSlot}</span>}
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.75rem', color: 'var(--text-medium)', marginBottom: '0.5rem', display: 'block' }}>Symptoms</label>
                                    <textarea name="symptoms" value={formData.symptoms} onChange={handleInputChange} placeholder="Brief details regarding symptoms..." rows="3" style={{ resize: 'none', width: '100%', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-white)', transition: 'all var(--transition-fast)' }}></textarea>
                                    {errors.symptoms && <span style={{ color: 'var(--emergency-red)', fontSize: '0.8rem', display: 'block', marginTop: '0.2rem', fontWeight: 600 }}>{errors.symptoms}</span>}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                            <button type="submit" disabled={isSubmitting} style={{ backgroundColor: '#faf8f5', color: '#000000', border: 'none', padding: '0.85rem 3rem', fontSize: '0.95rem', borderRadius: '4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                {isSubmitting ? 'Validating Schedule...' : 'Confirm Appointment'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showModal && confirmedData && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10, 16, 32, 0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ backgroundColor: '#fff', padding: '3rem', borderRadius: '4px', maxWidth: '500px', width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-xl)' }}>
                        <div style={{ color: 'var(--primary-navy)', marginBottom: '1rem' }}><MedicalIcon name="CheckCircle" size={64} /></div>
                        <h2 style={{ margin: '0 0 1rem', color: 'var(--primary-navy)' }}>Appointment Confirmed!</h2>
                        <div style={{ textAlign: 'left', marginTop: '1.5rem', backgroundColor: 'var(--primary-blue-pale)', padding: '1.5rem', borderRadius: '4px', border: '1px solid var(--primary-navy)' }}>
                            <p style={{ margin: '0 0 0.5rem', color: 'var(--text-dark)' }}><strong>Patient:</strong> {confirmedData.name} (Age: {confirmedData.age})</p>
                            <p style={{ margin: '0 0 0.5rem', color: 'var(--text-dark)' }}><strong>Doctor:</strong> {confirmedData.doctor}</p>
                            <p style={{ margin: '0 0 0.5rem', color: 'var(--text-dark)' }}><strong>Date:</strong> {confirmedData.date} ({confirmedData.day})</p>
                            <p style={{ margin: '0 0 0.5rem', color: 'var(--text-dark)' }}><strong>Time:</strong> {confirmedData.time}</p>
                            <p style={{ margin: '0', color: 'var(--text-dark)' }}><strong>Symptoms:</strong> {confirmedData.symptoms}</p>
                        </div>
                        <button onClick={closeModal} style={{ marginTop: '2rem', width: '100%', padding: '1rem', backgroundColor: 'var(--primary-navy)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase' }}>Close</button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AppointmentForm;





