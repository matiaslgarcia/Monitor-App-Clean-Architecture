import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";
import { PrismaClient, SeverityLevel } from '@prisma/client';

const prisma = new PrismaClient()

const severityEnum = {
    low: SeverityLevel.LOW,
    medium: SeverityLevel.MEDIUM,
    high: SeverityLevel.HIGH
}

export class PostgresLogDataSource implements LogDataSource {

    async saveLog(log: LogEntity): Promise<void> {

        const level = severityEnum[log.level]
        const newLog = await prisma.logModel.create({
            data: {
                ...log,
                level: level
            }
        });

        console.log(newLog)
    }
    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        const level = severityEnum[severityLevel]

        const dbLogs = await prisma.logModel.findMany({
            where: { level }
        })

        return dbLogs.map(dbLog => LogEntity.fromObject(dbLog))
    }

}