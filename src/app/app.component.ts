import ViewModel from "../core/component/view.model.js";

export default class AppComponent extends ViewModel{
    name = false;
    lastname = "Doe";
    tab = [
        {
            a: "azhe",
            b: 2,
            c: {
                a: "azer"
            },
        },
        {
            a: "ffdsf",
            b: 44,
            c: {
                a: "azerty"
            },
        }
    ];

    onInit() {

    }

    onLoaded() {
        super.onLoaded();
    }

    onDestroy() {
        super.onDestroy();
    }
}