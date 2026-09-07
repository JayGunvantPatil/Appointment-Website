const fs = require('fs');

const file = 'a:/Hospital Website/src/components/AppointmentForm.jsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<div style=\{\{ marginBottom: '2\.5rem', textAlign: 'center' \}\}>[\s\S]*?<div className="card-premium/g;
const replaceWith = `<div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
<h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-medium)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Please fill out this form</h3>
</div>
<div className="card-premium`;

content = content.replace(regex, replaceWith);

fs.writeFileSync(file, content, 'utf8');
console.log('Replaced giant text with simple text successfully.');
