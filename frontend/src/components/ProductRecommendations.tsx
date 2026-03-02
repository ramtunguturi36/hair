import React, { useState, useEffect } from 'react';
import catalog from '../data/productCatalog.json';
import { FaShoppingBag, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useUser } from '@clerk/clerk-react';

interface Product {
    name: string;
    brand: string;
    image: string;
    link: string;
}

interface ProductRecommendationsProps {
    hairType: string;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ hairType }) => {
    const { user } = useUser();
    const [savedProducts, setSavedProducts] = useState<Product[]>([]);

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
        } catch (error) {
            console.error("Failed to fetch saved products:", error);
        }
    };

    const isSaved = (productName: string) => savedProducts.some(p => p.name === productName);

    const toggleSave = async (product: Product) => {
        if (!user) return;
        const alreadySaved = isSaved(product.name);
        try {
            if (alreadySaved) {
                await fetch(`http://localhost:5000/api/saved-products/${user.id}/${encodeURIComponent(product.name)}`, {
                    method: 'DELETE'
                });
                setSavedProducts(prev => prev.filter(p => p.name !== product.name));
            } else {
                await fetch('http://localhost:5000/api/saved-products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, product })
                });
                setSavedProducts(prev => [...prev, product]);
            }
        } catch (error) {
            console.error("Error toggling save:", error);
        }
    };

    const getProducts = (type: string): Product[] => {
        if (type.includes('Type 1') || type.includes('Straight')) return (catalog as any)["Type 1"];
        if (type.includes('Type 2') || type.includes('Wavy')) return (catalog as any)["Type 2"];
        if (type.includes('Type 3') || type.includes('Curly')) return (catalog as any)["Type 3"];
        if (type.includes('Type 4') || type.includes('Coily')) return (catalog as any)["Type 4"];
        return (catalog as any)["Type 2"]; // Default
    };

    const products = getProducts(hairType);

    return (
        <div className="mt-12 mb-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                    <span className="bg-purple-100 p-2 rounded-lg mr-3 text-2xl">🧴</span>
                    Recommended Products
                </h3>
                <span className="text-sm px-3 py-1 bg-gray-100 rounded-full text-gray-600 font-medium">
                    Picked for {hairType}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product, index) => (
                    <div
                        key={index}
                        className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                    >
                        <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-700 shadow-sm">
                                {product.brand}
                            </div>
                            <button
                                onClick={() => toggleSave(product)}
                                className="absolute top-2 left-2 p-2 bg-white/90 backdrop-blur-sm rounded-full text-purple-600 shadow-sm hover:scale-110 transition-transform"
                                title={isSaved(product.name) ? "Unsave Product" : "Save Product"}
                            >
                                {isSaved(product.name) ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                            </button>
                        </div>

                        <div className="p-5 flex-grow flex flex-col">
                            <h4 className="font-bold text-gray-800 mb-1 line-clamp-2">{product.name}</h4>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">High-quality care for your specific hair needs.</p>

                            <div className="mt-auto flex gap-2 w-full">
                                <button
                                    onClick={() => toggleSave(product)}
                                    className="flex-1 flex items-center justify-center gap-2 bg-purple-50 text-purple-700 px-3 py-3 rounded-xl hover:bg-purple-100 transition-colors duration-300 font-medium border border-purple-100"
                                >
                                    {isSaved(product.name) ? "Saved" : "Save"}
                                </button>
                                <a
                                    href={product.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-[2] flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-xl hover:bg-purple-600 transition-colors duration-300 font-medium group-hover:shadow-lg group-hover:shadow-purple-200"
                                >
                                    <FaShoppingBag />
                                    Buy Now
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductRecommendations;
