/* ================================================================
   AUTO ASSIGN IKON DROPDOWN (dijalankan saat DOM siap)
================================================================ */

function autoAssignDropdownIcons() {
    const iconMapByName = {
        /* ===== Data Santri ===== */
        'tingkat_unit'  : 'fas fa-user-graduate',
        'jenis_kelamin' : 'fas fa-venus-mars',
        'cita'          : 'fas fa-bullseye',
        'cita_cita'     : 'fas fa-bullseye',
        'hobi'          : 'fas fa-palette',
        'hobi_santri'   : 'fas fa-palette',
        'keb_khusus'    : 'fas fa-notes-medical',
        'disabilitas'   : 'fas fa-wheelchair',
        'biaya'         : 'fas fa-hand-holding-usd',
        'biaya_sekolah' : 'fas fa-hand-holding-usd',
        'biaya_oleh'    : 'fas fa-hand-holding-usd',
        'anak_ke'       : 'fas fa-child',
        'jml_saudara'   : 'fas fa-users',

        /* ===== Ayah ===== */
        'st_ayah'       : 'fas fa-male',
        'wn_ayah'       : 'fas fa-flag',
        'pdk_ayah'      : 'fas fa-graduation-cap',
        'pjk_ayah'      : 'fas fa-briefcase',
        'hasil_ayah'    : 'fas fa-money-bill-wave',
        'milik_ayah'    : 'fas fa-home',

        /* ===== Ibu ===== */
        'st_ibu'        : 'fas fa-female',
        'wn_ibu'        : 'fas fa-flag',
        'pdk_ibu'       : 'fas fa-graduation-cap',
        'pjk_ibu'       : 'fas fa-briefcase',
        'hasil_ibu'     : 'fas fa-money-bill-wave',

        /* ===== Wali ===== */
        'st_wali'       : 'fas fa-user-shield',

        /* ===== Domisili ===== */
        'pilih_dom_ibu'    : 'fas fa-map-marked-alt',
        'pilih_dom_santri' : 'fas fa-map-marked-alt',

        /* ===== Jarak & Transportasi ===== */
        'jarak'            : 'fas fa-route',
        'jarak_lembaga'    : 'fas fa-route',
        'jarak_ke_lembaga' : 'fas fa-route',
        'transportasi'     : 'fas fa-bus',
        'trans'            : 'fas fa-bus',
        'waktu_tempuh'     : 'fas fa-clock',
        'waktu'            : 'fas fa-clock',

        /* ===== Informasi Tambahan / Pernyataan ===== */
        'w_visi'        : 'fas fa-eye',
        'w_pola'        : 'fas fa-clipboard-list',
        'w_perilaku'    : 'fas fa-user-check',
        'w_sehat'       : 'fas fa-heartbeat',
        'w_tazir'       : 'fas fa-balance-scale',
        'w_harapan'     : 'fas fa-star',

        /* ===== Alternatif nama field ===== */
        'visi_ortu'         : 'fas fa-eye',
        'visi_orang_tua'    : 'fas fa-eye',
        'pola_disiplin'     : 'fas fa-clipboard-list',
        'pola_rumah'        : 'fas fa-clipboard-list',
        'perilaku_dominan'  : 'fas fa-user-check',
        'kondisi_kesehatan' : 'fas fa-heartbeat',
        'sikap_sanksi'      : 'fas fa-balance-scale',
        'sikap_tazir'       : 'fas fa-balance-scale',
        'harapan'           : 'fas fa-star',
        'harapan_terbesar'  : 'fas fa-star',
    };

    const iconLokasi = 'fas fa-map-marker-alt';

    document.querySelectorAll('form select').forEach(sel => {
        const name = sel.getAttribute('name') || '';
        let icon = iconMapByName[name] || '';

        // Fallback wilayah
        if (!icon) {
            if (name.startsWith('prov_') ||
                name.startsWith('kab_')  ||
                name.startsWith('kec_')  ||
                name.startsWith('desa_')) {
                icon = iconLokasi;
            }
        }

        if (icon && !sel.hasAttribute('data-cd-main-icon')) {
            sel.setAttribute('data-cd-main-icon', icon);
        }
    });

    /* ===== FALLBACK — Berdasarkan LABEL (untuk yang belum ke-mapping) ===== */
    const labelIconMap = [
        { keywords: ['cita'],                  icon: 'fas fa-bullseye' },
        { keywords: ['hobi'],                  icon: 'fas fa-palette' },
        { keywords: ['jarak'],                 icon: 'fas fa-route' },
        { keywords: ['transportasi'],          icon: 'fas fa-bus' },
        { keywords: ['waktu tempuh', 'waktu'], icon: 'fas fa-clock' },
        { keywords: ['visi'],                  icon: 'fas fa-eye' },
        { keywords: ['pola disiplin', 'pola'], icon: 'fas fa-clipboard-list' },
        { keywords: ['perilaku'],              icon: 'fas fa-user-check' },
        { keywords: ['kondisi kesehatan', 'kesehatan'], icon: 'fas fa-heartbeat' },
        { keywords: ['sanksi', 'tazir'],       icon: 'fas fa-balance-scale' },
        { keywords: ['harapan'],               icon: 'fas fa-star' },
        { keywords: ['biaya'],                 icon: 'fas fa-hand-holding-usd' },
        { keywords: ['kebutuhan khusus'],      icon: 'fas fa-notes-medical' },
        { keywords: ['disabilitas'],           icon: 'fas fa-wheelchair' },
        { keywords: ['unit', 'kelas', 'jenjang'],        icon: 'fas fa-user-graduate' },
        { keywords: ['jenis kelamin', 'gender'],         icon: 'fas fa-venus-mars' },
        { keywords: ['pendidikan'],            icon: 'fas fa-graduation-cap' },
        { keywords: ['pekerjaan'],             icon: 'fas fa-briefcase' },
        { keywords: ['penghasilan', 'gaji'],   icon: 'fas fa-money-bill-wave' },
        { keywords: ['domisili', 'tinggal'],   icon: 'fas fa-map-marked-alt' },
        { keywords: ['provinsi'],              icon: 'fas fa-map-marker-alt' },
        { keywords: ['kabupaten', 'kota'],     icon: 'fas fa-city' },
        { keywords: ['kecamatan'],             icon: 'fas fa-map' },
        { keywords: ['desa', 'kelurahan'],     icon: 'fas fa-map-pin' },
        { keywords: ['warga negara', 'kewarganegaraan'], icon: 'fas fa-flag' },
        { keywords: ['status ayah'],           icon: 'fas fa-male' },
        { keywords: ['status ibu'],            icon: 'fas fa-female' },
        { keywords: ['wali'],                  icon: 'fas fa-user-shield' },
        { keywords: ['kepemilikan', 'rumah'],  icon: 'fas fa-home' },
        { keywords: ['anak ke'],               icon: 'fas fa-child' },
        { keywords: ['jumlah saudara'],        icon: 'fas fa-users' },
    ];

    document.querySelectorAll('form select').forEach(sel => {
        if (sel.hasAttribute('data-cd-main-icon')) return;

        let labelText = '';

        // 1. Cek <label for="...">
        if (sel.id) {
            const lbl = document.querySelector(`label[for="${sel.id}"]`);
            if (lbl) labelText = lbl.textContent.toLowerCase();
        }

        // 2. Cek label di parent group
        if (!labelText) {
            const group = sel.closest('.form-group, .input-group, .field-group, div');
            if (group) {
                const lbl = group.querySelector('label');
                if (lbl) labelText = lbl.textContent.toLowerCase();
            }
        }

        if (!labelText) return;

        for (const item of labelIconMap) {
            if (item.keywords.some(k => labelText.includes(k))) {
                sel.setAttribute('data-cd-main-icon', item.icon);
                break;
            }
        }
    });

    console.log('✅ Ikon dropdown otomatis di-assign (name + label)');
}

