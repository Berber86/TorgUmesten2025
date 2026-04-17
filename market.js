// market.js - функции для работы с рынком


// ============================================
// КОНФИГУРАЦИЯ РЫНКА
// ============================================

const MARKET_SLOT_POSITIONS = [
    { left: 600, top: 1200 },
    { left: 2000, top: 1350 },
    { left: 3400, top: 1350 },
    { left: 4800, top: 1350 },
    { left: 1700, top: 1300 },
    { left: 3800, top: 1350 },
    { left: 5800, top: 1300 }
];

const MARKET_WALK_POSITIONS = [
    { id: 'slot1', left: 280, top: 1040 },
    { id: 'slot2', left: 525, top: 230 },
    { id: 'slot3', left: 925, top: 150 },
    { id: 'slot4', left: 1300, top: 280 },
    { id: 'slot5', left: 1600, top: 200 },
    { id: 'slot6', left: 2000, top: 320 },
    { id: 'slot7', left: 2400, top: 180 }
];

// Константы для панорамного рынка
const FIRST_BG_WIDTH = 7418;
const FIRST_BG_HEIGHT = 1617;
const SECOND_BG_WIDTH = 6864;
const SECOND_BG_HEIGHT = 1617;
const BG_OVERLAP = 985;

// ============================================
// КОНФИГУРАЦИЯ ПРОДАВЦОВ
// ============================================

// Базовая высота продавца = 25% от высоты фона
const BASE_SELLER_HEIGHT_RATIO = 0.45;

// Индивидуальные настройки каждого продавца
const SELLER_CONFIGS = {
        "alcoholic": {
            image: "alcoholic2.png", // Картинка останется как заглушка (poster)
            
            heightMultiplier: 1.0,
            widthRatio: 1.0,
            offsetY: 0,
        },
        // ... остальные продавцы без изменений
    "grandma": {
        image: "sentim_ba.png",
        heightMultiplier: 0.8,
        widthRatio: 0.8,
        offsetY: -5,
    },
    "reseller": {
        image: "resseler.png",
        heightMultiplier: 1.1,
        widthRatio: 1.1,
        offsetY: -10,
    },
    "housewife": {
        image: "wife.png",
        heightMultiplier: 1.1,
        widthRatio: 1.1,
        offsetY: 0,
    },
    "antiquarianm": {
        image: "antiqm.png",
        heightMultiplier: 1.1,
        widthRatio: 1.1,
        offsetY: 5,
    },
    
    "antiquarianw": {
     image: "antiqw.png",
     video: "antiqw_idle.webm", 
     heightMultiplier: 1,
     widthRatio: 1,
     offsetY: 0,
 },
    "black_digger1": {
        image: "bc3.png",
    heightMultiplier: 1.2,
    widthRatio: 1,
    offsetY: -10,
    },
    "black_digger2": {
        image: "bc3.png",
        heightMultiplier: 1.1,
        widthRatio: 1,
        offsetY: -10,
    },
    "student": {
        image: "student.png",
        heightMultiplier: 1.2,
        widthRatio: 0.9,
        offsetY: 0,
    },
    "collectorm": {
        image: "collectorm.png",
        heightMultiplier: 1.0,
        widthRatio: 0.5,
        offsetY: 0,
    },
    
      "collectorw": {
      image: "collectorw.jpg",
      heightMultiplier: 1.0,
      widthRatio: 1,
      offsetY: -5,
  },
  
     "alcoholic2": {
     image: "alcoz.png",
     heightMultiplier: 1.0,
     widthRatio: 1.0,
     offsetY: 0,
 },
     "touristw": {
        image: "tourist.png",
        video: "touristw_idle.webm",
        heightMultiplier: 0.85,
        widthRatio: 0.82,
        offsetY: 0,
    }, 
    "touristm": {
        image: "tourist.png",
        heightMultiplier: 0.90,
        widthRatio: 0.50,
        offsetY: 0,
    }
};

// Дефолтные значения
const DEFAULT_SELLER_CONFIG = {
    image: null,
    heightMultiplier: 1.0,
    widthRatio: 0.5,
    offsetY: 0
};

// Получить конфиг продавца (с дефолтами)
function getSellerConfig(sellerType) {
    const config = SELLER_CONFIGS[sellerType];
    if (!config) return DEFAULT_SELLER_CONFIG;
    
    return {
        ...DEFAULT_SELLER_CONFIG,
        ...config
    };
}

// ============================================
// БАЗОВЫЕ РАЗМЕРЫ ЭЛЕМЕНТОВ
// ============================================

const BASE_SIZES = {
    ITEM_ICON: 80,
    ITEM_PADDING: 20,
    ITEM_BORDER_RADIUS: 15,
    SELLER_BORDER: 0,
    SELLER_NAME_FONT: 12,
    SELLER_BOTTOM_OFFSET: 20,
    TOOLTIP_FONT: 10,
    EMPTY_SLOT_ICON: 80
};

// Текущий масштаб (обновляется при ресайзе)
let currentMarketScale = 1;

// ============================================
// СТОИМОСТЬ ВНИМАНИЯ
// ============================================

const ATTENTION_COSTS = {
    ENTER_HAGGLE: 5,
    BUY_ITEM: 10
};

function toggleMarketView() {
    const traditionalMarket = document.getElementById('traditional-market');
    const walkingMarket = document.getElementById('walking-market');
    const toggleButton = document.getElementById('marketViewToggle');
    const marketInfoDiv = document.querySelector('.market-info');
    
    if (marketInfoDiv) {
        marketInfoDiv.remove();
    }
    
    if (currentMarketView === 'traditional') {
        traditionalMarket.classList.add('hidden');
        walkingMarket.classList.remove('hidden');
        toggleButton.innerHTML = '🏪 Список товаров';
        currentMarketView = 'walking';
        
        initWalkingMarket();
    } else {
        walkingMarket.classList.add('hidden');
        traditionalMarket.classList.remove('hidden');
        toggleButton.innerHTML = '🚶 Прогуляться';
        currentMarketView = 'traditional';
        
        renderMarket();
    }
}

