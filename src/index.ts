// import { Kernel } from './core/kernel';
// import { Router } from './core/routing/router';
//
// const kernel = new Kernel();
// kernel.initApp();
//
// const router = Router.getInstance([
//     // TODO : put your routes here
// ]);
//
// // router!.navigate(url);
//
// const url = window.location.pathname;
//
// window.addEventListener('popstate', () => {
//     router!.navigate(url);
// });

export { Router } from './core/routing/router';
export { Route } from './core/routing/route';
export { ViewModel } from './core/component/view.model';
export { FS } from './core/utiles/FS';




//////////////////////////////////////   Decorator pattern. Must be implemented   //////////////////////////////////////
//
//
// type a = {
//     htmlFile?:string,
//     cssFile?: string,
//     template?: string,
// }
//
// function Component(options: a) {
//     return function (target: typeof aa) {
//         if (options['template']) {
//             document.body.innerHTML = options['template'];
//         }
//     }
// }
//
//
//
//
//
//
//
// @Component({
//     htmlFile: "index.html",
//     cssFile: 'index.css',
//     template: '<p>mlfjkekmfj</p><br><h2>Secondary Title</h2>'
// })
// class aa {
//     t() {
//         console.log("msldfk")
//     }
// }
///////////////////////////////////////////////





















