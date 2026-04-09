import HeroSection from '../components/HeroSection';
import Navbar from '../components/Navbar';
import CompaniesSection from '../components/CompaniesSection';
import PaymentPlansSection from '../components/PaymentPlansSection';
import Footer from '../components/Footer';

const Home: React.FC = () => {

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#dbeafe_0%,#f8fafc_35%,#f1f5f9_100%)] text-slate-900">
      <Navbar />
      <HeroSection />
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-16 md:pb-24 space-y-12 md:space-y-16">
        <section className="rounded-3xl border border-slate-200/70 bg-white/85 backdrop-blur-md shadow-sm">
          <CompaniesSection />
        </section>
        <section className="rounded-3xl border border-slate-200/70 bg-white/90 shadow-sm overflow-hidden">
          <PaymentPlansSection />
        </section>
      </div>
      <Footer />
    </div>


  );
};

export default Home;
