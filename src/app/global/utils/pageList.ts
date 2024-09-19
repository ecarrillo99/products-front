export class PageList<T> {
    constructor(
      public totalItems: number = 0,
      public items: T[] = []
    ) {}
  }
  