import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { ColumnHeader } from 'src/app/models/global/columnHeader';
import { PaginatorHandler } from 'src/app/global/utils/paginationHandler';
import { FilterHandler } from 'src/app/global/utils/filterHandler';
import { Warehouse } from 'src/app/models/warehouse.model';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { UrlQueryService } from 'src/app/services/url-query.service';

@Component({
    templateUrl: './warehouse.component.html',
    providers: [MessageService]
})
export class WarehouseComponent implements OnInit {

    warehousePageList: PaginatorHandler<Warehouse[]>;

    warehouseFilter: FilterHandler;

    warehouseDialog: boolean = false;

    deleteWarehouseDialog: boolean = false;

    warehouses: Warehouse[] = [];

    warehouse: Warehouse = {};

    submitted: boolean = false;

    constructor(
        private warehouseService: WarehouseService,
        private urlQueryService: UrlQueryService,
        private messageService: MessageService
    ) {
        this.warehousePageList = new PaginatorHandler(this.getWarehouses.bind(this)); //Setea la respuesta del servicio a la paginación
        this.warehouseFilter = new FilterHandler();
    }

    async ngOnInit() {
        this.setTableColumns();
        await this.getData();
        this.configureObserveFilters();
        await this.setDefaultFilters();
        console.log(this.warehouses);
    }

    //Función para obtener bodegas
    async getWarehouses(query: Record<string, any>) {
        return await this.warehouseService.getWarehouse(query);
    }



    //Inicializa la paginación
    async getData() {
        try {
            await this.warehousePageList.init();
            console.log(this.warehousePageList)
        } catch (error) {
            this.showMessage('error', 'Error al obtener datos');
        }
    }

    setTableColumns() {

        const columns: ColumnHeader[] = [
            { field: 'id', header: 'Id', filterable: true, sortable: true, type: 'text' },
            { field: 'Name', header: 'Nombre', filterable: true, sortable: true, type: 'text' },
            { field: 'Description', header: 'Descripción', },
            { field: '', header: 'Acciones', },
        ];
        this.warehousePageList.setColumns(columns); //Setea las columnas al modelo
    }

    configureObserveFilters() {
        this.warehousePageList.observeFilters().subscribe((query) => {
            this.urlQueryService.updateUrlQueryParams(query);
            const filterParams = ['Id', 'Name', 'Description'];
            filterParams.forEach((key) => {
                if (query.hasOwnProperty(key)) this.warehouseFilter.setFilter(key, query[key]);
            });
        });
    }

    async setDefaultFilters() {
        const defaultFilters = await this.urlQueryService.getFilterQueryParams([
          { name: 'page', type: 'number' },
          { name: 'pageSize', type: 'number' },
        ]);
        this.warehouseFilter.setFilters(defaultFilters);
      }

    openNew() {
        this.warehouse = {};
        this.submitted = false;
        this.warehouseDialog = true;
    }

    editWarehouse(warehouse: Warehouse) {
        this.warehouse = { ...warehouse };
        this.warehouseDialog = true;
    }

    deleteWarehouse(warehouse: Warehouse) {
        this.deleteWarehouseDialog = true;
        this.warehouse = { ...warehouse };
    }

    confirmDelete() {
        this.deleteWarehouseDialog = false;
        this.warehouseService.deleteWarehouse(this.warehouse.id!).then(resp => {
            console.log(resp)
            if (resp) {
                this.warehousePageList.reload();
                this.showMessage('success', 'Bodega eliminado correctamente');
            } else {
                this.showMessage('error', 'Error al eliminar Bodega');
            }
        }).catch(error => {
            this.showMessage('error', 'Error al procesar la solicitud');
        });
        this.warehouse = {};//vacia la bodega
    }

    hideDialog() {
        this.warehouseDialog = false;
        this.submitted = false;
    }

    saveWarehouse() {
        this.submitted = true;
        // Determina si se actualizará o creará una nueva bodega
        const promise = this.warehouse.id
            ? this.warehouseService.updateWarehouse(this.warehouse) // Actualizar bodega
            : this.warehouseService.addWarehouse(this.warehouse); // Añadir nueva bodega

        // Procesa la respuesta de la promesa
        promise.then(resp => {
            if (resp) {
                if (this.warehouse.id) {
                    const index = this.warehouses.findIndex(p => p.id === resp.id); // Busca el índice de la bodega en la lista local
                    this.showMessage('success', 'Bodega actualizado correctamente');
                } else {
                    this.warehouses.push(resp); // Añade la nueva bidega a la lista local
                    this.showMessage('success', 'Bodega creado correctamente');
                }
                this.warehousePageList.reload(); // Recarga la lista de bodega paginada
            } else {
                this.showMessage('error', this.warehouse.id ? 'Error al actualizar Bodega' : 'Error al agregar Bodega');
            }
        }).catch(error => {
            this.showMessage('error', 'Error al procesar la solicitud');
        }).finally(() => {
            this.warehouses = [...this.warehouses]; // Asegura que la vista se actualice
            this.warehouseDialog = false; // Cierra el diálogo
            this.warehouse = {}; // Reinicia la bodega
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
