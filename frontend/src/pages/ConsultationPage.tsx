import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { FaUserMd, FaPaperPlane } from 'react-icons/fa';

const ConsultationPage: React.FC = () => {
    const { user } = useUser();
    const [formData, setFormData] = useState({
        name: user?.fullName || '',
        email: user?.primaryEmailAddress?.emailAddress || '',
        concern: '',
        hairType: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call / EmailJS
        console.log('Sending consultation request:', formData);

        // Simulate network delay
        setTimeout(() => {
            setSubmitted(true);
        }, 1000);
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center p-8 h-full text-center">
                <div className="bg-green-100 p-6 rounded-full mb-6">
                    <FaPaperPlane className="text-4xl text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Sent!</h2>
                <p className="text-gray-600 max-w-md">
                    Our hair specialists have received your query. You will receive a personalized response at
                    <span className="font-semibold text-gray-800"> {formData.email} </span>
                    within 24 hours.
                </p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 text-purple-600 font-semibold hover:underline"
                >
                    Send another request
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
                    <h2 className="text-3xl font-bold flex items-center mb-2">
                        <FaUserMd className="mr-3" />
                        Ask an Expert
                    </h2>
                    <p className="opacity-90">
                        Get professional advice from certified trichologists for your specific hair concerns.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hair Type (Optional)</label>
                        <select
                            name="hairType"
                            value={formData.hairType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        >
                            <option value="">Select your hair type...</option>
                            <option value="Type 1 (Straight)">Type 1 (Straight)</option>
                            <option value="Type 2 (Wavy)">Type 2 (Wavy)</option>
                            <option value="Type 3 (Curly)">Type 3 (Curly)</option>
                            <option value="Type 4 (Coily)">Type 4 (Coily)</option>
                            <option value="Not Sure">Not Sure</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Describe your concern</label>
                        <textarea
                            name="concern"
                            value={formData.concern}
                            onChange={handleChange}
                            required
                            rows={5}
                            placeholder="E.g., My hair feels dry even after conditioning, or I have excessive breakage..."
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition transform hover:scale-[1.01]"
                    >
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConsultationPage;
