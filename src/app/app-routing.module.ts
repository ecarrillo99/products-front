import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { ProductsComponent } from './components/products/products.component';
import { WarehouseComponent } from './components/warehouse/warehouse.component';

const routes: Routes = [
  { 
    path: '', component:  AppLayoutComponent,
    children:[
      {path: '', component:  ProductsComponent},
      {path: 'inventario', component:  ProductsComponent},
      {path: 'bodegas', component:  WarehouseComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
