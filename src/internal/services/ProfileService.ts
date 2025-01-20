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

    getRole = async (email: string) => {
        const { role } = await this.userRepository.findRoleOfUser(email);

        if (!role) throw new Error("can't found role of user");
        return role
    }

    getUsernameWithEmail = async (email: string) => {
        return await this.userRepository.findUserByEmail(email);
    }
}