import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {/*  */
   const token = localStorage.getItem("access_token");
   let authReq = req;
   if(token){
    // Clone the request and add the authorization header
       authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
   }
  

  // Pass the cloned request with the updated header to the next handler
  return next(authReq);
};


