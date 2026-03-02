import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-purple-900 to-indigo-900 text-white">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Contact Us</h1>
                <div className="max-w-xl mx-auto bg-white/10 p-8 rounded-xl backdrop-blur-md">
                    <form className="flex flex-col gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                            <input type="text" id="name" className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-white" placeholder="Your Name" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                            <input type="email" id="email" className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-white" placeholder="your@email.com" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                            <textarea id="message" rows={4} className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2.5 text-white" placeholder="How can we help you?"></textarea>
                        </div>
                        <button type="button" onClick={(e) => { e.preventDefault(); alert("Message sent successfully!"); }} className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium py-3 rounded-lg transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ContactPage;
