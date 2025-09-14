'use client'
import React, { useRef, useState, useEffect } from 'react';
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

export default function MultipleImageUpload({ onChange }: MultipleImageUploadProps) {
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const MAX_IMAGES = 5;

  // Debugging: Log state changes
  useEffect(() => {
    console.log("Selected images:", selectedImages);
  }, [selectedImages]);

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    processFiles(files);
    e.target.value = ""; // Reset input
  };

  const processFiles = (files: File[]): void => {
    setError(null);
    
    files.forEach(file => {
      if (file.type.startsWith("image/")) {
        // Prevent duplicate files
        const isDuplicate = selectedImages.some(img => img.file === file);
        if (isDuplicate) {
          console.warn("Skipping duplicate file:", file.name);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (!e.target?.result) return;
          
          const newImage: SelectedImage = {
            id: Date.now() + Math.random(),
            file,
            url: e.target.result as string,
            name: file.name,
          };
          
          setSelectedImages(prev => {
            const totalImages = prev.length + 1;
            
            if (totalImages > MAX_IMAGES) {
              setError(`You can only upload up to ${MAX_IMAGES} images.`);
              return prev;
            }
            
            const updated = [...prev, newImage];
            onChange?.(updated.map(img => img.file));
            return updated;
          });
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (id: number): void => {
    setSelectedImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      if (updated.length < MAX_IMAGES) setError(null);
      return updated;
    });
  };

  const clearAllImages = (): void => {
    setSelectedImages([]);
    setError(null);
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

  const handleUploadClick = (): void => console.log('Uploading images:', selectedImages);
  const handleCancelClick = (): void => setSelectedImages([]);

  return (
    <div className="bg-[#F9F9F9] rounded-2xl">
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      
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
        <p className="text-lg font-medium text-gray-700">
          Drop images here or click to upload
        </p>
        <p className="text-sm text-gray-500">
          Support for multiple images (PNG, JPG, GIF up to 10MB each)
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageSelect}
          className="hidden"
        />
        
        <button
          type="button"
          onClick={handleUploadButtonClick}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
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
                    unoptimized
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
                <p className="mt-2 text-xs text-gray-600 truncate" title={image.name}>
                  {image.name}
                </p>
              </div>
            ))}
            <div
              onClick={handleUploadButtonClick}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Plus className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Add More</p>
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