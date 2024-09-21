export class PageList<T> {
  constructor(
    public totalItems: number = 0,
    public items: T[] = [],
    public page: number = 1,
    public pageSize: number = 10
  ) { }
}
