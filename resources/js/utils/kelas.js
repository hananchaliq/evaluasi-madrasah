const formatKelasLabel = (kelas) => {
    if (!kelas) {
        return '';
    }

    if (kelas.tingkatan?.nama) {
        return `${kelas.nama} (${kelas.tingkatan.nama})`;
    }

    return kelas.nama;
};

export { formatKelasLabel };