function handleWalkingMarketClick(itemId) {
    const item = gameState.marketItems.find(i => i.id === itemId);
    
    if (!item) {
        showNotification('Поздно! Товар уже забрал другой клиент', 'error');
        return;
    }
    
    const skill = gameState.skills[item.category] || 0;
    const displayName = getDisplayName(item, skill);
    const itemIcon = DETAILED_ICONS[item.baseName] || CATEGORY_ICONS[item.category] || '❓';
    
    const previewModalHTML = `
        <div id="walking-preview-modal" class="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-2xl p-2 mx-4 max-w-sm w-full">
                <div class="text-center">
                    <div class="text-6xl mb-4">${itemIcon}</div>
                    <h2 class="text-xl font-bold mb-2">${displayName}</h2>
                    <div class="text-lg text-gray-600 mb-4">💰 Цена: ${formatMoney(item.askingPrice)}р</div>
                    
                    <div class="mb-4">
                        ${skill >= 1 && item.defects.length > 0 ? 
                            `<div class="text-xs text-orange-600 mb-1">⚠️ Видны дефекты</div>` : ''}
                        ${skill >= 2 && item.marks.length > 0 ? 
                            `<div class="text-xs text-blue-600 mb-1">🏷️ Видны клейма</div>` : ''}
                    </div>
                    
                    <div class="flex gap-3">
                        <button onclick="closeWalkingPreview()" 
                                class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold">
                            Закрыть
                        </button>
                        <button onclick="startHaggleFromWalkingPreview('${itemId}')" 
                                class="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                            💬 Торговаться
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = previewModalHTML;
    document.body.appendChild(modalContainer);
    
    const itemElement = document.getElementById(`walking-item-${itemId}`);
    if (itemElement) {
        itemElement.style.backgroundColor = 'rgba(255, 215, 0, 0.3)';
        itemElement.style.boxShadow = '0 0 40px rgba(255, 215, 0, 0.8)';
        
        setTimeout(() => {
            itemElement.style.backgroundColor = '';
            itemElement.style.boxShadow = '';
        }, 2000);
    }
}

function generateMarket() {
    gameState.marketItems = [];
    const categories = Object.keys(itemTemplates);
    
    // 1. Создаем пул доступных продавцов (копию ключей из sellerTypes)
    let availableSellers = [...Object.keys(sellerTypes)];
    
    // Цикл начинается с 6 товаров в первый день
    const itemsCount = ((gameState.day + 4) % 7) + 1;
    
    for (let i = 0; i < itemsCount; i++) {
        // Если вдруг продавцы закончились (защита от ошибок, если слотов станет больше чем типов)
        if (availableSellers.length === 0) {
            console.warn("Закончились уникальные продавцы, обновляем список!");
            availableSellers = [...Object.keys(sellerTypes)];
        }
        
        // 2. Выбираем случайную категорию (продавец может продавать что угодно)
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        // 3. Выбираем случайный индекс из оставшихся продавцов
        const randomIndex = Math.floor(Math.random() * availableSellers.length);
        
        // Получаем ключ продавца
        const sellerTypeKey = availableSellers[randomIndex];
        
        // ВАЖНО: Удаляем этого продавца из пула на сегодня, чтобы он не выпал снова
        availableSellers.splice(randomIndex, 1);
        
        // Создаем товар с этим уникальным продавцом
        gameState.marketItems.push(generateMarketItem(category, sellerTypeKey));
    }
    
    if (currentMarketView === 'walking') {
        initWalkingMarket();
    }
    
    gameState.firstDealToday = true;
    renderMarket();
}
           function renderMarket() {
    // Если активен новый вид рынка, не обновляем традиционный
    if (currentMarketView === 'walking') {
        return;
    }
    const container = document.getElementById('marketItems');
    document.getElementById('marketDay').textContent = gameState.day;

    if (gameState.marketItems.length === 0) {
        container.innerHTML = '<div class="col-span-4 text-center text-gray-500 py-12">Все товары разобрали! Переходите к следующему дню.</div>';
        return;
    }

    container.innerHTML = gameState.marketItems.map(item => {
        const displayName = getDisplayName(item, 0);
        const itemIcon = DETAILED_ICONS[item.baseName] || CATEGORY_ICONS[item.category];
        
        let visibleInfo = '';
        if (gameState.skills[item.category] >= 1 && item.defects.length > 0) {
            visibleInfo += `<div class="text-xs text-orange-600">⚠️ Видны дефекты</div>`;
        }
        if (gameState.skills[item.category] >= 2 && item.marks.length > 0) {
            visibleInfo += `<div class="text-xs text-blue-600">🏷️ Видны клейма</div>`;
        }

        return `
            <div class="card rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl" onclick="startHaggle('${item.id}')">
                <div class="text-5xl mb-2 text-center">${itemIcon}</div>
                <h3 class="font-bold mb-2 text-center text-sm">${displayName}</h3>
                <div class="text-xs text-gray-600 text-center mb-2 flex items-center justify-center gap-1">
                    <span>${item.sellerIcon}</span>
                    <span>${item.sellerName}</span>
                </div>
                ${visibleInfo}
                <div class="text-2xl font-bold text-center text-green-600 mt-2">${formatMoney(item.askingPrice)}</div>
                <button class="w-full mt-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition">
                    💬 Торговаться
                </button>
            </div>
        `;
    }).join('');
}

// ============================================
// ОБРАБОТКА ИЗМЕНЕНИЯ РАЗМЕРА ОКНА
// ============================================

let marketResizeTimeout;

function updateMarketScale() {
    // Если мы не в режиме прогулки, ничего не делаем
    if (typeof currentMarketView === 'undefined' || currentMarketView !== 'walking') {
        return;
    }
    
    const container = document.getElementById('new-market-view');
    if (!container) return;
    
    // Используем задержку (debounce), чтобы не перегружать браузер
    clearTimeout(marketResizeTimeout);
    
    marketResizeTimeout = setTimeout(() => {
        // Перерисовываем рынок под новые размеры
        initWalkingMarket();
    }, 100);
}

          function generateMarketItem(category, sellerTypeKey) {
            const templates = itemTemplates[category];
            const template = templates[Math.floor(Math.random() * templates.length)];
            const sellerType = sellerTypes[sellerTypeKey];
            const rarityBonus = sellerType.rarityBonus || 0;
            
            let rarity = template.rarity;
            const rarities = ['common', 'uncommon', 'rare', 'very_rare'];
            const currentIndex = rarities.indexOf(rarity);
            
            if (rarityBonus > 0 && Math.random() < Math.abs(rarityBonus)) {
                rarity = rarities[Math.min(3, currentIndex + 1)] || rarity;
            } else if (rarityBonus < 0 && Math.random() < Math.abs(rarityBonus)) {
                rarity = rarities[Math.max(0, currentIndex - 1)] || rarity;
            }
            
            const basePrice = template.basePrice || template.base || 1000;
            
            // ОПРЕДЕЛЯЕМ РОД БАЗОВОГО НАЗВАНИЯ
            const baseGender = determineGender(template.name);
            
            const age = generateAge();
            const authentic = Math.random() > 0.3;
            
            // 🔥 ДОБАВЛЕНО: Определяем реставрацию
            const restoration = determineRestoration(age);
            
            const dominantStyle = assignDominantStyle({ age, category, authentic });
            
            const marks = [];
            const marksChance = authentic ? 0.7 : 0.5;
            if (Math.random() < marksChance) {
                const generatedMarks = getMarksForAgeAndCategory(age, category, authentic);
                marks.push(...generatedMarks);
            }
            
            const modifiers = generateModifiers(category, rarity, 0);
            const modifiersDisplay = applyProfaneFilters(modifiers, 0, rarity);
            
            // ПРИВОДИМ ВСЕ МОДИФИКАТОРЫ К РОДУ БАЗОВОГО НАЗВАНИЯ
            const genderedModifiers = modifiers.map(mod =>
                adaptModifierToGender(mod, baseGender)
            );
            const genderedModifiersDisplay = modifiersDisplay.map(mod =>
                adaptModifierToGender(mod, baseGender)
            );
            
            // Создаем копии чистых модификаторов (только из констант) для восстановления позже
            const cleanModifiers = [...genderedModifiers];
            const cleanModifiersDisplay = [...genderedModifiersDisplay];
            
            const numDefects = Math.floor(Math.random() * 3);
            const defects = [];
            let totalSeverity = 0;
            
            const difficultyWeights = {
                "easy": 0.4,
                "medium": 0.35,
                "hard": 0.2,
                "critical": 0.05
            };
            
            for (let i = 0; i < numDefects; i++) {
                let randomValue = Math.random();
                let selectedDifficulty = "easy";
                
                if (randomValue < difficultyWeights.critical) selectedDifficulty = "critical";
                else if (randomValue < difficultyWeights.critical + difficultyWeights.hard) selectedDifficulty = "hard";
                else if (randomValue < difficultyWeights.critical + difficultyWeights.hard + difficultyWeights.medium) selectedDifficulty = "medium";
                
                const availableDefects = defectsList.filter(d => d.difficulty === selectedDifficulty);
                if (availableDefects.length > 0) {
                    const defect = getRandomDefect(availableDefects);
                    defects.push(defect.name);
                    
                    const cappedSeverity = Math.min(0.3, defect.actualSeverity || 0.1);
                    totalSeverity += cappedSeverity;
                }
            }
            
            totalSeverity = Math.min(0.8, totalSeverity);
            
            // 🔥 ИСПРАВЛЕННЫЙ РАСЧЕТ СТОИМОСТИ:
            
            // 1. Сначала считаем ИДЕАЛЬНУЮ стоимость (без дефектов и реставрации)
            let idealValue = basePrice;
            if (!authentic) {
                idealValue = Math.max(50, Math.round(idealValue * (0.06 + Math.random() * 0.04)));
            }
            
            // 2. Затем применяем дефекты к идеальной стоимости
            const severityMultiplier = Math.max(0.2, 1 - totalSeverity);
            let realValue = Math.round(idealValue * severityMultiplier);
            realValue = Math.max(50, realValue);
            
            const portrait = sellerType.portraits[Math.floor(Math.random() * sellerType.portraits.length)];
            
            const sellerKnowledge = 0.3 + Math.random() * 1.2;
            
            let sellerBelievesAuthentic = authentic;
            if (authentic && Math.random() < 0.1) {
                sellerBelievesAuthentic = false;
            }
            
            // 🔥 ИСПРАВЛЕННЫЙ РАСЧЕТ ЦЕНЫ ПРОДАВЦА:
            let askingPrice;
            
            if (sellerBelievesAuthentic) {
                // Продавец считает предмет подлинным - цена от ИДЕАЛЬНОЙ стоимости
                askingPrice = idealValue * sellerKnowledge;
            } else {
                // Продавец считает предмет подделкой - сбрасывает цену
                const dumpingRange = sellerType.fakeDumpingMultiplier || 3;
                const dumpingFactor = 1 / (dumpingRange + (Math.random() - 0.5));
                askingPrice = idealValue * dumpingFactor * sellerKnowledge;
            }
            
            // Применяем портрет продавца (его "жадность")
            askingPrice *= (portrait.priceRange[0] + Math.random() * (portrait.priceRange[1] - portrait.priceRange[0]));
            askingPrice = Math.round(askingPrice);
            
            // Минимальная цена и защита от дурака
            if (askingPrice < 100) {
                askingPrice = 100;
            }
            
            // Если продавец НЕ знает о подлинности, но предмет настоящий - 
            // он может случайно поставить низкую цену на ценный предмет!
            if (askingPrice < realValue && !sellerBelievesAuthentic && authentic) {
                // Оставляем как есть - это РЕАЛЬНАЯ ситуация!
                // Продавец не знает истинной ценности
            }
            
            const result = {
                id: `market_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
                baseName: template.name,
                category,
                rarity,
                age: age,
                restoration: restoration, // 🔥 ДОБАВЛЕНО: информация о реставрации
                dominantStyle: dominantStyle,
                marks: marks,
                gender: baseGender,
                // Используем копии, чтобы applyRestorationEffects не загрязнил оригинал (если он мутирует массив)
                modifiers: [...genderedModifiers],
                modifiersDisplay: [...genderedModifiersDisplay],
                basePrice,
                idealValue, // 🔥 ДОБАВЛЕНО: стоимость без дефектов
                askingPrice,
                realValue,
                authentic,
                defects,
                sellerType: sellerTypeKey,
                sellerPortrait: portrait,
                sellerIcon: sellerType.icon,
                sellerName: portrait.subtype,
                sellerQuotes: portrait.quotes,
                sellerKnowledge,
                sellerBelievesAuthentic,
                isCheapItem: realValue < 100,
                expertiseShards: [],
                isSample: false,
                expertiseMethodCosts: { ...BASE_EXPERTISE_COSTS }
            };
            
            // 🔥 ДОБАВЛЕНО: Применяем эффекты реставрации к стоимости
            applyRestorationEffects(result);
            
            // 🔥 ИСПРАВЛЕНИЕ: Сбрасываем модификаторы обратно к чистым (константным), 
            // чтобы убрать добавленные слова "Отреставрированный" и прочие суффиксы из названия
            result.modifiers = cleanModifiers;
            result.modifiersDisplay = cleanModifiersDisplay;
            
            if (result.realValue <= 0) {
                console.error("Обнаружен предмет с нулевой или отрицательной стоимостью:", result);
                result.realValue = 50;
            }
            
            return result;
        }

        // ==============================================
        // СИСТЕМА ТОРГА
        // ==============================================
 function startHaggle(itemId) {
    // ПРОВЕРКА ВНИМАНИЯ ПЕРЕД ВХОДОМ В ТОРГ
    if (gameState.attention < ATTENTION_COSTS.ENTER_HAGGLE) {
        showNotification("на сегодня хватит. вы устали", 'error');
        return;
    }
    
    const item = gameState.marketItems.find(i => i.id === itemId);
    if (!item) return;
    
    // ТРАТА ВНИМАНИЯ ЗА ВХОД В ТОРГ
    gameState.attention -= ATTENTION_COSTS.ENTER_HAGGLE;
    
    updateDisplay(); // Глобальное обновление (если есть)
    updateWalkingCounters(); // <--- ДОБАВЛЕНО: ОБНОВЛЕНИЕ HUD НА ПРОГУЛКЕ
    
    // ... остальной код функции без изменений ...
            
            // Закрываем один случайный товар на рынке при начале торга
            if (gameState.marketItems.length > 1) {
                const otherItems = gameState.marketItems.filter(i => i.id !== itemId);
                if (otherItems.length > 0) {
                    const randomItem = otherItems[Math.floor(Math.random() * otherItems.length)];
                    gameState.marketItems = gameState.marketItems.filter(i => i.id !== randomItem.id);
                    //showNotification(`🏪 Другой покупатель забрал ${getDisplayName(randomItem, 0)}`, 'info');
                }
            }
            
            const skill = gameState.skills[item.category] || 0;
            
            // ВЫБИРАЕМ ПРАВИЛЬНУЮ ПРИВЕТСТВЕННУЮ ФРАЗУ В ЗАВИСИМОСТИ ОТ ЦЕНЫ
            let initialQuote;
            if (item.askingPrice <= 100 && item.sellerPortrait.cheapGreeting) {
                initialQuote = item.sellerPortrait.cheapGreeting;
            } else {
                initialQuote = item.sellerQuotes.greeting;
            }
            
            currentHaggle = {
                item,
                currentPrice: item.askingPrice,
                patience: item.sellerPortrait.patience,
                maxPatience: item.sellerPortrait.patience,
                usedTactics: [],
                competitors: gameState.firstDealToday ? [] : generateCompetitors(),
                currentQuote: initialQuote
            };
            
            document.getElementById('haggleModal').classList.remove('hidden');
            renderHaggleModal();
        }
        
        // Запуск торга из режима прогулки
