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
        const options = Array.from(selectEl.options);
        
        if (options.length === 0) {
            optionsContainer.innerHTML = `
                <div class="cd-empty">
                    <i class="fas fa-inbox"></i>
                    ${wrapper.dataset.emptyText || 'Tidak ada pilihan'}
                </div>
            `;
            return;
        }
        
        optionsContainer.innerHTML = options.map(opt => {
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
        }).join('');
        
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

// Export global
window.CustomDropdown = CustomDropdown;

/* ===== CUSTOM CALENDAR DROPDOWN ===== */
let calCurrentMonth, calCurrentYear, calSelectedDate = null;

function initCalendar() {
    const today = new Date();
    calCurrentMonth = today.getMonth();
    calCurrentYear = today.getFullYear();
    renderCalendar();
    
    // Set default hari ini
    calSelectDate(today);
    
    // Klik luar = tutup
    document.addEventListener('click', function(e) {
        const wrap = document.querySelector('#boxTanggal')?.closest('.dropdown-wrapper-custom');
        if (wrap && !wrap.contains(e.target)) {
            document.getElementById('calendarDropdown')?.classList.remove('show');
        }
    });
}

function toggleCalendar() {
    const dd = document.getElementById('calendarDropdown');
    dd.classList.toggle('show');
    if (dd.classList.contains('show')) renderCalendar();
}

function calNavMonth(dir) {
    calCurrentMonth += dir;
    if (calCurrentMonth > 11) { calCurrentMonth = 0; calCurrentYear++; }
    if (calCurrentMonth < 0) { calCurrentMonth = 11; calCurrentYear--; }
    renderCalendar();
}

function renderCalendar() {
    const grid = document.getElementById('calGrid');
    const label = document.getElementById('calMonthYear');
    
    const bulanNama = [
        'Januari','Februari','Maret','April','Mei','Juni',
        'Juli','Agustus','September','Oktober','November','Desember'
    ];
    
    label.textContent = bulanNama[calCurrentMonth] + ' ' + calCurrentYear;
    
    const firstDay = new Date(calCurrentYear, calCurrentMonth, 1).getDay();
    const daysInMonth = new Date(calCurrentYear, calCurrentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(calCurrentYear, calCurrentMonth, 0).getDate();
    
    const today = new Date();
    today.setHours(0,0,0,0);
    
    let html = '';
    
    // Hari dari bulan sebelumnya
    for (let i = firstDay - 1; i >= 0; i--) {
        const d = daysInPrevMonth - i;
        html += `<button type="button" class="cal-day other-month" onclick="calGoToPrevMonth(${d})">${d}</button>`;
    }
    
    // Hari bulan ini
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(calCurrentYear, calCurrentMonth, d);
        date.setHours(0,0,0,0);
        
        let cls = 'cal-day';
        if (date.getDay() === 0) cls += ' sunday';
        if (date.getTime() === today.getTime()) cls += ' today';
        if (calSelectedDate && date.getTime() === calSelectedDate.getTime()) cls += ' selected';
        
        html += `<button type="button" class="${cls}" onclick="calSelectDate(new Date(${calCurrentYear},${calCurrentMonth},${d}))">${d}</button>`;
    }
    
    // Hari bulan berikutnya (isi sisa grid)
    const totalCells = firstDay + daysInMonth;
    const remaining = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let d = 1; d <= remaining; d++) {
        html += `<button type="button" class="cal-day other-month" onclick="calGoToNextMonth(${d})">${d}</button>`;
    }
    
    grid.innerHTML = html;
}

function calSelectDate(date) {
    calSelectedDate = new Date(date);
    calSelectedDate.setHours(0,0,0,0);
    
    calCurrentMonth = date.getMonth();
    calCurrentYear = date.getFullYear();
    
    const hari = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const bulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    
    const tgl = date.getDate();
    const display = hari[date.getDay()] + ', ' + tgl + ' ' + bulan[date.getMonth()] + ' ' + date.getFullYear();
    
    document.getElementById('tanggalDisplay').value = display;
    
    // Format YYYY-MM-DD untuk hidden input
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    document.getElementById('tanggal').value = date.getFullYear() + '-' + mm + '-' + dd;
    
    renderCalendar();
    
    // Tutup dropdown
    setTimeout(() => {
        document.getElementById('calendarDropdown')?.classList.remove('show');
    }, 200);
}

function calSelectToday() {
    calSelectDate(new Date());
}

function calGoToPrevMonth(day) {
    calNavMonth(-1);
    calSelectDate(new Date(calCurrentYear, calCurrentMonth, day));
}

function calGoToNextMonth(day) {
    calNavMonth(1);
    calSelectDate(new Date(calCurrentYear, calCurrentMonth, day));
}

// Inisialisasi saat halaman load
document.addEventListener('DOMContentLoaded', initCalendar);