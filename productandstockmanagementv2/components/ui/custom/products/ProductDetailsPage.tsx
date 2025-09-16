'use client'
import React, { useState } from 'react';
import { Heart, Star, ShoppingCart, Minus, Plus, Share2, Shield, Truck, RotateCcw, Eye, Check } from 'lucide-react';
import { Product } from '@/types/product';
import Image from 'next/image';

interface ProductProps {
  product: Product | null;
}

const ProductDetailsPage = ({ product }: ProductProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Product not found</p>
        </div>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const savings = product.price - discountedPrice;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500 overflow-x-auto">
            <span className="whitespace-nowrap hover:text-blue-600 cursor-pointer">Home</span>
            <span>/</span>
            {product.category.map((cat, index) => (
              <React.Fragment key={cat.id}>
                <span className="hover:text-blue-600 cursor-pointer whitespace-nowrap">{cat.title}</span>
                {index < product.category.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square">
                {product.images.length > 0 ? (
                  <Image
                  width={600}
                    height={600}
                    src={product.images[selectedImage]?.url || '/api/placeholder/600/600'}
                    alt={product.title}
                    className="w-full h-full object-contain p-4"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                    <Eye className="w-16 h-16 text-gray-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-gray-600">4.8 (156 reviews)</span>
                </div>
                <span className="text-gray-500">SKU: {product.sku}</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ${discountedPrice.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-xl text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="bg-green-100 text-green-700 text-sm font-semibold px-2 py-1 rounded">
                      Save {product.discountPercentage}%
                    </span>
                  </>
                )}
              </div>
              {savings > 0 && (
                <p className="text-green-600 text-sm mt-2">
                  You save ${savings.toFixed(2)}
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 10 ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-medium">In Stock</span>
                </>
              ) : product.stock > 0 ? (
                <>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-yellow-600 font-medium">Only {product.stock} left</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="px-4 py-2 min-w-[60px] text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 hover:bg-gray-50 transition-colors"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <button
                  disabled={product.stock === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
                
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-lg border transition-colors ${
                    isWishlisted
                      ? 'bg-red-50 border-red-300 text-red-600'
                      : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                
                <button className="p-3 bg-white border border-gray-300 text-gray-600 hover:border-gray-400 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <button className="w-full bg-green-50 hover:bg-green-100 text-green-700 font-semibold py-3 px-6 rounded-lg transition-colors border border-green-200">
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <Truck className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                <p className="text-xs text-gray-500 mt-1">{product.shippingInformation}</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                <p className="text-xs text-gray-500 mt-1">100% protected</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                <p className="text-xs text-gray-500 mt-1">{product.returnPolicy}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200">
          <div className="flex border-b border-gray-200">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 font-medium text-center transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600 -mb-[2px]'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="p-6">
            {activeTab === 'description' && (
              <div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {product.description}
                </p>
                {product.metaDescription && (
                  <div className="bg-gray-50 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Additional Information</h4>
                    <p className="text-gray-600">{product.metaDescription}</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 text-lg">Product Details</h4>
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">SKU</td>
                      <td className="py-3 text-right font-medium">{product.sku}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">Stock</td>
                      <td className="py-3 text-right font-medium">{product.stock} units</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">Category</td>
                      <td className="py-3 text-right font-medium">
                        {product.category.map(cat => cat.title).join(', ')}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">Shipping</td>
                      <td className="py-3 text-right font-medium">{product.shippingInformation}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">Returns</td>
                      <td className="py-3 text-right font-medium">{product.returnPolicy}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h4>
                <p className="text-gray-600 mb-6">Be the first to review this product!</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;