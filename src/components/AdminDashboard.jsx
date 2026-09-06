import React, { useState } from 'react';
import { MedicalIcon } from './MedicalIcon';
import { timeSlots } from '../data/timeSlots';
import { supabase } from '../supabaseClient';

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

    const saveReschedule = () => {
        if (!rescheduleData.date || !rescheduleData.time) return;
        setAppointments(appointments.map(appt =>
            appt.id === rescheduleData.id ? {
                ...appt,
                date: rescheduleData.date,
                time: rescheduleData.time,
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
        <div style={{ display: 'flex', minHeight: '100vh', backgroundcolor: '#334155' }}>

            <aside style={{ width: '280px', backgroundColor: '#f8fafc', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#334155' }}>


                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    <button
                        onClick={() => setActiveTab('attendance')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', background: activeTab === 'attendance' ? 'rgba(255,255,255,0.1)' : 'transparent', color: '#334155', fontWeight: '500', textAlign: 'left', opacity: activeTab === 'attendance' ? 1 : 0.7 }}
                    >
                        <MedicalIcon name="CalendarCheck" size={18} />
                        Attendance Tracking
                    </button>

                    <button
                        onClick={() => setActiveTab('doctors')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', background: activeTab === 'doctors' ? 'rgba(255,255,255,0.1)' : 'transparent', color: '#334155', fontWeight: '500', textAlign: 'left', opacity: activeTab === 'doctors' ? 1 : 0.7 }}
                    >
                        <MedicalIcon name="Users" size={18} />
                        Doctor Management
                    </button>

                    <button
                        onClick={() => setActiveTab('search')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', background: activeTab === 'search' ? 'rgba(255,255,255,0.1)' : 'transparent', color: '#334155', fontWeight: '500', textAlign: 'left', opacity: activeTab === 'search' ? 1 : 0.7 }}
                    >
                        <MedicalIcon name="Search" size={18} />
                        Search Patient
                    </button>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                    <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#334155', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer', opacity: '0.7' }}>
                        <MedicalIcon name="LogOut" size={14} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <main style={{ flex: 1, padding: '3rem', overflowY: 'auto', backgroundcolor: '#334155' }}>

                {activeTab === 'attendance' && (
                    <div className="animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-navy)', margin: 0 }}>Attendance: {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h2>
                            <span style={{ padding: '0.5rem 1rem', background: '#dcfce7', color: '#166534', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' }}>Today Only</span>
                        </div>
                        <div style={{ backgroundcolor: '#334155', borderRadius: '4px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
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
                                            <tr key={appt.id} style={{ borderBottom: '1px solid #e2e8f0', background: rescheduleData.id === appt.id ? '#fefce8' : '#fff' }}>
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
                                                            <input type="date" value={rescheduleData.date} onChange={e => setRescheduleData({ ...rescheduleData, date: e.target.value })} style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                                                            <select value={rescheduleData.time} onChange={e => setRescheduleData({ ...rescheduleData, time: e.target.value })} style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px' }}>
                                                                <option value="">Time</option>
                                                                {timeSlots.map(ts => <option key={ts.id} value={ts.time}>{ts.time}</option>)}
                                                            </select>
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

                        <div style={{ backgroundcolor: '#334155', padding: '1.5rem', borderRadius: '4px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: '1rem', color: 'var(--primary-navy)' }}>Add New Doctor</h3>
                            <form onSubmit={handleAddDoctor} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.3rem', color: 'var(--text-dark)' }}>Doctor Name</label>
                                    <input type="text" value={newDoctor.name} onChange={e => setNewDoctor({ ...newDoctor, name: e.target.value })} placeholder="e.g. Dr. Sarah Smith" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.3rem', color: 'var(--text-dark)' }}>Specialization / Department</label>
                                    <select value={newDoctor.department || ''} onChange={e => setNewDoctor({ ...newDoctor, department: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }}>
                                        <option value="">-- Select Department --</option>
                                        <option value="Cardiologist">Cardiologist</option>
                                        <option value="Dermatologist">Dermatologist</option>
                                        <option value="Pediatrician">Pediatrician</option>
                                        <option value="Orthopedic">Orthopedic</option>
                                        <option value="Neurologist">Neurologist</option>
                                        <option value="Urologist">Urologist</option>
                                        <option value="Endocrinologist">Endocrinologist</option>
                                        <option value="Nephrologist">Nephrologist</option>
                                        <option value="Oncologist">Oncologist</option>
                                    </select>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.3rem', color: 'var(--text-dark)' }}>Shift Start</label>
                                        <select value={newDoctor.slots ? newDoctor.slots.split(' - ')[0] : ''} onChange={e => setNewDoctor({ ...newDoctor, slots: `${e.target.value} - ${newDoctor.slots ? newDoctor.slots.split(' - ')[1] || '05:00 PM' : '05:00 PM'}` })} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundcolor: '#334155' }}>
                                            <option value="">Start</option>
                                            {timeSlots.map(ts => <option key={ts.id} value={ts.time}>{ts.time}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.3rem', color: 'var(--text-dark)' }}>Shift End</label>
                                        <select value={newDoctor.slots ? newDoctor.slots.split(' - ')[1] : ''} onChange={e => setNewDoctor({ ...newDoctor, slots: `${newDoctor.slots ? newDoctor.slots.split(' - ')[0] || '08:00 AM' : '08:00 AM'} - ${e.target.value}` })} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundcolor: '#334155' }}>
                                            <option value="">End</option>
                                            {timeSlots.map(ts => <option key={ts.id} value={ts.time}>{ts.time}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.3rem', color: 'var(--text-dark)' }}>Lunch Break (1 Hour)</label>
                                    <select value={newDoctor.lunch_time} onChange={e => setNewDoctor({ ...newDoctor, lunch_time: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundcolor: '#334155' }}>
                                        <option value="">-- Select Lunch --</option>
                                        <option value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
                                        <option value="12:30 PM - 01:30 PM">12:30 PM - 01:30 PM</option>
                                        <option value="01:00 PM - 02:00 PM">01:00 PM - 02:00 PM</option>
                                        <option value="None">No Lunch Break</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.3rem', color: 'var(--text-dark)' }}>On Leave (Select Date)</label>
                                    <input type="date" value={newDoctor.leave_periods} onChange={e => setNewDoctor({ ...newDoctor, leave_periods: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '500', margin: '0 0 0.3rem 0', color: 'var(--text-dark)' }}>Profile Photo (From PC)</label>
                                    <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundcolor: '#334155' }} />
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
                                <div key={doc.id} style={{ backgroundcolor: '#334155', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {editingDoctorId === doc.id ? (
                                        <form onSubmit={(e) => handleUpdateDoctor(e, doc.id)} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
                                            <input type="text" value={doc.name} onChange={(e) => setManagedDoctors(managedDoctors.map(d => d.id === doc.id ? { ...d, name: e.target.value } : d))} style={{ flex: '1 1 200px', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                                            <select value={doc.department || ''} onChange={(e) => setManagedDoctors(managedDoctors.map(d => d.id === doc.id ? { ...d, department: e.target.value } : d))} style={{ flex: '1 1 150px', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#fff' }}>
                                                <option value="">-- Select Department --</option>
                                                <option value="Cardiologist">Cardiologist</option>
                                                <option value="Dermatologist">Dermatologist</option>
                                                <option value="Pediatrician">Pediatrician</option>
                                                <option value="Orthopedic">Orthopedic</option>
                                                <option value="Neurologist">Neurologist</option>
                                                <option value="Urologist">Urologist</option>
                                                <option value="Endocrinologist">Endocrinologist</option>
                                                <option value="Nephrologist">Nephrologist</option>
                                                <option value="Oncologist">Oncologist</option>
                                            </select>
                                            <input type="text" value={doc.slots} onChange={(e) => setManagedDoctors(managedDoctors.map(d => d.id === doc.id ? { ...d, slots: e.target.value } : d))} style={{ flex: '1 1 150px', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                                            <select value={doc.lunch_time} onChange={(e) => setManagedDoctors(managedDoctors.map(d => d.id === doc.id ? { ...d, lunch_time: e.target.value } : d))} style={{ flex: '1 1 150px', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundcolor: '#334155' }}>
                                                <option value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
                                                <option value="12:30 PM - 01:30 PM">12:30 PM - 01:30 PM</option>
                                                <option value="01:00 PM - 02:00 PM">01:00 PM - 02:00 PM</option>
                                                <option value="None">None</option>
                                            </select>
                                            <input type="date" value={doc.leave_periods} onChange={(e) => setManagedDoctors(managedDoctors.map(d => d.id === doc.id ? { ...d, leave_periods: e.target.value } : d))} style={{ flex: '1 1 150px', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px' }} />
                                            <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { setManagedDoctors(managedDoctors.map(d => d.id === doc.id ? { ...d, photo_url: reader.result } : d)); }; reader.readAsDataURL(file); } }} style={{ flex: '1 1 200px', padding: '0.5rem', border: '1px solid #cbd5e1', borderRadius: '4px', backgroundColor: '#fff', fontSize: '0.75rem' }} />
                                            <button type="submit" style={{ padding: '0.5rem 1rem', background: '#ffffff', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}>Save</button>
                                        </form>
                                    ) : (
                                        <>
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                {doc.photo_url && <img src={doc.photo_url} alt="Dr" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
                                                <div>
                                                    <h4 style={{ margin: '0 0 0.25rem', color: 'var(--primary-navy)', fontSize: '1.1rem' }}>{doc.name}</h4>
                                                    {doc.department && <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>{doc.department}</span>}
                                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-medium)' }}>
                                                        <span><strong>Slots:</strong> {doc.slots || 'N/A'}</span>
                                                        <span><strong>Lunch:</strong> {doc.lunch_time || 'N/A'}</span>
                                                        {doc.leave_periods && doc.leave_periods !== 'None' && <span style={{ color: 'var(--emergency-red)' }}><strong>On Leave:</strong> {doc.leave_periods}</span>}
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

                        <div style={{ marginBottom: '2rem', backgroundcolor: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
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
                                        <input
                                            type="date"
                                            value={searchDate}
                                            onChange={e => setSearchDate(e.target.value)}
                                            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
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

                        <div style={{ backgroundcolor: '#334155', borderRadius: '4px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ backgroundColor: '#f8fafc', color: '#334155' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', fontWeight: '500' }}>Date & Time</th>
                                        <th style={{ padding: '1rem', fontWeight: '500' }}>Patient Info</th>
                                        <th style={{ padding: '1rem', fontWeight: '500' }}>Doctor</th>
                                        <th style={{ padding: '1rem', fontWeight: '500' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchedAppointments.length === 0 ? (
                                        <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-medium)' }}>No patients found matching the criteria.</td></tr>
                                    ) : (
                                        searchedAppointments.map(appt => (
                                            <tr key={appt.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ fontWeight: '500', color: 'var(--primary-navy)' }}>{appt.appointment_date}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)' }}>{appt.appointment_time}</div>
                                                </td>
                                                <td style={{ padding: '1rem' }}>
                                                    <div style={{ fontWeight: '500', color: 'var(--text-dark)' }}>{appt.patient_name}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-medium)' }}>Age: {appt.patient_age} &bull; Ph: {appt.phone}</div>
                                                </td>
                                                <td style={{ padding: '1rem', color: 'var(--text-dark)' }}>{appt.doctor}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <span style={{ display: 'inline-block', padding: '0.35rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '500', backgroundColor: appt.attended ? '#dcfce7' : (appt.status === 'No Show' ? '#fee2e2' : '#f1f5f9'), color: appt.attended ? '#166534' : (appt.status === 'No Show' ? '#991b1b' : 'var(--text-medium)') }}>
                                                        {appt.attended ? 'Present' : (appt.status || 'Scheduled')}
                                                    </span>
                                                </td>
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
    );
};

export default AdminDashboard;



















