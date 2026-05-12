import { HttpInterceptorFn } from '@angular/common/http';
import { API_BASE_URL } from '../config/api.config';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const isAbsoluteUrl = /^https?:\/\//i.test(req.url);

  if (isAbsoluteUrl) {
    return next(req);
  }

  const shouldPrefixApi =
    req.url.startsWith('/inventory') ||
    req.url.startsWith('/single-name') ||
    req.url.startsWith('/grid-layouts');

  if (!shouldPrefixApi) {
    return next(req);
  }

  return next(
    req.clone({
      url: `${API_BASE_URL}${req.url}`
    })
  );
};
