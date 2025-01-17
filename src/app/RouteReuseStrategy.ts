import { Injectable } from '@angular/core';
import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false; // Don't detach any route
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    // No need to store the route as we don't plan to reuse it
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false; // Don't allow attaching to any route
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    return null; // Don't retrieve any route
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
    return false; // Always return false to prevent reuse
  }
}
