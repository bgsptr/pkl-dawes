import { LogbookDetail } from "@prisma/client"
import { BaseRepository } from "./BaseRepository"

export class LogbookDetailRepository extends BaseRepository {

    check = async (logbookCode: string) => {
        return await LogbookDetailRepository._prisma.logbookDetail.findFirstOrThrow({
            where: {
                kode_logbook: logbookCode
            }
        })
    }

    findBetweenStartAndLastDay = async (startOfDay: Date, endOfDay: Date, logbookId: string) => {
        return await LogbookDetailRepository._prisma.logbookDetail.findFirst({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                kode_logbook: logbookId
            }
        })
    }

    createNewLog = async (log: LogbookDetail) => {
        const { id, date, aktivitas, keterangan, status, ttd, kode_logbook } = log;
        return await LogbookDetailRepository._prisma.logbookDetail.create({
            data: {
                id,
                date,
                keterangan,
                aktivitas: aktivitas,
                status,
                kode_logbook,
                ttd: ttd,
                file_surat: ""
            }
        })
    }

    updateExistingLogEvent = async (updateLogData: LogbookDetail) => {
        return await LogbookDetailRepository._prisma.logbookDetail.update({
            data: {
                // id: updateLogData.id,
                date: updateLogData.date,
                keterangan: updateLogData.keterangan,
                aktivitas: updateLogData.aktivitas,
                status: updateLogData.status,
                kode_logbook: updateLogData.kode_logbook,
                ttd: updateLogData.ttd,
                file_surat: updateLogData.file_surat
            },
            where: {
                id: updateLogData.id
            }
        })
    }

    findAllMonevWithEachLogbookId = async (batchOfLogbookCode: string[]) => {
        await LogbookDetailRepository._prisma.logbookDetail.findMany({
            where: {
                kode_logbook: {
                    in: batchOfLogbookCode
                }
            }
        })
    }

    deleteLog = async (logId: string) => {
        return await LogbookDetailRepository._prisma.logbookDetail.delete({
            where: {
                id: logId
            }
        })
    }
}