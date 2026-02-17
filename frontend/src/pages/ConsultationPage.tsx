import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const ConsultationPage: React.FC = () => {
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `Hello ${user?.firstName || 'there'}! I'm your AI Hair Consultant. How can I help you with your hair today?`,
            sender: 'ai',
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setInputText('');
        setIsTyping(true);

        // Send message to backend
        try {
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputText,
                    history: messages.map(msg => ({
                        text: msg.text,
                        sender: msg.sender
                    }))
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();

            const newAiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.reply,
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, newAiMessage]);

        } catch (error) {
            console.error('Error sending message:', error);
            // Fallback error message
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'm having trouble connecting to the server right now. Please try again later.",
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col max-w-4xl mx-auto p-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex items-center shadow-md z-10">
                    <div className="bg-white/20 p-3 rounded-full mr-4 backdrop-blur-sm">
                        <FaRobot className="text-2xl text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">AI Hair Consultant</h2>
                        <p className="text-purple-100 text-sm flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                            Online & Ready to Help
                        </p>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-end max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user'
                                    ? 'bg-indigo-100 text-indigo-600 ml-2'
                                    : 'bg-purple-100 text-purple-600 mr-2'
                                    }`}>
                                    {msg.sender === 'user' ? <FaUser size={14} /> : <FaRobot size={14} />}
                                </div>

                                <div className={`px-5 py-3 rounded-2xl shadow-sm ${msg.sender === 'user'
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none'
                                    : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                                    }`}>
                                    <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                                    <span className={`text-[10px] block mt-1 opacity-70 ${msg.sender === 'user' ? 'text-indigo-100 text-right' : 'text-gray-400'
                                        }`}>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex items-end">
                                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 mr-2 flex items-center justify-center">
                                    <FaRobot size={14} />
                                </div>
                                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ask me anything about your hair..."
                            className="flex-1 bg-gray-50 text-gray-800 placeholder-gray-400 px-6 py-4 rounded-xl border-none focus:ring-2 focus:ring-purple-100 focus:bg-white transition-all shadow-inner"
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim()}
                            className="bg-gray-900 text-white p-4 rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-95"
                        >
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ConsultationPage;
