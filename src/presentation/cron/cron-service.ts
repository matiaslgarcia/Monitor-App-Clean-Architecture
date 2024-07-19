import { CronJob } from "cron"

type CronTime = string | Date
type OnTike = () => void;

export class CronService {


    static createJob(cronTime: CronTime, onTick: OnTike): CronJob {
        const job = new CronJob(cronTime, onTick);

        job.start();

        return job;
    }
}