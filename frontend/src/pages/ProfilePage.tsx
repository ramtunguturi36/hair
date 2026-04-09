import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { FaSave, FaCog, FaStar } from 'react-icons/fa';
import { hair } from '../assets/index';
import { api } from '../utils/api';

interface ProfileData {
    userId: string;
    concerns: string[];
    budgetRange: 'low' | 'mid' | 'high';
    allergies: string[];
    goals: string[];
    reminderTime: string;
    reminderDays: string[];
}

const ProfilePage: React.FC = () => {
    const { user } = useUser();
    const [preferences, setPreferences] = useState<ProfileData>({
        userId: '',
        concerns: [],
        budgetRange: 'mid',
        allergies: [],
        goals: [],
        reminderTime: '20:00',
        reminderDays: ['Mon', 'Wed', 'Sat']
    });
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            if (!user) return;
            try {
                const profile = await api.get<ProfileData>(`/api/profile/${user.id}`);
                setPreferences(profile);
            } catch (error) {
                console.error('Failed to load profile:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [user?.id]);

    const toggleListValue = (field: 'concerns' | 'goals' | 'reminderDays', value: string) => {
        setPreferences(prev => {
            const has = prev[field].includes(value);
            return {
                ...prev,
                [field]: has ? prev[field].filter(item => item !== value) : [...prev[field], value]
            };
        });
        setSaved(false);
    };

    const updateAllergies = (value: string) => {
        const list = value.split(',').map(v => v.trim()).filter(Boolean);
        setPreferences(prev => ({ ...prev, allergies: list }));
        setSaved(false);
    };

    const handleSave = async () => {
        if (!user) return;
        try {
            await api.put(`/api/profile/${user.id}`, preferences);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        } catch (error) {
            console.error('Failed to save profile:', error);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading profile settings...</div>;
    }

    return (
        <div className="dash-page">
            {/* Header Profile Card */}
            <div className="dash-card-strong mb-8 flex flex-col md:flex-row items-center gap-8 animate-fade-in-up">
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
                        <span className="dash-chip">Premium Member</span>
                        <span className="dash-chip">Early Adopter</span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Settings Column */}
                <div className="md:col-span-2 space-y-8">
                    <div className="dash-card-strong">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                <FaCog className="mr-3 text-gray-400" />
                                Personalization Settings
                            </h3>
                            {saved && <span className="text-green-600 text-sm font-bold flex items-center animate-pulse"><FaCheck className="mr-1" /> Saved</span>}
                        </div>

                        <p className="text-gray-500 mb-6 text-sm">
                            Set concerns, budget, allergies, and goals. These are used to personalize routines, recommendations, and reminders.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <p className="font-semibold text-gray-700 mb-3">Hair Concerns</p>
                                <div className="flex flex-wrap gap-3">
                                    {['oiliness', 'dryness', 'sensitive scalp', 'dandruff', 'color treated', 'frizz'].map(item => (
                                        <button
                                            key={item}
                                            onClick={() => toggleListValue('concerns', item)}
                                            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${preferences.concerns.includes(item) ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-purple-100'}`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-700 mb-3">Goals</p>
                                <div className="flex flex-wrap gap-3">
                                    {['reduce shedding', 'grow length', 'improve shine', 'improve scalp health', 'define curls'].map(goal => (
                                        <button
                                            key={goal}
                                            onClick={() => toggleListValue('goals', goal)}
                                            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${preferences.goals.includes(goal) ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-indigo-100'}`}
                                        >
                                            {goal}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-700 mb-3">Budget Range</p>
                                <div className="flex gap-3">
                                    {['low', 'mid', 'high'].map(level => (
                                        <button
                                            key={level}
                                            onClick={() => {
                                                setPreferences(prev => ({ ...prev, budgetRange: level as 'low' | 'mid' | 'high' }));
                                                setSaved(false);
                                            }}
                                            className={`px-4 py-2 rounded-lg font-semibold capitalize ${preferences.budgetRange === level ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="font-semibold text-gray-700 mb-2">Allergies (comma separated)</p>
                                <input
                                    value={preferences.allergies.join(', ')}
                                    onChange={e => updateAllergies(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3"
                                    placeholder="fragrance, coconut oil, sulfates"
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-semibold text-gray-700 mb-2">Reminder Time</p>
                                    <input
                                        type="time"
                                        value={preferences.reminderTime}
                                        onChange={e => {
                                            setPreferences(prev => ({ ...prev, reminderTime: e.target.value }));
                                            setSaved(false);
                                        }}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3"
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-700 mb-2">Reminder Days</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                            <button
                                                key={day}
                                                onClick={() => toggleListValue('reminderDays', day)}
                                                className={`px-3 py-2 rounded-lg text-sm font-semibold ${preferences.reminderDays.includes(day) ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700'}`}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {[
                                { key: 'concerns', label: `${preferences.concerns.length} concerns selected` },
                                { key: 'goals', label: `${preferences.goals.length} goals selected` },
                                { key: 'allergies', label: `${preferences.allergies.length} allergies set` }
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors">
                                    <span className="font-medium text-gray-700">{item.label}</span>
                                    <span className="text-xs text-purple-600 font-bold">Synced</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={handleSave}
                                className="dash-btn-primary flex items-center px-8"
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
                        <p className="text-gray-400 text-xs">Profile preferences are now used for reminders and routine tuning.</p>
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
