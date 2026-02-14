import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { FaHistory, FaCalendarAlt } from 'react-icons/fa';

interface HistoryItem {
    id: string;
    date: string;
    result: string; // e.g., "Type 4C"
    image?: string;
}

const HistoryPage: React.FC = () => {
    const { user } = useUser();
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchHistory();
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            // In a real deployed app, replace localhost with production URL
            const response = await axios.get(`http://localhost:5000/api/history/${user?.id}`);
            // Sort by date descending
            const sorted = response.data.sort((a: any, b: any) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            setHistory(sorted);
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (isoDate: string) => {
        return new Date(isoDate).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <div className="p-8 text-center">Loading history...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                <FaHistory className="mr-3 text-purple-600" />
                Analysis History
            </h2>

            {history.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
                    <p className="text-xl">No analysis history found.</p>
                    <p className="mt-2 text-sm">Take a photo to get your first hair analysis!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {history.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row transition hover:shadow-lg">
                            {item.image && (
                                <div className="md:w-48 h-48 md:h-auto flex-shrink-0 bg-gray-100">
                                    <img src={item.image} alt="Hair analysis" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="p-6 flex-grow">
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <FaCalendarAlt className="mr-2" />
                                    {formatDate(item.date)}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">
                                    Result: <span className="text-purple-600">{item.result}</span>
                                </h3>
                                <p className="text-gray-600">
                                    Hair analysis completed successfully. Check your routine suggestions in the dashboard details.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
