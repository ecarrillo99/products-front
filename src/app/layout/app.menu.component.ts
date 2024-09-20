import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Productos',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Inventario',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/inventario']
                    },
                    {
                        label: 'Bodegas',
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/bodegas']
                    },
                ]
            }
        ];
    }
}
