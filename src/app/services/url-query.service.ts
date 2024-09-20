import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UrlQueryService {

  constructor(private router: Router, private route: ActivatedRoute) {}

  // Actualiza los parámetros de la URL con los nuevos filtros
  updateUrlQueryParams(params: any): void {
    const queryParams = { ...this.route.snapshot.queryParams, ...params };

    // Actualiza la URL sin recargar la página
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }

  // Obtener los parámetros actuales de la URL
  getUrlQueryParams(): any {
    return this.route.snapshot.queryParams;
  }

  // Obtener parámetros de la URL filtrados por nombre y tipo
  getFilterQueryParams(filters: Array<{ name: string, type: 'string' | 'number' }>): any {
    const queryParams = this.getUrlQueryParams();
    const filteredParams: any = {};

    filters.forEach((filter) => {
      if (queryParams.hasOwnProperty(filter.name)) {
        const value = queryParams[filter.name];

        // Convierte el tipo según lo especificado
        if (filter.type === 'number') {
          filteredParams[filter.name] = Number(value);
        } else {
          filteredParams[filter.name] = String(value);
        }
      }
    });

    return filteredParams;
  }
}
