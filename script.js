document.addEventListener("DOMContentLoaded", function() {
    
    // --- 1. SISTEM NAVIGASI HALAMAN (SPA) ---
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.halaman');
    
    function switchPage(targetId) {
        pages.forEach(page => page.classList.remove('aktif'));
        const targetPage = document.getElementById(targetId);
        if(targetPage) targetPage.classList.add('aktif');

        navButtons.forEach(btn => {
            btn.classList.remove('active');
            if(btn.getAttribute('data-target') === targetId && (btn.classList.contains('nav-item') || btn.parentElement.classList.contains('nav-links'))) {
                btn.classList.add('active');
            }
        });
        window.scrollTo(0, 0);
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');
            if (targetId) switchPage(targetId);
        });
    });

    // --- 2. LOGIKA ANIMASI & FILTER KATEGORI TOKO ---
    const kategoriPills = document.querySelectorAll('#halaman-toko .kategori-pill');
    const produkCards = document.querySelectorAll('#halaman-toko .produk-grid .produk-card');

    kategoriPills.forEach(pill => {
        pill.addEventListener('click', function() {
            kategoriPills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');

            const nilaiFilter = this.getAttribute('data-filter');

            produkCards.forEach(card => {
                const kategoriProduk = card.getAttribute('data-category');
                card.classList.remove('show-anim');

                if (nilaiFilter === 'semua' || kategoriProduk === nilaiFilter) {
                    card.classList.remove('hide');
                    void card.offsetWidth; 
                    card.classList.add('show-anim');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // --- 3. SISTEM KERANJANG BELANJA (CART POP-UP) ---
    let cartItems = []; 
    const addCartBtns = document.querySelectorAll('.btn-add-cart');
    const cartIcons = document.querySelectorAll('.cart-icon-wrapper');
    const cartBadges = document.querySelectorAll('.cart-badge');
    const modalKeranjang = document.getElementById('modal-keranjang');
    const btnCloseCart = document.getElementById('btn-close-cart');
    const cartContainer = document.getElementById('cart-items-container');
    const cartTotalLabel = document.getElementById('cart-total');

    const formatRupiah = (angka) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    function updateCartUI() {
        cartContainer.innerHTML = ''; 
        let totalHarga = 0;

        if(cartItems.length === 0) {
            cartContainer.innerHTML = '<p class="empty-cart-text">Keranjang masih kosong</p>';
        } else {
            cartItems.forEach((item, index) => {
                totalHarga += parseInt(item.price);
                cartContainer.innerHTML += `
                    <div class="cart-item">
                        <div class="cart-item-img" style="background-image: url('${item.img}')"></div>
                        <div class="cart-item-info">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="harga-aktif">${formatRupiah(item.price)}</div>
                        </div>
                        <button class="btn-remove" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                `;
            });
        }

        cartTotalLabel.textContent = formatRupiah(totalHarga);
        cartBadges.forEach(badge => {
            badge.textContent = cartItems.length;
            if(cartItems.length > 0) badge.classList.add('show');
            else badge.classList.remove('show');
        });
    }

    addCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); 
            const namaProduk = this.getAttribute('data-name');
            const hargaProduk = this.getAttribute('data-price');
           // Mengambil otomatis gambar dari div .produk-img terdekat
            const elemenKartu = this.closest('.produk-card');
            const elemenGambar = elemenKartu.querySelector('.produk-img');
            const bgImage = window.getComputedStyle(elemenGambar).backgroundImage;
            const gambarProduk = bgImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
            
            cartItems.push({ name: namaProduk, price: hargaProduk, img: gambarProduk });
            updateCartUI();

            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="fa-solid fa-check"></i>';
            this.style.backgroundColor = '#16a34a'; 
            
            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.style.backgroundColor = '#2c5123';
            }, 800);
        });
    });

    cartContainer.addEventListener('click', function(e) {
        const removeBtn = e.target.closest('.btn-remove');
        if(removeBtn) {
            const indexToRemove = removeBtn.getAttribute('data-index');
            cartItems.splice(indexToRemove, 1); 
            updateCartUI(); 
        }
    });

    cartIcons.forEach(icon => {
        icon.addEventListener('click', () => modalKeranjang.classList.add('show'));
    });
    btnCloseCart.addEventListener('click', () => modalKeranjang.classList.remove('show'));
    modalKeranjang.addEventListener('click', function(e) {
        if(e.target === modalKeranjang) modalKeranjang.classList.remove('show');
    });

    updateCartUI();

    // --- 4. INTERAKSI HALAMAN AKUN (BARU) ---
    const akunMenuItems = document.querySelectorAll('.akun-menu-item');
    const btnEditAkun = document.querySelector('.akun-edit');
    const toast = document.getElementById('toast-container');
    
    // Fungsi memunculkan notifikasi pop-up dari bawah
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500); // Pesan hilang setelah 2.5 detik
    }

    // Aksi ketika daftar menu akun ditekan
    akunMenuItems.forEach(item => {
        item.addEventListener('click', function() {
            const menuName = this.querySelector('.menu-text').textContent;
            showToast(`Membuka halaman ${menuName}...`);
        });
    });

    // Aksi Tombol Keluar / Logout
    const btnLogout = document.querySelector('.btn-logout');
    const modalLogout = document.getElementById('modal-logout');
    const btnBatalLogout = document.getElementById('btn-batal-logout');
    const btnKonfirmLogout = document.getElementById('btn-konfirm-logout');

    if(btnLogout) {
        btnLogout.addEventListener('click', () => modalLogout.classList.add('show'));
    }
    
    if(btnBatalLogout) {
        btnBatalLogout.addEventListener('click', () => modalLogout.classList.remove('show'));
    }
    
    if(btnKonfirmLogout) {
        btnKonfirmLogout.addEventListener('click', () => {
            modalLogout.classList.remove('show');
            showToast('Anda berhasil keluar dari akun.');
            
            // Simulasi redirect kembali ke halaman utama
            setTimeout(() => {
                document.querySelector('[data-target="halaman-beranda"]').click();
                window.scrollTo(0,0);
            }, 1000);
        });
    }

    // Tutup peringatan logout jika klik di area layar yang kosong
    if(modalLogout) {
        modalLogout.addEventListener('click', function(e) {
            if(e.target === modalLogout) modalLogout.classList.remove('show');
        });
    }

