import React from 'react';
import catalog from '../data/productCatalog.json';
import { FaShoppingBag } from 'react-icons/fa';

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
    // Simple matching logic - checking if hairType string contains key
    // e.g. "Type 4C" contains "Type 4"
    // If no match, default to Type 2 or generic
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
                        </div>

                        <div className="p-5 flex-grow flex flex-col">
                            <h4 className="font-bold text-gray-800 mb-1 line-clamp-2">{product.name}</h4>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">High-quality care for your specific hair needs.</p>

                            <div className="mt-auto">
                                <a
                                    href={product.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-3 rounded-xl hover:bg-purple-600 transition-colors duration-300 font-medium group-hover:shadow-lg group-hover:shadow-purple-200"
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
