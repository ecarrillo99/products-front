import { Component, Input } from '@angular/core';
import { ColumnHeader } from 'src/app/models/global/columnHeader';

@Component({
  selector: '[app-table-header-component]',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss']
})
export class TableHeaderComponent {
  @Input() columns: ColumnHeader[] = [];
  @Input() paginator: any;
  @Input() dt: any;
}
