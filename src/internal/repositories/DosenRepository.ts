import { BaseRepository } from "./BaseRepository";

export class DosenRepository extends BaseRepository {
    createNewDosen = async (username: string, nip: string) => {
        return await DosenRepository._prisma.dosen.create({
            data: {
                nip: nip,
                status: true,
                username: username
            }
        })
    };

    getAllMahasiswaByDosen = async (nip: string) => {
        return await DosenRepository._prisma.dosen.findMany({
            where: {
                nip: nip
            }
        });
    }

}