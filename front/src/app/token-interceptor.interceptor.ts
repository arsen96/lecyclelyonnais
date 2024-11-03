import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {/*  */
   const token = localStorage.getItem("access_token");
   let authReq = req;
   if(token){
    // Clone the request and add the authorization header
       authReq = req.clone({
        setHeaders: {
          Authorization: `${token}`
        }
      });
   }
  

  // Pass the cloned request with the updated header to the next handler
  return next(authReq);
};

// import { Inject, Injectable, LOCALE_ID } from "@angular/core";
// import { HttpRequest, HttpHandler, HttpInterceptor } from "@angular/common/http";


// @Injectable({
// 	providedIn: "root"
// })
// export class TokenInterceptorService implements HttpInterceptor {

//   constructor(){
//     console.log("tokenInterceptor,tokenInterceptor,")
//   }
// 	intercept(req: HttpRequest<any>, next: HttpHandler) {
//   console.log("tokkeeenn")
//    let token = localStorage.getItem("access_token") as any;
//    let authReq = req;
//    if(token){
//     // Clone the request and add the authorization header
//        authReq = req.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//    }else{
//     token = req;
//    }
  

//   // Pass the cloned request with the updated header to the next handler
// 	return next.handle(token);
// 	}
// }

