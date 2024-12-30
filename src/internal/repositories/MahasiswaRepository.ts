import { BaseRepository } from "./BaseRepository";

export class MahasiswaRepository extends BaseRepository {
    getAllMahasiswa = async () => {
        return await MahasiswaRepository._prisma.mahasiswa.findMany();
    }

    getNimWithUsername = async (username: string) => {
        return await MahasiswaRepository._prisma.mahasiswa.findUnique({
            where: {
                username: username
            },
            select: {
                nim: true
            }
        });
    }
}