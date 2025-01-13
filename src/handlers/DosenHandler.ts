import { Response } from "express";
import { AuthenticatedRequest } from "../../types/interfaces/interface.common";
import { ListAllMahasiswa } from "../internal/services/ListAllMahasiswa";
import { Role } from "./ProfileHandler";
import { DosenService } from "../internal/services/DosenService";
import { MonevService } from "../internal/services/MonevService";


export class DosenHandler {

    constructor(private role: Role, private listAllMahasiswa: ListAllMahasiswa, private dosenService: DosenService, private monevService: MonevService) {
        this.role = Role.Dosen;
        this.listAllMahasiswa = listAllMahasiswa;
        this.dosenService = dosenService;
        this.monevService = monevService;
    }

    mahasiswaListedInDosen = async (req: AuthenticatedRequest, res: Response) => {
        const { email, role } = req;

        if (!email || !role ) return res.status(401).json({
            error: true,
            message: "Unauthenticated user"
        })

        if (role as string !== this.role) return res.status(403).json({
            error: true,
            message: "Forbidden acccess, only can be accessed by dosen",
        })

        const { nip } = await this.dosenService.getNipDosenWithEmail(email);

        try {
            const mahasiswas = await this.listAllMahasiswa.get(nip);

            return res.status(200).json({
                error: false,
                message: "mahasiswa fetched successfully",
                result: mahasiswas
            })

        } catch (error) {

            return res.status(404).json({
                error: false,
                message: `mahasiswa not found for dosen with nip ${nip}`
            })

        }
    }

    updateStatusMonevMahasiswa = async (req: AuthenticatedRequest, res: Response) => {
        const { email, role, body, params } = req;

        const { monevId } = params;
        const { status } = body;

        if (!email || !role ) return res.status(401).json({
            error: true,
            message: "Unauthenticated user"
        })

        if (role as string !== this.role) return res.status(403).json({
            error: true,
            message: "Forbidden acccess, only can be accessed by dosen",
        })

        try {
            await this.monevService.updateStatus(monevId, status as number);
        } catch (err) {
            throw new Error('failed to update status due to invalid request body')
        }

    }
}