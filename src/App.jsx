import { useState, useEffect } from 'react';
import { initialEvents } from './eventsData';
import EventForm from './EventForm';
import EventModal from './EventModal';
import { Search, Calendar, MapPin, Users, Trash2, Sparkles, CheckCircle2, Sun, Moon, Heart, Clock } from 'lucide-react';

function App() {
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('eventify_events');
    return savedEvents ? JSON.parse(savedEvents) : initialEvents;
  });

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [savedEventIds, setSavedEventIds] = useState(() => {
    const stored = localStorage.getItem('eventify_saved');
    return stored ? JSON.parse(stored) : [];
  });
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('eventify_theme') === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('eventify_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('eventify_saved', JSON.stringify(savedEventIds));
  }, [savedEventIds]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('eventify_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('eventify_theme', 'light');
    }
  }, [darkMode]);

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

    if (selectedEvent && selectedEvent.id === id) {
      setSelectedEvent((prev) => ({
        ...prev,
        isRsvped: !prev.isRsvped,
        rsvpCount: prev.isRsvped ? (prev.rsvpCount || 1) - 1 : (prev.rsvpCount || 0) + 1
      }));
    }
  };

  const handleToggleBookmark = (id) => {
    setSavedEventIds((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const handleDeleteEvent = (id) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    setSavedEventIds((prev) => prev.filter((favId) => favId !== id));
    if (selectedEvent?.id === id) setSelectedEvent(null);
  };

  const categories = ['All', 'Tech', 'Music', 'Business', 'Arts'];
  const dateFilters = ['All', 'Today', 'This Week', 'Upcoming'];

  const matchesDateRange = (eventDateStr) => {
    if (selectedDateFilter === 'All') return true;

    const eventDate = new Date(eventDateStr);
    const today = new Date();
    
    // Normalize time portions for accurate date comparison
    today.setHours(0, 0, 0, 0);

    if (isNaN(eventDate.getTime())) return true; // Fallback if date string isn't standard

    const diffDays = (eventDate - today) / (1000 * 60 * 60 * 24);

    if (selectedDateFilter === 'Today') {
      return diffDays >= 0 && diffDays < 1;
    }
    if (selectedDateFilter === 'This Week') {
      return diffDays >= 0 && diffDays <= 7;
    }
    if (selectedDateFilter === 'Upcoming') {
      return diffDays >= 0;
    }
    return true;
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
                          event.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesSaved = !showSavedOnly || savedEventIds.includes(event.id);
    const matchesTime = matchesDateRange(event.date);

    return matchesSearch && matchesCategory && matchesSaved && matchesTime;
  });

  const totalRsvps = events.reduce((sum, e) => sum + (e.rsvpCount || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans pb-16 transition-colors duration-300">
      <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Eventify
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                showSavedOnly
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-200 dark:shadow-none'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${showSavedOnly ? 'fill-white' : ''}`} />
              <span>Saved ({savedEventIds.length})</span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>
      </nav>

      <div className="bg-gradient-to-b from-indigo-50/50 dark:from-indigo-950/20 to-transparent py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Discover Events That Spark Passion.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Explore premier conferences, live acoustic concerts, and high-impact networking meetups around you.
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{events.length}</div>
              <div className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Events</div>
            </div>
            <div className="border-x border-slate-100 dark:border-slate-700">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalRsvps}</div>
              <div className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total RSVPs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-500">{savedEventIds.length}</div>
              <div className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Bookmarked</div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 mt-6">
        <EventForm onAddEvent={handleAddEvent} />

        {/* Search & Filter Section */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search title or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm dark:text-white"
              />
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-t border-slate-100 dark:border-slate-800 pt-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-2">
              <Clock className="w-3.5 h-3.5" /> Date:
            </span>
            {dateFilters.map((df) => (
              <button
                key={df}
                onClick={() => setSelectedDateFilter(df)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedDateFilter === df
                    ? 'bg-slate-800 text-white dark:bg-indigo-500 dark:text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {df}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const isBookmarked = savedEventIds.includes(event.id);
              return (
                <div
                  key={event.id}
                  onClick={() => setSelectedEvent(event)}
                  className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-indigo-600 dark:text-indigo-400 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {event.category}
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleBookmark(event.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md transition-all cursor-pointer"
                      title={isBookmarked ? "Remove Bookmark" : "Save Event"}
                    >
                      <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{event.title}</h3>

                    <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        <span>{event.date} {event.time && `• ${event.time}`}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed mb-4 flex-1">
                      {event.description}
                    </p>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleRsvp(event.id);
                        }}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          event.isRsvped
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 dark:shadow-none'
                            : 'bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-slate-600'
                        }`}
                      >
                        {event.isRsvped ? <CheckCircle2 className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                        <span>{event.isRsvped ? 'Going' : 'RSVP'}</span>
                        <span className="opacity-80">({event.rsvpCount || 0})</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(event.id);
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center">
              <p className="text-slate-400 text-sm">
                {showSavedOnly ? 'You have no saved events yet.' : 'No events match your search criteria.'}
              </p>
            </div>
          )}
        </div>
      </main>

      <EventModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onToggleRsvp={handleToggleRsvp}
      />
    </div>
  );
}

export default App;