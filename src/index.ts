import Kernel from "./core/kernel.js";
import Router from "./core/routing/router.js";
import Route from "./core/routing/route.js";

const kernel = new Kernel();
kernel.initApp();

const router = Router.getInstance([
    // TODO : put your routes here
]);

const url = window.location.pathname;

// router!.navigate(url);

window.addEventListener('popstate', () => {
    const url = window.location.pathname;
    router!.navigate(url);
});