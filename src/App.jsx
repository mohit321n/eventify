import { useState, useEffect } from 'react';
import { initialEvents } from './eventsData';
import EventForm from './EventForm';
import { Search, Calendar, MapPin, Users, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';

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

  const categories = ['All', 'Tech', 'Music', 'Business', 'Arts'];

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
                          event.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalRsvps = events.reduce((sum, e) => sum + (e.rsvpCount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Eventify
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="bg-slate-100 px-3 py-1.5 rounded-full">📍 Global Network</span>
          </div>
        </div>
      </nav>

      <div className="bg-gradient-to-b from-indigo-50/50 to-transparent py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Discover Events That Spark Passion.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Explore premier conferences, live acoustic concerts, and high-impact networking meetups around you.
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div>
              <div className="text-2xl font-bold text-indigo-600">{events.length}</div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Events</div>
            </div>
            <div className="border-x border-slate-100">
              <div className="text-2xl font-bold text-emerald-600">{totalRsvps}</div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total RSVPs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-500">{events.filter(e => e.isRsvped).length}</div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Attending</div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 mt-6">
        <EventForm onAddEvent={handleAddEvent} />

        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search title or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-indigo-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {event.category}
                  </span>
                  <span className="absolute top-3 right-3 bg-slate-900/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-md">
                    {event.price || 'Free'}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">{event.title}</h3>

                  <div className="space-y-1.5 text-xs text-slate-500 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      <span>{event.date} {event.time && `• ${event.time}`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-500" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed mb-4 flex-1">
                    {event.description}
                  </p>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleRsvp(event.id)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        event.isRsvped
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                      }`}
                    >
                      {event.isRsvped ? <CheckCircle2 className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                      <span>{event.isRsvped ? 'Going' : 'RSVP'}</span>
                      <span className="opacity-80">({event.rsvpCount || 0})</span>
                    </button>

                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <p className="text-slate-400 text-sm">No events match your search criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;