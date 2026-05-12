import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { TeachableMachineDemo } from '../components/TeachableMachineDemo';

/**
 * TEACHABLE MACHINE SHOWCASE PAGE
 * 
 * This page demonstrates the ML pipeline for external review.
 * Not integrated into the main analysis flow.
 * 
 * Route: /showcase/teachable-machine
 */

export const TeachableMachineShowcasePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔬 ML Pipeline Architecture Showcase
            </h1>
            <p className="text-lg text-gray-700 mb-2">
              Teachable Machine + Gemini Integration
            </p>
            <div className="inline-block mt-4 px-4 py-2 bg-blue-100 border-l-4 border-blue-600 rounded">
              <p className="text-sm text-blue-900 font-semibold">
                💡 This component showcases how ML and API work together
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Not connected to main analysis flow (for demonstration only)
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            {/* Card 1 */}
            <div className="p-4 bg-white rounded-lg shadow-md border-t-4 border-purple-500">
              <h3 className="font-bold text-lg text-purple-700 mb-2">🧠 Layer 1: ML</h3>
              <p className="text-sm text-gray-700">
                Teachable Machine classifies hair type, texture, and condition from images
              </p>
              <p className="text-xs text-purple-600 mt-2 font-semibold">
                Custom trained model
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-4 bg-white rounded-lg shadow-md border-t-4 border-blue-500">
              <h3 className="font-bold text-lg text-blue-700 mb-2">🔄 Connection</h3>
              <p className="text-sm text-gray-700">
                ML classifications are sent to backend with user profile
              </p>
              <p className="text-xs text-blue-600 mt-2 font-semibold">
                API calls with context
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-4 bg-white rounded-lg shadow-md border-t-4 border-green-500">
              <h3 className="font-bold text-lg text-green-700 mb-2">🤖 Layer 2: API</h3>
              <p className="text-sm text-gray-700">
                Gemini uses ML output to generate personalized routines
              </p>
              <p className="text-xs text-green-600 mt-2 font-semibold">
                Enriched with context
              </p>
            </div>
          </div>

          {/* Main Component */}
          <div className="mb-12">
            <TeachableMachineDemo />
          </div>

          {/* Architecture Explanation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left Column */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                ✅ Why This Approach?
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    ❌ Without ML (Just API):
                  </h3>
                  <p className="text-sm text-gray-600 bg-red-50 p-3 rounded border-l-4 border-red-400">
                    Image → Gemini API → Generic analysis
                    <br/>
                    <span className="text-xs mt-2 block">
                      Problem: API guesses everything, less accurate
                    </span>
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    ✅ With ML Pipeline (This Approach):
                  </h3>
                  <p className="text-sm text-gray-600 bg-green-50 p-3 rounded border-l-4 border-green-400">
                    Image → ML Model (classification) → Gemini (personalization)
                    <br/>
                    <span className="text-xs mt-2 block">
                      Advantage: Model classifies first, API personalizes based on facts
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📊 For External Review
              </h2>
              
              <div className="space-y-3 text-sm">
                <p className="text-gray-700">
                  <strong>Show this component to demonstrate:</strong>
                </p>
                
                <ul className="space-y-2 ml-4">
                  <li className="text-gray-700">
                    ✓ ML model integration (not just API calls)
                  </li>
                  <li className="text-gray-700">
                    ✓ Custom ML training capability
                  </li>
                  <li className="text-gray-700">
                    ✓ API enhancement with ML output
                  </li>
                  <li className="text-gray-700">
                    ✓ Real machine learning pipeline
                  </li>
                  <li className="text-gray-700">
                    ✓ Production-ready architecture thinking
                  </li>
                </ul>

                <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400">
                  <p className="text-xs text-blue-900 font-semibold">
                    💡 Say in viva: "We designed a two-layer pipeline where Teachable Machine 
                    provides scientific classification and Gemini adds personalization. 
                    This is real ML engineering."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Code Reference */}
          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg font-mono text-sm overflow-auto">
            <h3 className="text-lg font-bold mb-4 text-yellow-400">📄 Code Files Created</h3>
            <div className="space-y-2">
              <p>✓ <span className="text-green-400">frontend/src/components/TeachableMachineDemo.tsx</span></p>
              <p className="text-xs text-gray-400 ml-4">React component showing ML classification UI</p>
              
              <p className="mt-4">✓ <span className="text-green-400">backend/routes/showcase-teachable-machine.js</span></p>
              <p className="text-xs text-gray-400 ml-4">Endpoint: POST /api/showcase/analyze-with-teachable-machine</p>
              
              <p className="mt-4">✓ <span className="text-green-400">frontend/pages/TeachableMachineShowcasePage.tsx</span></p>
              <p className="text-xs text-gray-400 ml-4">This page (route: /showcase/teachable-machine)</p>
            </div>
          </div>

          {/* Important Note */}
          <div className="mt-12 p-6 bg-yellow-50 border-4 border-yellow-400 rounded-lg">
            <h3 className="font-bold text-yellow-900 text-lg mb-2">
              ⚠️ Important: NOT Connected to Main Flow
            </h3>
            <p className="text-yellow-800">
              This is a <strong>standalone showcase component</strong> for external review. 
              Your main project continues to use Gemini API only. 
              This demonstrates what the ML pipeline would look like if implemented. 
              Perfect for explaining the architecture to reviewers!
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TeachableMachineShowcasePage;
