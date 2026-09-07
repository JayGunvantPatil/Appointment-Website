const fs = require('fs');

const file = 'a:/Hospital Website/src/components/AdminDashboard.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /const saveReschedule = \(\) => \{[\s\S]*?setRescheduleData\(\{ id: null, date: '', time: '' \}\);\s*\};/;
const newImplementation = `const saveReschedule = async () => {
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
};`;

content = content.replace(regex, newImplementation);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated saveReschedule function.');
