import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Warehouse } from '../models/warehouse.model';
import { Config } from '../global/config';
import { Service } from './service'; // Ajusta la ruta según tu estructura de carpetas
import { PageList } from '../models/global/pageList';

@Injectable()
export class WarehouseService extends Service {
    constructor(http: HttpClient) {
        super(http);
    }

    getWarehouse(query?: Record<string, any>): Promise<PageList<Warehouse[]>> {
        // Si el query no está definido, devuelve una cadena vacía.
        const queryString = query ? new URLSearchParams(query).toString() : '';
        
        // Construye la URL con o sin el query string.
        const url = queryString 
            ? `${Config.URL_SERVICES}${Config.WAREHOUSE}?${queryString}`
            : `${Config.URL_SERVICES}${Config.WAREHOUSE}`;
    
        return this.request<PageList<Warehouse[]>>('get', url) as Promise<PageList<Warehouse[]>>;
    }

    addWarehouse(product: Warehouse): Promise<Warehouse | null> {
        return this.request<Warehouse>('post', `${Config.URL_SERVICES}${Config.WAREHOUSE}`, product);
    }

    updateWarehouse(product: Warehouse): Promise<Warehouse | null> {
        return this.request<Warehouse>('put', `${Config.URL_SERVICES}${Config.WAREHOUSE}${product.id}`, product);
    }

    deleteWarehouse(id: number): Promise<number | null> {
        return this.request<number>('delete', `${Config.URL_SERVICES}${Config.WAREHOUSE}${id}`);
    }
}
