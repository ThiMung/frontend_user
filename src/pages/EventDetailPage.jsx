
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { authStore } from '../store/authStore';

// Hàm render icon sao vàng (Rating) chuẩn SVG trực quan
function renderStars(rating) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            ))}
        </div>
    );
}

// Định dạng ngày giờ hiển thị cặp start_time / end_time từ database seeder
function formatEventDateTime(start, end) {
    if (!start) return 'To be announced';
    const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit' };
    const startDate = new Date(start);
    const dateStr = startDate.toLocaleDateString('en-US', optionsDate);
    const startTimeStr = startDate.toLocaleTimeString('en-US', optionsTime);
    if (!end) return `${dateStr} at ${startTimeStr}`;
    const endTimeStr = new Date(end).toLocaleTimeString('en-US', optionsTime);
    return `${dateStr} (${startTimeStr} - ${endTimeStr})`;
}

const EventDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    // Lấy trạng thái đăng nhập từ Zustand Store
    const isAuthenticated = !!authStore.getState().token;
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const loadEvent = async () => {
            try {
                const data = await eventService.getEventById(id);
                if (isMounted) setEvent(data);
            } catch (err) {
                if (isMounted) setError('Failed to load event details. Please check your backend connection.');
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        loadEvent();
        return () => { isMounted = false; };
    }, [id]);

    // [BẢO VỆ ĐỒ ÁN - XỬ LÝ LOGIC ĐĂNG KÝ SỰ KIỆN]:
    const handleRegister = async () => {
        // Nếu chưa đăng nhập thì chuyển hướng sang trang login
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            setSubmitting(true);
            // Gọi API đăng ký sự kiện
            const response = await eventService.registerToEvent(id);
            // Kiểm tra hàng chờ (Waitlist) dựa vào cấu trúc database từ Seeder nếu hết chỗ slot
            if (response?.status === 'waitlist' || response?.position > 0) {
                alert(`The event is full! You have been placed on the waitlist at position #${response.position || ''}.`);
            } else {
                alert('Successfully registered for this event!');
            }
            // Đăng ký thành công: chuyển hướng về dashboard
            navigate('/dashboard');
        } catch (err) {
            alert(err?.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Defensive: Kiểm tra trạng thái loading
    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[400px] bg-background text-secondary gap-2 font-medium">
                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Loading event details...</span>
            </div>
        );
    }

    // Defensive: Kiểm tra lỗi hoặc không có dữ liệu event
    if (error || !event) {
        return (
            <div className="max-w-3xl mx-auto p-6 text-center bg-background">
                <p className="text-red-500 mb-4 font-bold">{error || 'Event data not found.'}</p>
                <Link to="/" className="text-primary hover:underline font-semibold">&larr; Back to Home</Link>
            </div>
        );
    }

    // Defensive: Xử lý mảng reviews và confirmed_count
    const reviewsList = Array.isArray(event.reviews) ? event.reviews : [];
    const totalReviews = reviewsList.length;
    const avgRating = totalReviews
        ? (reviewsList.reduce((sum, r) => sum + Number(r.rating), 0) / totalReviews).toFixed(1)
        : '0.0';
    const confirmedCount = event.confirmed_count || event.registrations_count || 0;
    const availableSlots = Math.max(0, (event.capacity || 0) - confirmedCount);

        // Khối giao diện đăng ký (dùng lại cho mobile và desktop, tối giản, không viền)
        const RegistrationCard = () => (
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-gray-800">Event Details</span>
                    <div className="flex items-center gap-2 text-[15px] text-gray-600">
                        <span className="inline-block"><i className="fa-regular fa-calendar text-primary"></i></span>
                        {formatEventDateTime(event.start_time || event.date, event.end_time)}
                    </div>
                    <div className="flex items-center gap-2 text-[15px] text-gray-600">
                        <span className="inline-block"><i className="fa-solid fa-location-dot text-primary"></i></span>
                        {event.location || 'Online Event'}
                    </div>
                    <div className="flex items-center gap-2 text-[15px] text-gray-600">
                        <span className="inline-block"><i className="fa-regular fa-user text-primary"></i></span>
                        {event.organizer?.name || event.organizer_name || 'Community Leader'}
                    </div>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                    <span className="text-[15px] font-semibold text-gray-800">Event Capacity</span>
                    <div className="flex items-center gap-2">
                        <span className="text-gray-700 text-[15px]">{confirmedCount}/{event.capacity || 0} Registered</span>
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${availableSlots > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                            {availableSlots > 0 ? 'Spots Available' : 'Full'}
                        </span>
                    </div>
                    <div className="text-xs text-gray-500">{availableSlots} spots remaining</div>
                </div>
                <button
                    onClick={handleRegister}
                    disabled={submitting || event.status === 'cancelled' || event.status === 'ended'}
                    className={`w-full mt-2 py-2 rounded-lg font-bold text-base transition text-white
                        ${event.status === 'cancelled' || event.status === 'ended'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#FFA500] hover:bg-[#ffb733] active:scale-[0.99]'}
                    `}
                >
                    {submitting ? 'Verifying...' :
                        event.status === 'cancelled' ? 'Event Cancelled' :
                        event.status === 'ended' ? 'Event Ended' :
                        availableSlots === 0 ? 'Join Waiting List' : 'Register Now'}
                </button>
                {!isAuthenticated && (
                    <p className="text-[11px] text-center text-secondary italic mt-1">
                        * Note: You will be redirected to the login page first.
                    </p>
                )}
            </div>
        );

        return (
            <div className="max-w-6xl mx-auto px-4 py-8 bg-white text-primary">
                <Link to="/" className="text-primary hover:underline text-[15px] mb-6 inline-flex items-center gap-2 font-semibold">
                    <span className="text-xl">&#8592;</span> Back to Events
                </Link>
                <div className="flex flex-col md:flex-row md:gap-8">
                    {/* Main content left */}
                    <div className="flex-1 min-w-0">
                        {/* Banner */}
                        <div className="w-full h-48 md:h-56 rounded-xl bg-gradient-to-br from-[#f8f6f3] to-[#f3e9e0] flex items-center justify-center mb-6">
                            {event.image_url && (
                <img src={event.image_url} alt={event.title} className="w-full h-64 object-cover rounded-xl mb-6" />
                            )}
                        </div>
                        {/* Category badge */}
                        <div className="flex items-center gap-2 mb-2">
                            {event.category && (
                                <span className="bg-[#7c2946] text-white text-xs px-3 py-1 rounded-full font-semibold">
                                    {event.category}
                                </span>
                            )}
                        </div>
                        {/* Title, organizer, rating */}
                        <h1 className="text-2xl md:text-3xl font-bold mb-1 text-black">{event.title}</h1>
                        <div className="text-gray-700 text-[15px] mb-1">{event.organizer?.name || event.organizer_name}</div>
                        <div className="flex items-center gap-1 mb-4">
                            {renderStars(Number(avgRating))}
                            <span className="ml-1 text-gray-700 text-[15px]">({avgRating})</span>
                        </div>
                        {/* Event details card */}
                        <div className="bg-[#f8f6f3] rounded-xl p-4 mb-6">
                            <div className="flex items-center gap-2 text-[15px] mb-1">
                                <i className="fa-regular fa-calendar text-primary"></i>
                                {formatEventDateTime(event.start_time || event.date, event.end_time)}
                            </div>
                            <div className="flex items-center gap-2 text-[15px] mb-1">
                                <i className="fa-solid fa-location-dot text-primary"></i>
                                {event.location}
                            </div>
                            <div className="flex items-center gap-2 text-[15px] mb-1">
                                <i className="fa-solid fa-users text-primary"></i>
                                <span>{confirmedCount}/{event.capacity || 0} Registered</span>
                                <span className="ml-2 text-xs text-gray-500">{availableSlots} spots remaining</span>
                            </div>
                        </div>
                        {/* Only show registration card on mobile */}
                        <div className="block md:hidden mb-6">
                            <RegistrationCard />
                        </div>
                        {/* Reviews section (optional, có thể bổ sung sau) */}
                    </div>
                    {/* Sidebar right (sticky) */}
                    <div className="w-full md:w-[320px] flex-shrink-0 md:pl-4 md:pt-8">
                        <div className="md:sticky md:top-20 flex flex-col gap-4">
                            {/* Spots available badge */}
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${availableSlots > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                    {availableSlots > 0 ? 'Spots Available' : 'Full'}
                                </span>
                            </div>
                            {/* Register button */}
                            <button
                                onClick={handleRegister}
                                disabled={submitting || event.status === 'cancelled' || event.status === 'ended'}
                                className={`w-full py-3 rounded-lg font-bold text-base transition text-white mb-2
                                    ${event.status === 'cancelled' || event.status === 'ended'
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#FFA500] hover:bg-[#ffb733] active:scale-[0.99]'}
                                `}
                            >
                                {submitting ? 'Verifying...' :
                                    event.status === 'cancelled' ? 'Event Cancelled' :
                                    event.status === 'ended' ? 'Event Ended' :
                                    availableSlots === 0 ? 'Join Waiting List' : 'Register Now'}
                            </button>
                            {/* Event capacity info */}
                            <div>
                                <div className="font-semibold text-gray-800 mb-1">Event Capacity</div>
                                <div className="text-gray-700 text-[15px]">{confirmedCount}/{event.capacity || 0} spots filled</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
};

export default EventDetailPage;