function startHaggleFromWalkingPreview(itemId) {
    closeWalkingPreview(); // Закрываем окно предпросмотра
    startHaggle(itemId); // Запускаем обычный торг
}

function renderHaggleModal() {
    const h = currentHaggle;
    const skill = gameState.skills[h.item.category] || 0;
    const displayName = getDisplayName(h.item, skill);
    
    // ОБНОВЛЯЕМ ИКОНКУ ПРЕДМЕТА
    const itemIcon = DETAILED_ICONS[h.item.baseName] || CATEGORY_ICONS[h.item.category];
    document.getElementById('haggleItemIcon').textContent = itemIcon;
    
    document.getElementById('haggleItemName').textContent = displayName;
    document.getElementById('sellerIcon').textContent = h.item.sellerIcon;
    document.getElementById('sellerType').textContent = h.item.sellerName;
    document.getElementById('askingPrice').textContent = formatMoney(h.item.askingPrice);
    document.getElementById('currentPrice').textContent = formatMoney(h.currentPrice);
    document.getElementById('acceptPrice').textContent = formatMoney(h.currentPrice);
    
    const hearts = '❤️'.repeat(h.patience) + '🤍'.repeat(h.maxPatience - h.patience);
    document.getElementById('sellerPatienceHearts').textContent = hearts;
    
    // РЕПЛИКА ПРОДАВЦА
    const currentQuote = h.currentQuote || h.item.sellerQuotes.greeting;
    document.getElementById('sellerQuote').textContent = currentQuote;
    
    // КОНКУРЕНТЫ - КОМПАКТНОЕ ОТОБРАЖЕНИЕ
    const competitorsHTML = h.competitors.length > 0 ?
        h.competitors.slice(0, 2).map(comp =>
            `<div class="truncate">👤 ${comp.name}</div>`
        ).join('') :
        '<div class="text-gray-500">Нет</div>';
    document.getElementById('competitors').innerHTML = competitorsHTML;
    
    // ⭐ НОВАЯ ЛОГИКА: СОБИРАЕМ ДОСТУПНЫЕ ТАКТИКИ
    const availableTactics = [];
    
    // Проверяем каждую тактику на доступность
    tactics.forEach(tactic => {
        let isAvailable = false;
        
        // Тактика "экспертная беседа" - только по навыку
        if (tactic.id === "expert_talk") {
            // 🔥 ИЗМЕНЕНО: Теперь требуется 7 уровень навыка вместо 3
            isAvailable = (skill >= 7);
        }
        // Остальные тактики - по прогрессии покупок
        else if (TACTIC_UNLOCK_ORDER.includes(tactic.id)) {
            isAvailable = gameState.unlockedTactics.includes(tactic.id);
        }
        // Остальные тактики (если есть) считаем недоступными
        else {
            isAvailable = false;
        }
        
        if (isAvailable) {
            availableTactics.push(tactic);
        }
    });
    
    // Если это самый первый торг и нет открытых тактик, показываем только кнопки Купить/Уйти
    if (gameState.successfulPurchases === 0 && availableTactics.length === 0) {
        // Специальный рендеринг для первого торга
        renderFirstHaggle();
        return;
    }
    
    // ТАКТИКИ - АДАПТИРУЕМ ДЛЯ МОБИЛЬНЫХ
    const tacticsHTML = availableTactics.map(t => {
        // Кнопка блокируется, если навык ниже требуемого (для экспертной тактики это условие дублирует доступность, 
        // но для остальных тактик reqSkill может использоваться как дополнительное условие эффективности)
        // или если тактика уже использована
        const disabled = t.reqSkill > skill || h.usedTactics.includes(t.id);
        const btnClass = disabled ?
            'bg-gray-300 text-gray-500 cursor-not-allowed' :
            'bg-blue-500 hover:bg-blue-600 text-white';
        return `
            <button onclick="useTactic('${t.id}')" ${disabled ? 'disabled' : ''} 
                class="tactic-btn ${btnClass} py-2 px-1 rounded text-xs font-semibold transition truncate">
                ${t.icon} ${t.name}
            </button>
        `;
    }).join('');
    document.getElementById('tacticButtons').innerHTML = tacticsHTML;
    
    // Добавляем индикатор прогресса
    renderHaggleProgress();
}

