import { spawn } from "child_process";
import { Writable } from 'stream';
import { BadRequestError } from './error';

export class Dot {
    private static instance: Dot | undefined;
    private constructor() { }
    public static getInstance(): Dot {
        if (!this.instance) {
            this.instance = new Dot();
        }
        return this.instance;
    }

    async generatePng(stream: Writable, input: string | Buffer): Promise<void> {
        return await this.generate(stream, input, ["-Tpng"]);
    }

    async generateSvg(stream: Writable, input: string | Buffer): Promise<void> {
        return await this.generate(stream, input, ["-Tsvg"]);
    }

    async generate(stream: Writable, input: string | Buffer, dotArgs: string[]): Promise<void> {
        if (Object.keys(input).length === 0) { //
            throw new BadRequestError();
        }
        return new Promise((resolve, reject) => {
            let childProcess = spawn("dot", dotArgs, {
                stdio: [
                    "pipe", // StdIn.
                    "pipe",    // StdOut.
                    "inherit",    // StdErr.
                ],
            });
            childProcess.stdout.pipe(stream);
            childProcess.stdin.write(input);
            childProcess.stdin.end();
            childProcess.on("close", (code) => {
                if (code !== 0) {
                    reject(new Error(`The DOT command exited with the unsuccessful statuscode '${code}'.`));
                }
                resolve();
            });
        })
    }
}
