import React, { useCallback, useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { eventService } from '../services/eventService';
import EventCard from '../components/EventCard';
import CategorySidebar from '../components/CategorySidebar';

const HomePage = () => {
    const [events, setEvents] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const fetchEvents = useCallback(() => {
        setLoading(true);
        const params = {};
        if (selectedCategory !== 'all') params.category = selectedCategory;
        if (search.trim()) params.search = search.trim();

        eventService
            .getAllEvents(params)
            .then((data) => {
                const payload = data?.events ? data : { events: Array.isArray(data) ? data : [], categories: [] };
                setEvents(payload.events || []);
                setCategories(payload.categories || []);
            })
            .catch((error) => {
                console.error('Failed to load events:', error);
                setEvents([]);
                setCategories([]);
            })
            .finally(() => setLoading(false));
    }, [selectedCategory, search]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearch(searchInput);
    };

    return (
        <>
            <section className="bg-[#8B2635] px-6 py-14">
                <div className="max-w-[1280px] mx-auto text-center">
                    <h1 className="!text-4xl md:!text-5xl !font-bold !text-white !mb-3 !mt-0 tracking-tight">
                        Discover Local Events
                    </h1>
                    <p className="text-white/85 text-lg mb-8 max-w-xl mx-auto">
                        Connect with your community through meaningful events
                    </p>
                    <form
                        onSubmit={handleSearchSubmit}
                        className="max-w-2xl mx-auto relative"
                    >
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search events by name, organizer, or location..."
                            className="w-full pl-14 pr-6 py-4 rounded-full bg-white text-gray-700 text-sm shadow-lg border-0 outline-none focus:ring-2 focus:ring-[#F5A623]/50"
                        />
                    </form>
                </div>
            </section>

            <section className="max-w-[1280px] mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
                    <CategorySidebar
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                    />

                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-400 mb-5 text-left">
                            {loading
                                ? 'Loading events...'
                                : `Found ${events.length} event${events.length !== 1 ? 's' : ''}`}
                        </p>

                        {loading ? (
                            <div className="text-center py-16 text-gray-400">
                                Loading events...
                            </div>
                        ) : events.length === 0 ? (
                            <div className="text-center py-16 text-gray-400 bg-[#FFF5F0] rounded-xl">
                                No events match your search. Try another category or keyword.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {events.map((ev) => (
                                    <EventCard key={ev.id} event={ev} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
