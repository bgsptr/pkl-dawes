import { Response } from "express";
import { AuthenticatedRequest } from "../../types/interfaces/interface.common";
import { ProfileService } from "../internal/services/ProfileService";

export enum Role {
    Mahasiswa = "mahasiswa",
    Dosen = "dosen",
    Pembimbing = "pembimbing"
};

export class ProfileHandler {

    constructor(private profileService: ProfileService) {
        this.profileService = profileService;
    }

    getProfilePembimbingPKL = async (req: AuthenticatedRequest, res: Response) => {
        const { email, role } = req;

        if (!email || !role) return res.status(401).json({ error: true, message: "role not found" });

        if (String(role) !== Role.Pembimbing) {
            return res.status(403).json({ error: true, message: "Unauthorized access" });
        }

        try {
            const profileData = await this.profileService.fetchProfilePembimbingPKL(email);

            return res.status(200).json({
                error: false,
                message: "profile fetched successfully",
                result: profileData
            });

        } catch(err) {
            return res.status(500).json({
                error: true,
                message: "profile can't fetched",
            });
        }
    }
}
