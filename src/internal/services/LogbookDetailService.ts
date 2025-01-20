import { Response } from "express";
import { AuthenticatedRequest } from "../../../types/interfaces/interface.common";
import { LogbookDetailRepository } from "../repositories/LogbookDetailRepository";
import { LogbookRepository } from "../repositories/LogbookRepository";

export class LogbookDetailService {

    private logbookDetailRepository: LogbookDetailRepository;
    private logbookRepository: LogbookRepository;

    constructor(logbookDetailRepository: LogbookDetailRepository, logbookRepository: LogbookRepository) {
        this.logbookDetailRepository = logbookDetailRepository;
        this.logbookRepository = logbookRepository;
    }

    create = async (req: AuthenticatedRequest, res: Response) => {
        const { id, date, activity, log_content, kode_logbook } = req.body;

        const logbook = await this.logbookRepository.findByCode(kode_logbook);

        if (!logbook) return res.status(404).json({
            error: true,
            message: `logbook with id: ${kode_logbook} is not exist`
        })

        // save to logbook detail table
        await this.logbookDetailRepository();


    }

    fetchEventByDay = async () => {
        const currDay = new Date();

        const date = currDay.getUTCDate();
        const month = currDay.getMonth();
        const year = currDay.getFullYear();

        const startOfDay = new Date(Date.UTC(year, month, date, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(year, month, date, 23, 59, 59));

        return await this.logbookDetailRepository.findBetweenStartAndLastDay(startOfDay, endOfDay);
    }

    fetchLogbookMonthly = async () => {
        const monthSelected = new Date().toISOString();

        const stringDate = monthSelected.split("T");

        const [year, month, date] = stringDate[0].split("-");

        const startOfDay = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
        const endOfDay = new Date(Date.UTC(Number(year), Number(month), 0));

        return await this.logbookDetailRepository.findBetweenStartAndLastDay(startOfDay, endOfDay);
    }

    delete = async (logbookEventId: string, nim: string) => {
        const logbooks = await this.logbookRepository.getAllLogbookByNim(nim);

        for (let logbook of logbooks) {
            
            if (logbook.kode_logbook === logbookEventId) {
                await this.logbookDetailRepository.deleteLog(logbookEventId);

                return;
            }
        }

        throw new Error(`log event with id ${logbookEventId} is not exist`);
    }

}