import Route from "./route.js";
import FS from "../utiles/FS";
import BinderParameters from "../binding/binder.parameters.js";
import TemplateBuilder from "../template_engine/template.builder.js";

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

    navigate(name: string): void {
        if ((name === this.current?.name && this.current) || (name === this.current?.url && this.current)) {
            return;
        }

        if (this.current !== null) {
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

        this.loadComponent().then((htmlComponent: HTMLElement) => {

            // this.current!.viewModel.bindNavigation(htmlComponent);
            // this.current?.viewModel.bindHtmlEvent(htmlComponent);
            this.current!.viewModel.onLoaded();
        });
    }

    private async loadComponent(): Promise<HTMLElement> {
        const binder = new BinderParameters();
        const htmlBuilder = new TemplateBuilder();
        const viewModel = this.current!.viewModel;
        viewModel.onInit();
        binder.extractParam(viewModel);
        const html = await htmlBuilder.getParsedHtml(this.current!.htmlPath, binder.getSubscribtions());
        console.log('jhg')
        this.render(html);
        return html;
    }

    public static getInstance(routes?: Route[]): Router {
        if (this.instance === null) {
            if (routes !== undefined) {
                this.instance = new Router(routes);
            } else {
                throw "you must provide routes parameters";
            }
        }
        return this.instance;
    }

    private render(html: HTMLElement) {
        const router = document.querySelector("router") as HTMLElement;
        router.innerHTML = "";
        router.append(html);
    }

    get current(): Route | null {
        return this._current;
    }

    set current(value: Route | null) {
        this._current = value;
    }
}