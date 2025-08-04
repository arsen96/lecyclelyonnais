import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {/*  */
   const token = localStorage.getItem("access_token");
   let authReq = req;
   if(token){
    // Clone la requête et ajoute l'en-tête d'authentification
       authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
   }
  

  // Passe la requête clonée avec le nouvel en-tête de l'authentification au prochain gestionnaire
  return next(authReq);
};


