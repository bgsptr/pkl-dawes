import { Logbook } from "@prisma/client";
import { LogbookRepoInterface, LogbookRepository } from "../repositories/LogbookRepository";
import { MahasiswaRepository } from "../repositories/MahasiswaRepository";
import { UserRepository } from "../repositories/UserRepository";

export class LogbookService {
    private logbookRepository: LogbookRepository;
    private userRepository: UserRepository;
    private mahasiswaRepository: MahasiswaRepository;

    constructor(logbookRepository: LogbookRepository, userRepository: UserRepository, mahasiswaRepository: MahasiswaRepository) {
        this.logbookRepository = logbookRepository;
        this.userRepository = userRepository;
        this.mahasiswaRepository = mahasiswaRepository;
    }

    newLogbook = async (role: string, logbook: any, nip: string, nim: string) => {
        const { logbook_title, date_start, date_end, id_user } = logbook;
        const regexRole = role.match(/A-Za-z0-9/);
        if (!role.includes("MAHASISWA")) throw new Error('forbidden');

        // create idLogbook
        const idLogbook = "";

        // export interface Logbook {
        //     logbookCode: string;
        //     logbookName: string;
        //     startDate: Date;
        //     endDate: Date;
        //     status?: boolean;
        //     nip: string;
        //     nim: string;
        //     idPembimbing: string;
        // }

        const strToDateStart = new Date(date_start);
        const strToDateEnd = new Date(date_end);

        const logbookData: LogbookRepoInterface = {
            logbookCode: idLogbook,
            logbookName: logbook_title,
            startDate: strToDateStart,
            endDate: strToDateEnd,
            status: true,
            nip,
            nim,
            idPembimbing: id_user ?? ""
        }

        return await this.logbookRepository.createNewLogbook(logbookData, idLogbook);
    }

    findLogbookByNIM = async (email: string): Promise<Logbook[] | null> => {

        try {
            const user = await this.userRepository.findUserByEmail(email);
            const mahasiswa = await this.mahasiswaRepository.getNimWithUsername(user?.username);

            if (!mahasiswa) return null
            const logbooks = await this.logbookRepository.getAllLogbookByNim(mahasiswa?.nim);

            if (!logbooks || logbooks.length === 0) throw new Error("logbook not found");
    
            return logbooks;

        } catch(error) {
            throw new Error('error get logbook, user not found');
        }

    }

    updateExistingLogbook = async (logbookCode: string, logbook: any): Promise<boolean> => {
        const updatedLogbook = await this.logbookRepository.updateLogbookById(logbookCode, logbook);

        if (!updatedLogbook) return false;

        return true;
    }

    isLogbookCodeExists = async (logbookCode: string): Promise<boolean> => {
        const logbook = await this.logbookRepository.findByCode(logbookCode);
        return !!logbook;
    }
}