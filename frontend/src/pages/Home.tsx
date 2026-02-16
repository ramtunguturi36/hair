import HeroSection from '../components/HeroSection';
import Navbar from '../components/Navbar';
import CompaniesSection from '../components/CompaniesSection';
import PaymentPlansSection from '../components/PaymentPlansSection';
import Footer from '../components/Footer';

const Home: React.FC = () => {

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-indigo-900">
      <Navbar />
      <HeroSection />
      <CompaniesSection />
      <PaymentPlansSection />
      <Footer />
    </div>


  );
};

export default Home;
