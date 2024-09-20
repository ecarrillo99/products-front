import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from '../../services/product.service';
import { ColumnHeader } from 'src/app/models/global/columnHeader';
import { PaginatorHandler } from 'src/app/global/utils/paginationHandler';
import { FilterHandler } from 'src/app/global/utils/filterHandler';
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { UrlQueryService } from 'src/app/services/url-query.service';

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService]
})
export class CrudComponent implements OnInit {

    productsPageList: PaginatorHandler<Product[]>;

    productsFilter: FilterHandler;

    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[] = [];

    warehouses: Warehouse[] = [];

    product: Product = {};



    selectedProducts: Product[] = [];

    submitted: boolean = false;

    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private productService: ProductService,
        private warehouseService: WarehouseService,
        private urlQueryService: UrlQueryService,
        private messageService: MessageService
    ) {
        this.productsPageList = new PaginatorHandler(this.getProducts.bind(this)); //Setea la respuesta del servicio a la paginación
        this.productsFilter = new FilterHandler();
    }

    async ngOnInit() {
        this.setTableColumns();
        this.getWarehouses();
        await this.getData();
        this.configureObserveFilters();
        await this.setDefaultFilters();
        console.log(this.warehouses);
    }

    //Función para obtener productos
    async getProducts(query: Record<string, any>) {
        return await this.productService.getProducts(query);
    }

    //Función para obtener bodegas
    async getWarehouses() {
        this.warehouseService.getWarehouse().then(resp => {
            if (resp) {
                this.warehouses = resp.items.flat();
            }
        });

    }

    //Inicializa la paginación
    async getData() {
        try {
            await this.productsPageList.init();
            console.log(this.productsPageList)
        } catch (error) {
            this.showMessage('error', 'Error al obtener datos');
        }
    }

    setTableColumns() {

        const columns: ColumnHeader[] = [
            { field: 'id', header: 'Id', filterable: true, sortable: true, type: 'text' },
            { field: 'name', header: 'Nombre', filterable: true, sortable: true, type: 'text' },
            { field: 'description', header: 'Descripción', },
            { field: 'price', header: 'Precio', filterable: true, sortable: true, type: 'numeric' },
            { field: 'stock', header: 'Stock', filterable: true, sortable: true, type: 'numeric' },
            { field: 'warehouse', header: 'Bodega', filterable: false, sortable: true, type: 'text' },
            { field: '', header: 'Acciones', },
        ];
        this.productsPageList.setColumns(columns); //Setea las columnas al modelo
    }

    configureObserveFilters() {
        this.productsPageList.observeFilters().subscribe((query) => {
            this.urlQueryService.updateUrlQueryParams(query);
            const filterParams = ['Id', 'Name', 'Price', 'Stock', 'idWarehouse', 'direccion'];
            filterParams.forEach((key) => {
                if (query.hasOwnProperty(key)) this.productsFilter.setFilter(key, query[key]);
            });
        });
    }

    async setDefaultFilters() {
        const defaultFilters = await this.urlQueryService.getFilterQueryParams([
          { name: 'page', type: 'number' },
          { name: 'pageSize', type: 'number' },
        ]);
        this.productsFilter.setFilters(defaultFilters);
      }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.productService.deleteProduct(this.product.id!).then(resp => {
            console.log(resp)
            if (resp) {
                this.productsPageList.reload();
                this.showMessage('success', 'Producto eliminado correctamente');
            } else {
                this.showMessage('error', 'Error al eliminar Producto');
            }
        }).catch(error => {
            this.showMessage('error', 'Error al procesar la solicitud');
        });
        this.product = {};//vacia el producto
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        // Asigna solo el idWarehouse antes de realizar la solicitud
        const productToSave = {
            ...this.product,
            idWarehouse: this.product.warehouse?.id, // Asigna solo el id de la bodega seleccionada
        };
        delete productToSave.warehouse; //Se elimina warehouse que no es necesario para guardar

        // Determina si se actualizará o creará un nuevo producto
        const promise = productToSave.id
            ? this.productService.updateProduct(productToSave) // Actualizar producto
            : this.productService.addProduct(productToSave); // Añadir nuevo producto

        // Procesa la respuesta de la promesa
        promise.then(resp => {
            if (resp) {
                if (productToSave.id) {
                    const index = this.products.findIndex(p => p.id === resp.id); // Busca el índice del producto en la lista local
                    this.products[index] = { ...resp }; // Actualiza el producto en la lista
                    this.showMessage('success', 'Producto actualizado correctamente');
                } else {
                    this.products.push(resp); // Añade el nuevo producto a la lista local
                    this.showMessage('success', 'Producto creado correctamente');
                }
                this.productsPageList.reload(); // Recarga la lista de productos paginada
            } else {
                this.showMessage('error', productToSave.id ? 'Error al actualizar Producto' : 'Error al agregar Producto');
            }
        }).catch(error => {
            this.showMessage('error', 'Error al procesar la solicitud');
        }).finally(() => {
            this.products = [...this.products]; // Asegura que la vista se actualice
            this.productDialog = false; // Cierra el diálogo
            this.product = {}; // Reinicia el producto
        });
    }


    // Función para mostrar mensajes
    private showMessage(severity: 'success' | 'error', detail: string) {
        this.messageService.add({ severity, summary: severity === 'success' ? 'Correcto' : 'Error', detail, life: 3000 });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
