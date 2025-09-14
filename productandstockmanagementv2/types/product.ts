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
