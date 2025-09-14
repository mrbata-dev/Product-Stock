'use client'
import React, { useEffect, useState } from 'react';
import { Plus, Check, ChevronDown, X, Tag } from 'lucide-react';

interface CategoryDropdownSelectorProps {
  onChange?: (categories: string[]) => void; 
}


interface Category {
  id: string; 
  title: string; 
}

export default function CategoryDropdownSelector({onChange} : CategoryDropdownSelectorProps)  {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); 
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleCategory = (categoryId: string): void => {
    setSelectedCategories(prev => {
      const newState = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];
      onChange?.(newState);
      return newState;
    });
  };

  // Fetch categories function
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e?: React.FormEvent): Promise<void> => {
    if (e) {
      e.preventDefault(); // Prevent form submission
      e.stopPropagation();
    }

    if (!newCategoryName.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // console.log('Sending request to add category:', newCategoryName.trim());
      
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newCategoryName.trim(),
        }),
      });

      // console.log('Response status:', res.status);
      const data = await res.json();
      // console.log('Response data:', data);

      if (!res.ok) {
        setError(data.error || 'Failed to add category');
        return;
      }

      // Ensure the response has the expected structure
      if (!data.id || !data.title) {
        console.error('Invalid response structure:', data);
        setError('Invalid response from server');
        return;
      }

      // Update local state immediately with the new category
      // console.log('Adding category to local state:', data);
      setCategories(prev => {
        const updated = [...prev, data];
        console.log('Updated categories:', updated);
        return updated;
      });

      // Auto-select the newly created category
      setSelectedCategories(prev => {
        const newState = [...prev, data.id];
        // console.log('Updated selected categories:', newState);
        onChange?.(newState);
        return newState;
      });

      // Reset form
      setNewCategoryName('');
      setShowAddForm(false);
      setError('');
      // console.log('Category added successfully');
      
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const removeSelectedCategory = (categoryId: string): void => {
    setSelectedCategories(prev => {
      const newState = prev.filter(id => id !== categoryId);
      onChange?.(newState);
      return newState;
    });
  };

  const cancelAddCategory = (): void => {
    setShowAddForm(false);
    setNewCategoryName('');
    setError('');
  };

  const getSelectedCategoriesText = (): string => {
    if (selectedCategories.length === 0) return 'Select categories...';
    if (selectedCategories.length === 1) {
      const category = categories.find(cat => cat.id === selectedCategories[0]);
      return category?.title || '';
    }
    return `${selectedCategories.length} categories selected`;
  };

  const handleDropdownToggle = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCategoryToggle = (e: React.MouseEvent<HTMLButtonElement>, categoryId: string): void => {
    e.preventDefault();
    toggleCategory(categoryId);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCategory();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelAddCategory();
    }
  };

  return (
    <div className="bg-[#F9F9F9] p-8 rounded-2xl mt-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Select Categories
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Choose categories that best describe your content
          </p>
        </div>
        {/* Dropdown Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={handleDropdownToggle}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
          >
            <span className={selectedCategories.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
              {getSelectedCategoriesText()}
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {/* Add Category Section */}
              {!showAddForm ? (
                <div className="p-3 border-b border-gray-100">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAddForm(true);
                      setError(''); // Clear any previous errors
                    }}
                    className="w-full flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-md transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Category
                  </button>
                </div>
              ) : (
                <div className="p-3 border-b border-gray-100">
                  <div className="space-y-3">
                    {error && (
                      <div className="text-red-600 text-xs bg-red-50 p-2 rounded">
                        {error}
                      </div>
                    )}
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => {
                        setNewCategoryName(e.target.value);
                        setError('');
                      }}
                      onKeyDown={handleInputKeyDown}
                      placeholder="Enter category name..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      autoFocus
                      disabled={isLoading}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddCategory}
                        disabled={isLoading || !newCategoryName.trim()}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check className="w-3 h-3" />
                        {isLoading ? 'Adding...' : 'Add'}
                      </button>
                      <button
                        type="button"
                        onClick={cancelAddCategory}
                        disabled={isLoading}
                        className="flex items-center gap-1 bg-gray-500 text-white px-3 py-1.5 rounded-md hover:bg-gray-600 transition-colors text-sm disabled:opacity-50"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Categories List */}
              <div className="py-2" role="listbox">
                {categories.length === 0 && !isLoading ? (
                  <div className="px-4 py-2 text-sm text-gray-500 text-center">
                    No categories found
                  </div>
                ) : (
                  categories.map((category) => {
                    const isSelected = selectedCategories.includes(category.id);
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={(e) => handleCategoryToggle(e, category.id)}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between group transition-colors"
                        role="option"
                        aria-selected={isSelected}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium `}>
                            {category.title}
                          </span>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
        {/* Selected Categories Display */}
        {selectedCategories.length > 0 && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Selected Categories ({selectedCategories.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map((categoryId) => {
                const category = categories.find(cat => cat.id === categoryId);
                if (!category) return null;
                return (
                  <div
                    key={categoryId}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800`}
                  >
                    {category.title}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeSelectedCategory(categoryId);
                      }}
                      className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${category.title} category`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategories([]);
                onChange?.([]);
              }}
              className="mt-3 text-xs text-red-500 hover:text-red-700 font-medium"
            >
              Clear all selections
            </button>
          </div>
        )}
        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button 
            type="button"
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={selectedCategories.length === 0}
          >
            Continue with {selectedCategories.length} Categor{selectedCategories.length !== 1 ? 'ies' : 'y'}
          </button>
        </div>
      </div>
      {/* Backdrop to close dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}