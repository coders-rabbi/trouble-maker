export interface IProduct {
  _id: string;
  id: string;
  basicInfo: {
    productName: string;
    shortDescription: string;
    longDescription: string;
  };
  pricingInventory: {
    price: number;
    discountPrice: number;
    discountPercentage: number;
    sku: string;
    stockKeepingUnit: number;
    stockStatus: 'In Stock' | 'Out of Stock' | 'Low Stock'; // তোমার সব possible value অনুযায়ী union adjust করো
  };
  variation: {
    size: string[];
    color: string[];
    material: string;
  };
  media: {
    mainImage: string;
    galleryImages: string[];
    thumbnailImage: string;
  };
  organization: {
    category: string;
    searchTags: string[];
    brand: string;
  };
  advanceInfo: {
    rating: number;
    reviews: number;
    weight: string;
    dimensions: string;
    warrantyReturnPolicy: string;
  };
  createdAt: Date
  updatedAt: Date
}


export interface IProductPayload {
  id: string;
  basicInfo: {
    productName: string;
    shortDescription: string;
    longDescription: string;
  };
  pricingInventory: {
    price: number;
    discountPrice: number;
    discountPercentage: number;
    sku: string;
    stockKeepingUnit: number;
    stockStatus: 'In Stock' | 'Out of Stock' | 'Low Stock'; // তোমার সব possible value অনুযায়ী union adjust করো
  };
  variation: {
    size: string[];
    color: string[];
    material: string;
  };
  media: {
    mainImage: string;
    galleryImages: string[];
    thumbnailImage: string;
  };
  organization: {
    category: string;
    searchTags: string[];
    brand: string;
  };
  advanceInfo: {
    rating: number;
    reviews: number;
    weight: string;
    dimensions: string;
    warrantyReturnPolicy: string;
  };
}
