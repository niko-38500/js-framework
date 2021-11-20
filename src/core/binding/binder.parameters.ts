import ViewModel from "../component/view.model.js";

export default class BinderParameters {
    private params: { [key: string]: string } = {};

    extractParam(viewModel: ViewModel) {
        for (let key in viewModel) {
            // console.log(key)
            // console.log(Object.getOwnPropertyDescriptor(ViewModel, key))
            this.params[key] = eval("viewModel[key]");
        }
    }

    getParams(): { [key: string]: string } {
        return this.params
    }
}