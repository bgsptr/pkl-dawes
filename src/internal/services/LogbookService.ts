import { Logbook } from "@prisma/client";
import { LogbookRepository } from "../repositories/LogbookRepository";
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

    newLogbook = async (role: string, logbook: Logbook, idLogbook: string) => {
        const regexRole = role.match(/A-Za-z0-9/);
        if (!role.includes("MAHASISWA")) throw new Error('forbidden');

        return await this.logbookRepository.createNewLogbook(logbook, idLogbook);
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

    updateExistingLogbook = async (logbookCode: string, logbook: Logbook): Promise<boolean> => {
        const updatedLogbook = await this.logbookRepository.updateLogbookById(logbookCode, logbook);

        if (!updatedLogbook) return false;

        return true;
    }

    isLogbookCodeExists = async (logbookCode: string): Promise<boolean> => {
        const logbook = await this.logbookRepository.findByCode(logbookCode);
        return !!logbook;
    }
}