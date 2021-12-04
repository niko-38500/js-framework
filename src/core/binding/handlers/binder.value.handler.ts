import Binding from "../binding.js";
import BinderParameters from "../binder.parameters.js";

export default class BinderValueHandler extends BinderParameters {
    callback!: () => void;

    bind(binding: Binding) {
        if (!(binding.element instanceof HTMLInputElement)) {
            throw `
                Error in ${binding.element.localName} tag on property bind="${binding.element.getAttribute('bind')}"
                an element with bind value attribute must be of type HTMLInputElement 
            `
        }

        this.callback = () => this.listener(binding);
        this.initState(binding);
        binding.element.addEventListener('input', this.callback);
    }

    unbind(binding: Binding) {
        binding.element.removeEventListener('input', this.callback);
    }

    listener(binding: Binding): void {
        let value: string | number | boolean;
        const inputType = binding.element.getAttribute('type');

        switch (inputType) {
            case "checkbox":
                value = (binding.element as HTMLInputElement).checked;
                break;
            default :
                value = (binding.element as HTMLInputElement).value;
        }
        binding.setValue(value);
    }

    private initState(binding: Binding) {
        const inputType = binding.element.getAttribute("type");
        switch (inputType) {
            case "checkbox":
                (binding.element as HTMLInputElement).checked = binding.getValue();
                break;
            case "radio":
                break;
            default :
                (binding.element as HTMLInputElement).value = binding.getValue();
        }
    }
}