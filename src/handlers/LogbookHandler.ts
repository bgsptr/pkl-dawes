import e, { Response } from "express";
import { AuthenticatedRequest } from "../../types/interfaces/interface.common";
import { LogbookService } from "../internal/services/LogbookService";
import { LogbookDetailService } from "../internal/services/LogbookDetailService";
import { ProfileService } from "../internal/services/ProfileService";
import { ListAllMahasiswa } from "../internal/services/ListAllMahasiswa";
import { DosenService } from "../internal/services/DosenService";

export class LogbookHandler {

    private logbookService: LogbookService;
    private logbookDetailService: LogbookDetailService;
    private profileService: ProfileService;
    private listAllMahasiswaService: ListAllMahasiswa;
    private dosenService: DosenService;

    constructor(logbookService: LogbookService, logbookDetailService: LogbookDetailService, profileService: ProfileService, dosenService: DosenService, listAllMahasiswaService: ListAllMahasiswa) {
        this.logbookService = logbookService;
        this.logbookDetailService = logbookDetailService;
        this.profileService = profileService;
        this.listAllMahasiswaService = listAllMahasiswaService;
        this.dosenService = dosenService;
        this.listAllMahasiswaService = listAllMahasiswaService;
    }

    createOrUpdateLogbook = async (req: AuthenticatedRequest, res: Response) => {
        const { email, role } = req;
        const { logbookId } = req.params;

        if (!email || role !== "Mahasiswa") return res.status(403).json({ error: true, message: "forbidden role" });

        try {
            const { username } = await this.profileService.getUsernameWithEmail(email);

            const nim = await this.listAllMahasiswaService.getNimWithUsername(username);

            const nip = await this.listAllMahasiswaService.getNipDosenBySupervisedNIM(nim);

            if (logbookId && await this.logbookService.isLogbookCodeExists(logbookId)) {
                await this.logbookService.updateExistingLogbook(logbookId, req.body);

                return res.status(200).json({
                    error: false,
                    message: `success update logbook with id: ${logbookId}`
                })
            }

            await this.logbookService.newLogbook(role, req.body, nip, nim);

            return res.status(200).json({
                error: false,
                message: `success create logbook`
            })

        } catch (error: any) {
            return res.status(500).json({
                error: true,
                message: error?.message
            })
        }
    }

    getMyLogbook = async (req: AuthenticatedRequest, res: Response) => {

        const { email, role } = req;

        if (!email || role !== "Mahasiswa") return res.status(403).json({ error: true, message: "forbidden role" });

        // get nim by username
        const logbooks = await this.logbookService.findLogbookByNIM(email);

        if (!logbooks || logbooks?.length === 0) return res.status(404).json({ status: false, message: "logbooks not found" });

        return res.status(200).json({
            status: true,
            message: `logbook fetched successfully for user with email: ${email}`,
            logbooks: logbooks
        });
    }

    fetchCurrentDayLogbook = async (req: AuthenticatedRequest, res: Response) => {
        const { logbookId } = req.params;

        const { email, role } = req;

        if (!email) return res.status(401).json({ error: true, message: "unathorized" });
        
        try {
            const result = await this.logbookDetailService.fetchEventByDay(logbookId, email);

            return res.status(200).json({
                error: false,
                message: `successfully log event`,
                result
            });

        } catch (error: any) {
            return res.status(404).json({
                error: true,
                message: error?.message
            })
        }
    }

    logbookEventEveryMonthly = async () => {

    }

    addLogbookDaily = async (req: AuthenticatedRequest, res: Response) => {
        // check if kode_logbook exist in table logbook, otherwise return error or false
        const { logbookCode } = req.body;
        const logbookIsExist = await this.logbookService.isLogbookCodeExists(logbookCode);

        if (!logbookIsExist) return res.status(404).json({
            error: true,
            message: `logbook with id ${logbookCode} is not exist`
        })

        // create event
        await this.logbookDetailService.createOrUpdate(req.body);
        
    }

    updateLogbookByDateQuery = async (req: AuthenticatedRequest, res: Response) => {
        const { selectedDate } = req.query; // must contain



    }

    deleteLogInLogbook = async (req: AuthenticatedRequest, res: Response) => {
        const { email } = req;
        const { logId } = req.params;

        if (!email) return res.status(401).json({
            error: true,
            message: 'user is not authorized'
        });

        try {
            const { username } = await this.profileService.getUsernameWithEmail(email);

            const nim = await this.listAllMahasiswaService.getNimWithUsername(username);

            await this.logbookDetailService.delete(logId, nim);

            return res.status(200).json({
                error: false,
                message: `success to delete log event with id: ${logId}`
            })

        } catch (error: any) {

            return res.status(403).json({
                error: true,
                message: error?.message,
            });
        }
    }

    
}