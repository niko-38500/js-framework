import ViewModel from "../component/view.model.js";

export default class Route {

    private _name: string = "";
    private _url: string = "";
    private _viewModel: ViewModel;
    private _htmlPath: string = "";

    constructor(url: string, name: string, viewController: ViewModel, htmlPath: string) {
        this._name = name;
        this._url = url;
        this._viewModel = viewController;
        this._htmlPath = htmlPath;
    }

    get name(): string {
        return this._name;
    }

    get url(): string {
        return this._url;
    }

    get viewModel(): ViewModel {
        return this._viewModel;
    }

    get htmlPath(): string {
        return this._htmlPath;
    }
}