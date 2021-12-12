import ViewModel from "../core/component/view.model.js";

export default class AppComponent extends ViewModel{
    name = 'john';
    lastname = "Doe";
    isDarkModeEnable = document.documentElement.getAttribute('dark') === '';

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

    toggleDarkMode() {
        const isDark = document.documentElement.getAttribute("dark");
        if (isDark === "") {
            document.documentElement.removeAttribute("dark");
            return;
        }
        document.documentElement.setAttribute("dark", "");
    }

    onInit() {

    }

    onLoaded() {
        super.onLoaded();
    }

    onDestroy() {
        super.onDestroy();
    }
}