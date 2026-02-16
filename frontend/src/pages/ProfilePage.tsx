import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { FaSave, FaCog, FaStar } from 'react-icons/fa';
import { hair } from '../assets/index';

const ProfilePage: React.FC = () => {
    const { user } = useUser();
    const [preferences, setPreferences] = useState({
        isOily: false,
        isDry: false,
        isSensitive: false,
        hasDandruff: false,
        isColored: false
    });
    const [saved, setSaved] = useState(false);

    const togglePreference = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
        setSaved(false);
    };

    const handleSave = () => {
        // Here you would typically save to backend
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto p-8">
            {/* Header Profile Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-8 mb-8 flex flex-col md:flex-row items-center gap-8 animate-fade-in-up">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-purple-500 to-indigo-500 shadow-lg">
                        <img
                            src={user?.imageUrl || hair}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover border-4 border-white"
                        />
                    </div>
                    <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                </div>

                <div className="text-center md:text-left flex-1">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-1">{user?.fullName}</h2>
                    <p className="text-gray-500 mb-4">{user?.primaryEmailAddress?.emailAddress}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">Premium Member</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">Early Adopter</span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Settings Column */}
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                <FaCog className="mr-3 text-gray-400" />
                                Hair Susceptibility
                            </h3>
                            {saved && <span className="text-green-600 text-sm font-bold flex items-center animate-pulse"><FaCheck className="mr-1" /> Saved</span>}
                        </div>

                        <p className="text-gray-500 mb-6 text-sm">
                            Select the conditions that apply to you. We'll use this to fine-tune your product recommendations.
                        </p>

                        <div className="space-y-4">
                            {[
                                { key: 'isOily', label: 'Prone to Oiliness' },
                                { key: 'isDry', label: 'Prone to Dryness' },
                                { key: 'isSensitive', label: 'Sensitive Scalp' },
                                { key: 'hasDandruff', label: 'Dandruff Concerns' },
                                { key: 'isColored', label: 'Color Treated Hair' }
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors">
                                    <span className="font-medium text-gray-700">{item.label}</span>
                                    <button
                                        onClick={() => togglePreference(item.key as keyof typeof preferences)}
                                        className={`w-12 h-6 rounded-full transition-colors relative duration-300 ${preferences[item.key as keyof typeof preferences] ? 'bg-purple-600' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform duration-300 ${preferences[item.key as keyof typeof preferences] ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={handleSave}
                                className="btn-primary flex items-center px-8"
                            >
                                <FaSave className="mr-2" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>

                {/* Favorites / Stats Column */}
                <div className="space-y-8">
                    <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-xl p-6 text-white text-center">
                        <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <FaStar className="text-yellow-400 text-2xl" />
                        </div>
                        <h4 className="text-lg font-bold mb-1">Total Scans</h4>
                        <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">12</p>
                        <p className="text-gray-400 text-xs">Keep scanning to track your hair health journey!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Simple Icon component for Save notification
const FaCheck = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export default ProfilePage;
