import express, { Application } from 'express';

/**
 * Represents the main application class.
 */
export class App {
    private static instance: App;
    private readonly expressApp: Application;

    private constructor() {
        this.expressApp = express();
    }

    /**
     * Returns the singleton instance of the App class.
     * @returns The singleton instance of the App class.
     */
    public static getInstance(): App {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

    /**
     * Returns the Express application instance.
     * @returns The Express application instance.
     */
    public getExpressApp(): Application {
        return this.expressApp;
    };

    /**
     * Returns the Express module.
     * @returns The Express module.
     */
    public getExpress(){
        return express;
    }
}
