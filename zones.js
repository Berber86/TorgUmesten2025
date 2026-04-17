// ==============================================
// СИСТЕМА ЗОН ЭКСПЕРТИЗЫ
// ==============================================

// Конфигурация зон по умолчанию (в процентах от размеров изображения)
const DEFAULT_ZONES = [
    { id: 1, method: 'visual', x: 20, y: 20, radius: 4.17, label: 'Визуальный осмотр' },
    { id: 2, method: 'loupe', x: 40, y: 20, radius: 4.17, label: 'Лупа' },
    { id: 3, method: 'internet', x: 60, y: 20, radius: 4.17, label: 'Интернет-поиск' },
    { id: 4, method: 'testing', x: 20, y: 40, radius: 4.17, label: 'Тестирование' },
    { id: 5, method: 'uv', x: 40, y: 40, radius: 4.17, label: 'УФ-лампа' },
    { id: 6, method: 'expert', x: 60, y: 40, radius: 4.17, label: 'Эксперт' }
];

// Текущая конфигурация зон
let zonesConfig = [...DEFAULT_ZONES];
let selectedZoneId = null;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let zoneStart = { x: 0, y: 0 };

// Методы экспертизы для привязки
const EXPERTISE_METHODS = [
    { id: 'visual', name: 'Визуальный осмотр', icon: '👁️' },
    { id: 'loupe', name: 'Лупа', icon: '🔍' },
    { id: 'internet', name: 'Интернет-поиск', icon: '💻' },
    { id: 'testing', name: 'Тестирование', icon: '🧪' },
    { id: 'uv', name: 'УФ-лампа', icon: '💡' },
    { id: 'expert', name: 'Эксперт', icon: '👨‍🔬' }
];

// ==============================================
// ЗАГРУЗКА И СОХРАНЕНИЕ КОНФИГУРАЦИИ
// ==============================================

function loadZonesConfig() {
    const saved = localStorage.getItem('expertise_zones_config');
    if (saved) {
        try {
            zonesConfig = JSON.parse(saved);
            console.log('Конфигурация зон загружена:', zonesConfig);
        } catch (e) {
            console.error('Ошибка загрузки конфигурации зон:', e);
            zonesConfig = [...DEFAULT_ZONES];
        }
    }
}

function saveZonesConfig() {
    localStorage.setItem('expertise_zones_config', JSON.stringify(zonesConfig));
    console.log('Конфигурация зон сохранена');
}

// ==============================================
// ОТОБРАЖЕНИЕ ЗОН В ОКНЕ ЭКСПЕРТИЗЫ
// ==============================================

function renderExpertiseZones() {
    const overlay = document.getElementById('expertiseZonesOverlay');
    if (!overlay) return;
    
    overlay.innerHTML = '';
    
    zonesConfig.forEach(zone => {
        const zoneElement = createZoneElement(zone, false);
        overlay.appendChild(zoneElement);
    });
    
    // В режиме тестировщика делаем зоны интерактивными
    if (gameState.isTesterMode) {
        overlay.style.pointerEvents = 'auto';
        overlay.style.zIndex = '10';
    } else {
        overlay.style.pointerEvents = 'auto'; // Для кликов в игровом режиме
        overlay.style.zIndex = '5';
    }
}

function createZoneElement(zone, isPreview = false) {
    const zoneElement = document.createElement('div');
    zoneElement.className = 'absolute rounded-full cursor-pointer transition-all duration-200';
    zoneElement.dataset.zoneId = zone.id;
    
    // Позиционируем в процентах
    zoneElement.style.left = `${zone.x}%`;
    zoneElement.style.top = `${zone.y}%`;
    
    // Радиус в процентах от ширины изображения
    const radiusPercent = zone.radius;
    zoneElement.style.width = `${radiusPercent * 2}%`;
    zoneElement.style.height = `${radiusPercent * 2}%`;
    zoneElement.style.marginLeft = `-${radiusPercent}%`;
    zoneElement.style.marginTop = `-${radiusPercent}%`;
    
    // Стили в зависимости от режима
    if (gameState.isTesterMode || isPreview) {
        // Полупрозрачные цветные круги в режиме тестировщика
        const hue = (zone.id - 1) * 60; // Разные цвета для каждой зоны
        zoneElement.style.backgroundColor = `hsla(${hue}, 80%, 50%, 0.3)`;
        zoneElement.style.border = `2px solid hsla(${hue}, 80%, 50%, 0.8)`;
        zoneElement.style.boxShadow = '0 0 8px rgba(0,0,0,0.3)';
        
        // Номер зоны в центре
        const label = document.createElement('div');
        label.className = 'absolute inset-0 flex items-center justify-center text-white font-bold text-lg';
        label.textContent = zone.id;
        label.style.textShadow = '1px 1px 2px rgba(0,0,0,0.5)';
        zoneElement.appendChild(label);
        
        // Подпись метода при наведении
        zoneElement.title = `${zone.id}: ${zone.label}`;
    } else {
        // В игровом режиме - полностью прозрачные, но кликабельные
        zoneElement.style.backgroundColor = 'transparent';
        zoneElement.style.border = 'none';
    }
    
    // Обработчики событий
    if (gameState.isTesterMode) {
        // В режиме тестировщика - редактирование
        zoneElement.addEventListener('mousedown', startZoneDrag);
        zoneElement.addEventListener('touchstart', startZoneDrag, { passive: false });
        zoneElement.addEventListener('click', (e) => {
            e.stopPropagation();
            selectZone(zone.id);
        });
    } else {
        // В игровом режиме - клик для активации метода
        zoneElement.addEventListener('click', (e) => {
            e.stopPropagation();
            handleZoneClick(zone);
        });
    }
    
    return zoneElement;
}

