import { CronService } from "./cron/cron-service"
import { CheckService } from "../domain/use-cases/checks/checks-service"
import { LogRepositoryImplementation } from "../infrastructure/repositories/log.repository"
import { FileSystemDataSource } from "../infrastructure/datasources/file-system.datasource"
import { EmailService } from "./email/email.service"
import { SendEmailLogs } from "../domain/use-cases/email/send-email.use-case"
import { MongoLogDataSource } from "../infrastructure/datasources/mongo-log.datasource"
import { PostgresLogDataSource } from "../infrastructure/datasources/postgres-log.datasource"
import { CheckServiceMultiple } from "../domain/use-cases/checks/checks-service.multiple"


const fsLogRepository = new LogRepositoryImplementation(
    new FileSystemDataSource(),
)
const mongoLogRepository = new LogRepositoryImplementation(
    new MongoLogDataSource(),
)
const postgresLogRepository = new LogRepositoryImplementation(
    new PostgresLogDataSource(),
)

const emailService = new EmailService();

export class ServerApp {


    public static start() {
        console.log('Server started...')

        // new SendEmailLogs(
        //     emailService,
        //     LogRepository
        // ).execute(['matiasgarcia444@gmail.com', 'm.a.t.u_94@hotmail.com'])


        CronService.createJob(
            '*/5 * * * * *',
            () => {
                const url = 'http://localhost:3000'
                new CheckServiceMultiple(
                    () => console.log(` ${url} is ok`),
                    (error) => console.log(error),
                    [fsLogRepository, mongoLogRepository, postgresLogRepository]
                ).execute(url)
            }
        )
    }
}