import AppComponent from "../app/app.component.js";
import TemplateBuilder from "./template_engine/template.builder.js";
import BindingCollection from "./binding/binding.collection.js";
import ViewModel from "./component/view.model.js";

export default class Kernel {
    initApp(): void {
        this.initDarkMode();
        const appComponent = new AppComponent();
        const binder = BindingCollection.getInstance();

        appComponent.onInit();
        Kernel.loadComponent(appComponent).then((view: HTMLElement) => {
            binder.addBinding(view, appComponent);
            appComponent.onLoaded();
        });
    }

    private static async loadComponent(component?: ViewModel): Promise<HTMLElement> {
        const builder = new TemplateBuilder();
        const html = await builder.getParsedHtml('app.html', component) as HTMLDivElement;
        html.id = 'root';
        (document.querySelector("#root") as HTMLDivElement).replaceWith(html);
        return html;
    }

    private initDarkMode() {
        const isDarkModeEnable = localStorage.getItem("dark-mode") === "true";
        document.documentElement.addEventListener("change", () => {
            const isDarkMode = document.documentElement.getAttribute("dark") === "";
            if (isDarkMode) {
                localStorage.setItem("dark-mode", "true");
                return;
            }
            localStorage.setItem("dark-mode", "false");
        })
        if (isDarkModeEnable) {
            document.documentElement.setAttribute("dark", "");
            return;
        }
        document.documentElement.removeAttribute("dark");
    }
}