function renderFirstHaggle() {
    // Рендерим интерфейс без тактик, только Купить/Уйти
    document.getElementById('tacticButtons').innerHTML = `
        <div class="col-span-2 text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div class="text-lg mb-2">👀</div>
            <div class="text-sm font-semibold text-yellow-700 mb-2">
                Пока вы только наблюдаете за другими покупателями...
            </div>
            <div class="text-xs text-yellow-600">
                Сделайте первую покупку, чтобы начать учиться торговаться!
            </div>
        </div>
    `;
}

function calculateMarketHeight() {
    // Получаем высоту окна
    const windowHeight = window.innerHeight;
    
    // Вычитаем высоту других элементов (панель навигации, кнопки и т.д.)
    const otherElementsHeight = 120; // примерное значение
    
    return windowHeight - otherElementsHeight;
}

function renderHaggleProgress() {
    const progress = gameState.successfulPurchases;
    const nextThreshold = TACTIC_UNLOCK_THRESHOLDS[gameState.nextTacticIndex] || "∞";
    const unlockedCount = gameState.unlockedTactics.length;
    const totalTactics = TACTIC_UNLOCK_THRESHOLDS.length;
    
    let progressHTML = '';
    
    if (gameState.nextTacticIndex < TACTIC_UNLOCK_THRESHOLDS.length) {
        progressHTML = `
            <div class="col-span-2 text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                <div class="text-xs text-blue-700 mb-1">
                    Освоено тактик: ${unlockedCount}/${totalTactics}
                </div>
                <div class="text-xs text-blue-600">
                    Следующая тактика через: ${nextThreshold - progress} покупок
                </div>
            </div>
        `;
    } else {
        progressHTML = `
            <div class="col-span-2 text-center p-2 bg-green-50 rounded-lg border border-green-200">
                <div class="text-xs text-green-700 mb-1">
                    🏆 Все тактики освоены!
                </div>
                <div class="text-xs text-green-600">
                    Вы настоящий мастер торга
                </div>
            </div>
        `;
    }
    
    // Вставляем прогресс после кнопок тактик
    document.getElementById('tacticButtons').insertAdjacentHTML('beforeend', progressHTML);
}


