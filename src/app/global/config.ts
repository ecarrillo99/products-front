export class Config {
    // Url de servicios
    static get URL_SERVICES(): string {
        return "http://localhost:5044/api";
    }

    static get PRODUCTS(): string {
        return "/Products/";
    }

    static get WAREHOUSE(): string {
        return "/Warehouse/";
    }
}