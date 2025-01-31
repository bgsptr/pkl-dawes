import { Dosen, Mahasiswa } from "@prisma/client";
import { BaseRepository } from "./BaseRepository";

export class DosenRepository extends BaseRepository {
    createNewDosen = async (username: string, nip: string) => {
        return await DosenRepository._prisma.dosen.create({
            data: {
                nip: nip,
                status: true,
                username: username,
                nama: "",
                gelar: "",
                telp: ""
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

    nipDosenByUsername = async (username: string) => {
        return await DosenRepository._prisma.dosen.findFirstOrThrow({
            where: {
                username: username
            }
        });
    }
}