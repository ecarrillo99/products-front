import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, firstValueFrom, map, Observable, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { ApiResponse } from '../models/api-response.model';
import { Config } from '../global/config';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    constructor(private http: HttpClient) { }

    //Listar productos 
    //Config.URL_SERVICES -> URL base de servicios
    //Config.PRODUCTS -> ruta para servicios de Productos
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
}
