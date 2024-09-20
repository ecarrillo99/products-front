export interface ColumnHeader {
    field: string;
    header: string;
    sortable?: boolean;
    filterable?: boolean;
    filterMatchMode?: string;
    type?:string;
    width?: string;
}
  