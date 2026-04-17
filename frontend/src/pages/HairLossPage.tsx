import React, { useState } from 'react';
import { FaHeartbeat, FaExclamationTriangle, FaCheckCircle, FaChevronRight } from 'react-icons/fa';
import { API_BASE, parseJsonResponse } from '../utils/api';

const HairLossPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [aiResult, setAiResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

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

    const submitAnalysis = async (answersToSubmit: string[]) => {
        setIsLoading(true);
        setShowResult(true);
        try {
            const response = await fetch(`${API_BASE}/api/analyze-risk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: answersToSubmit })
            });
            const data = await parseJsonResponse(response);
            setAiResult(data);
        } catch (error) {
            console.error('Failed to get ML risk analysis:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswer = (optionLabel: string, value: number) => {
        const currentQ = questions[step - 1].question;
        const answerText = `Q: ${currentQ} A: ${optionLabel}`;
        const newAnswers = [...userAnswers, answerText];

        setScore(prev => prev + value);
        setUserAnswers(newAnswers);

        if (step < questions.length) {
            setStep(step + 1);
        } else {
            submitAnalysis(newAnswers);
        }
    };

    const getFallbackResult = () => {
        if (score < 30) return { level: "Low Risk", color: "text-green-600", bg: "bg-green-100", icon: FaCheckCircle, advice: "Your hair health looks great! Keep up your good habits." };
        if (score < 70) return { level: "Moderate Risk", color: "text-yellow-600", bg: "bg-yellow-100", icon: FaExclamationTriangle, advice: "You have some risk factors. Consider improving your diet and managing stress." };
        return { level: "High Risk", color: "text-red-600", bg: "bg-red-100", icon: FaHeartbeat, advice: "You are at higher risk. We recommend consulting a specialist and reviewing your hair care routine." };
    };

    const result = aiResult ? {
        level: aiResult.riskLevel,
        color: aiResult.riskLevel === "Low Risk" ? "text-green-600" : aiResult.riskLevel === "Moderate Risk" ? "text-yellow-600" : "text-red-600",
        bg: aiResult.riskLevel === "Low Risk" ? "bg-green-100" : aiResult.riskLevel === "Moderate Risk" ? "bg-yellow-100" : "bg-red-100",
        icon: aiResult.riskLevel === "Low Risk" ? FaCheckCircle : aiResult.riskLevel === "Moderate Risk" ? FaExclamationTriangle : FaHeartbeat,
        advice: aiResult.explanation
    } : getFallbackResult();

    const ResultIcon = result.icon;

    return (
        <div className="dash-page max-w-4xl min-h-[80vh] flex flex-col items-center justify-center">

            {!showResult ? (
            <div className="w-full max-w-2xl dash-card-strong p-10 animate-fade-in-up">
                    <div className="mb-8">
                        <div className="flex justify-between text-sm font-medium text-gray-400 mb-2">
                            <span>Question {step} of {questions.length}</span>
                            <span>{Math.round((step / questions.length) * 100)}% Completed</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(step / questions.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <h2 className="dash-card-title text-3xl mb-8 leading-tight">
                        {questions[step - 1].question}
                    </h2>

                    <div className="space-y-4">
                        {questions[step - 1].options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(option.label, option.value)}
                                className="w-full text-left p-6 rounded-2xl border border-slate-200 hover:border-cyan-200 bg-white hover:bg-cyan-50 transition-all duration-300 flex items-center justify-between group shadow-sm"
                            >
                                <span className="text-lg font-medium text-gray-700 group-hover:text-cyan-700">{option.label}</span>
                                <FaChevronRight className="text-gray-300 group-hover:text-cyan-600 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-3xl dash-card-strong p-12 text-center animate-fade-in-up">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 mb-4"></div>
                            <p className="text-xl text-gray-600">AI is analyzing your risk factors...</p>
                        </div>
                    ) : (
                        <>
                            <div className={`w-24 h-24 rounded-full ${result.bg} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                                <ResultIcon className={`text-5xl ${result.color}`} />
                            </div>

                            <h2 className="dash-title text-4xl mb-2">Your Risk Level: <span className={result.color}>{result.level}</span></h2>
                            <div className="w-64 h-4 bg-gray-200 rounded-full mx-auto my-6 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 opacity-30"></div>
                                <div
                                    className="absolute top-0 bottom-0 w-2 bg-gray-800 shadow-md transform -translate-x-1/2 transition-all duration-1000 ease-out"
                                    style={{ left: `${Math.min(aiResult ? aiResult.score : score, 100)}%` }}
                                ></div>
                            </div>

                            <p className="text-xl text-gray-600 max-w-xl mx-auto leading-relaxed mb-6">
                                {result.advice}
                            </p>

                            {aiResult && aiResult.actionableAdvice && (
                                <div className="text-left bg-cyan-50 p-6 rounded-2xl mb-10 border border-cyan-100 shadow-sm inline-block w-full max-w-xl">
                                    <h3 className="dash-card-title text-lg mb-3 text-cyan-900 border-b border-cyan-200 pb-2">Actionable AI Advice</h3>
                                    <ul className="list-disc pl-5 space-y-2 text-cyan-800">
                                        {aiResult.actionableAdvice.map((advice: string, idx: number) => (
                                            <li key={idx} className="text-md">{advice}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <button
                                onClick={() => { setStep(1); setScore(0); setUserAnswers([]); setAiResult(null); setShowResult(false); }}
                                className="dash-btn-primary w-full md:w-auto px-8 py-4"
                            >
                                Retake Assessment
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default HairLossPage;
