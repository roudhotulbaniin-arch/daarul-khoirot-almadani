window.addEventListener('error', function(e) {
    alert('❌ ERROR: ' + e.message + '\nFile: ' + e.filename + '\nLine: ' + e.lineno);
});

console.log('🔥 custom-dropdown.js loading...');

// ================================================================
// CUSTOM DROPDOWN — Reusable Component
// ================================================================
// Cara pakai:
//   1. Set atribut data-cd="true" di <select> yang mau diubah jadi custom
//   2. Panggil: CustomDropdown.init() saat halaman load
//   3. Atau langsung: CustomDropdown.create(document.getElementById('mySelect'))
// ================================================================

const CustomDropdown = (function () {
    
    let activeDropdown = null; // Track dropdown yang lagi open
    let idCounter = 0;


/* ---------------------------------------------------
   AUTO ASSIGN IKON DROPDOWN BERDASARKAN NAME
--------------------------------------------------- */
const iconMapByName = {
    'tingkat_unit'  : 'fas fa-user-graduate',
    'jenis_kelamin' : 'fas fa-venus-mars',
    'st_ayah'       : 'fas fa-male',
    'st_ibu'        : 'fas fa-female',
    'st_wali'       : 'fas fa-user-shield',
    'wn_ayah'       : 'fas fa-flag',
    'wn_ibu'        : 'fas fa-flag',
    'pdk_ayah'      : 'fas fa-graduation-cap',
    'pdk_ibu'       : 'fas fa-graduation-cap',
    'pjk_ayah'      : 'fas fa-briefcase',
    'pjk_ibu'       : 'fas fa-briefcase',
    'hasil_ayah'    : 'fas fa-money-bill-wave',
    'hasil_ibu'     : 'fas fa-money-bill-wave',
    'milik_ayah'    : 'fas fa-home',
    'biaya'         : 'fas fa-hand-holding-usd',
    'disabilitas'   : 'fas fa-wheelchair',
    'keb_khusus'    : 'fas fa-notes-medical',
    'pilih_dom_ibu'    : 'fas fa-map-marked-alt',
    'pilih_dom_santri' : 'fas fa-map-marked-alt',
};

// Provinsi / Kabupaten / Kecamatan / Desa → semua pakai ikon lokasi
const iconLokasi = 'fas fa-map-marker-alt';

document.querySelectorAll('form select').forEach(sel => {
    const name = sel.getAttribute('name') || '';
    let icon = iconMapByName[name] || '';

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
    
    /**
     * Init semua <select data-cd="true"> di halaman
     */
    function init(selector = 'select[data-cd="true"]') {
        document.querySelectorAll(selector).forEach(sel => create(sel));
    }
    
    /**
     * Create custom dropdown dari 1 element <select>
     */
    function create(selectEl) {
        if (!selectEl || selectEl.dataset.cdInit === 'true') return;
        selectEl.dataset.cdInit = 'true';
        
        const id = 'cd-' + (++idCounter);
        const searchable = selectEl.dataset.cdSearch === 'true';
        const size = selectEl.dataset.cdSize || ''; // '' | 'sm' | 'lg'
        const placeholder = selectEl.dataset.cdPlaceholder || 'Pilih...';
        const emptyText = selectEl.dataset.cdEmpty || 'Tidak ada pilihan';
        const iconMap = parseIconMap(selectEl.dataset.cdIcons); // {value: icon-class}
        
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'cd-wrapper' + (size ? ` cd-${size}` : '');
        wrapper.id = id;
        
        // Insert wrapper sebelum select
        selectEl.parentNode.insertBefore(wrapper, selectEl);
        wrapper.appendChild(selectEl);
        selectEl.classList.add('cd-native');
        
        // Build UI
        buildUI(wrapper, selectEl, { searchable, placeholder, emptyText, iconMap });

    // Store placeholder
    wrapper.dataset.placeholder = placeholder;
    wrapper.dataset.emptyText = emptyText;
    
    // ⭐ TAMBAH INI — Support variant
    const variant = selectEl.dataset.cdVariant || '';
    if (variant) {
        wrapper.dataset.cdVariantActive = variant;
    }
    
    // ⭐ TAMBAH INI — Set data-value awal
    wrapper.dataset.value = selectEl.value || '';
        
        // Return API untuk kontrol dari luar
        return {
            wrapper,
            select: selectEl,
            refresh: () => refresh(wrapper),
            open: () => openMenu(wrapper),
            close: () => closeMenu(wrapper),
            setValue: (val) => setValue(wrapper, val)
        };
    }
    
    /**
     * Refresh dropdown (jika <option> berubah via JS)
     */

    function refresh(wrapper) {
    const selectEl = wrapper.querySelector('select.cd-native');
    if (!selectEl) return;
    
    const optionsContainer = wrapper.querySelector('.cd-options');
    if (!optionsContainer) return;
    
    const iconMap = parseIconMap(selectEl.dataset.cdIcons);
    renderOptions(wrapper, selectEl, iconMap);
    updateTrigger(wrapper, selectEl);
    
    // ⭐ TAMBAH INI — Update data-value
    wrapper.dataset.value = selectEl.value || '';
}
    
    /**
     * Set value dropdown (juga trigger event change)
     */
    function setValue(wrapper, value) {
        const selectEl = wrapper.querySelector('select.cd-native');
        if (!selectEl) return;
        
        selectEl.value = value;
        selectEl.dispatchEvent(new Event('change', { bubbles: true }));
        updateTrigger(wrapper, selectEl);
    }
    
    // ----------------------------------------------------------------
    // Private Functions
    // ----------------------------------------------------------------
    
    function buildUI(wrapper, selectEl, opts) {
        const { searchable, placeholder, emptyText, iconMap } = opts;
        
        // Trigger button
        // Trigger button
const trigger = document.createElement('button');
trigger.type = 'button';
trigger.className = 'cd-trigger';
trigger.innerHTML = `
    <span class="cd-selected-label"></span>
    <i class="fas fa-chevron-down cd-arrow"></i>
`;
        
        if (selectEl.disabled) trigger.classList.add('disabled');
        wrapper.appendChild(trigger);
        
        // Menu
        const menu = document.createElement('div');
        menu.className = 'cd-menu';
        
        // Search bar (jika enabled)
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
            
            // Prevent close on click search
            searchInput.addEventListener('click', (e) => e.stopPropagation());
        }
        
        // Options container
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'cd-options';
        menu.appendChild(optionsContainer);
        
        wrapper.appendChild(menu);
        
        // Render options & trigger
        renderOptions(wrapper, selectEl, iconMap);
        updateTrigger(wrapper, selectEl, placeholder);
        
        // Store placeholder
        wrapper.dataset.placeholder = placeholder;
        wrapper.dataset.emptyText = emptyText;
        
        // Event: toggle
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (selectEl.disabled) return;
            toggleMenu(wrapper);
        });
        
        // Event: keyboard navigation
        wrapper.addEventListener('keydown', (e) => handleKeyboard(wrapper, e));
        trigger.setAttribute('tabindex', '0');
    }

    function renderOptions(wrapper, selectEl, iconMap = {}) {
    const optionsContainer = wrapper.querySelector('.cd-options');
    if (!optionsContainer) return;
    
    const currentValue = selectEl.value;
    
    // Ambil semua children (option + optgroup)
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
            // Header grup
            html += `<div class="cd-group-header">${escapeHTML(child.label || '')}</div>`;
            
            // Options di dalam grup
            Array.from(child.children).forEach(opt => {
                if (opt.tagName === 'OPTION') {
                    const val = opt.value;
                    const label = opt.textContent.trim();
                    const isSelected = val === currentValue;
                    const icon = iconMap[val] || opt.dataset.icon || '';
                    const iconHTML = icon ? `<i class="${icon}"></i>` : '';
                    
                    html += `
                        <div class="cd-option ${isSelected ? 'selected' : ''}" 
                             data-value="${escapeHTML(val)}"
                             data-label="${escapeHTML(label)}">
                            ${iconHTML}
                            <span>${escapeHTML(label)}</span>
                        </div>
                    `;
                }
            });
        } else if (child.tagName === 'OPTION') {
            const val = child.value;
            const label = child.textContent.trim();
            const isSelected = val === currentValue;
            const icon = iconMap[val] || child.dataset.icon || '';
            const iconHTML = icon ? `<i class="${icon}"></i>` : '';
            
            html += `
                <div class="cd-option ${isSelected ? 'selected' : ''}" 
                     data-value="${escapeHTML(val)}"
                     data-label="${escapeHTML(label)}">
                    ${iconHTML}
                    <span>${escapeHTML(label)}</span>
                </div>
            `;
        }
    });
    
    optionsContainer.innerHTML = html;
    
    // Bind click events
    optionsContainer.querySelectorAll('.cd-option').forEach(optEl => {
        optEl.addEventListener('click', (e) => {
            e.stopPropagation();
            const val = optEl.dataset.value;
            selectValue(wrapper, val);
        });
        
        optEl.addEventListener('mouseenter', () => {
            optionsContainer.querySelectorAll('.cd-option.highlighted')
                .forEach(el => el.classList.remove('highlighted'));
            optEl.classList.add('highlighted');
        });
    });
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
    
    // Update selected state
    wrapper.querySelectorAll('.cd-option').forEach(el => {
        el.classList.toggle('selected', el.dataset.value === value);
    });
    
    // ⭐ TAMBAH INI — Update data-value untuk styling variant
    wrapper.dataset.value = value;
    
    closeMenu(wrapper);
}
    
    function toggleMenu(wrapper) {
        if (wrapper.classList.contains('open')) {
            closeMenu(wrapper);
        } else {
            openMenu(wrapper);
        }
    }
    
    function openMenu(wrapper) {
        // Close active dropdown
        if (activeDropdown && activeDropdown !== wrapper) {
            closeMenu(activeDropdown);
        }
        
        // Check if should open up
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
        
        // Auto focus search jika ada
        const searchInput = wrapper.querySelector('.cd-search input');
        if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
        }
        
        // Scroll ke selected
        const selected = wrapper.querySelector('.cd-option.selected');
        if (selected) {
            setTimeout(() => {
                selected.scrollIntoView({ block: 'nearest' });
            }, 100);
        }
    }
    
    function closeMenu(wrapper) {
        wrapper.classList.remove('open');
        
        // Reset search
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
        
        // Empty state
        let emptyEl = wrapper.querySelector('.cd-options .cd-empty-search');
        if (visibleCount === 0) {
            if (!emptyEl) {
                emptyEl = document.createElement('div');
                emptyEl.className = 'cd-empty cd-empty-search';
                emptyEl.innerHTML = `
                    <i class="fas fa-search"></i>
                    Tidak ditemukan
                `;
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
                if (!isOpen) {
                    e.preventDefault();
                    openMenu(wrapper);
                } else if (highlighted) {
                    e.preventDefault();
                    selectValue(wrapper, highlighted.dataset.value);
                }
                break;
            
            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) openMenu(wrapper);
                else {
                    currentIdx = (currentIdx + 1) % options.length;
                    highlightOption(wrapper, options[currentIdx]);
                }
                break;
            
            case 'ArrowUp':
                e.preventDefault();
                if (!isOpen) openMenu(wrapper);
                else {
                    currentIdx = currentIdx <= 0 ? options.length - 1 : currentIdx - 1;
                    highlightOption(wrapper, options[currentIdx]);
                }
                break;
            
            case 'Escape':
                if (isOpen) {
                    e.preventDefault();
                    closeMenu(wrapper);
                }
                break;
        }
    }
    
    function highlightOption(wrapper, opt) {
        if (!opt) return;
        wrapper.querySelectorAll('.cd-option.highlighted')
            .forEach(el => el.classList.remove('highlighted'));
        opt.classList.add('highlighted');
        opt.scrollIntoView({ block: 'nearest' });
    }
    
    function parseIconMap(str) {
        if (!str) return {};
        try {
            return JSON.parse(str);
        } catch {
            return {};
        }
    }
    
    function escapeHTML(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (activeDropdown && !activeDropdown.contains(e.target)) {
            closeMenu(activeDropdown);
        }
    });
    
    // Close on scroll (biar posisi ga geser)
    let scrollTimeout;
    document.addEventListener('scroll', () => {
        if (!activeDropdown) return;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (activeDropdown) closeMenu(activeDropdown);
        }, 200);
    }, true);
    
    // Public API
    return {
        init,
        create,
        refresh: (el) => {
            const wrapper = el.closest('.cd-wrapper') || el;
            refresh(wrapper);
        },
        setValue: (el, val) => {
            const wrapper = el.closest('.cd-wrapper') || el;
            setValue(wrapper, val);
        },
        open: (el) => openMenu(el.closest('.cd-wrapper') || el),
        close: (el) => closeMenu(el.closest('.cd-wrapper') || el)
    };
    
})();


// Auto-init saat DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CustomDropdown.init());
} else {
    CustomDropdown.init();
}
