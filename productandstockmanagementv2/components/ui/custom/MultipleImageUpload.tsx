'use client'
import React, { useState } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import Image from 'next/image';

interface MultipleImageUploadProps {
  onChange?: (files: File[]) => void;
}

interface SelectedImage {
  id: number;
  file: File;
  url: string;
  name: string;
}

export default function MultipleImageUpload({onChange}:  MultipleImageUploadProps) {
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files: File[]): void => {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
       const reader = new FileReader();
reader.onload = (e: ProgressEvent<FileReader>) => {
  if (!e.target?.result) return;

  const newImage: SelectedImage = {
    id: Date.now() + Math.random(),
    file: file,
    url: e.target.result as string,
    name: file.name
  };

  setSelectedImages(prev => {
    const newState = [...prev, newImage];
    onChange?.(newState.map(img => img.file)); // pass File objects to form
    return newState;
  });
};
reader.readAsDataURL(file);

      }
    });
  };

  const removeImage = (id: number): void => {
    setSelectedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    }
  };

  const clearAllImages = (): void => {
    setSelectedImages([]);
  };

  const handleUploadClick = (): void => {
    // Add your upload logic here
    console.log('Uploading images:', selectedImages);
  };

  const handleCancelClick = (): void => {
    setSelectedImages([]);
  };

  return (
    <div className="bg-[#F9F9F9] rounded-2xl">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-700">
            Drop images here or click to upload
          </p>
          <p className="text-sm text-gray-500">
            Support for multiple images (PNG, JPG, GIF up to 10MB each)
          </p>
        </div>
        
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <button 
          type="button"
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Choose Images
        </button>
      </div>

      {/* Selected Images Preview */}
      {selectedImages.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Selected Images ({selectedImages.length})
            </h3>
            <button
              type="button"
              onClick={clearAllImages}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedImages.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    width={200}
                    height={200}
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                    unoptimized // Add this for data URLs
                  />
                </div>
                
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label={`Remove ${image.name}`}
                >
                  <X size={14} />
                </button>
                
                {/* Image name */}
                <p className="mt-2 text-xs text-gray-600 truncate" title={image.name}>
                  {image.name}
                </p>
              </div>
            ))}
            
            {/* Add more button */}
            <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                <Plus className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500">Add More</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Actions */}
      {selectedImages.length > 0 && (
        <div className="mt-6 flex gap-3">
          <button 
            type="button"
            onClick={handleUploadClick}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Upload {selectedImages.length} Image{selectedImages.length !== 1 ? 's' : ''}
          </button>
          <button 
            type="button"
            onClick={handleCancelClick}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}