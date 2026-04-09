import React, { useEffect, useMemo, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { FaBell, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { api } from '../utils/api';
import { useCredits } from '../context/CreditContext';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  channel: 'in-app' | 'email';
  createdAt: string;
  type?: string;
  status?: string;
}

const NotificationsPage: React.FC = () => {
  const { user } = useUser();
  const { credits } = useCredits();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const unreadCount = useMemo(() => items.filter(i => !i.read).length, [items]);

  const loadNotifications = async () => {
    if (!user) return;
    try {
      const data = await api.get<NotificationItem[]>(`/api/notifications/${user.id}`);
      setItems(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    api.post('/api/notifications/low-credit', { userId: user.id, credits }).catch(() => undefined);
  }, [user?.id, credits]);

  const markRead = async (id: string) => {
    if (!user) return;
    try {
      await api.patch(`/api/notifications/${user.id}/${id}/read`);
      setItems(prev => prev.map(item => (item.id === id ? { ...item, read: true } : item)));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const sendRoutineReminder = async () => {
    if (!user) return;
    try {
      await Promise.all([
        api.post('/api/notifications', {
          userId: user.id,
          title: 'Routine Reminder',
          message: 'Time for your hair care routine. Stay consistent for better results.',
          type: 'routine-reminder',
          channel: 'in-app'
        }),
        api.post('/api/notifications', {
          userId: user.id,
          title: 'Routine Reminder Email',
          message: 'This is your scheduled routine reminder. Open Hair Analysis to follow today\'s plan.',
          type: 'routine-reminder',
          channel: 'email'
        })
      ]);
      await loadNotifications();
    } catch (error) {
      console.error('Failed to send reminders:', error);
    }
  };

  return (
    <div className="dash-page">
      <div className="flex items-center justify-between dash-section-gap">
        <h2 className="dash-title flex items-center gap-3">
          <FaBell className="text-indigo-600" />
          Notifications
        </h2>
        <div className="flex items-center gap-3">
          <span className="dash-chip">
            Unread: {unreadCount}
          </span>
          <button
            onClick={sendRoutineReminder}
            className="dash-btn-primary"
          >
            Trigger Reminder
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading notifications...</div>
      ) : items.length === 0 ? (
        <div className="dash-card text-gray-500 text-center">No notifications yet.</div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className={`rounded-2xl p-5 border ${item.read ? 'bg-white/90 border-slate-200/70 shadow-sm' : 'bg-cyan-50 border-cyan-200 shadow-sm'}`}>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-bold text-gray-900">{item.title}</p>
                  <p className="text-gray-700 mt-1">{item.message}</p>
                  <div className="text-xs text-gray-500 mt-2 flex items-center gap-3">
                    <span className="capitalize inline-flex items-center gap-1">
                      {item.channel === 'email' ? <FaEnvelope /> : <FaBell />}
                      {item.channel}
                    </span>
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                    {item.status && <span>Status: {item.status}</span>}
                  </div>
                </div>

                {!item.read && (
                  <button
                    onClick={() => markRead(item.id)}
                    className="dash-btn-secondary text-sm"
                  >
                    <FaCheckCircle /> Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
