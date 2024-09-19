import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';

@Injectable()
export class Service {
    constructor(protected http: HttpClient) {}

    protected handleResponse<T>(response: ApiResponse<T>): T | null {
        if (response.status) {
            return response.data;
        } else {
            console.error(`Error: ${response.message}`);
            return null;
        }
    }

    protected async request<T>(
        method: 'get' | 'post' | 'put' | 'delete',
        url: string,
        body?: any
    ): Promise<T | null> {
        try {
            const response = await firstValueFrom(
                this.getHttpMethod(method)(url, body).pipe(
                    map(this.handleResponse)
                )
            ) as T;

            return response; // Retorna el resultado sin manipular
        } catch (error) {
            console.error(`Error en la petición ${method}:`, error);
            return null; // Retorna null en caso de error
        }
    }

    private getHttpMethod(method: 'get' | 'post' | 'put' | 'delete') {
        const methods: { [key: string]: Function } = {
            get: (url: string) => this.http.get<ApiResponse<any>>(url),
            post: (url: string, body: any) => this.http.post<ApiResponse<any>>(url, body),
            put: (url: string, body: any) => this.http.put<ApiResponse<any>>(url, body),
            delete: (url: string) => this.http.delete<ApiResponse<any>>(url),
        };
        return methods[method];
    }
}
