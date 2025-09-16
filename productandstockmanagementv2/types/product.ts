export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  stock: number;
  sku: string;
  shippingInformation: string;
  returnPolicy: string;
  images: { id: string; url: string }[];
  category: { id: string; title: string }[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
};

export type ProductPreview = Omit<Product, 'shippingInformation' | 'returnPolicy'>;

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
}

export interface ProductCategory {
  id: string;
  title: string;
  slug?: string;
}

// export interface Product {
//   id: string;
//   title: string;
//   price: number;
//   category: ProductCategory[];
//   stock: number;
//   images: ProductImage[];
//   slug: string;
//   sku: string;
//   discountPercentage: number;
//   createdAt: Date; // Fixed typo: createAt -> createdAt
//   updatedAt: Date; // Fixed typo: updateAt -> updatedAt
// }

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalCount: number;
  pageSize?: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationInfo;
}