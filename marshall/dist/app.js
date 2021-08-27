"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const winston = __importStar(require("winston"));
const expressWinston = __importStar(require("express-winston"));
const debug_1 = __importDefault(require("debug"));
const cors_1 = __importDefault(require("cors"));
const port = 3000;
const app = express_1.default();
const dbg = debug_1.default('app');
app.use(express_1.default.json());
app.use(cors_1.default());
const loggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.json(), winston.format.prettyPrint(), winston.format.colorize({ all: true }))
};
if (!process.env.DEBUG) {
    loggerOptions.meta = false;
}
app.use(expressWinston.logger(loggerOptions));
app.get('/_healthcheck', (_req, res) => {
    res.status(200).json({ uptime: process.uptime });
});
const runningMessage = `Server running at http://localhost:${port}`;
try {
    app.listen(port, () => {
        dbg(runningMessage);
        console.log(runningMessage);
    });
}
catch (error) {
    console.error(`Error occurred: ${error.message}`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzREFBaUU7QUFDakUsaURBQWtDO0FBQ2xDLGdFQUFpRDtBQUNqRCxrREFBeUI7QUFDekIsZ0RBQXVCO0FBRXZCLE1BQU0sSUFBSSxHQUFXLElBQUksQ0FBQTtBQUV6QixNQUFNLEdBQUcsR0FBZ0IsaUJBQU8sRUFBRSxDQUFBO0FBQ2xDLE1BQU0sR0FBRyxHQUFvQixlQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7QUFFekMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxpQkFBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7QUFDdkIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFJLEVBQUUsQ0FBQyxDQUFBO0FBRWYsTUFBTSxhQUFhLEdBQWlDO0lBQ2hELFVBQVUsRUFBRSxDQUFFLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUMvQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQzFCLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQ3JCLE9BQU8sQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQzVCLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQ3pDO0NBQ0osQ0FBQTtBQUVELElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtJQUNwQixhQUFhLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQTtDQUM3QjtBQUVELEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFBO0FBRTdDLEdBQUcsQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBYSxFQUFFLEdBQWEsRUFBRSxFQUFFO0lBQ3RELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEVBQUMsQ0FBQyxDQUFBO0FBQ2xELENBQUMsQ0FBQyxDQUFBO0FBRUYsTUFBTSxjQUFjLEdBQVcsc0NBQXNDLElBQUksRUFBRSxDQUFBO0FBRTNFLElBQUk7SUFDQSxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7UUFDbEIsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFBO1FBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUE7SUFDL0IsQ0FBQyxDQUFDLENBQUE7Q0FDTDtBQUFDLE9BQU8sS0FBSyxFQUFFO0lBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7Q0FDcEQifQ==