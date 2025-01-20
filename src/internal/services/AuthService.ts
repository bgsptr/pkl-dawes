import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

export class AuthService {
    private userRepository: UserRepository;
    private jwtPrivateKey: string;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
        this.jwtPrivateKey = process.env.JWT_PRIVATE_KEY || "";
        if (!this.jwtPrivateKey) {
            throw new Error("Missing JWT private key");
        }
    }

    login = async (email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> => {

        const user = await this.userRepository.findUserByEmail(email);
        if (!user) throw new Error("User not found");

        const passwordSame = await bcrypt.compare(password, user.password);
        if (!passwordSame) throw new Error("Password does not match");

        const accessToken = jwt.sign(
            { email: user.email, role: user.role },
            this.jwtPrivateKey,
            { algorithm: "HS256", expiresIn: "1d" }
        );

        const refreshToken = randomBytes(18).toString("hex");

        return { accessToken, refreshToken };
    };

    register = async (email: string, username: string, password: string, confirmPassword: string): Promise<void> => {

        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }

        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await this.userRepository.createNewAccount(email, username, hashedPassword);
    };
}
