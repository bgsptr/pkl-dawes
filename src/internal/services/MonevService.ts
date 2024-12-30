import { LogbookRepository } from "../repositories/LogbookRepository";
import { MonevRepository } from "../repositories/MonevRepository";

export class MonevService {
    private monevRepository: MonevRepository;
    private logbookRepository: LogbookRepository;

    constructor(monevRepository: MonevRepository, logbookRepository: LogbookRepository) {
        this.monevRepository = monevRepository;
        this.logbookRepository = logbookRepository;
    }

    historyMonev = async (role: string, nim?: string, nip?: string, idPembimbing?: string) => {
        if (nim) {
            await this.logbookRepository.getAllLogbookByNim(nim);
        } else if (nip) {
            await this.logbookRepository.getAllLogbookByNip(nip);
        } else if (idPembimbing) {
            await this.logbookRepository.getAllLogbookByIdPembimbing(idPembimbing);
        } else {
            throw new Error('role not found');
        }
    }
}