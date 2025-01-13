import { DosenRepository } from "../repositories/DosenRepository";
import { UserRepository } from "../repositories/UserRepository";

export class DosenService {

    constructor(private dosenRepository: DosenRepository, private userRepository: UserRepository) {
        this.dosenRepository = dosenRepository;
        this.userRepository = userRepository;
    }

    getNipDosenWithEmail = async (email: string) => {
        const { username } = await this.userRepository.findUserByEmail(email);
        return await this.dosenRepository.nipDosenByUsername(username);
    }

    updateStatusMonev = async (nip: string, idMonev: string) => {

    }
}