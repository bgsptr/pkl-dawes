import { BaseRepository } from "./BaseRepository";

export class MahasiswaRepository extends BaseRepository {
    getAllMahasiswaByPembimbing = async (pembimbingId: string) => {
        return await MahasiswaRepository._prisma.mahasiswa.findMany({
            where: {
                id_user: pembimbingId
            }
        });
    }

    getAllMahasiswaByDPP = async (nip: string) => {
        return await MahasiswaRepository._prisma.mahasiswa.findMany({
            where: { nip }
        });
    }

    getNimWithUsername = async (username: string) => {
        return await MahasiswaRepository._prisma.mahasiswa.findUniqueOrThrow({
            where: {
                username: username
            },
            select: {
                nim: true
            }
        });
    }

    getNipFromNim = async (nim: string) => {
        return await MahasiswaRepository._prisma.mahasiswa.findFirstOrThrow({
            where: { nim },
            select: {
                nip: true
            }
        })
    }
}