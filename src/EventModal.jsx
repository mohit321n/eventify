import { Calendar, MapPin, X, Users, CheckCircle2, DollarSign, Share2, CalendarPlus, Mail, UserCheck, Navigation } from 'lucide-react';

function EventModal({ event, onClose, onToggleRsvp }) {
  if (!event) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description || '');
    const location = encodeURIComponent(event.location || '');
    
    const eventDate = new Date(event.date);
    const formattedDate = !isNaN(eventDate.getTime()) 
      ? eventDate.toISOString().replace(/-|:|\.\d\d\d/g, '').substring(0, 8)
      : new Date().toISOString().replace(/-|:|\.\d\d\d/g, '').substring(0, 8);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${formattedDate}/${formattedDate}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const mapQuery = encodeURIComponent(event.location || 'San Francisco');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-700 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Header Image */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-100 dark:bg-slate-700">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="absolute bottom-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
            {event.category}
          </span>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-100">
          {/* Title & Price Header */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">{event.title}</h2>
            <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1.5 rounded-full text-xs flex items-center gap-1 border border-emerald-200 dark:border-emerald-800 shrink-0">
              <DollarSign className="w-3.5 h-3.5" /> {event.price || 'Free'}
            </span>
          </div>

          {/* Time & Venue Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-600 dark:text-slate-300 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>{event.date} {event.time && `• ${event.time}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>

          {/* Detailed Overview */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Event Overview</h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Featured Speaker Section */}
          {event.speaker && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Featured Speaker</h4>
              <div className="flex items-center gap-3 p-3 bg-indigo-50/50 dark:bg-slate-900/60 rounded-2xl border border-indigo-100 dark:border-slate-700">
                <img 
                  src={event.speaker.avatar} 
                  alt={event.speaker.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500" 
                />
                <div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">{event.speaker.name}</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{event.speaker.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Map Preview Placeholder */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Venue Location</h4>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Navigation className="w-3 h-3" /> Get Directions
              </a>
            </div>
            <div className="w-full h-40 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">
              <iframe
                title="Venue Map Location"
                width="100%"
                height="100%"
                loading="lazy"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              />
            </div>
          </div>

          {/* Organizer Contact Info */}
          {event.organizer && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex flex-wrap justify-between items-center text-xs text-slate-500 dark:text-slate-400 gap-2">
              <span className="flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-indigo-500" /> Organized by: <strong className="text-slate-700 dark:text-slate-300">{event.organizer.name}</strong>
              </span>
              <a href={`mailto:${event.organizer.email}`} className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <Mail className="w-3.5 h-3.5 text-indigo-500" /> {event.organizer.email}
              </a>
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3">
          <button
            onClick={handleAddToCalendar}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            title="Add to Google Calendar"
          >
            <CalendarPlus className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">Add to Calendar</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Share Event"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleRsvp(event.id)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              event.isRsvped
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-none'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none'
            }`}
          >
            {event.isRsvped ? <CheckCircle2 className="w-4 h-4" /> : <Users className="w-4 h-4" />}
            <span>{event.isRsvped ? 'You are Attending' : 'Confirm RSVP'}</span>
            <span className="opacity-80">({event.rsvpCount || 0})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventModal;