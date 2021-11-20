export default class Route {

    private _name: string = "";
    private _url: string = "";
    private _viewModel: ViewModel;
    private _htmlPath: string = "";

    constructor(url: string, name: string, viewController: ViewModel, htmlPath: string) {
        this._name = name;
        this._url = url;
        this._viewModel = viewController;
        this.htmlPath = htmlPath;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get url(): string {
        return this._url;
    }

    set url(value: string) {
        this._url = value;
    }

    get viewModel(): ViewModel {
        return this._viewModel;
    }

    set viewModel(value: ViewModel) {
        this._viewModel = value;
    }

    get htmlPath(): string {
        return this._htmlPath;
    }

    set htmlPath(value: string) {
        this._htmlPath = value;
    }
}