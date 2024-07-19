import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import fs from 'fs';

export class FileSystemDataSource implements LogDataSource {

    private readonly logPath = 'logs/'
    private readonly lowLogsPath = 'logs/logs-low.log'
    private readonly mediumLogsPath = 'logs/logs-medium.log'
    private readonly highLogsPath = 'logs/logs-high.log'

    constructor() {
        this.createLogsFiles()
    }

    private createLogsFiles = () => {
        if (!fs.existsSync(this.logPath)) {
            fs.mkdirSync(this.logPath)
        }

        [
            this.lowLogsPath,
            this.mediumLogsPath,
            this.highLogsPath
        ].forEach(path => {
            if (fs.existsSync(path)) return

            fs.writeFileSync(path, '')
        })
    }


    async saveLog(newlog: LogEntity): Promise<void> {

        const logAsJson = `${JSON.stringify(newlog)}\n`
        fs.appendFileSync(this.lowLogsPath, logAsJson)

        if (newlog.level === LogSeverityLevel.low) return

        if (newlog.level === LogSeverityLevel.medium) {
            fs.appendFileSync(this.mediumLogsPath, logAsJson)
        }
        if (newlog.level === LogSeverityLevel.high) {
            fs.appendFileSync(this.highLogsPath, logAsJson)
        }

    }

    private getLogsFromFile = (path: string): LogEntity[] => {
        const content = fs.readFileSync(path, 'utf-8');

        if (content === '') return [];

        const logs = content.split('\n').map(log =>
            LogEntity.fromJson(log)
        )
        return logs

    }

    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {



        switch (severityLevel) {
            case LogSeverityLevel.low:
                return this.getLogsFromFile(this.lowLogsPath)

            case LogSeverityLevel.medium:
                return this.getLogsFromFile(this.mediumLogsPath)

            case LogSeverityLevel.high:
                return this.getLogsFromFile(this.highLogsPath)
            default:
                throw new Error(`${severityLevel} not implemented`);
        }
    }

}