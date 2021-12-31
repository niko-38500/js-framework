import Router from "../../routing/router.js";

export default interface BindingNavigationInterface {
    element: Element;
    event: string;
    callback: () => any;
    context: Router;
}