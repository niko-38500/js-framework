import AppComponent from "../app/app.component.js";
import TemplateBuilder from "./template_engine/template.builder.js";
import BindingCollection from "./binding/binding.collection.js";

export default class Kernel {
    initApp(): void {
        this.initDarkMode();
        const appComponent = new AppComponent();
        const binder = new BindingCollection();

        appComponent.onInit();
        Kernel.loadComponent().then((view: Element) => {
            binder.addBinding(view, appComponent);
            // appComponent.bindNavigation(component);
            // appComponent.bindHtmlEvent(component);
            // console.log(appComponent.getEvents())
            appComponent.onLoaded();
        });
    }

    private static async loadComponent(binder?: { [key: string]: string }): Promise<HTMLElement> {
        const builder = new TemplateBuilder();
        const html = await builder.getParsedHtml('app.html', binder);
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