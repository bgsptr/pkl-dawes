import e, { Response } from "express";
import { AuthenticatedRequest } from "../../types/interfaces/interface.common";
import { MonevService } from "../internal/services/MonevService";
import { ProfileService } from "../internal/services/ProfileService";
import { LogbookService } from "../internal/services/LogbookService";
import { Logbook, RoleUser } from "@prisma/client";
import { ListAllMahasiswa } from "../internal/services/ListAllMahasiswa";

export class MonevHandler {

    private monevService;
    private profileService;
    private logbookService;
    private mahasiswaService;

    constructor(monevService: MonevService, profileService: ProfileService, logbookService: LogbookService, mahasiswaService: ListAllMahasiswa) {
        this.monevService = monevService;
        this.profileService = profileService;
        this.logbookService = logbookService;
        this.mahasiswaService = mahasiswaService
    }
    
    fetchHistories = async (req: AuthenticatedRequest, res: Response) => {
        const { email } = req;

        if (!email) return res.status(401).json({
            error: true,
            message: 'unauthorized user'
        });

        const role = await this.profileService.getRole(email);

        // get all logbook from selected user
        if (!role) return res.status(403).json({
            error: false,
            message: "forbidden can't access resource"
        })
        
        const { username } = await this.profileService.getUsernameWithEmail(email);

        if (username) {
            
            // logbook empty return
            const logbooks = await this.monevService.getLogbooks(role, username);

            if (logbooks?.length === 0) return res.status(404).json({
                error: true,
                message: "user doesn't involved with any logbook"
            });

            // using n+1 solution to fetch monev from logbook
            let logbookBatch: string[] = [];

            logbooks?.map((data: Logbook) => {
                logbookBatch.push(data?.kode_logbook);
            })

            const monevDatas = await this.monevService.fetchHistories(logbookBatch);

            return res.status(200).json({
                error: false,
                message: `logbooks find on user with email ${email}`,
                result: monevDatas,
            })
        }

        return res.status(500).json({
            error: true,
            message: "unexpected errors occured"
        })

    }

    createMonev = async (req: AuthenticatedRequest, res: Response) => {
        const { email, role } = req;

        if (!email) return res.status(401).json({
            error: true,
            message: "unathorized user",
        })

        if (!role && role !== RoleUser.MAHASISWA) return res.status(403).json({
            error: true,
            message: "forbidden to create monev",
        })

        // const { } = req.body

        try {
            const { username } = await this.profileService.getUsernameWithEmail(email);
            const nim = await this.mahasiswaService.getNimWithUsername(username);

            await this.monevService.submitNewMonev(req.body, nim);

            return res.status(201).json({
                error: false,
                message: 'success create monev'
            })

        } catch(error: any) {
            return res.status(500).json({
                error: true,
                message: error?.message
            })
        }

    }

    updateMonev = async (req: AuthenticatedRequest, res: Response) => {
        const { email } = req;

        const { monevId } = req.params;
        // const { date, jam, utc } = req.body;

        const monevIsUpdated = await this.monevService.updateAndResetMonevStatus(monevId, req.body);

        if (!monevIsUpdated) return res.status(403).json({
            error: true,
            message: "forbidden to update due to status monev is approved"
        })

        return res.status(200).json({
            error: false,
            message: `status monev with id ${monevId} is updated successfully`
        })
        // status dosen or pembimbing rejected monev => user can update
        // update status to null for dosen and pembimbing 

        // await this.monevService.updateAndResetMonevStatus(req.body);
    }

    viewDetailApprovedMonev = async (req: AuthenticatedRequest, res: Response) => {
        // cek if user is authenticated or not
        const { email, role } = req;

        const { monevId } = req.params;

        if (!email || !role) return res.status(401).json({
            error: true,
            message: "user is not authenticated",
        });

        // check user involved with choosen monev => check in logbook table, otherwise unallowed to access

        const { username } = await this.profileService.getUsernameWithEmail(email);
        
        await this.monevService.isUserInvolvedWithLogbookMonev(username, role, monevId);
    }
}