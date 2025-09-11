import { Card } from '../styles.jsx';

const AUDIENCE = [
  { 
    icon: <svg className="w-8 h-8 text-[var(--mist)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>, 
    title: 'Neophytes', 
    description: 'Initiation rites for unproven vessels' 
  },
  { 
    icon: <svg className="w-8 h-8 text-[var(--mist)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>, 
    title: 'Warriors', 
    description: 'Forge your legend in the crucible of excellence' 
  },
  { 
    icon: <svg className="w-8 h-8 text-[var(--mist)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>, 
    title: 'Timebound', 
    description: 'Transcend temporal limitations through focused rituals' 
  },
  { 
    icon: <svg className="w-8 h-8 text-[var(--mist)]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>, 
    title: 'Mentors', 
    description: 'Channel your wisdom through our sacred conduit' 
  }
];

export const Audience1 = () => (
  <section id="audience" className="py-16">
    <h2 className="text-3xl font-bold text-center mb-12 text-[var(--mist)]">
      Chosen Vessels
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {AUDIENCE.map((item, index) => (
        <Card key={index} className="text-center">
          <div className="text-4xl mb-4">{item.icon}</div>
          <h3 className="text-xl font-bold mb-2">{item.title}</h3>
          <p className="text-sm text-[var(--silver)]">{item.description}</p>
        </Card>
      ))}
    </div>
  </section>
);

export const Audience2 = ({ audienceGroups }) => {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Perfect for Everyone</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {audienceGroups.map((group, index) => (
              <div key={index} className="text-center p-4">
                <div className="text-4xl mb-4" style={{ color: '#1d776b' }}>
                  {group.icon || <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">{group.title}</h3>
                <p className="text-gray-600 text-sm">{group.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  