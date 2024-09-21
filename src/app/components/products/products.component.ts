import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../services/product.service';
import { ColumnHeader } from 'src/app/models/global/columnHeader';
import { PaginatorHandler } from 'src/app/global/utils/paginationHandler';
import { FilterHandler } from 'src/app/global/utils/filterHandler';
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { UrlQueryService } from 'src/app/services/url-query.service';

@Component({
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss'],
    providers: [MessageService]
})
export class ProductsComponent implements OnInit {

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
    }

    //Función para obtener productos
    async getProducts(query: Record<string, any>) {
        // Obtiene los filtros actuales
        const filters = this.productsFilter.getFilters();
    
        // Combina los filtros y la consulta
        const combinedQuery = { ...query, ...filters };
    
        return await this.productService.getProducts(combinedQuery);
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
        } catch (error) {
            this.showMessage('error', 'Error al obtener datos');
        }
    }

    //Seteo de columnas, junto a propiedades de ordenamiento, filtrado, tipo y ancho
    setTableColumns() {
        const columns: ColumnHeader[] = [
            { field: 'Id', header: 'Id',  sortable: true, type: 'text', width:"5%" },
            { field: 'Name', header: 'Nombre', filterable: true,  type: 'text', width:"13%" },
            { field: 'Description', header: 'Descripción',type: 'text', filterable: true, width:"13%"},
            { field: 'Price', header: 'Precio', filterable: false,  type: 'numeric', width:"13%" },
            { field: 'Stock', header: 'Stock', filterable: true,  type: 'numeric', width:"13%" },
            { field: 'Created', header: 'Ingreso', filterable: true, type: 'date', width:"13%" },
            { field: 'IdWarehouse', header: 'Bodega', filterable: true, type: 'select', width:"13%" },
            { field: '', header: 'Acciones', width:"17%"  },
        ];
        this.productsPageList.setColumns(columns); 
    }

    //Configuracion de filtros en Url
    configureObserveFilters() {
        this.productsPageList.observeFilters().subscribe((query) => {
            this.urlQueryService.updateUrlQueryParams(query);
        });
    }

    //Definir filtros por defecto al cargar urls
    async setDefaultFilters() {
        const defaultFilters = await this.urlQueryService.getFilterQueryParams([
            { name: 'page', type: 'number' },
            { name: 'pageSize', type: 'number' },
            { name: 'IdWarehouse', type: 'string' },
            { name: 'Created', type: 'string' },
            { name: 'Stock', type: 'number' },
            { name: 'Price', type: 'number' },
            { name: 'Description', type: 'string' }
        ]);
    
        this.productsFilter.setFilters(defaultFilters);
        await this.getData();
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    editProduct(product: Product) {
        console.log(product);
        this.product = { ...product };
        this.product.created = new Date(this.product.created!);
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.productService.deleteProduct(this.product.id!).then(resp => {
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

    onDateFilter(event: any) {
        const query = {
            // Asume que el evento contiene el valor filtrado
            [event.field]: event.value,
        };
    
        this.productsPageList.next({ filters: query }); // Asume que tienes un método para manejar la paginación y filtros
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
}
