import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from '../../services/product.service';
import { ColumnHeader } from 'src/app/models/global/columnHeader';
import { PaginatorHandler } from 'src/app/global/utils/paginationHandler';
import { FilterHandler } from 'src/app/global/utils/filterHandler';

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

    product: Product = {};

    selectedProducts: Product[] = [];

    submitted: boolean = false;

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private productService: ProductService, private messageService: MessageService) {
        this.productsPageList = new PaginatorHandler(this.getProducts.bind(this)); //Setea la respuesta del servicio a la paginación
        this.productsFilter = new FilterHandler();
    }

    async ngOnInit() {
        this.setTableColumns();
        await this.getData();
    }

    //Función para obtener productos
    async getProducts() {
        return await this.productService.getProducts();
    }

    //Inicializa la paginación
    async getData() {
        try {
          await this.productsPageList.init();
        } catch (error) {
            this.showMessage('error', 'Error al obtener datos');
        }
    }

    setTableColumns() {

        const columns: ColumnHeader[] = [
            { field: 'id', header: 'Id', filterable: false, },
            { field: 'name', header: 'Nombre', filterable: true },
            { field: 'description', header: 'Descripción' },
            { field: 'price', header: 'Precio', filterable: true },
            { field: 'stock', header: 'Stock', filterable: true },
            { field: '', header: 'Acciones', filterable: false },
        ];
        this.productsPageList.setColumns(columns); //Setea las columnas al modelo
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(val => !this.selectedProducts.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        this.selectedProducts = [];
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

        const promise = this.product.id
            ? this.productService.updateProduct(this.product) // Actualizar producto
            : this.productService.addProduct(this.product); // Añadir nuevo producto

        promise.then(resp => {
            if (resp) {
                if (this.product.id) {
                    const index = this.products.findIndex(p => p.id === resp.id);//Busca el indice del producto en la lista local
                    this.showMessage('success', 'Producto actualizado correctamente');
                } else {
                    this.showMessage('success', 'Producto creado correctamente');
                }
                this.productsPageList.reload();
            } else {
                this.showMessage('error', this.product.id ? 'Error al actualizar Producto' : 'Error al agregar Producto');
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
