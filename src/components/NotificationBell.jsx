import { useCallback, useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../services/notificationService';

const POLLING_INTERVAL = 20000;

const formatNotificationTime = (date) => {
  if (!date) return '';

  const diffInSeconds = Math.max(0, Math.floor((Date.now() - new Date(date).getTime()) / 1000));

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;

  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(date));
};

const NotificationBell = ({ user }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadUnreadCount = useCallback(async () => {
    if (!user) return;

    try {
      const count = await notificationService.getUnreadCount();

      setUnreadCount(count);
    } catch {
      setUnreadCount(0);
    }
  }, [user]);

  const loadNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await notificationService.getNotifications();

      setNotifications(data);
      setUnreadCount(data.filter((notification) => !notification.read_at).length);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const timeoutId = window.setTimeout(loadUnreadCount, 0);
    const intervalId = window.setInterval(loadUnreadCount, POLLING_INTERVAL);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [loadUnreadCount, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = async () => {
    const nextOpen = !isOpen;

    setIsOpen(nextOpen);

    if (nextOpen) {
      await loadNotifications();
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read_at) {
      await notificationService.markAsRead(notification.id);
    }

    setIsOpen(false);
    await loadUnreadCount();

    if (notification.event_id) {
      navigate(`/events/${notification.event_id}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read_at: notification.read_at || new Date().toISOString(),
      })),
    );
    setUnreadCount(0);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-100 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-[#8B2635]"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[#F5A623] px-1.5 py-0.5 text-center text-[11px] font-bold leading-none text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-gray-100 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-900">Notifications</h2>
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#8B2635] disabled:cursor-not-allowed disabled:text-gray-300"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">Loading notifications...</div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-gray-400">No notifications yet.</div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className="flex w-full gap-3 border-b border-gray-50 px-4 py-3 text-left transition-colors hover:bg-[#FFF5F0]"
                >
                  <span
                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                      notification.read_at ? 'bg-gray-200' : 'bg-[#F5A623]'
                    }`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-gray-900">{notification.title}</span>
                    <span className="mt-0.5 block text-sm leading-5 text-gray-500">{notification.message}</span>
                    <span className="mt-1 block text-xs text-gray-400">
                      {formatNotificationTime(notification.created_at)}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
