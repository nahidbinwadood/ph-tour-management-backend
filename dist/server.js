"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./app/config/env");
let server;
const PORT = env_1.envVars.PORT;
const DB_URL = env_1.envVars.DB_URL;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.info('🔄 Initializing server...');
        yield mongoose_1.default.connect(DB_URL);
        console.info('✅ Database connection established successfully');
        server = app_1.default.listen(PORT, () => {
            console.info(`🚀 Server started successfully`);
            console.info(`📡 Listening on port: ${PORT}`);
            console.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start the server');
        console.error(error);
        process.exit(1);
    }
});
startServer();
