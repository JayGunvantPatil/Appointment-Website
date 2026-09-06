const generatedSlots = [];
let hour = 8;
let minute = 0;
while (hour <= 22) {
    if (hour === 22 && minute > 0) break;
    const isPM = hour >= 12;
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    const timeStr = `${displayHour.toString().padStart(2, '0')}:${minute === 0 ? '00' : '30'} ${isPM ? 'PM' : 'AM'}`;
    generatedSlots.push({ id: `ts-${timeStr}`, time: timeStr, status: 'available' });
    minute += 30;
    if (minute === 60) {
        minute = 0;
        hour += 1;
    }
}
export const timeSlots = generatedSlots;
