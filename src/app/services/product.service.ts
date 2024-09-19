import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ApiResponse } from '../models/api-response.model';
import { firstValueFrom, map } from 'rxjs';
import { Config } from '../global/config';

@Injectable()
export class ProductService {

    constructor(private http: HttpClient) { }

    async getProducts(): Promise<Product[]> {
        try {
            const response = await firstValueFrom(
                this.http.get<ApiResponse<Product[]>>(`${Config.URL_SERVICES}${Config.PRODUCTS}`).pipe( //Petición get para obtener listado de productos
                    map(response => {
                        if (response.status) {
                            return response.data; //devuelve un listado de productos
                        } else {
                            console.error(`Error: ${response.message}`);
                            return []; //Devuelve un listado vacio en caso de error
                        }
                    })
                )
            );
            return response;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return []; //Devuelve un listado vacio en caso de error
        }
    }

    async addProduct(product: Product): Promise<Product | null> {
        try {
          const response = await firstValueFrom(
            this.http.post<ApiResponse<Product>>(`${Config.URL_SERVICES}${Config.PRODUCTS}`, product).pipe( //Petición post para agregar producto
              map(response => {
                if (response.status) {
                  return response.data; // Devuelve el producto para añadir a la lista local
                } else {
                  console.error(`Error: ${response.message}`);
                  return null; // Retorna null si hubo un error
                }
              })
            )
          );
          return response;
        } catch (error) {
          console.error('Error al agregar el producto:', error);
          return null;  // Retorna null si hubo un error
        }
    }

    async updateProduct(product: Product): Promise<Product | null> {
        try {
            const response = await firstValueFrom(
                this.http.put<ApiResponse<Product>>(`${Config.URL_SERVICES}${Config.PRODUCTS}${product.id}`, product).pipe( //Petición put para actualizar producto
                    map(response => {
                        if (response.status) {
                            return response.data; // Devuelve solo el objeto data
                        } else {
                            console.error(`Error: ${response.message}`);
                            return null; // Retorna null si hubo un error
                        }
                    })
                )
            );
            return response;
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            return null; // Retorna null si hubo un error
        }
    }

    async deleteProduct(id: number): Promise<number | null> {
        try {
            const response = await firstValueFrom(
                this.http.delete<ApiResponse<number>>(`${Config.URL_SERVICES}${Config.PRODUCTS}${id}`).pipe(//Petición delete para eliminar producto
                    map(response => {
                        if (response.status) {
                            return response.data; // Devuelve el ID del producto eliminado
                        } else {
                            console.error(`Error: ${response.message}`);
                            return -1 //Devuelve -1 si no se elimina
                        }
                    })
                )
            );
            return response;
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            return -1;//Devuelve -1 si no se elimina
        }
    }    
}
