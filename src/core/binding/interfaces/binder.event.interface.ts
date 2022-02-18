import { ViewModel } from "../../component/view.model.js";

export interface BinderEventInterface {
    element: Element;
    event: string;
    callback: () => any | void;
    context: ViewModel
}