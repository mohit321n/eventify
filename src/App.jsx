import { useState, useEffect } from 'react';
import { initialEvents } from './eventsData';
import EventForm from './EventForm';
import EventModal from './EventModal';
import AuthModal from './AuthModal';
import { Toaster, toast } from 'react-hot-toast';
import { Search, Calendar, MapPin, Users, Trash2, Sparkles, CheckCircle2, Sun, Moon, Heart, UserCheck, LogOut, LayoutDashboard, Bookmark, Ticket } from 'lucide-react';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('eventify_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [events, setEvents] = useState(initialEvents);
  const [savedEventIds, setSavedEventIds] = useState([]);
  const [rsvpedEventIds, setRsvpedEventIds] = useState([]);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'rsvped', 'saved'
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('eventify_theme') === 'dark');

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem('eventify_user', JSON.stringify(user));
      fetch(`http://localhost:5000/api/auth/user-data/${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setSavedEventIds(data.savedEvents || []);
          setRsvpedEventIds(data.rsvpedEvents || []);
        })
        .catch((err) => console.error(err));
    } else {
      localStorage.removeItem('eventify_user');
      localStorage.removeItem('eventify_token');
      setSavedEventIds([]);
      setRsvpedEventIds([]);
      setActiveTab('all');
    }
  }, [user]);

  const syncUserData = (newSaved, newRsvped) => {
    if (!user?.id) return;
    fetch('http://localhost:5000/api/auth/sync-user-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        savedEvents: newSaved,
        rsvpedEvents: newRsvped,
      }),
    }).catch((err) => console.error(err));
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('eventify_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('eventify_theme', 'light');
    }
  }, [darkMode]);

  const requireAuth = (actionCallback) => {
    if (!user) {
      setPendingAction(() => actionCallback);
      setIsAuthOpen(true);
      toast('Please sign in to continue', { icon: '🔒' });
    } else {
      actionCallback();
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleLogout = () => {
    setUser(null);
    toast.success('Logged out successfully');
  };

  const handleToggleRsvp = (id) => {
    requireAuth(() => {
      const isRsvped = rsvpedEventIds.includes(id);
      const updatedRsvps = isRsvped
        ? rsvpedEventIds.filter((eventId) => eventId !== id)
        : [...rsvpedEventIds, id];

      setRsvpedEventIds(updatedRsvps);
      syncUserData(savedEventIds, updatedRsvps);
      toast.success(isRsvped ? 'RSVP cancelled' : 'RSVP confirmed! See you there 🎉');
    });
  };

  const handleToggleBookmark = (id) => {
    requireAuth(() => {
      const isSaved = savedEventIds.includes(id);
      const updatedSaved = isSaved
        ? savedEventIds.filter((eventId) => eventId !== id)
        : [...savedEventIds, id];

      setSavedEventIds(updatedSaved);
      syncUserData(updatedSaved, rsvpedEventIds);
      toast.success(isSaved ? 'Removed from saved' : 'Event saved to your account!');
    });
  };

  const categories = ['All', 'Tech', 'Music', 'Business', 'Arts'];

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
                          event.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    
    let matchesTab = true;
    if (activeTab === 'saved') matchesTab = savedEventIds.includes(event.id);
    if (activeTab === 'rsvped') matchesTab = rsvpedEventIds.includes(event.id);

    return matchesSearch && matchesCategory && matchesTab;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans pb-16 transition-colors">
      {/* Toast Notifications */}
      <Toaster position="top-right" />

      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white p-2 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400">
              Eventify
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800 px-3 py-1.5 rounded-xl text-xs font-semibold">
                <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-slate-800 dark:text-white font-bold">{user.name}</span>
                <button onClick={handleLogout} className="p-1 hover:text-red-500 cursor-pointer ml-1" title="Log Out">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button onClick={() => setIsAuthOpen(true)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm">
                Sign In
              </button>
            )}

            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 cursor-pointer">
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Dynamic Header Section */}
      <div className="bg-gradient-to-b from-indigo-50/50 dark:from-indigo-950/20 to-transparent py-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {user ? (
            <>
              <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                Logged in Dashboard
              </span>
              <h1 className="text-3xl sm:text-4xl font-black mb-2 text-slate-900 dark:text-white">
                Welcome back, {user.name}!
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage your upcoming event RSVPs and saved events below.</p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-black mb-4">Discover Events That Spark Passion.</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-6">
                Explore premier conferences, live acoustic concerts, and high-impact networking meetups around you.
              </p>
            </>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div>
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{events.length}</div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Total Events</div>
            </div>
            <div className="border-x border-slate-100 dark:border-slate-700">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{rsvpedEventIds.length}</div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Your RSVPs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-500">{savedEventIds.length}</div>
              <div className="text-xs text-slate-400 uppercase font-semibold">Bookmarked</div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 mt-6">
        <EventForm onAddEvent={(newEvent) => requireAuth(() => {
          setEvents([newEvent, ...events]);
          toast.success('New event created successfully!');
        })} />

        {/* Dashboard Tabs for Authenticated Users */}
        {user && (
          <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6 gap-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>All Events</span>
            </button>

            <button
              onClick={() => setActiveTab('rsvped')}
              className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'rsvped'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>My RSVPs ({rsvpedEventIds.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'saved'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Events ({savedEventIds.length})</span>
            </button>
          </div>
        )}

        {/* Search & Categories */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search title or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none dark:text-white"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const isSaved = savedEventIds.includes(event.id);
              const isRsvped = rsvpedEventIds.includes(event.id);
              return (
                <div key={event.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{event.category}</span>
                      <button onClick={() => handleToggleBookmark(event.id)} className="cursor-pointer">
                        <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                      </button>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">{event.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{event.description}</p>
                  </div>
                  <button
                    onClick={() => handleToggleRsvp(event.id)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer flex items-center justify-center gap-2 transition-all ${
                      isRsvped ? 'bg-emerald-500 text-white' : 'bg-indigo-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-300'
                    }`}
                  >
                    {isRsvped ? <CheckCircle2 className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                    <span>{isRsvped ? 'Going' : 'RSVP'}</span>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 text-sm">
              No events found in this view.
            </div>
          )}
        </div>
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={handleLogin} />
    </div>
  );
}

export default App;