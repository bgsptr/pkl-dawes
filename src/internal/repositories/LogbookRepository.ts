import { BaseRepository } from "./BaseRepository";

export interface LogbookRepoInterface {
    logbookCode: string;
    logbookName: string;
    startDate: Date;
    endDate: Date;
    status?: boolean;
    nip: string;
    nim: string;
    idPembimbing: string;
}

export class LogbookRepository extends BaseRepository {
    createNewLogbook = async (logbook: LogbookRepoInterface, idLogbook: string) => {
        const { logbookCode, logbookName, startDate, endDate, nip, nim, idPembimbing } = logbook;
        return await LogbookRepository._prisma.logbook.create({
            data: {
                kode_logbook: logbookCode,
                logbook_title: logbookName,
                date_start: startDate,
                date_end: endDate,
                nip,
                nim,
                id_user: idPembimbing,
                status: false
            }
        })
    }

    getAllLogbookByNim = async (nim: string) => {
        return await LogbookRepository._prisma.logbook.findMany({
            where: {
                nim: nim
            }
        });
    }

    getAllLogbookByNip = async (nip: string) => {
        return await LogbookRepository._prisma.logbook.findMany({
            where: {
                nip: nip
            }
        });
    }

    getAllLogbookByIdPembimbing = async (pembimbingId: string) => {
        return await LogbookRepository._prisma.logbook.findMany({
            where: {
                id_user: pembimbingId
            }
        });
    }

    updateLogbookById = async (id: string, logbook: LogbookRepoInterface) => {
        const { logbookName, startDate, endDate, nip, nim, idPembimbing } = logbook;

        return await LogbookRepository._prisma.logbook.update({
            data: {
                id_user: idPembimbing,
                nim: nim,
                nip: nip,
                date_end: endDate,
                date_start: startDate,
                logbook_title: logbookName
            },
            where: {
                kode_logbook: id
            }
        });
    }

    findByCode = async (logbookCode: string) => {
        return await LogbookRepository._prisma.logbook.findFirst({
            where: {
                kode_logbook: logbookCode
            }
        })
    }
}