import { Pembimbing } from "@prisma/client";
// import { JournalRepositoryInterface } from "../../domain/interfaces/JournalRepositoryInterface";
import { BaseRepository } from "./BaseRepository";

export class PembimbingRepository
  extends BaseRepository
{
  createNewPembimbing = async (userId: string, username: string, instanceName: string) => {
    await PembimbingRepository._prisma.pembimbing.create({
      data: {
        id_user: userId,
        status: true,
        nama_instansi: instanceName,
        username: username,
        // gelar: null,
        telp: "",
        nama: ""
  
      }
    })
  };

  getAllMahasiswaByPembimbing = async (pembimbingId: string) => {
    return await PembimbingRepository._prisma.pembimbing.findMany({
        where: {
            id_user: pembimbingId
        }
    });
  }

  getPembimbingInformation = async (username: string): Promise<Pembimbing | null> => {
    return await PembimbingRepository._prisma.pembimbing.findUnique({
      where: {
        username: username
      }
    })
  }
}
