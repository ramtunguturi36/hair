import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { FaUserShield, FaMoneyBillWave, FaFlag, FaUsers } from 'react-icons/fa';
import { api } from '../utils/api';

interface AdminData {
  totals: {
    users: number;
    analyses: number;
    payments: number;
    flaggedResponses: number;
    unreadNotifications: number;
  };
  recentPayments: Array<{ id: string; userId: string; amount: number; credits: number; currency: string; createdAt: string }>;
  openFlags: Array<{ id: string; userId: string; source: string; reason: string; contentSnippet: string; createdAt: string }>;
}

const AdminPage: React.FC = () => {
  const { user } = useUser();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const result = await api.get<AdminData>(`/api/admin/dashboard/${user.id}`);
        setData(result);
      } catch (err) {
        setError('You do not have admin access. Set ADMIN_USER_IDS in backend .env or use an admin user id.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.id]);

  if (loading) return <div className="p-8 text-gray-500">Loading admin dashboard...</div>;
  if (error) return <div className="p-8 text-red-600 font-semibold">{error}</div>;
  if (!data) return null;

  return (
    <div className="dash-page">
      <h2 className="dash-title dash-section-gap flex items-center gap-3">
        <FaUserShield className="text-indigo-600" /> Admin Panel
      </h2>

      <div className="grid md:grid-cols-5 gap-4 dash-section-gap">
        <div className="dash-card"><p className="dash-subtitle">Users</p><p className="dash-stat"><FaUsers className="inline mr-2" />{data.totals.users}</p></div>
        <div className="dash-card"><p className="dash-subtitle">Analyses</p><p className="dash-stat">{data.totals.analyses}</p></div>
        <div className="dash-card"><p className="dash-subtitle">Payments</p><p className="dash-stat"><FaMoneyBillWave className="inline mr-2" />{data.totals.payments}</p></div>
        <div className="dash-card"><p className="dash-subtitle">Flagged AI</p><p className="dash-stat"><FaFlag className="inline mr-2" />{data.totals.flaggedResponses}</p></div>
        <div className="dash-card"><p className="dash-subtitle">Unread Notifications</p><p className="dash-stat">{data.totals.unreadNotifications}</p></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="dash-card-strong">
          <h3 className="dash-card-title mb-4">Recent Payments</h3>
          {data.recentPayments.length === 0 ? <p className="text-gray-500">No payment logs yet.</p> : (
            <div className="space-y-3 max-h-[420px] overflow-auto">
              {data.recentPayments.map(payment => (
                <div key={payment.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <p className="font-semibold text-gray-800">{payment.userId}</p>
                  <p className="text-sm text-gray-600">Amount: {payment.amount / 100} {payment.currency.toUpperCase()} | Credits: {payment.credits}</p>
                  <p className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dash-card-strong">
          <h3 className="dash-card-title mb-4">Flagged AI Responses</h3>
          {data.openFlags.length === 0 ? <p className="text-gray-500">No open flags.</p> : (
            <div className="space-y-3 max-h-[420px] overflow-auto">
              {data.openFlags.map(flag => (
                <div key={flag.id} className="p-3 rounded-xl bg-red-50/70 border border-red-100">
                  <p className="font-semibold text-gray-900">{flag.source} - {flag.reason}</p>
                  <p className="text-xs text-gray-600">User: {flag.userId}</p>
                  {flag.contentSnippet && <p className="text-sm text-gray-700 mt-1 line-clamp-3">{flag.contentSnippet}</p>}
                  <p className="text-xs text-gray-500 mt-1">{new Date(flag.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
