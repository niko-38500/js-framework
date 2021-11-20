import AppComponent from "../app/app.component.js";

export default class Kernel {
    initApp(): void {
        this.initDarkMode();
        const appComponent = new AppComponent();
        const binder = new Binder();
        appComponent.onInit();
        binder.extractParam(appComponent);
        Kernel.loadComponent(binder.getParams()).then((component: Node) => {
            appComponent.bindNavigation(component)
            appComponent.bindHtmlEvent(component);
            // console.log(appComponent.getEvents())
            appComponent.onLoaded();
        })
    }

    private static async loadComponent(binder: BinderParamsInterface): Promise<Node> {
        const builder = new HtmlBuilder();
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