"use client";
import HeaderContent from "@/components/ui/custom/HeaderContent";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Store, ArrowLeft } from "lucide-react";
import React from "react";
import MultipleImageUpload from "@/components/ui/custom/MultipleImageUpload";
import CategoryDropdownSelector from "@/components/ui/custom/products/CategorySelector";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { uploadImages } from "../../action";
import Image from "next/image";
import LoadingPage from "@/components/ui/custom/Loader";

// Type definitions
interface ProductImage {
  id: string;
  url: string;
  productId?: string;
}

interface ProductCategory {
  id: string;
  title: string;
}

interface ProductSize {
  id: string;
  size: string;
  productId: string;
}

type Inputs = {
  title: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  category: string;
  sku: string;
  sizes: string[];
  gender: "male" | "female" | "unisex";
  images: File[];
  categoryIds: string[];
  warranty: string;
  returnPolicy: string;
  shipping: string;
  brand: string;
};

interface ProductData {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  stock: number;
  sku: string;
  sizes: ProductSize[];
  gender: "male" | "female" | "unisex";
  images: ProductImage[];
  category: ProductCategory[];
  warrantyInformation: string;
  returnPolicy: string;
  shippingInformation: string;
  brand: string;
}

interface UpdateProductProps {
  productId?: string;
  initialData?: ProductData;
}

