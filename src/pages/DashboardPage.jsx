import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStore } from '../store/authStore';
import { eventService } from '../services/eventService';

const DashboardPage = () => {
    const user = authStore((s) => s.user);
    const navigate = useNavigate();

    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);

    // Load danh sách sự kiện đã đăng ký
    const loadRegistrations = async () => {
        try {
            const data = await eventService.getMyRegistrations();
            setRegistrations(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRegistrations();
    }, []);

    // Handle cancel registration
    const handleCancel = async (eventId) => {
        const confirmCancel = window.confirm(
            'Are you sure you want to cancel this registration?'
        );

        if (!confirmCancel) return;

        try {
            setCancellingId(eventId);

            await eventService.cancelRegistration(eventId);

            alert('Registration cancelled successfully.');

            // Reload registrations
            await loadRegistrations();
        } catch (error) {
            console.error(error);

            alert(
                error?.response?.data?.message ||
                    'Failed to cancel registration.'
            );
        } finally {
            setCancellingId(null);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                Loading registrations...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">

            <p className="text-gray-600 mb-8">
                Welcome back, {user?.name}
            </p>

            <h2 className="text-xl font-semibold mb-4">
                My Registered Events
            </h2>

            {registrations.length === 0 ? (
                <div className="bg-gray-100 rounded-xl p-6 text-gray-500">
                    You have not registered for any events yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {registrations.map((registration) => (
                        <div
                            key={registration.id}
                            className="border rounded-xl p-5 bg-white shadow-sm"
                        >
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold">
                                        {registration.event?.title}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1">
                                        {registration.event?.location}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {new Date(
                                            registration.event?.start_time
                                        ).toLocaleString()}
                                    </p>

                                    {registration.status === 'waitlist' && (
                                        <p className="mt-3 text-sm text-yellow-700 font-medium">
                                            Waitlist position: #
                                            {registration.position}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col items-end gap-3">
                                    {/* Status badge */}
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold
                                        ${
                                            registration.event?.status === 'ended'
                                                ? 'bg-gray-100 text-gray-600'
                                                : registration.status === 'confirmed'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}
                                    >
                                        {registration.event?.status === 'ended'
                                            ? 'Concluded'
                                            : registration.status}
                                    </span>

                                    {/* Action button - Review or Cancel */}
                                    {registration.event?.status === 'ended' ? (
                                        <button
                                            onClick={() => {
                                                const eventId = registration.event?.id || registration.event_id;
                                                if (!eventId) {
                                                    alert('Unable to navigate: missing event ID.');
                                                    return;
                                                }
                                                navigate(`/events/${eventId}`);
                                            }}
                                            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition"
                                        >
                                            Review Now
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                handleCancel(
                                                    registration.event?.id
                                                )
                                            }
                                            disabled={
                                                cancellingId ===
                                                registration.event?.id
                                            }
                                            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                        >
                                            {cancellingId ===
                                            registration.event?.id
                                                ? 'Cancelling...'
                                                : 'Cancel Registration'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;