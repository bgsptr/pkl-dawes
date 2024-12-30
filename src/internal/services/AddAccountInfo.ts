import { DosenRepository } from "../repositories/DosenRepository";
import { PembimbingRepository } from "../repositories/PembimbingRepository";
import { v4 as uuidv4 } from "uuid";

export class AddAccountInfo {

    private dosenRepository: DosenRepository;
    private pembimbingRepository: PembimbingRepository;

    constructor(dosenRepository: DosenRepository, pembimbingRepository: PembimbingRepository) {
        this.dosenRepository = dosenRepository;
        this.pembimbingRepository = pembimbingRepository;
    }

    execute = async (role: string, username: string, instanceName: string, file: File) => {
        if (!file.type.startsWith("pdf")) throw new Error('FormatFileMustPDF');

        if (file.size > 2000000) throw new Error('FileLessThan2MB');

        switch (role) {
            case "dosen": {
                await this.dosenRepository.createNewDosen(username);
                break;
            }
            case "pembimbing": {
                const userId = uuidv4();
                await this.pembimbingRepository.createNewPembimbing(userId, username, instanceName);
                break;
            }
            default: {
                throw new Error(`Unknown role: ${role}`);
            }
        }

    }
}