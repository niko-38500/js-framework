import {Router} from '../../routing/router.js';

export interface BindingNavigationInterface {
    element: Element;
    event: string;
    callback: () => any;
    context: Router;
}