import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { FaShoppingBag, FaHeart, FaTrash } from 'react-icons/fa';

interface Product {
    name: string;
    brand: string;
    image: string;
    link: string;
}

const SavedProductsPage: React.FC = () => {
    const { user } = useUser();
    const [savedProducts, setSavedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchSavedProducts();
        }
    }, [user]);

    const fetchSavedProducts = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/saved-products/${user?.id}`);
            const data = await response.json();
            setSavedProducts(data.map((item: any) => item.product));
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to fetch saved products:", error);
            setIsLoading(false);
        }
    };

    const removeProduct = async (product: Product) => {
        if (!user) return;
        try {
            await fetch(`http://localhost:5000/api/saved-products/${user.id}/${encodeURIComponent(product.name)}`, {
                method: 'DELETE'
            });
            setSavedProducts(prev => prev.filter(p => p.name !== product.name));
        } catch (error) {
            console.error("Error removing product:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 mb-4"></div>
                <p className="text-xl text-gray-600">Loading your saved products...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <h2 className="text-4xl font-extrabold text-gray-800 flex items-center">
                    <FaHeart className="text-purple-600 mr-4" />
                    Saved Products
                </h2>
                <span className="bg-purple-100 text-purple-800 py-1 px-4 rounded-full font-bold text-sm">
                    {savedProducts.length} Items
                </span>
            </div>

            {savedProducts.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-16 text-center border border-gray-100 animate-fade-in-up">
                    <div className="bg-purple-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaShoppingBag className="text-5xl text-purple-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Your save list is empty</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        Explore your personalized hair routine and recommendations to save products you want to try later.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up">
                    {savedProducts.map((product, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                        >
                            <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-700 shadow-sm">
                                    {product.brand}
                                </div>
                                <button
                                    onClick={() => removeProduct(product)}
                                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-500 shadow-sm hover:scale-110 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                    title="Remove from saved"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>

                            <div className="p-5 flex-grow flex flex-col">
                                <h4 className="font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h4>
                                <div className="flex-grow"></div>
                                <a
                                    href={product.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700 transition-colors duration-300 font-medium mt-4 shadow-md shadow-purple-200"
                                >
                                    <FaShoppingBag />
                                    Buy Now
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedProductsPage;
