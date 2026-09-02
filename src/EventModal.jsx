import { Calendar, MapPin, X, Users, CheckCircle2, DollarSign, Share2 } from 'lucide-react';

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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-700 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner Image Header */}
        <div className="relative h-64 w-full bg-slate-100 dark:bg-slate-700">
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

        {/* Modal Content Details */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{event.title}</h2>
            <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
              <DollarSign className="w-3.5 h-3.5" /> {event.price || 'Free'}
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 py-2 border-y border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>{event.date} {event.time && `at ${event.time}`}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span>{event.location}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">About This Event</h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3">
          <button
            onClick={handleShare}
            className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Share Event"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleRsvp(event.id)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
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