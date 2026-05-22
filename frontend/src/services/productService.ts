import type { Product, ProductRequestDto, ResponsePage } from '../types/product';

const BASE_URL = 'http://localhost:8080/api/v1';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Erro ${response.status}: ${message}`);
  }
  return response.json() as Promise<T>;
}

export const productService = {

  getAll: (page = 0, size = 12): Promise<ResponsePage<Product>> =>
    fetch(`${BASE_URL}/products?page=${page}&size=${size}&sort=name`)
      .then(res => handleResponse<ResponsePage<Product>>(res)),

  getByName: (name: string): Promise<Product> =>
    fetch(`${BASE_URL}/products/search?name=${encodeURIComponent(name)}`)
      .then(res => handleResponse<Product>(res)),

  create: (dto: ProductRequestDto): Promise<Product> =>
    fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    }).then(res => handleResponse<Product>(res)),

  update: (id: string, dto: ProductRequestDto): Promise<Product> =>
    fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    }).then(res => handleResponse<Product>(res)),

  patch: (id: string, dto: Partial<ProductRequestDto>): Promise<Product> =>
    fetch(`${BASE_URL}/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    }).then(res => handleResponse<Product>(res)),

  delete: (id: string): Promise<void> =>
    fetch(`${BASE_URL}/products/${id}`, { method: 'DELETE' })
      .then(res => { if (!res.ok) throw new Error(`Erro ${res.status}`); }),
};