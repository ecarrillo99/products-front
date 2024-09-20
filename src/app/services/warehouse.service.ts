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

    getWarehouse(): Promise<PageList<Warehouse[]>> {
        return this.request<PageList<Warehouse[]>>('get', `${Config.URL_SERVICES}${Config.WAREHOUSE}`) as Promise<PageList<Warehouse[]>>;
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