// ==========================================
    // TAMBAHAN: 5. FITUR PENCARIAN (SEARCH)
    // ==========================================

    // A. Pencarian di Halaman Konsultasi
    const inputCariKonsultasi = document.querySelector('#halaman-konsultasi .search-container input');
    const daftarKonsultan = document.querySelectorAll('.konsultan-card');

    if(inputCariKonsultasi) {
        inputCariKonsultasi.addEventListener('input', function() {
            const kataKunci = this.value.toLowerCase();

            daftarKonsultan.forEach(konsultan => {
                // Mengambil teks nama dan spesialisasi dari masing-masing kartu
                const nama = konsultan.querySelector('.name-row h4').innerText.toLowerCase();
                const spesialisasi = konsultan.querySelector('.spesialis').innerText.toLowerCase();

                // Jika kata kunci cocok dengan nama ATAU spesialisasi, tampilkan kartunya
                if(nama.includes(kataKunci) || spesialisasi.includes(kataKunci)) {
                    konsultan.style.display = ''; 
                } else {
                    konsultan.style.display = 'none'; // Sembunyikan jika tidak cocok
                }
            });
        });
    }

    // B. Pencarian di Halaman Toko (Terintegrasi dengan Filter Kategori)
    const inputCariToko = document.querySelector('#halaman-toko .search-container input');
    const daftarProduk = document.querySelectorAll('#produk-container .produk-card');
    const pilKategori = document.querySelectorAll('.kategori-pill');

    // Fungsi gabungan untuk menyaring berdasarkan Ketikan (Search) & Klik Kategori
    function filterGabunganToko() {
        const kataKunci = inputCariToko ? inputCariToko.value.toLowerCase() : '';
        const kategoriAktif = document.querySelector('.kategori-pill.active').getAttribute('data-filter');

        daftarProduk.forEach(produk => {
            const namaProduk = produk.querySelector('.produk-judul').innerText.toLowerCase();
            const kategoriProduk = produk.getAttribute('data-category');

            // Cek dua syarat: apakah teksnya cocok? dan apakah kategorinya cocok?
            const cocokKataKunci = namaProduk.includes(kataKunci);
            const cocokKategori = (kategoriAktif === 'semua' || kategoriProduk === kategoriAktif);

            if(cocokKataKunci && cocokKategori) {
                produk.classList.remove('hide');
                produk.classList.add('show-anim');
            } else {
                produk.classList.add('hide');
                produk.classList.remove('show-anim');
            }
        });
    }

    // Jalankan filter saat pengguna mengetik di kolom pencarian Toko
    if(inputCariToko) {
        inputCariToko.addEventListener('input', filterGabunganToko);
    }

    // Perbarui fungsi klik kategori sebelumnya agar tidak bertabrakan dengan kolom pencarian
    pilKategori.forEach(pill => {
        pill.addEventListener('click', function() {
            pilKategori.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            filterGabunganToko(); // Panggil fungsi gabungan
        });
    });

