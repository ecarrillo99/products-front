import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ProductService } from '../../services/product.service';

@Component({
    templateUrl: './crud.component.html',
    providers: [MessageService]
})
export class CrudComponent implements OnInit {

    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[] = [];

    product: Product = {};

    selectedProducts: Product[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private productService: ProductService, private messageService: MessageService) { }

    ngOnInit() {
        this.productService.getProducts().then(data => this.products = data);

        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];

        this.statuses = [
            { label: 'INSTOCK', value: 'instock' },
            { label: 'LOWSTOCK', value: 'lowstock' },
            { label: 'OUTOFSTOCK', value: 'outofstock' }
        ];
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
            if (resp) {
                this.products = this.products.filter(p => p.id !== resp); // Elimina el producto de la lista
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
                    const index =  this.products.findIndex(p => p.id === resp.id);//Busca el indice del producto en la lista local
                    if (index !== -1) {
                        this.products[index] = resp; // Actualiza el producto en la lista
                    }
                    this.showMessage('success', 'Producto actualizado correctamente');
                } else {
                    this.products.push(resp); // Agrega el nuevo producto
                    this.showMessage('success', 'Producto creado correctamente');
                }
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
    

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
