import express, { Application } from 'express';

export class App {
    private static instance: App;
    private readonly expressApp: Application;

    private constructor() {
        this.expressApp = express();
    }

    public static getInstance(): App {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

    public getExpressApp(): Application {
        return this.expressApp;
    };
    public getExpress(){
        return express;
    }

}
