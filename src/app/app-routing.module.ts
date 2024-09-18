import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './views/product-list/product-list.component';
import { AppLayoutComponent } from './layout/app.layout.component';
import { CrudComponent } from './components/crud/crud.component';

const routes: Routes = [
  { 
    path: '', component:  AppLayoutComponent,
    children:[
      {path: '', component:  CrudComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
