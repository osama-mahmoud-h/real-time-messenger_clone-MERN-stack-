import dotenv from "dotenv";

dotenv.config({path: "./.env"});
import cors, {CorsOptions} from "cors";
import helmet from "helmet";
import {App} from "./app";
import express, {Application, Express} from "express";
import bodyParser from "body-parser";
import {getCorsOptions} from "./config/corsOptions";
import SocketServer from "./webSockets/socketServer";
import http from "http";
import {SocketEventHandler} from "./webSockets/socketHandlers";
import UserAuthRouter from "./routes/userAuth.router";
import mongodbConfig from "./config/mongodb.config";
import {redisClient} from "./config/redis";
import cookieParser from "cookie-parser";
import {SocketAuthMiddleware} from "./middlewares/socketAuthMiddleware";

/**
 * Represents an Express server for a real-time chatting messenger.
 */
export class ExpressServer {
    /**
     * The singleton instance of the ExpressServer class.
     */
    private static instance: ExpressServer;

    /**
     * The Express application instance.
     */
    private readonly expressApp: Application = App.getInstance().getExpressApp();

    /**
     * The HTTP server instance.
     */
    private readonly server: http.Server;

    /**
     * Constructs a new instance of the ExpressServer class.
     * Private to enforce singleton pattern.
     */
    private constructor() {
        this.server = http.createServer(this.expressApp);
        this.start();
    }

    /**
     * Returns the singleton instance of the ExpressServer class.
     * If the instance does not exist, it creates a new one.
     * @returns The ExpressServer instance.
     */
    public static getServerInstance(): ExpressServer {
        if (!ExpressServer.instance) {
            ExpressServer.instance = new ExpressServer();
        }
        return ExpressServer.instance;
    };

    /**
     * Starts the server by performing necessary setup tasks.
     * This includes establishing database connection, setting up middlewares,
     * configuring routes, setting up WebSocket, and running the server.
     */
    private start = async () => {
        await this.dbConnection();
        this.setupMiddlewares();
        this.setUpRoutes();
        this.setupWebSocket();
        this.runServer();
    };

    /**
     * Sets up the routes for the Express application.
     */
    private setUpRoutes(): void {
        this.expressApp.use("/api/messenger/user", UserAuthRouter);
    };

    /**
     * Establishes the database connection.
     * @returns A Promise that resolves when the connection is established.
     */
    private dbConnection = async (): Promise<void> => {
        try {
            await mongodbConfig();
        } catch (err: any) {
            console.log("dbConnection err: ", err);
        }
    };

    /**
     * Sets up the middlewares for the Express application.
     */
    private setupMiddlewares = (): void => {
        this.expressApp.use(bodyParser.json({ limit: '20mb' }));
        this.expressApp.use(cookieParser());
        this.expressApp.use(express.json());
        this.expressApp.use(cors(getCorsOptions()));
        this.expressApp.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
        this.expressApp.disable("x-powered-by");
    };

    /**
     * Sets up the WebSocket for real-time communication.
     */
    private setupWebSocket = (): void => {
        const io = SocketServer.getInstance(this.server, getCorsOptions()).getIO();
        io.use(SocketAuthMiddleware.verifyTokenMiddleware);
        const socketHandler = SocketEventHandler.getInstance(io);
        socketHandler.setupEventHandlers();
    };

    /**
     * Runs the server by listening on the specified port.
     */
    private runServer(): void {
        const PORT = process.env.PORT || 3000;
        this.server.listen(PORT, () => {
            console.log(`Server is running in http://localhost:${PORT}`);
        });
    };
}

// start the server(entry point).
ExpressServer.getServerInstance();
