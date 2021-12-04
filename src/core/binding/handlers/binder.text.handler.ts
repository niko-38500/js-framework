import Binding from "../binding.js";
import Binder from "../binder.js";
import BinderParameters from "../binder.parameters.js";

export default class BinderTextHandler extends BinderParameters {
    bind(binding: Binding) {
        this.update(binding);
        Binder.subscribe(binding.property, () => {
            this.update(binding);
        });
    }

    update(binding: Binding) {
        binding.element.textContent = binding.getValue();
    }
}