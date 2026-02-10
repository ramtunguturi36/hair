import { Link } from 'react-router-dom';

const UpgradeCard: React.FC = () => {
    return (
      <div className="bg-red-100 border border-red-500 text-red-700 p-8 rounded-lg mb-4 text-center">
        <h3 className="font-bold text-xl mb-2">⚠️ Out of Credits!</h3>
        <p className="mb-4">You've used all your analysis credits.</p>
        <p className="mb-6">Purchase more credits to continue analyzing your hair.</p>
        <Link 
          to="/dashboard/pricing" 
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg inline-block transition-colors"
        >
          Buy Credits Now
        </Link>
      </div>
    )
  }
  
  export default UpgradeCard;
  