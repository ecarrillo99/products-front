import { Warehouse } from "./warehouse.model";

export interface Product {
    id?: number;
    name?: string;
    description?: string;
    price?:number;
    stock?: number;
    idWarehouse?:number;
    warehouse?:Warehouse;
}