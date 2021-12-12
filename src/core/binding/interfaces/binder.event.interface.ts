import ViewModel from "../../component/view.model.js";

export default interface BinderEventInterface {
    element: Element;
    event: string;
    callback: () => any | void;
    context: ViewModel
}