import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const document = inject(DOCUMENT);
  const localStorage = document.defaultView?.localStorage;
  const token = localStorage?.getItem('token');

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        'x-auth-token': `Bearer ${token}`
      }
    });
    return next(authReq);
  }
  return next(req);
};