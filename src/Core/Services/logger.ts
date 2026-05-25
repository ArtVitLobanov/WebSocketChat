import fs from 'fs';
import path from 'path';

export class Logger {
    private static logFilePath = path.join(process.cwd(), 'log.txt');

    private static formatArgs(args: any[]): string {
        return args.map(arg => {
            if (arg instanceof Error) {
                return arg.stack || arg.message;
            }
            if (typeof arg === 'object') {
                try {
                    return JSON.stringify(arg, null, 2);
                } catch {
                    return String(arg);
                }
            }
            return String(arg);
        }).join(' ');
    }

    private static getTimestamp(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    private static write(level: 'EVENT' | 'ERROR' | 'WARN' | 'DEBUG', args: any[]): void {
        const timestamp = this.getTimestamp();
        const message = this.formatArgs(args);
        const logLine = `[${timestamp}] [${level}] ${message}\n`;

        if (level === 'ERROR') {
            console.error(logLine.trim());
        } else if (level === 'WARN') {
            console.warn(logLine.trim());
        } else {
            console.log(logLine.trim());
        }

        try {
            fs.appendFileSync(this.logFilePath, logLine, 'utf8');
        } catch (err) {
            console.error('CRITICAL: Logger failed to write to log.txt:', err);
        }
    }

    public static event(...args: any[]): void {
        this.write('EVENT', args);
    }

    public static warn(...args: any[]): void {
        this.write('WARN', args);
    }

    public static error(...args: any[]): void {
        this.write('ERROR', args);
    }

    public static debug(...args: any[]): void {
        this.write('DEBUG', args);
    }
}