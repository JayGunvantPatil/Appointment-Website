import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
// Increased limit for base64 photo payloads
app.use(express.json({ limit: '10mb' }));

let sql;
try {
    sql = neon(process.env.DATABASE_URL);
} catch (error) {
    console.error("FATAL ERROR: Missing or invalid DATABASE_URL. Please set your Neon DATABASE_URL in a .env file.");
}

const PORT = 3001;

// ====== DOCTORS ====== //

app.get('/api/doctors', async (req, res) => {
    try {
        const result = await sql`SELECT * FROM doctors ORDER BY created_at ASC;`;
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/doctors', async (req, res) => {
    const { name, slots, lunchTime, leavePeriods, photoUrl } = req.body;
    try {
        const result = await sql`
            INSERT INTO doctors (name, slots, lunch_time, leave_periods, photo_url)
            VALUES (${name}, ${slots}, ${lunchTime}, ${leavePeriods}, ${photoUrl})
            RETURNING *;
        `;
        res.json(result[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

app.put('/api/doctors/:id', async (req, res) => {
    const { id } = req.params;
    const { name, slots, lunchTime, leavePeriods } = req.body;
    try {
        const result = await sql`
            UPDATE doctors
            SET name = ${name}, slots = ${slots}, lunch_time = ${lunchTime}, leave_periods = ${leavePeriods}
            WHERE id = ${id}
            RETURNING *;
        `;
        res.json(result[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete('/api/doctors/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await sql`DELETE FROM doctors WHERE id = ${id};`;
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ====== APPOINTMENTS ====== //

app.get('/api/appointments', async (req, res) => {
    try {
        const result = await sql`SELECT * FROM appointments ORDER BY created_at DESC;`;
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/appointments', async (req, res) => {
    const { patientName, age, phone, email, address, appointmentDate, timeSlot, doctor, symptoms } = req.body;
    try {
        const result = await sql`
            INSERT INTO appointments (patient_name, patient_age, phone, email, address, appointment_date, appointment_time, doctor, symptoms)
            VALUES (${patientName}, ${age}, ${phone}, ${email}, ${address}, ${appointmentDate}, ${timeSlot}, ${doctor}, ${symptoms})
            RETURNING *;
        `;
        res.json(result[0]);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

app.put('/api/appointments/:id', async (req, res) => {
    const { id } = req.params;
    const { attended, status, date, time } = req.body;

    try {
        let result;
        if (date && time) {
            // Processing Reschedule Logic Map
            result = await sql`
                UPDATE appointments
                SET appointment_date = ${date}, appointment_time = ${time}, status = 'Scheduled', attended = false
                WHERE id = ${id}
                RETURNING *;
            `;
        } else {
            // Processing Standard Attendance Map
            result = await sql`
                UPDATE appointments
                SET attended = ${attended}, status = ${status}
                WHERE id = ${id}
                RETURNING *;
            `;
        }
        res.json(result[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => {
    console.log(\`✅ Secure Neon Proxy API is running at http://localhost:\${PORT}\`);
});
