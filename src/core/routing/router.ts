import Route from "./route.js";
import FS from "../utiles/FS.js";
import TemplateBuilder from "../template_engine/template.builder.js";
import BindingCollection from "../binding/binding.collection.js";
import ViewModel from "../component/view.model.js";

export default class Router {
    private routes: Route[] = [];
    private static instance: Router | null = null;
    private _current: Route | null = null;

    private constructor(routes: Route[]) {
        this.filesExist(routes)
        this.hasDuplicate(routes);
        this.routes = routes;
        // window.history.pushState({page: "home"}, "", win);
    }

    private filesExist(routes: Route[]) {
        routes.forEach(async (route: Route) => {
            const fs = new FS();
            const htmlPath = FS.pathJoin("app", route.htmlPath);
            if (!(await fs.fileExist(htmlPath))) {
                throw `error: ${htmlPath} no such file or directory`;
            }
        });
    }

    private hasDuplicate(routes: Route[]): void {
        routes.forEach((e: Route) => {
            routes.forEach((element: Route) => {
                if (e === element) return;
                if (
                    e.name === element.name ||
                    e.url === element.url ||
                    e.viewModel === element.viewModel ||
                    e.htmlPath === element.htmlPath
                ) {
                    throw `error:  route ${e.name} is already assigned: Router.ts line 38`
                }
            });
        });
    }

    private generateToken(): string {
        const characters: string[] =
            "aM&W!67rtR@Vy0uCioZpeO+PqSD-2zF$GfvHJsdX%bnA~ETg#wQxc145*UIK3Lh?jklm8YBN9".split("");
        const length = 20;
        let token = "";
        for (let i = 0; i < length; i++) {
            const index = Math.round(Math.random() * characters.length - 1);
            token += characters[index];
        }
        return token;
    }

    navigate(name: string): void {
        if ((name === this.current?.name && this.current) || (name === this.current?.url && this.current)) {
            return;
        }

        const binder = BindingCollection.getInstance();

        if (this.current !== null) {
            const componentName = Object.getPrototypeOf(this.current!.viewModel).constructor.name;
            binder.clearBinding(componentName);

            this.current.viewModel.onDestroy()
            this.current = null;
        }

        this.current = this.routes.filter((route: Route) => {
            return route.name === name
        })[0];

        if (!this.current) {
            this.current = this.routes.filter((route: Route) => {
                return route.url === name
            })[0];
        }

        if (!this.current) {
            // TODO : add a 404 page
            throw `route doesn't exist: Router.ts:65`;
        }

        if (null === window.history.state || window.history.state.page !== this.current.name) {
            window.history.pushState({page: this.current.name}, "", this.current.url)
        }

        this.loadComponent(this.current.viewModel, this.current.htmlPath).then((htmlComponent: HTMLElement) => {
            binder.addBinding(htmlComponent, this.current!.viewModel)
            this.current!.viewModel.onLoaded();
        });
    }

    private async loadComponent(component: ViewModel, path: string): Promise<HTMLElement> {
        const builder = new TemplateBuilder();
        let html = await builder.getParsedHtml(path, component);
        component.onInit();
        html = this.render(html);
        return html;
    }

    public static getInstance(routes?: Route[]): Router|undefined {
        if (this.instance === null) {
            if (routes !== undefined) {
                this.instance = new Router(routes);
            } else {
                return undefined;
            }
        }
        return this.instance;
    }

    private render(html: HTMLElement): HTMLElement {
        const router = document.querySelector("router") as HTMLElement;
        router.innerHTML = "";
        html.id = "router-wrapper-container";
        html.querySelectorAll('#router-wrapper-container > *').forEach((element: Element) => {
            router.appendChild(element);
        })
        return router;
    }

    private get current(): Route | null {
        return this._current;
    }

    private set current(value: Route | null) {
        this._current = value;
    }
}