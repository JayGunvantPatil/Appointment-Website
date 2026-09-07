const fs = require('fs');

// Fix App.jsx duplicated block
const appFile = 'a:/Hospital Website/src/App.jsx';
const appLines = fs.readFileSync(appFile, 'utf8').split('\n');

// 0-indexed: lines 134-177 in the viewer correspond to indices 133-176.
// But we must be careful with line counts changing.
// Let's just use string replacement on the exact duplicated block.
let appContent = appLines.join('\n');
const duplicateBlockRegex = /<div key=\{doc\.id\} className="card-premium" onClick=\{\(\) => setActiveBookingDoctor\(doc\)\}[\s\S]*?<div style=\{\{ padding: '2rem', textAlign: 'center', gridColumn: '1 \/ -1', color: 'var\(--text-medium\)' \}\}>No doctors are currently available\.<\/div>\s*\)\}/;

appContent = appContent.replace(duplicateBlockRegex, '');
fs.writeFileSync(appFile, appContent, 'utf8');
console.log('App.jsx repaired.');

// Fix AppointmentForm.jsx header text
const formFile = 'a:/Hospital Website/src/components/AppointmentForm.jsx';
let formContent = fs.readFileSync(formFile, 'utf8');

const unwantedTextRegex = /<div style=\{\{ marginBottom: '2\.5rem', textAlign: 'center' \}\}>[\s\S]*?Take the Next Step to Wellness\.<\/h2>[\s\S]*?<\/div>/;

formContent = formContent.replace(
    unwantedTextRegex,
    `<div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0 }}>Fill this form</h1>
    </div>`
);

fs.writeFileSync(formFile, formContent, 'utf8');
console.log('AppointmentForm.jsx repaired.');