const UpdateProduct: React.FC<UpdateProductProps> = ({ initialData , productId}) => {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(!initialData);
  const [existingImages, setExistingImages] = React.useState<string[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      sizes: [],
      categoryIds: [],
      images: [],
      gender: "male",
      title: "",
      description: "",
      price: 0,
      discount: 0,
      stock: 0,
      warranty: "",
      returnPolicy: "",
      shipping: "",
      brand: "",
      category: "",
      sku: "",
    },
  });

  // Watch categoryIds to pass to CategoryDropdownSelector
  const selectedCategoryIds = watch("categoryIds");

  // Register the file input manually since it's a custom component
  const { ref, ...rest } = register('images', {
    validate: {
      fileSize: (files) => {
        if (!files || files.length === 0) return true;
        return files.every(file => file.size <= 5 * 1024 * 1024) || 'Max file size is 5MB';
      },
      fileType: (files) => {
        if (!files || files.length === 0) return true;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        return files.every(file => allowedTypes.includes(file.type)) || 'Only JPEG, PNG, and WebP images are allowed';
      },
      maxFiles: (files) => {
        if (!files) return true;
        return files.length <= 5 || 'You can upload up to 5 images';
      }
    }
  });

  // Fetch product data if not provided
  React.useEffect(() => {
    if (!initialData && id) {
      fetchProductData();
    } else if (initialData) {
      populateForm(initialData);
    }
  }, [id, initialData]);

  const fetchProductData = async (): Promise<void> => {
    if (!id) {
      toast.error('Product ID is required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product data');
      }
      const data: ProductData = await response.json();
      populateForm(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product data');
    } finally {
      setIsLoading(false);
    }
  };

  const populateForm = (data: ProductData): void => {
    console.log("Populating form with data:", data);
    
    // Set form values
    setValue("title", data.title || "");
    setValue("description", data.description || "");
    setValue("price", data.price || 0);
    setValue("discount", data.discountPercentage || 0);
    setValue("stock", data.stock || 0);
    setValue("sku", data.sku || "");
    setValue("gender", data.gender || "male");
    setValue("warranty", data.warrantyInformation || "");
    setValue("returnPolicy", data.returnPolicy || "");
    setValue("shipping", data.shippingInformation || "");
    setValue("brand", data.brand || "");
    
    // Handle sizes - extract size strings from ProductSize objects
    if (data.sizes && Array.isArray(data.sizes)) {
      const sizeStrings = data.sizes.map(sizeObj => sizeObj.size);
      setValue("sizes", sizeStrings);
      console.log("Setting sizes:", sizeStrings);
    }
    
    // Handle categories - extract category IDs
    if (data.category && Array.isArray(data.category)) {
      const categoryIds = data.category.map(cat => cat.id);
      setValue("categoryIds", categoryIds);
      // console.log("Setting category IDs:", categoryIds);
    }
    
    // Handle existing images - extract URLs and fix path if needed
    if (data.images && Array.isArray(data.images)) {
      const imageUrls = data.images.map(img => {
        // Fix image URL if it has the old path
        return img.url.replace('product-images', 'uploads');
      });
      setExistingImages(imageUrls);
      // console.log("Setting existing images:", imageUrls);
    }
    
    setIsLoading(false);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    // console.log("Form submitted with data:", data);
    setIsSubmitting(true);
    const toastId = toast.loading("Updating product...");

    try {
      let imageUrls = [...existingImages]; // Keep existing images

      // Upload new images if any
      if (data.images.length > 0) {
        const imageFormData = new FormData();
        data.images.forEach(file => {
          imageFormData.append("images", file);
        });

        // console.log("Uploading new images to Supabase...");
        
        const uploadResult = await uploadImages(imageFormData);

        if (uploadResult.error) {
          console.error("❌ Image upload failed:", uploadResult.error);
          throw new Error(`Error uploading images: ${uploadResult.error}`);
        }

        // Add new images to existing ones
        imageUrls = [...imageUrls, ...uploadResult.urls];
        console.log("✅ New images uploaded successfully. All URLs:", imageUrls);
      }

      const productData = {
        ...data,
        images: imageUrls,
        price: Number(data.price),
        discount: Number(data.discount), // Changed from discountPercentage
        stock: Number(data.stock),
        sizes: data.sizes,
        gender: data.gender,
        brand: data.brand,
        warranty: data.warranty, // Changed from warrantyInformation
        returnPolicy: data.returnPolicy,
        shipping: data.shipping, // Changed from shippingInformation
        categoryIds: data.categoryIds,
      };

      console.log('Sending JSON data to API:', productData);

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      console.log('API Response status:', res.status);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || `HTTP error ${res.status}`);
      }

      const result = await res.json();
      console.log("✅ Product updated successfully:", result);
      toast.success("Product updated successfully!", { id: toastId });
      
      router.push(`/dashboard/products/${id}`);

    } catch (err) {
      console.error('❌ Error updating product:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(`Error updating product: ${errorMessage}`, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = (): void => {
    router.back();
  };

  const removeExistingImage = (imageUrl: string): void => {
    setExistingImages(prev => prev.filter(url => url !== imageUrl));
  };


  if (isLoading) {
    return (
      <div className="h-svh flex items-center justify-center">
        <LoadingPage />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <header className="flex items-center gap-4">
        <Button
          type="button"
          onClick={handleGoBack}
          variant="outline"
          size="icon"
          className="hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </Button>
        <span>
          <Store size={30} />
        </span>
        <HeaderContent title="Update Product" />
      </header>

      <main>
        <form
          className="flex justify-between gap-6 lg:gap-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex-1">
            {/* Information */}
            <div className="bg-[#F9F9F9] p-8 rounded-2xl mt-8">
              <h1 className="text-xl font-semibold pb-8 md:pb-12">
                General Information
              </h1>

              {/* Product Name */}
              <div>
                <Label className="text-md pb-2 font-semibold">
                  Name Product *
                </Label>
                <input
                  {...register("title", { required: "Product title is required" })}
                  type="text"
                  placeholder="Enter product title"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && (
                  <span className="text-red-500 text-sm">
                    {errors.title.message}
                  </span>
                )}
              </div>

              {/* SKU (Read-only for updates) */}
              <div className="mt-4">
                <Label className="text-md pb-2 font-semibold">
                  SKU (Product Code)
                </Label>
                <input
                  {...register("sku")}
                  type="text"
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  SKU cannot be modified after product creation
                </p>
              </div>

              {/* Description */}
              <div className="mt-4">
                <Label className="text-md pb-2 font-semibold">
                  Product Description *
                </Label>
                <Textarea
                  {...register("description", { required: "Description is required" })}
                  className="border-0 outline-0 focus:outline-0 focus:border-0 focus:ring-0 bg-[#EFEFEF]"
                  placeholder="Write the descriptions about the products..."
                />
                {errors.description && (
                  <span className="text-red-500 text-sm">
                    {errors.description.message}
                  </span>
                )}
              </div>

              {/* Size and Gender */}
              <div className="flex items-start justify-between gap-8">
                <div className="mt-4 flex-1">
                  <Label className="text-md pb-1 font-semibold">Size</Label>
                  <p className="text-sm font-light pb-2 text-gray-600">
                    Pick the available sizes
                  </p>
                  <Controller
                    name="sizes"
                    control={control}
                    render={({ field }) => (
                      <div className="flex gap-4 mt-4 flex-wrap">
                        {["XS", "S", "M", "XL", "XXL"].map((size) => (
                          <label key={size} className="cursor-pointer">
                            <input
                              type="checkbox"
                              value={size}
                              checked={field.value.includes(size)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  field.onChange([...field.value, size]);
                                } else {
                                  field.onChange(field.value.filter(s => s !== size));
                                }
                              }}
                              className="peer hidden"
                            />
                            <span className="px-6 py-4 rounded-xl font-semibold bg-[#EFEFEF] shadow-sm peer-checked:bg-black peer-checked:text-white transition-all">
                              {size === "S" ? "SM" : size}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  />
                </div>

                <div className="mt-4 flex-1">
                  <Label className="text-md pb-1 font-semibold">Gender *</Label>
                  <p className="text-sm font-light pb-2 text-gray-600">
                    Pick the target gender
                  </p>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: "Gender is required" }}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male">Male</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female">Female</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="unisex" id="unisex" />
                          <Label htmlFor="unisex">Unisex</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                  {errors.gender && (
                    <span className="text-red-500 text-sm">
                      {errors.gender.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Price and Stock */}
            <div className="bg-[#F9F9F9] p-8 rounded-2xl mt-8">
              <h1 className="text-xl font-semibold pb-8 md:pb-12">
                Price and Stock
              </h1>

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Label className="text-md pb-2 font-semibold">
                    Base Price *
                  </Label>
                  <input
                    {...register("price", {
                      required: "Price is required",
                      min: { value: 0, message: "Price must be positive" },
                    })}
                    type="number"
                    placeholder="0"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.price && (
                    <span className="text-red-500 text-sm">
                      {errors.price.message}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <Label className="text-md pb-2 font-semibold">Stock *</Label>
                  <input
                    {...register("stock", {
                      required: "Stock is required",
                      min: { value: 0, message: "Stock must be positive" },
                    })}
                    type="number"
                    placeholder="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.stock && (
                    <span className="text-red-500 text-sm">
                      {errors.stock.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 mt-4">
                <div className="flex-1">
                  <Label className="text-md pb-2 font-semibold">
                    Discount (%)
                  </Label>
                  <input
                    {...register("discount", {
                      min: { value: 0, message: "Discount must be positive" },
                      max: {
                        value: 100,
                        message: "Discount cannot exceed 100%",
                      },
                    })}
                    type="number"
                    placeholder="0"
                    step="0.01"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.discount && (
                    <span className="text-red-500 text-sm">
                      {errors.discount.message}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <Label className="text-md pb-2 font-semibold">Brand *</Label>
                  <input
                    {...register("brand", { required: "Brand is required" })}
                    type="text"
                    placeholder="Enter brand name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.brand && (
                    <span className="text-red-500 text-sm">
                      {errors.brand.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Warranty and Shipping */}
            <div className="bg-[#F9F9F9] p-8 rounded-2xl mt-8">
              <h1 className="text-xl font-semibold pb-8 md:pb-12">
                Warranty and Shipping
              </h1>

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Label className="text-md pb-2 font-semibold">
                    Warranty
                  </Label>
                  <input
                    {...register("warranty")}
                    type="text"
                    placeholder="e.g., 1 year warranty"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-md pb-2 font-semibold">
                    Shipping *
                  </Label>
                  <input
                    {...register("shipping", { required: "Shipping info is required" })}
                    type="text"
                    placeholder="e.g., Free shipping"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.shipping && (
                    <span className="text-red-500 text-sm">
                      {errors.shipping.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start justify-between gap-4 mt-4">
                <div className="flex-1">
                  <Label className="text-md pb-2 font-semibold">
                    Return Policy *
                  </Label>
                  <input
                    {...register("returnPolicy", { required: "Return policy is required" })}
                    type="text"
                    placeholder="e.g., 30 days return policy"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.returnPolicy && (
                    <span className="text-red-500 text-sm">
                      {errors.returnPolicy.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Images and Actions */}
          <div className="w-96">
            <div className="gap-4 flex mb-6">
              <Button
                type="button"
                onClick={handleGoBack}
                className="flex-1 hover:border-2 border-gray-400 font-semibold cursor-pointer hover:border-gray-600 bg-white text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-400 text-white font-semibold cursor-pointer hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Update Product"}
              </Button>
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="bg-[#F9F9F9] p-6 rounded-2xl mb-6">
                <h1 className="text-xl font-semibold pb-6">Current Images</h1>
                <div className="grid grid-cols-2 gap-3">
                  {existingImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <Image
                        width={200}
                        height={200}
                        src={imageUrl}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                        onError={(e) => {
                          console.error(`Failed to load image: ${imageUrl}`);
                          // Optional: Set a placeholder image
                          // e.currentTarget.src = '/placeholder-image.jpg';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(imageUrl)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Images */}
            <div className="bg-[#F9F9F9] p-6 rounded-2xl">
              <h1 className="text-xl font-semibold pb-6">Add New Images</h1>
              <div className="mb-6">
                <MultipleImageUpload
                  onChange={(files) => {
                    console.log("New images selected:", files);
                    setValue("images", files, { shouldValidate: true });
                  }}
                />
                {errors.images && (
                  <span className="text-red-500 text-sm">
                    {errors.images.message}
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Update Category</h2>
                <CategoryDropdownSelector
                  selectedCategories={selectedCategoryIds}
                  onChange={(categories) => {
                    console.log("Categories selected:", categories);
                    setValue("categoryIds", categories, {
                      shouldValidate: true,
                    });
                  }}
                />
                {errors.categoryIds && (
                  <span className="text-red-500 text-sm">
                    {errors.categoryIds.message}
                  </span>
                )}
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default UpdateProduct;