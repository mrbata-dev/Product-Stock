import React, { useState } from 'react';
import { Heart, Star, ShoppingCart, Minus, Plus, Share2, Shield, Truck, RotateCcw, Eye } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/types/product';

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Product not found</p>
        </div>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const savings = product.price - discountedPrice;

  return (
    <div className="min-h-screen shadow-2xl w-6xl">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Home</span>
            <span>/</span>
            {product.category.map((cat, index) => (
              <React.Fragment key={cat.id}>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">{cat.title}</span>
                {index < product.category.length - 1 && <span>/</span>}
              </React.Fragment>
            ))}
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative group">
              <div className="aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200/60">
                {product.images.length > 0 ? (
                  <Image
                  width={500}
                  height={500}
                  loading='lazy' 
                    src={product.images[selectedImage]?.url || '/api/placeholder/600/600'}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Eye className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              
              {/* Image Navigation Dots */}
              {product.images.length > 1 && (
                <div className="flex justify-center space-x-2 mt-4">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        selectedImage === index 
                          ? 'bg-blue-600 scale-125' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? 'border-blue-500 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                    width={300}
                    height={300}
                    loading='lazy'
                      src={image.url}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            {/* Title and Rating */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {product.title}
              </h1>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-gray-600 ml-2">(4.8) • 156 reviews</span>
                </div>
                <span className="text-sm text-gray-500">SKU: {product.sku}</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-bold text-gray-900">
                  ${discountedPrice.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-2xl text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      {product.discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>
              {savings > 0 && (
                <p className="text-green-600 font-medium mt-2">
                  You save ${savings.toFixed(2)}!
                </p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <span className={`font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center bg-white border-2 border-gray-200 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors rounded-l-xl"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 font-medium min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 hover:bg-gray-50 transition-colors rounded-r-xl"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  disabled={product.stock === 0}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center space-x-3"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
                
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    isWishlisted
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                
                <button className="p-4 bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-200 hover:text-blue-600 rounded-xl transition-all duration-300">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="text-center space-y-2">
                <Truck className="w-8 h-8 text-blue-600 mx-auto" />
                <p className="text-sm font-medium text-gray-900"> Shipping</p>
                <p className="text-xs text-gray-500">{product.shippingInformation}</p>
              </div>
              <div className="text-center space-y-2">
                <Shield className="w-8 h-8 text-green-600 mx-auto" />
                <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                <p className="text-xs text-gray-500">100% protected</p>
              </div>
              <div className="text-center space-y-2">
                <RotateCcw className="w-8 h-8 text-purple-600 mx-auto" />
                <p className="text-sm font-medium text-gray-900">Easy Returns</p>
                <p className="text-xs text-gray-500">{product.returnPolicy}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl border border-gray-200/60 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 font-medium text-center transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {product.description}
                </p>
                {product.metaDescription && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-semibold text-gray-900 mb-2">Additional Information</h4>
                    <p className="text-gray-600">{product.metaDescription}</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Product Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">SKU</span>
                      <span className="font-medium">{product.sku}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Stock</span>
                      <span className="font-medium">{product.stock} units</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium">
                        {product.category.map(cat => cat.title).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h4>
                <p className="text-gray-600">Be the first to review this product!</p>
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
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