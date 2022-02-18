import { Binding } from "../binding";
import { Binder } from "../binder";
import { BinderParameters } from "../binder.parameters";

export class BinderTextHandler extends BinderParameters {
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