import { useState, useEffect } from 'react';
import { initialEvents } from './eventsData';
import EventForm from './EventForm';

function App() {
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('eventify_events');
    return savedEvents ? JSON.parse(savedEvents) : initialEvents;
  });

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    localStorage.setItem('eventify_events', JSON.stringify(events));
  }, [events]);

  const handleAddEvent = (newEvent) => {
    setEvents((prevEvents) => [{ ...newEvent, rsvpCount: 0, isRsvped: false }, ...prevEvents]);
  };

  const handleToggleRsvp = (id) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => {
        if (event.id === id) {
          const isRsvped = !event.isRsvped;
          const currentCount = event.rsvpCount || 0;
          return {
            ...event,
            isRsvped,
            rsvpCount: isRsvped ? currentCount + 1 : currentCount - 1
          };
        }
        return event;
      })
    );
  };

  const handleDeleteEvent = (id) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
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
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                backgroundColor: '#fff'
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

              {/* RSVP and Delete Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                <button
                  onClick={() => handleToggleRsvp(event.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: event.isRsvped ? '#10B981' : '#E5E7EB',
                    color: event.isRsvped ? '#fff' : '#374151',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {event.isRsvped ? '✓ Going' : 'RSVP'} ({event.rsvpCount || 0})
                </button>

                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: '#EF4444',
                    color: '#fff',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
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