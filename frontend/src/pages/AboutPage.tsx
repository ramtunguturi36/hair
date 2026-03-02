import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-purple-900 to-indigo-900 text-white">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-16">
                <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">About Us</h1>
                <div className="max-w-3xl mx-auto bg-white/10 p-8 rounded-xl backdrop-blur-md">
                    <p className="text-lg mb-4">
                        Welcome to Beauty, your ultimate AI-powered hair analysis and consultation platform.
                    </p>
                    <p className="text-lg mb-4">
                        Our mission is to empower individuals to understand their hair better, providing personalized insights, product recommendations, and style guides tailored specifically to your unique hair type and conditions.
                    </p>
                    <p className="text-lg">
                        Using advanced machine learning and expert knowledge, we aim to bridge the gap between scientific hair care and daily routines.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AboutPage;
