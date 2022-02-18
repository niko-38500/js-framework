import { TemplateResolver } from "./template.resolver";
import { FS } from "../utiles/FS";

export class TemplateBuilder extends TemplateResolver {

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

    async getParsedHtml(path: string, args?: { [key: string]: any }): Promise<HTMLElement> {
        let htmlContent: string = "";

        try {
            htmlContent = await this.getHtmlText(path);
        } catch (err) {
            throw err;
        }

        if (this.regexGlobalIfStatement.test(htmlContent)) {
            htmlContent = this.buildIfStatement(htmlContent);
        }

        if (this.regexGlobalInterpolation.test(htmlContent)) {
            htmlContent = this.resolveInterpolation(htmlContent, args)
        }

        if (this.regexGlobalIfStatement.test(htmlContent)) {
            htmlContent = this.resolveIfStatement(htmlContent)
        }

        if (this.regexGlobalHtmlEvent.test(htmlContent)) {
            htmlContent = this.resolveHtmlEvent(htmlContent);
        }

        return this.parseStringAsDom(htmlContent);
    }

    private parseStringAsDom(htmlContent: string): HTMLElement {
        let div = document.createElement("div");
        div.innerHTML = htmlContent;
        return div;
    }

    private buildIfStatement(html: string) {
        const matchedIfStatements = html.match(this.regexGlobalIfStatement)!;
        matchedIfStatements.forEach((matchedIfStatement: string) => {
            const matchedCondition = matchedIfStatement.match(this.regexResolverStringCondition)![1];
            const splitedCondition = matchedCondition.split(/(===?|!==?|<=?|>=?|\|\||&&)/);
            let newCondition = "";
            splitedCondition.forEach((conditionPart: string) => {
                if (
                    !/(true|false)/.test(conditionPart) &&
                    !/[0-9]+/.test(conditionPart) &&
                    !/"[0-9a-zA-Z]*?"/.test(conditionPart) &&
                    !/(===?|!==?|<=?|>=?|\|\||&&)/.test(conditionPart)
                ) {
                    if (/(\(|\)|!)+/.test(conditionPart)) {
                        conditionPart.split(/(\(|\)|!)+/).forEach((element: string) => {
                            if (/(\(|\)|!)+|^\s$/.test(element) || element.length === 0) {
                                newCondition += element
                                return;
                            }
                            newCondition += "{{ " + element + " }}";
                            return;
                        })
                        return;
                    }
                    newCondition += "{{ " + conditionPart + " }} ";
                    return;
                }
                newCondition += conditionPart + " ";
            })
            const newIfStatement = matchedIfStatement.replace(matchedCondition, newCondition);
            html = html.replace(matchedIfStatement, newIfStatement);
        })
        return html;
    }
}