// ==========================================
    // TAMBAHAN: 6. LOGIKA MENU CHECKOUT
    // ==========================================
    const btnCheckoutCart = document.querySelector('#modal-keranjang .modal-footer .btn-primary');
    const modalCheckout = document.getElementById('modal-checkout');
    const btnCloseCheckout = document.getElementById('btn-close-checkout');
    const btnBayarSekarang = document.getElementById('btn-bayar-sekarang');
    
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutTotal = document.getElementById('checkout-total');
            
            // Ketika tombol "Checkout Sekarang" di keranjang diklik
    if(btnCheckoutCart) {
        btnCheckoutCart.addEventListener('click', function() {
            // Cek jika keranjang kosong
            if(cartItems.length === 0) {
                showToast('Keranjang belanja Anda masih kosong!');
                return;
            }
            
            // =========================================================
            // PASANG KODE BARU INI UNTUK SINKRONISASI NAMA & HP PROFIL
            // =========================================================
            const elemenNamaAkun = document.querySelector('.akun-info h3');
            const elemenHpAkun = document.querySelector('.akun-info p');
            
            const inputNamaCheckout = document.getElementById('checkout-nama');
            const inputHpCheckout = document.getElementById('checkout-hp');
            
            // Jika elemennya ditemukan, isi nilainya sesuai profil aktif
            if (elemenNamaAkun && inputNamaCheckout) {
                inputNamaCheckout.value = elemenNamaAkun.textContent;
            }
            if (elemenHpAkun && inputHpCheckout) {
                inputHpCheckout.value = elemenHpAkun.textContent;
            }
            // =========================================================
            
            // Hitung total harga produk (Subtotal)
            let subtotal = 0;
            cartItems.forEach(item => { subtotal += parseInt(item.price); });
            
            // Baca harga ekspedisi yang sedang dipilih saat ini
            const pilihanEkspedisi = document.getElementById('pilihan-ekspedisi');
            let ongkir = pilihanEkspedisi ? parseInt(pilihanEkspedisi.value) : 15000; 
            
            let totalAkhir = subtotal + ongkir;

            // Masukkan angka ke tampilan checkout
            checkoutSubtotal.textContent = formatRupiah(subtotal);
            checkoutTotal.textContent = formatRupiah(totalAkhir);

            // --- KODE BARU UNTUK SINKRONISASI SAAT PERTAMA KALI DIBUKA ---
            const teksOngkirAwal = document.getElementById('checkout-ongkir');
            if(teksOngkirAwal) {
                if(ongkir === 0) {
                    teksOngkirAwal.textContent = 'Gratis';
                    teksOngkirAwal.style.color = '#22c55e';
                } else {
                    teksOngkirAwal.textContent = formatRupiah(ongkir);
                    teksOngkirAwal.style.color = '#111827';
                }
            }

            // Sembunyikan keranjang, tampilkan halaman checkout
            modalKeranjang.classList.remove('show');
            modalCheckout.classList.add('show');
        });
    }


    // Ketika tombol "Buat Pesanan" diklik
    if(btnBayarSekarang) {
        btnBayarSekarang.addEventListener('click', () => {
            // Sembunyikan modal
            modalCheckout.classList.remove('show');
            
            // Kosongkan keranjang belanja karena sudah dibayar
            cartItems = []; 
            updateCartUI();
            
            // Beri notifikasi sukses
            showToast('Pesanan berhasil dibuat! Sedang diproses...');
            
            // Arahkan otomatis kembali ke Beranda setelah 1.5 detik
            setTimeout(() => {
                document.querySelector('[data-target="halaman-beranda"]').click();
                window.scrollTo(0,0);
            }, 1500);
        });
    }

// ==========================================
    // TAMBAHAN: 7. LOGIKA EDIT PROFIL
    // ==========================================
    const modalEditProfil = document.getElementById('modal-edit-profil');
    const btnCloseProfil = document.getElementById('btn-close-profil');
    const btnSimpanProfil = document.getElementById('btn-simpan-profil');
    
    // Target teks yang akan berubah di layar
    const teksNamaAkun = document.querySelector('.akun-info h3');
    const teksHpAkun = document.querySelector('.akun-info p');
    const teksNamaBeranda = document.querySelector('.header-text h1');
    
    // Buka modal saat ikon pensil diklik
    const btnEditProfilBaru = document.querySelector('.akun-edit');
    if(btnEditProfilBaru) {
        btnEditProfilBaru.addEventListener('click', () => modalEditProfil.classList.add('show'));
    }

    // Tutup modal pakai tanda X atau klik luar layar
    if(btnCloseProfil) {
        btnCloseProfil.addEventListener('click', () => modalEditProfil.classList.remove('show'));
    }
    if(modalEditProfil) {
        modalEditProfil.addEventListener('click', function(e) {
            if(e.target === modalEditProfil) modalEditProfil.classList.remove('show');
        });
    }

    // Aksi Simpan Perubahan
    if(btnSimpanProfil) {
        btnSimpanProfil.addEventListener('click', () => {
            const namaBaru = document.getElementById('input-edit-nama').value;
            const hpBaru = document.getElementById('input-edit-hp').value;

            // 1. Ubah teks di Halaman Akun
            if(namaBaru) teksNamaAkun.textContent = namaBaru;
            if(hpBaru) teksHpAkun.textContent = hpBaru;

            // 2. Ubah juga sapaan di Halaman Beranda!
            if(namaBaru) teksNamaBeranda.textContent = `Halo, ${namaBaru} 👋`;

            // Tutup modal dan tampilkan notifikasi
            modalEditProfil.classList.remove('show');
            showToast('Profil berhasil diperbarui!');
        });
    }

    // ==========================================
    // TAMBAHAN: 8. INTERAKSI KARTU STATISTIK AKUN
    // ==========================================
    
    // Target elemen teks nilai stat di halaman akun
    const wadahStatBox = document.querySelectorAll('.stat-box');
    const teksNilaiSaldo = wadahStatBox[0].querySelector('.stat-value');
    const teksNilaiPoin = wadahStatBox[1].querySelector('.stat-value');
    const teksNilaiKupon = wadahStatBox[2].querySelector('.stat-value');

    // Variabel internal penyimpan nilai data awal aplikasi
    let nominalSaldoAktif = 125000;
    let jumlahPoinAktif = 450;
    let jumlahKuponAktif = 3;

    // --- Bagian A: Pengaturan Top Up Saldo ---
    const modalTopUp = document.getElementById('modal-topup');
    const btnCloseTopUp = document.getElementById('btn-close-topup');
    const btnSelesaiTopUp = document.getElementById('btn-selesai-topup');

    // Klik kotak Saldo untuk buka modal
    wadahStatBox[0].addEventListener('click', () => modalTopUp.classList.add('show'));
    if(btnCloseTopUp) btnCloseTopUp.addEventListener('click', () => modalTopUp.classList.remove('show'));

    if(btnSelesaiTopUp) {
        btnSelesaiTopUp.addEventListener('click', () => {
            const pilihanNominal = parseInt(document.getElementById('select-nominal').value);
            
            // Tambahkan nominal terpilih ke saldo aktif saat ini
            nominalSaldoAktif += pilihanNominal;
            teksNilaiSaldo.textContent = formatRupiah(nominalSaldoAktif);

            modalTopUp.classList.remove('show');
            showToast(`Isi saldo berhasil! Saldo Anda bertambah ${formatRupiah(pilihanNominal)}`);
        });
    }

    // --- Bagian B: Misi Klaim Poin Tani ---
    const modalPoin = document.getElementById('modal-poin');
    const btnClosePoin = document.getElementById('btn-close-poin');
    const tombolKlaimPoin = document.querySelectorAll('.btn-claim-poin');

    // Klik kotak Poin Tani untuk buka modal
    wadahStatBox[1].addEventListener('click', () => modalPoin.classList.add('show'));
    if(btnClosePoin) btnClosePoin.addEventListener('click', () => modalPoin.classList.remove('show'));

    tombolKlaimPoin.forEach(btn => {
        btn.addEventListener('click', function() {
            const tambahanPoin = parseInt(this.getAttribute('data-poin'));
            
            // Tambahkan ke total poin
            jumlahPoinAktif += tambahanPoin;
            teksNilaiPoin.textContent = jumlahPoinAktif;

            // Ubah tampilan tombol menjadi selesai diklaim
            this.textContent = "Berhasil";
            this.classList.add('btn-claim-disabled');
            this.disabled = true;

            showToast(`Selamat! Anda mendapatkan +${tambahanPoin} Poin Tani.`);
        });
    });

    // --- Bagian C: Mengambil Klaim Kupon Belanja ---
    const modalKupon = document.getElementById('modal-kupon');
    const btnCloseKupon = document.getElementById('btn-close-kupon');
    const tombolAmbilKupon = document.querySelectorAll('.btn-claim-kupon');

    // Klik kotak Kupon untuk buka modal
    wadahStatBox[2].addEventListener('click', () => modalKupon.classList.add('show'));
    if(btnCloseKupon) btnCloseKupon.addEventListener('click', () => modalKupon.classList.remove('show'));

    tombolAmbilKupon.forEach(btn => {
        btn.addEventListener('click', function() {
            // Tambah jumlah kupon aktif di halaman akun
            jumlahKuponAktif += 1;
            teksNilaiKupon.textContent = `${jumlahKuponAktif} Aktif`;

            // Ubah tampilan tombol menjadi selesai diambil
            this.textContent = "Sudah Diambil";
            this.classList.add('btn-claim-disabled');
            this.disabled = true;

            showToast('Kupon berhasil disimpan ke akun Anda!');
        });
    });

    // Menutup modal statistik jika klik area kosong
    window.addEventListener('click', function(e) {
        if (e.target === modalTopUp) modalTopUp.classList.remove('show');
        if (e.target === modalPoin) modalPoin.classList.remove('show');
        if (e.target === modalKupon) modalKupon.classList.remove('show');
    });

