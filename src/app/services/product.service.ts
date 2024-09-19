import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ApiResponse } from '../models/api-response.model';
import { firstValueFrom, map } from 'rxjs';
import { Config } from '../global/config';

@Injectable()
export class ProductService {

    constructor(private http: HttpClient) { }

    getProductsSmall() {
        return this.http.get<any>('assets/demo/data/products-small.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    async getProducts(): Promise<Product[]> {
        try {
          const response = await firstValueFrom(
            this.http.get<ApiResponse<Product[]>>(`${Config.URL_SERVICES}${Config.PRODUCTS}`).pipe(
              map(response => {
                if (response.status) {
                  return response.data;
                } else {
                  console.error(`Error: ${response.message}`);
                  return [];
                }
              })
            )
          );
          return response;
        } catch (error) {
          console.error('Error al obtener productos:', error);
          return [];
        }
      }

    getProductsMixed() {
        return this.http.get<any>('assets/demo/data/products-mixed.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }

    getProductsWithOrdersSmall() {
        return this.http.get<any>('assets/demo/data/products-orders-small.json')
            .toPromise()
            .then(res => res.data as Product[])
            .then(data => data);
    }
}
