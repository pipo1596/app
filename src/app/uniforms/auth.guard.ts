import { CanActivateFn, CanDeactivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { VasApplicationsComponent } from '../uniforms/vas-applications/vas-applications.component'; 

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const perfEntries = performance.getEntriesByType('navigation');
  let nhno = route.paramMap.get('nhno');
  let refreshed = (perfEntries.length > 0 && (perfEntries[0] as PerformanceNavigationTiming).type === 'reload');

  const viaHistory = router.getCurrentNavigation()?.trigger === 'popstate';
  const needs = route.data['needs'] as string[] | undefined;
  const hasFlowState = !needs || needs.some(key => !!localStorage.getItem(key));

  if (localStorage.getItem('UP_AUTH') || refreshed || (viaHistory && hasFlowState) || (router.url.indexOf('/blogs/') >= 0)) {
    return true;
  } else {
    if (nhno) {
      router.navigate(['uniforms/dashboard/' + route.paramMap.get('nhno')]);
      return true;
    }
    router.navigate(['uniforms/newuniform/']);
    return false;
  }
};

export const saveOnLeaveGuard: CanDeactivateFn<VasApplicationsComponent> = (component): Observable<boolean> => {
  return component.saveExpanded();
};