// ==============================================
// ОБРАБОТКА КЛИКОВ ПО ЗОНАМ В ИГРОВОМ РЕЖИМЕ
// ==============================================

function handleZoneClick(zone) {
    if (!currentExpertise) return;
    
    console.log(`Клик по зоне ${zone.id}: ${zone.method}`);
    
    // Пытаемся использовать метод экспертизы
    if (typeof useExpertiseMethod === 'function') {
        useExpertiseMethod(zone.method);
    } else {
        console.warn('Функция useExpertiseMethod не найдена');
        showNotification(`Попытка использовать ${zone.label}`, 'info');
    }
}

// ==============================================
// РЕДАКТИРОВАНИЕ ЗОН В РЕЖИМЕ ТЕСТИРОВЩИКА
// ==============================================

function startZoneDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const zoneId = parseInt(e.currentTarget.dataset.zoneId);
    const zone = zonesConfig.find(z => z.id === zoneId);
    if (!zone) return;
    
    isDragging = true;
    selectedZoneId = zoneId;
    
    // Запоминаем начальные позиции
    if (e.type === 'mousedown') {
        dragStart.x = e.clientX;
        dragStart.y = e.clientY;
    } else if (e.type === 'touchstart') {
        dragStart.x = e.touches[0].clientX;
        dragStart.y = e.touches[0].clientY;
    }
    
    zoneStart.x = zone.x;
    zoneStart.y = zone.y;
    
    // Добавляем глобальные обработчики
    document.addEventListener('mousemove', onZoneDrag);
    document.addEventListener('touchmove', onZoneDrag, { passive: false });
    document.addEventListener('mouseup', stopZoneDrag);
    document.addEventListener('touchend', stopZoneDrag);
    
    // Визуальный feedback
    e.currentTarget.style.opacity = '0.7';
    e.currentTarget.style.transform = 'scale(1.1)';
    
    // Обновляем свойства выбранной зоны
    selectZone(zoneId);
}