// ==============================================
// ОБНОВЛЕННЫЙ РЕНДЕРИНГ ОКНА ТОРГА
// ==============================================



    function useTactic(tacticId) {
    const h = currentHaggle;
    const portrait = h.item.sellerPortrait;
    h.usedTactics.push(tacticId);
    
    // Обработка критической неудачи
    if (portrait.critical === tacticId) {
        const realMoney = gameState.money;
        gameState.money = 1; // Временный 1 рубль
        
        const criticalQuoteKey = `failure_${tacticId}_critical`;
        if (h.item.sellerQuotes[criticalQuoteKey]) {
            h.currentQuote = h.item.sellerQuotes[criticalQuoteKey];
            showNotification(`💥 Сделка сорвана! Продавец разозлился!`, 'error');
        } else {
            h.currentQuote = h.item.sellerQuotes[`failure_${tacticId}`];
            showNotification(`💥 Сделка сорвана! Продавец разозлился!`, 'error');
        }
        
        gameState.marketItems = gameState.marketItems.filter(i => i.id !== h.item.id);
        
        renderHaggleModal();
        
        setTimeout(() => {
            gameState.money = realMoney;
            closeHaggle();
            renderMarket();
        }, 2000);
        return; // Выходим из функции для критической ситуации
    }
    
    // ⭐ ОСОБАЯ ОБРАБОТКА ДЛЯ "УКАЗАТЬ НА «ДЕФЕКТЫ»"
    if (tacticId === "point_defects") {
        // Генерируем случайные "дефекты" в кавычках
        const fakeDefects = [
            "немного кривоватая линия",
            "цвет немного не тот",
            "пахнет старым подвалом",
            "кажется, было отреставрировано",
            "не совсем совпадает с описанием",
            "что-то тут не так...",
            "похоже на неоригинальную деталь",
            "немного потерто, не находите?",
            "вроде бы все хорошо, но что-то смущает",
            "мне кажется, это не совсем то"
        ];
        
        // Выбираем 1-3 случайных "дефекта"
        const numDefects = 1 + Math.floor(Math.random() * 3);
        const selectedDefects = [];
        for (let i = 0; i < numDefects; i++) {
            const randomIndex = Math.floor(Math.random() * fakeDefects.length);
            selectedDefects.push(`"${fakeDefects[randomIndex]}"`);
        }
        
        const defectsText = selectedDefects.join(', ');
        h.currentQuote = `Вы указываете на дефекты: ${defectsText}.`;
        
        // Дальше обычная логика успеха/неудачи
        const isVulnerable = portrait.weakness.includes(tacticId);
        const successChance = isVulnerable ? 0.9 : 0.7;
        const success = Math.random() < successChance;
        
        if (success) {
            const discountPercent = isVulnerable ? (0.10 + Math.random() * 0.15) : (0.03 + Math.random() * 0.07);
            const discount = Math.round(h.currentPrice * discountPercent);
            
            const newPrice = Math.max(
                100,
                Math.round(h.item.askingPrice * portrait.minPrice),
                h.currentPrice - discount
            );
            
            const actualDiscount = h.currentPrice - newPrice;
            
            if (actualDiscount > 0) {
                showNotification(`✅ Успех! Скидка ${formatMoney(actualDiscount)}`, 'success');
            } else {
                showNotification(`💰 Достигнута минимальная цена`, 'info');
            }
            
            h.currentPrice = newPrice;
            
            const quoteKey = `success_${tacticId}`;
            if (h.item.sellerQuotes[quoteKey]) {
                h.currentQuote = h.item.sellerQuotes[quoteKey];
            }
        } else {
            h.patience--;
            showNotification(`❌ Не сработало! Терпение продавца: ${h.patience}/${h.maxPatience}`, 'warning');
            
            if (h.patience <= 0) {
                const realMoney = gameState.money;
                gameState.money = 1;
                
                h.currentQuote = "Хватит! Я больше не хочу с вами разговаривать!";
                showNotification(`😠 Продавец потерял терпение и ушел!`, 'error');
                gameState.marketItems = gameState.marketItems.filter(i => i.id !== h.item.id);
                
                renderHaggleModal();
                
                setTimeout(() => {
                    gameState.money = realMoney;
                    closeHaggle();
                    renderMarket();
                }, 2000);
                return;
            }
        }
        
        renderHaggleModal();
        return;
    }
    
    // ОБЫЧНЫЕ ТАКТИКИ - продолжаем выполнение
    const isVulnerable = portrait.weakness.includes(tacticId);
    const successChance = isVulnerable ? 0.9 : 0.7;
    const success = Math.random() < successChance;
    
    if (success) {
        const discountPercent = isVulnerable ? (0.10 + Math.random() * 0.15) : (0.03 + Math.random() * 0.07);
        const discount = Math.round(h.currentPrice * discountPercent);
        
        const newPrice = Math.max(
            100,
            Math.round(h.item.askingPrice * portrait.minPrice),
            h.currentPrice - discount
        );
        
        const actualDiscount = h.currentPrice - newPrice;
        
        if (actualDiscount > 0) {
            showNotification(`✅ Успех! Скидка ${formatMoney(actualDiscount)}`, 'success');
        } else {
            showNotification(`💰 Достигнута минимальная цена`, 'info');
        }
        
        h.currentPrice = newPrice;
        
        const quoteKey = `success_${tacticId}`;
        if (h.item.sellerQuotes[quoteKey]) {
            h.currentQuote = h.item.sellerQuotes[quoteKey];
        }
        
        // Проверка перехвата конкурентом
        const interceptor = checkCompetitorInterception(h);
        if (interceptor) {
            const discountPercent = ((h.item.askingPrice - h.currentPrice) / h.item.askingPrice) * 100;
            h.currentQuote = `Извините, но ${interceptor.name} только что предложил лучшую цену!`;
            showNotification(`😤 ${interceptor.name} перехватил товар! Скидка была ${discountPercent.toFixed(0)}%`, 'error');
            gameState.marketItems = gameState.marketItems.filter(i => i.id !== h.item.id);
            
            renderHaggleModal();
            setTimeout(() => {
                closeHaggle();
                renderMarket();
            }, 2000);
            return;
        }
    } else {
        h.patience--;
        showNotification(`❌ Не сработало! Терпение продавца: ${h.patience}/${h.maxPatience}`, 'warning');
        
        // Проверка на потерю терпения (только после неудачи)
        if (h.patience <= 0) {
            const realMoney = gameState.money;
            gameState.money = 1;
            
            h.currentQuote = "Хватит! Я больше не хочу с вами разговаривать!";
            showNotification(`😠 Продавец потерял терпение и ушел!`, 'error');
            gameState.marketItems = gameState.marketItems.filter(i => i.id !== h.item.id);
            
            renderHaggleModal();
            
            setTimeout(() => {
                gameState.money = realMoney;
                closeHaggle();
                renderMarket();
            }, 2000);
            return; // Выходим при потере терпения
        }
        
        // Обычная неудача (терпение еще есть)
        const quoteKey = `failure_${tacticId}`;
        if (h.item.sellerQuotes[quoteKey]) {
            h.currentQuote = h.item.sellerQuotes[quoteKey];
        }
    }
    
    renderHaggleModal(); // Обновляем интерфейс для обычных тактик
}


