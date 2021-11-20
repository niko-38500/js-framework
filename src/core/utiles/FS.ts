export default class FS {

    fileExist(fullPath: string): Promise<boolean> {
        return fetch(fullPath)
            .then((result: Response) => {
                return result.ok;
            })
    }

    static pathJoin(...path: string[]): string {
        return `/${path.join("/")}`;
    }
}