/* ================================================================
   CUSTOM DROPDOWN — Reusable Component
================================================================ */
const CustomDropdown = (function () {

    let activeDropdown = null;
    let idCounter = 0;

    function init(selector = 'select[data-cd="true"]') {
        document.querySelectorAll(selector).forEach(sel => create(sel));
    }

    function create(selectEl) {
        if (!selectEl || selectEl.dataset.cdInit === 'true') return;
        selectEl.dataset.cdInit = 'true';

        const id = 'cd-' + (++idCounter);
        const searchable = selectEl.dataset.cdSearch === 'true';
        const size = selectEl.dataset.cdSize || '';
        const placeholder = selectEl.dataset.cdPlaceholder || 'Pilih...';
        const emptyText = selectEl.dataset.cdEmpty || 'Tidak ada pilihan';
        const mainIcon = selectEl.dataset.cdMainIcon || '';
        const iconMap = parseIconMap(selectEl.dataset.cdIcons);

        const wrapper = document.createElement('div');
        wrapper.className = 'cd-wrapper' + (size ? ` cd-${size}` : '');
        wrapper.id = id;

        if (mainIcon) {
            wrapper.classList.add('has-main-icon');
            wrapper.dataset.mainIcon = mainIcon;
        }

        selectEl.parentNode.insertBefore(wrapper, selectEl);
        wrapper.appendChild(selectEl);
        selectEl.classList.add('cd-native');

        buildUI(wrapper, selectEl, { searchable, placeholder, emptyText, iconMap, mainIcon });

        wrapper.dataset.placeholder = placeholder;
        wrapper.dataset.emptyText = emptyText;

        const variant = selectEl.dataset.cdVariant || '';
        if (variant) wrapper.dataset.cdVariantActive = variant;

        wrapper.dataset.value = selectEl.value || '';

        return {
            wrapper,
            select: selectEl,
            refresh: () => refresh(wrapper),
            open: () => openMenu(wrapper),
            close: () => closeMenu(wrapper),
            setValue: (val) => setValue(wrapper, val)
        };
    }

    function refresh(wrapper) {
        const selectEl = wrapper.querySelector('select.cd-native');
        if (!selectEl) return;

        const optionsContainer = wrapper.querySelector('.cd-options');
        if (!optionsContainer) return;

        const iconMap = parseIconMap(selectEl.dataset.cdIcons);
        renderOptions(wrapper, selectEl, iconMap);
        updateTrigger(wrapper, selectEl);

        wrapper.dataset.value = selectEl.value || '';
    }

    function setValue(wrapper, value) {
        const selectEl = wrapper.querySelector('select.cd-native');
        if (!selectEl) return;

        selectEl.value = value;
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        updateTrigger(wrapper, selectEl);
    }

    function buildUI(wrapper, selectEl, opts) {
        const { searchable, placeholder, emptyText, iconMap, mainIcon } = opts;

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'cd-trigger';

        const mainIconHTML = mainIcon
            ? `<i class="${mainIcon} cd-main-icon"></i>`
            : '';

        trigger.innerHTML = `
            ${mainIconHTML}
            <span class="cd-selected-label"></span>
            <i class="fas fa-chevron-down cd-arrow"></i>
        `;

        if (mainIcon) trigger.classList.add('has-main-icon');
        if (selectEl.disabled) trigger.classList.add('disabled');
        wrapper.appendChild(trigger);

        const menu = document.createElement('div');
        menu.className = 'cd-menu';

        if (searchable) {
            const searchWrap = document.createElement('div');
            searchWrap.className = 'cd-search';
            searchWrap.innerHTML = `
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Cari...">
            `;
            menu.appendChild(searchWrap);

            const searchInput = searchWrap.querySelector('input');
            searchInput.addEventListener('input', (e) => {
                filterOptions(wrapper, e.target.value);
            });
            searchInput.addEventListener('click', (e) => e.stopPropagation());
        }

        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'cd-options';
        menu.appendChild(optionsContainer);
        wrapper.appendChild(menu);

        renderOptions(wrapper, selectEl, iconMap);
        updateTrigger(wrapper, selectEl, placeholder);

        wrapper.dataset.placeholder = placeholder;
        wrapper.dataset.emptyText = emptyText;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (selectEl.disabled) return;
            toggleMenu(wrapper);
        });

        wrapper.addEventListener('keydown', (e) => handleKeyboard(wrapper, e));
        trigger.setAttribute('tabindex', '0');
    }

    function renderOptions(wrapper, selectEl, iconMap = {}) {
        const optionsContainer = wrapper.querySelector('.cd-options');
        if (!optionsContainer) return;

        const currentValue = selectEl.value;
        const children = Array.from(selectEl.children);

        if (children.length === 0) {
            optionsContainer.innerHTML = `
                <div class="cd-empty">
                    <i class="fas fa-inbox"></i>
                    ${wrapper.dataset.emptyText || 'Tidak ada pilihan'}
                </div>
            `;
            return;
        }

        let html = '';

        children.forEach(child => {
            if (child.tagName === 'OPTGROUP') {
                html += `<div class="cd-group-header">${escapeHTML(child.label || '')}</div>`;
                Array.from(child.children).forEach(opt => {
                    if (opt.tagName === 'OPTION') {
                        html += buildOptionHTML(opt, currentValue, iconMap);
                    }
                });
            } else if (child.tagName === 'OPTION') {
                html += buildOptionHTML(child, currentValue, iconMap);
            }
        });

        optionsContainer.innerHTML = html;

        optionsContainer.querySelectorAll('.cd-option').forEach(optEl => {
            optEl.addEventListener('click', (e) => {
                e.stopPropagation();
                selectValue(wrapper, optEl.dataset.value);
            });

            optEl.addEventListener('mouseenter', () => {
                optionsContainer.querySelectorAll('.cd-option.highlighted')
                    .forEach(el => el.classList.remove('highlighted'));
                optEl.classList.add('highlighted');
            });
        });
    }

    function buildOptionHTML(opt, currentValue, iconMap) {
        const val = opt.value;
        const label = opt.textContent.trim();
        const isSelected = val === currentValue;
        const icon = iconMap[val] || opt.dataset.icon || '';
        const iconHTML = icon ? `<i class="${icon}"></i>` : '';

        return `
            <div class="cd-option ${isSelected ? 'selected' : ''}"
                 data-value="${escapeHTML(val)}"
                 data-label="${escapeHTML(label)}">
                ${iconHTML}
                <span>${escapeHTML(label)}</span>
            </div>
        `;
    }

    function updateTrigger(wrapper, selectEl, placeholder) {
        const trigger = wrapper.querySelector('.cd-trigger');
        const labelEl = trigger.querySelector('.cd-selected-label');
        if (!labelEl) return;

        const ph = placeholder || wrapper.dataset.placeholder || 'Pilih...';
        const selectedOpt = selectEl.options[selectEl.selectedIndex];

        if (!selectedOpt || (selectedOpt.value === '' && selectedOpt.textContent.trim() === ph)) {
            labelEl.textContent = ph;
            trigger.classList.add('placeholder');
            return;
        }

        const iconMap = parseIconMap(selectEl.dataset.cdIcons);
        const icon = iconMap[selectedOpt.value] || selectedOpt.dataset.icon || '';
        const iconHTML = icon ? `<i class="${icon}"></i>` : '';

        labelEl.innerHTML = `${iconHTML}<span>${escapeHTML(selectedOpt.textContent.trim())}</span>`;

        if (selectedOpt.value === '') {
            trigger.classList.add('placeholder');
        } else {
            trigger.classList.remove('placeholder');
        }
    }

    function selectValue(wrapper, value) {
        const selectEl = wrapper.querySelector('select.cd-native');
        selectEl.value = value;
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));

        updateTrigger(wrapper, selectEl);

        wrapper.querySelectorAll('.cd-option').forEach(el => {
            el.classList.toggle('selected', el.dataset.value === value);
        });

        wrapper.dataset.value = value;
        closeMenu(wrapper);
    }

    function toggleMenu(wrapper) {
        if (wrapper.classList.contains('open')) closeMenu(wrapper);
        else openMenu(wrapper);
    }

    function openMenu(wrapper) {
        if (activeDropdown && activeDropdown !== wrapper) closeMenu(activeDropdown);

        const rect = wrapper.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        if (spaceBelow < 300 && spaceAbove > spaceBelow) {
            wrapper.classList.add('open-up');
        } else {
            wrapper.classList.remove('open-up');
        }

        wrapper.classList.add('open');
        activeDropdown = wrapper;

        const searchInput = wrapper.querySelector('.cd-search input');
        if (searchInput) setTimeout(() => searchInput.focus(), 100);

        const selected = wrapper.querySelector('.cd-option.selected');
        if (selected) setTimeout(() => selected.scrollIntoView({ block: 'nearest' }), 100);
    }

    function closeMenu(wrapper) {
        wrapper.classList.remove('open');
        const searchInput = wrapper.querySelector('.cd-search input');
        if (searchInput) {
            searchInput.value = '';
            filterOptions(wrapper, '');
        }
        if (activeDropdown === wrapper) activeDropdown = null;
    }

    function filterOptions(wrapper, keyword) {
        const kw = keyword.toLowerCase().trim();
        const options = wrapper.querySelectorAll('.cd-option');
        let visibleCount = 0;

        options.forEach(opt => {
            const label = opt.dataset.label.toLowerCase();
            const show = !kw || label.includes(kw);
            opt.style.display = show ? '' : 'none';
            if (show) visibleCount++;
        });

        let emptyEl = wrapper.querySelector('.cd-options .cd-empty-search');
        if (visibleCount === 0) {
            if (!emptyEl) {
                emptyEl = document.createElement('div');
                emptyEl.className = 'cd-empty cd-empty-search';
                emptyEl.innerHTML = `<i class="fas fa-search"></i> Tidak ditemukan`;
                wrapper.querySelector('.cd-options').appendChild(emptyEl);
            }
        } else if (emptyEl) {
            emptyEl.remove();
        }
    }

    function handleKeyboard(wrapper, e) {
        const isOpen = wrapper.classList.contains('open');
        const options = Array.from(
            wrapper.querySelectorAll('.cd-option:not([style*="display: none"])')
        );
        const highlighted = wrapper.querySelector('.cd-option.highlighted');
        let currentIdx = highlighted ? options.indexOf(highlighted) : -1;

        switch (e.key) {
            case 'Enter':
            case ' ':
                if (!isOpen) { e.preventDefault(); openMenu(wrapper); }
                else if (highlighted) { e.preventDefault(); selectValue(wrapper, highlighted.dataset.value); }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) openMenu(wrapper);
                else { currentIdx = (currentIdx + 1) % options.length; highlightOption(wrapper, options[currentIdx]); }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (!isOpen) openMenu(wrapper);
                else { currentIdx = currentIdx <= 0 ? options.length - 1 : currentIdx - 1; highlightOption(wrapper, options[currentIdx]); }
                break;
            case 'Escape':
                if (isOpen) { e.preventDefault(); closeMenu(wrapper); }
                break;
        }
    }

    function highlightOption(wrapper, opt) {
        if (!opt) return;
        wrapper.querySelectorAll('.cd-option.highlighted').forEach(el => el.classList.remove('highlighted'));
        opt.classList.add('highlighted');
        opt.scrollIntoView({ block: 'nearest' });
    }

    function parseIconMap(str) {
        if (!str) return {};
        try { return JSON.parse(str); } catch { return {}; }
    }

    function escapeHTML(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
    }

    document.addEventListener('click', (e) => {
        if (activeDropdown && !activeDropdown.contains(e.target)) closeMenu(activeDropdown);
    });

    let scrollTimeout;
    document.addEventListener('scroll', () => {
        if (!activeDropdown) return;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => { if (activeDropdown) closeMenu(activeDropdown); }, 200);
    }, true);

    return {
        init,
        create,
        refresh: (el) => refresh(el.closest('.cd-wrapper') || el),
        setValue: (el, val) => setValue(el.closest('.cd-wrapper') || el, val),
        open: (el) => openMenu(el.closest('.cd-wrapper') || el),
        close: (el) => closeMenu(el.closest('.cd-wrapper') || el)
    };

})();

