export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'OUT_OF_STOCK' | 'DISCONTINUED';
export type ProductCategory = 'ELETRONICS' | 'CLOTHING' | 'HOME_GOODS' | 'BOOKS';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  createdAt: string;
  status: ProductStatus;
  category: ProductCategory;
  image?: string;
}

export interface ProductRequestDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  status: ProductStatus;
  category: ProductCategory;
  image?: string;
}

export interface ResponsePage<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
  numberOfElements: number;
}