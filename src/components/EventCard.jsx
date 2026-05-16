import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, CalendarDays } from 'lucide-react';
import { formatCategoryLabel } from '../utils/categoryLabels';

const StarRating = ({ rating }) => {
    const value = rating ?? 0;
    const fullStars = Math.floor(value);
    const hasHalf = value - fullStars >= 0.5;

    return (
        <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => {
                const filled = i < fullStars || (i === fullStars && hasHalf);
                return (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${filled ? 'text-[#F5A623]' : 'text-gray-200'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            })}
            {rating != null && (
                <span className="text-sm text-gray-500 ml-1">({rating})</span>
            )}
        </div>
    );
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
};

const EventCard = ({ event }) => {
    const badge = event.is_full
        ? { label: 'Full', className: 'bg-red-500 text-white' }
        : { label: `${event.spots_left} spots`, className: 'bg-[#F5A623] text-white' };

    return (
        <Link
            to={`/events/${event.id}`}
            className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
        >
            <div className="relative h-44 bg-gradient-to-br from-[#FFF5F0] to-[#fdeee6] flex items-center justify-center overflow-hidden">
                {event.image_url ? (
                    <img
                        src={event.image_url}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <CalendarDays className="w-12 h-12 text-[#8B2635]/30" strokeWidth={1.5} />
                )}
                <span
                    className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${badge.className}`}
                >
                    {badge.label}
                </span>
            </div>

            <div className="p-4 text-left">
                <p className="text-xs text-gray-400 mb-1">
                    {formatCategoryLabel(event.category)}
                </p>
                <h3 className="font-bold text-gray-900 text-[15px] leading-snug mb-1 line-clamp-2">
                    {event.title}
                </h3>
                <p className="text-xs text-gray-400 mb-3">
                    {event.organizer_name || 'Organizer'}
                </p>

                <ul className="space-y-1.5 mb-3">
                    <li className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        {formatDate(event.start_time)}
                    </li>
                    <li className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        {event.location}
                    </li>
                    <li className="flex items-center gap-2 text-xs text-gray-500">
                        <Users className="w-3.5 h-3.5 shrink-0" />
                        {event.registered_count}/{event.capacity} registered
                    </li>
                </ul>

                <StarRating rating={event.average_rating} />
            </div>
        </Link>
    );
};

export default EventCard;
