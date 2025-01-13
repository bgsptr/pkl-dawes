import { Prisma } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";
import { Article } from "../../../types/interfaces/interface.common";
import { LogbookRepository } from "./LogbookRepository";

export class MonevRepository extends BaseRepository {

    createNewMonev = async (date: string, time: string, idLogbook: string, monevId: string) => {
        await MonevRepository._prisma.monev.create({
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

    getMonevWithLogbook = async () => {
        return await MonevRepository._prisma.monev.findFirst({

        })
    }

    updateStatusMonev = async (idMonev: string, status: string) => {
        await MonevRepository._prisma.monev.update({
            where: {
                id: idMonev
            },
            data: {
                status_dosen: status
            }
        })
    }
}