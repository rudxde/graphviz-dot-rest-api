import * as yargs from "yargs";

export interface IEnvironment {
    port: number;
    hostName: string;
    log4xxErrors: boolean;
    bodyLimit: string;
    rateLimit?: number;
}

let environment: IEnvironment | undefined;

export function getEnvironment(): IEnvironment {
    if (!environment) {
        throw new Error("Environment not loaded. Please call loadEnvironment first!")
    }
    return environment;
}

export async function loadEnvironment() {
    environment = yargs
        .env("")
        .options({
            port: {
                description: "The port the api is listening on.",
                type: "number",
                default: 80
            },
            hostName: {
                description: "The hostname the api is listening on.",
                type: "string",
                default: "0.0.0.0"
            },
            log4xxErrors: {
                description: "Should http 4xx be logged on the console",
                type: "boolean",
                default: false,
            },
            bodyLimit: {
                description: "Limit for the body size.",
                type: "string",
                default: "100mb"
            },
            rateLimit: {
                description: "The number of requests that should be handled per second. If unset or set to 0, the rate limiter will be disabled.",
                type: "number"
            }
        })
        .argv;
}
