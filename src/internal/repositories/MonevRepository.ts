import { Prisma } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import { Article } from "../../../types/interfaces/interface.common";
import { LogbookRepository } from "./LogbookRepository";

export class MonevRepository extends BaseRepository {

    logbookIsNotHaveMonev = async (logbookId: string) => {
        return await MonevRepository._prisma.monev.findFirstOrThrow({
            where: {
                kode_logbook: logbookId
            }
        })
    }

    createNewMonev = async (date: string, time: string, idLogbook: string, monevId: string) => {
        return await MonevRepository._prisma.monev.create({
            data: {
                id: monevId,
                date: new Date(`${date} ${time}`),
                status_dosen: false,
                status_pembimbing: false,
                kode_logbook: idLogbook
            },
        })
    }

    findAllMonevByLogbookCode = async (logbookCode: string[]) => {
        return await MonevRepository._prisma.monev.findMany({
            where: {
                kode_logbook: {
                    in: logbookCode
                }
            }
        });
    }

    getMonevWithLogbook = async (monevId: string) => {
        return await MonevRepository._prisma.monev.findFirstOrThrow({
            where: {
                id: monevId
            },
            include: {
                logbook: {
                    select: {
                        id_user: true,
                        nim: true,
                        nip: true,
                        // kode_logbook: true
                    }
                }
            }
        })
    }

    updateStatusDosenInMonev = async (idMonev: string, statusDosen: boolean) => {
        await MonevRepository._prisma.monev.update({
            where: {
                id: idMonev
            },
            data: {
                status_dosen: statusDosen
            }
        })
    }

    updateStatusPembimbingInMonev = async (idMonev: string, statusPembimbing: boolean) => {
        await MonevRepository._prisma.monev.update({
            where: {
                id: idMonev
            },
            data: {
                status_pembimbing: statusPembimbing
            }
        })
    }

    checkAvailabilityStatus = async (idMonev: string) => {
        return await MonevRepository._prisma.monev.findFirst({
            where: {
                id: idMonev
            },
            select: {
                status_dosen: true,
                status_pembimbing: true
            }
        })
    }

    updateMonev = async (idMonev: string, logbookCode: string, monevSchedule: string) => {
        return await MonevRepository._prisma.monev.update({
            where: {
                id: idMonev
            },
            data: {
                kode_logbook: logbookCode,
                date: monevSchedule,
                status_dosen: undefined,
                status_pembimbing: undefined
            }
        })
    }
}