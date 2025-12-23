function toggleTheme() {
    document.body.classList.toggle("dark");
}

// animasi sebelum pindah halaman
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const tujuan = this.getAttribute("href");

            document.body.style.opacity = "0";

            setTimeout(() => {
                window.location.href = tujuan;
            }, 300);
        });
    });
});

function togglePassword(id) {
    const input = document.getElementById(id);
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}


function sortData() {
    const table = document.getElementById("mahasiswaTable");
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.rows);
    const value = document.getElementById("sortSelect").value;

    let index = 0;
    let asc = true;

    if (value === "nama-asc") {
        index = 2;
        asc = true;
    } else if (value === "nama-desc") {
        index = 2;
        asc = false;
    } else if (value === "nim-asc") {
        index = 1;
        asc = true;
    } else if (value === "nim-desc") {
        index = 1;
        asc = false;
    } else {
        return;
    }

    rows.sort((a, b) => {
        let A = a.cells[index].innerText.toLowerCase();
        let B = b.cells[index].innerText.toLowerCase();

        if (!isNaN(A) && !isNaN(B)) {
            return asc ? A - B : B - A;
        }

        if (A < B) return asc ? -1 : 1;
        if (A > B) return asc ? 1 : -1;
        return 0;
    });

    tbody.innerHTML = "";
    rows.forEach((row, i) => {
        row.cells[0].innerText = i + 1;
        tbody.appendChild(row);
    });
}

function hapusRow(button) {
    if (confirm("Yakin ingin menghapus data mahasiswa ini?")) {
        const row = button.closest("tr");
        row.remove();

        // update nomor
        const rows = document.querySelectorAll("#mahasiswaTable tbody tr");
        rows.forEach((row, i) => {
            row.cells[0].innerText = i + 1;
        });
    }
}


function tambahMahasiswa() {
    const nim = document.getElementById("nim").value.trim();
    const nama = document.getElementById("nama").value.trim();
    const prodi = document.getElementById("prodi").value.trim();

    if (nim === "" || nama === "" || prodi === "") {
        alert("Semua field harus diisi!");
        return;
    }

    const table = document.getElementById("mahasiswaTable").tBodies[0];
    const row = table.insertRow();

    row.innerHTML = `
        <td></td>
        <td>${nim}</td>
        <td>${nama}</td>
        <td>${prodi}</td>
        <td>
            <button class="hapus-btn" onclick="hapusRow(this)">Hapus</button>
        </td>
    `;

    updateNomor();

    document.getElementById("nim").value = "";
    document.getElementById("nama").value = "";
    document.getElementById("prodi").value = "";
}

function updateNomor() {
    const rows = document.querySelectorAll("#mahasiswaTable tbody tr");
    rows.forEach((row, i) => {
        row.cells[0].innerText = i + 1;
    });
}


// ================= TOAST =================
function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerText = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// ================= CEK URL MSG =================
window.onload = function () {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get("msg");

    if (msg === "login") {
        showToast("Login berhasil. Selamat datang!");
    }

    if (msg === "register") {
        showToast("Registrasi berhasil. Silakan login.");
    }

    if (msg === "login_failed") {
        showToast("Username atau password salah!");
    }

    if (msg === "register_failed") {
        showToast("Username sudah terdaftar!");
    }

    if (msg === "tambah") {
        showToast("Data mahasiswa berhasil ditambahkan!");
    }

    if (msg === "hapus") {
        showToast("Data mahasiswa berhasil dihapus!");
    }

    if (msg === "logout") {
        showToast("Anda berhasil logout.");
    }
};


// Ambil input dan tabel
const searchInput = document.getElementById("searchInput");
const dataTable = document.querySelector(".data-table tbody");

// Event saat user mengetik di input
searchInput.addEventListener("keyup", function() {
    const filter = searchInput.value.toLowerCase();
    const rows = dataTable.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const nimCell = rows[i].getElementsByTagName("td")[1]; // kolom NIM
        const namaCell = rows[i].getElementsByTagName("td")[2]; // kolom Nama
        if (nimCell && namaCell) {
            const nimText = nimCell.textContent.toLowerCase();
            const namaText = namaCell.textContent.toLowerCase();
            if (nimText.includes(filter) || namaText.includes(filter)) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
});


