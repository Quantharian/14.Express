import type { Request, Response } from 'express';
import createDebug from 'debug';
import { HomePage } from '../views/pages/home-page.js';
const debug = createDebug('demo:controllers:home');
debug('Loaded module');

export class HomeController {
    private view = new HomePage();

    constructor() {
        debug('Instanciando controller');
    }

    getPage = (_req: Request, res: Response) => {
        debug('Petición recibida en getPage');
        res.header('Content-Type', 'text/html');
        res.send(this.view.render());
    };
}
