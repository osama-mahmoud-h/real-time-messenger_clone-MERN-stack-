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

export class ExpressServer {
    private static instance: ExpressServer;
    private readonly expressApp: Application =
        App.getInstance().getExpressApp();

    private readonly server: http.Server;

    private constructor() {
        this.server = http.createServer(this.expressApp);
        this.start();
    }

    public static getServerInstance(): ExpressServer {
        if (!ExpressServer.instance) {
            ExpressServer.instance = new ExpressServer();
        }
        return ExpressServer.instance;
    };

    private start = async () => {
        await this.dbConnection();
        this.setupMiddlewares();
        this.setUpRoutes();
        this.setupWebSocket();
        this.runServer();
    };

    private setUpRoutes(): void {
        this.expressApp.use("/api/messenger/user", UserAuthRouter);

    };

    private dbConnection = async (): Promise<void> => {
        try {
            await  mongodbConfig();
        } catch (err: any) {
            console.log("dbConnection err: ",err);
        }
    };
    private setupMiddlewares = (): void => {
        this.expressApp.use(bodyParser.json({limit: '20mb'}));
        this.expressApp.use(cookieParser());
        this.expressApp.use(express.json());
        this.expressApp.use(cors(getCorsOptions()));
        this.expressApp.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
        this.expressApp.disable("x-powered-by");
    };
    private setupWebSocket = (): void => {
        const io = SocketServer.getInstance(this.server, getCorsOptions()).getIO();
        io.use(SocketAuthMiddleware.verifyTokenMiddleware);
        const socketHandler = SocketEventHandler.getInstance(io);
        socketHandler.setupEventHandlers();
    };

    private runServer(): void {
        const PORT = process.env.PORT || 3000;
        this.server.listen(PORT, () => {
            console.log(`Server is running in http://localhost:${PORT}`);
        });
    };

}

// start the server
ExpressServer.getServerInstance();
