import { Response } from "express";
import { AuthenticatedRequest } from "../../types/interfaces/interface.common";
import { LogbookService } from "../internal/services/LogbookService";

export class LogbookHandler {

    private logbookService: LogbookService;
    constructor(logbookService: LogbookService) {
        this.logbookService = logbookService;
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
}