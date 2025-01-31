import { MahasiswaRepository } from "../repositories/MahasiswaRepository";

export class ListAllMahasiswa {
    private mahasiswaRepository: MahasiswaRepository;

    constructor(mahasiswaRepository: MahasiswaRepository) {
        this.mahasiswaRepository = mahasiswaRepository;
    }

    get = async (nip?: string, idPembimbing?: string): Promise<any[]> => {

        let mahasiswas;

        if (nip) {
            mahasiswas = await this.mahasiswaRepository.getAllMahasiswaByDPP(nip);
        } else if (idPembimbing) {
            mahasiswas = await this.mahasiswaRepository.getAllMahasiswaByPembimbing(idPembimbing);
        } else {
            throw new Error('RoleNotFound');
        }

        if (!mahasiswas || mahasiswas.length === 0) throw new Error('list of all mahasiswa not found');

        mahasiswas.forEach((val, idx) => {
            // val.

            // if tgl masuk > 4 tahun (graduate)
        })

        return mahasiswas;
    }

    getNimWithUsername = async (username: string): Promise<string> => {
        const { nim } = await this.mahasiswaRepository.getNimWithUsername(username)
        .catch((err: any) => {
            throw new Error(err?.message);
        });

        return nim;

    }

    
    getNipDosenBySupervisedNIM = async (nim: string) => {
        const { nip } = await this.mahasiswaRepository.getNipFromNim(nim);

        return nip;
    }
}