import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl p-8 max-w-md text-center border border-red-100">
                        <div className="bg-red-100 p-4 rounded-full inline-block mb-4">
                            <span className="text-4xl">⚠️</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong.</h1>
                        <p className="text-gray-600 mb-6">
                            We're sorry, but the application encountered an unexpected error.
                        </p>
                        {this.state.error && (
                            <div className="bg-gray-100 p-3 rounded text-left text-xs font-mono text-red-600 mb-6 overflow-auto max-h-32">
                                {this.state.error.toString()}
                            </div>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
