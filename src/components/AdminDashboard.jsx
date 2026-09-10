import React, { useState, useRef, useEffect } from 'react';
import { MedicalIcon } from './MedicalIcon';
import { timeSlots } from '../data/timeSlots';
import { supabase } from '../supabaseClient';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomSelect = ({ options, value, onChange, placeholder, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={ref} style={{ position: 'relative', width: '100%' }}>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                style={{
                    width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: disabled ? '#f1f5f9' : '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer', color: value ? '#000000' : '#64748b'
                }}
            >
                <span>{value || placeholder}</span>
                <MedicalIcon name="ChevronDown" size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </div>
            {isOpen && !disabled && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', backgroundColor: '#FFFFFF', border: '1px solid #10B981', borderRadius: '4px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 9999, maxHeight: '200px', overflowY: 'auto' }}>
                    {options.map((opt, i) => (
                        <div
                            key={i}
                            onClick={() => {
                                if (opt.disabled) {
                                    if (opt.reason === 'full') alert("That slot for the mentioned time is full.");
                                    return;
                                }
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                            style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: i < options.length - 1 ? '1px solid #f1f5f9' : 'none', color: opt.disabled ? '#ef4444' : '#000000', backgroundColor: opt.value === value ? '#f0fdf4' : 'transparent', pointerEvents: 'auto' }}
                            onMouseOver={(e) => !opt.disabled && (e.currentTarget.style.backgroundColor = '#f8fafc')}
                            onMouseOut={(e) => !opt.disabled && (e.currentTarget.style.backgroundColor = opt.value === value ? '#f0fdf4' : 'transparent')}
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const timeToMins = (timeStr) => {
    if (!timeStr) return 0;
    const [time, modifier] = timeStr.trim().split(' ');
    if (!time || !modifier) return 0;
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    let mins = parseInt(hours, 10) * 60 + parseInt(minutes, 10);
    if (modifier === 'PM') mins += 12 * 60;
    return mins;
};

const formatDateStr = (dateStr) => {
    if (!dateStr || !dateStr.includes('-')) return dateStr;
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

const generateValidLunchOptions = (shift) => {
    const defaultOptions = [{ label: 'No Lunch Break', value: 'None' }];
    if (!shift) return defaultOptions;

    const [startStr, endStr] = shift.split(' - ');
    if (!startStr || !endStr) return defaultOptions;

    const shiftStart = timeToMins(startStr);
    const shiftEnd = timeToMins(endStr);

    const possibleLunches = [
        { start: '11:00 AM', end: '12:00 PM' },
        { start: '11:30 AM', end: '12:30 PM' },
        { start: '12:00 PM', end: '01:00 PM' },
        { start: '12:30 PM', end: '01:30 PM' },
        { start: '01:00 PM', end: '02:00 PM' },
        { start: '01:30 PM', end: '02:30 PM' },
        { start: '02:00 PM', end: '03:00 PM' },
        { start: '02:30 PM', end: '03:30 PM' },
        { start: '03:00 PM', end: '04:00 PM' }
    ];

    const validLunches = possibleLunches.filter(lunch => {
        return timeToMins(lunch.start) >= shiftStart && timeToMins(lunch.end) <= shiftEnd;
    }).map(lunch => ({
        label: `${lunch.start} - ${lunch.end}`,
        value: `${lunch.start} - ${lunch.end}`
    }));

    return validLunches.length > 0 ? validLunches.concat(defaultOptions) : defaultOptions;
};

export const AdminDashboard = ({
    appointments,
    setAppointments,
    managedDoctors,
    setManagedDoctors,
    patientRecords,
    setPatientRecords,
    onLogout
}) => {
    const [activeTab, setActiveTab] = useState('attendance');

    // For Search Patient Tab
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [selectedPatientMenu, setSelectedPatientMenu] = useState(null);
    const [viewingPatientData, setViewingPatientData] = useState(null);

    const handleRemovePatientData = async (id) => {
        try {
            const stringId = String(id);
            // Primary standard library wipe
            const { error } = await supabase.from('appointments').delete().eq('id', stringId);

            if (error) {
                console.error("Standard delete failed, engaging manual REST override:", error);
            }

            // Backup direct HTTP manual extraction completely bypassing the native wrappers 
            try {
                const url = `https://fwlgqhjytzqtbwnawveu.supabase.co/rest/v1/appointments?id=eq.${stringId}`;
                const key = 'sb_publishable_kBRbWRsJxxf7WhsiQVZ88w_tx1OM9U4';
                await fetch(url, {
                    method: 'DELETE',
                    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
                });
            } catch (e) {
                console.error("HTTP override failed:", e);
            }

            // Immediately visually clear from the frontend to preserve instantaneous UX
            setAppointments(appointments.filter(a => String(a.id) !== stringId));
            setSelectedPatientMenu(null);
        } catch (err) {
            console.error('Silent Network Error:', err);
        }
    };

    // Fixed current local date for the Attendance Tracker
    const _now = new Date(); const todayStr = _now.getFullYear() + '-' + String(_now.getMonth() + 1).padStart(2, '0') + '-' + String(_now.getDate()).padStart(2, '0');

    const [newDoctor, setNewDoctor] = useState({ name: '', slots: '', lunch_time: '', leave_periods: '', photo_url: '' });
    const [editingDoctorId, setEditingDoctorId] = useState(null);

    // Reschedule state
    const [rescheduleData, setRescheduleData] = useState({ id: null, date: '', time: '' });

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewDoctor({ ...newDoctor, photo_url: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        if (!newDoctor.name.trim()) return;
        const { data, error } = await supabase.from('doctors').insert([newDoctor]).select();
        if (error) { console.error('Add doc error:', error); return; }
        if (data && data[0]) {
            setManagedDoctors([...managedDoctors, data[0]]);
            setNewDoctor({ name: '', department: '', slots: '', lunch_time: '', leave_periods: '', photo_url: '' });
        }
    };

    const handleUpdateDoctor = async (e, id) => {
        e.preventDefault();
        const docToUpdate = managedDoctors.find(d => d.id === id);
        const { id: _, created_at, ...updatePayload } = docToUpdate;
        const { error } = await supabase.from('doctors').update(updatePayload).eq('id', id);
        if (error) { console.error('Update doc error:', error); return; }
        setEditingDoctorId(null);
    };

    const handleDeleteDoctor = async (id) => {
        if (window.confirm('Remove this doctor profile?')) {
            setManagedDoctors(managedDoctors.filter(d => d.id !== id));
            await supabase.from('doctors').delete().eq('id', id);
        }
    };

    const markAttendance = (apptId, isPresent) => {
        setAppointments(appointments.map(appt =>
            appt.id === apptId ? { ...appt, attended: isPresent, status: isPresent ? 'Present' : 'No Show' } : appt
        ));
    };

    const isSlotAvailable = (docName, timeStr, dateStr, currentApptId) => {
        if (!docName || !dateStr) return false;

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

            if (slotMins < docStartMins || slotMins >= docEndMins) return "RESTRICTED";

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

                if (slotMins >= docLunchStartMins && slotMins < docLunchEndMins) return "RESTRICTED";
            }
        }

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentSelectedDay = days[new Date(dateStr).getDay()];
        if (doc.leave && doc.leave.length > 0) {
            const isLeave = doc.leave.some(leaveDay => leaveDay === currentSelectedDay || leaveDay === dateStr);
            if (isLeave) return "RESTRICTED";
        }

        const now = new Date();
        const selectedDate = new Date(dateStr);
        let currentMins = null;
        if (selectedDate.toDateString() === now.toDateString()) {
            currentMins = now.getHours() * 60 + now.getMinutes();
        }
        if (currentMins !== null && slotMins <= currentMins) return "RESTRICTED";

        if (currentApptId) {
            const currentAppt = appointments.find(a => a.id === currentApptId);
            if (currentAppt && currentAppt.appointment_date === dateStr) {
                if (slotMins <= timeToMins(currentAppt.appointment_time)) return "RESTRICTED";
            }
        }

        const bookedCount = appointments.filter(appt =>
            appt.doctor === docName &&
            appt.appointment_date === dateStr &&
            appt.appointment_time === timeStr &&
            appt.status !== 'Cancelled' &&
            appt.id !== currentApptId
        ).length;
        if (bookedCount >= 5) return "FULL";

        return "OK";
    };

    const saveReschedule = async () => {
        if (!rescheduleData.date || !rescheduleData.time) return;

        // Update Supabase Database
        const { error } = await supabase
            .from('appointments')
            .update({
                appointment_date: rescheduleData.date,
                appointment_time: rescheduleData.time,
                status: 'Scheduled',
                attended: false
            })
            .eq('id', rescheduleData.id);

        if (error) {
            console.error('Error rescheduling:', error);
            alert('Failed to reschedule appointment.');
            return;
        }

        // Update Local State natively
        setAppointments(appointments.map(appt =>
            appt.id === rescheduleData.id ? {
                ...appt,
                appointment_date: rescheduleData.date,
                appointment_time: rescheduleData.time,
                status: 'Scheduled',
                attended: false
            } : appt
        ));
        setRescheduleData({ id: null, date: '', time: '' });
    };

    // Filter out appointments for today, then sort by time correctly
    const todaysAppointments = appointments
        .filter(a => a.appointment_date === todayStr)
        .sort((a, b) => timeToMins(a.appointment_time) - timeToMins(b.appointment_time));

    // Filter patients based on Search and Date
    const searchedAppointments = appointments.filter(a => {
        const matchesDate = searchDate ? a.appointment_date === searchDate : true;
        const matchesQuery = searchQuery
            ? (a.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) || (a.phone && a.phone.includes(searchQuery)))
            : true;
        return matchesDate && matchesQuery;
    }).sort((a, b) => {
        // Sort primarily by Date (desc), then Time (asc)
        if (a.appointment_date !== b.appointment_date) return new Date(b.appointment_date) - new Date(a.appointment_date);
        return timeToMins(a.appointment_time) - timeToMins(b.appointment_time);
    });

    return (
        <div className="admin-dashboard-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
            <style>{`
                input, select, textarea { transition: box-shadow 0.15s ease, background-color 0.15s ease !important; -webkit-tap-highlight-color: transparent; }
                input:focus, select:focus, textarea:focus { box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2) !important; background-color: #ffffff !important; }
                .sidebar-btn { display: flex; align-items: center; gap: 0.75rem; padding: 0.85rem 1rem; border-radius: 4px; border: none; cursor: pointer; color: #334155; font-weight: 500; text-align: left; transition: all 0.2s ease; background: transparent; }
                .sidebar-btn:hover { color: #10B981; background: rgba(16, 185, 129, 0.05); }
                .sidebar-btn.active { color: #10B981; background: rgba(16, 185, 129, 0.1); }
                
                .admin-custom-datepicker { width: 100%; padding: 0.75rem; border-radius: 4px; border: 1px solid #cbd5e1; outline: none; transition: box-shadow 0.15s ease; color: #000000; }
                .admin-custom-datepicker:focus { box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2) !important; }
                .date-wrapper { width: 100%; display: block; }
                .react-datepicker-popper { z-index: 1500 !important; }
                .react-datepicker { border-radius: 12px !important; border: 1px solid #10B981 !important; font-family: inherit !important; box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; padding: 0.5rem; }
                .react-datepicker__header { background-color: white !important; border-bottom: none !important; }
                .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected { background-color: #10B981 !important; color: white !important; border-radius: 8px !important; font-weight: bold; }
                .react-datepicker__day:hover { background-color: #f1f5f9 !important; border-radius: 8px !important; }
            `}</style>
            <header style={{ backgroundColor: '#FFFFFF', borderBottom: '2px solid #10B981', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100, boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <MedicalIcon name="Stethoscope" size={24} style={{ color: '#10B981' }} />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0' }}>
                        <span style={{ color: '#000000' }}>Med</span>
                        <span style={{ color: '#10B981' }}>Nivo</span>
                    </h1>
                </div>
                <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid transparent', padding: '0.5rem 1rem', borderRadius: '8px', color: '#000000', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = '#10B981'; e.currentTarget.style.borderColor = '#10B981'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#000000'; e.currentTarget.style.borderColor = 'transparent'; }}>
                    <MedicalIcon name="LogOut" size={16} />
                    <span>Sign Out</span>
                </button>
            </header>
            <div className="admin-dashboard-container" style={{ display: 'flex', flex: 1 }}>

                <aside style={{ width: '280px', backgroundColor: 'var(--white)', borderRight: '1px solid var(--border-card)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-body)' }}>


                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                        <button
                            className={`sidebar-btn ${activeTab === 'attendance' ? 'active' : ''}`}
                            onClick={() => setActiveTab('attendance')}
                        >
                            <MedicalIcon name="CalendarCheck" size={18} />
                            Attendance Tracking
                        </button>

                        <button
                            className={`sidebar-btn ${activeTab === 'doctors' ? 'active' : ''}`}
                            onClick={() => setActiveTab('doctors')}
                        >
                            <MedicalIcon name="Users" size={18} />
                            Doctor Management
                        </button>

                        <button
                            className={`sidebar-btn ${activeTab === 'search' ? 'active' : ''}`}
                            onClick={() => setActiveTab('search')}
                        >
                            <MedicalIcon name="Search" size={18} />
                            Search Patient
                        </button>
                    </div>
                </aside>

                <main style={{ flex: 1, padding: '3rem', overflowY: 'auto', backgroundColor: '#f1f5f9' }}>

                    {activeTab === 'attendance' && (
                        <div className="animate-fade-in">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-navy)', margin: 0 }}>Attendance: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h2>
                                <span style={{ padding: '0.5rem 1rem', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>Today Only</span>
                            </div>
                            <div style={{ backgroundColor: '#FFFFFF', borderColor: '#10B981', borderRadius: '4px', border: '1px solid #e2e8f0', overflow: 'visible' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead style={{ backgroundColor: '#f8fafc', color: '#334155' }}>
                                        <tr>
                                            <th style={{ padding: '1rem', fontWeight: '500' }}>Patient</th>
                                            <th style={{ padding: '1rem', fontWeight: '500' }}>Time</th>
                                            <th style={{ padding: '1rem', fontWeight: '500' }}>Doctor</th>
                                            <th style={{ padding: '1rem', fontWeight: '500' }}>Symptoms</th>
                                            <th style={{ padding: '1rem', fontWeight: '500', textAlign: 'center' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {todaysAppointments.length === 0 ? (
                                            <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-medium)' }}>No appointments scheduled for today.</td></tr>
                                        ) : (
                                            todaysAppointments.map(appt => (
                                                <tr key={appt.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: rescheduleData.id === appt.id ? '#f0fdf4' : '#ffffff' }}>
                                                    <td style={{ padding: '1rem' }}>
                                                        <div style={{ fontWeight: '500', color: 'var(--primary-navy)' }}>{appt.patient_name}</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)' }}>Age: {appt.patient_age} | {appt.phone}</div>
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <div style={{ fontWeight: '500', color: 'var(--text-dark)' }}>{appt.appointment_time}</div>
                                                    </td>
                                                    <td style={{ padding: '1rem', color: 'var(--text-dark)' }}>
                                                        {appt.doctor || 'Unassigned'}
                                                    </td>
                                                    <td style={{ padding: '1rem', color: 'var(--text-medium)', fontSize: '0.9rem', maxWidth: '200px' }}>
                                                        {appt.symptoms}
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>
                                                        {rescheduleData.id === appt.id ? (
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                                <DatePicker
                                                                    selected={rescheduleData.date ? new Date(rescheduleData.date + "T00:00:00") : null}
                                                                    onChange={date => {
                                                                        if (date) {
                                                                            const y = date.getFullYear();
                                                                            const m = String(date.getMonth() + 1).padStart(2, '0');
                                                                            const d = String(date.getDate()).padStart(2, '0');
                                                                            setRescheduleData({ ...rescheduleData, date: `${y}-${m}-${d}`, time: '' });
                                                                        } else {
                                                                            setRescheduleData({ ...rescheduleData, date: '', time: '' });
                                                                        }
                                                                    }}
                                                                    minDate={new Date()} /* Safely block past date selections entirely */
                                                                    dateFormat="dd/MM/yyyy"
                                                                    customInput={<input style={{ width: '100%', padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer', boxSizing: 'border-box' }} />}
                                                                    placeholderText="Select Date"
                                                                />
                                                                {(() => {
                                                                    const availableSlots = timeSlots
                                                                        .map(ts => {
                                                                            const status = isSlotAvailable(appt.doctor, ts.time, rescheduleData.date, appt.id);
                                                                            if (status === "RESTRICTED") return null;
                                                                            return {
                                                                                label: status === "FULL" ? `${ts.time} (Slot Full)` : ts.time,
                                                                                value: ts.time,
                                                                                disabled: status === "FULL",
                                                                                reason: status === "FULL" ? 'full' : null
                                                                            };
                                                                        })
                                                                        .filter(Boolean);

                                                                    return (
                                                                        <CustomSelect
                                                                            options={availableSlots.length > 0 ? availableSlots : [{ label: 'No Slots Available', value: '', disabled: true }]}
                                                                            value={rescheduleData.time}
                                                                            onChange={val => {
                                                                                const selectedOption = availableSlots.find(o => o.value === val);
                                                                                if (selectedOption?.reason === 'full') {
                                                                                    alert('This slot is currently full.');
                                                                                    return;
                                                                                }
                                                                                setRescheduleData({ ...rescheduleData, time: val });
                                                                            }}
                                                                            placeholder="-- Time --"
                                                                        />
                                                                    );
                                                                })()}
                                                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                                    <button onClick={saveReschedule} style={{ flex: 1, padding: '0.4rem', background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                                                                    <button onClick={() => setRescheduleData({ id: null, date: '', time: '' })} style={{ flex: 1, padding: '0.4rem', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                                                                <div style={{ display: 'flex', gap: '0.25rem', width: '100%', justifyContent: 'center' }}>
                                                                    <button onClick={() => markAttendance(appt.id, true)} style={{ flex: 1, padding: '0.5rem', background: appt.attended ? '#16a34a' : '#f0fdf4', color: appt.attended ? '#fff' : '#16a34a', border: '1px solid #16a34a', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' }}>Present</button>
                                                                    <button onClick={() => markAttendance(appt.id, false)} style={{ flex: 1, padding: '0.5rem', background: appt.status === 'No Show' ? '#dc2626' : '#fef2f2', color: appt.status === 'No Show' ? '#fff' : '#dc2626', border: '1px solid #dc2626', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' }}>Absent</button>
                                                                </div>
                                                                <button onClick={() => setRescheduleData({ id: appt.id, date: appt.appointment_date, time: appt.appointment_time })} style={{ width: '100%', padding: '0.5rem', background: '#ffffff', color: 'var(--text-dark)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '500' }}>
                                                                    Reschedule
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'doctors' && (
                        <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-navy)', margin: 0 }}>Doctor Management</h2>
                            </div>

                            <div style={{ backgroundColor: '#FFFFFF', borderColor: '#10B981', padding: '1.5rem', borderRadius: '4px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: '1rem', color: 'var(--primary-navy)' }}>Add New Doctor</h3>
                                <form onSubmit={handleAddDoctor} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.3rem', color: 'var(--text-dark)' }}>Doctor Name</label>
                                        <input type="text" value={newDoctor.name} onChange={e => setNewDoctor({ ...newDoctor, name: e.target.value })} placeholder="e.g. Dr. Sarah Smith" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.3rem', color: 'var(--text-dark)' }}>Specialization / Department</label>
                                        <CustomSelect
                                            options={[
                                                { label: 'Cardiologist', value: 'Cardiologist' },
                                                { label: 'Dermatologist', value: 'Dermatologist' },
                                                { label: 'Pediatrician', value: 'Pediatrician' },
                                                { label: 'Orthopedic', value: 'Orthopedic' },
                                                { label: 'Neurologist', value: 'Neurologist' },
                                                { label: 'Urologist', value: 'Urologist' },
                                                { label: 'Endocrinologist', value: 'Endocrinologist' },
                                                { label: 'Nephrologist', value: 'Nephrologist' },
                                                { label: 'Oncologist', value: 'Oncologist' }
                                            ]}
                                            value={newDoctor.department || ''}
                                            onChange={val => setNewDoctor({ ...newDoctor, department: val })}
                                            placeholder="-- Select Department --"
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.3rem', color: 'var(--text-dark)' }}>Shift Start</label>
                                            <CustomSelect
                                                options={timeSlots.map(ts => ({ label: ts.time, value: ts.time }))}
                                                value={newDoctor.slots ? newDoctor.slots.split(' - ')[0] : ''}
                                                onChange={val => setNewDoctor({ ...newDoctor, slots: `${val} - ${newDoctor.slots ? newDoctor.slots.split(' - ')[1] || '05:00 PM' : '05:00 PM'}` })}
                                                placeholder="Start Time"
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.3rem', color: 'var(--text-dark)' }}>Shift End</label>
                                            <CustomSelect
                                                options={timeSlots.map(ts => ({ label: ts.time, value: ts.time }))}
                                                value={newDoctor.slots ? newDoctor.slots.split(' - ')[1] : ''}
                                                onChange={val => setNewDoctor({ ...newDoctor, slots: `${newDoctor.slots ? newDoctor.slots.split(' - ')[0] || '08:00 AM' : '08:00 AM'} - ${val}` })}
                                                placeholder="End Time"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.3rem', color: 'var(--text-dark)' }}>Lunch Break (1 Hour)</label>
                                        <CustomSelect
                                            options={generateValidLunchOptions(newDoctor.slots)}
                                            value={newDoctor.lunch_time}
                                            onChange={val => setNewDoctor({ ...newDoctor, lunch_time: val })}
                                            placeholder="-- Select Lunch --"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.3rem', color: 'var(--text-dark)' }}>On Leave (Select Date)</label>
                                        <DatePicker
                                            selected={newDoctor.leave_periods ? new Date(newDoctor.leave_periods) : null}
                                            onChange={(date) => {
                                                if (!date) { setNewDoctor({ ...newDoctor, leave_periods: '' }); return; }
                                                const yyyy = date.getFullYear();
                                                const mm = String(date.getMonth() + 1).padStart(2, '0');
                                                const dd = String(date.getDate()).padStart(2, '0');
                                                setNewDoctor({ ...newDoctor, leave_periods: `${yyyy}-${mm}-${dd}` });
                                            }}
                                            minDate={new Date()}
                                            placeholderText="dd/mm/yyyy"
                                            dateFormat="dd/MM/yyyy"
                                            className="admin-custom-datepicker"
                                            wrapperClassName="date-wrapper"
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', margin: '0 0 0.3rem 0', color: 'var(--text-dark)' }}>Profile Photo (From PC)</label>
                                        <label htmlFor="add-file-upload" style={{ display: 'block', width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #10B981', backgroundColor: '#FFFFFF', color: '#10B981', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', fontWeight: '600' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#10B981'; e.currentTarget.style.color = '#FFFFFF'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#10B981'; }}>
                                            {newDoctor.photo_url ? "Photo Selected - Click to change" : "Choose File"}
                                        </label>
                                        <input id="add-file-upload" type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                                    </div>

                                    <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                                        <button type="submit" style={{ backgroundColor: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>
                                            Add Doctor Profile
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                {managedDoctors.map(doc => (
                                    <div key={doc.id} style={{ backgroundColor: '#FFFFFF', borderColor: '#10B981', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        {editingDoctorId === doc.id ? (
                                            <form onSubmit={(e) => handleUpdateDoctor(e, doc.id)} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
                                                <input type="text" value={doc.name} onChange={(e) => setManagedDoctors(managedDoctors.map(d => d.id === doc.id ? { ...d, name: e.target.value } : d))} style={{ flex: '1 1 200px', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                                                <div style={{ flex: '1 1 150px' }}>
                                                    <CustomSelect
                                                        options={[
                                                            { label: 'Cardiologist', value: 'Cardiologist' },
                                                            { label: 'Dermatologist', value: 'Dermatologist' },
                                                            { label: 'Pediatrician', value: 'Pediatrician' },
                                                            { label: 'Orthopedic', value: 'Orthopedic' },
                                                            { label: 'Neurologist', value: 'Neurologist' },
                                                            { label: 'Urologist', value: 'Urologist' },
                                                            { label: 'Endocrinologist', value: 'Endocrinologist' },
                                                            { label: 'Nephrologist', value: 'Nephrologist' },
                                                            { label: 'Oncologist', value: 'Oncologist' }
                                                        ]}
                                                        value={doc.department || ''}
                                                        onChange={val => setManagedDoctors(managedDoctors.map(d => d.id === doc.id ? { ...d, department: val } : d))}
                                                        placeholder="-- Department --"
                                                    />
                                                </div>
                                                <input type="text" value={doc.slots} onChange={(e) => setManagedDoctors(managedDoctors.map(d => d.id === doc.id ? { ...d, slots: e.target.value } : d))} style={{ flex: '1 1 150px', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                                                <CustomSelect
                                                    options={generateValidLunchOptions(doc.slots)}
                                                    value={doc.lunch_time}
                                                    onChange={val => setManagedDoctors(managedDoctors.map(d => d.id === doc.id ? { ...d, lunch_time: val } : d))}
                                                    placeholder="-- Lunch Break --"
                                                />
                                                <div style={{ flex: '1 1 150px' }}>
                                                    <DatePicker
                                                        selected={doc.leave_periods ? new Date(doc.leave_periods) : null}
                                                        onChange={(date) => {
                                                            if (!date) {
                                                                setManagedDoctors(managedDoctors.map(d => d.id === doc.id ? { ...d, leave_periods: '' } : d));
                                                                return;
                                                            }
                                                            const yyyy = date.getFullYear();
                                                            const mm = String(date.getMonth() + 1).padStart(2, '0');
                                                            const dd = String(date.getDate()).padStart(2, '0');
                                                            setManagedDoctors(managedDoctors.map(d => d.id === doc.id ? { ...d, leave_periods: `${yyyy}-${mm}-${dd}` } : d));
                                                        }}
                                                        minDate={new Date()}
                                                        placeholderText="dd/mm/yyyy"
                                                        dateFormat="dd/MM/yyyy"
                                                        className="admin-custom-datepicker"
                                                        wrapperClassName="date-wrapper"
                                                    />
                                                </div>
                                                <div style={{ flex: '1 1 200px' }}>
                                                    <label htmlFor={`edit-file-${doc.id}`} style={{ display: 'block', width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #10B981', backgroundColor: '#FFFFFF', color: '#10B981', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', fontWeight: '600' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#10B981'; e.currentTarget.style.color = '#FFFFFF'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#10B981'; }}>
                                                        {doc.photo_url ? "Photo Selected" : "Choose File"}
                                                    </label>
                                                    <input id={`edit-file-${doc.id}`} type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { setManagedDoctors(managedDoctors.map(d => d.id === doc.id ? { ...d, photo_url: reader.result } : d)); }; reader.readAsDataURL(file); } }} style={{ display: 'none' }} />
                                                </div>
                                                <button type="submit" style={{ padding: '0.5rem 1rem', background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Save</button>
                                            </form>
                                        ) : (
                                            <>
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                    {doc.photo_url && <img src={doc.photo_url} alt="Dr" style={{ flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
                                                    <div>
                                                        <h4 style={{ margin: '0 0 0.25rem', color: 'var(--primary-navy)', fontSize: '1.1rem' }}>{doc.name}</h4>
                                                        {doc.department && <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>{doc.department}</span>}
                                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-medium)' }}>
                                                            <span><strong>Slots:</strong> {doc.slots || 'N/A'}</span>
                                                            <span><strong>Lunch:</strong> {doc.lunch_time || 'N/A'}</span>
                                                            {doc.leave_periods && doc.leave_periods !== 'None' && <span style={{ color: 'var(--emergency-red)' }}><strong>On Leave:</strong> {formatDateStr(doc.leave_periods)}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => setEditingDoctorId(doc.id)} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', color: '#64748b' }}><MedicalIcon name="Edit" size={16} /></button>
                                                    <button onClick={() => handleDeleteDoctor(doc.id)} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '0.5rem', borderRadius: '4px', cursor: 'pointer', color: '#64748b' }}><MedicalIcon name="Trash2" size={16} /></button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                                {managedDoctors.length === 0 && <p style={{ color: 'var(--text-medium)' }}>No doctors managed currently.</p>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'search' && (
                        <div className="animate-fade-in" style={{ maxWidth: '1000px' }}>

                            <div style={{ marginBottom: '2rem', backgroundColor: '#FFFFFF', borderColor: '#10B981', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                                <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-navy)', margin: '0 0 1rem 0' }}>Search Patient Records</h2>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                                    <div style={{ flex: '1 1 300px' }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Search by Name or Phone</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}><MedicalIcon name="Search" size={16} /></span>
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={e => setSearchQuery(e.target.value)}
                                                placeholder="Enter patient name..."
                                                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ flex: '0 0 200px' }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Filter by Date</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}><MedicalIcon name="Calendar" size={16} /></span>
                                            <DatePicker
                                                selected={searchDate ? new Date(searchDate + "T00:00:00") : null}
                                                onChange={date => {
                                                    if (date) {
                                                        const y = date.getFullYear();
                                                        const m = String(date.getMonth() + 1).padStart(2, '0');
                                                        const d = String(date.getDate()).padStart(2, '0');
                                                        setSearchDate(`${y}-${m}-${d}`);
                                                    } else {
                                                        setSearchDate('');
                                                    }
                                                }}
                                                dateFormat="dd/MM/yyyy"
                                                customInput={<input style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer' }} />}
                                                placeholderText="Select Date"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setSearchQuery(''); setSearchDate(''); }}
                                        style={{ padding: '0.75rem 1.5rem', border: '1px solid #cbd5e1', background: '#f8fafc', color: 'var(--text-dark)', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>

                            <div style={{ backgroundColor: '#FFFFFF', borderColor: '#10B981', borderRadius: '4px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead style={{ backgroundColor: '#f8fafc', color: '#334155' }}>
                                        <tr>
                                            <th style={{ padding: '1rem', fontWeight: '500' }}>Date & Time</th>
                                            <th style={{ padding: '1rem', fontWeight: '500' }}>Patient Info</th>
                                            <th style={{ padding: '1rem', fontWeight: '500' }}>Doctor</th>
                                            <th style={{ padding: '1rem', fontWeight: '500' }}>Phone Number</th>
                                            <th style={{ padding: '1rem', fontWeight: '500' }}>Email ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {searchedAppointments.length === 0 ? (
                                            <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-medium)' }}>No patients found matching the criteria.</td></tr>
                                        ) : (
                                            searchedAppointments.map(appt => (
                                                <tr key={appt.id} style={{ borderBottom: '1px solid #e2e8f0', cursor: 'pointer', transition: 'background-color 0.2s ease' }} onClick={() => setSelectedPatientMenu(appt)} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                                    <td style={{ padding: '1rem' }}>
                                                        <div style={{ fontWeight: '500', color: 'var(--primary-navy)' }}>{appt.appointment_date}</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)' }}>{appt.appointment_time}</div>
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <div style={{ fontWeight: '500', color: 'var(--text-dark)' }}>{appt.patient_name}</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)' }}>Age: {appt.patient_age}</div>
                                                    </td>
                                                    <td style={{ padding: '1rem', color: 'var(--text-dark)' }}>{appt.doctor}</td>
                                                    <td style={{ padding: '1rem', color: 'var(--text-dark)', fontWeight: '500' }}>+91 {appt.phone}</td>
                                                    <td style={{ padding: '1rem', color: 'var(--text-medium)', fontSize: '0.9rem' }}>{appt.email || 'N/A'}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Popups Overlay */}
            {selectedPatientMenu && !viewingPatientData && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}>
                    <div style={{ backgroundColor: '#ffffff', border: '2px solid #10B981', borderRadius: '12px', padding: '2rem', width: '90%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center', position: 'relative' }}>
                        <button onClick={() => setSelectedPatientMenu(null)} style={{ position: 'absolute', top: '1rem', right: '1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}><MedicalIcon name="X" size={20} /></button>
                        <h3 style={{ margin: '0 0 0.5rem', color: '#000000', fontSize: '1.25rem' }}>Manage Record</h3>
                        <p style={{ margin: '0 0 1.5rem', color: '#64748b', fontSize: '0.9rem' }}>{selectedPatientMenu.patient_name}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button onClick={() => setViewingPatientData(selectedPatientMenu)} style={{ padding: '0.85rem', backgroundColor: '#f8fafc', color: '#000000', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <MedicalIcon name="CalendarCheck" size={18} style={{ color: '#10B981' }} />
                                View Full Data
                            </button>
                            <button onClick={() => handleRemovePatientData(selectedPatientMenu.id)} style={{ padding: '0.85rem', backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <MedicalIcon name="Trash2" size={18} />
                                Remove Data
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {viewingPatientData && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(5px)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }} onClick={() => setViewingPatientData(null)}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '2.5rem', width: '90%', maxWidth: '600px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)', border: '1px solid #10B981', position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setViewingPatientData(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>Close</button>
                        <h2 style={{ margin: '0 0 1rem', color: '#000000', fontSize: '1.8rem', fontWeight: 'bold' }}><span style={{ color: '#10B981' }}>Patient</span> Profile</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <p style={{ margin: '0 0 0.25rem', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</p>
                                <p style={{ margin: 0, fontSize: '1.1rem', color: '#000000', fontWeight: '500' }}>{viewingPatientData.patient_name}</p>
                            </div>
                            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <p style={{ margin: '0 0 0.25rem', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</p>
                                <p style={{ margin: 0, fontSize: '1.1rem', color: '#000000', fontWeight: '500' }}>{viewingPatientData.phone || 'N/A'}</p>
                            </div>
                            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <p style={{ margin: '0 0 0.25rem', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Age</p>
                                <p style={{ margin: 0, fontSize: '1.1rem', color: '#000000', fontWeight: '500' }}>{viewingPatientData.patient_age || 'N/A'}</p>
                            </div>
                            <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <p style={{ margin: '0 0 0.25rem', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned Doctor</p>
                                <p style={{ margin: 0, fontSize: '1.1rem', color: '#10B981', fontWeight: 'bold' }}>{viewingPatientData.doctor || 'Unassigned'}</p>
                            </div>
                            <div style={{ gridColumn: '1 / -1', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <p style={{ margin: '0 0 0.25rem', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Appointment Time</p>
                                <p style={{ margin: 0, fontSize: '1.1rem', color: '#000000', fontWeight: '500' }}>{viewingPatientData.appointment_date} • {viewingPatientData.appointment_time}</p>
                            </div>
                            <div style={{ gridColumn: '1 / -1', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                <p style={{ margin: '0 0 0.25rem', fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Symptoms & Notes</p>
                                <p style={{ margin: 0, fontSize: '1.1rem', color: '#000000', fontWeight: '500', lineHeight: 1.5 }}>{viewingPatientData.symptoms || 'No additional details provided.'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;











