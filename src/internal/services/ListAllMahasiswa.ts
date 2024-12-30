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

        return mahasiswas;
    }
}