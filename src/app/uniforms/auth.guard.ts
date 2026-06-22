import { CanActivateFn, CanDeactivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { VasApplicationsComponent } from '../uniforms/vas-applications/vas-applications.component'; // adjust path

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const perfEntries = performance.getEntriesByType('navigation');
  let nhno = route.paramMap.get('nhno');
  let refreshed = (perfEntries.length > 0 && (perfEntries[0] as PerformanceNavigationTiming).type === 'reload');

  if (localStorage.getItem('UP_AUTH') || refreshed || (router.url.indexOf('/blogs/') >= 0)) {
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

export const saveOnLeaveGuard: CanDeactivateFn<VasApplicationsComponent> = (component) => {
  component.onLeavePage();
  return true;
};