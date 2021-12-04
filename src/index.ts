import Kernel from "./core/kernel.js";

const kernel = new Kernel();
kernel.initApp();


// const div = document.createElement("div");
// const shadow = div.attachShadow({mode: "closed"});
// shadow.innerHTML = "<h1>titre</h1>"
//
// document.body.appendChild(shadow);



// export declare interface Directive {
//     /**
//      * The CSS selector that identifies this directive in a template
//      * and triggers instantiation of the directive.
//      *
//      * Declare as one of the following:
//      *
//      * - `element-name`: Select by element name.
//      * - `.class`: Select by class name.
//      * - `[attribute]`: Select by attribute name.
//      * - `[attribute=value]`: Select by attribute name and value.
//      * - `:not(sub_selector)`: Select only if the element does not match the `sub_selector`.
//      * - `selector1, selector2`: Select if either `selector1` or `selector2` matches.
//      *
//      * Angular only allows directives to apply on CSS selectors that do not cross
//      * element boundaries.
//      *
//      * For the following template HTML, a directive with an `input[type=text]` selector,
//      * would be instantiated only on the `<input type="text">` element.
//      *
//      * ```html
//      * <form>
//      *   <input type="text">
//      *   <input type="radio">
//      * <form>
//      * ```
//      *
//      */
//     selector?: string;
//     /**
//      * Enumerates the set of data-bound input properties for a directive
//      *
//      * Angular automatically updates input properties during change detection.
//      * The `inputs` property defines a set of `directiveProperty` to `bindingProperty`
//      * configuration:
//      *
//      * - `directiveProperty` specifies the component property where the value is written.
//      * - `bindingProperty` specifies the DOM property where the value is read from.
//      *
//      * When `bindingProperty` is not provided, it is assumed to be equal to `directiveProperty`.
//      *
//      * @usageNotes
//      *
//      * The following example creates a component with two data-bound properties.
//      *
//      * ```typescript
//      * @Component({
//      *   selector: 'bank-account',
//      *   inputs: ['bankName', 'id: account-id'],
//      *   template: `
//      *     Bank Name: {{bankName}}
//      *     Account Id: {{id}}
//      *   `
//      * })
//      * class BankAccount {
//      *   bankName: string;
//      *   id: string;
//      * }
//      * ```
//      *
//      */
//     inputs?: string[];
//     /**
//      * Enumerates the set of event-bound output properties.
//      *
//      * When an output property emits an event, an event handler attached to that event
//      * in the template is invoked.
//      *
//      * The `outputs` property defines a set of `directiveProperty` to `bindingProperty`
//      * configuration:
//      *
//      * - `directiveProperty` specifies the component property that emits events.
//      * - `bindingProperty` specifies the DOM property the event handler is attached to.
//      *
//      * @usageNotes
//      *
//      * ```typescript
//      * @Component({
//      *   selector: 'child-dir',
//      *   outputs: [ 'bankNameChange' ]
//      *   template: `<input (input)="bankNameChange.emit($event.target.value)" />`
//      * })
//      * class ChildDir {
//      *  bankNameChange: EventEmitter<string> = new EventEmitter<string>();
//      * }
//      *
//      * @Component({
//      *   selector: 'main',
//      *   template: `
//      *     {{ bankName }} <child-dir (bankNameChange)="onBankNameChange($event)"></child-dir>
//      *   `
//      * })
//      * class MainComponent {
//      *  bankName: string;
//      *
//      *   onBankNameChange(bankName: string) {
//      *     this.bankName = bankName;
//      *   }
//      * }
//      * ```
//      *
//      */
//     outputs?: string[];
//     /**
//      * Configures the [injector](guide/glossary#injector) of this
//      * directive or component with a [token](guide/glossary#di-token)
//      * that maps to a [provider](guide/glossary#provider) of a dependency.
//      */
//     providers?: Provider[];
//     /**
//      * Defines the name that can be used in the template to assign this directive to a variable.
//      *
//      * @usageNotes
//      *
//      * ```ts
//      * @Directive({
//      *   selector: 'child-dir',
//      *   exportAs: 'child'
//      * })
//      * class ChildDir {
//      * }
//      *
//      * @Component({
//      *   selector: 'main',
//      *   template: `<child-dir #c="child"></child-dir>`
//      * })
//      * class MainComponent {
//      * }
//      * ```
//      *
//      */
//     exportAs?: string;
//     /**
//      * Configures the queries that will be injected into the directive.
//      *
//      * Content queries are set before the `ngAfterContentInit` callback is called.
//      * View queries are set before the `ngAfterViewInit` callback is called.
//      *
//      * @usageNotes
//      *
//      * The following example shows how queries are defined
//      * and when their results are available in lifecycle hooks:
//      *
//      * ```ts
//      * @Component({
//      *   selector: 'someDir',
//      *   queries: {
//      *     contentChildren: new ContentChildren(ChildDirective),
//      *     viewChildren: new ViewChildren(ChildDirective)
//      *   },
//      *   template: '<child-directive></child-directive>'
//      * })
//      * class SomeDir {
//      *   contentChildren: QueryList<ChildDirective>,
//      *   viewChildren: QueryList<ChildDirective>
//      *
//      *   ngAfterContentInit() {
//      *     // contentChildren is set
//      *   }
//      *
//      *   ngAfterViewInit() {
//      *     // viewChildren is set
//      *   }
//      * }
//      * ```
//      *
//      * @Annotation
//      */
//     queries?: {
//         [key: string]: any;
//     };
//     /**
//      * Maps class properties to host element bindings for properties,
//      * attributes, and events, using a set of key-value pairs.
//      *
//      * Angular automatically checks host property bindings during change detection.
//      * If a binding changes, Angular updates the directive's host element.
//      *
//      * When the key is a property of the host element, the property value is
//      * the propagated to the specified DOM property.
//      *
//      * When the key is a static attribute in the DOM, the attribute value
//      * is propagated to the specified property in the host element.
//      *
//      * For event handling:
//      * - The key is the DOM event that the directive listens to.
//      * To listen to global events, add the target to the event name.
//      * The target can be `window`, `document` or `body`.
//      * - The value is the statement to execute when the event occurs. If the
//      * statement evaluates to `false`, then `preventDefault` is applied on the DOM
//      * event. A handler method can refer to the `$event` local variable.
//      *
//      */
//     host?: {
//         [key: string]: string;
//     };
//     /**
//      * When present, this directive/component is ignored by the AOT compiler.
//      * It remains in distributed code, and the JIT compiler attempts to compile it
//      * at run time, in the browser.
//      * To ensure the correct behavior, the app must import `@angular/compiler`.
//      */
//     jit?: true;
// }
//
// declare const Type: FunctionConstructor;
// declare interface Type<T> extends Function {
//     new (...args: any[]): T;
// }
//
// export declare interface TypeDecorator {
//     /**
//      * Invoke as decorator.
//      */
//         <T extends Type<any>>(type: T): T;
//     (target: Object, propertyKey?: string | symbol, parameterIndex?: number): void;
// }
//
//
// declare interface Component {
//     templateUrl: string
// }
// declare const Component: cp;
//
//
// declare interface cp {
//     (obj: Component): TypeDecorator;
//     new (obj: Component): Component;
// }
//
//
// class Test extends HTMLElement {
//     shadow: any
//     constructor() {
//         super();
//         this.shadow = this.attachShadow({mode: "closed"});
//         const promise = new Promise((resolve, reject) => {
//             let res = fetch('/src/app/components/home/home.html').then((res: Response) => {
//                 return res.text()
//             }).then((response: string) => {
//                 console.log(response)
//                 return response;
//             })
//             resolve(res);
//         })
//         promise.then((response: any) => {
//             this.shadow.innerHTML = response;
//         })
//     }
// }
//
// @Component({
//     templateUrl: "test"
// })
// class Ttest extends Test {
//     constructor() {
//         super();
//         this.onInit()
//     }
//
//     onInit() {
//         this.shadow.append("text append")
//     }
// }
// customElements.define('test-aa', Ttest);