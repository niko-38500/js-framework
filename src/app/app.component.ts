import ViewModel from "../core/component/view.model.js";

export default class AppComponent extends ViewModel{
    name = false;
    lastname = "Doe";
    onInit() {

    }

    onLoaded() {
        super.onLoaded();
    }

    onDestroy() {
        super.onDestroy();
    }
}