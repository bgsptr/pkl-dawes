import { BaseRepository } from "./BaseRepository"

export class LogbookDetailRepository extends BaseRepository {

    check = async (logbookCode: string) => {
        return await LogbookDetailRepository._prisma.logbookDetail.findFirstOrThrow({
            where: {
                kode_logbook: logbookCode
            }
        })
    }

    findBetweenStartAndLastDay = async (startOfDay: Date, endOfDay: Date) => {
        return await LogbookDetailRepository._prisma.logbookDetail.findFirst({
            where: {
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            }
        })
    }

    createNewLog = async (log: LogDetailEntity) => {
        const { id, date, activity, keterangan, status, ttd, kode_logbook } = log;
        return await LogbookDetailRepository._prisma.logbookDetail.create({
            data: {
                id,
                date,
                keterangan,
                aktivitas: activity,
                status,
                kode_logbook,
                ttd: ttd
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