import { RoleUser } from "@prisma/client";
import { LogbookRepository } from "../repositories/LogbookRepository";
import { MonevRepository } from "../repositories/MonevRepository";
import { MahasiswaRepository } from "../repositories/MahasiswaRepository";
import { DosenRepository } from "../repositories/DosenRepository";
import { PembimbingRepository } from "../repositories/PembimbingRepository";
import { LogbookDetailRepository } from "../repositories/LogbookDetailRepository";

enum Status {
    Rejected = 'rejected',
    Approved = 'approved',
    Pending = 'pending'
}

export class MonevService {
    private monevRepository: MonevRepository;
    private logbookRepository: LogbookRepository;
    private logbookDetailRepository: LogbookDetailRepository;
    private mahasiswaRepository: MahasiswaRepository;
    private dosenRepository: DosenRepository;
    private pembimbingRepository: PembimbingRepository;

    constructor(
        monevRepository: MonevRepository, 
        logbookRepository: LogbookRepository, 
        logbookDetailRepository: LogbookDetailRepository, 
        mahasiswaRepository: MahasiswaRepository, 
        dosenRepository: DosenRepository, 
        pembimbingRepository: PembimbingRepository
    ) {
        this.monevRepository = monevRepository;
        this.logbookRepository = logbookRepository;
        this.logbookDetailRepository = logbookDetailRepository;
        this.pembimbingRepository = pembimbingRepository;
        this.mahasiswaRepository = mahasiswaRepository;
        this.dosenRepository = dosenRepository;
    }

    submitNewMonev = async (requestData: any, nim: string) => {
        const { logbookCode, date, time, utc } = requestData;

        // check is logbook exist in monev table
        try {
            await this.monevRepository.logbookIsNotHaveMonev(logbookCode);

            throw new Error(`can't create monev, logbook with id: ${logbookCode}, already have monev`);
            
        } catch (error) {
            // can create new

            const monevId = generateMonevId();

            this.monevRepository.createNewMonev(date, time, logbookCode, monevId)
        }
    }

    isUserInvolvedWithLogbookMonev = async (username: string, role: RoleUser | string, monevId: string) => {
        let credential: string | null = null;
        switch(role) {
            case "DOSEN":
                const { nip } = await this.dosenRepository.nipDosenByUsername(username);
                credential = nip ?? null;
                break;
            case "MAHASISWA":
                const mahasiswaData = await this.mahasiswaRepository.getNimWithUsername(username);
                credential = mahasiswaData?.nim ?? null;
                break;
            case "PEMBIMBING":
                const pembimbingData = await this.pembimbingRepository.getPembimbingInformation(username);
                credential = pembimbingData?.id_user ?? null;
                break;
            default:
                throw new Error(`Unknown role: ${role}`);
        }

        const monevWithLogbookData = await this.monevRepository.getMonevWithLogbook(monevId);
        console.log(monevWithLogbookData);

        // compare credential with id credential in database, try log first

    }

    getLogbooks = async (role: string, username: string) => {
        if (role === RoleUser.MAHASISWA) {
            const data = await this.mahasiswaRepository.getNimWithUsername(username);
            if (data) return await this.logbookRepository.getAllLogbookByNim(data.nim);
        } else if (role === RoleUser.DOSEN) {
            const data = await this.dosenRepository.nipDosenByUsername(username);
            if (data) return await this.logbookRepository.getAllLogbookByNip(data.nip);
        } else if (role === RoleUser.PEMBIMBING) {
            const data = await this.pembimbingRepository.getPembimbingInformation(username);
            if (data) return await this.logbookRepository.getAllLogbookByIdPembimbing(data.id_user);
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

        await this.monevRepository.updateStatusMonev(idMonev, statusString);
    }

    fetchHistories = async (logbookCodeArray: string[]) => {
        //
        return await this.logbookDetailRepository.findAllMonevWithEachLogbookId(logbookCodeArray);
    }

    updateAndResetMonevStatus = async (idMonev: string, monevBody: any): Promise<boolean> => {
        const data = await this.monevRepository.checkAvailabilityStatus(idMonev);

        // const { status_dosen, status_pembimbing } = data;

        // if status is approved, mahasiswa can't update monev
        if (data?.status_dosen || data?.status_pembimbing) return false;

        const { logbookCode, date, time, utc } = monevBody;

        const combinedDateTime = `${date}T${time}`;

        const parsedDate = new Date(combinedDateTime);

        const timestamp = parsedDate.toISOString().slice(0, 19).replace('T', '');

        await this.monevRepository.updateMonev(idMonev, logbookCode, timestamp);

        return true;
    }
}