import { PembimbingRepository } from "../repositories/PembimbingRepository";
import { UserRepository } from "../repositories/UserRepository"

export class ProfileService {
    private userRepository: UserRepository;
    private pembimbingRepository: PembimbingRepository;

    constructor(userRepository: UserRepository, pembimbingRepository: PembimbingRepository) {
        this.pembimbingRepository = pembimbingRepository;
        this.userRepository = userRepository;
    }

    fetchProfilePembimbingPKL = async (email: string) => {
        const user = await this.userRepository.findUserByEmail(email);
        
        const data = await this.pembimbingRepository.getPembimbingInformation(user?.username);

        return data
    }
}