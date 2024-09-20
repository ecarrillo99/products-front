import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductListComponent } from './views/product-list/product-list.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { CrudModule } from './components/crud/crud.module';
import { TableHeaderComponent } from './components/global/table-header/table-header.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    TableHeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppLayoutModule,
    CrudModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports:[TableHeaderComponent]
})
export class AppModule { }
