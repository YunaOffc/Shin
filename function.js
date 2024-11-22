const { getDatabase, ref, set, get, remove, update } = require("firebase/database");
const { getApps, initializeApp } = require("firebase/app");

let dbf;
try {
  const co = getApps().length;
  if (co) {
    dbf = getDatabase();
  } else {
    const firebaseConfig = {
      apiKey: "AIzaSyAuZVc1lAqJQY2pStcfKK0MrXoPiAp-o4Y",
      authDomain: "dann-871ca.firebaseapp.com",
      databaseURL: "https://dann-871ca-default-rtdb.firebaseio.com",
      projectId: "dann-871ca",
      storageBucket: "dann-871ca.firebasestorage.app",
      messagingSenderId: "266247753707",
      appId: "1:266247753707:web:dbe66fd00ae679a40013ae",
    };

    const app = initializeApp(firebaseConfig);
    dbf = getDatabase(app);
  }
} catch (e) {
  console.error("Error during Firebase initialization:", e);
  throw e;
}

// Fungsi untuk menambahkan user baru
async function tambahUser(nomer, nama, kode, saldo = 0) {
  const userReference = ref(dbf, `users/${nomer}`);
  const userData = { nama, kode, saldo };

  try {
    await set(userReference, userData);
    return `User ${nama} berhasil ditambahkan dengan ID ${nomer}`;
  } catch (error) {
    console.error("Error saat menambahkan user:", error);
    throw error;
  }
}

// Fungsi untuk mencari user berdasarkan ID (nomor telepon)
async function cariUser(nomer) {
  const userReference = ref(dbf, `users/${nomer}`);

  try {
    const snapshot = await get(userReference);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error(`User dengan ID ${nomer} tidak ditemukan`);
    }
  } catch (error) {
    console.error("Error saat mencari user:", error);
    throw error;
  }
}

// Fungsi untuk menghapus user berdasarkan ID (nomor telepon)
async function hapusUser(nomer) {
  const userReference = ref(dbf, `users/${nomer}`);

  try {
    await remove(userReference);
    return `User dengan ID ${nomer} berhasil dihapus`;
  } catch (error) {
    console.error("Error saat menghapus user:", error);
    throw error;
  }
}

// Fungsi untuk memperbarui saldo user
async function updateSaldo(nomer, saldoBaru) {
  const userReference = ref(dbf, `users/${nomer}`);

  try {
    const snapshot = await get(userReference);
    if (snapshot.exists()) {
      await update(userReference, { saldo: saldoBaru });
      return `Saldo user dengan ID ${nomer} berhasil diperbarui menjadi ${saldoBaru}`;
    } else {
      throw new Error(`User dengan ID ${nomer} tidak ditemukan`);
    }
  } catch (error) {
    console.error("Error saat memperbarui saldo:", error);
    throw error;
  }
}

// Fungsi untuk mendapatkan semua data di database
async function viewAll() {
  const rootReference = ref(dbf, `/users`); // Referensi ke root node

  try {
    const snapshot = await get(rootReference);
    if (snapshot.exists()) {
      return snapshot.val(); // Mengembalikan semua data
    } else {
      return "Tidak ada data ditemukan di database";
    }
  } catch (error) {
    console.error("Error saat mengambil semua data:", error);
    throw error;
  }
}

async function cekVerif() {
  const rootReference = ref(dbf, `/verif`); // Referensi ke root node

  try {
    const snapshot = await get(rootReference);
    if (snapshot.exists()) {
      return snapshot.val(); // Mengembalikan semua data
    } else {
      return "Tidak ada data ditemukan di database";
    }
  } catch (error) {
    console.error("Error saat mengambil semua data:", error);
    throw error;
  }
}

async function hapusVerif(nomer) {
  const userReference = ref(dbf, `verif/${nomer}`);

  try {
    await remove(userReference);
    return `User dengan ID ${nomer} berhasil dihapus`;
  } catch (error) {
    console.error("Error saat menghapus user:", error);
    throw error;
  }
}

async function tambahVerif(nomer, nama, kode) {
  const userReference = ref(dbf, `verif/${nomer}`);
  const userData = { nama, kode };

  try {
    await set(userReference, userData);
    return `User ${nama} berhasil ditambahkan dengan ID ${nomer}`;
  } catch (error) {
    console.error("Error saat menambahkan user:", error);
    throw error;
  }
}


module.exports = { tambahUser, cariUser, hapusUser, updateSaldo, viewAll, cekVerif, hapusVerif, tambahVerif};