// ==========================================
    // PERBAIKAN FINAL: 9. MENU AKTIVITAS, FAVORIT SINKRON, & RIWAYAT KONSULTASI
    // ==========================================

    // 1. Hubungkan Menu Akun ke Modal Masing-masing
    const menuAktivitas = document.querySelectorAll('.akun-menu-item');
    const modalAktivitas = {
        'Pesanan Saya': document.getElementById('modal-pesanan'),
        'Riwayat Konsultasi': document.getElementById('modal-riwayat'),
        'Lahan & Tanaman Saya': document.getElementById('modal-lahan'),
        'Toko & Produk Favorit': document.getElementById('modal-favorit')
    };

    menuAktivitas.forEach(item => {
        item.addEventListener('click', function() {
            const teksMenu = this.querySelector('.menu-text').textContent;
            if(modalAktivitas[teksMenu]) {
                modalAktivitas[teksMenu].classList.add('show');
            }
        });
    });

    // Tombol tutup (Panah Kiri)
    document.querySelectorAll('.btn-tutup-aktivitas').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal-overlay').classList.remove('show');
        });
    });

    // 2. Logika Navigasi Tab (Untuk Pesanan & Favorit)
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const parentModal = this.closest('.modal-content');
            parentModal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            parentModal.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(this.getAttribute('data-tab')).classList.add('active');
        });
    });

    // 3. Sistem Favorit Sinkronisasi Dua Arah (METODE EVENT DELEGATION - PALING STABIL)
    const wadahFavProduk = document.getElementById('wadah-fav-produk');
    const wadahFavToko = document.getElementById('wadah-fav-toko');
    
    const emptyProdukHTML = '<p class="text-center text-gray text-sm mt-4 w-100" style="grid-column: span 2;">Belum ada produk favorit.</p>';
    const emptyTokoHTML = '<p class="text-center text-gray text-sm mt-4">Belum ada toko favorit.</p>';

    // --- A. KLIK FAVORIT DI HALAMAN UTAMA TOKO ---
    
    // 1. Untuk Produk Utama
    document.querySelectorAll('#halaman-toko .produk-card').forEach((card, index) => {
        card.setAttribute('data-fav-id', `prod-${index}`);
        const favBtn = document.createElement('button');
        favBtn.className = 'btn-fav-float';
        favBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        card.appendChild(favBtn);

        favBtn.addEventListener('click', function(e) {
            e.stopPropagation(); 
            this.classList.toggle('is-fav');
            const idFavorit = card.getAttribute('data-fav-id');

            if(this.classList.contains('is-fav')) {
                showToast('Dimasukkan ke Produk Favorit!');
                const teksKosong = wadahFavProduk.querySelector('p.text-center');
                if(teksKosong) teksKosong.remove(); 
                
                const cloneCard = card.cloneNode(true);
                cloneCard.querySelector('.btn-fav-float').classList.add('is-fav'); // Pastikan merah
                wadahFavProduk.appendChild(cloneCard);
            } else {
                const cloneDiModal = wadahFavProduk.querySelector(`[data-fav-id="${idFavorit}"]`);
                if(cloneDiModal) cloneDiModal.remove();
                if(wadahFavProduk.querySelectorAll('.produk-card').length === 0) wadahFavProduk.innerHTML = emptyProdukHTML;
            }
        });
    });

    // 2. Untuk Toko Partner Utama
    document.querySelectorAll('#halaman-toko .toko-card').forEach((card, index) => {
        card.setAttribute('data-fav-id', `toko-${index}`);
        const favBtn = document.createElement('button');
        favBtn.className = 'btn-fav-float';
        favBtn.innerHTML = '<i class="fa-solid fa-heart"></i>';
        card.appendChild(favBtn);

        favBtn.addEventListener('click', function(e) {
            e.preventDefault(); 
            e.stopPropagation();
            this.classList.toggle('is-fav');
            const idFavorit = card.getAttribute('data-fav-id');

            if(this.classList.contains('is-fav')) {
                showToast('Toko difavoritkan!');
                const teksKosong = wadahFavToko.querySelector('p.text-center');
                if(teksKosong) teksKosong.remove();
                
                const cloneToko = card.cloneNode(true);
                cloneToko.querySelector('.btn-fav-float').classList.add('is-fav');
                wadahFavToko.appendChild(cloneToko);
            } else {
                const cloneDiModal = wadahFavToko.querySelector(`[data-fav-id="${idFavorit}"]`);
                if(cloneDiModal) cloneDiModal.remove();
                if(wadahFavToko.querySelectorAll('.toko-card').length === 0) wadahFavToko.innerHTML = emptyTokoHTML;
            }
        });
    });

    // --- B. INTERAKSI KLIK DI DALAM WADAH MODAL FAVORIT (SANGAT STABIL) ---
    
    // 1. Memantau klik di dalam wadah Produk Favorit
    wadahFavProduk.addEventListener('click', function(e) {
        
        // Cek jika yang diklik adalah tombol (+) Keranjang
        const btnCart = e.target.closest('.btn-add-cart');
        if (btnCart) {
            e.stopPropagation();
            const cloneCard = btnCart.closest('.produk-card');
            const namaProduk = btnCart.getAttribute('data-name');
            const hargaProduk = btnCart.getAttribute('data-price');
            
            const elemenGambar = cloneCard.querySelector('.produk-img');
            const bgImage = window.getComputedStyle(elemenGambar).backgroundImage;
            const gambarProduk = bgImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
            
            cartItems.push({ name: namaProduk, price: hargaProduk, img: gambarProduk });
            updateCartUI();
            showToast(`${namaProduk} masuk ke keranjang!`);
            return;
        }

        // Cek jika yang diklik adalah tombol Love/Favorit
        const btnFav = e.target.closest('.btn-fav-float');
        if (btnFav) {
            e.stopPropagation();
            const cloneCard = btnFav.closest('.produk-card');
            const idFavorit = cloneCard.getAttribute('data-fav-id');
            
            // 1. Lenyapkan dari modal favorit
            cloneCard.remove();
            
            // 2. Lenyapkan warna merah di Toko Utama secara sinkron
            const originalCard = document.querySelector(`#halaman-toko .produk-card[data-fav-id="${idFavorit}"]`);
            if(originalCard) {
                originalCard.querySelector('.btn-fav-float').classList.remove('is-fav');
            }
            
            showToast('Dihapus dari Produk Favorit');
            if(wadahFavProduk.querySelectorAll('.produk-card').length === 0) wadahFavProduk.innerHTML = emptyProdukHTML;
        }
    });

    // 2. Memantau klik di dalam wadah Toko Favorit
    wadahFavToko.addEventListener('click', function(e) {
        const btnFav = e.target.closest('.btn-fav-float');
        if (btnFav) {
            e.preventDefault();
            e.stopPropagation();
            
            const cloneCard = btnFav.closest('.toko-card');
            const idFavorit = cloneCard.getAttribute('data-fav-id');
            
            // 1. Lenyapkan dari modal favorit
            cloneCard.remove();
            
            // 2. Lenyapkan warna merah di Toko Utama secara sinkron
            const originalCard = document.querySelector(`#halaman-toko .toko-card[data-fav-id="${idFavorit}"]`);
            if(originalCard) {
                originalCard.querySelector('.btn-fav-float').classList.remove('is-fav');
            }
            
            showToast('Toko dihapus dari favorit');
            if(wadahFavToko.querySelectorAll('.toko-card').length === 0) wadahFavToko.innerHTML = emptyTokoHTML;
        }
    });

    // 4. Integrasi Checkout -> Pesanan Saya
    const tombolCheckoutLama = document.getElementById('btn-bayar-sekarang');
    if (tombolCheckoutLama) {
        const tombolCheckoutBaru = tombolCheckoutLama.cloneNode(true);
        tombolCheckoutLama.parentNode.replaceChild(tombolCheckoutBaru, tombolCheckoutLama);

        tombolCheckoutBaru.addEventListener('click', () => {
            const wadahPesananBaru = document.getElementById('wadah-pesanan-baru');
            
            let htmlProdukPesanan = '';
            cartItems.forEach(item => {
                htmlProdukPesanan += `<div class="text-sm mt-1">- ${item.name}</div>`;
            });

            if (wadahPesananBaru.innerHTML.includes('Belum ada pesanan')) {
                wadahPesananBaru.innerHTML = '';
            }

            wadahPesananBaru.innerHTML = `
                <div class="pesanan-card">
                    <div class="flex-between mb-2">
                        <span class="font-bold text-sm"><i class="fa-solid fa-store text-yellow"></i> Belanja Tani</span>
                        <span class="badge bg-green">Sedang Dikemas</span>
                    </div>
                    ${htmlProdukPesanan}
                    <div class="flex-between border-top pt-2 mt-3">
                        <span class="text-xs text-gray">Total Dibayar:</span>
                        <span class="font-bold text-green-700">${document.getElementById('checkout-total').textContent}</span>
                    </div>
                </div>
            ` + wadahPesananBaru.innerHTML;

            document.getElementById('modal-checkout').classList.remove('show');
            cartItems = [];
            updateCartUI();
            
            showToast('Pesanan berhasil! Silakan cek di menu Pesanan Saya.');
            
            setTimeout(() => {
                document.querySelector('[data-target="halaman-akun"]').click();
                window.scrollTo(0,0);
            }, 1000);
        });
    }

    // 5. Integrasi Klik WhatsApp -> Riwayat Konsultasi
    const tombolKonsultasi = document.querySelectorAll('#halaman-konsultasi .btn-primary');
    const wadahRiwayatKonsultasi = document.querySelector('#modal-riwayat .modal-body');

    wadahRiwayatKonsultasi.innerHTML = '<div id="riwayat-kosong"><p class="text-center text-gray text-sm mt-4">Belum ada riwayat konsultasi hari ini.</p></div>';

    tombolKonsultasi.forEach(btn => {
        btn.addEventListener('click', function() {
            const kartuKonsultan = this.closest('.konsultan-card');
            if(!kartuKonsultan) return; 

            const namaKonsultan = kartuKonsultan.querySelector('.name-row h4').textContent;
            const spesialisasi = kartuKonsultan.querySelector('.spesialis').textContent;

            const waktuSekarang = new Date();
            const jam = waktuSekarang.getHours().toString().padStart(2, '0');
            const menit = waktuSekarang.getMinutes().toString().padStart(2, '0');
            const formatWaktu = `${waktuSekarang.getDate()} Mei 2026, ${jam}:${menit}`;

            const riwayatBaruHTML = `
                <div class="riwayat-card">
                    <div class="flex-between mb-2">
                        <span class="badge bg-blue">Sesi Aktif</span>
                        <span class="text-xs text-gray">${formatWaktu}</span>
                    </div>
                    <h4 class="font-bold text-sm">Tanya Jawab dengan ${namaKonsultan}</h4>
                    <p class="text-xs text-gray mt-1"><strong>Topik:</strong> ${spesialisasi}</p>
                    <p class="text-xs mt-1 text-green-700"><em><i class="fa-brands fa-whatsapp"></i> Dialihkan via WhatsApp</em></p>
                </div>
            `;

            const teksKosong = document.getElementById('riwayat-kosong');
            if(teksKosong) teksKosong.remove();

            wadahRiwayatKonsultasi.insertAdjacentHTML('afterbegin', riwayatBaruHTML);
            showToast('Riwayat konsultasi berhasil dicatat.');
        });
    });

