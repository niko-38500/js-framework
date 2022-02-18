export class TemplateResolver {
    protected regexGlobalHtmlEvent = new RegExp("<.*? ?[\(]+.*[\)]+=\".*?\".*?>", "g");
    protected regexGlobalIfStatement = new RegExp("{% ?if ?.*? ?%}.*\n?.*?\n?.*{% endif %}", "g");
    protected regexResolverStringCondition = new RegExp("{% ?if (.*?) ?%}.*?{% ?endif ?%}", "s");
    protected regexGlobalInterpolation = new RegExp(/{{ ?([a-zA-Z0-9\[\].()]*) ?}}/g);
    protected regexGlobalInterpolatedVar = new RegExp("({{.*?}})", 'g');
    protected regexInterpolation = new RegExp(/{{ ?([a-zA-Z0-9\[\].()]*) ?}}/);

    protected resolveHtmlEvent(html: string): string {
        const regexHtmlEvent = new RegExp("<.*? ?([\(]+(.*)[\)]+=\"(.*?)\").*?>");
        const splitedContent = html.match(this.regexGlobalHtmlEvent);

        splitedContent?.forEach((e: string) => {
            const matchedEvent = e.match(regexHtmlEvent)!;
            const paramName = `html-dynamic-event='${matchedEvent[2]}:${matchedEvent[3]}'`;
            const replacedTag = e.replace(matchedEvent[1], paramName);
            html = html.replace(matchedEvent[0], replacedTag);
        });
        return html;
    }

    protected resolveIfStatement(html: string) {
        const regexIfStatement = new RegExp('{% ?if ?(.*?) ?%}(.*?){% endif %}', 's');
        const ifMatches = html.match(this.regexGlobalIfStatement)!;
        ifMatches.forEach((element: string) => {
            const ifStatement = element.match(regexIfStatement)!;
            const condition = ifStatement[1];
            if (eval(condition)) {
                html = html.split(ifStatement[0]).join(ifStatement[2]);
            }
            html = html.replace(ifStatement[0], "");
        })
        return html;
    }

    protected resolveInterpolation(html: string, args?: { [key: string]: any }) {
        let splitedHtml: string[] = html.split(this.regexGlobalInterpolatedVar);
        let replacedHtml: string = "";
        splitedHtml.forEach((e: any) => {
            const match: string[] = e.match(this.regexInterpolation);
            if (match && args) {
                if (typeof (args[match[1].split('.')[0]]) === "object") {
                    if (/\./.test(match[1]) && args.hasOwnProperty(match[1].split('.')[0])) {
                        const splitedMatch = match[1].split('.');
                        let suplyParam = splitedMatch.slice(2).join('.') ? "." + splitedMatch.slice(2).join('.') : "";
                        let stringEval = Array.isArray(args[match[1].split('.')[0]]) ?
                            eval(
                                "args." +
                                splitedMatch[0] +
                                "[" +
                                splitedMatch[1] +
                                "]" +
                                suplyParam
                            ) :
                            eval("args." + match[1]);
                        if (stringEval) {
                            let a: any = document.createElement("div") as Element;
                            a.innerText = stringEval;
                            stringEval = a.innerHTML
                            replacedHtml += stringEval;
                            return;
                        } else if (typeof stringEval === "undefined") {
                            throw new DOMException(
                                "the key " +
                                `${splitedMatch[1]}${suplyParam}` +
                                " in the object " +
                                splitedMatch[0] +
                                " is not defined."
                            );
                        }
                    }
                } else if (!args?.hasOwnProperty(match[1])) {
                    throw new DOMException(match[1] + " is not a property of provided arguments");
                } else if (
                    typeof (args[match[1]]) !== "string" &&
                    typeof (args[match[1]]) !== "number" &&
                    typeof (args[match[1]]) !== "boolean"
                ) {
                    const type = Array.isArray(args[match[1]]) ? " array " : typeof args[match[1]]
                    throw new DOMException(
                        "Error for : " +
                        match[1] +
                        " the argument must be of type (string | number) " +
                        type +
                        " provided"
                    );
                } else {
                    // const hasIfStatement = occurrence.match(this.regexGlobalIfStatement);
                    let result = args[e.match(/{{(.*)}}/)[1].trim()];
                    replacedHtml += result;
                }
            } else {
                replacedHtml += e;
            }
        });

        return replacedHtml;
    }
}