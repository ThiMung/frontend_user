import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { eventService } from '../services/eventService';

const EventDetailPage = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const loadEvent = async () => {
            try {
                const data = await eventService.getEventById(id);

                if (isMounted) {
                    setEvent(data);
                }
            } catch {
                if (isMounted) {
                    setError('Không tải được thông tin sự kiện');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadEvent();

        return () => {
            isMounted = false;
        };
    }, [id]);

    if (loading) {
        return <div className="text-center py-10 text-gray-500">Đang tải...</div>;
    }

    if (error || !event) {
        return (
            <div className="max-w-3xl mx-auto p-6 text-center">
                <p className="text-red-600 mb-4">{error || 'Sự kiện không tồn tại'}</p>
                <Link to="/" className="text-blue-600">← Về trang chủ</Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Link to="/" className="text-blue-600 text-sm mb-4 inline-block">← Trang chủ</Link>
            {event.image_url && (
                <img src={event.image_url} alt={event.title} className="w-full h-64 object-cover rounded-xl mb-6" />
            )}
            <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
            <p className="text-gray-500 mb-4">{event.location}</p>
            <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
        </div>
    );
};

export default EventDetailPage;