// ==========================================
    // REVISI FINAL: 10. LOGIKA INTERAKTIF PENGATURAN, BANTUAN, S&K, DAN SUB-MENU
    // ==========================================
    const modalPengaturan = document.getElementById('modal-pengaturan');
    const modalBantuan = document.getElementById('modal-bantuan');
    const modalSK = document.getElementById('modal-sk');

    // Menghubungkan 3 menu utama di halaman akun ke jendela modalnya masing-masing
    const daftarMenuUtamaAkun = document.querySelectorAll('.app-container > #halaman-akun .akun-menu-list')[1].querySelectorAll('.akun-menu-item');
    if(daftarMenuUtamaAkun.length >= 3) {
        daftarMenuUtamaAkun[0].addEventListener('click', () => modalPengaturan.classList.add('show'));
        daftarMenuUtamaAkun[1].addEventListener('click', () => modalBantuan.classList.add('show'));
        daftarMenuUtamaAkun[2].addEventListener('click', () => modalSK.classList.add('show'));
    }

    // --- OPERASIONAL SUB-MENU DI DALAM MODAL PENGATURAN AKUN ---
    const subMenuPengaturan = document.querySelectorAll('#modal-pengaturan .akun-menu-item');
    const modalUbahSandi = document.getElementById('modal-ubah-sandi');
    const modalHapusAkun = document.getElementById('modal-hapus-akun');

    if(subMenuPengaturan.length >= 3) {
        // 1. Klik baris Ubah Kata Sandi
        subMenuPengaturan[0].addEventListener('click', () => {
            modalUbahSandi.classList.add('show');
        });

        // 2. Klik Sakelar Notifikasi (Mendukung Geser On/Off Berwarna)
        const tombolToggle = subMenuPengaturan[1].querySelector('.toggle-switch');
        if(tombolToggle) {
            tombolToggle.classList.add('active'); // Set status awal aplikasi menyala (ON)
            
            subMenuPengaturan[1].addEventListener('click', function() {
                tombolToggle.classList.toggle('active');
                if(tombolToggle.classList.contains('active')) {
                    showToast('Notifikasi aplikasi telah dinyalakan');
                } else {
                    showToast('Notifikasi aplikasi dimatikan');
                }
            });
        }

        // 3. Klik baris Hapus Akun
        subMenuPengaturan[2].addEventListener('click', () => {
            modalHapusAkun.classList.add('show');
        });
    }

    // --- PROSEDUR SIMPAN KATA SANDI BARU ---
    const btnCloseSandi = document.getElementById('btn-close-sandi');
    const btnSimpanSandi = document.getElementById('btn-simpan-sandi');
    if(btnCloseSandi) btnCloseSandi.addEventListener('click', () => modalUbahSandi.classList.remove('show'));
    if(btnSimpanSandi) {
        btnSimpanSandi.addEventListener('click', () => {
            const inputLama = document.getElementById('sandi-lama');
            const inputBaru = document.getElementById('sandi-baru');
            
            if(!inputLama.value || !inputBaru.value) {
                showToast('Gagal! Mohon isi seluruh kolom kata sandi.');
                return;
            }
            
            // Reset input dan tutup modal
            inputLama.value = '';
            inputBaru.value = '';
            modalUbahSandi.classList.remove('show');
            showToast('Kata sandi akun Anda berhasil diperbarui!');
        });
    }

    // --- PROSEDUR EKSEKUSI HAPUS AKUN ---
    const btnBatalHap = document.getElementById('btn-batal-hapus');
    const btnKonfirmHap = document.getElementById('btn-konfirm-hapus');
    if(btnBatalHap) btnBatalHap.addEventListener('click', () => modalHapusAkun.classList.remove('show'));
    if(btnKonfirmHap) {
        btnKonfirmHap.addEventListener('click', () => {
            modalHapusAkun.classList.remove('show');
            modalPengaturan.classList.remove('show');
            showToast('Akun Anda telah berhasil dihapus secara permanen.');
            
            // Mengembalikan simulasi halaman ke Beranda depan
            setTimeout(() => {
                document.querySelector('[data-target="halaman-beranda"]').click();
                window.scrollTo(0,0);
            }, 1200);
        });
    }

    // Menutup sub-modal pengaturan saat menekan area transparan di luar kotak modal
    window.addEventListener('click', function(e) {
        if (e.target === modalUbahSandi) modalUbahSandi.classList.remove('show');
        if (e.target === modalHapusAkun) modalHapusAkun.classList.remove('show');
    });

