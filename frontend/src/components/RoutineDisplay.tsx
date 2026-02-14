import React from 'react';
import { DailyRoutine } from '../utils/hairRoutineGenerator';
import { FaCalendarDay, FaPumpSoap } from 'react-icons/fa';

interface RoutineDisplayProps {
    routine: DailyRoutine[];
    hairType: string;
}

const RoutineDisplay: React.FC<RoutineDisplayProps> = ({ routine, hairType }) => {
    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-xl p-8 mt-10 border border-purple-100">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4 flex items-center">
                <FaCalendarDay className="mr-3 text-purple-600" />
                Your Weekly Hair Plan
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
                Curated specifically for your <span className="font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded">{hairType}</span> hair to maximize health and shine.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {routine.map((day, index) => {
                    const isWashDay = day.activity.includes('Wash');
                    const isMaskDay = day.activity.includes('Mask');
                    const isRestDay = !isWashDay && !isMaskDay;

                    return (
                        <div
                            key={index}
                            className={`relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border ${isWashDay ? 'bg-white border-blue-200 shadow-blue-100' :
                                    isMaskDay ? 'bg-white border-purple-200 shadow-purple-100' :
                                        'bg-white border-green-200 shadow-green-100'
                                }`}
                        >
                            {/* Decorative top bar */}
                            <div className={`absolute top-0 left-0 w-full h-1.5 ${isWashDay ? 'bg-blue-500' :
                                    isMaskDay ? 'bg-purple-500' :
                                        'bg-green-500'
                                }`} />

                            <h3 className="text-lg font-bold text-gray-800 mb-2 flex justify-between items-center">
                                {day.day}
                                <span className={`text-xs px-2 py-1 rounded-full ${isWashDay ? 'bg-blue-100 text-blue-700' :
                                        isMaskDay ? 'bg-purple-100 text-purple-700' :
                                            'bg-green-100 text-green-700'
                                    }`}>
                                    {isWashDay ? 'Wash' : isMaskDay ? 'Treat' : 'Rest'}
                                </span>
                            </h3>

                            <p className={`text-xl font-bold mb-4 ${isWashDay ? 'text-blue-600' :
                                    isMaskDay ? 'text-purple-600' :
                                        'text-green-600'
                                }`}>
                                {day.activity}
                            </p>

                            {day.products.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2 mb-2 text-gray-500 text-sm font-medium">
                                        <FaPumpSoap className="text-gray-400" />
                                        Recommended Products
                                    </div>
                                    <ul className="space-y-1">
                                        {day.products.map((p, i) => (
                                            <li key={i} className="text-sm text-gray-700 flex items-start">
                                                <span className="mr-2 text-gray-400">•</span>
                                                {p}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RoutineDisplay;