function onZoneDrag(e) {
    if (!isDragging || selectedZoneId === null) return;
    
    e.preventDefault();
    
    const zone = zonesConfig.find(z => z.id === selectedZoneId);
    if (!zone) return;
    
    // Получаем текущие координаты
    let clientX, clientY;
    if (e.type === 'mousemove') {
        clientX = e.clientX;
        clientY = e.clientY;
    } else if (e.type === 'touchmove') {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    }
    
    // Вычисляем смещение в процентах
    const container = document.querySelector('.expertise-square-container');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const deltaX = ((clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((clientY - dragStart.y) / rect.height) * 100;
    
    // Обновляем позицию зоны
    zone.x = Math.max(0, Math.min(100, zoneStart.x + deltaX));
    zone.y = Math.max(0, Math.min(100, zoneStart.y + deltaY));
    
    // Перерисовываем зоны
    renderExpertiseZones();
    renderZonesPreview();
    
    // Обновляем панель свойств
    updateZoneProperties();
}

function stopZoneDrag() {
    if (!isDragging) return;
    
    isDragging = false;
    
    // Удаляем глобальные обработчики
    document.removeEventListener('mousemove', onZoneDrag);
    document.removeEventListener('touchmove', onZoneDrag);
    document.removeEventListener('mouseup', stopZoneDrag);
    document.removeEventListener('touchend', stopZoneDrag);
    
    // Восстанавливаем стиль зоны
    const zoneElement = document.querySelector(`[data-zone-id="${selectedZoneId}"]`);
    if (zoneElement) {
        zoneElement.style.opacity = '';
        zoneElement.style.transform = '';
    }
    
    // Сохраняем конфигурацию
    saveZonesConfig();
}

// ==============================================
// КОНФИГУРАТОР ЗОН НА ВКЛАДКЕ
// ==============================================

function initZonesConfigurator() {
    renderZonesPreview();
    renderZonePropertiesPanel();
    
    // Обработчик клика по фону для снятия выделения
    const previewOverlay = document.getElementById('zones-preview-overlay');
    if (previewOverlay) {
        previewOverlay.addEventListener('click', (e) => {
            if (e.target === previewOverlay) {
                selectZone(null);
            }
        });
    }
}

function renderZonesPreview() {
    const overlay = document.getElementById('zones-preview-overlay');
    if (!overlay) return;
    
    overlay.innerHTML = '';
    
    zonesConfig.forEach(zone => {
        const zoneElement = createZoneElement(zone, true);
        
        // Подсветка выбранной зоны
        if (zone.id === selectedZoneId) {
            zoneElement.style.boxShadow = '0 0 0 3px #FFFFFF, 0 0 0 6px #3B82F6';
            zoneElement.style.zIndex = '20';
        }
        
        overlay.appendChild(zoneElement);
    });
}

function selectZone(zoneId) {
    selectedZoneId = zoneId;
    
    // Перерисовываем превью для обновления выделения
    renderZonesPreview();
    
    // Обновляем панель свойств
    renderZonePropertiesPanel();
}

function renderZonePropertiesPanel() {
    const container = document.getElementById('zone-props');
    if (!container) return;
    
    if (selectedZoneId === null) {
        container.innerHTML = '<p class="text-gray-500">Выберите зону для редактирования</p>';
        return;
    }
    
    const zone = zonesConfig.find(z => z.id === selectedZoneId);
    if (!zone) {
        container.innerHTML = '<p class="text-red-500">Зона не найдена</p>';
        return;
    }
    
    const methodOptions = EXPERTISE_METHODS.map(method => 
        `<option value="${method.id}" ${zone.method === method.id ? 'selected' : ''}>
            ${method.icon} ${method.name}
        </option>`
    ).join('');
    
    container.innerHTML = `
        <h3 class="font-bold text-lg mb-3">Зона ${zone.id}</h3>
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Метод экспертизы</label>
                <select id="zone-method-select" 
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    ${methodOptions}
                </select>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Позиция X: <span id="zone-x-value">${zone.x.toFixed(1)}</span>%
                </label>
                <input type="range" id="zone-x-slider" min="0" max="100" step="0.1" value="${zone.x}"
                       class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Позиция Y: <span id="zone-y-value">${zone.y.toFixed(1)}</span>%
                </label>
                <input type="range" id="zone-y-slider" min="0" max="100" step="0.1" value="${zone.y}"
                       class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                    Радиус: <span id="zone-radius-value">${zone.radius.toFixed(2)}</span>%
                </label>
                <input type="range" id="zone-radius-slider" min="1" max="20" step="0.1" value="${zone.radius}"
                       class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
                <div class="text-xs text-gray-500 mt-1">
                    ${Math.round((zone.radius * 600) / 100)}px на изображении 600px
                </div>
            </div>
            
            <div class="pt-2">
                <button onclick="deleteZone(${zone.id})" 
                        class="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium">
                    🗑️ Удалить зону
                </button>
            </div>
        </div>
    `;
    
    // Назначаем обработчики событий
    document.getElementById('zone-method-select').addEventListener('change', (e) => {
        zone.method = e.target.value;
        const method = EXPERTISE_METHODS.find(m => m.id === zone.method);
        if (method) zone.label = method.name;
        saveZonesConfig();
        renderZonesPreview();
        renderExpertiseZones();
    });
    
    document.getElementById('zone-x-slider').addEventListener('input', (e) => {
        zone.x = parseFloat(e.target.value);
        document.getElementById('zone-x-value').textContent = zone.x.toFixed(1);
        renderZonesPreview();
        renderExpertiseZones();
    });
    
    document.getElementById('zone-y-slider').addEventListener('input', (e) => {
        zone.y = parseFloat(e.target.value);
        document.getElementById('zone-y-value').textContent = zone.y.toFixed(1);
        renderZonesPreview();
        renderExpertiseZones();
    });
    
    document.getElementById('zone-radius-slider').addEventListener('input', (e) => {
        zone.radius = parseFloat(e.target.value);
        document.getElementById('zone-radius-value').textContent = zone.radius.toFixed(2);
        const radiusPx = Math.round((zone.radius * 600) / 100);
        document.querySelector('.text-xs.text-gray-500').textContent = `${radiusPx}px на изображении 600px`;
        renderZonesPreview();
        renderExpertiseZones();
    });
}

function updateZoneProperties() {
    if (selectedZoneId === null) return;
    
    const zone = zonesConfig.find(z => z.id === selectedZoneId);
    if (!zone) return;
    
    const xValue = document.getElementById('zone-x-value');
    const yValue = document.getElementById('zone-y-value');
    const radiusValue = document.getElementById('zone-radius-value');
    const xSlider = document.getElementById('zone-x-slider');
    const ySlider = document.getElementById('zone-y-slider');
    const radiusSlider = document.getElementById('zone-radius-slider');
    
    if (xValue) xValue.textContent = zone.x.toFixed(1);
    if (yValue) yValue.textContent = zone.y.toFixed(1);
    if (radiusValue) radiusValue.textContent = zone.radius.toFixed(2);
    if (xSlider) xSlider.value = zone.x;
    if (ySlider) ySlider.value = zone.y;
    if (radiusSlider) radiusSlider.value = zone.radius;
}

function deleteZone(zoneId) {
    if (!confirm('Удалить эту зону?')) return;
    
    zonesConfig = zonesConfig.filter(z => z.id !== zoneId);
    selectedZoneId = null;
    
    saveZonesConfig();
    renderZonesPreview();
    renderExpertiseZones();
    renderZonePropertiesPanel();
}

// ==============================================
// ЭКСПОРТ И ИМПОРТ КОНФИГУРАЦИИ
// ==============================================

function exportZonesCode() {
    const code = `// Конфигурация зон экспертизы
// Сгенерировано: ${new Date().toLocaleString()}
const EXPERTISE_ZONES = ${JSON.stringify(zonesConfig, null, 2)};

// Для использования в constants.js скопируйте этот объект
// и присвойте его переменной ZONES_CONFIG`;
    
    const pre = document.getElementById('exported-code');
    if (pre) {
        pre.textContent = code;
        pre.style.display = 'block';
        
        // Автоматическое копирование в буфер обмена
        navigator.clipboard.writeText(code).then(() => {
            showNotification('Код скопирован в буфер обмена!', 'success');
        }).catch(err => {
            console.error('Ошибка копирования:', err);
            showNotification('Скопируйте код вручную', 'info');
        });
    }
}

function resetZones() {
    if (confirm('Сбросить все зоны к значениям по умолчанию?')) {
        zonesConfig = [...DEFAULT_ZONES];
        selectedZoneId = null;
        
        saveZonesConfig();
        renderExpertiseZones();
        renderZonesPreview();
        renderZonePropertiesPanel();
        
        showNotification('Зоны сброшены к значениям по умолчанию', 'success');
    }
}

// ==============================================
// ИНТЕГРАЦИЯ С ОСНОВНОЙ ИГРОЙ
// ==============================================

// Обновляем переключение режима тестировщика
const originalToggleGameMode = window.toggleGameMode;
window.toggleGameMode = function() {
    originalToggleGameMode();
    updateZonesVisibility();
};

function updateZonesVisibility() {
    // Показываем/скрываем вкладку "Зоны"
    const zonesTab = document.getElementById('tab-zones');
    if (zonesTab) {
        zonesTab.style.display = gameState.isTesterMode ? 'block' : 'none';
    }
    
    // Перерисовываем зоны с учетом нового режима
    renderExpertiseZones();
    
    // Если открыта вкладка зон, перерисовываем конфигуратор
    if (document.getElementById('content-zones') && 
        !document.getElementById('content-zones').classList.contains('hidden')) {
        initZonesConfigurator();
    }
}

// Обновляем открытие экспертизы
const originalStartExpertise = window.startExpertise;
window.startExpertise = function(itemId) {
    originalStartExpertise(itemId);
    
    // Даем время на отрисовку окна экспертизы
    setTimeout(() => {
        renderExpertiseZones();
    }, 50);
};

// Обновляем переключение вкладок
const originalSwitchTab = window.switchTab;
window.switchTab = function(tab) {
    originalSwitchTab(tab);
    
    if (tab === 'zones') {
        initZonesConfigurator();
    }
};

// ==============================================
// ИНИЦИАЛИЗАЦИЯ
// ==============================================

// Загружаем конфигурацию при запуске
loadZonesConfig();

// Инициализируем при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateZonesVisibility();
    
    // Если вкладка зон уже открыта, инициализируем конфигуратор
    if (document.getElementById('content-zones') && 
        !document.getElementById('content-zones').classList.contains('hidden')) {
        initZonesConfigurator();
    }
});

// Экспортируем функции для глобального использования
window.exportZonesCode = exportZonesCode;
window.resetZones = resetZones;
window.deleteZone = deleteZone;

// ==============================================
// ЭКСПОРТ КОНФИГУРАЦИИ ДЛЯ PNG-НАКЛЕЕК
// ==============================================

// Делаем конфигурацию зон доступной глобально
window.getZonesConfig = function() {
    return zonesConfig;
};

// Также экспортируем функцию для получения зоны по методу
window.getZoneByMethod = function(method) {
    return zonesConfig.find(z => z.method === method);
};