// ==========================================
    // TAMBAHAN: 11. INTERAKSI KOTAK ARTIKEL EDUKASI (ACCORDION)
    // ==========================================
    const kotakArtikel = document.querySelectorAll('.accordion-header');
    
    kotakArtikel.forEach(header => {
        header.addEventListener('click', function() {
            // Ambil elemen bungkus utamanya (.accordion-item)
            const item = this.parentElement;
            
            // Opsional: Jika ingin artikel lain otomatis tertutup saat satu artikel dibuka,
            // aktifkan (hapus tanda //) pada 3 baris kode di bawah ini:
            
            // document.querySelectorAll('.accordion-item').forEach(i => {
            //     if(i !== item) i.classList.remove('active');
            // });
            
            // Buka atau tutup kotak yang sedang di-klik
            item.classList.toggle('active');
        });
    });

    // ==========================================
    // PERBAIKAN FINAL: 12. SISTEM RATING & ULASAN INTERAKTIF
    // ==========================================
    
    // Gunakan fungsi terbungkus agar variabelnya tidak bentrok dengan kode lain
    (function() {
        const modalUlasan = document.getElementById('modal-ulasan');
        const btnBukaUlasan = document.getElementById('btn-buka-ulasan');
        const btnTutupUlasan = document.getElementById('btn-tutup-ulasan');
        const btnKirimUlasan = document.getElementById('btn-kirim-ulasan');
        const interaktifBintang = document.querySelectorAll('#interaktif-bintang i');
        const wadahTestimoni = document.getElementById('wadah-testimoni');
        
        let nilaiTerpilih = 0;
        let dataRating = { total: 500, bintang: { 5: 450, 4: 40, 3: 10, 2: 0, 1: 0 } };

        // 1. Membuka Modal
        if (btnBukaUlasan && modalUlasan) {
            btnBukaUlasan.addEventListener('click', function() {
                modalUlasan.classList.add('show');
            });
        }

        // 2. Menutup Modal
        if (btnTutupUlasan && modalUlasan) {
            btnTutupUlasan.addEventListener('click', function() {
                modalUlasan.classList.remove('show');
            });
        }

        // 3. Interaksi Klik Bintang
        interaktifBintang.forEach(bintang => {
            bintang.addEventListener('click', function() {
                nilaiTerpilih = parseInt(this.getAttribute('data-nilai'));
                
                // Warnai bintang
                interaktifBintang.forEach(b => {
                    if(parseInt(b.getAttribute('data-nilai')) <= nilaiTerpilih) {
                        b.classList.add('aktif');
                        b.style.color = '#f59e0b'; // Kuning
                    } else {
                        b.classList.remove('aktif');
                        b.style.color = '#e5e7eb'; // Abu-abu
                    }
                });
            });
        });

        // 4. Proses Kirim Ulasan
        if (btnKirimUlasan) {
            btnKirimUlasan.addEventListener('click', function() {
                if(nilaiTerpilih === 0) {
                    showToast('Pilih jumlah bintang terlebih dahulu!');
                    return;
                }

                // Kalkulasi data baru
                dataRating.total += 1;
                dataRating.bintang[nilaiTerpilih] += 1;

                let totalNilai = (dataRating.bintang[5]*5) + (dataRating.bintang[4]*4) + (dataRating.bintang[3]*3) + (dataRating.bintang[2]*2) + (dataRating.bintang[1]*1);
                let rataRataBaru = (totalNilai / dataRating.total).toFixed(1);

                // Update UI Angka Rating
                document.getElementById('angka-rating-rata').textContent = rataRataBaru;
                document.getElementById('teks-total-ulasan').textContent = `Berdasarkan ${dataRating.total} sesi`;

                // Update Progress Bar
                for(let i = 1; i <= 5; i++) {
                    let persentase = Math.round((dataRating.bintang[i] / dataRating.total) * 100);
                    document.getElementById(`bar-${i}`).style.width = `${persentase}%`;
                    document.getElementById(`persen-${i}`).textContent = `${persentase}%`;
                }

                // Buat Elemen Ulasan Baru di HTML
                const teksUlasan = document.getElementById('teks-ulasan-baru').value;
                let bintangHTML = '';
                for(let i=0; i<nilaiTerpilih; i++) bintangHTML += '<i class="fa-solid fa-star"></i>';
                for(let i=nilaiTerpilih; i<5; i++) bintangHTML += '<i class="fa-solid fa-star text-gray"></i>';

                // --- MENGAMBIL NAMA ASLI DARI PROFIL ---
                const elemenNamaProfil = document.querySelector('.akun-info h3');
                const namaAsliUser = elemenNamaProfil ? elemenNamaProfil.textContent : 'Pelanggan';
                const hurufAwal = namaAsliUser.charAt(0).toUpperCase(); // Mengambil huruf pertama untuk logo bulat

                const ulasanBaruHTML = `
                    <div class="testimoni-card" style="border-left: 4px solid #22c55e;">
                        <div class="testimoni-header">
                            <div class="testimoni-user">
                                <div class="user-avatar bg-gray-200">${hurufAwal}</div>
                                <div>
                                    <h4>${namaAsliUser} (Anda)</h4>
                                    <p>Baru saja</p>
                                </div>
                            </div>
                            <div class="testimoni-rating text-yellow">${bintangHTML}</div>
                        </div>
                        <p class="testimoni-text mt-2">${teksUlasan ? teksUlasan : 'Telah memberikan penilaian.'}</p>
                    </div>
                `;

                if (wadahTestimoni) {
                    wadahTestimoni.insertAdjacentHTML('afterbegin', ulasanBaruHTML);
                }

                // Reset dan Tutup Modal
                modalUlasan.classList.remove('show');
                document.getElementById('teks-ulasan-baru').value = '';
                nilaiTerpilih = 0;
                interaktifBintang.forEach(b => b.style.color = '#e5e7eb'); // Reset warna bintang

                showToast('Penilaian Anda berhasil ditambahkan!');
            });
        }
    })();

