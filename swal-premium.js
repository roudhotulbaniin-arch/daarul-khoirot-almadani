/* ================================================================
   SWEETALERT PREMIUM — Library All-in-One
   Untuk: Daarul Khoirot Almadani
   Style: Konsisten dengan tema hijau tua & font Quicksand
   ================================================================ */

const SwalPremium = (function() {
    
    // Base config untuk semua alert
    const baseConfig = {
        customClass: {
            popup: 'swal-premium-popup',
            title: 'swal-premium-title',
            htmlContainer: 'swal-premium-html',
            confirmButton: 'swal-premium-btn swal-premium-confirm',
            cancelButton: 'swal-premium-btn swal-premium-cancel',
            denyButton: 'swal-premium-btn swal-premium-deny'
        },
        buttonsStyling: false,
        reverseButtons: true,
        showClass: {
            popup: 'swal-anim-zoomIn'
        },
        hideClass: {
            popup: 'swal-anim-zoomOut'
        }
    };
    
    // ============================================================
    // 1. CONFIRM — Konfirmasi Umum
    // ============================================================
    function confirm({ 
        title = 'Konfirmasi', 
        text = 'Apakah Anda yakin?',
        icon = 'question',
        confirmText = 'Ya, Lanjutkan',
        cancelText = 'Batal',
        color = 'primary'  // 'primary' | 'danger' | 'warning' | 'success'
    } = {}) {
        const iconData = getIconData(icon, color);
        
        return Swal.fire({
            ...baseConfig,
            title,
            html: `
                <div class="swal-icon-wrap swal-icon-${color}">
                    <i class="${iconData.class}"></i>
                </div>
                <p class="swal-text">${text}</p>
            `,
            showCancelButton: true,
            confirmButtonText: `<i class="fas fa-check"></i> ${confirmText}`,
            cancelButtonText: `<i class="fas fa-times"></i> ${cancelText}`,
            focusCancel: true,
            customClass: {
                ...baseConfig.customClass,
                confirmButton: `swal-premium-btn swal-btn-${color}`,
                cancelButton: 'swal-premium-btn swal-btn-gray'
            }
        });
    }
    
    // ============================================================
    // 2. SUCCESS — Notifikasi Berhasil
    // ============================================================
    function success({ 
        title = 'Berhasil!', 
        text = 'Data telah disimpan.',
        timer = 2000,
        showButton = false
    } = {}) {
        return Swal.fire({
            ...baseConfig,
            title,
            html: `
                <div class="swal-icon-wrap swal-icon-success">
                    <i class="fas fa-check-circle"></i>
                </div>
                <p class="swal-text">${text}</p>
            `,
            timer: showButton ? undefined : timer,
            timerProgressBar: !showButton,
            showConfirmButton: showButton,
            confirmButtonText: '<i class="fas fa-thumbs-up"></i> OK',
            customClass: {
                ...baseConfig.customClass,
                confirmButton: 'swal-premium-btn swal-btn-success'
            }
        });
    }
    
    // ============================================================
    // 3. ERROR — Notifikasi Gagal
    // ============================================================
    function error({ 
        title = 'Terjadi Kesalahan', 
        text = 'Silakan coba lagi.',
        detail = ''
    } = {}) {
        return Swal.fire({
            ...baseConfig,
            title,
            html: `
                <div class="swal-icon-wrap swal-icon-danger">
                    <i class="fas fa-times-circle"></i>
                </div>
                <p class="swal-text">${text}</p>
                ${detail ? `<div class="swal-detail">${detail}</div>` : ''}
            `,
            confirmButtonText: '<i class="fas fa-redo"></i> Mengerti',
            customClass: {
                ...baseConfig.customClass,
                confirmButton: 'swal-premium-btn swal-btn-danger'
            }
        });
    }
    
    // ============================================================
    // 4. WARNING — Peringatan
    // ============================================================
    function warning({ 
        title = 'Peringatan', 
        text = 'Perhatikan hal berikut.',
        confirmText = 'OK, Saya Mengerti'
    } = {}) {
        return Swal.fire({
            ...baseConfig,
            title,
            html: `
                <div class="swal-icon-wrap swal-icon-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <p class="swal-text">${text}</p>
            `,
            confirmButtonText: `<i class="fas fa-check"></i> ${confirmText}`,
            customClass: {
                ...baseConfig.customClass,
                confirmButton: 'swal-premium-btn swal-btn-warning'
            }
        });
    }
    
    // ============================================================
    // 5. INFO — Informasi
    // ============================================================
    function info({ 
        title = 'Informasi', 
        text = '',
        html = ''
    } = {}) {
        return Swal.fire({
            ...baseConfig,
            title,
            html: `
                <div class="swal-icon-wrap swal-icon-info">
                    <i class="fas fa-info-circle"></i>
                </div>
                ${html || `<p class="swal-text">${text}</p>`}
            `,
            confirmButtonText: '<i class="fas fa-thumbs-up"></i> Mengerti',
            customClass: {
                ...baseConfig.customClass,
                confirmButton: 'swal-premium-btn swal-btn-info'
            }
        });
    }
    
    // ============================================================
    // 6. LOADING — Proses Berjalan
    // ============================================================
    function loading({ 
        title = 'Sedang Memproses...', 
        text = 'Mohon tunggu sebentar'
    } = {}) {
        return Swal.fire({
            ...baseConfig,
            title,
            html: `
                <div class="swal-loading-wrap">
                    <div class="swal-loading-spinner">
                        <div></div><div></div><div></div><div></div>
                    </div>
                </div>
                <p class="swal-text">${text}</p>
            `,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false
        });
    }
    
    // ============================================================
    // 7. LOGOUT — Khusus Konfirmasi Logout
    // ============================================================
    function logout({ 
        onConfirm = null,
        redirectUrl = 'index.html'
    } = {}) {
        return Swal.fire({
            ...baseConfig,
            title: 'Konfirmasi Logout',
            html: `
                <div class="swal-icon-wrap swal-icon-danger swal-pulse">
                    <i class="fas fa-sign-out-alt"></i>
                </div>
                <p class="swal-text">
                    Apakah Anda yakin ingin <b style="color:#dc2626;">keluar</b> dari sistem?
                </p>
                <p class="swal-subtext">Sesi admin akan diakhiri</p>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-sign-out-alt"></i> Ya, Logout',
            cancelButtonText: '<i class="fas fa-times"></i> Batal',
            focusCancel: true,
            customClass: {
                ...baseConfig.customClass,
                confirmButton: 'swal-premium-btn swal-btn-danger',
                cancelButton: 'swal-premium-btn swal-btn-gray'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                loading({ title: 'Sedang Logout...', text: 'Mengakhiri sesi Anda' });
                
                setTimeout(() => {
                    if (typeof onConfirm === 'function') {
                        onConfirm();
                    } else {
                        localStorage.clear();
                        sessionStorage.clear();
                        window.location.href = redirectUrl;
                    }
                }, 1200);
            }
        });
    }
    
    // ============================================================
    // 8. DELETE — Konfirmasi Hapus Data
    // ============================================================
    function deleteConfirm({ 
        title = 'Hapus Data?', 
        text = 'Data yang dihapus tidak dapat dikembalikan!',
        itemName = ''
    } = {}) {
        return Swal.fire({
            ...baseConfig,
            title,
            html: `
                <div class="swal-icon-wrap swal-icon-danger swal-shake">
                    <i class="fas fa-trash-alt"></i>
                </div>
                <p class="swal-text">${text}</p>
                ${itemName ? `<div class="swal-item-tag"><i class="fas fa-tag"></i> ${itemName}</div>` : ''}
                <p class="swal-subtext">⚠️ Tindakan ini permanen</p>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-trash-alt"></i> Ya, Hapus',
            cancelButtonText: '<i class="fas fa-times"></i> Batal',
            focusCancel: true,
            customClass: {
                ...baseConfig.customClass,
                confirmButton: 'swal-premium-btn swal-btn-danger',
                cancelButton: 'swal-premium-btn swal-btn-gray'
            }
        });
    }
    
    // ============================================================
    // 9. TOAST — Notifikasi Pojok (Non-blocking)
    // ============================================================
    function toast({ 
        title = 'Berhasil', 
        icon = 'success',  // 'success' | 'error' | 'warning' | 'info'
        position = 'top-end',
        timer = 3000
    } = {}) {
        const iconMap = {
            success: { class: 'fas fa-check-circle', color: 'success' },
            error: { class: 'fas fa-times-circle', color: 'danger' },
            warning: { class: 'fas fa-exclamation-triangle', color: 'warning' },
            info: { class: 'fas fa-info-circle', color: 'info' }
        };
        const ic = iconMap[icon] || iconMap.info;
        
        return Swal.fire({
            toast: true,
            position,
            timer,
            timerProgressBar: true,
            showConfirmButton: false,
            title,
            html: `<i class="${ic.class}" style="margin-right:8px; color:var(--toast-color);"></i>${title}`,
            customClass: {
                popup: `swal-premium-toast swal-toast-${ic.color}`
            }
        });
    }
    
    // ============================================================
    // 10. INPUT — Meminta Input User
    // ============================================================
    function input({ 
        title = 'Masukkan Data', 
        text = '',
        placeholder = 'Ketik di sini...',
        inputType = 'text',  // 'text' | 'password' | 'number' | 'email'
        confirmText = 'Simpan'
    } = {}) {
        return Swal.fire({
            ...baseConfig,
            title,
            html: `
                <div class="swal-icon-wrap swal-icon-info">
                    <i class="fas fa-keyboard"></i>
                </div>
                ${text ? `<p class="swal-text">${text}</p>` : ''}
            `,
            input: inputType,
            inputPlaceholder: placeholder,
            inputAttributes: {
                autocapitalize: 'off',
                autocorrect: 'off'
            },
            showCancelButton: true,
            confirmButtonText: `<i class="fas fa-save"></i> ${confirmText}`,
            cancelButtonText: '<i class="fas fa-times"></i> Batal',
            customClass: {
                ...baseConfig.customClass,
                input: 'swal-premium-input',
                confirmButton: 'swal-premium-btn swal-btn-primary',
                cancelButton: 'swal-premium-btn swal-btn-gray'
            },
            inputValidator: (value) => {
                if (!value) return 'Data tidak boleh kosong!';
            }
        });
    }
    
    // ============================================================
    // HELPER — Icon Data
    // ============================================================
    function getIconData(icon, color) {
        const icons = {
            question: 'fas fa-question-circle',
            success: 'fas fa-check-circle',
            error: 'fas fa-times-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle',
            trash: 'fas fa-trash-alt',
            logout: 'fas fa-sign-out-alt',
            save: 'fas fa-save'
        };
        return {
            class: icons[icon] || icons.info,
            color
        };
    }
    
    // Public API
    return {
        confirm,
        success,
        error,
        warning,
        info,
        loading,
        logout,
        deleteConfirm,
        toast,
        input,
        close: () => Swal.close()
    };
    
})();