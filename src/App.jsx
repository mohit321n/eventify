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
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

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

  const startEditing = (event) => {
    setEditingId(event.id);
    setEditFormData(event);
  };

  const saveEdit = (id) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) => (event.id === id ? editFormData : event))
    );
    setEditingId(null);
  };

  const categories = ['All', 'Tech', 'Music', 'Business'];

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
                          event.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate Dashboard Metrics
  const totalRsvps = events.reduce((sum, e) => sum + (e.rsvpCount || 0), 0);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#4F46E5', fontSize: '2.5rem', marginBottom: '5px' }}>Eventify</h1>
        <p style={{ margin: 0, color: '#6B7280' }}>Discover & Explore Local & Virtual Events</p>
      </header>

      {/* Analytics Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '25px' }}>
        <div style={{ backgroundColor: '#EEF2FF', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h2 style={{ margin: 0, color: '#4F46E5' }}>{events.length}</h2>
          <span style={{ fontSize: '13px', color: '#4B5563' }}>Total Events</span>
        </div>
        <div style={{ backgroundColor: '#ECFDF5', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h2 style={{ margin: 0, color: '#10B981' }}>{totalRsvps}</h2>
          <span style={{ fontSize: '13px', color: '#4B5563' }}>Total RSVPs</span>
        </div>
        <div style={{ backgroundColor: '#FEF3C7', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
          <h2 style={{ margin: 0, color: '#D97706' }}>{events.filter(e => e.isRsvped).length}</h2>
          <span style={{ fontSize: '13px', color: '#4B5563' }}>Attending</span>
        </div>
      </div>

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
              {editingId === event.id ? (
                /* Edit Mode Form */
                <div style={{ display: 'grid', gap: '10px' }}>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => saveEdit(event.id)}
                      style={{ backgroundColor: '#10B981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{ backgroundColor: '#6B7280', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <>
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

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => startEditing(event)}
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: '#F59E0B',
                          color: '#fff',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
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
                </>
              )}
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