import TemplateResolver from "./template.resolver.js";
import FS from "../utiles/FS.js";

export default class TemplateBuilder extends TemplateResolver {
    private getHtmlText(file: string): Promise<string> {
        return fetch(FS.pathJoin("src/app", file))
            .then((res: any) => {
                return res.text();
            })
            .then((html: any) => {
                return html;
            })
            .catch((err: any) => {
                console.error(`Error: src/app/${file} - ${err}`);
                return `Error: src/app/${file} - ${err}`
            });
    }

    async getParsedHtml(path: string, args?: { [key: string]: string }): Promise<HTMLElement> {
        let htmlContent: string = "";

        try {
            htmlContent = await this.getHtmlText(path);
        } catch (err) {
            throw err;
        }

        const parsedHtml: HTMLElement = this.parseStringAsDom(htmlContent);

        return parsedHtml;
    }

    private parseStringAsDom(htmlContent: string): HTMLElement {
        let div = document.createElement("div");
        div.innerHTML = htmlContent;
        return div;
    }
}