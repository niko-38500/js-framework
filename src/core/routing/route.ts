import { ViewModel } from '../component/view.model';

export class Route {

    private readonly _name: string = '';
    private readonly _url: string = '';
    private readonly _viewModel: ViewModel;
    private readonly _htmlPath: string = '';

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