const fs = require('fs');

// Patch App.jsx
const appFile = 'a:/Hospital Website/src/App.jsx';
let appContent = fs.readFileSync(appFile, 'utf8');

// remove scrollbar and increase max width
appContent = appContent.replace(/overflowY: 'auto'/g, "overflow: 'hidden'");
appContent = appContent.replace(/maxWidth: '800px'/g, "maxWidth: '100%', padding: '0 5rem'");
appContent = appContent.replace(/backdropFilter: 'blur\(4px\)'/g, "backdropFilter: 'blur(8px)'");

fs.writeFileSync(appFile, appContent, 'utf8');

// Patch AppointmentForm.jsx
const formFile = 'a:/Hospital Website/src/components/AppointmentForm.jsx';
let formContent = fs.readFileSync(formFile, 'utf8');

// Remove header text completely!
const headerRegex = /<div style=\{\{ marginBottom: '2\.5rem', textAlign: 'center' \}\}>[\s\S]*?<\/div>\s*<form/g;

formContent = formContent.replace(
    headerRegex,
    `<div style={{ marginBottom: '2rem', textAlign: 'center' }}>
       <h1 style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0 }}>Fill this form</h1>
     </div>
     <form`
);

// Box appointment form larger in width
formContent = formContent.replace(/maxWidth: '1200px'/g, "maxWidth: '100%', width: '100%', padding: '2rem'");
formContent = formContent.replace(/maxWidth: '900px'/g, "maxWidth: '100%', width: '100%', padding: '2rem'");

// Sub-grid to be wider
formContent = formContent.replace(/gridTemplateColumns: '1fr'/g, "gridTemplateColumns: '1fr 1fr', gap: '3rem'");

// Any left-overs or hidden scrollbars
formContent = formContent.replace(/overflowY='auto'/g, "overflow='hidden'");
formContent = formContent.replace(/overflowY: 'auto'/g, "overflow: 'hidden'");

fs.writeFileSync(formFile, formContent, 'utf8');
console.log('UI cleanup complete.');
