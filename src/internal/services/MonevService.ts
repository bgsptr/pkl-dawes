import { LogbookRepository } from "../repositories/LogbookRepository";
import { MonevRepository } from "../repositories/MonevRepository";

enum Status {
    Rejected = 'rejected',
    Approved = 'approved',
    Pending = 'pending'
}

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

    updateStatus = async (idMonev: string, status: number, nip?: string) => {
        let statusString: string;

        await this.monevRepository.getMonevWithLogbook();

        switch(status) {
            case 0:
                statusString = Status.Rejected;
                break;
            case 1:
                statusString = Status.Approved;
                break;
            case 2:
                statusString = Status.Pending;
                break;
            default:
                throw new Error(`Invalid status code: ${status}`);
        }

        await this.monevRepository.updateStatusMonev(idMonev, statusString)
    }
}