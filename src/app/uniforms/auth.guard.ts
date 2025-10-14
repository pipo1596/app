import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)

  const perfEntries = performance.getEntriesByType('navigation');
  let nhno = route.paramMap.get('nhno')
  let refreshed = (perfEntries.length > 0 && (perfEntries[0] as PerformanceNavigationTiming).type === 'reload') //Detect browser refreshed

  if(localStorage.getItem('UP_AUTH') || refreshed || (router.url.indexOf('/blogs/') >= 0) ) { // If navigated through app or refreshed
    return true;
  } else { // URL Tampered
    if(nhno){
    router.navigate(['uniforms/dashboard/' + route.paramMap.get('nhno')]);
    return true;
    }
    router.navigate(['uniforms/newuniform/']);
    return false;
}
};
