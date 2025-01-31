import { LogbookDetailRepository } from "../repositories/LogbookDetailRepository";
import { LogbookRepository } from "../repositories/LogbookRepository";
import { UserRepository } from "../repositories/UserRepository";
import { MahasiswaRepository } from "../repositories/MahasiswaRepository";
import { LogbookDetail } from "@prisma/client";

export class LogbookDetailService {

    private logbookDetailRepository: LogbookDetailRepository;
    private logbookRepository: LogbookRepository;
    private userRepository: UserRepository
    private mahasiswaRepository: MahasiswaRepository;

    constructor(logbookDetailRepository: LogbookDetailRepository, logbookRepository: LogbookRepository, userRepository: UserRepository, mahasiswaRepository: MahasiswaRepository) {
        this.logbookDetailRepository = logbookDetailRepository;
        this.logbookRepository = logbookRepository;
        this.userRepository = userRepository;
        this.mahasiswaRepository = mahasiswaRepository;
    }

    createOrUpdate = async (eventBody: any, dateQuery?: string) => {
        const { id, date, activity, log_content } = eventBody;
        // const logbook = await this.logbookRepository.findByCode(kode_logbook);

        // if (!logbook) return res.status(404).json({
        //     error: true,
        //     message: `logbook with id: ${kode_logbook} is not exist`
        // })

        const data: LogbookDetail = {
            id: "", 
            date: date,
            keterangan: log_content,
            aktivitas: activity,
            status: true,
            file_surat: "",
            ttd: "",
            kode_logbook: ""
        }

        if (!dateQuery) {
            await this.logbookDetailRepository.updateExistingLogEvent(data);
        }

        // save to logbook detail table
        await this.logbookDetailRepository.createNewLog(data);


    }

    fetchEventByDay = async (logbookId: string, email: string) => {
        const user = await this.userRepository.findUserByEmail(email);
        const mahasiswa = await this.mahasiswaRepository.getNimWithUsername(user?.username);
        await this.logbookRepository.getAllLogbookByNim(mahasiswa?.nim);

        const currDay = new Date();

        const date = currDay.getUTCDate();
        const month = currDay.getMonth();
        const year = currDay.getFullYear();

        const startOfDay = new Date(Date.UTC(year, month, date, 0, 0, 0));
        const endOfDay = new Date(Date.UTC(year, month, date, 23, 59, 59));

        const event = await this.logbookDetailRepository.findBetweenStartAndLastDay(startOfDay, endOfDay, logbookId);

        if (!event) throw new Error(`can't found log in date ${year-month-date}`);

        return event;
    }

    // fetchLogbookWeekly = async () => {

    // }

    fetchLogbookMonthly = async (logbookId: string) => {
        // error
        const monthSelected = new Date().toISOString();

        const stringDate = monthSelected.split("T");

        const [year, month, date] = stringDate[0].split("-");

        const startOfDay = new Date(Date.UTC(Number(year), Number(month) - 1, 1));
        const endOfDay = new Date(Date.UTC(Number(year), Number(month), 0));

        return await this.logbookDetailRepository.findBetweenStartAndLastDay(startOfDay, endOfDay, logbookId);
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