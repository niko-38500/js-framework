export default interface BinderEventInterface {
    element: Element;
    event: string;
    callback: () => any | void;
}