import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Config } from '../global/config';
import { Service } from './service'; // Ajusta la ruta según tu estructura de carpetas

@Injectable()
export class ProductService extends Service {
    constructor(http: HttpClient) {
        super(http);
    }

    getProducts(): Promise<Product[]> {
        return this.request<Product[]>('get', `${Config.URL_SERVICES}${Config.PRODUCTS}`) as Promise<Product[]>;
    }

    addProduct(product: Product): Promise<Product | null> {
        return this.request<Product>('post', `${Config.URL_SERVICES}${Config.PRODUCTS}`, product);
    }

    updateProduct(product: Product): Promise<Product | null> {
        return this.request<Product>('put', `${Config.URL_SERVICES}${Config.PRODUCTS}${product.id}`, product);
    }

    deleteProduct(id: number): Promise<number | null> {
        return this.request<number>('delete', `${Config.URL_SERVICES}${Config.PRODUCTS}${id}`);
    }
}
