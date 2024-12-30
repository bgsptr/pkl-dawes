-- CreateTable
CREATE TABLE `User` (
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('DOSEN', 'MAHASISWA', 'PEMBIMBING') NULL,

    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dosen` (
    `nip` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `telp` VARCHAR(191) NOT NULL,
    `gelar` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL,
    `username` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Dosen_nip_key`(`nip`),
    UNIQUE INDEX `Dosen_telp_key`(`telp`),
    UNIQUE INDEX `Dosen_username_key`(`username`),
    PRIMARY KEY (`nip`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mahasiswa` (
    `nim` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `semester` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Mahasiswa_username_key`(`username`),
    PRIMARY KEY (`nim`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pembimbing` (
    `id_user` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `telp` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL,
    `nama_instansi` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Pembimbing_username_key`(`username`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Logbook` (
    `kode_logbook` VARCHAR(191) NOT NULL,
    `logbook_title` VARCHAR(191) NOT NULL,
    `date_start` DATETIME(3) NOT NULL,
    `date_end` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL,
    `nip` VARCHAR(191) NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `id_user` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`kode_logbook`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogbookDetail` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `aktivitas` LONGTEXT NOT NULL,
    `keterangan` LONGTEXT NOT NULL,
    `status` BOOLEAN NOT NULL,
    `ttd` VARCHAR(191) NOT NULL,
    `file_surat` VARCHAR(191) NOT NULL,
    `kode_logbook` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Monev` (
    `id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `status_dosen` BOOLEAN NOT NULL,
    `status_pembimbing` BOOLEAN NOT NULL,
    `kode_logbook` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Dosen` ADD CONSTRAINT `Dosen_username_fkey` FOREIGN KEY (`username`) REFERENCES `User`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mahasiswa` ADD CONSTRAINT `Mahasiswa_username_fkey` FOREIGN KEY (`username`) REFERENCES `User`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pembimbing` ADD CONSTRAINT `Pembimbing_username_fkey` FOREIGN KEY (`username`) REFERENCES `User`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Logbook` ADD CONSTRAINT `Logbook_nip_fkey` FOREIGN KEY (`nip`) REFERENCES `Dosen`(`nip`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Logbook` ADD CONSTRAINT `Logbook_nim_fkey` FOREIGN KEY (`nim`) REFERENCES `Mahasiswa`(`nim`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Logbook` ADD CONSTRAINT `Logbook_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `Pembimbing`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogbookDetail` ADD CONSTRAINT `LogbookDetail_kode_logbook_fkey` FOREIGN KEY (`kode_logbook`) REFERENCES `Logbook`(`kode_logbook`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Monev` ADD CONSTRAINT `Monev_kode_logbook_fkey` FOREIGN KEY (`kode_logbook`) REFERENCES `Logbook`(`kode_logbook`) ON DELETE RESTRICT ON UPDATE CASCADE;
