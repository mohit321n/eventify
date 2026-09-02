import { useState } from 'react';
import { initialEvents } from './eventsData';
import EventForm from './EventForm';

function App() {
  const [events, setEvents] = useState(initialEvents);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleAddEvent = (newEvent) => {
    setEvents([newEvent, ...events]);
  };

  const categories = ['All', 'Tech', 'Music', 'Business'];

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
                          event.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#4F46E5', fontSize: '2.5rem' }}>Eventify</h1>
        <p>Discover & Explore Local & Virtual Events</p>
      </header>

      {/* New Event Form */}
      <EventForm onAddEvent={handleAddEvent} />

      {/* Controls: Search and Filter */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <div style={{ display: 'flex', gap: '5px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '10px 15px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: selectedCategory === cat ? '#4F46E5' : '#E5E7EB',
                color: selectedCategory === cat ? '#fff' : '#000',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Event Cards Grid */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              style={{
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '15px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#1F2937' }}>{event.title}</h3>
                <span
                  style={{
                    backgroundColor: '#EEF2FF',
                    color: '#4F46E5',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                >
                  {event.category}
                </span>
              </div>
              <p style={{ margin: '4px 0', color: '#6B7280', fontSize: '14px' }}>
                📅 {event.date} | 📍 {event.location}
              </p>
              <p style={{ color: '#374151', marginTop: '10px' }}>{event.description}</p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#6B7280' }}>No events found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}

export default App;