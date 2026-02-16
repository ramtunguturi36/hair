import React, { useState } from 'react';
import { FaHeartbeat, FaExclamationTriangle, FaCheckCircle, FaChevronRight } from 'react-icons/fa';

const HairLossPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [score, setScore] = useState(0);

    const [showResult, setShowResult] = useState(false);

    const questions = [
        {
            id: 'genetics',
            question: "Does hair loss run in your family?",
            options: [
                { label: "No history", value: 0 },
                { label: "Yes, distant relatives", value: 20 },
                { label: "Yes, parents/siblings", value: 50 }
            ]
        },
        {
            id: 'stress',
            question: "How would you rate your current stress levels?",
            options: [
                { label: "Low", value: 0 },
                { label: "Moderate", value: 10 },
                { label: "High / Chronic", value: 30 }
            ]
        },
        {
            id: 'diet',
            question: "Do you follow a balanced diet rich in protein & vitamins?",
            options: [
                { label: "Yes, always", value: 0 },
                { label: "Sometimes", value: 10 },
                { label: "Rarely", value: 20 }
            ]
        },
        {
            id: 'age',
            question: "What is your age range?",
            options: [
                { label: "Under 25", value: 0 },
                { label: "25 - 40", value: 10 },
                { label: "40+", value: 20 }
            ]
        }
    ];

    const handleAnswer = (value: number) => {
        setScore(prev => prev + value);
        if (step < questions.length) {
            setStep(step + 1);
        } else {
            setShowResult(true);
        }
    };

    const getRiskLevel = () => {
        if (score < 30) return { level: "Low Risk", color: "text-green-600", bg: "bg-green-100", icon: FaCheckCircle, advice: "Your hair health looks great! Keep up your good habits." };
        if (score < 70) return { level: "Moderate Risk", color: "text-yellow-600", bg: "bg-yellow-100", icon: FaExclamationTriangle, advice: "You have some risk factors. Consider improving your diet and managing stress." };
        return { level: "High Risk", color: "text-red-600", bg: "bg-red-100", icon: FaHeartbeat, advice: "You are at higher risk. We recommend consulting a specialist and reviewing your hair care routine." };
    };

    const result = getRiskLevel();
    const ResultIcon = result.icon;

    return (
        <div className="p-8 max-w-4xl mx-auto min-h-[80vh] flex flex-col items-center justify-center">

            {!showResult ? (
                <div className="w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 animate-fade-in-up">
                    <div className="mb-8">
                        <div className="flex justify-between text-sm font-medium text-gray-400 mb-2">
                            <span>Question {step} of {questions.length}</span>
                            <span>{Math.round((step / questions.length) * 100)}% Completed</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(step / questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-800 mb-8 leading-tight">
                        {questions[step - 1].question}
                    </h2>

                    <div className="space-y-4">
                        {questions[step - 1].options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(option.value)}
                                className="w-full text-left p-6 rounded-2xl border border-gray-100 hover:border-purple-200 bg-white hover:bg-purple-50 transition-all duration-300 flex items-center justify-between group shadow-sm hover:shadow-md"
                            >
                                <span className="text-lg font-medium text-gray-700 group-hover:text-purple-700">{option.label}</span>
                                <FaChevronRight className="text-gray-300 group-hover:text-purple-500 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-3xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-12 text-center animate-fade-in-up">
                    <div className={`w-24 h-24 rounded-full ${result.bg} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                        <ResultIcon className={`text-5xl ${result.color}`} />
                    </div>

                    <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Your Risk Level: <span className={result.color}>{result.level}</span></h2>
                    <div className="w-64 h-4 bg-gray-200 rounded-full mx-auto my-6 overflow-hidden relative">
                        {/* Gradient scale */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 opacity-30"></div>
                        {/* Indicator */}
                        <div
                            className="absolute top-0 bottom-0 w-2 bg-gray-800 shadow-md transform -translate-x-1/2 transition-all duration-1000 ease-out"
                            style={{ left: `${Math.min(score, 100)}%` }}
                        ></div>
                    </div>

                    <p className="text-xl text-gray-600 max-w-xl mx-auto leading-relaxed mb-10">
                        {result.advice}
                    </p>

                    <button
                        onClick={() => { setStep(1); setScore(0); setShowResult(false); }}
                        className="btn-primary text-lg"
                    >
                        Retake Assessment
                    </button>
                </div>
            )}
        </div>
    );
};

export default HairLossPage;