// ==========================================
    // PERBAIKAN: TOMBOL KEMBALI DI CHECKOUT
    // ==========================================
    const tombolTutupCheckout = document.getElementById('btn-close-checkout');
    
    if(tombolTutupCheckout) {
        tombolTutupCheckout.addEventListener('click', function() {
            // Sembunyikan halaman checkout
            const modalPembayaran = document.getElementById('modal-checkout');
            if(modalPembayaran) modalPembayaran.classList.remove('show');
            
            // Munculkan kembali keranjang belanja
            const modalKeranjangBelanja = document.getElementById('modal-keranjang');
            if(modalKeranjangBelanja) modalKeranjangBelanja.classList.add('show');
        });
    }
    
    // ==========================================
    // TAMBAHAN: UPDATE HARGA OTOMATIS SAAT EKSPEDISI DIUBAH
    // ==========================================
    const dropdownEkspedisi = document.getElementById('pilihan-ekspedisi');
    
    if(dropdownEkspedisi) {
        dropdownEkspedisi.addEventListener('change', function() {
            let subtotal = 0;
            cartItems.forEach(item => { subtotal += parseInt(item.price); });
            
            let ongkirBaru = parseInt(this.value);
            let totalBaru = subtotal + ongkirBaru;
            
            if(checkoutTotal) checkoutTotal.textContent = formatRupiah(totalBaru);
            
            // --- KODE BARU UNTUK MENGUBAH TEKS ONGKOS KIRIM ---
            const teksOngkir = document.getElementById('checkout-ongkir');
            if(teksOngkir) {
                if(ongkirBaru === 0) {
                    teksOngkir.textContent = 'Gratis';
                    teksOngkir.style.color = '#22c55e'; // Warna hijau jika gratis
                } else {
                    teksOngkir.textContent = formatRupiah(ongkirBaru);
                    teksOngkir.style.color = '#111827'; // Warna hitam/normal
                }
            }
        });
    }

});