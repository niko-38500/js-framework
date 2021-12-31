import ViewModel from "../core/component/view.model.js";

export default class AppComponent extends ViewModel {
    isDarkModeEnable = document.documentElement.getAttribute('dark') === '';

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
}