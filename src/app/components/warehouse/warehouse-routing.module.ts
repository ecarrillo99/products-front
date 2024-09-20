import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WarehouseComponent } from './warehouse.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: WarehouseComponent }
	])],
	exports: [RouterModule]
})
export class WarehouseRoutingModule { }
