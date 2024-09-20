import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './views/product-list/product-list.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { CrudModule } from './components/crud/crud.module';
import { WarehouseModule } from './components/warehouse/warehouse.module';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppLayoutModule,
    CrudModule,
    WarehouseModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
