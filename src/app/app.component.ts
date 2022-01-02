import ViewModel from "../core/component/view.model.js";

interface Todo {
    desc: string,
    date: string
}

export default class AppComponent extends ViewModel {
    isDarkModeEnable = document.documentElement.getAttribute('dark') === '';
    todos: Todo[] = [
        {
            desc: "description",
            date: "2022-01-01"
        },
        {
            desc: "desfcription",
            date: "2022-02-01"
        }
    ];

    aaz = [
        "sdkfj",
        "fskmlefj"
    ]

    onInit() {
        console.log(Date.now())
    }

    onDestroy() {
        super.onDestroy();
    }

    toggleDarkMode() {
        const isDark = document.documentElement.getAttribute("dark");
        if (isDark === "") {
            document.documentElement.removeAttribute("dark");
            return;
        }
        document.documentElement.setAttribute("dark", "");
    }

    setActiveLink(event: Event) {
        (event.currentTarget as HTMLElement).querySelectorAll('li').forEach((element: HTMLElement) => {
            if (element.classList.contains('active')) {
                element.classList.remove('active');
                return;
            }
        });
        (event.target as HTMLElement).parentElement!.classList.add('active');
    }

    removeActive() {
        const navLinks = document.querySelectorAll('.nav-links > li');
        navLinks.forEach((element: Element) => {
            element.classList.remove('active');
        })
    }

    subList(event: Event) {
        const todo: Todo = {
            date: "",
            desc: ""
        };

        const form = (event.currentTarget as HTMLElement).parentElement!.children;
        for (let i of form) {
            if (i instanceof HTMLInputElement && "" === i.value) return;
            switch (i.id) {
                case 'desc' :
                    todo['desc'] = (i as HTMLInputElement).value;
                break;
                case 'date' :
                    todo['date'] = (i as HTMLInputElement).value;
                break;
            }
        }
        (this.todos as any) = todo;
        (this.aaz as any) = todo.desc
        // console.log(this.todos)
    }
}