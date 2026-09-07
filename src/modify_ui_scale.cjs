const fs = require('fs');

// Patch App.jsx scrollbar
const appFile = 'a:/Hospital Website/src/App.jsx';
let appContent = fs.readFileSync(appFile, 'utf8');

appContent = appContent.replace(
    `            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#ffffff', zIndex: 999999, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>`,
    `            <div className="hide-scrollbar" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#ffffff', zIndex: 999999, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>`
);

fs.writeFileSync(appFile, appContent, 'utf8');
console.log('App.jsx scrollbar patched.');

// Patch AppointmentForm.jsx sizes
const formFile = 'a:/Hospital Website/src/components/AppointmentForm.jsx';
let formContent = fs.readFileSync(formFile, 'utf8');

formContent = formContent.replace(
    /padding: '1rem', borderRadius: '4px'/g,
    `padding: '1.25rem', fontSize: '1.2rem', borderRadius: '8px'`
);

formContent = formContent.replace(
    /fontSize: '0\.75rem'/g,
    `fontSize: '0.9rem'`
);

// Scale up the Book Appointment label to fit the modal naturally
formContent = formContent.replace(
    `fontSize: '2.5rem'`,
    `fontSize: '3.5rem'`
);

// Scale padding of User Profile container
formContent = formContent.replace(
    `padding: '1.25rem', borderRadius: '4px'`,
    `padding: '1.75rem', borderRadius: '8px'`
);

// Scale the submit button
formContent = formContent.replace(
    `padding: '1rem', fontSize: '1rem'`,
    `padding: '1.5rem', fontSize: '1.4rem'`
);

// Increase overall max-width formatting
formContent = formContent.replace(
    /maxWidth: '900px'/g,
    `maxWidth: '1200px'` // Massive layout
);

fs.writeFileSync(formFile, formContent, 'utf8');
console.log('AppointmentForm.jsx sizes scaled massively.');

// Patch global CSS to hide the raw scrollbar
const cssFile = 'a:/Hospital Website/src/index.css';
let cssContent = fs.readFileSync(cssFile, 'utf8');

if (!cssContent.includes('.hide-scrollbar')) {
    cssContent += `

/* Utility pseudo-classes layout tweaks */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
`;
    fs.writeFileSync(cssFile, cssContent, 'utf8');
    console.log('index.css appended scrollbar utility.');
}
