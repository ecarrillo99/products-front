import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';
import { Config } from '../global/config';
import { Service } from './service'; // Ajusta la ruta según tu estructura de carpetas
import { PageList } from '../models/global/pageList';

@Injectable()
export class ProductService extends Service {
    constructor(http: HttpClient) {
        super(http);
    }

    getProducts(query: Record<string, any>): Promise<PageList<Product[]>> {
        // Convertir la fecha a formato aaaa-mm-dd
        if (query['Created']) {
            const date = new Date(query['Created']);
            const formattedDate = date.toISOString().split('T')[0]; // Esto devuelve el formato aaaa-mm-dd
            query['Created'] = formattedDate; // Reemplaza la fecha en el objeto query
        }
    
        console.log("query", query);
        const queryString = new URLSearchParams(query).toString();
        return this.request<PageList<Product[]>>('get', `${Config.URL_SERVICES}${Config.PRODUCTS}?${queryString}`) as Promise<PageList<Product[]>>;
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
