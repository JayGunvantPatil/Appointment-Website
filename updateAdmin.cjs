const fs = require('fs');

let content = fs.readFileSync('src/components/AdminDashboard.jsx', 'utf8');

const targetMainHeader = `<div className="admin-dashboard-container" style={{ display: 'flex', minHeight: '100vh', backgroundcolor: '#334155' }}>`;
const replacementMainHeader = `<div className="admin-dashboard-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
            <header style={{ backgroundColor: 'var(--white)', borderBottom: '1px solid var(--border-card)', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 100, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <MedicalIcon name="Stethoscope" size={24} style={{ color: 'var(--teal-main)' }} />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0' }}>
                        <span style={{ color: 'var(--navy-med)' }}>Med</span>
                        <span style={{ color: 'var(--teal-main)' }}>Nivo</span>
                    </h1>
                </div>
                <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--border-card)', padding: '0.5rem 1rem', borderRadius: '8px', color: 'var(--navy-med)', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--status-leave)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--navy-med)'}>
                    <MedicalIcon name="LogOut" size={16} />
                    <span>Sign Out</span>
                </button>
            </header>
            <div className="admin-dashboard-container" style={{ display: 'flex', flex: 1 }}>`;

content = content.replace(targetMainHeader, replacementMainHeader);

const targetAsideHeader = `<aside style={{ width: '280px', backgroundColor: '#f8fafc', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#334155' }}>`;
const replacementAsideHeader = `<aside style={{ width: '280px', backgroundColor: 'var(--white)', borderRight: '1px solid var(--border-card)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-body)' }}>`;

content = content.replace(targetAsideHeader, replacementAsideHeader);

const targetLogoutButton = `<div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                    <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#334155', fontSize: '0.75rem', fontWeight: '500', cursor: 'pointer', opacity: '0.7' }}>
                        <MedicalIcon name="LogOut" size={14} />
                        <span>Sign Out</span>
                    </button>
                </div>`;

content = content.replace(targetLogoutButton, ``);

const targetMainTag = `<main style={{ flex: 1, padding: '3rem', overflowY: 'auto', backgroundcolor: '#334155' }}>`;
const replacementMainTag = `<main style={{ flex: 1, padding: '3rem', overflowY: 'auto', backgroundColor: '#f1f5f9' }}>`;

content = content.replace(targetMainTag, replacementMainTag);

const targetFooter = `            </main>
        </div>
    );
};`;
const replacementFooter = `            </main>
            </div>
        </div>
    );
};`;

content = content.replace(targetFooter, replacementFooter);

fs.writeFileSync('src/components/AdminDashboard.jsx', content);
