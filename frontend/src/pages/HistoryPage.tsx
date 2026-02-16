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
        <div className="p-8 max-w-5xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-800 mb-10 flex items-center">
                <FaHistory className="mr-4 text-purple-600" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                    Analysis History
                </span>
            </h2>

            {history.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-12 text-center text-gray-500 border border-white/50">
                    <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaHistory className="text-4xl text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-800 mb-2">No History Yet</p>
                    <p className="text-gray-500">Take your first photo analysis to see your results here!</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {history.map((item) => (
                        <div key={item.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                            {item.image && (
                                <div className="md:w-64 h-64 md:h-auto flex-shrink-0 bg-gray-100 relative overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt="Hair analysis"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            )}
                            <div className="p-8 flex-grow flex flex-col justify-center">
                                <div className="flex items-center text-sm font-medium text-purple-600 mb-3 bg-purple-50 w-fit px-3 py-1 rounded-full">
                                    <FaCalendarAlt className="mr-2" />
                                    {formatDate(item.date)}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">
                                    {item.result}
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    Analysis completed successfully. Your personalized routine and product recommendations are ready.
                                </p>
                                <button className="text-purple-600 font-semibold hover:text-purple-800 transition-colors flex items-center self-start">
                                    View Full Report &rarr;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HistoryPage;
