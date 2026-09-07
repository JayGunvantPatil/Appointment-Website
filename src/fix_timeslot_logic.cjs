const fs = require('fs');

const formFile = 'a:/Hospital Website/src/components/AppointmentForm.jsx';
let formContent = fs.readFileSync(formFile, 'utf8');

// 1. Fix the AppointmentForm signature if not already fixed
if (!formContent.includes('prefilledDoctor = null')) {
    formContent = formContent.replace(
        'export const AppointmentForm = ({ onAddAppointment, managedDoctors = [], appointments = [] }) => {',
        'export const AppointmentForm = ({ onAddAppointment, managedDoctors = [], appointments = [], prefilledDoctor = null, onClose = null }) => {'
    );
}

// 2. Fix formData doctor initialization (Targeting ANY newline variants)
const initRegex = /timeSlot:\s*'([^']*)',\s*doctor:\s*'([^']*)',\s*symptoms:\s*'([^']*)'/g;
formContent = formContent.replace(initRegex, `timeSlot: '',
        doctor: prefilledDoctor ? prefilledDoctor.name : '',
        symptoms: ''`);

// 3. Transform the Dropdown Options
// Currently it is: {timeSlots.map(slot => ( <option ...>{slot.time}</option> ))}
const mapRegex = /\{timeSlots\.map\(\s*slot\s*=>\s*\([\s\S]*?<option[^>]*>\{slot\.time\}<\/option>\s*\)\)\}/g;
const replacementMap = `{timeSlots.map(slot => {
                                                const doctorIdStr = formData.doctor || (prefilledDoctor ? prefilledDoctor.name : '');
                                                const available = isSlotAvailable(doctorIdStr, slot.time);
                                                return (
                                                    <option key={slot.id} value={slot.time} disabled={!available}>
                                                        {slot.time} {available ? '' : '(Unavailable)'}
                                                    </option>
                                                );
                                            })}`;
formContent = formContent.replace(mapRegex, replacementMap);

// 4. Ensure close modal handles the generic hook
const closeRegex = /setShowModal\(false\);\s*setFormData\(\{/g;
if (!formContent.includes('if (onClose) onClose();')) {
    formContent = formContent.replace(
        /doctor:\s*'',\s*symptoms:\s*''\s*\}\);/g,
        `doctor: '',\n            symptoms: ''\n        });\n        if (onClose) onClose();`
    );
}

fs.writeFileSync(formFile, formContent, 'utf8');
console.log('Successfully applied Timeslot Logic.');
