import { useState } from 'react';

function EventForm({ onAddEvent }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tech',
    date: '',
    location: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.location) return;

    onAddEvent({ ...formData, id: Date.now() });
    setFormData({ title: '', category: 'Tech', date: '', location: '', description: '' });
  };

  return (
    <form onSubmit={handleSubmit} style={{ backgroundColor: '#F9FAFB', padding: '15px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #E5E7EB' }}>
      <h3 style={{ marginTop: 0, color: '#1F2937' }}>Create New Event</h3>
      
      <div style={{ display: 'grid', gap: '10px' }}>
        <input
          type="text"
          placeholder="Event Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
        />

        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
          >
            <option value="Tech">Tech</option>
            <option value="Music">Music</option>
            <option value="Business">Business</option>
          </select>

          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
          />
        </div>

        <input
          type="text"
          placeholder="Location (e.g., Online, Venue)"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
        />

        <textarea
          placeholder="Event Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="3"
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
        />

        <button
          type="submit"
          style={{ backgroundColor: '#4F46E5', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Add Event
        </button>
      </div>
    </form>
  );
}

export default EventForm;