function acceptCurrentPrice() {
    const h = currentHaggle;
    if (!h || h.purchaseCompleted) return;
    
    if (gameState.money < h.currentPrice) {
        showNotification('Недостаточно денег!', 'error');
        return;
    }
    
    // Сохраняем реальные деньги и временно устанавливаем 1 рубль
    const realMoney = gameState.money;
    gameState.money = 1;
    
    // Помечаем покупку как завершенную
    h.purchaseCompleted = true;
    
    // Выполняем покупку
    gameState.money = realMoney - h.currentPrice; // Возвращаем реальные деньги минус стоимость
    
    const inventoryItem = {
        ...h.item,
        id: `inv_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
        purchasePrice: h.currentPrice,
        sellerPrice: h.item.askingPrice,
        expertiseDone: false,
        expertiseCost: 0,
        clues: [],
        restorationProgress: {},
        restorationAttempts: 0
    };
    
    // Инициализируем прогресс реставрации
    initializeRestorationProgress(inventoryItem);
    
    // 🔥 ИЗМЕНЕНИЕ: Добавляем предмет В НАЧАЛО инвентаря (вверх списка)
    gameState.inventory.unshift(inventoryItem);
    
    gameState.stats.bought++;
    
    // ⭐ НОВОЕ: Увеличиваем счетчик успешных покупок
    gameState.successfulPurchases++;
    
    // ⭐ НОВОЕ: Проверяем, нужно ли открыть новую тактику
    checkTacticUnlock();
    
    // Пересчитываем навыки после добавления предмета
    calculateSkillLevels();
    
    // Проверяем корректность списания денег
    const expectedMoney = realMoney - h.currentPrice;
    if (gameState.money !== expectedMoney) {
        console.error('Ошибка списания денег! Ожидалось:', expectedMoney, 'Получено:', gameState.money);
        gameState.money = expectedMoney; // Принудительно исправляем
    }
    
    // Показываем реплику продавца и закрываем окно
    if (h.item.sellerQuotes.win) {
        h.currentQuote = h.item.sellerQuotes.win;
        renderHaggleModal();
        
        setTimeout(() => {
            closeHaggle();
            updateDisplay();
            updateWalkingCounters();
            renderMarket();
            saveGame();
            gameState.firstDealToday = false;
        }, 3000);
    } else {
        showNotification(`✅ Куплено за ${formatMoney(h.currentPrice)}!`, 'success');
        closeHaggle();
        updateDisplay();
        updateWalkingCounters();
        renderMarket();
        saveGame();
        gameState.firstDealToday = false;
    }
}


function closeHaggle() {
            if (currentHaggle && currentHaggle.item) {
                gameState.marketItems = gameState.marketItems.filter(i => i.id !== currentHaggle.item.id);
                renderMarket();
            }
            document.getElementById('haggleModal').classList.add('hidden');
            currentHaggle = null;
            gameState.firstDealToday = false;
        }
        
        
        function generateCompetitors() {
    const count = Math.floor(Math.random() * 3) + 1; // 1-3 конкурента
    const competitors = [];
    
    for (let i = 0; i < count; i++) {
        const group = competitorGroups[Math.floor(Math.random() * competitorGroups.length)];
        const member = group.members[Math.floor(Math.random() * group.members.length)];
        competitors.push({
            name: member,
            coefficient: group.coefficient,
            group: group.name
        });
    }
    
    return competitors;
}


function checkCompetitorInterception(currentHaggle) {
    if (!currentHaggle.competitors || currentHaggle.competitors.length === 0) {
        return null;
    }

    const item = currentHaggle.item;
    const discountPercent = ((item.askingPrice - currentHaggle.currentPrice) / item.askingPrice) * 100;
    
    // Находим самого опасного конкурента
    const mostDangerous = currentHaggle.competitors.reduce((max, comp) => 
        comp.coefficient > max.coefficient ? comp : max
    );
    
    // Базовый шанс перехвата = коэффициент * процент скидки
    let interceptionChance = mostDangerous.coefficient * discountPercent;
    
    // Корректируем шанс в зависимости от типа товара и конкурента
    if (mostDangerous.group === "Опасные конкуренты" && item.rarity === "very_rare") {
        interceptionChance *= 1.5;
    }
    
    // Для безопасных покупателей и дешевых товаров снижаем шанс
    if (mostDangerous.coefficient < 0.5 && item.askingPrice < 2000) {
        interceptionChance *= 0.5;
    }
    
    // Проверяем срабатывание
    if (Math.random() * 100 < interceptionChance) {
        return mostDangerous;
    }
    
    return null;
}


function showTacticUnlockModal(tacticInfo, isFinal = false) {
    document.getElementById('unlockedTacticIcon').textContent = tacticInfo.icon;
    document.getElementById('unlockedTacticName').textContent = tacticInfo.name;
    
    if (isFinal) {
        document.getElementById('unlockedTacticMessage').textContent = FINAL_TACTIC_MESSAGE;
        document.getElementById('tacticUnlockModal').querySelector('h2').textContent = "Мастер торговли!";
        document.getElementById('tacticUnlockModal').querySelector('.text-6xl').textContent = "🏆";
    } else {
        document.getElementById('unlockedTacticMessage').textContent = TACTIC_UNLOCK_MESSAGES[tacticInfo.id] || "Вы освоили новую тактику торга!";
    }
    
    document.getElementById('tacticUnlockModal').classList.remove('hidden');
}

function closeTacticUnlockModal() {
    document.getElementById('tacticUnlockModal').classList.add('hidden');
}

function checkTacticUnlock() {
    // Проверяем, есть ли еще тактики для открытия
    if (gameState.nextTacticIndex >= TACTIC_UNLOCK_THRESHOLDS.length) return;
    
    const nextThreshold = TACTIC_UNLOCK_THRESHOLDS[gameState.nextTacticIndex];
    
    // Если достигли порога для следующей тактики
    if (gameState.successfulPurchases >= nextThreshold) {
        const tacticId = TACTIC_UNLOCK_ORDER[gameState.nextTacticIndex];
        const tacticInfo = tactics.find(t => t.id === tacticId);
        
        // Добавляем тактику в список открытых
        gameState.unlockedTactics.push(tacticId);
        
        // Проверяем, это последняя тактика или нет
        const isFinal = (gameState.nextTacticIndex === TACTIC_UNLOCK_THRESHOLDS.length - 1);
        
        // Показываем окно с уведомлением
        showTacticUnlockModal(tacticInfo, isFinal);
        
        // Переходим к следующей тактике
        gameState.nextTacticIndex++;
        
        // Сохраняем игру
        saveGame();
    }
}





// Базовая инициализация нового рынка (статичный демо-режим)


// Закрытие окна предпросмотра
function closeWalkingPreview() {
    const modal = document.getElementById('walking-preview-modal');
    if (modal) {
        modal.remove();
    }
}


// Добавляем обработчик клика на фон (чтобы можно было закрыть по клику вне окна)
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-backdrop')) {
        closeWalkingPreview();
    }
});


// ============================================
// ОБНОВЛЕНИЕ СЧЕТЧИКОВ В РЕЖИМЕ ПРОГУЛКИ
// ============================================

function updateWalkingCounters() {
    const moneyEl = document.getElementById('walking-money');
    const attentionEl = document.getElementById('walking-attention');
    const reputationEl = document.getElementById('walking-reputation'); // Новый элемент
    
    if (moneyEl) moneyEl.textContent = formatMoney(gameState.money);
    if (attentionEl) attentionEl.textContent = gameState.attention;
    // Используем || 0 на случай, если репутация еще не задана в сохранении
    if (reputationEl) reputationEl.textContent = gameState.reputation || 0;
}



function initWalkingMarket() {
    console.log("🚀 initWalkingMarket() запущена");
    const container = document.getElementById('new-market-view');
    
    // Настраиваем контейнер
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    
    // Удаляем старое
    const oldMarketInfo = document.querySelector('.market-info');
    if (oldMarketInfo) oldMarketInfo.remove();
    const oldOverlapPanel = document.querySelector('.overlap-info-panel');
    if (oldOverlapPanel) oldOverlapPanel.remove();
    
    const marketItems = gameState.marketItems;
    
    if (!marketItems || marketItems.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full bg-gray-900 bg-opacity-50 rounded-lg">
                <div class="text-6xl mb-4">🏪</div>
                <p class="text-xl font-semibold mb-2">Рынок сегодня пуст!</p>
                <p class="text-gray-400">Перейдите на следующий день.</p>
            </div>
        `;
        return;
    }
    
    // === РАСЧЕТЫ ===
    const totalOriginalWidth = FIRST_BG_WIDTH + SECOND_BG_WIDTH - BG_OVERLAP;
    const totalOriginalHeight = Math.max(FIRST_BG_HEIGHT, SECOND_BG_HEIGHT);
    const maxHeight = Math.min(window.innerHeight * 0.85, 1000);
    const ratio = totalOriginalWidth / totalOriginalHeight;
    const calculatedWidth = maxHeight * ratio;
    
    currentMarketScale = maxHeight / totalOriginalHeight;
    const scaled = (baseSize) => Math.round(baseSize * currentMarketScale);
    const scaledHeight = (multiplier) => Math.round(maxHeight * BASE_SELLER_HEIGHT_RATIO * multiplier);
    
    console.log(`📐 Масштаб: ${(currentMarketScale * 100).toFixed(1)}%, Высота: ${maxHeight}px`);
    
    // =================================================================================
    // 1. HUD
    // =================================================================================
    const hudHTML = `
        <div id="walking-hud" style="
            position: absolute; 
            left: 5px; 
            top: 5px; 
            z-index: 1000; 
            display: flex; 
            flex-direction: row;
            align-items: center;
            gap: 20px;
            pointer-events: none;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        ">
            <!-- ДЕНЬГИ -->
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 22px; filter: drop-shadow(1px 1px 0 #1B5B34);">💵</span>
                <span id="walking-money" style="
                    font-weight: 900; 
                    font-size: 20px;
                    color: #3ECF6D; 
                    text-shadow: 2px 2px 0px #1B5B34;
                    letter-spacing: 0.5px;
                ">
                    ${formatMoney(gameState.money)}
                </span>
            </div>

            <!-- ЭНЕРГИЯ -->
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 22px; filter: drop-shadow(1px 1px 0 #1D5570);">☕</span>
                <span id="walking-attention" style="
                    font-weight: 900; 
                    font-size: 20px;
                    color: #49C7FF; 
                    text-shadow: 2px 2px 0px #1D5570;
                    letter-spacing: 0.5px;
                ">
                    ${gameState.attention}
                </span>
            </div>

            <!-- РЕПУТАЦИЯ -->
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 22px; filter: drop-shadow(1px 1px 0 #4B2D7A);">🤝</span>
                <span id="walking-reputation" style="
                    font-weight: 900; 
                    font-size: 20px;
                    color: #B07CFF; 
                    text-shadow: 2px 2px 0px #4B2D7A; 
                    letter-spacing: 0.5px;
                ">
                    ${gameState.reputation || 0}
                </span>
            </div>
        </div>
    `;
    
    // === 2. ПОЛОСА РЫНКА ===
    let marketStripHTML = `
        <div id="market-strip" 
             style="
                position: relative;
                height: ${maxHeight}px;
                width: ${calculatedWidth.toFixed(0)}px;
                flex-shrink: 0;
             ">
            
            <div class="bg-layer first-bg" style="
                position: absolute; left: 0; top: 0;
                width: ${(FIRST_BG_WIDTH / totalOriginalWidth * 100).toFixed(2)}%;
                height: 100%;
                background-image: url('long_market01.png');
                background-size: 100% 100%; background-repeat: no-repeat; z-index: 1;
            "></div>
            
            <div class="bg-layer second-bg" style="
                position: absolute;
                left: ${((FIRST_BG_WIDTH - BG_OVERLAP) / totalOriginalWidth * 100).toFixed(2)}%;
                top: 0;
                width: ${(SECOND_BG_WIDTH / totalOriginalWidth * 100).toFixed(2)}%;
                height: 100%;
                background-image: url('long_market.png');
                background-size: 100% 100%; background-repeat: no-repeat; z-index: 2;
            "></div>
    `;
    
    // Рендер товаров
    marketItems.forEach((item, index) => {
        const positionIndex = Math.min(index, MARKET_SLOT_POSITIONS.length - 1);
        const originalPos = MARKET_SLOT_POSITIONS[positionIndex];
        const isOnFirstBg = index < 4;
        let originalX = isOnFirstBg ? originalPos.left : originalPos.left + (FIRST_BG_WIDTH - BG_OVERLAP);
        const leftPercent = (originalX / totalOriginalWidth) * 100;
        const topPercent = (originalPos.top / totalOriginalHeight) * 100;
        
        const itemIcon = DETAILED_ICONS[item.baseName] || CATEGORY_ICONS[item.category] || '❓';
        const skill = gameState.skills[item.category] || 0;
        const displayName = getDisplayName(item, skill);
        const sellerConfig = getSellerConfig(item.sellerType);
        
        const sellerVideoPath = sellerConfig.video ? `seller_portraits/${sellerConfig.video}` : null;
        const sellerImagePath = sellerConfig.image ? `seller_portraits/${sellerConfig.image}` : null;
        const hasPortrait = sellerVideoPath !== null || sellerImagePath !== null;
        
        const portraitHeight = scaledHeight(sellerConfig.heightMultiplier);
        const portraitWidth = Math.round(portraitHeight * sellerConfig.widthRatio);
        const portraitOffsetY = scaled(sellerConfig.offsetY * 10);
        
        const iconSize = scaled(BASE_SIZES.ITEM_ICON);
        const itemPadding = scaled(BASE_SIZES.ITEM_PADDING);
        const borderRadius = scaled(BASE_SIZES.ITEM_BORDER_RADIUS);
        const portraitBorder = scaled(BASE_SIZES.SELLER_BORDER);
        const bottomOffset = scaled(BASE_SIZES.SELLER_BOTTOM_OFFSET) + portraitOffsetY;
        
        // Размеры и стили инфо-плашки
        const infoFontSize = scaled(22);
        const infoPadding = scaled(10);
        const infoMaxWidth = scaled(840);
        const infoMarginTop = scaled(12);
        const priceFontSize = scaled(36);
        const maxLinesHeight = scaled(90);
        
        let mediaElementHTML = '';
        const commonMediaStyles = `height: ${portraitHeight}px; width: ${portraitWidth}px; object-fit: cover; object-position: top center; border-radius: ${scaled(10)}px; border: ${portraitBorder}px solid white; box-shadow: 0 ${scaled(10)}px ${scaled(25)}px rgba(0,0,0,0.3); pointer-events: none;`;
        
        if (sellerVideoPath) {
            mediaElementHTML = `<video src="${sellerVideoPath}" poster="${sellerImagePath || ''}" autoplay loop muted playsinline class="seller-portrait-video" style="${commonMediaStyles}"></video>`;
        } else if (sellerImagePath) {
            mediaElementHTML = `<img src="${sellerImagePath}" alt="${item.sellerName}" class="seller-portrait-img" style="${commonMediaStyles}" onerror="this.parentElement.style.display='none';">`;
        }
        
        marketStripHTML += `
            <div class="market-item-container" data-item-id="${item.id}" data-seller-type="${item.sellerType}"
                 style="position: absolute; left: ${leftPercent.toFixed(2)}%; top: ${topPercent.toFixed(2)}%; transform: translate(-50%, -50%); z-index: ${isOnFirstBg ? 10 : 20};">
                
                ${hasPortrait ? `<div class="seller-portrait-wrapper" style="position: absolute; bottom: ${bottomOffset}px; left: 50%; transform: translateX(-50%); z-index: 15; pointer-events: none; width: max-content; display: flex; justify-content: center;">
                        ${mediaElementHTML}
                    </div>` : ''}
                
                <button class="market-item-btn ${index < 3 ? 'market-item-new' : ''}" id="walking-item-${item.id}" onclick="handleWalkingMarketClick('${item.id}')" title="${displayName} - ${formatMoney(item.askingPrice)}"
                        style="position: relative; margin-top: ${hasPortrait ? scaled(30) : 0}px; padding: ${itemPadding}px; background: ${hasPortrait ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.8)'}; border-radius: ${borderRadius}px; border: ${scaled(2)}px solid ${hasPortrait ? '#4F46E5' : '#9CA3AF'}; z-index: 25; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;">
                    <div class="item-icon" style="font-size: ${iconSize}px; line-height: 1;">${itemIcon}</div>
                </button>
                
                <!-- 🔥 ОБНОВЛЕННЫЙ БЛОК С ИНФОРМАЦИЕЙ О ТОВАРЕ -->
                <div class="item-info" style="
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    margin-top: ${infoMarginTop}px;
                    
                    /* Стили игры: серый фон, двойная рамка */
                    background: #2e3c49;
                    border: ${scaled(4)}px solid #11171d;
                    box-shadow: 0 0 0 ${scaled(2)}px #6f7c8a, 0 ${scaled(10)}px ${scaled(20)}px rgba(0,0,0,0.5);
                    border-radius: ${scaled(4)}px;
                    
                    padding: ${infoPadding}px;
                    max-width: ${infoMaxWidth}px;
                    min-width: ${scaled(350)}px;
                    width: max-content;
                    
                    text-align: center;
                    z-index: 30;
                    pointer-events: none;
                    font-family: 'Silkscreen', cursive; /* Игровой шрифт */
                ">
                    <div style="
                        color: #f4f2e8; /* --text-main */
                        font-weight: normal;
                        font-size: ${infoFontSize}px;
                        line-height: 1.3;
                        margin-bottom: ${scaled(6)}px;
                        white-space: normal;
                        word-wrap: break-word;
                        text-shadow: 2px 2px 0 #11171d; /* Пиксельная тень */
                        
                        /* Ограничение высоты текста */
                        display: -webkit-box;
                        -webkit-line-clamp: 4;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                    ">
                        ${displayName}
                    </div>
                    
                    <!-- Разделительная линия -->
                    <div style="height: ${scaled(2)}px; background: #11171d; margin: ${scaled(4)}px 0 ${scaled(4)}px 0; border-bottom: 1px solid #6f7c8a;"></div>
                    
                    <div style="
                        color: #c5a166; /* --accent-gold, под стиль игры */
                        font-weight: 800;
                        font-size: ${priceFontSize}px;
                        line-height: 1.2;
                        text-shadow: 2px 2px 0 #11171d;
                        letter-spacing: 1px;
                    ">
                        ${formatMoney(item.askingPrice)}
                    </div>
                </div>
            </div>`;
    });
    
    // Пустые слоты
    const totalSlots = 7;
    const emptySlots = totalSlots - marketItems.length;
    for (let i = 0; i < emptySlots; i++) {
        const slotIndex = marketItems.length + i;
        if (slotIndex >= MARKET_SLOT_POSITIONS.length) continue;
        const originalPos = MARKET_SLOT_POSITIONS[slotIndex];
        const isOnFirstBg = slotIndex < 4;
        let originalX = isOnFirstBg ? originalPos.left : originalPos.left + (FIRST_BG_WIDTH - BG_OVERLAP);
        const leftPercent = (originalX / totalOriginalWidth) * 100;
        const topPercent = (originalPos.top / totalOriginalHeight) * 100;
        const emptyIconSize = scaled(BASE_SIZES.EMPTY_SLOT_ICON);
        marketStripHTML += `<div class="market-item-empty" style="position: absolute; left: ${leftPercent.toFixed(2)}%; top: ${topPercent.toFixed(2)}%; transform: translate(-50%, -50%); z-index: ${isOnFirstBg ? 10 : 20};">
                <div class="empty-slot-icon" style="font-size: ${emptyIconSize}px; color: rgba(255,255,255,0.1); line-height: 1;">❓</div></div>`;
    }
    
    marketStripHTML += `</div>`;
    
    // === 3. ОБЕРТКА ===
    const scrollWrapperHTML = `
        <div id="walking-scroll-wrapper" style="
            width: 100%;
            height: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            position: relative;
            display: flex;
            align-items: center;
        ">
            ${marketStripHTML}
        </div>
    `;
    
    container.innerHTML = hudHTML + scrollWrapperHTML;
    
    if (window._marketResizeHandler) {
        window.removeEventListener('resize', window._marketResizeHandler);
    }
    window._marketResizeHandler = updateMarketScale;
    window.addEventListener('resize', window._marketResizeHandler);
    
    showNotification(`👣 На рынке ${marketItems.length} товаров`, 'info');
}