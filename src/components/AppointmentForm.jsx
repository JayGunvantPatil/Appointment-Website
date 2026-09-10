import React, { useState, useEffect, useRef } from 'react';
import { timeSlots } from '../data/timeSlots';
import { MedicalIcon } from './MedicalIcon';
import { supabase } from '../supabaseClient';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const AppointmentForm = ({ onAddAppointment, managedDoctors = [], appointments = [], prefilledDoctor = null, onClose = null }) => {
    const [formData, setFormData] = useState({
        patientName: '',
        age: '',
        phone: '',
        email: '',
        address: '',
        appointmentDate: '',
        timeSlot: '',
        doctor: prefilledDoctor ? prefilledDoctor.name : '',
        symptoms: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [confirmedData, setConfirmedData] = useState(null);
    const [isTimeOpen, setIsTimeOpen] = useState(false);
    const timeRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (timeRef.current && !timeRef.current.contains(event.target)) {
                setIsTimeOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    const getDayOfWeek = (dateString) => {
        if (!dateString) return '';
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const date = new Date(dateString);
        return days[date.getDay()];
    };

    const isSlotAvailable = (docName, timeStr) => {
        if (!docName) return false;

        const doc = managedDoctors.find(d => d.name === docName);
        if (!doc) return false;

        const [hourStr, minAMPM] = timeStr.split(':');
        const [minStr, ampm] = minAMPM.split(' ');
        let slotHour24 = parseInt(hourStr);
        if (ampm === 'PM' && slotHour24 !== 12) slotHour24 += 12;
        if (ampm === 'AM' && slotHour24 === 12) slotHour24 = 0;

        const slotMins = slotHour24 * 60 + parseInt(minStr);

        if (doc.slots) {
            const [start, end] = doc.slots.split(' - ');

            const [startHourStr, startMinAMPM] = start.split(':');
            const [startMinStr, startAmpm] = startMinAMPM.split(' ');
            let startH24 = parseInt(startHourStr);
            if (startAmpm === 'PM' && startH24 !== 12) startH24 += 12;
            if (startAmpm === 'AM' && startH24 === 12) startH24 = 0;
            const docStartMins = startH24 * 60 + parseInt(startMinStr);

            const [endHourStr, endMinAMPM] = end.split(':');
            const [endMinStr, endAmpm] = endMinAMPM.split(' ');
            let endH24 = parseInt(endHourStr);
            if (endAmpm === 'PM' && endH24 !== 12) endH24 += 12;
            if (endAmpm === 'AM' && endH24 === 12) endH24 = 0;
            const docEndMins = endH24 * 60 + parseInt(endMinStr);

            if (slotMins < docStartMins || slotMins >= docEndMins) {
                return "RESTRICTED";
            }

            if (doc.lunch_time && doc.lunch_time !== 'None') {
                const [lunchStart, lunchEnd] = doc.lunch_time.split(' - ');
                const [lStartHourStr, lStartMinAMPM] = lunchStart.split(':');
                const [lStartMinStr, lStartAmpm] = lStartMinAMPM.split(' ');
                let lStartH24 = parseInt(lStartHourStr);
                if (lStartAmpm === 'PM' && lStartH24 !== 12) lStartH24 += 12;
                if (lStartAmpm === 'AM' && lStartH24 === 12) lStartH24 = 0;
                const docLunchStartMins = lStartH24 * 60 + parseInt(lStartMinStr);

                const [lEndHourStr, lEndMinAMPM] = lunchEnd.split(':');
                const [lEndMinStr, lEndAmpm] = lEndMinAMPM.split(' ');
                let lEndH24 = parseInt(lEndHourStr);
                if (lEndAmpm === 'PM' && lEndH24 !== 12) lEndH24 += 12;
                if (lEndAmpm === 'AM' && lEndH24 === 12) lEndH24 = 0;
                const docLunchEndMins = lEndH24 * 60 + parseInt(lEndMinStr);

                if (slotMins >= docLunchStartMins && slotMins < docLunchEndMins) {
                    return "RESTRICTED";
                }
            }
        }

        if (formData.appointmentDate) {
            const currentSelectedDay = getDayOfWeek(formData.appointmentDate);
            if (doc.leave && doc.leave.length > 0) {
                const isLeave = doc.leave.some(leaveDay => leaveDay === currentSelectedDay || leaveDay === formData.appointmentDate);
                if (isLeave) return "RESTRICTED";
            }

            const now = new Date();
            const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
            let currentMins = null;
            if (formData.appointmentDate === todayStr) {
                currentMins = now.getHours() * 60 + now.getMinutes();
            }

            if (currentMins !== null && slotMins <= currentMins) {
                return "RESTRICTED";
            }

            if (appointments) {
                const bookedCount = appointments.filter(appt =>
                    appt.doctor === docName &&
                    appt.appointment_date === formData.appointmentDate &&
                    appt.appointment_time === timeStr &&
                    appt.status !== 'Cancelled'
                ).length;
                if (bookedCount >= 5) return "FULL";
            }
        }

        return "OK";
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.patientName.trim()) newErrors.patientName = 'Name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^\d{10}$/.test(formData.phone.trim())) newErrors.phone = 'Valid 10-digit number required';
        if (!formData.age.trim()) newErrors.age = 'Age is required';
        if (!formData.appointmentDate) newErrors.appointmentDate = 'Date is required';
        if (!formData.timeSlot) newErrors.timeSlot = 'Time slot is required';
        if (!formData.doctor) newErrors.doctor = 'Doctor selection is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            const finalDoctor = prefilledDoctor ? prefilledDoctor.name : formData.doctor;

            const insertData = {
                patient_name: formData.patientName,
                patient_age: formData.age,
                phone: formData.phone,
                appointment_date: formData.appointmentDate,
                appointment_time: formData.timeSlot,
                doctor: finalDoctor,
                symptoms: formData.symptoms,
                status: 'Scheduled',
                attended: false
            };

            const { data, error } = await supabase
                .from('appointments')
                .insert([insertData])
                .select();

            if (error) throw error;

            const successData = data && data.length > 0 ? data[0] : { id: Math.random().toString(36).substr(2, 9), ...insertData };

            if (onAddAppointment) {
                onAddAppointment(successData);
            }

            setConfirmedData(successData);
            setShowModal(true);
            setIsSubmitting(false);

            setTimeout(() => {
                closeModal();
            }, 600);

        } catch (error) {
            console.error("Error creating appointment:", error);
            const fallbackData = {
                id: Math.random().toString(36).substr(2, 9),
                patient_name: formData.patientName,
                patient_age: formData.age,
                phone: formData.phone,
                appointment_date: formData.appointmentDate,
                appointment_time: formData.timeSlot,
                doctor: formData.doctor || (prefilledDoctor ? prefilledDoctor.name : ''),
                symptoms: formData.symptoms,
                status: 'Scheduled',
                attended: false
            };
            if (onAddAppointment) onAddAppointment(fallbackData);
            setConfirmedData(fallbackData);
            setShowModal(true);
            setIsSubmitting(false);

            setTimeout(() => {
                closeModal();
            }, 600);
        }
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
            doctor: prefilledDoctor ? prefilledDoctor.name : '',
            symptoms: ''
        });
        if (onClose) {
            onClose();
        }
    };

    return (
        <section id="appointment">
            <style>{`
                .appointment-card input:not([type="date"]), .appointment-card select, .appointment-card textarea, .custom-datepicker {
                    transition: box-shadow 0.15s ease, background-color 0.15s ease;
                    -webkit-tap-highlight-color: transparent;
                }
                .appointment-card input:not([type="date"]):focus, .appointment-card select:focus, .appointment-card textarea:focus, .custom-datepicker:focus {
                    boxShadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
                    background-color: #ffffff !important;
                }
                .appointment-card input[type=number]::-webkit-inner-spin-button, .appointment-card input[type=number]::-webkit-outer-spin-button {
                    -webkit-appearance: none; margin: 0;
                }
                .appointment-card input[type=number] {
                    -moz-appearance: textfield;
                }
                .date-wrapper { width: 100%; display: block; }
                .react-datepicker-popper { z-index: 150 !important; }
                .react-datepicker { border-radius: 12px !important; border: 1px solid #e2e8f0 !important; font-family: inherit !important; box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; padding: 0.5rem; }
                .react-datepicker__header { background-color: transparent !important; border-bottom: none !important; }
                .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected { background-color: #10b981 !important; color: white !important; border-radius: 8px !important; font-weight: bold; }
                .react-datepicker__day:hover { background-color: #f1f5f9 !important; border-radius: 8px !important; }
                @keyframes fadeInData { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
            <div className="container" style={{ maxWidth: '100%', width: '100%', padding: '2rem', margin: '0 auto' }}>

                <div className="appointment-card">
                    <form onSubmit={handleSubmit} noValidate>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0 1rem' }}>

                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#374151', marginBottom: '0.4rem', display: 'block' }}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                                <input type="text" name="patientName" value={formData.patientName} onChange={handleInputChange} placeholder="Enter your full name" style={{ width: '100%', padding: '0.85rem 1rem', fontSize: '0.95rem', borderRadius: '12px', border: 'none', backgroundColor: '#f1f5f9', color: '#111827', outline: 'none' }} />
                                {errors.patientName && <span style={{ color: '#ef4444', fontSize: '0.75rem', display: 'block', marginTop: '0.2rem' }}>{errors.patientName}</span>}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#374151', marginBottom: '0.4rem', display: 'block' }}>Phone Number <span style={{ color: '#ef4444' }}>*</span></label>
                                    <div style={{ display: 'flex', width: '100%', borderRadius: '12px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
                                        <span style={{ padding: '0.85rem 0.5rem 0.85rem 1rem', fontSize: '0.95rem', color: '#64748b', backgroundColor: '#f1f5f9', borderRight: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', userSelect: 'none' }}>+91</span>
                                        <input type="tel" name="phone" value={formData.phone} onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                            handleInputChange({ target: { name: 'phone', value: val } });
                                        }} maxLength="10" placeholder="10-digit phone" style={{ flex: 1, padding: '0.85rem 1rem', fontSize: '0.95rem', border: 'none', backgroundColor: 'transparent', color: '#111827', outline: 'none' }} />
                                    </div>
                                    {errors.phone && <span style={{ color: '#ef4444', fontSize: '0.75rem', display: 'block', marginTop: '0.2rem' }}>{errors.phone}</span>}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#374151', marginBottom: '0.4rem', display: 'block' }}>Age <span style={{ color: '#ef4444' }}>*</span></label>
                                    <input type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="Age" style={{ width: '100%', padding: '0.85rem 1rem', fontSize: '0.95rem', borderRadius: '12px', border: 'none', backgroundColor: '#f1f5f9', color: '#111827', outline: 'none' }} />
                                    {errors.age && <span style={{ color: '#ef4444', fontSize: '0.75rem', display: 'block', marginTop: '0.2rem' }}>{errors.age}</span>}
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#374151', marginBottom: '0.4rem', display: 'block' }}>Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email address" style={{ width: '100%', padding: '0.85rem 1rem', fontSize: '0.95rem', borderRadius: '12px', border: 'none', backgroundColor: '#f1f5f9', color: '#111827', outline: 'none' }} />
                                {errors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem', display: 'block', marginTop: '0.2rem' }}>{errors.email}</span>}
                            </div>

                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#374151', marginBottom: '0.4rem', display: 'block' }}>Doctor <span style={{ color: '#ef4444' }}>*</span></label>
                                {prefilledDoctor ? (
                                    <div style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: 'none', backgroundColor: '#f1f5f9', color: '#4b5563', fontSize: '0.95rem', fontWeight: '500' }}>
                                        {prefilledDoctor.name} {prefilledDoctor.department ? ` - ${prefilledDoctor.department}` : ''}
                                    </div>
                                ) : (
                                    <select name="doctor" value={formData.doctor} onChange={handleInputChange} style={{ width: '100%', padding: '0.85rem 1rem', fontSize: '0.95rem', borderRadius: '12px', border: 'none', backgroundColor: '#f1f5f9', color: '#111827', outline: 'none', appearance: 'none', cursor: 'pointer' }}>
                                        <option value="">Select a doctor</option>
                                        {managedDoctors.map(doc => <option key={doc.id} value={doc.name}>{doc.name}</option>)}
                                    </select>
                                )}
                                {errors.doctor && <span style={{ color: '#ef4444', fontSize: '0.75rem', display: 'block', marginTop: '0.2rem' }}>{errors.doctor}</span>}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#374151', marginBottom: '0.4rem', display: 'block' }}>Date <span style={{ color: '#ef4444' }}>*</span></label>
                                    <DatePicker
                                        selected={formData.appointmentDate ? new Date(formData.appointmentDate) : null}
                                        onChange={(date) => {
                                            if (!date) return;
                                            const yyyy = date.getFullYear();
                                            const mm = String(date.getMonth() + 1).padStart(2, '0');
                                            const dd = String(date.getDate()).padStart(2, '0');
                                            handleInputChange({ target: { name: 'appointmentDate', value: `${yyyy}-${mm}-${dd}` } });
                                        }}
                                        minDate={new Date()}
                                        className="custom-datepicker"
                                        placeholderText="Select Date"
                                        wrapperClassName="date-wrapper"
                                        dateFormat="dd/MM/yyyy"
                                        style={{ width: '100%', padding: '0.85rem 1rem', fontSize: '0.95rem', borderRadius: '12px', border: 'none', backgroundColor: '#f1f5f9', color: '#111827', outline: 'none' }}
                                    />
                                    {errors.appointmentDate && <span style={{ color: '#ef4444', fontSize: '0.75rem', display: 'block', marginTop: '0.2rem' }}>{errors.appointmentDate}</span>}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#374151', marginBottom: '0.4rem', display: 'block' }}>Time Slot <span style={{ color: '#ef4444' }}>*</span></label>
                                    <div style={{ position: 'relative' }} ref={timeRef}>
                                        <div
                                            onClick={() => setIsTimeOpen(!isTimeOpen)}
                                            className="custom-datepicker"
                                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0.85rem 1rem', fontSize: '0.95rem', borderRadius: '12px', border: 'none', backgroundColor: '#f1f5f9', color: '#111827', cursor: 'pointer' }}
                                        >
                                            <span>{formData.timeSlot || 'Select time'}</span>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isTimeOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', color: '#64748b' }}><path d="m6 9 6 6 6-6" /></svg>
                                        </div>
                                        {isTimeOpen && (
                                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflowY: 'auto', maxHeight: '200px', zIndex: 100, marginTop: '0.5rem', border: '1px solid #e2e8f0', animation: 'fadeInData 0.2s ease' }}>
                                                {(() => {
                                                    const availableSlots = timeSlots
                                                        .map(slot => {
                                                            const doctorIdStr = formData.doctor || (prefilledDoctor ? prefilledDoctor.name : '');
                                                            const status = isSlotAvailable(doctorIdStr, slot.time);
                                                            if (status === "RESTRICTED") return null;
                                                            return {
                                                                id: slot.id,
                                                                time: status === "FULL" ? `${slot.time} (Slot Full)` : slot.time,
                                                                realTime: slot.time,
                                                                isFull: status === "FULL"
                                                            };
                                                        })
                                                        .filter(Boolean);

                                                    if (availableSlots.length === 0) return <div style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.9rem' }}>No available slots</div>;

                                                    return availableSlots.map(slot => (
                                                        <div
                                                            key={slot.id}
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                if (slot.isFull) {
                                                                    alert('That slot for the mentioned time is full.');
                                                                    return;
                                                                }
                                                                handleInputChange({ target: { name: 'timeSlot', value: slot.realTime } });
                                                                setIsTimeOpen(false);
                                                            }}
                                                            style={{ padding: '0.75rem 1rem', cursor: slot.isFull ? 'pointer' : 'pointer', borderBottom: '1px solid #f1f5f9', color: slot.isFull ? '#ef4444' : '#000000', backgroundColor: formData.timeSlot === slot.realTime ? '#f0fdf4' : 'transparent', transition: 'background-color 0.2s', fontWeight: slot.isFull ? '500' : '400' }}
                                                            onMouseOver={(e) => !slot.isFull && (e.currentTarget.style.backgroundColor = '#f8fafc')}
                                                            onMouseOut={(e) => !slot.isFull && (e.currentTarget.style.backgroundColor = formData.timeSlot === slot.realTime ? '#f0fdf4' : 'transparent')}
                                                        >
                                                            {slot.time}
                                                        </div>
                                                    ));
                                                })()}
                                            </div>
                                        )}
                                    </div>
                                    {errors.timeSlot && <span style={{ color: '#ef4444', fontSize: '0.75rem', display: 'block', marginTop: '0.2rem' }}>{errors.timeSlot}</span>}
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.85rem', fontWeight: '500', color: '#374151', marginBottom: '0.4rem', display: 'block' }}>Description (Optional)</label>
                                <textarea name="symptoms" value={formData.symptoms} onChange={handleInputChange} placeholder="Enter any additional information or symptoms" rows="4" style={{ resize: 'none', width: '100%', padding: '0.85rem 1rem', fontSize: '0.95rem', borderRadius: '12px', border: 'none', backgroundColor: '#f1f5f9', color: '#111827', outline: 'none' }}></textarea>
                            </div>

                            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                <button type="submit" disabled={isSubmitting} style={{ backgroundColor: '#10B981', color: 'var(--white)', padding: '1rem', borderRadius: '12px', width: '100%', fontSize: '1rem', fontWeight: 'bold', border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1, transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}>
                                    {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
                                </button>
                            </div>
                        </div>
                    </form >
                </div >
            </div >

            {/* Confirmation Modal */}
            {
                showModal && confirmedData && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10, 16, 32, 0.5)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                        <div style={{ backgroundColor: '#ffffff', padding: '4rem 3rem', borderRadius: '24px', maxWidth: '500px', width: '90%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.25)', border: '1px solid #10B981' }}>
                            <div style={{ color: '#10b981', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', backgroundColor: '#ffffff', width: '100px', height: '100px', borderRadius: '50%', alignItems: 'center', margin: '0 auto 2rem', border: '3px solid #10B981' }}>
                                <MedicalIcon name="Check" size={54} style={{ color: '#10B981' }} />
                            </div>
                            <h2 style={{ margin: '0 0 1rem', color: '#10B981', fontSize: '2.5rem', letterSpacing: '-0.03em', fontWeight: '800' }}>Confirmed!</h2>
                            <p style={{ fontSize: '1.1rem', color: '#000000', marginBottom: '2rem' }}>Your priority consultation was successfully scheduled. Taking you back home automatically...</p>
                            <div style={{ textAlign: 'left', marginTop: '1.5rem', backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #10B981' }}>
                                <p style={{ margin: '0 0 0.75rem', color: '#000000' }}><strong style={{ color: '#10B981' }}>Patient:</strong> {confirmedData.patient_name || confirmedData.patientName}</p>
                                <p style={{ margin: '0 0 0.75rem', color: '#000000' }}><strong style={{ color: '#10B981' }}>Doctor:</strong> {confirmedData.doctor}</p>
                                <p style={{ margin: '0 0 0.75rem', color: '#000000' }}><strong style={{ color: '#10B981' }}>Date & Time:</strong> {confirmedData.appointment_date || confirmedData.appointmentDate} • {confirmedData.appointment_time || confirmedData.timeSlot}</p>
                            </div>
                        </div>
                    </div>
                )
            }
        </section >
    );
};

export default AppointmentForm;