/* ---------------------------------------------------
   TAMPILKAN TANGGAL DALAM FORMAT INDONESIA
--------------------------------------------------- */
function updateTglInfo() {
    const input = document.getElementById('tgl_daftar');
    const badge = document.getElementById('tglDaftarInfo');
    const txt   = document.getElementById('tglDaftarInfoText');
    if (!input || !badge || !txt) return;

    const val = input.value;
    if (!val) {
        badge.style.display = 'none';
        return;
    }

    const hari  = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const bulan = ['Januari','Februari','Maret','April','Mei','Juni',
                   'Juli','Agustus','September','Oktober','November','Desember'];

    const d = new Date(val);
    if (isNaN(d)) {
        badge.style.display = 'none';
        return;
    }

    txt.textContent = `${hari[d.getDay()]}, ${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
    badge.style.display = 'inline-block';
}

// Panggil saat load
updateTglInfo();

// Panggil saat berubah
const inputTgl = document.getElementById('tgl_daftar');
if (inputTgl) {
    inputTgl.addEventListener('change', updateTglInfo);
}

/* ================================================================
   AUTO INIT — Setelah DOM siap
================================================================ */
function bootCustomDropdown() {
    autoAssignDropdownIcons();  // 1. Tambah ikon
    CustomDropdown.init();      // 2. Init dropdown
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootCustomDropdown);
} else {
    bootCustomDropdown();
}