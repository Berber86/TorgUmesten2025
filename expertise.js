// expertise.js
// Константы для системы экспертизы
// Конфигурация доступности методов по уровням навык



// Конфигурация визуального осмотра
const VISUAL_CONFIG = {
    BASE_RELIABILITY: 30,
    SECOND_USE_BONUS: 10,
    THIRD_USE_BONUS: 10,
    LEVEL_MULTIPLIER: 1, // Уровень * 2
    CONFUSION_CHANCE: 0.5 // 50% шанс "ничего не понятно" вместо лжи
};

const METHOD_LEVELS = {
    visual: { first: 1, second: 7, third: 13 },
    loupe: { first: 2, second: 8, third: 14 },
    internet: { first: 3, second: 9, third: 15 },
    testing: { first: 4, second: 10, third: 16 },
    uv: { first: 5, second: 11, third: 17 },
    expert: { first: 6, second: 12, third: 18 }
};


const AGE_ESTIMATION_ACCURACY = {
    visual: { precision: 25, baseReliability: 40 },
    loupe: { precision: 15, baseReliability: 60 },
    uv: { precision: 10, baseReliability: 70 },
    chemical: { precision: 5, baseReliability: 80 },
    expert: { precision: 3, baseReliability: 90 }
};

const BASE_EXPERTISE_COSTS = {
    visual: 10,
    loupe: 20,
    uv: 30,
    testing: 30, // ← ИЗМЕНЕНИЕ ЗДЕСЬ
    expert: 40,
    internet: 25
};



const TESTING_AGE_ACCURACY = {
    porcelain: { precision: 8, baseReliability: 75 },
    metal: { precision: 7, baseReliability: 80 },
    painting: { precision: 6, baseReliability: 85 },
    books: { precision: 10, baseReliability: 70 },
    militaria: { precision: 5, baseReliability: 90 }
};


// ================= КОНФИГУРАЦИЯ ЗОЛОТЫХ ОСКОЛКОВ =================

const GOLDEN_SHARD_CONFIG = {
    trueThreshold: 60,
    fakeThreshold: 40,
    fakeChance: 10,
    multiplier: 2
};

// ================= КОНФИГУРАЦИЯ ЭПОХ =================

const ERAS = {
    modern: {
        maxAge: 35,
        name: 'Современная',
        years: '1990-н.в.'
    },
    soviet: {
        minAge: 35,
        maxAge: 107,
        name: 'Советская',
        years: '1917-1991'
    },
    tsarist: {
        minAge: 107,
        name: 'Царская/Имперская',
        years: 'до 1917'
    }
};

// ==============================================
// КОНФИГУРАЦИЯ PNG-НАКЛЕЕК ДЛЯ ИНСТРУМЕНТОВ
// ==============================================

const METHOD_VISUAL_CONFIG = {
    // Визуальный осмотр - 3 ступени
    visual_1: {
        zoneId: "visualZone",
        pngFile: "methods/method01.png",
        width: "8%",
        height: "8%",
        offsetX: "0%",
        offsetY: "0%"
    },
    visual_2: {
        zoneId: "visualZone",
        pngFile: "methods/method07.png",
        width: "8%",
        height: "8%",
        offsetX: "0%",
        offsetY: "0%"
    },
    visual_3: {
        zoneId: "visualZone",
        pngFile: "methods/method13.png",
        width: "8%",
        height: "8%",
        offsetX: "0%",
        offsetY: "0%"
    },
    
    // Лупа - 3 ступени
    loupe_1: {
        zoneId: "loupeZone",
        pngFile: "methods/method02.png",
        width: "10%",
        height: "10%",
        offsetX: "0%",
        offsetY: "0%"
    },
    loupe_2: {
        zoneId: "loupeZone",
        pngFile: "methods/method08.png",
        width: "7%",
        height: "7%",
        offsetX: "0%",
        offsetY: "0%"
    },
    loupe_3: {
        zoneId: "loupeZone",
        pngFile: "methods/method14.png",
        width: "10%",
        height: "10%",
        offsetX: "0%",
        offsetY: "0%"
    },
    
    // Интернет - 3 ступени
    internet_1: {
        zoneId: "internetZone",
        pngFile: "methods/method03.png",
        width: "15%",
        height: "15%",
        offsetX: "0%",
        offsetY: "0%"
    },
    internet_2: {
        zoneId: "internetZone",
        pngFile: "methods/method09.png",
        width: "15%",
        height: "20%",
        offsetX: "0%",
        offsetY: "0%"
    },
    internet_3: {
        zoneId: "internetZone",
        pngFile: "methods/method15.png",
        width: "8%",
        height: "8%",
        offsetX: "0%",
        offsetY: "0%"
    },
    
    // Тестирование - 3 ступени
    testing_1: {
        zoneId: "testingZone",
        pngFile: "methods/method04.png",
        width: "11%",
        height: "9%",
        offsetX: "0%",
        offsetY: "0%"
    },
    testing_2: {
        zoneId: "testingZone",
        pngFile: "methods/method10.png",
        width: "7%",
        height: "7%",
        offsetX: "0%",
        offsetY: "0%"
    },
    testing_3: {
        zoneId: "testingZone",
        pngFile: "methods/method16.png",
        width: "7%",
        height: "7%",
        offsetX: "0%",
        offsetY: "0%"
    },
    
    // УФ-лампа - 3 ступени
    uv_1: {
        zoneId: "uvZone",
        pngFile: "methods/method05.png",
        width: "15%",
        height: "20%",
        offsetX: "0%",
        offsetY: "0%"
    },
    uv_2: {
        zoneId: "uvZone",
        pngFile: "methods/method11.png",
        width: "6%",
        height: "6%",
        offsetX: "0%",
        offsetY: "0%"
    },
    uv_3: {
        zoneId: "uvZone",
        pngFile: "methods/method17.png",
        width: "6%",
        height: "6%",
        offsetX: "0%",
        offsetY: "0%"
    },
    
    // Эксперт - 3 ступени
    expert_1: {
        zoneId: "expertZone",
        pngFile: "methods/method06.png",
        width: "30%",
        height: "60%",
        offsetX: "0%",
        offsetY: "0%"
    },
    expert_2: {
        zoneId: "expertZone",
        pngFile: "methods/method12.png",
        width: "8%",
        height: "8%",
        offsetX: "0%",
        offsetY: "0%"
    },
    expert_3: {
        zoneId: "expertZone",
        pngFile: "methods/method18.png",
        width: "8%",
        height: "8%",
        offsetX: "0%",
        offsetY: "0%"
    }
};

function updateOfficeVisuals() {
    // 1. Безопасность
    const state = window.gameState || gameState;
    if (!state) return;
    if (typeof state.officeLevel === 'undefined') state.officeLevel = 0;
    
    const level = state.officeLevel;
    const config = (window.OFFICE_CONFIG || OFFICE_CONFIG)[String(level)] || OFFICE_CONFIG['0'];
    
    // 2. Обновляем картинку
    const imgEl = document.getElementById('expertiseTableImage');
    if (imgEl) {
        // Проверка src чтобы не мерцало лишний раз
        if (!imgEl.src.includes(config.img)) {
            imgEl.src = config.img;
        }
    }
    
    // 3. Рендер Кнопки Ремонта (НОВОЕ)
    const container = document.querySelector('.expertise-square-container');
    
    // Если контейнера нет (модалка закрыта), выходим
    if (!container) return;
    
    let repairBtn = document.getElementById('officeRepairBtn');
    
    // Если кнопки нет - создаем её
    if (!repairBtn) {
        repairBtn = document.createElement('button');
        repairBtn.id = 'officeRepairBtn';
        // Стили Tailwind: правый нижний угол, поверх картинки
        repairBtn.className = 'absolute bottom-4 right-4 z-20 bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-3 rounded-lg shadow-lg border border-gray-300 flex items-center gap-2 transition-all transform hover:scale-105';
        container.appendChild(repairBtn);
    }
    
    // Настраиваем кнопку
    if (level >= 2) {
        // На макс уровне кнопка не нужна
        repairBtn.classList.add('hidden');
    } else {
        repairBtn.classList.remove('hidden');
        
        const cost = config.repairCost;
        const isDowngraded = level < 0;
        
        // Иконка и текст
        const icon = isDowngraded ? '🛠️' : '✨';
        const label = isDowngraded ? 'Ремонт' : 'Улучшить';
        
        // Проверка: хватает ли денег (красим цену)
        const canAfford = state.money >= cost;
        const priceColor = canAfford ? 'text-green-600' : 'text-red-500';
        
        repairBtn.innerHTML = `
            <span class="text-2xl">${icon}</span>
            <div class="text-left leading-none">
                <div class="text-[10px] uppercase text-gray-500 font-bold">${label}</div>
                <div class="text-sm font-bold ${priceColor}">${cost}₽</div>
            </div>
        `;
        
        // Навешиваем обработчик (удаляем старый, чтобы не дублировалось)
        repairBtn.onclick = tryRepairOffice;
        
        // Подсказка (title)
        const nextLvlConfig = (window.OFFICE_CONFIG || OFFICE_CONFIG)[String(level + 1)];
        if (nextLvlConfig) {
            const mod = nextLvlConfig.energyMod;
            const sign = mod > 0 ? '+' : '';
            repairBtn.title = `${nextLvlConfig.name}\nЭнергия: ${sign}${mod}`;
        }
    }
}

function tryRepairOffice() {
    // 1. Железобетонное получение gameState
    // Если window.gameState нет, пробуем искать просто gameState
    const state = (window.gameState) ? window.gameState : (typeof gameState !== 'undefined' ? gameState : null);
    
    if (!state) {
        console.error("❌ ОШИБКА: gameState не найден внутри tryRepairOffice!");
        // Пытаемся восстановить, если это возможно (крайний случай)
        return;
    }
    
    // 2. Инициализация уровня, если вдруг его нет
    if (typeof state.officeLevel === 'undefined') state.officeLevel = 0;
    
    const level = state.officeLevel;
    
    // Если уже макс уровень, делать нечего
    if (level >= 2) return;
    
    // Получаем конфиг (с защитой от undefined)
    const configObj = window.OFFICE_CONFIG || OFFICE_CONFIG;
    if (!configObj) {
        console.error("❌ ОШИБКА: OFFICE_CONFIG не найден!");
        return;
    }
    
    const currentConfig = configObj[String(level)];
    
    // В конфиге repairCost - это цена перехода на уровень ВЫШЕ (level + 1)
    const cost = currentConfig.repairCost;
    const nextLevel = level + 1;
    const nextConfig = configObj[String(nextLevel)];
    
    if (!nextConfig) {
        console.error("Ошибка: нет конфига для уровня", nextLevel);
        return;
    }
    
    // Проверка денег
    if (state.money < cost) {
        showNotification(`Не хватает денег! Нужно ${cost}₽`, 'error');
        return;
    }
    
    // Текст подтверждения
    const actionName = level < 0 ? "Ремонт помещения" : "Улучшение офиса";
    const mod = nextConfig.energyMod;
    const bonusText = mod > 0 ? `+${mod}` : `${mod}`;
    
    const message = `${actionName}\n\n` +
        `Станет: "${nextConfig.name}"\n` +
        `Цена: ${cost}₽\n` +
        `Эффект: ${bonusText} энергии в день\n\n` +
        `Выполнить работы?`;
    
    if (confirm(message)) {
        // Оплата и Апгрейд
        state.money -= cost;
        state.officeLevel = nextLevel;
        
        showNotification(`${actionName} завершен!`, 'success');
        
        // Обновляем визуал и кнопку
        if (typeof updateOfficeVisuals === 'function') updateOfficeVisuals();
        
        // Обновляем деньги в хедере
        if (typeof updateDisplay === 'function') updateDisplay();
        
        if (typeof saveGame === 'function') saveGame();
    }
}

// ==============================================
// БЫСТРЫЕ ФУНКЦИИ ДЛЯ ДЕБАГА PNG-НАКЛЕЕК
// ==============================================

// 1. Проверка конфига
function debugCheckConfig() {
    console.log("=== ПРОВЕРКА КОНФИГА PNG ===");
    console.log("Всего записей в конфиге:", Object.keys(METHOD_VISUAL_CONFIG).length);
    
    const methods = ['visual', 'loupe', 'internet', 'testing', 'uv', 'expert'];
    methods.forEach(method => {
        console.log(`\n🔍 Метод ${method}:`);
        for (let i = 1; i <= 3; i++) {
            const key = `${method}_${i}`;
            const config = METHOD_VISUAL_CONFIG[key];
            if (config) {
                console.log(`  ${key}: ${config.pngFile} → зона: ${config.zoneId}`);
            } else {
                console.log(`  ${key}: НЕТ КОНФИГА!`);
            }
        }
    });
}

// 2. Проверка доступности метода
function debugCheckMethodAvailability(method) {
    if (!currentExpertise || !currentExpertise.item) {
        console.log("❌ Нет активной экспертизы");
        return;
    }
    
    const item = currentExpertise.item;
    const skill = gameState.skills[item.category] || 0;
    const levels = METHOD_LEVELS[method];
    const uses = item[method + 'Uses'] || 0;
    
    console.log(`=== ПРОВЕРКА МЕТОДА ${method} ===`);
    console.log("Навык:", skill);
    console.log("Требуется уровни:", levels);
    console.log("Использовано раз:", uses);
    console.log("Доступные ступени по навыку:");
    
    if (skill >= levels.first) console.log("  - 1 ступень ✓");
    if (skill >= levels.second) console.log("  - 2 ступень ✓");
    if (skill >= levels.third) console.log("  - 3 ступень ✓");
    
    const step = getCurrentStepForMethod(method, item);
    console.log("Должна показываться ступень:", step || "НЕТ");
    
    if (step) {
        const configKey = `${method}_${step}`;
        const config = METHOD_VISUAL_CONFIG[configKey];
        console.log("Конфиг для этой ступени:", config ? config.pngFile : "НЕТ КОНФИГА!");
    }
}

// 3. Проверка зон тыка
function debugCheckZones() {
    console.log("=== ПРОВЕРКА ЗОН ТЫКА ===");
    const zoneIds = [
        "visualZone", "loupeZone", "internetZone", 
        "testingZone", "uvZone", "expertZone"
    ];
    
    zoneIds.forEach(zoneId => {
        const zone = document.getElementById(zoneId);
        if (zone) {
            const rect = zone.getBoundingClientRect();
            console.log(`${zoneId}: существует, позиция: ${rect.left}x${rect.top}, размер: ${rect.width}x${rect.height}`);
        } else {
            console.log(`${zoneId}: НЕ НАЙДЕНА в HTML!`);
        }
    });
}

// 4. Проверка контейнера PNG
function debugCheckPNGContainer() {
    console.log("=== ПРОВЕРКА КОНТЕЙНЕРА ===");
    const tableContainer = document.querySelector('.expertise-square-container');
    const pngContainer = document.getElementById('methodVisualsContainer');
    
    console.log("Контейнер стола:", tableContainer ? "найден" : "НЕ НАЙДЕН");
    console.log("Контейнер PNG:", pngContainer ? "найден" : "НЕ НАЙДЕН");
    
    if (pngContainer) {
        console.log("Размер PNG контейнера:", pngContainer.offsetWidth, "x", pngContainer.offsetHeight);
        console.log("Количество PNG внутри:", pngContainer.children.length);
    }
}

// 5. Показать ВСЕ PNG принудительно (тестовая функция)
function debugShowAllPNG() {
    console.log("=== ПРИНУДИТЕЛЬНЫЙ ПОКАЗ ВСЕХ PNG ===");
    const container = initMethodVisualsContainer();
    if (!container) {
        console.log("❌ Не удалось создать контейнер");
        return;
    }
    
    container.innerHTML = '';
    const containerRect = container.getBoundingClientRect();
    
    // Для каждой зоны показываем тестовую PNG
    const zones = [
        { id: "visualZone", method: "visual", step: 1 },
        { id: "loupeZone", method: "loupe", step: 1 },
        { id: "internetZone", method: "internet", step: 1 },
        { id: "testingZone", method: "testing", step: 1 },
        { id: "uvZone", method: "uv", step: 1 },
        { id: "expertZone", method: "expert", step: 1 }
    ];
    
    zones.forEach(z => {
        const zone = document.getElementById(z.id);
        if (!zone) {
            console.log(`❌ Зона ${z.id} не найдена`);
            return;
        }
        
        const zoneRect = zone.getBoundingClientRect();
        const img = document.createElement('img');
        img.src = "https://placehold.co/50x50/3498db/ffffff.png?text=" + z.method.substring(0, 3);
        img.style.position = 'absolute';
        img.style.left = (zoneRect.left - containerRect.left) + 'px';
        img.style.top = (zoneRect.top - containerRect.top) + 'px';
        img.style.width = '50px';
        img.style.height = '50px';
        img.style.backgroundColor = 'red';
        img.style.zIndex = '1000';
        
        container.appendChild(img);
        console.log(`✅ PNG для ${z.method} добавлен`);
    });
    
    console.log("✅ Тестовые PNG добавлены. Если не видно - проблема с позиционированием.");
}

// 6. Основная функция дебага
function debugPNGSystem() {
    console.clear();
    console.log("🎯 ЗАПУСК ДЕБАГА PNG-СИСТЕМЫ");
    
    debugCheckConfig();
    debugCheckZones();
    debugCheckPNGContainer();
    
    if (currentExpertise && currentExpertise.item) {
        console.log("\n=== ПРОВЕРКА ДОСТУПНОСТИ МЕТОДОВ ===");
        ['visual', 'loupe', 'internet', 'testing', 'uv', 'expert'].forEach(method => {
            debugCheckMethodAvailability(method);
        });
    } else {
        console.log("\n⚠️ Нет активной экспертизы для проверки доступности методов");
    }
    
    console.log("\n💡 В консоли выполни debugShowAllPNG() для принудительного показа тестовых PNG");
}


// ИКОНКИ ДЛЯ РАЗНЫХ НАЖАТИЙ
const TESTING_ICONS = {
    1: "👋", // Физический осмотр
    2: "🧪", // Химический тест
    3: "🔬" // Инструментальный анализ
};

const TESTING_NAMES = {
    1: "Физический осмотр",
    2: "Химический тест",
    3: "Инструментальный анализ"
};

// ФИЗИЧЕСКИЕ ТЕСТЫ ДЛЯ КАЖДОЙ КАТЕГОРИИ
const PHYSICAL_TESTS = {
    porcelain: [
        "лёгкое постукивание выявляет звонкий звук, характерный для качественного фарфора",
        "фарфор на ощупь заметно холоднее стекла",
        "при осмотре на просвет видна равномерная толщина стенок",
        "поверхность гладкая, без микротрещин"
    ],
    metal: [
        "предмет обладает характерным для металла весом",
        "проверка на магнетизм показывает естественные свойства материала",
        "при лёгком ударе слышен чистый металлический звук",
        "балансировка выявляет равномерное распределение массы"
    ],
    painting: [
        "осмотр под разными углами выявляет рельефность мазков",
        "холст равномерно натянут, без провисаний",
        "подрамник сохраняет жёсткость и геометрию",
        "кракелюр имеет естественный рисунок"
    ],
    books: [
        "бумага имеет характерный для возраста запах",
        "переплёт сохраняет гибкость, не рассыпается",
        "страницы перелистываются с характерным шелестом",
        "книга имеет вес, соответствующий объёму"
    ],
    militaria: [
        "оружие имеет сбалансированный вес",
        "механизмы работают без заеданий",
        "лезвие сохраняет остаточную гибкость",
        "металл не имеет внутренних напряжений"
    ]
};

// ХИМИЧЕСКИЕ ТЕСТЫ ДЛЯ КАЖДОЙ КАТЕГОРИИ  
const CHEMICAL_TESTS = {
    porcelain: [
        "тест на глазурь показывает естественное старение",
        "пигменты не растворяются в слабом растворителе",
        "кислотный тест выявляет старинный состав глазури",
        "анализ показывает отсутствие современных красителей"
    ],
    metal: [
        "реакция на серебро подтверждает пробы",
        "патина не смывается слабыми растворами",
        "тест на олово выявляет традиционный припой",
        "анализ показывает естественное окисление"
    ],
    painting: [
        "тест на связующее указывает на масляную основу",
        "лак не растворяется в стандартных растворителях",
        "пигменты ведут себя характерно для заявленного периода",
        "грунт имеет типичный для эпохи состав"
    ],
    books: [
        "чернила не растворяются в воде",
        "бумага имеет нейтральную кислотность",
        "клей имеет характерный для периода состав",
        "переплётные материалы соответствуют эпохе"
    ],
    militaria: [
        "воронение не сходит при химическом тесте",
        "сталь не реагирует на слабые кислоты",
        "состав сплава соответствует периоду",
        "материалы рукояти не разлагаются"
    ]
};

// ИНСТРУМЕНТАЛЬНЫЕ ТЕСТЫ ДЛЯ КАТЕГОРИЙ
const INSTRUMENTAL_TESTS = {
    porcelain: [
        "спектральный анализ глазури подтверждает состав",
        "микроскопия выявляет традиционную структуру",
        "рентгенофлуоресцентный анализ показывает естественные примеси",
        "термолюминесценция указывает на возраст обжига"
    ],
    metal: [
        "рентгенофлуоресцентный анализ подтверждает состав сплава",
        "твердомер показывает соответствующую твёрдость",
        "микроскопия структуры выявляет традиционную технологию",
        "анализ показывает отсутствие современных добавок"
    ],
    painting: [
        "ИК-рефлектография выявляет подмалёвок",
        "УФ-флуоресценция показывает естественное старение лака",
        "микроскопия мазков подтверждает ручную работу",
        "анализ пигментов выявляет исторические составы"
    ],
    books: [
        "микроскопия бумажных волокон указывает на происхождение",
        "анализ водяных знаков подтверждает период",
        "спектроскопия чернил показывает традиционный состав",
        "тест на целлюлозу выявляет возраст бумаги"
    ],
    militaria: [
        "металлография показывает структуру ковки/литья",
        "анализ клейм под микроскопом подтверждает подлинность",
        "спектральный анализ указывает на происхождение стали",
        "твердомер показывает соответствующую закалку"
    ]
};

const MATERIAL_ORIGINS = {
    porcelain: [
        { name: "уральская каолиновая глина", years: [1800, 1917], descriptor: "имперское качество" },
        { name: "китайская фарфоровая масса", years: [1700, 1850], descriptor: "восточный импорт" },
        { name: "местные глины Подмосковья", years: [1850, 1950], descriptor: "кустарное производство" },
        { name: "немецкая фарфоровая масса", years: [1880, 1930], descriptor: "европейский импорт" },
        { name: "советская фарфоровая смесь", years: [1930, 1991], descriptor: "массовое производство" },
        { name: "современная керамическая масса", years: [1991, 2026], descriptor: "современные материалы" }
    ],
    metal: [
        { name: "уральская сталь", years: [1800, 1917], descriptor: "качество Златоуста" },
        { name: "томпак (сплав меди и цинка)", years: [1700, 1900], descriptor: "царское качество" },
        { name: "серебро 84 пробы", years: [1700, 1917], descriptor: "имперский стандарт" },
        { name: "сталь ЧТЗ", years: [1930, 1950], descriptor: "военное производство" },
        { name: "алюминиевый сплав", years: [1950, 1991], descriptor: "советские сплавы" },
        { name: "нержавеющая сталь", years: [1991, 2026], descriptor: "современные технологии" }
    ],
    painting: [
        { name: "льняной холст", years: [1700, 1917], descriptor: "традиционный материал" },
        { name: "медная пластина", years: [1700, 1850], descriptor: "старинная техника" },
        { name: "хлопковый холст", years: [1850, 1950], descriptor: "массовое производство" },
        { name: "оргалит", years: [1930, 1991], descriptor: "советские материалы" },
        { name: "синтетический грунт", years: [1970, 2026], descriptor: "современные технологии" }
    ],
    books: [
        { name: "тряпичная бумага", years: [1700, 1860], descriptor: "рукотворное качество" },
        { name: "древесная бумага", years: [1860, 1950], descriptor: "индустриальная эпоха" },
        { name: "газетная бумага", years: [1917, 1991], descriptor: "советский стандарт" },
        { name: "мелованная бумага", years: [1991, 2026], descriptor: "современная печать" }
    ],
    militaria: [
        { name: "дамасская сталь", years: [1700, 1850], descriptor: "ручная ковка" },
        { name: "штампованная сталь", years: [1850, 1917], descriptor: "индустриальное производство" },
        { name: "хромованадиевая сталь", years: [1930, 1950], descriptor: "военные технологии" },
        { name: "алюминиевый сплав", years: [1950, 1980], descriptor: "авиационные материалы" },
        { name: "титановый сплав", years: [1980, 2026], descriptor: "современные технологии" }
    ]
};

const UV_ANALYSIS = {
    // Точность методов УФ
    AGE_PRECISION: {
        original: 15, // ±15 лет для оригинала
        restoration: 10 // ±10 лет для реставрации
    },
    
    // Базовые достоверности
    BASE_RELIABILITY: 70,
    
    // Фразы для разных режимов
    PLAYER_MODE_PHRASES: {
        restoration_presence: [
            "предмет подвергался реставрации",
            "видны следы реставрационного вмешательства",
            "обнаружены признаки реставрации",
            "есть следы восстановительных работ"
        ],
        restoration_absence: [
            "реставрации не обнаружено",
            "следов восстановительных работ нет",
            "предмет не реставрировался",
            "признаки исключительно естественного старения"
        ],
        restoration_grade: {
            professional: [
                "реставрация выполнена на профессиональном уровне",
                "высококачественная реставрация",
                "работа выполнена мастером-реставратором"
            ],
            quality: [
                "качественная реставрация",
                "добротная восстановительная работа",
                "реставрация хорошего уровня"
            ],
            medium: [
                "реставрация среднего качества",
                "работа выполнена удовлетворительно",
                "неплохая, но не идеальная реставрация"
            ],
            rough: [
                "грубая реставрация",
                "кустарная починка",
                "непрофессиональная реставрация"
            ]
        },
        age_original: [
            "возраст оригинала примерно %age% лет",
            "предмету около %age% лет",
            "изготовлен примерно %age% лет назад",
            "возраст составляет около %age% лет"
        ],
        age_restoration: [
            "реставрация выполнена примерно %age% лет назад",
            "восстановительные работы проведены около %age% лет назад",
            "починке примерно %age% лет",
            "реставрации около %age% лет"
        ]
    }
}


// ==============================================
// ФУНКЦИИ ДЛЯ РАБОТЫ С PNG-НАКЛЕЙКАМИ
// ==============================================

// Определяет текущую доступную ступень метода
function getCurrentStepForMethod(method, item) {
    const skill = gameState.skills[item.category] || 0;
    const levels = METHOD_LEVELS[method];
    
    if (!levels) return null;
    
    // Определяем доступные ступени по уровню навыка
    const availableSteps = [];
    if (skill >= levels.first) availableSteps.push(1);
    if (skill >= levels.second) availableSteps.push(2);
    if (skill >= levels.third) availableSteps.push(3);
    
    // Если нет доступных ступеней
    if (availableSteps.length === 0) return null;
    
    // Получаем количество использований этого метода
    const usesKey = method + 'Uses';
    const uses = item[usesKey] || 0;
    
    // Находим минимальную доступную и еще не использованную ступень
    for (const step of availableSteps) {
        if (step > uses) {
            return step; // Нашли ступень, которую еще не использовали
        }
    }
    
    // Все доступные ступени уже использованы
    return null;
}

// Создает и позиционирует PNG-наклейку
function createMethodPNG(config, zoneRect, containerRect) {
    const img = document.createElement('img');
    img.src = config.pngFile;
    img.className = 'method-visual-png';
    img.dataset.method = config.method || 'unknown';
    img.dataset.step = config.step || 1;
    
    // Вычисляем центр зоны в процентах от контейнера
    const centerXPercent = ((zoneRect.left - containerRect.left + zoneRect.width / 2) / containerRect.width) * 100;
    const centerYPercent = ((zoneRect.top - containerRect.top + zoneRect.height / 2) / containerRect.height) * 100;
    
    // Применяем CSS стили
    img.style.position = 'absolute';
    img.style.left = `calc(${centerXPercent}% + ${config.offsetX} - ${config.width} / 2)`;
    img.style.top = `calc(${centerYPercent}% + ${config.offsetY} - ${config.height} / 2)`;
    img.style.width = config.width;
    img.style.height = config.height;
    img.style.pointerEvents = 'auto';
    img.style.zIndex = '10';
    img.style.cursor = 'pointer';
    img.style.transform = 'scale(2)';
    img.style.opacity = '0';
    img.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
    
    return img;
}

// Обновляет все PNG-наклейки на столе

// Удаляет PNG-наклейку с анимацией
function removeMethodVisual(method, step) {
    const container = document.getElementById('methodVisualsContainer');
    if (!container) return;
    
    const png = container.querySelector(`img[data-method="${method}"][data-step="${step}"]`);
    if (png) {
        png.style.opacity = '0';
        png.style.transition = 'opacity 0.3s ease-out';
        
        setTimeout(() => {
            if (png.parentNode === container) {
                container.removeChild(png);
                // После удаления обновляем PNG (может появиться следующая ступень)
                setTimeout(updateMethodVisuals, 50);
            }
        }, 300);
    }
}

// Инициализирует контейнер для PNG
function initMethodVisualsContainer() {
    const tableContainer = document.querySelector('.expertise-square-container');
    if (!tableContainer) {
        console.error("❌ Не найден контейнер стола ('.expertise-square-container')");
        return null;
    }
    
    let pngContainer = document.getElementById('methodVisualsContainer');
    if (!pngContainer) {
        pngContainer = document.createElement('div');
        pngContainer.id = 'methodVisualsContainer';
        pngContainer.style.position = 'absolute';
        pngContainer.style.top = '0';
        pngContainer.style.left = '0';
        pngContainer.style.width = '100%';
        pngContainer.style.height = '100%';
        pngContainer.style.pointerEvents = 'none';
        pngContainer.style.zIndex = '10';
        tableContainer.appendChild(pngContainer);
    }
    
    return pngContainer; // 🔥 Всегда возвращаем контейнер или null
}


// Убираем обработчик при закрытии экспертизы
function closeExpertise() {
    document.getElementById('expertiseModal').classList.add('hidden');
    currentExpertise = null;
    // Убираем обработчик ресайза
 //   window.removeEventListener('resize', handleExpertiseResize);
}

function generateVisualShard(item, skill) {
    const category = item.category || 'porcelain';
    const useNumber = item.visualUses || 1;
    const isPlayerMode = !gameState.isTesterMode;
    
    // РАСЧЁТ ДОСТОВЕРНОСТИ ОСКОЛКА (логика сохранена)
    let baseReliability = VISUAL_CONFIG.BASE_RELIABILITY;
    if (useNumber === 2) baseReliability += VISUAL_CONFIG.SECOND_USE_BONUS;
    if (useNumber === 3) baseReliability += VISUAL_CONFIG.THIRD_USE_BONUS;
    baseReliability += skill * VISUAL_CONFIG.LEVEL_MULTIPLIER;
    const shardReliability = Math.min(95, baseReliability);
    
    // ОПРЕДЕЛЯЕМ КОЛИЧЕСТВО ФАКТОВ (логика сохранена)
    const factCount = useNumber;
    
    // ГЕНЕРИРУЕМ ФАКТЫ (логика сохранена)
    const availableFactTypes = ['age', 'marks', 'condition'];
    const selectedTypes = [];
    
    while (selectedTypes.length < factCount && selectedTypes.length < availableFactTypes.length) {
        const remainingTypes = availableFactTypes.filter(t => !selectedTypes.includes(t));
        if (remainingTypes.length > 0) {
            const randomType = remainingTypes[Math.floor(Math.random() * remainingTypes.length)];
            selectedTypes.push(randomType);
        } else {
            break;
        }
    }
    
    // Генерируем факты с индивидуальной достоверностью (логика сохранена)
    const facts = selectedTypes.map(factType => {
        const factReliability = Math.max(20, Math.min(100, 
            shardReliability + (Math.random() * 20 - 10)
        ));
        
        const factTruthfulness = Math.random() < (factReliability / 100);
        
        // 50% шанс "ничего не понятно" вместо лжи (логика сохранена)
        let isConfused = false;
        if (!factTruthfulness && Math.random() < VISUAL_CONFIG.CONFUSION_CHANCE) {
            isConfused = true;
        }
        
        // Генерируем факт с новыми атмосферными фразами
        let fact;
        if (isConfused) {
            fact = generateConfusedFact(factType, item, factReliability);
        } else if (factTruthfulness) {
            fact = generateIndividualFact(factType, item, true, factReliability, isPlayerMode, useNumber);
        } else {
            fact = generateIndividualFact(factType, item, false, factReliability, isPlayerMode, useNumber);
        }
        
        return {
            ...fact,
            factTruthfulness: factTruthfulness,
            isConfused: isConfused
        };
    });
    
    const avgReliability = Math.round(facts.reduce((sum, fact) => sum + fact.reliability, 0) / facts.length);
    
    // ФОРМИРУЕМ ТЕКСТ ОСКОЛКА
    let fullText;
    
    if (isPlayerMode) {
        // РЕЖИМ ИГРОКА: атмосферные вступительные фразы по категории
        const beginningPhrases = VISUAL_BEGINNING_PHRASES[category]?.[useNumber] || 
                                  VISUAL_BEGINNING_PHRASES.porcelain[useNumber];
        const beginningPhrase = beginningPhrases[Math.floor(Math.random() * beginningPhrases.length)];
        
        const factTexts = facts.map(fact => {
            const reliabilityPhrase = getReliabilityPhrase(fact.reliability);
            return `• ${reliabilityPhrase} ${fact.text}`;
        }).join('\n');
        
        fullText = `${beginningPhrase}:\n${factTexts}`;
    } else {
        // РЕЖИМ ТЕСТЕРА (без изменений)
        const factTexts = facts.map(fact => {
            let indicator;
            if (fact.isConfused) {
                indicator = '🤷‍♂️';
            } else if (fact.factTruthfulness) {
                indicator = '✅';
            } else {
                indicator = '❌';
            }
            
            return `• ${indicator} ${fact.text} (${fact.reliability}%)`;
        }).join('\n');
        
        fullText = `👁️ Визуальный осмотр [${category}] (${useNumber}/3):\n${factTexts}`;
    }
    
    return {
        method: 'visual',
        reliability: avgReliability,
        type: useNumber === 1 ? 'Первый взгляд' : 
              useNumber === 2 ? 'Пристальный взгляд' : 'Детальный осмотр',
        text: fullText,
        icon: '👁️',
        category: 'neutral',
        isTruthful: facts.every(fact => fact.factTruthfulness && !fact.isConfused),
        facts: facts,
        visualData: {
            baseReliability: baseReliability,
            factCount: factCount,
            uses: useNumber,
            isConfused: facts.some(fact => fact.isConfused),
            truthCount: facts.filter(fact => fact.factTruthfulness).length,
            itemCategory: category
        }
    };
}

// 3. Функции для лупы

function generateLoupeDamageRestorationShard(item, skill) {
    const damageFact = generateLoupeDamageFact(item, skill);
    const restorationFact = generateLoupeRestorationFact(item, skill);
    
    const overallReliability = Math.round((damageFact.reliability + restorationFact.reliability) / 2);
    
    if (!gameState.isTesterMode) {
        let beginningPhrase;
        const loupeUses = item.loupeUses || 1;
        
        if (loupeUses === 1) {
            beginningPhrase = "Под лупой Вы замечаете, что";
        } else if (loupeUses === 2) {
            beginningPhrase = "При более детальном рассмотрении через лупу";
        } else {
            beginningPhrase = "Максимально приблизив лупу, Вы видите, что";
        }
        
        const factTexts = [damageFact.text, restorationFact.text].map(text => `• ${text}`).join('\n');
        const fullText = `${beginningPhrase}:\n${factTexts}`;
        
        return {
            method: 'loupe',
            reliability: overallReliability,
            type: 'Исследование лупы',
            text: fullText,
            icon: '🔍',
            category: 'condition',
            isTruthful: undefined,
            facts: [damageFact, restorationFact]
        };
    } else {
        const factTexts = [damageFact.text, restorationFact.text].map(text => `• ${text}`).join('\n');
        const fullText = `🔍 Лупа (повреждения и реставрация):\n${factTexts}`;
        
        return {
            method: 'loupe',
            reliability: overallReliability,
            type: 'Повреждения и реставрация',
            text: fullText,
            icon: '🔍',
            category: 'condition',
            isTruthful: undefined,
            facts: [damageFact, restorationFact]
        };
    }
}

function generateLoupeDamageFact(item, skill) {
    const baseReliability = 60 + (skill * 1);
    const reliability = Math.min(95, baseReliability);
    const isTruthful = Math.random() < (reliability / 100);
    
    if (!gameState.isTesterMode) {
        const hasDamage = item.defects && item.defects.length > 0;
        let damageText;
        
        if (hasDamage) {
            const hasCritical = item.defects.some(defectName => {
                const defect = getDefectByName(defectName);
                return defect.difficulty === 'critical' || defect.difficulty === 'hard';
            });
            
            if (hasCritical) {
                damageText = "видны значительные повреждения материала";
            } else {
                damageText = "есть незначительные повреждения поверхности";
            }
        } else {
            damageText = "повреждений материала не обнаружено";
        }
        
        return {
            type: 'damage',
            text: damageText,
            reliability: reliability,
            isTruthful: isTruthful
        };
    } else {
        const conditionAnalysis = analyzeDetailedCondition(item, isTruthful);
        let conditionText = conditionAnalysis.detailedDescription.split('\n')[0];
        if (conditionText.length > 80) {
            conditionText = conditionText.substring(0, 77) + '...';
        }
        
        const truthIndicator = isTruthful ? '✅' : '❌';
        return {
            type: 'damage',
            text: `${truthIndicator} ${conditionText}`,
            reliability: reliability,
            isTruthful: isTruthful
        };
    }
}



function generateLoupeRestorationFact(item, skill) {
    const baseReliability = 70 + (skill * 1);
    const reliability = Math.min(95, baseReliability);
    const isTruthful = Math.random() < (reliability / 100);
    
    if (!gameState.isTesterMode) {
        let restorationText;
        
        if (item.restoration) {
            if (item.restoration === 'rough') {
                restorationText = "видны следы грубой реставрации";
            } else if (item.restoration === 'medium') {
                restorationText = "обнаружены признаки средней реставрации";
            } else if (item.restoration === 'quality') {
                restorationText = "есть признаки качественной реставрации";
            } else if (item.restoration === 'professional') {
                restorationText = "обнаружены следы профессиональной реставрации";
            } else {
                restorationText = "есть признаки реставрации";
            }
        } else {
            restorationText = "следов реставрации не обнаружено";
        }
        
        return {
            type: 'restoration',
            text: restorationText,
            reliability: reliability,
            isTruthful: isTruthful
        };
    } else {
        let restorationText = item.restoration ? 
            `Реставрация: ${item.restoration}` : 
            "Реставрация: отсутствует";
        
        const truthIndicator = isTruthful ? '✅' : '❌';
        return {
            type: 'restoration',
            text: `${truthIndicator} ${restorationText}`,
            reliability: reliability,
            isTruthful: isTruthful
        };
    }
}

function generateLoupeAgeShard(item, skill) {
    const accuracy = AGE_ESTIMATION_ACCURACY['loupe'];
    const realAge = item.age;
    
    const skillBonus = Math.max(0, skill - 1) * 0.1;
    const precision = Math.round(accuracy.precision * (1 - skillBonus));
    
    const error = (Math.random() - 0.5) * 2 * precision;
    const estimatedAge = Math.max(0, Math.min(326, Math.round(realAge + error)));
    
    const ageDiff = Math.abs(estimatedAge - realAge);
    const accuracyPenalty = (ageDiff / precision) * 20;
    const reliability = Math.max(20, Math.min(95, accuracy.baseReliability - accuracyPenalty + (skill * 1)));

    if (!gameState.isTesterMode) {
        // РЕЖИМ ИГРОКА: текст с износом материала
        const loupeUses = item.loupeUses || 1;
        let beginningPhrase;
        
        if (loupeUses === 1) {
            beginningPhrase = "Под лупой Вы замечаете, что";
        } else if (loupeUses === 2) {
            beginningPhrase = "При более детальном рассмотрении через лупу";
        } else {
            beginningPhrase = "Максимально приблизив лупу, Вы видите, что";
        }
        
        const ageRange = `${estimatedAge - precision}-${estimatedAge + precision}`;
        const text = `${beginningPhrase} судя по износу материала предмету примерно ${ageRange} лет.`;
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Возраст',
            text: text,
            icon: '📅',
            category: 'age',
            estimatedAge: estimatedAge,
            agePrecision: precision,
            isTruthful: Math.random() < (reliability / 100)
        };
    } else {
        // РЕЖИМ ТЕСТЕРА: как было
        const ageRange = `${estimatedAge - precision}-${estimatedAge + precision}`;
        const text = `Лупа: ${estimatedAge}±${precision} лет`;
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Возраст',
            text: text,
            icon: '📅',
            category: 'age',
            estimatedAge: estimatedAge,
            agePrecision: precision,
            isTruthful: Math.random() < (reliability / 100)
        };
    }
}


function generateStandardLoupeShard(item, skill) {
    // Генерация обычного осколка подлинности для лупы
    const availableShards = expertiseShards['loupe'];
    if (!availableShards) {
        return {
            type: 'Информация',
            text: 'Под лупой не обнаружено ничего примечательного',
            icon: '🔍',
            method: 'loupe',
            reliability: 50,
            category: 'neutral'
        };
    }
    
    // Определяем базовую категорию на основе подлинности предмета
    let baseCategory;
    if (item.authentic) {
        baseCategory = 'authentic';
    } else {
        baseCategory = 'fake';
    }
    
    // Влияние навыка на вероятность правильной категории
    const skillInfluence = skill * 0.05;
    let finalCategory = baseCategory;
    
    // С шансом, зависящим от навыка, можем случайно выбрать неправильную категорию
    if (Math.random() < (0.3 - skillInfluence)) {
        finalCategory = baseCategory === 'authentic' ? 'fake' : 'authentic';
    }
    
    // Выбираем случайный осколок из выбранной категории
    const categoryShards = availableShards[finalCategory];
    if (!categoryShards || categoryShards.length === 0) {
        return {
            type: 'Информация',
            text: 'Под лупой не обнаружено ничего примечательного',
            icon: '🔍',
            method: 'loupe',
            reliability: 50,
            category: 'neutral'
        };
    }
    
    const selectedShard = categoryShards[Math.floor(Math.random() * categoryShards.length)];
    
    // Расчет базовой достоверности
    let baseReliability;
    if (finalCategory === baseCategory) {
        // Если категория соответствует подлинности - высокая достоверность
        baseReliability = 60 + Math.random() * 30;
    } else {
        // Если категория не соответствует - низкая достоверность
        baseReliability = 20 + Math.random() * 30;
    }
    
    // Бонус за навык
    const skillBonus = 1.5 * (skill || 0);
    const calculatedReliability = Math.min(95, Math.floor(baseReliability + skillBonus));
    
    // Новая система: двухэтапная проверка достоверности
    const reliabilityRoll = Math.floor(Math.random() * 100) + 1;
    let isTruthful = reliabilityRoll <= calculatedReliability;
    
    // Если осколок неправдив, инвертируем его содержание
    let finalShard = { ...selectedShard };
    if (!isTruthful) {
        // Ищем противоположный осколок из другой категории
        const oppositeCategory = finalCategory === 'authentic' ? 'fake' : 'authentic';
        const oppositeShards = availableShards[oppositeCategory];
        
        if (oppositeShards && oppositeShards.length > 0) {
            finalShard = oppositeShards[Math.floor(Math.random() * oppositeShards.length)];
            finalCategory = oppositeCategory;
        }
    }
    
    // Для режима игрока добавляем вводную фразу
    if (!gameState.isTesterMode) {
        const loupeUses = item.loupeUses || 1;
        let beginningPhrase;
        
        if (loupeUses === 1) {
            beginningPhrase = "Под лупой Вы замечаете, что";
        } else if (loupeUses === 2) {
            beginningPhrase = "При более детальном рассмотрении через лупу";
        } else {
            beginningPhrase = "Максимально приблизив лупу, Вы видите, что";
        }
        
        finalShard.text = `${beginningPhrase} ${finalShard.text.toLowerCase()}`;
    }
    
    return {
        method: 'loupe',
        reliability: calculatedReliability,
        category: finalCategory,
        isTruthful: isTruthful,
        ...finalShard
    };
}


// ==============================================
// ДОБАВЬТЕ ВСЕ ЭТИ ФУНКЦИИ СЮДА - ПОСЛЕ КОНСТАНТ, ПЕРЕД ВСЕМИ ДРУГИМИ ФУНКЦИЯМИ
// ==============================================

// 1. Сначала вспомогательные функции для фактов




function generateTestingAgeFact(item, isTruthful, reliability, skill, isPlayerMode) {
    const accuracy = TESTING_AGE_ACCURACY[item.category] || { precision: 10, baseReliability: 70 };
    
    // Бонус за навык
    const skillBonus = Math.max(0, skill - 1) * 0.1;
    const precision = Math.round(accuracy.precision * (1 - skillBonus));
    
    let estimatedAge;
    if (isTruthful) {
        // Правдивая оценка
        const error = (Math.random() - 0.5) * 2 * precision;
        estimatedAge = Math.max(0, Math.min(326, Math.round(item.age + error)));
    } else {
        // Ложная оценка
        const bigError = (Math.random() - 0.5) * 4 * precision;
        estimatedAge = Math.max(0, Math.min(326, Math.round(item.age + bigError)));
        
        // 20% шанс абсурдного возраста
        if (Math.random() < 0.2) {
            estimatedAge = Math.floor(Math.random() * 326);
        }
    }
    
    let text;
    if (isPlayerMode) {
        const phrases = [
            "возраст предмета примерно %age% лет",
            "предмету около %age% лет", 
            "изготовлен примерно %age% лет назад",
            "возраст составляет около %age% лет"
        ];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        text = phrase.replace('%age%', estimatedAge);
    } else {
        text = `Возраст: ${estimatedAge}±${precision} лет`;
    }
    
    return {
        type: 'age',
        text: text,
        reliability: Math.round(reliability),
        isTruthful: isTruthful,
        estimatedAge: estimatedAge,
        agePrecision: precision
    };
}

function generateTestingAuthenticityFact(item, isTruthful, reliability, isPlayerMode) {
    const isAuthentic = item.authentic;
    
    let text;
    if (isPlayerMode) {
        if (isTruthful) {
            const phrases = isAuthentic ? 
                ["предмет является подлинником", "это оригинальное изделие", "подлинность подтверждается"] :
                ["предмет является подделкой", "это не оригинальное изделие", "признаки подделки очевидны"];
            text = phrases[Math.floor(Math.random() * phrases.length)];
        } else {
            // Ложный факт - инверсия
            const phrases = !isAuthentic ? 
                ["предмет является подлинником", "это оригинальное изделие", "подлинность подтверждается"] :
                ["предмет является подделкой", "это не оригинальное изделие", "признаки подделки очевидны"];
            text = phrases[Math.floor(Math.random() * phrases.length)];
        }
    } else {
        if (isTruthful) {
            text = isAuthentic ? "Подлинность: оригинал" : "Подлинность: подделка";
        } else {
            text = !isAuthentic ? "Подлинность: оригинал (ложь)" : "Подлинность: подделка (ложь)";
        }
    }
    
    return {
        type: 'authenticity',
        text: text,
        reliability: Math.round(reliability),
        isTruthful: isTruthful,
        actualAuthentic: isAuthentic
    };
}

function generateTestingOriginFact(item, isTruthful, reliability, isPlayerMode) {
    const origins = MATERIAL_ORIGINS[item.category] || [];
    const year = 2026 - item.age;
    
    // Находим подходящее происхождение по году
    let suitableOrigins = origins.filter(origin => 
        year >= origin.years[0] && year <= origin.years[1]
    );
    
    if (suitableOrigins.length === 0) {
        suitableOrigins = origins; // fallback
    }
    
    let selectedOrigin;
    if (isTruthful) {
        // Правдивое происхождение
        selectedOrigin = suitableOrigins[Math.floor(Math.random() * suitableOrigins.length)];
    } else {
        // Ложное происхождение - берем неподходящее
        const unsuitableOrigins = origins.filter(origin => 
            !suitableOrigins.includes(origin)
        );
        selectedOrigin = unsuitableOrigins.length > 0 ? 
            unsuitableOrigins[Math.floor(Math.random() * unsuitableOrigins.length)] :
            origins[Math.floor(Math.random() * origins.length)];
    }
    
    let text;
    if (isPlayerMode) {
        const phrases = [
            "использован материал: %origin%",
            "предмет изготовлен из %origin%", 
            "основной материал: %origin%",
            "сырьё: %origin%"
        ];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        text = phrase.replace('%origin%', selectedOrigin.name);
    } else {
        text = `Материал: ${selectedOrigin.name} (${selectedOrigin.descriptor})`;
    }
    
    return {
        type: 'origin',
        text: text,
        reliability: Math.round(reliability),
        isTruthful: isTruthful,
        origin: selectedOrigin.name,
        descriptor: selectedOrigin.descriptor
    };
}

// ==============================================
// ДОБАВЬТЕ ВСЕ ЭТИ ФУНКЦИИ СЮДА - ПОСЛЕ КОНСТАНТ, ПЕРЕД ВСЕМИ ДРУГИМИ ФУНКЦИЯМИ
// ==============================================

// 1. Сначала вспомогательные функции для фактов




function generateTestingAgeFact(item, isTruthful, reliability, skill, isPlayerMode) {
    const accuracy = TESTING_AGE_ACCURACY[item.category] || { precision: 10, baseReliability: 70 };
    
    // Бонус за навык
    const skillBonus = Math.max(0, skill - 1) * 0.1;
    const precision = Math.round(accuracy.precision * (1 - skillBonus));
    
    let estimatedAge;
    if (isTruthful) {
        // Правдивая оценка
        const error = (Math.random() - 0.5) * 2 * precision;
        estimatedAge = Math.max(0, Math.min(326, Math.round(item.age + error)));
    } else {
        // Ложная оценка
        const bigError = (Math.random() - 0.5) * 4 * precision;
        estimatedAge = Math.max(0, Math.min(326, Math.round(item.age + bigError)));
        
        // 20% шанс абсурдного возраста
        if (Math.random() < 0.2) {
            estimatedAge = Math.floor(Math.random() * 326);
        }
    }
    
    let text;
    if (isPlayerMode) {
        const phrases = [
            "возраст предмета примерно %age% лет",
            "предмету около %age% лет", 
            "изготовлен примерно %age% лет назад",
            "возраст составляет около %age% лет"
        ];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        text = phrase.replace('%age%', estimatedAge);
    } else {
        text = `Возраст: ${estimatedAge}±${precision} лет`;
    }
    
    return {
        type: 'age',
        text: text,
        reliability: Math.round(reliability),
        isTruthful: isTruthful,
        estimatedAge: estimatedAge,
        agePrecision: precision
    };
}

function generateTestingAuthenticityFact(item, isTruthful, reliability, isPlayerMode) {
    const isAuthentic = item.authentic;
    
    let text;
    if (isPlayerMode) {
        if (isTruthful) {
            const phrases = isAuthentic ? 
                ["предмет является подлинником", "это оригинальное изделие", "подлинность подтверждается"] :
                ["предмет является подделкой", "это не оригинальное изделие", "признаки подделки очевидны"];
            text = phrases[Math.floor(Math.random() * phrases.length)];
        } else {
            // Ложный факт - инверсия
            const phrases = !isAuthentic ? 
                ["предмет является подлинником", "это оригинальное изделие", "подлинность подтверждается"] :
                ["предмет является подделкой", "это не оригинальное изделие", "признаки подделки очевидны"];
            text = phrases[Math.floor(Math.random() * phrases.length)];
        }
    } else {
        if (isTruthful) {
            text = isAuthentic ? "Подлинность: оригинал" : "Подлинность: подделка";
        } else {
            text = !isAuthentic ? "Подлинность: оригинал (ложь)" : "Подлинность: подделка (ложь)";
        }
    }
    
    return {
        type: 'authenticity',
        text: text,
        reliability: Math.round(reliability),
        isTruthful: isTruthful,
        actualAuthentic: isAuthentic
    };
}

function generateTestingOriginFact(item, isTruthful, reliability, isPlayerMode) {
    const origins = MATERIAL_ORIGINS[item.category] || [];
    const year = 2026 - item.age;
    
    // Находим подходящее происхождение по году
    let suitableOrigins = origins.filter(origin => 
        year >= origin.years[0] && year <= origin.years[1]
    );
    
    if (suitableOrigins.length === 0) {
        suitableOrigins = origins; // fallback
    }
    
    let selectedOrigin;
    if (isTruthful) {
        // Правдивое происхождение
        selectedOrigin = suitableOrigins[Math.floor(Math.random() * suitableOrigins.length)];
    } else {
        // Ложное происхождение - берем неподходящее
        const unsuitableOrigins = origins.filter(origin => 
            !suitableOrigins.includes(origin)
        );
        selectedOrigin = unsuitableOrigins.length > 0 ? 
            unsuitableOrigins[Math.floor(Math.random() * unsuitableOrigins.length)] :
            origins[Math.floor(Math.random() * origins.length)];
    }
    
    let text;
    if (isPlayerMode) {
        const phrases = [
            "использован материал: %origin%",
            "предмет изготовлен из %origin%", 
            "основной материал: %origin%",
            "сырьё: %origin%"
        ];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        text = phrase.replace('%origin%', selectedOrigin.name);
    } else {
        text = `Материал: ${selectedOrigin.name} (${selectedOrigin.descriptor})`;
    }
    
    return {
        type: 'origin',
        text: text,
        reliability: Math.round(reliability),
        isTruthful: isTruthful,
        origin: selectedOrigin.name,
        descriptor: selectedOrigin.descriptor
    };
}


function generateAgeShard(methodId, item, skill) {
    const accuracy = AGE_ESTIMATION_ACCURACY[methodId];
    const realAge = item.age;
    
    const skillBonus = Math.max(0, skill - 1) * 0.1;
    const precision = Math.round(accuracy.precision * (1 - skillBonus));
    
    const error = (Math.random() - 0.5) * 2 * precision;
    const estimatedAge = Math.max(0, Math.min(326, Math.round(realAge + error)));
    
    const ageDiff = Math.abs(estimatedAge - realAge);
    const accuracyPenalty = (ageDiff / precision) * 20;
    const reliability = Math.max(20, Math.min(95, accuracy.baseReliability - accuracyPenalty + (skill * 1)));

    const ageClues = {
        visual: [
            `Визуально: ${estimatedAge}±${precision} лет`,
            `По стилю: около ${estimatedAge} лет`,
            `Внешний вид соответствует возрасту ~${estimatedAge} лет`
        ],
        loupe: [
            `Лупа: ${estimatedAge}±${precision} лет`,
            `Детали указывают на возраст ~${estimatedAge} лет`,
            `По клеймам: примерно ${estimatedAge} лет`
        ],
        uv: [
            `УФ-анализ: ${estimatedAge}±${precision} лет`,
            `Старение материалов: ~${estimatedAge} лет`,
            `Флуоресценция соответствует ${estimatedAge} годам`
        ],
        chemical: [
            `Хим.анализ: ${estimatedAge}±${precision} лет`,
            `Состав материалов: возраст ~${estimatedAge} лет`,
            `Радиоуглеродный анализ: ${estimatedAge}±${precision} лет`
        ],
        expert: [
            `Эксперт: ${estimatedAge}±${precision} лет`,
            `Профессиональная оценка: ~${estimatedAge} лет`,
            `По совокупности признаков: ${estimatedAge}±${precision} лет`
        ]
    };

    const clues = ageClues[methodId] || [`Возраст: ${estimatedAge}±${precision} лет`];
    const text = clues[Math.floor(Math.random() * clues.length)];

    // НОВАЯ СИСТЕМА: ДВУХЭТАПНАЯ ПРОВЕРКА ДОСТОВЕРНОСТИ
    const reliabilityRoll = Math.floor(Math.random() * 100) + 1;
    let isTruthful = reliabilityRoll <= reliability;
    
    // ДЛЯ ВОЗРАСТА ИНВЕРСИЯ ОЗНАЧАЕТ БОЛЬШУЮ ПОГРЕШНОСТЬ
    if (!isTruthful) {
        const bigError = (Math.random() - 0.5) * 4 * precision;
        const falseAge = Math.max(0, Math.min(326, Math.round(realAge + bigError)));
        const falseText = `Возраст: ${falseAge}±${precision * 2} лет`;
        
        return {
            method: methodId,
            reliability: Math.round(reliability),
            type: 'Возраст',
            text: falseText,
            icon: '📅',
            category: 'age',
            estimatedAge: falseAge,
            agePrecision: precision * 2,
            isTruthful: false
        };
    }

    return {
        method: methodId,
        reliability: Math.round(reliability),
        type: 'Возраст',
        text: text,
        icon: '📅',
        category: 'age',
        estimatedAge: estimatedAge,
        agePrecision: precision,
        isTruthful: true
    };
}




function generateMarksShard(methodId, item, skill) {
    const marksCheck = checkMarksConsistency(item);
    const skillBonus = skill * 1;
    
    let reliability, text, category;
    
    if (!item.marks || item.marks.length === 0) {
        reliability = 60 + skillBonus;
        text = "клейма отсутствуют";
        category = "neutral";
    } else if (marksCheck.consistent === true) {
        reliability = 80 + skillBonus;
        text = `видны клейма: ${item.marks.join(', ')}`;
        category = "authentic";
    } else if (marksCheck.consistent === false) {
        reliability = 75 + skillBonus;
        text = `клейма "${item.marks.join(', ')}" выглядят подозрительно`;
        category = "fake";
    } else {
        reliability = 50 + skillBonus;
        text = `обнаружены клейма, но они требуют дополнительной проверки`;
        category = "neutral";
    }

    // НОВАЯ СИСТЕМА: двухэтапная проверка достоверности
    const reliabilityRoll = Math.floor(Math.random() * 100) + 1;
    let isTruthful = reliabilityRoll <= reliability;
    
    // ЕСЛИ ОСКОЛОК НЕПРАВДИВ, ИНВЕРТИРУЕМ ЕГО СОДЕРЖИМОЕ
    if (!isTruthful) {
        if (category === "authentic") {
            text = `клейма "${item.marks.join(', ')}" выглядят подозрительно`;
            category = "fake";
        } else if (category === "fake") {
            text = `видны клейма: ${item.marks.join(', ')}`;
            category = "authentic";
        }
    }

    // ДЛЯ РЕЖИМА ИГРОКА ДОБАВЛЯЕМ ВВОДНУЮ ФРАЗУ
    if (!gameState.isTesterMode && methodId === 'loupe') {
        const loupeUses = item.loupeUses || 1;
        let beginningPhrase;
        
        if (loupeUses === 1) {
            beginningPhrase = "Под лупой Вы замечаете, что";
        } else if (loupeUses === 2) {
            beginningPhrase = "При более детальном рассмотрении через лупу";
        } else {
            beginningPhrase = "Максимально приблизив лупу, Вы видите, что";
        }
        
        text = `${beginningPhrase} ${text}`;
    }

    const methodTexts = {
        loupe: "🔍 Анализ клейм под лупой:",
        expert: "👴 Экспертная оценка клейм:"
    };

    return {
        method: methodId,
        reliability: Math.min(95, Math.round(reliability)),
        type: 'Клейма',
        text: !gameState.isTesterMode ? text : `${methodTexts[methodId] || "Анализ:"} ${text}`,
        icon: '🏷️',
        category: 'marks',
        marksCheck: marksCheck,
        isTruthful: isTruthful
    };
}



function generateExpertiseShard(methodId, item, skill) {
    // 🔥 ОБНОВЛЕНИЕ: Если метод - интернет, вызываем соответствующую функцию
    if (methodId === 'internet') {
        return generateInternetShard(item, skill);
    }
    
    // СПЕЦИАЛЬНАЯ ОБРАБОТКА ДЛЯ ВЗГЛЯДА
    if (methodId === 'visual') {
        return generateVisualShard(item, skill);
    }
    
    if (methodId === 'uv') {
        return generateUVShard(item, skill);
    }
    
    // СПЕЦИАЛЬНАЯ ОБРАБОТКА ДЛЯ ЛУПЫ
    if (methodId === 'loupe') {
        return generateLoupeShardNew(item, skill);
    }
    
    // С ШАНСОМ 25% ГЕНЕРИРУЕМ ОСКОЛК О КЛЕЙМАХ ДЛЯ МЕТОДА ЭКСПЕРТ
    if (methodId === 'expert' && Math.random() < 0.25) {
        return generateMarksShard(methodId, item, skill);
    }
    
    // С ШАНСОМ 30% ГЕНЕРИРУЕМ ОСКОЛК СТИЛЯ
    if (Math.random() < 0.3 && item.dominantStyle) {
        return generateStyleShard(methodId, item, skill);
    }
    
    // С ШАНСОМ 40% ГЕНЕРИРУЕМ ОСКОЛК ВОЗРАСТА ВМЕСТО ОБЫЧНОГО
    if (Math.random() < 0.4 && AGE_ESTIMATION_ACCURACY[methodId]) {
        return generateAgeShard(methodId, item, skill);
    }
    
    // Остальной код остается без изменений...
    // ... [существующий код] ...


    // НОВАЯ ЛОГИКА ГЕНЕРАЦИИ ОСКОЛКОВ ПОДЛИННОСТИ
    const availableShards = expertiseShards[methodId];
    if (!availableShards) {
        return { 
            type: 'Информация', 
            text: 'Получены дополнительные сведения', 
            icon: '❓',
            method: methodId,
            reliability: 50,
            category: 'neutral'
        };
    }


    // ОПРЕДЕЛЯЕМ БАЗОВУЮ КАТЕГОРИЮ НА ОСНОВЕ ПОДЛИННОСТИ ПРЕДМЕТА
    let baseCategory;
    if (item.authentic) {
        baseCategory = 'authentic';
    } else {
        baseCategory = 'fake';
    }
    
    // ВЛИЯНИЕ НАВЫКА НА ВЕРОЯТНОСТЬ ПРАВИЛЬНОЙ КАТЕГОРИИ
    const skillInfluence = skill * 0.05;
    let finalCategory = baseCategory;
    
    // С ШАНСОМ, ЗАВИСЯЩИМ ОТ НАВЫКА, МОЖЕМ СЛУЧАЙНО ВЫБРАТЬ НЕПРАВИЛЬНУЮ КАТЕГОРИЮ
    if (Math.random() < (0.3 - skillInfluence)) {
        finalCategory = baseCategory === 'authentic' ? 'fake' : 'authentic';
    }
    
    // ВЫБИРАЕМ СЛУЧАЙНЫЙ ОСКОЛОК ИЗ ВЫБРАННОЙ КАТЕГОРИИ
    const categoryShards = availableShards[finalCategory];
    if (!categoryShards || categoryShards.length === 0) {
        return {
            type: 'Информация',
            text: 'Получены дополнительные сведения',
            icon: '❓',
            method: methodId,
            reliability: 50,
            category: 'neutral'
        };
    }
    
    const selectedShard = categoryShards[Math.floor(Math.random() * categoryShards.length)];
    
    // РАСЧЕТ БАЗОВОЙ ДОСТОВЕРНОСТИ
    let baseReliability;
    if (finalCategory === baseCategory) {
        // ЕСЛИ КАТЕГОРИЯ СООТВЕТСТВУЕТ ПОДЛИННОСТИ - ВЫСОКАЯ ДОСТОВЕРНОСТЬ
        baseReliability = 70 + Math.random() * 25;
    } else {
        // ЕСЛИ КАТЕГОРИЯ НЕ СООТВЕТСТВУЕТ - НИЗКАЯ ДОСТОВЕРНОСТЬ
        baseReliability = 20 + Math.random() * 30;
    }
    
    // БОНУС ЗА НАВЫК
    const skillBonus = 1 * (skill || 0);
    const calculatedReliability = Math.min(95, Math.floor(baseReliability + skillBonus));
    
    // НОВАЯ СИСТЕМА: ДВУХЭТАПНАЯ ПРОВЕРКА ДОСТОВЕРНОСТИ
    const reliabilityRoll = Math.floor(Math.random() * 100) + 1;
    let isTruthful = reliabilityRoll <= calculatedReliability;
    
    // ЕСЛИ ОСКОЛОК НЕПРАВДИВ, ИНВЕРТИРУЕМ ЕГО СОДЕРЖИМОЕ
    let finalShard = { ...selectedShard };
    if (!isTruthful) {
        // ИЩЕМ ПРОТИВОПОЛОЖНЫЙ ОСКОЛОК ИЗ ДРУГОЙ КАТЕГОРИИ
        const oppositeCategory = finalCategory === 'authentic' ? 'fake' : 'authentic';
        const oppositeShards = availableShards[oppositeCategory];
        
        if (oppositeShards && oppositeShards.length > 0) {
            finalShard = oppositeShards[Math.floor(Math.random() * oppositeShards.length)];
            finalCategory = oppositeCategory;
        }
    }
    
    return {
        method: methodId,
        reliability: calculatedReliability,
        category: finalCategory,
        isTruthful: isTruthful,
        ...finalShard
    };
}

function generateLoupeShardNew(item, skill) {
    const category = item.category || 'porcelain';
    const hasMarks = item.marks && item.marks.length > 0;
    const loupeUses = item.loupeUses || 1;
    const isPlayerMode = !gameState.isTesterMode;
    
    // ПЕРВОЕ НАЖАТИЕ - КЛЕЙМА (если они есть)
    if (hasMarks && loupeUses === 1) {
        return generateLoupeMarksShardFirstLook(item, skill);
    }
    
    // РАСПРЕДЕЛЕНИЕ ТИПОВ ОСКОЛКОВ
    const random = Math.random();
    
    // Базовые шансы
    let marksChance = hasMarks ? 0.35 : 0.15;
    let ageChance = 0.25;
    let restorationChance = 0.25;
    let damageChance = 0.15;
    
    // После первого использования снижаем шанс клейм
    if (loupeUses > 1) {
        marksChance *= 0.7;
    }
    
    // Нормируем
    const total = marksChance + ageChance + restorationChance + damageChance;
    marksChance /= total;
    ageChance /= total;
    restorationChance /= total;
    damageChance /= total;
    
    // Выбираем тип
    if (random < marksChance) {
        return generateLoupeMarksShard(item, skill);
    } else if (random < marksChance + ageChance) {
        return generateLoupeAgeShard(item, skill);
    } else if (random < marksChance + ageChance + restorationChance) {
        return generateLoupeRestorationShard(item, skill);
    } else {
        return generateLoupeDamageShard(item, skill);
    }
}

function generateLoupeMarksShardFirstLook(item, skill) {
    const baseReliability = 70 + (skill * 1); // Не слишком высокая достоверность
    const reliability = Math.min(90, baseReliability);
    const isTruthful = Math.random() < (reliability / 100);
    const isPlayerMode = !gameState.isTesterMode;
    const hasMarks = item.marks && item.marks.length > 0;
    
    if (isPlayerMode) {
        let beginningPhrase = "Первым делом Вы ищете клейма. ";
        let marksText;
        
        if (isTruthful) {
            if (hasMarks) {
                marksText = `Находите их: ${item.marks.join(', ')}`;
            } else {
                marksText = "Но не находите никаких клейм";
            }
        } else {
            // ЛОЖНЫЕ КЛЕЙМА: берем случайное клеймо из категории
            const categoryMarks = MARKS_BY_PERIOD[item.category] || [];
            if (categoryMarks.length > 0 && Math.random() < 0.7) {
                // 70% шанс придумать ложное клеймо
                const randomMark = categoryMarks[Math.floor(Math.random() * categoryMarks.length)];
                marksText = `Находите клеймо: ${randomMark.mark}`;
            } else {
                // 30% шанс скрыть существующие клейма
                marksText = "Но не находите никаких клейм";
            }
        }
        
        const text = beginningPhrase + marksText;
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Клейма (первый взгляд)',
            text: text,
            icon: '🏷️',
            category: 'marks',
            isTruthful: isTruthful,
            isFirstLook: true
        };
    } else {
        // РЕЖИМ ТЕСТЕРА
        let text;
        
        if (isTruthful) {
            if (hasMarks) {
                text = `Первое: клейма: ${item.marks.join(', ')}`;
            } else {
                text = "Первое: клейма отсутствуют";
            }
        } else {
            if (hasMarks) {
                text = "Первое: клейма не найдены (ложь)";
            } else {
                const categoryMarks = MARKS_BY_PERIOD[item.category] || [];
                if (categoryMarks.length > 0) {
                    const randomMark = categoryMarks[Math.floor(Math.random() * categoryMarks.length)];
                    text = `Первое: найдено клеймо: ${randomMark.mark} (ложь)`;
                } else {
                    text = "Первое: клейма отсутствуют (правда)";
                }
            }
        }
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Клейма',
            text: text,
            icon: '🏷️',
            category: 'marks',
            isTruthful: isTruthful,
            isFirstLook: true
        };
    }
}


function generateLoupeMarksShard(item, skill) {
    const baseReliability = 75 + (skill * 1);
    const reliability = Math.min(95, baseReliability);
    const isTruthful = Math.random() < (reliability / 100);
    const isPlayerMode = !gameState.isTesterMode;
    const hasMarks = item.marks && item.marks.length > 0;
    const loupeUses = item.loupeUses || 0;
    
    if (isPlayerMode) {
        let beginningPhrase;
        if (loupeUses === 1) {
            beginningPhrase = "Под лупой Вы ищете клейма и";
        } else if (loupeUses === 2) {
            beginningPhrase = "Повторно изучая клейма,";
        } else {
            beginningPhrase = "Внимательно всматриваясь в детали,";
        }
        
        let marksText;
        
        if (isTruthful) {
            if (hasMarks) {
                marksText = `находите: ${item.marks.join(', ')}`;
            } else {
                marksText = "не находите клейм";
            }
        } else {
            // ЛОЖНЫЕ КЛЕЙМА: генерируем случайное клеймо для категории
            const categoryMarks = MARKS_BY_PERIOD[item.category] || [];
            if (categoryMarks.length > 0) {
                const randomMark = categoryMarks[Math.floor(Math.random() * categoryMarks.length)];
                
                if (hasMarks) {
                    // Если клейма есть, но мы врем - говорим что их нет или другие
                    if (Math.random() < 0.5) {
                        marksText = "не находите клейм";
                    } else {
                        marksText = `находите: ${randomMark.mark}`;
                    }
                } else {
                    // Если клейм нет, но мы врем - придумываем клеймо
                    marksText = `находите: ${randomMark.mark}`;
                }
            } else {
                marksText = "не находите клейм";
            }
        }
        
        const text = `${beginningPhrase} ${marksText}`;
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Клейма',
            text: text,
            icon: '🏷️',
            category: 'marks',
            isTruthful: isTruthful
        };
    } else {
        // РЕЖИМ ТЕСТЕРА
        let text;
        
        if (isTruthful) {
            if (hasMarks) {
                text = `Клейма: ${item.marks.join(', ')}`;
            } else {
                text = "Клейма: отсутствуют";
            }
        } else {
            const categoryMarks = MARKS_BY_PERIOD[item.category] || [];
            if (categoryMarks.length > 0) {
                const randomMark = categoryMarks[Math.floor(Math.random() * categoryMarks.length)];
                text = `Клейма: ${randomMark.mark} (ложь)`;
            } else {
                text = "Клейма: отсутствуют (ложь)";
            }
        }
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Клейма',
            text: text,
            icon: '🏷️',
            category: 'marks',
            isTruthful: isTruthful
        };
    }
}


function generateLoupeRestorationShard(item, skill) {
    const baseReliability = 65 + (skill * 1);
    const reliability = Math.min(90, baseReliability);
    const isTruthful = Math.random() < (reliability / 100);
    const isPlayerMode = !gameState.isTesterMode;
    const hasRestoration = item.restoration && item.restoration !== 'none';
    const loupeUses = item.loupeUses || 0;
    
    if (isPlayerMode) {
        let beginningPhrase;
        if (loupeUses === 1) {
            beginningPhrase = "Изучая поверхность под лупой,";
        } else if (loupeUses === 2) {
            beginningPhrase = "Пристально всматриваясь,";
        } else {
            beginningPhrase = "Под максимальным увеличением лупы,";
        }
        
        let restorationText;
        
        if (isTruthful) {
            if (hasRestoration) {
                const grades = {
                    rough: "видите следы грубой реставрации",
                    medium: "замечаете работу реставратора среднего уровня",
                    quality: "обнаруживаете аккуратную реставрацию",
                    professional: "видите профессиональную реставрацию"
                };
                restorationText = grades[item.restoration] || "видите следы реставрации";
            } else {
                restorationText = "не находите следов реставрации";
            }
        } else {
            // ЛОЖНАЯ ИНФОРМАЦИЯ О РЕСТАВРАЦИИ
            if (hasRestoration) {
                // Если реставрация есть, но мы врем - говорим что ее нет
                restorationText = "не находите следов реставрации";
            } else {
                // Если реставрации нет, но мы врем - придумываем степень
                const falseGrades = ["грубая реставрация", "средняя реставрация", "качественная реставрация"];
                const falseGrade = falseGrades[Math.floor(Math.random() * falseGrades.length)];
                restorationText = `видите следы ${falseGrade}`;
            }
        }
        
        const text = `${beginningPhrase} Вы ${restorationText}`;
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Реставрация',
            text: text,
            icon: '🛠️',
            category: 'restoration',
            isTruthful: isTruthful
        };
    } else {
        // РЕЖИМ ТЕСТЕРА
        let text;
        
        if (isTruthful) {
            if (hasRestoration) {
                const grades = {
                    rough: "Реставрация: грубая",
                    medium: "Реставрация: средняя",
                    quality: "Реставрация: качественная", 
                    professional: "Реставрация: профессиональная"
                };
                text = grades[item.restoration] || "Реставрация: есть";
            } else {
                text = "Реставрация: отсутствует";
            }
        } else {
            if (hasRestoration) {
                text = "Реставрация: отсутствует (ложь)";
            } else {
                const falseGrades = ["грубая", "средняя", "качественная"];
                const falseGrade = falseGrades[Math.floor(Math.random() * falseGrades.length)];
                text = `Реставрация: ${falseGrade} (ложь)`;
            }
        }
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Реставрация',
            text: text,
            icon: '🛠️',
            category: 'restoration',
            isTruthful: isTruthful
        };
    }
}


function generateLoupeDamageShard(item, skill) {
    const baseReliability = 70 + (skill * 1);
    const reliability = Math.min(95, baseReliability);
    const isTruthful = Math.random() < (reliability / 100);
    const isPlayerMode = !gameState.isTesterMode;
    const hasDefects = item.defects && item.defects.length > 0;
    const loupeUses = item.loupeUses || 0;
    
    if (isPlayerMode) {
        let beginningPhrase;
        if (loupeUses === 1) {
            beginningPhrase = "Исследуя предмет под лупой,";
        } else if (loupeUses === 2) {
            beginningPhrase = "Тщательно изучая поверхность,";
        } else {
            beginningPhrase = "Внимательно рассматривая детали,";
        }
        
        let damageText;
        
        if (isTruthful) {
            if (hasDefects) {
                if (item.defects.length === 1) {
                    damageText = `обнаруживаете дефект: ${item.defects[0]}`;
                } else {
                    damageText = `находите несколько дефектов: ${item.defects.slice(0, 2).join(', ')}`;
                }
            } else {
                damageText = "не находите значительных повреждений";
            }
        } else {
            // ЛОЖНАЯ ИНФОРМАЦИЯ О ПОВРЕЖДЕНИЯХ
            if (hasDefects) {
                damageText = "не находите значительных повреждений";
            } else {
                const fakeDefects = ["мелкие царапины", "незначительные сколы", "потёртости"];
                const fakeDefect = fakeDefects[Math.floor(Math.random() * fakeDefects.length)];
                damageText = `обнаруживаете дефект: ${fakeDefect}`;
            }
        }
        
        const text = `${beginningPhrase} Вы ${damageText}`;
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Повреждения',
            text: text,
            icon: '⚠️',
            category: 'damage',
            isTruthful: isTruthful
        };
    } else {
        // РЕЖИМ ТЕСТЕРА
        let text;
        
        if (isTruthful) {
            if (hasDefects) {
                text = `Дефекты: ${item.defects.join(', ')}`;
            } else {
                text = "Дефекты: отсутствуют";
            }
        } else {
            if (hasDefects) {
                text = "Дефекты: отсутствуют (ложь)";
            } else {
                text = "Дефекты: обнаружены мелкие повреждения (ложь)";
            }
        }
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Повреждения',
            text: text,
            icon: '⚠️',
            category: 'damage',
            isTruthful: isTruthful
        };
    }
}


function generateStyleShard(methodId, item, skill) {
    const style = item.dominantStyle;
    if (!style) return null;
    
    const accuracy = {
        loupe: { precision: 0.8, baseReliability: 65 },
        expert: { precision: 0.95, baseReliability: 90 }
    };
    
    const methodAccuracy = accuracy[methodId] || accuracy.loupe;
    const skillBonus = skill * 1;
    
    // Вероятность ложного осколка зависит от навыка
    const falseShardChance = Math.max(0.05, 0.3 - (skill * 0.08));
    const isFalseShard = Math.random() < falseShardChance;
    
    let actualStyle = style;
    let reliability = Math.min(95, methodAccuracy.baseReliability + skillBonus);
    
    // Если осколок ложный, выбираем случайный неправильный стиль
    if (isFalseShard) {
        const allStyles = HISTORICAL_STYLES.filter(s => 
            s.categories.includes(item.category) && s.name !== style.name
        );
        if (allStyles.length > 0) {
            actualStyle = allStyles[Math.floor(Math.random() * allStyles.length)];
            reliability = Math.max(20, reliability - 40);
        }
    }
    
    const styleClues = {
        loupe: [
            `черты стиля "${actualStyle.name}"`,
            `стилистические особенности ${actualStyle.name}`,
            `детали, характерные для ${actualStyle.name}`
        ],
        expert: [
            `ярко выраженный ${actualStyle.name}`,
            `стиль ${actualStyle.name}`,
            `характерные признаки ${actualStyle.name}`
        ]
    };
    
    const clues = styleClues[methodId] || [`Стиль: ${actualStyle.name}`];
    let text = clues[Math.floor(Math.random() * clues.length)];
    
    // ДЛЯ РЕЖИМА ИГРОКА ДОБАВЛЯЕМ ВВОДНУЮ ФРАЗУ ДЛЯ ЛУПЫ
    if (!gameState.isTesterMode && methodId === 'loupe') {
        const loupeUses = item.loupeUses || 1;
        let beginningPhrase;
        
        if (loupeUses === 1) {
            beginningPhrase = "Под лупой Вы замечаете, что";
        } else if (loupeUses === 2) {
            beginningPhrase = "При более детальном рассмотрении через лупу";
        } else {
            beginningPhrase = "Максимально приблизив лупу, Вы видите, что";
        }
        
        text = `${beginningPhrase} ${text}`;
    }

    return {
        method: methodId,
        reliability: Math.round(reliability),
        type: 'Стиль',
        text: text,
        icon: actualStyle.icons[item.category] || '🎨',
        category: 'style',
        styleName: actualStyle.name,
        styleEra: actualStyle.eras[0],
        isFalseShard: isFalseShard,
        correctStyle: style.name,
        isTruthful: !isFalseShard
    };
}


function generateIndividualFact(factType, item, isTruthful, reliability, isPlayerMode = false, visualUses = 0) {
    // Базовые факты остаются как были, но адаптируем для новой системы
    const result = (() => {
        switch (factType) {
            case 'age':
                return generateAgeFact(item, isTruthful, reliability, isPlayerMode, visualUses);
            case 'marks':
                return generateMarksFact(item, isTruthful, reliability, isPlayerMode, visualUses);
            case 'condition':
                return generateConditionFact(item, isTruthful, reliability, isPlayerMode, visualUses);
            default:
                return {
                    type: 'unknown',
                        text: 'Неизвестный факт',
                        reliability: 50,
                        isTruthful: false
                };
        }
    })();
    
    // Добавляем флаг isConfused если его нет
    if (result.isConfused === undefined) {
        result.isConfused = false;
    }
    
    return result;
}



// ==============================================
// 3. ФУНКЦИЯ ГЕНЕРАЦИИ ОСКОЛКА "ТЕСТИРОВАНИЕ"
// ==============================================

function generateInternetFact(factType, item, isTruthful, reliability, skill, isPlayerMode) {
    switch (factType) {
        case 'style':
            return generateInternetStyleFact(item, isTruthful, reliability, skill, isPlayerMode);
        case 'price':
            return generateInternetPriceFact(item, isTruthful, reliability, skill, isPlayerMode);
        case 'authenticity':
            return generateInternetAuthenticityFact(item, isTruthful, reliability, skill, isPlayerMode);
        default:
            return {
                type: 'unknown',
                    text: 'Неизвестная информация',
                    reliability: 50,
                    isTruthful: false,
                    isConfused: false
            };
    }
}

function generateInternetStyleFact(item, isTruthful, reliability, skill, isPlayerMode) {
    const style = item.dominantStyle;
    const actualStyleName = style ? style.name : "неопределенный стиль";
    
    // Определяем тип ложности: 50% инверсия, 50% много мнений (только для ложных фактов)
    let isConfused = false;
    let finalStyleName = actualStyleName;
    
    if (!isTruthful) {
        if (Math.random() < 0.5) {
            // Инверсия: выбираем случайный неправильный стиль
            const allStyles = HISTORICAL_STYLES.filter(s =>
                s.categories.includes(item.category) && s.name !== actualStyleName
            );
            if (allStyles.length > 0) {
                const randomStyle = allStyles[Math.floor(Math.random() * allStyles.length)];
                finalStyleName = randomStyle.name;
            }
        } else {
            // Много мнений
            isConfused = true;
        }
    }
    
    let text;
    if (isPlayerMode) {
        if (isConfused) {
            text = "интернет не может прийти к единому мнению о стиле этого предмета";
        } else {
            text = `предмет выполнен в стиле "${finalStyleName}"`;
        }
    } else {
        if (isConfused) {
            text = `Стиль: множество противоречивых мнений (реальный: ${actualStyleName})`;
        } else if (isTruthful) {
            text = `Стиль: ${finalStyleName}`;
        } else {
            text = `Стиль: ${finalStyleName} (ложь, реальный: ${actualStyleName})`;
        }
    }
    
    return {
        type: 'style',
        text: text,
        reliability: Math.round(reliability),
        isTruthful: isTruthful && !isConfused,
        isConfused: isConfused,
        actualStyle: actualStyleName,
        reportedStyle: finalStyleName
    };
}

function generateInternetPriceFact(item, isTruthful, reliability, skill, isPlayerMode) {
    // Идеальная цена без дефектов и реставрации
    const idealPrice = item.idealValue || item.basePrice || 1000;
    
    // Диапазон зависит от достоверности: чем выше достоверность, тем уже диапазон
    const maxRangePercent = 50; // Максимальный диапазон ±50%
    const minRangePercent = 5; // Минимальный диапазон ±5%
    
    // Сужаем диапазон с увеличением достоверности
    const rangePercent = maxRangePercent - ((reliability - 40) / 60) * (maxRangePercent - minRangePercent);
    
    let lowerPrice, upperPrice;
    
    if (isTruthful) {
        // Правдивый факт: диапазон вокруг реальной идеальной цены
        const range = idealPrice * (rangePercent / 100);
        lowerPrice = Math.max(0, Math.round(idealPrice - range));
        upperPrice = Math.round(idealPrice + range);
    } else {
        // Ложный факт: смещаем диапазон или делаем "много мнений"
        if (Math.random() < 0.5) {
            // Инверсия: значительно смещаем цену
            const shiftFactor = 0.5 + Math.random(); // 0.5 - 1.5
            const shiftedPrice = Math.round(idealPrice * shiftFactor);
            const range = shiftedPrice * (rangePercent * 1.5 / 100); // Шире диапазон
            lowerPrice = Math.max(0, Math.round(shiftedPrice - range));
            upperPrice = Math.round(shiftedPrice + range);
        } else {
            // Много мнений
            return {
                type: 'price',
                text: isPlayerMode ?
                    "про ценность этого предмета в идеальном сохране мнения совершенно противоположные" :
                    `Цена: огромный разброс мнений от ${formatMoney(Math.round(idealPrice * 0.2))} до ${formatMoney(Math.round(idealPrice * 5))}`,
                reliability: Math.round(reliability),
                isTruthful: false,
                isConfused: true,
                actualPrice: idealPrice
            };
        }
    }
    
    const text = isPlayerMode ?
        `в идеальном состоянии такой предмет стоит от ${formatMoney(lowerPrice)} до ${formatMoney(upperPrice)}` :
        `Цена в идеале: ${formatMoney(lowerPrice)} - ${formatMoney(upperPrice)}`;
    
    return {
        type: 'price',
        text: text,
        reliability: Math.round(reliability),
        isTruthful: isTruthful,
        isConfused: false,
        actualPrice: idealPrice,
        reportedLower: lowerPrice,
        reportedUpper: upperPrice
    };
}

function generateInternetAuthenticityFact(item, isTruthful, reliability, skill, isPlayerMode) {
    const isAuthentic = item.authentic;
    const actualStatus = isAuthentic ? "подлинник" : "подделка";
    
    // Определяем тип ложности
    let isConfused = false;
    let reportedStatus = actualStatus;
    
    if (!isTruthful) {
        if (Math.random() < 0.5) {
            // Инверсия
            reportedStatus = isAuthentic ? "подделка" : "подлинник";
        } else {
            // Много мнений
            isConfused = true;
        }
    }
    
    let text;
    if (isPlayerMode) {
        if (isConfused) {
            text = "эксперты спорят о подлинности, единого мнения нет";
        } else {
            text = `предмет считается ${reportedStatus === "подлинник" ? "подлинным" : "подделкой"}`;
        }
    } else {
        if (isConfused) {
            text = `Подлинность: спорно (реально: ${actualStatus})`;
        } else if (isTruthful) {
            text = `Подлинность: ${reportedStatus}`;
        } else {
            text = `Подлинность: ${reportedStatus} (ложь, реально: ${actualStatus})`;
        }
    }
    
    return {
        type: 'authenticity',
        text: text,
        reliability: Math.round(reliability),
        isTruthful: isTruthful && !isConfused,
        isConfused: isConfused,
        actualAuthentic: isAuthentic,
        reportedAuthentic: reportedStatus === "подлинник"
    };
}


// B. Факт степени реставрации (ИСПРАВЛЕННЫЙ)
function generateRestorationGradeFact(item, isTruthful, reliability, isPlayerMode = false) {
  const restorationGrades = {
    professional: "профессиональная реставрация",
    quality: "качественная реставрация",
    medium: "реставрация среднего уровня",
    rough: "грубая реставрация",
    none: "отсутствует"
  };
  
  const actualGrade = item.restoration || 'none';
  
  let text;
  if (isPlayerMode) {
    if (isTruthful) {
      if (actualGrade === 'none') {
        const phrases = UV_ANALYSIS.PLAYER_MODE_PHRASES.restoration_absence;
        text = phrases[Math.floor(Math.random() * phrases.length)];
      } else {
        const gradePhrases = UV_ANALYSIS.PLAYER_MODE_PHRASES.restoration_grade[actualGrade];
        if (gradePhrases) {
          text = gradePhrases[Math.floor(Math.random() * gradePhrases.length)];
        } else {
          text = "присутствует реставрация";
        }
      }
    } else {
      // ЛОЖНЫЙ ФАКТ для режима игрока
      if (actualGrade === 'none') {
        // На самом деле нет реставрации - показываем, что есть
        const fakeGrades = ['professional', 'quality', 'medium', 'rough'];
        const fakeGrade = fakeGrades[Math.floor(Math.random() * fakeGrades.length)];
        const gradePhrases = UV_ANALYSIS.PLAYER_MODE_PHRASES.restoration_grade[fakeGrade];
        if (gradePhrases) {
          text = gradePhrases[Math.floor(Math.random() * gradePhrases.length)];
        } else {
          text = "присутствует реставрация";
        }
      } else {
        // На самом деле есть реставрация - показываем другую степень или отсутствие
        if (Math.random() < 0.5) {
          // Показываем отсутствие
          const phrases = UV_ANALYSIS.PLAYER_MODE_PHRASES.restoration_absence;
          text = phrases[Math.floor(Math.random() * phrases.length)];
        } else {
          // Показываем другую степень
          const fakeGrades = Object.keys(restorationGrades)
            .filter(grade => grade !== actualGrade && grade !== 'none');
          if (fakeGrades.length > 0) {
            const fakeGrade = fakeGrades[Math.floor(Math.random() * fakeGrades.length)];
            const gradePhrases = UV_ANALYSIS.PLAYER_MODE_PHRASES.restoration_grade[fakeGrade];
            if (gradePhrases) {
              text = gradePhrases[Math.floor(Math.random() * gradePhrases.length)];
            } else {
              text = "присутствует реставрация";
            }
          } else {
            const phrases = UV_ANALYSIS.PLAYER_MODE_PHRASES.restoration_presence;
            text = phrases[Math.floor(Math.random() * phrases.length)];
          }
        }
      }
    }
  } else {
    // РЕЖИМ ТЕСТЕРА
    if (isTruthful) {
      text = actualGrade === 'none' ?
        "Реставрация: отсутствует" :
        `Качество реставрации: ${restorationGrades[actualGrade]}`;
    } else {
      // Ложный факт - случайная неправильная степень
      const falseGrades = Object.keys(restorationGrades)
        .filter(grade => grade !== actualGrade);
      const falseGrade = falseGrades[Math.floor(Math.random() * falseGrades.length)];
      text = `Качество реставрации: ${restorationGrades[falseGrade]}`;
    }
  }
  
  return {
    type: 'restoration_grade',
    text: text,
    reliability: Math.round(reliability),
    isTruthful: isTruthful
  };
}

// C. Факт возраста оригинала (ИСПРАВЛЕННЫЙ)
function generateUVOriginalAgeFact(item, isTruthful, reliability, skill, isPlayerMode = false) {
    // НОВАЯ ФОРМУЛА: диапазон от 5 до 40 лет в зависимости от достоверности
    // Чем выше достоверность, тем меньше диапазон
    const maxPrecision = 40;  // Максимальный диапазон при reliability=0
    const minPrecision = 5;   // Минимальный диапазон при reliability=100
    
    // Рассчитываем precision на основе reliability
    const precision = Math.round(maxPrecision - (reliability / 100) * (maxPrecision - minPrecision));
    
    let estimatedAge;
    if (isTruthful) {
        // Правдивая оценка - небольшая ошибка
        const error = (Math.random() - 0.5) * 2 * precision;
        estimatedAge = Math.max(0, Math.min(326, Math.round(item.age + error)));
    } else {
        // Ложная оценка - большая ошибка
        const bigError = (Math.random() - 0.5) * 4 * precision;
        estimatedAge = Math.max(0, Math.min(326, Math.round(item.age + bigError)));
        
        // 20% шанс совсем абсурдного возраста
        if (Math.random() < 0.2) {
            estimatedAge = Math.floor(Math.random() * 326); // До 326 лет
        }
    }
    
    if (isPlayerMode) {
        // РЕЖИМ ИГРОКА: просто число, без диапазона и без присказок
        const phrases = [
            "возраст оригинала примерно %age% лет",
            "предмету около %age% лет", 
            "изготовлен примерно %age% лет назад",
            "возраст составляет около %age% лет"
        ];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        const text = phrase.replace('%age%', estimatedAge);
        
        return {
            type: 'age_original',
            text: text,
            reliability: Math.round(reliability),
            isTruthful: isTruthful,
            estimatedAge: estimatedAge,
            agePrecision: precision  // Сохраняем для режима тестера
        };
    } else {
        // РЕЖИМ ТЕСТЕРА: с диапазоном
        const text = `Возраст оригинала: ${estimatedAge}±${precision} лет`;
        
        return {
            type: 'age_original',
            text: text,
            reliability: Math.round(reliability),
            isTruthful: isTruthful,
            estimatedAge: estimatedAge,
            agePrecision: precision
        };
    }
}

// D. Факт возраста реставрации (ПОЛНЫЙ КОД с ложными фактами)
function generateUVRestorationAgeFact(item, isTruthful, reliability, skill, isPlayerMode = false) {
    // Если реставрации нет - генерируем факт о её отсутствии
    if (!item.restoration || item.restoration === 'none') {
        return generateRestorationPresenceFact(item, isTruthful, reliability, isPlayerMode);
    }
    
    // НОВАЯ ФОРМУЛА для возраста реставрации
    const maxPrecision = 30;  // Максимальный диапазон
    const minPrecision = 3;   // Минимальный диапазон
    
    const precision = Math.round(maxPrecision - (reliability / 100) * (maxPrecision - minPrecision));
    
    // Реставрация всегда моложе оригинала (0-100 лет, но не старше самого предмета)
    const maxRestorationAge = Math.min(100, Math.max(1, item.age - 10));
    const actualRestorationAge = Math.floor(Math.random() * maxRestorationAge);
    
    let estimatedAge;
    if (isTruthful) {
        const error = (Math.random() - 0.5) * 2 * precision;
        estimatedAge = Math.max(0, Math.min(maxRestorationAge, Math.round(actualRestorationAge + error)));
    } else {
        // Ложная оценка
        const bigError = (Math.random() - 0.5) * 4 * precision;
        estimatedAge = Math.max(0, Math.min(100, Math.round(actualRestorationAge + bigError)));
        
        // 30% шанс совсем абсурдного возраста
        if (Math.random() < 0.3) {
            estimatedAge = Math.floor(Math.random() * 150); // До 150 лет
        }
    }
    
    if (isPlayerMode) {
        // РЕЖИМ ИГРОКА: просто число, без намеков
        const phrases = [
            "реставрация выполнена примерно %age% лет назад",
            "восстановительные работы проведены около %age% лет назад",
            "починке примерно %age% лет",
            "реставрации около %age% лет"
        ];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        const text = phrase.replace('%age%', estimatedAge);
        
        return {
            type: 'age_restoration',
            text: text,
            reliability: Math.round(reliability),
            isTruthful: isTruthful,
            estimatedAge: estimatedAge,
            agePrecision: precision,
            actualRestorationAge: actualRestorationAge
        };
    } else {
        // РЕЖИМ ТЕСТЕРА: с диапазоном
        const text = `Возраст реставрации: ${estimatedAge}±${precision} лет назад`;
        
        return {
            type: 'age_restoration',
            text: text,
            reliability: Math.round(reliability),
            isTruthful: isTruthful,
            estimatedAge: estimatedAge,
            agePrecision: precision,
            actualRestorationAge: actualRestorationAge
        };
    }
}


function generateUVShard(item, skill) {
    const baseReliability = 50 + (skill * 1);
    const isPlayerMode = !gameState.isTesterMode;
    
    // УДАЛИТЬ ВЕСЬ ЭТОТ БЛОК (ИСПРАВЛЕНИЯ 1-4 в вашем коде):
    /* 
    if (item.uvUses === undefined) item.uvUses = 0;
    const currentUses = item.uvUses;
    const useNumber = currentUses + 1;
    ... 
    item.uvUses = useNumber;
    */
    
    // ЗАМЕНИТЬ НА ОДНУ СТРОКУ:
    const useNumber = item.uvUses || 1;
    
    // Определение количества фактов (оставляем логику)
    let targetFactCount;
    if (useNumber === 1) targetFactCount = 1;
    else if (useNumber === 2) targetFactCount = 2;
    else targetFactCount = 3;
    
    // ... остальной код генерации фактов

  
  // Генерируем ВСЕ возможные факты
  const allPossibleFacts = [];
  
  // Факт 1: Наличие реставрации
  const reliability1 = Math.min(95, baseReliability + (Math.random() * 20 - 10));
  const isTruthful1 = Math.random() < (reliability1 / 100);
  allPossibleFacts.push({
    fact: generateRestorationPresenceFact(item, isTruthful1, reliability1, isPlayerMode),
    type: 'presence',
    reliability: reliability1,
    isTruthful: isTruthful1
  });
  
  // Факт 2: Степень реставрации (если есть реставрация)
  const hasRestoration = item.restoration && item.restoration !== 'none';
  if (hasRestoration) {
    const reliability2 = Math.min(95, baseReliability + (Math.random() * 20 - 10));
    const isTruthful2 = Math.random() < (reliability2 / 100);
    allPossibleFacts.push({
      fact: generateRestorationGradeFact(item, isTruthful2, reliability2, isPlayerMode),
      type: 'grade',
      reliability: reliability2,
      isTruthful: isTruthful2
    });
  }
  
  // Факт 3: Возраст оригинала
  const reliability3 = Math.min(95, baseReliability + (Math.random() * 20 - 10));
  const isTruthful3 = Math.random() < (reliability3 / 100);
  allPossibleFacts.push({
    fact: generateUVOriginalAgeFact(item, isTruthful3, reliability3, skill, isPlayerMode),
    type: 'age_original',
    reliability: reliability3,
    isTruthful: isTruthful3
  });
  
  // Факт 4: Возраст реставрации (только если есть реставрация)
  if (hasRestoration) {
    const reliability4 = Math.min(95, baseReliability + (Math.random() * 20 - 10));
    const isTruthful4 = Math.random() < (reliability4 / 100);
    allPossibleFacts.push({
      fact: generateUVRestorationAgeFact(item, isTruthful4, reliability4, skill, isPlayerMode),
      type: 'age_restoration',
      reliability: reliability4,
      isTruthful: isTruthful4
    });
  }
  
  // 🔴 ИСПРАВЛЕНИЕ 5: Выбираем случайные факты без повторов
  const selectedFactsData = [];
  const selectedIndices = new Set();
  
  // Сначала перемешиваем массив
  const shuffledFacts = [...allPossibleFacts].sort(() => Math.random() - 0.5);
  
  // Берём нужное количество фактов
  for (let i = 0; i < Math.min(targetFactCount, shuffledFacts.length); i++) {
    selectedFactsData.push(shuffledFacts[i]);
  }
  
  // Извлекаем сами факты
  const selectedFacts = selectedFactsData.map(sf => sf.fact);
  
  // Средняя достоверность
  const overallReliability = selectedFactsData.length > 0 ?
    Math.round(selectedFactsData.reduce((sum, sf) => sum + sf.reliability, 0) / selectedFactsData.length) :
    50;
  
  // Формируем текст осколка
  let fullText;
  if (isPlayerMode) {
    // 🔴 ИСПРАВЛЕНИЕ 6: Глобальная присказка номера использования
    let beginningPhrase;
    if (useNumber === 1) {
      beginningPhrase = "Вы бегло светите УФ-лампой на предмет";
    } else if (useNumber === 2) {
      beginningPhrase = "Более внимательное использование УФ-лампы выявляет";
    } else {
      beginningPhrase = "Тщательное исследование под УФ-лампой показывает";
    }
    
    // 🔴 ИСПРАВЛЕНИЕ 7: Присказка достоверности для каждого факта
    const factTexts = selectedFacts.map(fact => {
      const reliabilityPhrase = getReliabilityPhrase(fact.reliability);
      return `• ${reliabilityPhrase} ${fact.text}`;
    }).join('\n');
    
    fullText = `${beginningPhrase}:\n${factTexts}`;
  } else {
    // РЕЖИМ ТЕСТЕРА
    const factTexts = selectedFacts.map(fact => {
      const indicator = fact.isTruthful ? '✅' : '❌';
      return `• ${indicator} ${fact.text} (${fact.reliability}%)`;
    }).join('\n');
    
    fullText = `💡 УФ-анализ (использовано: ${useNumber} раз):\n${factTexts}`;
  }
  
  return {
    method: 'uv',
    reliability: overallReliability,
    type: 'УФ-анализ',
    text: fullText,
    icon: '💡',
    category: 'restoration',
    isTruthful: selectedFactsData.every(sf => sf.isTruthful),
    facts: selectedFacts,
    uvData: {
      baseReliability: baseReliability,
      factCount: selectedFacts.length,
      uses: useNumber
    }
  };
}

function renderVisualShardWithFacts(shard) {
    const backgroundColor = 'rgba(100, 150, 200, 0.1)';
    const borderColor = 'rgba(80, 120, 180, 0.4)';
    
    // Для режима игрока
    if (!gameState.isTesterMode) {
        return `
            <div class="border rounded-lg p-4 text-sm shadow-sm transition-all duration-300 hover:shadow-md" 
                 style="background: ${backgroundColor}; border-color: ${borderColor}">
                <div class="text-gray-700 whitespace-pre-line">${shard.text}</div>
                ${shard.visualData ? `
                    <div class="mt-2 text-xs text-gray-500">
                        ${shard.visualData.factCount} факт(а)
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    // РЕЖИМ ТЕСТЕРА - детальная информация
    let factsHTML = '';
    
    if (shard.facts && shard.facts.length > 0) {
        factsHTML = shard.facts.map(fact => {
            let indicator, borderColor, bgColor;
            
            if (fact.isConfused) {
                indicator = '🤷‍♂️';
                borderColor = '#f59e0b'; // Оранжевый для "не понятно"
                bgColor = 'rgba(245, 158, 11, 0.1)';
            } else if (fact.isTruthful) {
                indicator = '✅';
                borderColor = '#10b981'; // Зеленый для правды
                bgColor = 'rgba(16, 185, 129, 0.1)';
            } else {
                indicator = '❌';
                borderColor = '#ef4444'; // Красный для лжи
                bgColor = 'rgba(239, 68, 68, 0.1)';
            }
            
            return `
                <div class="flex items-start gap-2 p-2 rounded border" 
                     style="background: ${bgColor}; border-color: ${borderColor}">
                    <div class="flex-shrink-0 text-sm mt-0.5">${indicator}</div>
                    <div class="flex-1">
                        <div class="text-gray-700">${fact.text}</div>
                        <div class="flex items-center gap-2 mt-1">
                            <div class="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-500" 
                                     style="width: ${fact.reliability}%; background: ${borderColor}"></div>
                            </div>
                            <div class="text-xs ${fact.isConfused ? 'text-yellow-600' : fact.isTruthful ? 'text-green-600' : 'text-red-600'}">
                                ${fact.reliability}%
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    return `
        <div class="border rounded-lg p-4 text-sm shadow-sm transition-all duration-300 hover:shadow-md" 
             style="background: ${backgroundColor}; border-color: ${borderColor}">
            <div class="flex items-center gap-3 mb-3">
                <div class="text-2xl">${shard.icon}</div>
                <div class="flex-1">
                    <div class="flex justify-between items-center">
                        <div class="font-semibold text-gray-800">${shard.type}</div>
                        <div class="flex items-center gap-2">
                            <div class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                                ${shard.visualData?.uses || 1}/${shard.visualData?.factCount || 1}
                            </div>
                            <div class="text-xs px-2 py-1 rounded bg-white border" style="border-color: ${borderColor}">
                                ${shard.reliability}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Отдельные факты -->
            <div class="space-y-2">
                ${factsHTML}
            </div>
            
            <div class="flex items-center gap-2 mt-3 pt-2 border-t border-gray-200">
                <div class="text-xs text-gray-500">Метод: ${shard.method}</div>
                <div class="text-xs text-blue-500">${shard.visualData?.factCount || 1} факт(а)</div>
                ${shard.visualData?.truthCount !== undefined ? 
                    `<div class="text-xs ${shard.visualData.truthCount > 0 ? 'text-green-500' : 'text-red-500'}">
                        Правда: ${shard.visualData.truthCount}/${shard.visualData.factCount}
                    </div>` : ''}
            </div>
        </div>
    `;
}

// ==============================================
// УЛУЧШЕННЫЕ ФУНКЦИИ ГЕНЕРАЦИИ ФАКТОВ ДЛЯ ВЗГЛЯДА
// ==============================================

function generateAgeFact(item, isTruthful, reliability, isPlayerMode = false, visualUses = 1) {
    const category = item.category || 'porcelain';
    
    // Определяем возраст для анализа (для подделок - фейковый возраст)
    let ageToAnalyze;
    if (item.authentic) {
        ageToAnalyze = item.age;
    } else {
        // Подделка воспринимается по своему "фейковому" возрасту
        ageToAnalyze = item.fakeAge || item.age || 50;
    }
    
    // Определяем период по возрасту
    let period;
    if (ageToAnalyze <= 30) period = 'modern';
    else if (ageToAnalyze <= 50) period = 'soviet';
    else if (ageToAnalyze <= 100) period = 'prewar';
    else if (ageToAnalyze <= 200) period = 'antique';
    else period = 'ancient';
    
    if (isPlayerMode) {
        // РЕЖИМ ИГРОКА: атмосферные фразы по категории
        let phrases;
        
        if (isTruthful) {
            // Правдивый факт — берём правильный период
            phrases = VISUAL_AGE_PHRASES[category]?.[period] || 
                      VISUAL_AGE_PHRASES.porcelain[period];
        } else {
            // Ложный факт — берём случайный ДРУГОЙ период
            const allPeriods = ['modern', 'soviet', 'prewar', 'antique', 'ancient'];
            const otherPeriods = allPeriods.filter(p => p !== period);
            const falsePeriod = otherPeriods[Math.floor(Math.random() * otherPeriods.length)];
            phrases = VISUAL_AGE_PHRASES[category]?.[falsePeriod] || 
                      VISUAL_AGE_PHRASES.porcelain[falsePeriod];
        }
        
        const selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        
        return {
            type: 'age',
            text: selectedPhrase,
            reliability: Math.round(reliability),
            isTruthful: isTruthful,
            isStylistic: true
        };
    } else {
        // РЕЖИМ ТЕСТЕРА: техническая информация
        const styleAge = generateStyleBasedAge(item);
        let ageEstimate = isTruthful ? styleAge.trueAge : styleAge.fakeAge;
        const agePrecision = isTruthful ? 25 : 40;
        
        const truthIndicator = isTruthful ? '✅' : '❌';
        
        return {
            type: 'age',
            text: `${truthIndicator} Возраст: ${ageEstimate}±${agePrecision} лет (${period})`,
            reliability: Math.round(reliability),
            isTruthful: isTruthful
        };
    }
}

function generateMarksFact(item, isTruthful, reliability, isPlayerMode = false, visualUses = 1) {
    const category = item.category || 'porcelain';
    const hasMarks = item.marks && item.marks.length > 0;
    
    // Определяем, что мы "видим" (с учётом правдивости)
    let marksPresent;
    if (isTruthful) {
        marksPresent = hasMarks;
    } else {
        marksPresent = !hasMarks; // Инверсия для лжи
    }
    
    if (isPlayerMode) {
        // РЕЖИМ ИГРОКА: атмосферные фразы по категории
        const phraseType = marksPresent ? 'present' : 'absent';
        const phrases = VISUAL_MARKS_PHRASES[category]?.[phraseType] || 
                        VISUAL_MARKS_PHRASES.porcelain[phraseType];
        
        const selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        
        return {
            type: 'marks',
            text: selectedPhrase,
            reliability: Math.round(reliability),
            isTruthful: isTruthful
        };
    } else {
        // РЕЖИМ ТЕСТЕРА
        const truthIndicator = isTruthful ? '✅' : '❌';
        const marksText = marksPresent ? 
            `Клейма: ${item.marks?.join(', ') || 'присутствуют'}` : 
            "Клейма: отсутствуют";
        
        return {
            type: 'marks',
            text: `${truthIndicator} ${marksText}`,
            reliability: Math.round(reliability),
            isTruthful: isTruthful
        };
    }
}

function generateConditionFact(item, isTruthful, reliability, isPlayerMode = false, visualUses = 1) {
    const category = item.category || 'porcelain';
    
    // Определяем реальный уровень состояния
    let realConditionLevel = 'excellent';
    if (item.defects && item.defects.length > 0) {
        const defectCount = item.defects.length;
        const hasCritical = item.defects.some(d => 
            d.toLowerCase().includes('критич') || 
            d.toLowerCase().includes('серьезн') ||
            d.toLowerCase().includes('разрушен')
        );
        const hasSevere = item.defects.some(d => 
            d.toLowerCase().includes('сильн') || 
            d.toLowerCase().includes('значительн') ||
            d.toLowerCase().includes('глубок')
        );
        
        if (hasCritical || defectCount >= 5) realConditionLevel = 'critical';
        else if (hasSevere || defectCount >= 3) realConditionLevel = 'poor';
        else if (defectCount >= 2) realConditionLevel = 'medium';
        else realConditionLevel = 'good';
    }
    
    // Определяем, какой уровень показываем (с учётом правдивости)
    let displayConditionLevel;
    if (isTruthful) {
        displayConditionLevel = realConditionLevel;
    } else {
        // Ложный факт — показываем другой уровень
        const allLevels = ['excellent', 'good', 'medium', 'poor', 'critical'];
        const otherLevels = allLevels.filter(l => l !== realConditionLevel);
        displayConditionLevel = otherLevels[Math.floor(Math.random() * otherLevels.length)];
    }
    
    if (isPlayerMode) {
        // РЕЖИМ ИГРОКА: атмосферные фразы по категории
        const phrases = VISUAL_CONDITION_PHRASES[category]?.[displayConditionLevel] || 
                        VISUAL_CONDITION_PHRASES.porcelain[displayConditionLevel];
        
        const selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        
        return {
            type: 'condition',
            text: selectedPhrase,
            reliability: Math.round(reliability),
            isTruthful: isTruthful
        };
    } else {
        // РЕЖИМ ТЕСТЕРА
        const truthIndicator = isTruthful ? '✅' : '❌';
        const conditionNames = {
            excellent: 'Отличное',
            good: 'Хорошее',
            medium: 'Среднее',
            poor: 'Плохое',
            critical: 'Критическое'
        };
        
        return {
            type: 'condition',
            text: `${truthIndicator} Состояние: ${conditionNames[displayConditionLevel]}`,
            reliability: Math.round(reliability),
            isTruthful: isTruthful
        };
    }
}

function generateConfusedFact(factType, item, reliability) {
    const category = item.category || 'porcelain';
    
    // Берём атмосферную фразу из категории
    const confusionPhrases = VISUAL_CONFUSION_PHRASES[category]?.[factType] || 
                             VISUAL_CONFUSION_PHRASES.porcelain[factType] ||
                             ["не могу определить, требуется дополнительное исследование"];
    
    const selectedPhrase = confusionPhrases[Math.floor(Math.random() * confusionPhrases.length)];
    
    return {
        type: factType,
        text: selectedPhrase,
        reliability: Math.round(reliability),
        isTruthful: false,
        isConfused: true
    };
}








function useExpertiseMethod(methodId) {
    const item = currentExpertise.item;
    
    // Инициализируем стоимости методов если их нет
    if (!item.expertiseMethodCosts) {
        item.expertiseMethodCosts = { ...BASE_EXPERTISE_COSTS };
    }
    
    // Проверка доступности в режиме игрока
    if (!gameState.isTesterMode) {
        const methodConfig = METHOD_LEVELS[methodId];
        
        // Для методов из списка проверяем уровни
        if (methodConfig) {
            const skillLevel = gameState.skills[item.category] || 0;
            
            // Проверяем минимальный уровень
            if (skillLevel < methodConfig.first) {
                showNotification(`❌ Недостаточный уровень навыка для ${methodId === 'visual' ? 'визуального осмотра' : methodId === 'loupe' ? 'лупы' : methodId === 'internet' ? 'интернет-поиска' : methodId === 'testing' ? 'тестирования' : methodId === 'uv' ? 'УФ-лампы' : 'эксперта'}! Требуется ${methodConfig.first} уровень.`, 'error');
                return;
            }
            
            // Проверяем текущее количество использований
            const currentUses = item[`${methodId}Uses`] || 0;
            
            // Определяем максимальное количество использований по уровню
            let maxUses = 0;
            if (skillLevel >= methodConfig.third) maxUses = 3;
            else if (skillLevel >= methodConfig.second) maxUses = 2;
            else if (skillLevel >= methodConfig.first) maxUses = 1;
            
            if (currentUses >= maxUses) {
                let message;
                if (maxUses === 1) {
                    message = `Лимит использований для ${skillLevel} уровня: 1 использование`;
                } else if (maxUses === 2) {
                    message = `Лимит использований для ${skillLevel} уровня: 2 использования (${methodConfig.third} уровень для 3-го)`;
                } else {
                    message = 'Лимит использований исчерпан';
                }
                showNotification(`❌ ${methodId === 'visual' ? 'Визуальный осмотр' : methodId === 'loupe' ? 'Лупа' : methodId === 'internet' ? 'Интернет-поиск' : methodId === 'testing' ? 'Тестирование' : methodId === 'uv' ? 'УФ-лампа' : 'Эксперт'}: ${message}`, 'error');
                return;
            }
        }
    }
    
    // Получаем текущую стоимость метода для этого предмета
    let currentCost = item.expertiseMethodCosts[methodId];
    
    if (gameState.attention < currentCost) {
        showNotification(`Недостаточно внимания! Нужно ${currentCost}⚡`, 'error');
        return;
    }
    
    // Списание внимания
    gameState.attention -= currentCost;
    currentExpertise.item.expertiseCost = (currentExpertise.item.expertiseCost || 0) + currentCost;
    
    // Увеличиваем стоимость для следующего использования на этом предмете
    item.expertiseMethodCosts[methodId] = currentCost * 2;
    
    // Увеличиваем счетчик использований для метода
    if (METHOD_LEVELS[methodId]) {
        if (!item[`${methodId}Uses`]) item[`${methodId}Uses`] = 0;
        item[`${methodId}Uses`]++;
    }
    
    const skill = gameState.skills[item.category] || 0;
    
    // Генерация осколка
    let shard;
    
    if (methodId === 'internet') {
        shard = generateInternetShard(item, skill);
    }
    else if (methodId === 'testing') {
        shard = generateTestingShard(item, skill);
    }
    else if (methodId === 'uv') {
        shard = generateUVShard(item, skill);
    }
    else if (methodId === 'loupe') {
        shard = generateLoupeShardNew(item, skill);
    }
    
    // В функции useExpertiseMethod замените блок для 'expert':
else if (methodId === 'expert') {
    shard = generateExpertShard(item, skill);
}
    else if (methodId === 'visual') {
        shard = generateVisualShard(item, skill);
    
    }
    else {
        shard = generateExpertiseShard(methodId, item, skill);
    }
    
    // Добавляем осколок В НАЧАЛО массива
    if (!item.expertiseShards) item.expertiseShards = [];
    item.expertiseShards.unshift(shard);
    
    // === ЗОЛОТЫЕ ОСКОЛКИ ===
const goldenShard = tryGenerateGoldenShard(shard, item, methodId);
if (goldenShard) {
    if (!item.goldenShards) item.goldenShards = [];
    item.goldenShards.push(goldenShard);
    showNotification('🌟 Обнаружена важная деталь!', 'success');
    renderGoldenShards(item);
}
// === КОНЕЦ ЗОЛОТЫХ ОСКОЛКОВ ===
    
    // ОБНОВЛЯЕМ КОМПАКТНЫЙ ИНДИКАТОР ВНИМАНИЯ
    updateExpertiseAttentionDisplay();
    
    // Перерисовываем методы (стоимости изменились)
    renderExpertiseModal();
    saveGame();
}

// ==============================================
// УЛУЧШЕННЫЕ ФУНКЦИИ ГЕНЕРАЦИИ ДЛЯ ЛУПЫ
// ==============================================

function generateLoupeMarksShardFirstLook(item, skill) {
    const category = item.category || 'porcelain';
    const baseReliability = 70 + (skill * 1);
    const reliability = Math.min(90, baseReliability);
    const isTruthful = Math.random() < (reliability / 100);
    const isPlayerMode = !gameState.isTesterMode;
    const hasMarks = item.marks && item.marks.length > 0;
    
    if (isPlayerMode) {
        let text;
        const phrases = LOUPE_MARKS_PHRASES[category] || LOUPE_MARKS_PHRASES.porcelain;
        
        if (isTruthful) {
            if (hasMarks) {
                const phraseList = phrases.firstLookFound;
                text = phraseList[Math.floor(Math.random() * phraseList.length)]
                    .replace('%marks%', item.marks.join(', '));
            } else {
                const phraseList = phrases.firstLookNotFound;
                text = phraseList[Math.floor(Math.random() * phraseList.length)];
            }
        } else {
            // ЛОЖНЫЕ КЛЕЙМА
            const categoryMarksData = MARKS_BY_PERIOD[category] || [];
            if (categoryMarksData.length > 0 && Math.random() < 0.7) {
                const randomMark = categoryMarksData[Math.floor(Math.random() * categoryMarksData.length)];
                const phraseList = phrases.firstLookFound;
                text = phraseList[Math.floor(Math.random() * phraseList.length)]
                    .replace('%marks%', randomMark.mark);
            } else {
                const phraseList = phrases.firstLookNotFound;
                text = phraseList[Math.floor(Math.random() * phraseList.length)];
            }
        }
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Клейма (первый взгляд)',
            text: text,
            icon: '🏷️',
            category: 'marks',
            isTruthful: isTruthful,
            isFirstLook: true
        };
    } else {
        // РЕЖИМ ТЕСТЕРА
        let text;
        const truthIndicator = isTruthful ? '✅' : '❌';
        
        if (hasMarks) {
            text = `${truthIndicator} Первое: клейма: ${item.marks.join(', ')}`;
        } else {
            text = `${truthIndicator} Первое: клейма отсутствуют`;
        }
        
        if (!isTruthful) text += ' (ложь)';
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Клейма',
            text: text,
            icon: '🏷️',
            category: 'marks',
            isTruthful: isTruthful,
            isFirstLook: true
        };
    }
}

function generateLoupeMarksShard(item, skill) {
    const category = item.category || 'porcelain';
    const baseReliability = 75 + (skill * 1);
    const reliability = Math.min(95, baseReliability);
    const isTruthful = Math.random() < (reliability / 100);
    const isPlayerMode = !gameState.isTesterMode;
    const hasMarks = item.marks && item.marks.length > 0;
    const loupeUses = item.loupeUses || 1;
    
    if (isPlayerMode) {
        // Вступительная фраза
        const beginningPhrases = LOUPE_BEGINNING_PHRASES[category]?.[loupeUses] || 
                                  LOUPE_BEGINNING_PHRASES.porcelain[loupeUses];
        const beginningPhrase = beginningPhrases[Math.floor(Math.random() * beginningPhrases.length)];
        
        const phrases = LOUPE_MARKS_PHRASES[category] || LOUPE_MARKS_PHRASES.porcelain;
        let marksText;
        
        if (isTruthful) {
            if (hasMarks) {
                const phraseList = phrases.found;
                marksText = phraseList[Math.floor(Math.random() * phraseList.length)]
                    .replace('%marks%', item.marks.join(', '));
            } else {
                const phraseList = phrases.notFound;
                marksText = phraseList[Math.floor(Math.random() * phraseList.length)];
            }
        } else {
            // ЛОЖНЫЕ КЛЕЙМА
            const categoryMarksData = MARKS_BY_PERIOD[category] || [];
            if (hasMarks) {
                // Клейма есть, но мы врём
                if (Math.random() < 0.5) {
                    const phraseList = phrases.notFound;
                    marksText = phraseList[Math.floor(Math.random() * phraseList.length)];
                } else if (categoryMarksData.length > 0) {
                    const randomMark = categoryMarksData[Math.floor(Math.random() * categoryMarksData.length)];
                    const phraseList = phrases.found;
                    marksText = phraseList[Math.floor(Math.random() * phraseList.length)]
                        .replace('%marks%', randomMark.mark);
                } else {
                    const phraseList = phrases.notFound;
                    marksText = phraseList[Math.floor(Math.random() * phraseList.length)];
                }
            } else {
                // Клейм нет, но мы придумываем
                if (categoryMarksData.length > 0) {
                    const randomMark = categoryMarksData[Math.floor(Math.random() * categoryMarksData.length)];
                    const phraseList = phrases.found;
                    marksText = phraseList[Math.floor(Math.random() * phraseList.length)]
                        .replace('%marks%', randomMark.mark);
                } else {
                    const phraseList = phrases.notFound;
                    marksText = phraseList[Math.floor(Math.random() * phraseList.length)];
                }
            }
        }
        
        const text = `${beginningPhrase}: ${marksText}`;
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Клейма',
            text: text,
            icon: '🏷️',
            category: 'marks',
            isTruthful: isTruthful
        };
    } else {
        // РЕЖИМ ТЕСТЕРА
        const truthIndicator = isTruthful ? '✅' : '❌';
        let text = hasMarks ? 
            `${truthIndicator} Клейма: ${item.marks.join(', ')}` :
            `${truthIndicator} Клейма: отсутствуют`;
        
        if (!isTruthful) text += ' (ложь)';
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Клейма',
            text: text,
            icon: '🏷️',
            category: 'marks',
            isTruthful: isTruthful
        };
    }
}

function generateLoupeAgeShard(item, skill) {
    const category = item.category || 'porcelain';
    const accuracy = AGE_ESTIMATION_ACCURACY['loupe'];
    const realAge = item.age;
    
    const skillBonus = Math.max(0, skill - 1) * 0.1;
    const precision = Math.round(accuracy.precision * (1 - skillBonus));
    
    const error = (Math.random() - 0.5) * 2 * precision;
    const estimatedAge = Math.max(0, Math.min(326, Math.round(realAge + error)));
    
    const ageDiff = Math.abs(estimatedAge - realAge);
    const accuracyPenalty = (ageDiff / precision) * 20;
    const reliability = Math.max(20, Math.min(95, accuracy.baseReliability - accuracyPenalty + (skill * 1)));
    const isTruthful = Math.random() < (reliability / 100);
    
    // Определяем период по возрасту
    let ageToShow = isTruthful ? estimatedAge : 
        Math.max(0, Math.min(326, estimatedAge + (Math.random() - 0.5) * 100));
    
    let period;
    if (ageToShow <= 30) period = 'modern';
    else if (ageToShow <= 50) period = 'soviet';
    else if (ageToShow <= 100) period = 'prewar';
    else if (ageToShow <= 200) period = 'antique';
    else period = 'ancient';
    
    const isPlayerMode = !gameState.isTesterMode;
    
    if (isPlayerMode) {
        const loupeUses = item.loupeUses || 1;
        
        // Вступительная фраза
        const beginningPhrases = LOUPE_BEGINNING_PHRASES[category]?.[loupeUses] || 
                                  LOUPE_BEGINNING_PHRASES.porcelain[loupeUses];
        const beginningPhrase = beginningPhrases[Math.floor(Math.random() * beginningPhrases.length)];
        
        // Фраза о возрасте
        const agePhrases = LOUPE_AGE_PHRASES[category]?.[period] || 
                           LOUPE_AGE_PHRASES.porcelain[period];
        const agePhrase = agePhrases[Math.floor(Math.random() * agePhrases.length)];
        
        const text = `${beginningPhrase}: ${agePhrase}`;
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Возраст',
            text: text,
            icon: '📅',
            category: 'age',
            estimatedAge: estimatedAge,
            agePrecision: precision,
            isTruthful: isTruthful
        };
    } else {
        // РЕЖИМ ТЕСТЕРА
        const truthIndicator = isTruthful ? '✅' : '❌';
        const ageRange = `${estimatedAge - precision}-${estimatedAge + precision}`;
        const text = `${truthIndicator} Лупа [${category}]: ${estimatedAge}±${precision} лет (${period})`;
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Возраст',
            text: text,
            icon: '📅',
            category: 'age',
            estimatedAge: estimatedAge,
            agePrecision: precision,
            isTruthful: isTruthful
        };
    }
}

function generateLoupeRestorationShard(item, skill) {
    const category = item.category || 'porcelain';
    const baseReliability = 65 + (skill * 1);
    const reliability = Math.min(90, baseReliability);
    const isTruthful = Math.random() < (reliability / 100);
    const isPlayerMode = !gameState.isTesterMode;
    const hasRestoration = item.restoration && item.restoration !== 'none';
    const loupeUses = item.loupeUses || 1;
    
    // Определяем, какую степень реставрации показываем
    let displayRestoration;
    if (isTruthful) {
        displayRestoration = item.restoration || 'none';
    } else {
        // Ложная информация
        const allGrades = ['professional', 'quality', 'medium', 'rough', 'none'];
        const otherGrades = allGrades.filter(g => g !== (item.restoration || 'none'));
        displayRestoration = otherGrades[Math.floor(Math.random() * otherGrades.length)];
    }
    
    if (isPlayerMode) {
        // Вступительная фраза
        const beginningPhrases = LOUPE_BEGINNING_PHRASES[category]?.[loupeUses] || 
                                  LOUPE_BEGINNING_PHRASES.porcelain[loupeUses];
        const beginningPhrase = beginningPhrases[Math.floor(Math.random() * beginningPhrases.length)];
        
        // Фраза о реставрации
        const restPhrases = LOUPE_RESTORATION_PHRASES[category]?.[displayRestoration] || 
                            LOUPE_RESTORATION_PHRASES.porcelain[displayRestoration];
        const restPhrase = restPhrases[Math.floor(Math.random() * restPhrases.length)];
        
        const text = `${beginningPhrase}: ${restPhrase}`;
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Реставрация',
            text: text,
            icon: '🛠️',
            category: 'restoration',
            isTruthful: isTruthful
        };
    } else {
        // РЕЖИМ ТЕСТЕРА
        const truthIndicator = isTruthful ? '✅' : '❌';
        const gradeNames = {
            professional: 'профессиональная',
            quality: 'качественная',
            medium: 'средняя',
            rough: 'грубая',
            none: 'отсутствует'
        };
        
        let text = `${truthIndicator} Реставрация: ${gradeNames[displayRestoration]}`;
        if (!isTruthful) text += ` (реально: ${gradeNames[item.restoration || 'none']})`;
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Реставрация',
            text: text,
            icon: '🛠️',
            category: 'restoration',
            isTruthful: isTruthful
        };
    }
}

function generateLoupeDamageShard(item, skill) {
    const category = item.category || 'porcelain';
    const baseReliability = 70 + (skill * 1);
    const reliability = Math.min(95, baseReliability);
    const isTruthful = Math.random() < (reliability / 100);
    const isPlayerMode = !gameState.isTesterMode;
    const hasDefects = item.defects && item.defects.length > 0;
    const loupeUses = item.loupeUses || 1;
    
    // Определяем реальный уровень повреждений
    let realDamageLevel = 'none';
    if (hasDefects) {
        const defectCount = item.defects.length;
        const hasCritical = item.defects.some(d => 
            d.toLowerCase().includes('критич') || 
            d.toLowerCase().includes('разрушен') ||
            d.toLowerCase().includes('утрач')
        );
        const hasSevere = item.defects.some(d => 
            d.toLowerCase().includes('сильн') || 
            d.toLowerCase().includes('глубок') ||
            d.toLowerCase().includes('значительн')
        );
        
        if (hasCritical || defectCount >= 5) realDamageLevel = 'critical';
        else if (hasSevere || defectCount >= 3) realDamageLevel = 'severe';
        else if (defectCount >= 2) realDamageLevel = 'moderate';
        else realDamageLevel = 'minor';
    }
    
    // Определяем, какой уровень показываем
    let displayDamageLevel;
    if (isTruthful) {
        displayDamageLevel = realDamageLevel;
    } else {
        const allLevels = ['none', 'minor', 'moderate', 'severe', 'critical'];
        const otherLevels = allLevels.filter(l => l !== realDamageLevel);
        displayDamageLevel = otherLevels[Math.floor(Math.random() * otherLevels.length)];
    }
    
    if (isPlayerMode) {
        // Вступительная фраза
        const beginningPhrases = LOUPE_BEGINNING_PHRASES[category]?.[loupeUses] || 
                                  LOUPE_BEGINNING_PHRASES.porcelain[loupeUses];
        const beginningPhrase = beginningPhrases[Math.floor(Math.random() * beginningPhrases.length)];
        
        // Фраза о повреждениях
        const damagePhrases = LOUPE_DAMAGE_PHRASES[category]?.[displayDamageLevel] || 
                              LOUPE_DAMAGE_PHRASES.porcelain[displayDamageLevel];
        const damagePhrase = damagePhrases[Math.floor(Math.random() * damagePhrases.length)];
        
        const text = `${beginningPhrase}: ${damagePhrase}`;
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Повреждения',
            text: text,
            icon: '⚠️',
            category: 'damage',
            isTruthful: isTruthful
        };
    } else {
        // РЕЖИМ ТЕСТЕРА
        const truthIndicator = isTruthful ? '✅' : '❌';
        const levelNames = {
            none: 'отсутствуют',
            minor: 'незначительные',
            moderate: 'умеренные',
            severe: 'серьёзные',
            critical: 'критические'
        };
        
        let text = `${truthIndicator} Повреждения: ${levelNames[displayDamageLevel]}`;
        if (!isTruthful) text += ` (реально: ${levelNames[realDamageLevel]})`;
        if (hasDefects && isTruthful) {
            text += ` — ${item.defects.slice(0, 2).join(', ')}`;
        }
        
        return {
            method: 'loupe',
            reliability: Math.round(reliability),
            type: 'Повреждения',
            text: text,
            icon: '⚠️',
            category: 'damage',
            isTruthful: isTruthful
        };
    }
}

// Функция генерации "confusion" для лупы
function generateLoupeConfusionFact(factType, item, reliability) {
    const category = item.category || 'porcelain';
    
    const confusionPhrases = LOUPE_CONFUSION_PHRASES[category]?.[factType] || 
                             LOUPE_CONFUSION_PHRASES.porcelain[factType] ||
                             ["требуется дополнительное исследование"];
    
    const selectedPhrase = confusionPhrases[Math.floor(Math.random() * confusionPhrases.length)];
    
    return {
        type: factType,
        text: selectedPhrase,
        reliability: Math.round(reliability),
        isTruthful: false,
        isConfused: true
    };
}


// ==============================================
// ФУНКЦИИ ГЕНЕРАЦИИ ДЛЯ ЭКСПЕРТА
// ==============================================


function generateExpertShard(item, skill) {
    const category = item.category || 'porcelain';
    const useNumber = item.expertUses || 1;
    const isPlayerMode = !gameState.isTesterMode;
    
    const expertConfig = EXPERT_LEVELS[useNumber];
    
    // Базовая достоверность
    const baseReliability = expertConfig.baseReliability + (skill * expertConfig.skillMultiplier);
    const reliability = Math.min(95, Math.max(20, baseReliability + (Math.random() * 10 - 5)));
    
    // Количество фактов
    let factCount;
    if (useNumber === 1) factCount = 1;
    else if (useNumber === 2) factCount = 2;
    else factCount = 3;
    
    // Типы фактов
    const availableFactTypes = ['price', 'authenticity', 'style'];
    const selectedTypes = [];
    
    while (selectedTypes.length < factCount && selectedTypes.length < availableFactTypes.length) {
        const randomType = availableFactTypes[Math.floor(Math.random() * availableFactTypes.length)];
        if (!selectedTypes.includes(randomType)) {
            selectedTypes.push(randomType);
        }
    }
    
    // Генерируем факты
    const facts = selectedTypes.map(factType => {
        const factReliability = reliability + (Math.random() * 15 - 7.5);
        const isTruthful = Math.random() < (factReliability / 100);
        
        // Шанс на confusion
        const confusionChance = useNumber === 1 ? 0.35 : 0.20;
        const isConfused = !isTruthful && Math.random() < confusionChance;
        
        if (isConfused) {
            return generateExpertConfusionFact(factType, item, factReliability, isPlayerMode, useNumber);
        }
        
        return generateExpertFactEnhanced(factType, item, isTruthful, factReliability, skill, isPlayerMode, useNumber);
    });
    
    // Средняя достоверность
    const overallReliability = Math.round(facts.reduce((sum, fact) => sum + fact.reliability, 0) / facts.length);
    
    // Вступительная фраза
    const beginningPhrases = EXPERT_BEGINNING_PHRASES[useNumber]?.[category] ||
        EXPERT_BEGINNING_PHRASES[useNumber]?.porcelain;
    let beginningPhrase = beginningPhrases[Math.floor(Math.random() * beginningPhrases.length)];
    
    // Бонусные реплики
    if (useNumber === 1 && Math.random() < 0.5) {
        // Жена — 50% шанс на бонусную реплику
        const bonusPhrases = WIFE_BONUS_PHRASES[category] || WIFE_BONUS_PHRASES.porcelain;
        const bonusPhrase = bonusPhrases[Math.floor(Math.random() * bonusPhrases.length)];
        beginningPhrase = `${beginningPhrase} ${bonusPhrase}`;
    } else if (useNumber >= 2 && Math.random() < 0.3) {
        // Артур — 30% шанс на бонусную реплику
        const bonusType = Math.random() < 0.5 ? 'general' : (Math.random() < 0.5 ? 'skeptical' : 'enthusiastic');
        const bonusPhrases = ARTUR_BONUS_PHRASES[bonusType];
        const bonusPhrase = bonusPhrases[Math.floor(Math.random() * bonusPhrases.length)];
        beginningPhrase = `${beginningPhrase} ${bonusPhrase}`;
    }
    
    // Формируем текст
    let fullText;
    if (isPlayerMode) {
        const factTexts = facts.map(fact => `• ${fact.text}`).join('\n');
        fullText = `${beginningPhrase}\n${factTexts}`;
    } else {
        const factTexts = facts.map(fact => {
            const indicator = fact.isTruthful ? '✅' : '❌';
            const confusionIndicator = fact.isConfused ? '🤷' : '';
            return `• ${indicator}${confusionIndicator} ${fact.text} (${fact.reliability}%)`;
        }).join('\n');
        
        fullText = `${expertConfig.icon} ${expertConfig.name} [${category}]:\n${factTexts}`;
    }
    
    return {
        method: 'expert',
        reliability: overallReliability,
        type: expertConfig.name,
        text: fullText,
        icon: expertConfig.icon,
        category: 'expert',
        isTruthful: facts.every(fact => fact.isTruthful || fact.isConfused),
        facts: facts,
        expertData: {
            factCount: factCount,
            uses: useNumber,
            expertLevel: useNumber,
            expertName: expertConfig.name,
            skillLevel: skill
        }
    };
}

function generateExpertFactEnhanced(factType, item, isTruthful, reliability, skill, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    
    switch (factType) {
        case 'style':
            return generateExpertStyleFact(item, isTruthful, reliability, skill, isPlayerMode, useNumber);
        case 'price':
            return generateExpertPriceFact(item, isTruthful, reliability, skill, isPlayerMode, useNumber);
        case 'authenticity':
            return generateExpertAuthenticityFact(item, isTruthful, reliability, skill, isPlayerMode, useNumber);
        default:
            return {
                type: 'unknown',
                text: 'Эксперт задумался...',
                reliability: 50,
                isTruthful: false,
                isConfused: true
            };
    }
}

function generateExpertStyleFact(item, isTruthful, reliability, skill, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    const style = item.dominantStyle;
    const actualStyleName = style ? style.name : "неопределённый стиль";
    
    // Определяем, какой стиль показываем
    let displayStyle = actualStyleName;
    if (!isTruthful) {
        const allStyles = HISTORICAL_STYLES.filter(s =>
            s.categories.includes(category) && s.name !== actualStyleName
        );
        if (allStyles.length > 0) {
            displayStyle = allStyles[Math.floor(Math.random() * allStyles.length)].name;
        }
    }
    
    if (isPlayerMode) {
        const phraseType = isTruthful ? 'truthful' : 'false';
        const phrases = EXPERT_STYLE_PHRASES[category]?.[useNumber]?.[phraseType] ||
                        EXPERT_STYLE_PHRASES.porcelain[useNumber][phraseType];
        
        let text = phrases[Math.floor(Math.random() * phrases.length)]
            .replace('%style%', displayStyle);
        
        return {
            type: 'style',
            text: text,
            reliability: Math.round(reliability),
            isTruthful: isTruthful,
            isConfused: false,
            actualStyle: actualStyleName,
            reportedStyle: displayStyle
        };
    } else {
        const truthIndicator = isTruthful ? '✅' : '❌';
        let text = `${truthIndicator} Стиль: ${displayStyle}`;
        if (!isTruthful) text += ` (реально: ${actualStyleName})`;
        
        return {
            type: 'style',
            text: text,
            reliability: Math.round(reliability),
            isTruthful: isTruthful,
            isConfused: false
        };
    }
}

function generateExpertPriceFact(item, isTruthful, reliability, skill, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    const idealPrice = item.idealValue || item.basePrice || 1000;
    
    // Точность оценки зависит от уровня эксперта
    // Жена — широкий диапазон, Эрмитаж — узкий
    const maxRangePercent = useNumber === 1 ? 70 : useNumber === 2 ? 35 : 15;
    const minRangePercent = useNumber === 1 ? 20 : useNumber === 2 ? 10 : 5;
    const rangePercent = maxRangePercent - ((reliability - 25) / 70) * (maxRangePercent - minRangePercent);
    
    let lowerPrice, upperPrice;
    
    if (isTruthful) {
        const range = idealPrice * (rangePercent / 100);
        lowerPrice = Math.max(100, Math.round(idealPrice - range));
        upperPrice = Math.round(idealPrice + range);
    } else {
        // Смещаем цену
        const shiftFactor = useNumber === 1 ? 
            (0.2 + Math.random() * 2.0) : // Жена может ошибаться сильно
            (0.4 + Math.random() * 1.2);  // Эксперты ошибаются меньше
        const shiftedPrice = Math.round(idealPrice * shiftFactor);
        const range = shiftedPrice * (rangePercent * 1.5 / 100);
        lowerPrice = Math.max(100, Math.round(shiftedPrice - range));
        upperPrice = Math.round(shiftedPrice + range);
    }
    
    const priceStr = `${formatMoney(lowerPrice)} - ${formatMoney(upperPrice)}`;
    const singlePrice = formatMoney(Math.round((lowerPrice + upperPrice) / 2));
    
    if (isPlayerMode) {
        const phrases = EXPERT_PRICE_PHRASES[category]?.[useNumber]?.truthful ||
                        EXPERT_PRICE_PHRASES.porcelain[useNumber].truthful;
        
        let text = phrases[Math.floor(Math.random() * phrases.length)]
            .replace('%price%', useNumber === 3 ? priceStr : singlePrice);
        
        return {
            type: 'price',
            text: text,
            reliability: Math.round(reliability),
            isTruthful: isTruthful,
            isConfused: false,
            actualPrice: idealPrice,
            reportedLower: lowerPrice,
            reportedUpper: upperPrice
        };
    } else {
        const truthIndicator = isTruthful ? '✅' : '❌';
        let text = `${truthIndicator} Цена: ${priceStr}`;
        if (!isTruthful) text += ` (реально: ~${formatMoney(idealPrice)})`;
        
        return {
            type: 'price',
            text: text,
            reliability: Math.round(reliability),
            isTruthful: isTruthful,
            isConfused: false
        };
    }
}

function generateExpertAuthenticityFact(item, isTruthful, reliability, skill, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    const isAuthentic = item.authentic;
    
    // Определяем, что показываем
    let displayAuthentic;
    if (isTruthful) {
        displayAuthentic = isAuthentic;
    } else {
        displayAuthentic = !isAuthentic;
    }
    
    if (isPlayerMode) {
        const phraseType = displayAuthentic ? 'authentic' : 'fake';
        const phrases = EXPERT_AUTHENTICITY_PHRASES[category]?.[useNumber]?.[phraseType] ||
                        EXPERT_AUTHENTICITY_PHRASES.porcelain[useNumber][phraseType];
        
        let text = phrases[Math.floor(Math.random() * phrases.length)];
        
        return {
            type: 'authenticity',
            text: text,
            reliability: Math.round(reliability),
            isTruthful: isTruthful,
            isConfused: false,
            actualAuthentic: isAuthentic,
            reportedAuthentic: displayAuthentic
        };
    } else {
        const truthIndicator = isTruthful ? '✅' : '❌';
        const authStr = displayAuthentic ? 'оригинал' : 'подделка';
        let text = `${truthIndicator} Подлинность: ${authStr}`;
        if (!isTruthful) text += ` (реально: ${isAuthentic ? 'оригинал' : 'подделка'})`;
        
        return {
            type: 'authenticity',
            text: text,
            reliability: Math.round(reliability),
            isTruthful: isTruthful,
            isConfused: false
        };
    }
}

function generateExpertConfusionFact(factType, item, reliability, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    
    const phrases = EXPERT_PRICE_PHRASES[category]?.[useNumber]?.confused ||
                    EXPERT_AUTHENTICITY_PHRASES[category]?.[useNumber]?.confused ||
                    ["требуется дополнительное исследование"];
    
    // Для разных типов фактов — разные confused-фразы
    let selectedPhrase;
    if (factType === 'price') {
        selectedPhrase = (EXPERT_PRICE_PHRASES[category]?.[useNumber]?.confused || 
                          EXPERT_PRICE_PHRASES.porcelain[useNumber].confused)
                         [Math.floor(Math.random() * 4)];
    } else if (factType === 'authenticity') {
        selectedPhrase = (EXPERT_AUTHENTICITY_PHRASES[category]?.[useNumber]?.confused ||
                          EXPERT_AUTHENTICITY_PHRASES.porcelain[useNumber].confused)
                         [Math.floor(Math.random() * 4)];
    } else {
        selectedPhrase = "сложно определить без дополнительного исследования";
    }
    
    if (isPlayerMode) {
        return {
            type: factType,
            text: selectedPhrase,
            reliability: Math.round(reliability),
            isTruthful: false,
            isConfused: true
        };
    } else {
        return {
            type: factType,
            text: `🤷 ${selectedPhrase}`,
            reliability: Math.round(reliability),
            isTruthful: false,
            isConfused: true
        };
    }
}

// ==============================================
// УЛУЧШЕННЫЕ ФУНКЦИИ ГЕНЕРАЦИИ ДЛЯ ИНТЕРНЕТА
// ==============================================

function generateInternetShard(item, skill) {
    const category = item.category || 'porcelain';
    const currentUses = item.internetUses || 1;
    const isPlayerMode = !gameState.isTesterMode;
    
    // Количество фактов по использованиям
    let factCount;
    if (currentUses === 1) factCount = 1;
    else if (currentUses === 2) factCount = 2;
    else factCount = 3;
    
    // Достоверность зависит от уровня навыка и источника
    // Яндекс — базовая, Авито — чуть лучше, Форум — зависит от навыка
    const sourceBonus = currentUses === 3 ? skill * 1 : currentUses * 5;
    const baseReliability = 40 + (skill * 1) + sourceBonus;
    const reliabilityVariation = 15;
    const reliability = Math.min(95, Math.max(35, baseReliability + (Math.random() * 2 - 1) * reliabilityVariation));
    
    // Типы фактов
    const availableFactTypes = ['style', 'price', 'authenticity'];
    const selectedTypes = [];
    
    while (selectedTypes.length < factCount && selectedTypes.length < availableFactTypes.length) {
        const randomType = availableFactTypes[Math.floor(Math.random() * availableFactTypes.length)];
        if (!selectedTypes.includes(randomType)) {
            selectedTypes.push(randomType);
        }
    }
    
    // Генерируем факты
    const facts = selectedTypes.map(factType => {
        const factReliability = reliability + (Math.random() * 10 - 5);
        const isTruthful = Math.random() < (factReliability / 100);
        
        return generateInternetFactEnhanced(factType, item, isTruthful, factReliability, skill, isPlayerMode, currentUses);
    });
    
    // Средняя достоверность
    const overallReliability = Math.round(facts.reduce((sum, fact) => sum + fact.reliability, 0) / facts.length);
    
    // Вступительная фраза по категории и номеру использования
    const beginningPhrases = INTERNET_BEGINNING_PHRASES[currentUses]?.[category] || 
                              INTERNET_BEGINNING_PHRASES[currentUses]?.porcelain;
    const beginningPhrase = beginningPhrases[Math.floor(Math.random() * beginningPhrases.length)];
    
    // Формируем текст
    let fullText;
    if (isPlayerMode) {
        const factTexts = facts.map(fact => {
            const phrase = getReliabilityPhrase(fact.reliability);
            return `• ${phrase} ${fact.text}`;
        }).join('\n');
        
        fullText = `${beginningPhrase}:\n${factTexts}`;
    } else {
        const factTexts = facts.map(fact => {
            const indicator = fact.isTruthful ? '✅' : '❌';
            const confusionIndicator = fact.isConfused ? '🤷' : '';
            return `• ${indicator}${confusionIndicator} ${fact.text} (${fact.reliability}%)`;
        }).join('\n');
        
        const sourceNames = { 1: 'Яндекс', 2: 'Авито', 3: 'Форум' };
        fullText = `💻 Интернет [${sourceNames[currentUses]}/${category}]:\n${factTexts}`;
    }
    
    return {
        method: 'internet',
        reliability: overallReliability,
        type: currentUses === 1 ? 'Поиск по картинке' : 
              currentUses === 2 ? 'Анализ площадок' : 'Форум экспертов',
        text: fullText,
        icon: currentUses === 1 ? '🔍' : currentUses === 2 ? '🛒' : '💬',
        category: 'research',
        isTruthful: facts.every(fact => fact.isTruthful || fact.isConfused),
        facts: facts,
        internetData: {
            factCount: factCount,
            uses: currentUses,
            source: currentUses === 1 ? 'yandex' : currentUses === 2 ? 'avito' : 'forum',
            skillLevel: skill
        }
    };
}

function generateInternetFactEnhanced(factType, item, isTruthful, reliability, skill, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    
    // Шанс на confusion (много мнений) для ложных фактов
    const confusionChance = useNumber === 3 ? 0.6 : 0.4; // На форуме чаще срачи
    const isConfused = !isTruthful && Math.random() < confusionChance;
    
    if (isConfused) {
        return generateInternetConfusionFact(factType, item, reliability, isPlayerMode, useNumber);
    }
    
    switch (factType) {
        case 'style':
            return generateInternetStyleFactEnhanced(item, isTruthful, reliability, skill, isPlayerMode, useNumber);
        case 'price':
            return generateInternetPriceFactEnhanced(item, isTruthful, reliability, skill, isPlayerMode, useNumber);
        case 'authenticity':
            return generateInternetAuthenticityFactEnhanced(item, isTruthful, reliability, skill, isPlayerMode, useNumber);
        default:
            return {
                type: 'unknown',
                text: 'информация недоступна',
                reliability: 50,
                isTruthful: false,
                isConfused: false
            };
    }
}

function generateInternetStyleFactEnhanced(item, isTruthful, reliability, skill, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    const style = item.dominantStyle;
    const actualStyleName = style ? style.name : "неопределённый стиль";
    
    // Определяем, какой стиль показываем
    let displayStyle = actualStyleName;
    if (!isTruthful) {
        const allStyles = HISTORICAL_STYLES.filter(s =>
            s.categories.includes(category) && s.name !== actualStyleName
        );
        if (allStyles.length > 0) {
            displayStyle = allStyles[Math.floor(Math.random() * allStyles.length)].name;
        }
    }
    
    if (isPlayerMode) {
        const phraseType = isTruthful ? 'truthful' : 'false';
        const phrases = INTERNET_STYLE_PHRASES[category]?.[useNumber]?.[phraseType] ||
                        INTERNET_STYLE_PHRASES.porcelain[useNumber][phraseType];
        
        let text = phrases[Math.floor(Math.random() * phrases.length)]
            .replace('%style%', displayStyle);
        
        return {
            type: 'style',
            text: text,
            reliability: Math.round(reliability),
            isTruthful: isTruthful,
            isConfused: false,
            actualStyle: actualStyleName,
            reportedStyle: displayStyle
        };
    } else {
        const truthIndicator = isTruthful ? '✅' : '❌';
        let text = `${truthIndicator} Стиль: ${displayStyle}`;
        if (!isTruthful) text += ` (реально: ${actualStyleName})`;
        
        return {
            type: 'style',
            text: text,
            reliability: Math.round(reliability),
            isTruthful: isTruthful,
            isConfused: false
        };
    }
}

function generateInternetPriceFactEnhanced(item, isTruthful, reliability, skill, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    const idealPrice = item.idealValue || item.basePrice || 1000;
    
    // Диапазон зависит от источника: Яндекс — широкий, Авито — средний, Форум — узкий (если консенсус)
    const maxRangePercent = useNumber === 1 ? 60 : useNumber === 2 ? 40 : 25;
    const minRangePercent = useNumber === 1 ? 15 : useNumber === 2 ? 10 : 5;
    const rangePercent = maxRangePercent - ((reliability - 40) / 60) * (maxRangePercent - minRangePercent);
    
    let lowerPrice, upperPrice;
    
    if (isTruthful) {
        const range = idealPrice * (rangePercent / 100);
        lowerPrice = Math.max(100, Math.round(idealPrice - range));
        upperPrice = Math.round(idealPrice + range);
    } else {
        // Смещаем цену
        const shiftFactor = 0.3 + Math.random() * 1.4; // 0.3 - 1.7
        const shiftedPrice = Math.round(idealPrice * shiftFactor);
        const range = shiftedPrice * (rangePercent * 1.5 / 100);
        lowerPrice = Math.max(100, Math.round(shiftedPrice - range));
        upperPrice = Math.round(shiftedPrice + range);
    }
    
    const priceStr = `${formatMoney(lowerPrice)} - ${formatMoney(upperPrice)}`;
    
    if (isPlayerMode) {
        const phraseType = Math.random() < 0.5 ? 'truthful' : 'range';
        const phrases = INTERNET_PRICE_PHRASES[category]?.[useNumber]?.[phraseType] ||
                        INTERNET_PRICE_PHRASES.porcelain[useNumber][phraseType];
        
        let text = phrases[Math.floor(Math.random() * phrases.length)]
            .replace('%price%', priceStr);
        
        return {
            type: 'price',
            text: text,
            reliability: Math.round(reliability),
            isTruthful: isTruthful,
            isConfused: false,
            actualPrice: idealPrice,
            reportedLower: lowerPrice,
            reportedUpper: upperPrice
        };
    } else {
        const truthIndicator = isTruthful ? '✅' : '❌';
        let text = `${truthIndicator} Цена: ${priceStr}`;
        if (!isTruthful) text += ` (реально: ~${formatMoney(idealPrice)})`;
        
        return {
            type: 'price',
            text: text,
            reliability: Math.round(reliability),
            isTruthful: isTruthful,
            isConfused: false
        };
    }
}

function generateInternetAuthenticityFactEnhanced(item, isTruthful, reliability, skill, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    const isAuthentic = item.authentic;
    
    // Определяем, что показываем
    let displayAuthentic;
    if (isTruthful) {
        displayAuthentic = isAuthentic;
    } else {
        displayAuthentic = !isAuthentic;
    }
    
    if (isPlayerMode) {
        const phraseType = displayAuthentic ? 'authentic' : 'fake';
        const phrases = INTERNET_AUTHENTICITY_PHRASES[category]?.[useNumber]?.[phraseType] ||
                        INTERNET_AUTHENTICITY_PHRASES.porcelain[useNumber][phraseType];
        
        let text = phrases[Math.floor(Math.random() * phrases.length)];
        
        return {
            type: 'authenticity',
            text: text,
            reliability: Math.round(reliability),
            isTruthful: isTruthful,
            isConfused: false,
            actualAuthentic: isAuthentic,
            reportedAuthentic: displayAuthentic
        };
    } else {
        const truthIndicator = isTruthful ? '✅' : '❌';
        const authStr = displayAuthentic ? 'оригинал' : 'подделка';
        let text = `${truthIndicator} Подлинность: ${authStr}`;
        if (!isTruthful) text += ` (реально: ${isAuthentic ? 'оригинал' : 'подделка'})`;
        
        return {
            type: 'authenticity',
            text: text,
            reliability: Math.round(reliability),
            isTruthful: isTruthful,
            isConfused: false
        };
    }
}

function generateInternetConfusionFact(factType, item, reliability, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    
    const phrases = INTERNET_CONFUSION_PHRASES[category]?.[useNumber]?.[factType] ||
                    INTERNET_CONFUSION_PHRASES.porcelain[useNumber][factType];
    
    const selectedPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    
    if (isPlayerMode) {
        return {
            type: factType,
            text: selectedPhrase,
            reliability: Math.round(reliability),
            isTruthful: false,
            isConfused: true
        };
    } else {
        return {
            type: factType,
            text: `🤷 ${selectedPhrase}`,
            reliability: Math.round(reliability),
            isTruthful: false,
            isConfused: true
        };
    }
}

function generateUVShard(item, skill) {
    const category = item.category || 'porcelain';
    const useNumber = item.uvUses || 1;
    const isPlayerMode = !gameState.isTesterMode;
    
    const uvConfig = UV_LEVELS[useNumber];
    const baseReliability = uvConfig.baseReliability + (skill * uvConfig.skillMultiplier);
    
    // Количество фактов
    let targetFactCount;
    if (useNumber === 1) targetFactCount = 1;
    else if (useNumber === 2) targetFactCount = 2;
    else targetFactCount = 3;
    
    // Генерируем факты
    const allPossibleFacts = [];
    const hasRestoration = item.restoration && item.restoration !== 'none';
    
    // Факт 1: Наличие реставрации
    const reliability1 = Math.min(95, baseReliability + (Math.random() * 20 - 10));
    const isTruthful1 = Math.random() < (reliability1 / 100);
    allPossibleFacts.push({
        fact: generateUVRestorationPresenceFact(item, isTruthful1, reliability1, isPlayerMode, useNumber),
        type: 'presence',
        reliability: reliability1,
        isTruthful: isTruthful1
    });
    
    // Факт 2: Степень реставрации (если есть)
    if (hasRestoration) {
        const reliability2 = Math.min(95, baseReliability + (Math.random() * 20 - 10));
        const isTruthful2 = Math.random() < (reliability2 / 100);
        allPossibleFacts.push({
            fact: generateUVRestorationGradeFact(item, isTruthful2, reliability2, isPlayerMode, useNumber),
            type: 'grade',
            reliability: reliability2,
            isTruthful: isTruthful2
        });
    }
    
    // Факт 3: Возраст оригинала
    const reliability3 = Math.min(95, baseReliability + (Math.random() * 20 - 10));
    const isTruthful3 = Math.random() < (reliability3 / 100);
    allPossibleFacts.push({
        fact: generateUVOriginalAgeFact(item, isTruthful3, reliability3, skill, isPlayerMode, useNumber),
        type: 'age_original',
        reliability: reliability3,
        isTruthful: isTruthful3
    });
    
    // Факт 4: Возраст реставрации
    if (hasRestoration) {
        const reliability4 = Math.min(95, baseReliability + (Math.random() * 20 - 10));
        const isTruthful4 = Math.random() < (reliability4 / 100);
        allPossibleFacts.push({
            fact: generateUVRestorationAgeFact(item, isTruthful4, reliability4, skill, isPlayerMode, useNumber),
            type: 'age_restoration',
            reliability: reliability4,
            isTruthful: isTruthful4
        });
    }
    
    // Выбираем случайные факты
    const shuffledFacts = [...allPossibleFacts].sort(() => Math.random() - 0.5);
    const selectedFactsData = shuffledFacts.slice(0, Math.min(targetFactCount, shuffledFacts.length));
    const selectedFacts = selectedFactsData.map(sf => sf.fact);
    
    // Средняя достоверность
    const overallReliability = selectedFactsData.length > 0 ?
        Math.round(selectedFactsData.reduce((sum, sf) => sum + sf.reliability, 0) / selectedFactsData.length) : 50;
    
    // Вступительная фраза
    const beginningPhrases = UV_BEGINNING_PHRASES[useNumber]?.[category] ||
        UV_BEGINNING_PHRASES[useNumber]?.porcelain;
    let beginningPhrase = beginningPhrases[Math.floor(Math.random() * beginningPhrases.length)];
    
    // Бонусная фраза для кустарных методов (50% шанс)
    if (useNumber === 1 && Math.random() < 0.5) {
        const bonusPhrases = CRUDE_METHOD_BONUS_PHRASES[category] || CRUDE_METHOD_BONUS_PHRASES.porcelain;
        const bonusPhrase = bonusPhrases[Math.floor(Math.random() * bonusPhrases.length)];
        beginningPhrase = `${beginningPhrase}. ${bonusPhrase}`;
    }
    
    // Формируем текст
    let fullText;
    if (isPlayerMode) {
        const factTexts = selectedFacts.map(fact => {
            if (useNumber === 1) {
                return `• ${fact.text}`;
            }
            const phrase = getReliabilityPhrase(fact.reliability);
            return `• ${phrase} ${fact.text}`;
        }).join('\n');
        
        fullText = `${beginningPhrase}\n${factTexts}`;
    } else {
        const factTexts = selectedFacts.map(fact => {
            const indicator = fact.isTruthful ? '✅' : '❌';
            const confusionIndicator = fact.isConfused ? '🤷' : '';
            return `• ${indicator}${confusionIndicator} ${fact.text} (${fact.reliability}%)`;
        }).join('\n');
        
        fullText = `${uvConfig.icon} ${uvConfig.name} [${category}]:\n${factTexts}`;
    }
    
    return {
        method: 'uv',
        reliability: overallReliability,
        type: uvConfig.name,
        text: fullText,
        icon: uvConfig.icon,
        category: 'restoration',
        isTruthful: selectedFactsData.every(sf => sf.isTruthful),
        facts: selectedFacts,
        uvData: {
            baseReliability: baseReliability,
            factCount: selectedFacts.length,
            uses: useNumber,
            methodLevel: useNumber,
            methodName: uvConfig.name
        }
    };
}

// Функции генерации фактов для УФ
function generateUVRestorationPresenceFact(item, isTruthful, reliability, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    const hasRestoration = item.restoration && item.restoration !== 'none';
    
    // Что показываем
    let showRestoration = isTruthful ? hasRestoration : !hasRestoration;
    
    const phraseType = showRestoration ? 'hasRestoration' : 'noRestoration';
    const phrases = UV_RESTORATION_PRESENCE_PHRASES[category]?.[useNumber]?.[phraseType] ||
        UV_RESTORATION_PRESENCE_PHRASES.porcelain[useNumber][phraseType];
    
    const text = phrases[Math.floor(Math.random() * phrases.length)];
    
    return {
        type: 'restoration_presence',
        text: text,
        reliability: Math.round(reliability),
        isTruthful: isTruthful,
        isConfused: false
    };
}

function generateUVRestorationGradeFact(item, isTruthful, reliability, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    const actualGrade = item.restoration || 'none';
    
    // Что показываем
    let displayGrade = actualGrade;
    if (!isTruthful && actualGrade !== 'none') {
        const allGrades = ['professional', 'quality', 'medium', 'rough'];
        const otherGrades = allGrades.filter(g => g !== actualGrade);
        displayGrade = otherGrades[Math.floor(Math.random() * otherGrades.length)];
    }
    
    if (displayGrade === 'none') {
        return {
            type: 'restoration_grade',
            text: "реставрация отсутствует",
            reliability: Math.round(reliability),
            isTruthful: isTruthful,
            isConfused: false
        };
    }
    
    const phrases = UV_RESTORATION_GRADE_PHRASES[category]?.[useNumber]?.[displayGrade] ||
        UV_RESTORATION_GRADE_PHRASES.porcelain[useNumber][displayGrade];
    
    const text = phrases[Math.floor(Math.random() * phrases.length)];
    
    return {
        type: 'restoration_grade',
        text: text,
        reliability: Math.round(reliability),
        isTruthful: isTruthful,
        isConfused: false
    };
}

function generateUVOriginalAgeFact(item, isTruthful, reliability, skill, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    
    // Точность зависит от достоверности
    const maxPrecision = useNumber === 1 ? 50 : useNumber === 2 ? 30 : 15;
    const minPrecision = useNumber === 1 ? 15 : useNumber === 2 ? 8 : 3;
    const precision = Math.round(maxPrecision - (reliability / 100) * (maxPrecision - minPrecision));
    
    let estimatedAge;
    if (isTruthful) {
        const error = (Math.random() - 0.5) * 2 * precision;
        estimatedAge = Math.max(5, Math.min(326, Math.round(item.age + error)));
    } else {
        const bigError = (Math.random() - 0.5) * 4 * precision;
        estimatedAge = Math.max(5, Math.min(326, Math.round(item.age + bigError)));
        if (Math.random() < 0.2) {
            estimatedAge = Math.floor(Math.random() * 300) + 10;
        }
    }
    
    const phrases = UV_ORIGINAL_AGE_PHRASES[category]?.[useNumber]?.phrases ||
        UV_ORIGINAL_AGE_PHRASES.porcelain[useNumber].phrases;
    
    const text = phrases[Math.floor(Math.random() * phrases.length)]
        .replace('%age%', estimatedAge);
    
    return {
        type: 'age_original',
        text: text,
        reliability: Math.round(reliability),
        isTruthful: isTruthful,
        isConfused: false,
        estimatedAge: estimatedAge
    };
}

function generateUVRestorationAgeFact(item, isTruthful, reliability, skill, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    
    if (!item.restoration || item.restoration === 'none') {
        return generateUVRestorationPresenceFact(item, isTruthful, reliability, isPlayerMode, useNumber);
    }
    
    // Точность зависит от уровня
    const maxPrecision = useNumber === 1 ? 30 : useNumber === 2 ? 15 : 5;
    const minPrecision = useNumber === 1 ? 10 : useNumber === 2 ? 5 : 2;
    const precision = Math.round(maxPrecision - (reliability / 100) * (maxPrecision - minPrecision));
    
    const maxRestorationAge = Math.min(80, Math.max(1, item.age - 10));
    const actualRestorationAge = Math.floor(Math.random() * maxRestorationAge) + 1;
    
    let estimatedAge;
    if (isTruthful) {
        const error = (Math.random() - 0.5) * 2 * precision;
        estimatedAge = Math.max(1, Math.min(100, Math.round(actualRestorationAge + error)));
    } else {
        const bigError = (Math.random() - 0.5) * 4 * precision;
        estimatedAge = Math.max(1, Math.min(100, Math.round(actualRestorationAge + bigError)));
    }
    
    const phrases = UV_RESTORATION_AGE_PHRASES[category]?.[useNumber]?.phrases ||
        UV_RESTORATION_AGE_PHRASES.porcelain[useNumber].phrases;
    
    const text = phrases[Math.floor(Math.random() * phrases.length)]
        .replace('%age%', estimatedAge);
    
    return {
        type: 'age_restoration',
        text: text,
        reliability: Math.round(reliability),
        isTruthful: isTruthful,
        isConfused: false,
        estimatedAge: estimatedAge
    };
}

function generateTestingFactEnhanced(factType, item, isTruthful, reliability, skill, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    
    switch (factType) {
        case 'physical_or_chemical':
            return generateTestingMethodFact(item, isTruthful, reliability, skill, isPlayerMode, useNumber);
        case 'age':
            return generateTestingAgeFact(item, isTruthful, reliability, skill, isPlayerMode, useNumber);
        case 'authenticity':
            return generateTestingAuthenticityFact(item, isTruthful, reliability, skill, isPlayerMode, useNumber);
        case 'origin':
            return generateTestingOriginFact(item, isTruthful, reliability, skill, isPlayerMode, useNumber);
        default:
            return generateTestingMethodFact(item, isTruthful, reliability, skill, isPlayerMode, useNumber);
    }
}

function generateTestingMethodFact(item, isTruthful, reliability, skill, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    
    let phrases;
    if (useNumber === 1) {
        // Физический тест
        const testTypes = ['weight', 'sound', 'texture', 'flexibility', 'mechanisms', 'paper', 'binding', 'smell', 'magnetism', 'layers'];
        const availableTests = TESTING_PHYSICAL_PHRASES[category] || TESTING_PHYSICAL_PHRASES.porcelain;
        const testType = Object.keys(availableTests)[Math.floor(Math.random() * Object.keys(availableTests).length)];
        phrases = availableTests[testType];
    } else if (useNumber === 2) {
        // Химический тест
        const availableTests = TESTING_CHEMICAL_PHRASES[category] || TESTING_CHEMICAL_PHRASES.porcelain;
        const testType = Object.keys(availableTests)[Math.floor(Math.random() * Object.keys(availableTests).length)];
        phrases = availableTests[testType];
    } else {
        // Инструментальный тест
        const availableTests = TESTING_INSTRUMENTAL_PHRASES[category] || TESTING_INSTRUMENTAL_PHRASES.porcelain;
        const testType = Object.keys(availableTests)[Math.floor(Math.random() * Object.keys(availableTests).length)];
        phrases = availableTests[testType];
    }
    
    if (!phrases || phrases.length === 0) {
        phrases = ["Тест выполнен успешно"];
    }
    
    const text = phrases[Math.floor(Math.random() * phrases.length)];
    
    return {
        type: 'method',
        text: text,
        reliability: Math.round(reliability),
        isTruthful: isTruthful,
        isConfused: false
    };
}

function generateTestingAgeFact(item, isTruthful, reliability, skill, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    const accuracy = TESTING_AGE_ACCURACY[category] || { precision: 10, baseReliability: 70 };
    
    const skillBonus = Math.max(0, skill - 1) * 0.1;
    const precision = Math.round(accuracy.precision * (1 - skillBonus));
    
    let estimatedAge;
    if (isTruthful) {
        const error = (Math.random() - 0.5) * 2 * precision;
        estimatedAge = Math.max(5, Math.min(326, Math.round(item.age + error)));
    } else {
        const bigError = (Math.random() - 0.5) * 4 * precision;
        estimatedAge = Math.max(5, Math.min(326, Math.round(item.age + bigError)));
        if (Math.random() < 0.2) {
            estimatedAge = Math.floor(Math.random() * 300) + 10;
        }
    }
    
    const phrases = TESTING_AGE_PHRASES[category]?.[useNumber] || 
                    TESTING_AGE_PHRASES.porcelain[useNumber];
    
    const text = phrases[Math.floor(Math.random() * phrases.length)]
        .replace('%age%', estimatedAge);
    
    return {
        type: 'age',
        text: text,
        reliability: Math.round(reliability),
        isTruthful: isTruthful,
        isConfused: false,
        estimatedAge: estimatedAge
    };
}

function generateTestingAuthenticityFact(item, isTruthful, reliability, skill, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    const isAuthentic = item.authentic;
    
    let displayAuthentic = isTruthful ? isAuthentic : !isAuthentic;
    
    const phraseType = displayAuthentic ? 'authentic' : 'fake';
    const phrases = TESTING_AUTHENTICITY_PHRASES[category]?.[useNumber]?.[phraseType] ||
                    TESTING_AUTHENTICITY_PHRASES.porcelain[useNumber][phraseType];
    
    const text = phrases[Math.floor(Math.random() * phrases.length)];
    
    return {
        type: 'authenticity',
        text: text,
        reliability: Math.round(reliability),
        isTruthful: isTruthful,
        isConfused: false,
        actualAuthentic: isAuthentic,
        reportedAuthentic: displayAuthentic
    };
}

function generateTestingOriginFact(item, isTruthful, reliability, skill, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    const origins = MATERIAL_ORIGINS[category] || [];
    const year = 2026 - item.age;
    
    let suitableOrigins = origins.filter(origin => 
        year >= origin.years[0] && year <= origin.years[1]
    );
    
    if (suitableOrigins.length === 0) {
        suitableOrigins = origins;
    }
    
    let selectedOrigin;
    if (isTruthful) {
        selectedOrigin = suitableOrigins[Math.floor(Math.random() * suitableOrigins.length)];
    } else {
        const unsuitableOrigins = origins.filter(origin => !suitableOrigins.includes(origin));
        selectedOrigin = unsuitableOrigins.length > 0 ? 
            unsuitableOrigins[Math.floor(Math.random() * unsuitableOrigins.length)] :
            origins[Math.floor(Math.random() * origins.length)];
    }
    
    const phrases = TESTING_ORIGIN_PHRASES[category]?.[useNumber] || 
                    TESTING_ORIGIN_PHRASES.porcelain[useNumber];
    
    const text = phrases[Math.floor(Math.random() * phrases.length)]
        .replace('%origin%', selectedOrigin.name);
    
    return {
        type: 'origin',
        text: text,
        reliability: Math.round(reliability),
        isTruthful: isTruthful,
        isConfused: false,
        origin: selectedOrigin.name,
        descriptor: selectedOrigin.descriptor
    };
}

function generateTestingConfusionFact(factType, item, reliability, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    
    const phrases = TESTING_CONFUSION_PHRASES[category]?.[useNumber] ||
                    TESTING_CONFUSION_PHRASES.porcelain[useNumber];
    
    const text = phrases[Math.floor(Math.random() * phrases.length)];
    
    return {
        type: factType,
        text: text,
        reliability: Math.round(reliability),
        isTruthful: false,
        isConfused: true
    };
}

// Обновляем функцию generateTestingMethodFact для первого уровня
function generateTestingMethodFact(item, isTruthful, reliability, skill, isPlayerMode, useNumber) {
    const category = item.category || 'porcelain';
    
    let phrases;
    if (useNumber === 1) {
        // Полевые тесты — новые уникальные фразы
        const availableTests = TESTING_FIELD_PHRASES[category] || TESTING_FIELD_PHRASES.porcelain;
        const testTypes = Object.keys(availableTests);
        const testType = testTypes[Math.floor(Math.random() * testTypes.length)];
        phrases = availableTests[testType];
    } else if (useNumber === 2) {
        // Химический тест
        const availableTests = TESTING_CHEMICAL_PHRASES[category] || TESTING_CHEMICAL_PHRASES.porcelain;
        const testType = Object.keys(availableTests)[Math.floor(Math.random() * Object.keys(availableTests).length)];
        phrases = availableTests[testType];
    } else {
        // Инструментальный тест
        const availableTests = TESTING_INSTRUMENTAL_PHRASES[category] || TESTING_INSTRUMENTAL_PHRASES.porcelain;
        const testType = Object.keys(availableTests)[Math.floor(Math.random() * Object.keys(availableTests).length)];
        phrases = availableTests[testType];
    }
    
    if (!phrases || phrases.length === 0) {
        phrases = ["Тест выполнен"];
    }
    
    // Для ложных фактов — берём фразу и инвертируем смысл
    let text;
    if (isTruthful) {
        text = phrases[Math.floor(Math.random() * phrases.length)];
    } else {
        // Для ложного факта — модифицируем текст или берём "противоположный" тест
        text = phrases[Math.floor(Math.random() * phrases.length)];
        // Можно добавить модификатор неуверенности для ложных
    }
    
    return {
        type: 'method',
        text: text,
        reliability: Math.round(reliability),
        isTruthful: isTruthful,
        isConfused: false
    };
}

// Обновляем функцию generateTestingShard для первого уровня
function generateTestingShard(item, skill) {
    const category = item.category || 'porcelain';
    const useNumber = item.testingUses || 1;
    const isPlayerMode = !gameState.isTesterMode;
    
    const testingConfig = TESTING_LEVELS[useNumber];
    const baseReliability = testingConfig.baseReliability + (skill * testingConfig.skillMultiplier);
    
    // Количество фактов
    let targetFactCount;
    if (useNumber === 1) targetFactCount = 1;
    else if (useNumber === 2) targetFactCount = 2;
    else targetFactCount = 3;
    
    // Типы фактов
    const selectedTypes = ['physical_or_chemical']; // Всегда начинаем с теста
    
    const otherTypes = ['age', 'authenticity', 'origin'];
    while (selectedTypes.length < targetFactCount) {
        const shuffled = [...otherTypes].sort(() => Math.random() - 0.5);
        for (const type of shuffled) {
            if (!selectedTypes.includes(type) && selectedTypes.length < targetFactCount) {
                selectedTypes.push(type);
            }
        }
        if (selectedTypes.length < targetFactCount) break;
    }
    
    // Генерируем факты
    const facts = selectedTypes.map(factType => {
        const factReliability = Math.min(95, baseReliability + (Math.random() * 15 - 7.5));
        const isTruthful = Math.random() < (factReliability / 100);
        
        const confusionChance = 0.2;
        const isConfused = !isTruthful && Math.random() < confusionChance;
        
        if (isConfused) {
            return generateTestingConfusionFact(factType, item, factReliability, isPlayerMode, useNumber);
        }
        
        return generateTestingFactEnhanced(factType, item, isTruthful, factReliability, skill, isPlayerMode, useNumber);
    });
    
    // Проверка на повреждение
    let criticalFailure = false;
    let damageText = null;
    if (testingConfig.damageChance) {
        const avgReliability = facts.reduce((sum, f) => sum + f.reliability, 0) / facts.length;
        // Шанс повреждения зависит от уровня и надёжности
        const damageThreshold = useNumber === 1 ? 50 : useNumber === 2 ? 55 : 60;
        if (avgReliability < damageThreshold && Math.random() < testingConfig.damageChance) {
            criticalFailure = true;
            
            if (!item.defects) item.defects = [];
            const defectNames = {
                1: "следы полевого тестирования",
                2: "следы химического анализа",
                3: "следы инструментального анализа"
            };
            const newDefect = defectNames[useNumber];
            
            if (!item.defects.includes(newDefect)) {
                item.defects.push(newDefect);
                
                if (!item.restorationProgress) item.restorationProgress = {};
                item.restorationProgress[newDefect] = {
                    progress: 0,
                    baseSeverity: useNumber === 1 ? 0.05 : useNumber === 2 ? 0.08 : 0.1,
                    difficulty: "easy",
                    baseRepairChance: 0.8
                };
                
                const penaltyPercent = useNumber === 1 ? 0.05 : useNumber === 2 ? 0.08 : 0.1;
                const penalty = (item.estimatedValue || item.realValue) * penaltyPercent;
                item.estimatedValue = Math.round((item.estimatedValue || item.realValue) - penalty);
                
                const damagePhrases = useNumber === 1 ?
                    (TESTING_FIELD_DAMAGE_PHRASES[category] || TESTING_FIELD_DAMAGE_PHRASES.porcelain) :
                    (TESTING_DAMAGE_PHRASES[category] || TESTING_DAMAGE_PHRASES.porcelain);
                damageText = damagePhrases[Math.floor(Math.random() * damagePhrases.length)];
                
                showNotification(`⚠️ ${damageText} -${Math.round(penaltyPercent * 100)}% стоимости`, 'error');
            }
        }
    }
    
    const overallReliability = Math.round(facts.reduce((sum, fact) => sum + fact.reliability, 0) / facts.length);
    
    // Вступительная фраза
    const beginningPhrases = TESTING_BEGINNING_PHRASES[useNumber]?.[category] ||
        TESTING_BEGINNING_PHRASES[useNumber]?.porcelain;
    let beginningPhrase = beginningPhrases[Math.floor(Math.random() * beginningPhrases.length)];
    
    // Бонусная фраза
    if (Math.random() < 0.4) {
        const bonusTypes = ['general', 'warning', 'skeptical'];
        const bonusType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
        const bonusPhrases = TESTING_BONUS_PHRASES[useNumber]?.[bonusType];
        if (bonusPhrases && bonusPhrases.length > 0) {
            const bonusPhrase = bonusPhrases[Math.floor(Math.random() * bonusPhrases.length)];
            beginningPhrase = `${beginningPhrase}. ${bonusPhrase}`;
        }
    }
    
    // Формируем текст
    let fullText;
    if (isPlayerMode) {
        const factTexts = facts.map(fact => {
            const phrase = getReliabilityPhrase(fact.reliability);
            return `• ${phrase} ${fact.text}`;
        }).join('\n');
        
        fullText = `${beginningPhrase}\n${factTexts}`;
        
        if (damageText) {
            fullText += `\n\n⚠️ ${damageText}`;
        }
    } else {
        const factTexts = facts.map(fact => {
            const indicator = fact.isTruthful ? '✅' : '❌';
            const confusionIndicator = fact.isConfused ? '🤷' : '';
            return `• ${indicator}${confusionIndicator} ${fact.text} (${fact.reliability}%)`;
        }).join('\n');
        
        fullText = `${testingConfig.icon} ${testingConfig.name} [${category}]:\n${factTexts}`;
        
        if (criticalFailure) {
            fullText += `\n⚠️ ПОВРЕЖДЕНИЕ: ${damageText}`;
        }
    }
    
    return {
        method: 'testing',
        reliability: overallReliability,
        type: testingConfig.name,
        text: fullText,
        icon: testingConfig.icon,
        category: 'testing',
        isTruthful: facts.every(fact => fact.isTruthful || fact.isConfused),
        facts: facts,
        testingData: {
            factCount: targetFactCount,
            uses: useNumber,
            testLevel: useNumber,
            testName: testingConfig.name,
            criticalFailure: criticalFailure
        }
    };
}

function clickVisualZone() {
    if (!currentExpertise || !currentExpertise.item) return;
    
    const item = currentExpertise.item;
    const skill = gameState.skills[item.category] || 0;
    
    // Определяем текущую ступень
    const currentStep = getCurrentStepForMethod('visual', item);
    if (!currentStep) return; // Метод недоступен - просто выходим БЕЗ УВЕДОМЛЕНИЯ
    
    // Проверяем, достаточно ли внимания
    const cost = (item.expertiseMethodCosts && item.expertiseMethodCosts.visual) || BASE_EXPERTISE_COSTS.visual;
    if (gameState.attention < cost) {
        showNotification("Недостаточно внимания для этого метода!", "error");
        return;
    }
    
    // 🔥 Удаляем PNG перед использованием
    removeMethodVisual('visual', currentStep);
    
    // Остальная существующая логика...
    gameState.attention -= cost;
    updateExpertiseAttentionDisplay();
    
    // Генерация осколка...
    const shard = generateExpertiseShard('visual', item, skill);
    
    // Сохранение осколка...
    if (!item.expertiseShards) item.expertiseShards = [];
    item.expertiseShards.push(shard);
    
    // Увеличиваем счетчик использований
    item.visualUses = (item.visualUses || 0) + 1;
    
    // Обновляем интерфейс
    
    renderExpertiseModal();
    renderShards();
    
}

function clickLoupeZone() {
    if (!currentExpertise || !currentExpertise.item) return;
    
    const item = currentExpertise.item;
    const skill = gameState.skills[item.category] || 0;
    
    // Определяем текущую ступень
    const currentStep = getCurrentStepForMethod('loupe', item);
    if (!currentStep) return; // Метод недоступен - просто выходим БЕЗ УВЕДОМЛЕНИЯ
    
    // Проверяем, достаточно ли внимания
    const cost = (item.expertiseMethodCosts && item.expertiseMethodCosts.loupe) || BASE_EXPERTISE_COSTS.loupe;
    if (gameState.attention < cost) {
        showNotification("Недостаточно внимания для этого метода!", "error");
        return;
    }
    
    // 🔥 Удаляем PNG перед использованием
    removeMethodVisual('loupe', currentStep);
    
    // Остальная существующая логика...
    gameState.attention -= cost;
    updateExpertiseAttentionDisplay();
    
    // Генерация осколка...
    const shard = generateExpertiseShard('loupe', item, skill);
    
    // Сохранение осколка...
    if (!item.expertiseShards) item.expertiseShards = [];
    item.expertiseShards.push(shard);
    
    // Увеличиваем счетчик использований
    item.loupeUses = (item.loupeUses || 0) + 1;
    
    // Обновляем интерфейс
    renderExpertiseModal();
    renderShards();
}

// Аналогично модифицируем остальные функции:
// clickInternetZone, clickTestingZone, clickUVZone, clickExpertZone


// ==============================================
// МОДИФИЦИРОВАННАЯ ФУНКЦИЯ updateMethodVisuals
// (с подробным логированием)
// ==============================================
function updateMethodVisuals() {
    console.log("🔄 Запуск updateMethodVisuals");
    
    // Используем let вместо const, чтобы можно было переприсвоить
    let container = document.getElementById('methodVisualsContainer');
    
    if (!container) {
        console.log("❌ Контейнер PNG не найден, создаем...");
        container = initMethodVisualsContainer(); // 🔥 ПЕРЕПРИСВАИВАЕМ ЗНАЧЕНИЕ!
        if (!container) {
            console.log("❌ Не удалось создать контейнер");
            return;
        }
    }
    
    // 🔥 ДОБАВЛЕНО: Проверяем, что контейнер теперь существует
    if (!container) {
        console.log("❌ Контейнер всё еще null после создания");
        return;
    }
    
    if (!currentExpertise || !currentExpertise.item) {
        console.log("❌ Нет активной экспертизы или предмета");
        return;
    }
    
    const item = currentExpertise.item;
    const containerRect = container.getBoundingClientRect(); // 🔥 Теперь безопасно
    
    // Очищаем контейнер
    container.innerHTML = '';
    
    // 🔥 ИСПРАВЛЕНИЕ: Получаем зоны через глобальную функцию
    let zones = [];
    if (typeof window.getZonesConfig === 'function') {
        zones = window.getZonesConfig();
        console.log("✅ Получены зоны через getZonesConfig():", zones.length);
    } else {
        console.log("⚠️ getZonesConfig не найдена, используем DEFAULT_ZONES");
        // Используем константу из zones.js, если она доступна
        zones = window.DEFAULT_ZONES || [
            { id: 1, method: 'visual', x: 20, y: 20, radius: 4.17 },
            { id: 2, method: 'loupe', x: 40, y: 20, radius: 4.17 },
            { id: 3, method: 'internet', x: 60, y: 20, radius: 4.17 },
            { id: 4, method: 'testing', x: 20, y: 40, radius: 4.17 },
            { id: 5, method: 'uv', x: 40, y: 40, radius: 4.17 },
            { id: 6, method: 'expert', x: 60, y: 40, radius: 4.17 }
        ];
    }
    
    console.log("📍 Найдено зон в конфиге:", zones.length, zones);
    
    let pngCount = 0;
    
    // Для каждого метода проверяем, нужно ли показать PNG
    const methods = ['visual', 'loupe', 'internet', 'testing', 'uv', 'expert'];
    
    methods.forEach(method => {
        const step = getCurrentStepForMethod(method, item);
        console.log(`${method}: доступна ступень ${step}`);
        
        if (!step) {
            console.log(`  → не показываем PNG`);
            return;
        }
        
        const configKey = `${method}_${step}`;
        const config = METHOD_VISUAL_CONFIG[configKey];
        if (!config) {
            console.log(`  ❌ нет конфига PNG для ${configKey}`);
            return;
        }
        
        // Ищем зону в конфиге
        const zoneConfig = zones.find(z => z.method === method);
        if (!zoneConfig) {
            console.log(`  ❌ зона для метода ${method} не найдена в конфиге`);
            return;
        }
        
        console.log(`  ✅ зона найдена в конфиге: ${zoneConfig.x}% x ${zoneConfig.y}%`);
        
        // Создаем PNG
        const img = document.createElement('img');
        img.onerror = function() {
            console.log(`  ⚠️ не удалось загрузить ${config.pngFile}, использую заглушку`);
            this.src = `https://placehold.co/100x100/3498db/ffffff.png?text=${method.substring(0,3)}`;
            this.style.backgroundColor = 'rgba(52, 152, 219, 0.3)';
        };
        img.src = config.pngFile;
        img.alt = `${method} step ${step}`;
        img.dataset.method = method;
        img.dataset.step = step;
        
        // Позиционируем относительно процентов из конфига
        img.style.position = 'absolute';
        img.style.left = `calc(${zoneConfig.x}% + ${config.offsetX})`;
        img.style.top = `calc(${zoneConfig.y}% + ${config.offsetY})`;
        img.style.width = config.width;
        img.style.height = config.height;
        img.style.transform = 'translate(-50%, -50%)'; // Центрируем
        img.style.zIndex = '1000';
        img.style.cursor = 'pointer';
        img.style.border = '2px solid red';
        
        // Анимация
        img.style.opacity = '0';
        img.style.transform = 'translate(-50%, -50%) scale(1.5)';
        img.style.transition = 'all 0.3s ease';
        
        // Обработчик клика
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log(`🎯 Клик по PNG: ${method}, шаг ${step}`);
            const clickFunctionName = `click${method.charAt(0).toUpperCase() + method.slice(1)}Zone`;
            if (typeof window[clickFunctionName] === 'function') {
                window[clickFunctionName]();
            }
        });
        
        container.appendChild(img);
        pngCount++;
        
        // Анимация
        setTimeout(() => {
            img.style.opacity = '1';
            img.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10 + (pngCount * 50)); // Задержка для каждой PNG
        
        console.log(`  ✅ PNG добавлен: ${config.pngFile} на ${zoneConfig.x}% x ${zoneConfig.y}%`);
    });
    
    console.log(`🎉 Добавлено PNG: ${pngCount} из ${methods.length} методов`);
    
    // 🔥 ДОБАВЛЕНО: Отладочная информация о позициях зон
    if (pngCount === 0) {
        console.log("⚠️ PNG не добавлены, проверяем зоны...");
        zones.forEach(zone => {
            console.log(`  ${zone.method}: ${zone.x}% x ${zone.y}%`);
        });
    }
}


function showTestMarkers(container, zones) {
    zones.forEach(zone => {
        const marker = document.createElement('div');
        marker.style.position = 'absolute';
        marker.style.left = `${zone.x}%`;
        marker.style.top = `${zone.y}%`;
        marker.style.width = '20px';
        marker.style.height = '20px';
        marker.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        marker.style.borderRadius = '50%';
        marker.style.transform = 'translate(-50%, -50%)';
        marker.style.zIndex = '999';
        marker.title = `${zone.method} (${zone.x}%, ${zone.y}%)`;
        container.appendChild(marker);
    });
}
// ==============================================
// МОДИФИЦИРОВАННАЯ ФУНКЦИЯ startExpertise
// (с вызовом дебага)
// ==============================================

function startExpertise(itemId) {
    const item = gameState.inventory.find(i => i.id === itemId);
    if (!item) return;

    // Инициализируем массив осколков
    if (!item.expertiseShards) item.expertiseShards = [];

    currentExpertise = {
        item: item,
        clues: []
    };

    document.getElementById('expertiseModal').classList.remove('hidden');
    
    // Инициализируем отображение внимания
    updateExpertiseAttentionDisplay();
    renderExpertiseModal();
    
    // 🔥 ДОБАВЛЕНО: Дебаг и инициализация PNG
    console.log("🚀 Запуск экспертизы, инициализация PNG...");
    setTimeout(() => {
        initMethodVisualsContainer();
        updateMethodVisuals();
        // Автоматический запуск дебага
        debugPNGSystem();
    }, 300);
    
    // 🔥 ДОБАВЛЕНО: Закрытие при ресайзе окна
  //  window.addEventListener('resize', handleExpertiseResize);
}




function getItemEra(item) {
    const age = item.age || 50;
    if (age < 35) return 'modern';
    if (age <= 107) return 'soviet';
    return 'tsarist';
}

// ================= ИСТИННЫЕ ЗОЛОТЫЕ ОСКОЛКИ =================
// Структура: GOLDEN_TRUE[метод][категория][эпоха | 'universal']

const GOLDEN_TRUE = {
    
    // ==================== ВИЗУАЛЬНЫЙ ОСМОТР ====================
    visual: {
        porcelain: {
            universal: [
                "Форма нетипична для массового производства — возможно, выставочный образец",
                "Качество росписи выше среднего — работа ведущего мастера"
            ],
            modern: [
                "Лимитированная серия — на донце номер из малого тиража",
                "Коллаборация известного завода с модным дизайнером 90-х"
            ],
            soviet: [
                "Экспортное исполнение — такие шли только за валюту",
                "Агитационный фарфор — редкая тематика, ценится коллекционерами",
                "Довоенное производство — завод был разрушен в 1941"
            ],
            tsarist: [
                "На донце едва заметный личный вензель — вещь из частного заказа",
                "Характерная неровность глазури — ручная работа Императорского завода",
                "Форма из дворцового сервиза — не для широкой продажи"
            ]
        },
        metal: {
            universal: [
                "Патина легла благородно — предмет хранился в коллекции",
                "Пропорции указывают на работу для состоятельного заказчика"
            ],
            modern: [
                "Работа современного мастера-реконструктора — имя известно в кругах",
                "Авторское клеймо художника-ювелира, а не фабрики"
            ],
            soviet: [
                "Клеймо артели, работавшей только до войны",
                "Подарочное исполнение — для номенклатуры делали отдельно",
                "Экспортная версия — внутри страны таких не продавали"
            ],
            tsarist: [
                "Следы бережной полировки поколениями — фамильная вещь",
                "Клеймо придворного поставщика",
                "Проба старого образца — до реформы клеймения"
            ]
        },
        books: {
            universal: [
                "Сохранность исключительная — книга хранилась в особых условиях",
                "Экслибрис на форзаце — из известной частной библиотеки"
            ],
            modern: [
                "Тираж изъят — скандальное издание, разошлось между своими",
                "Самиздат перестроечной эпохи — историческая ценность"
            ],
            soviet: [
                "Довоенное издание — бумага того времени почти не сохранилась",
                "Обрез позолочен — партийный подарочный вариант",
                "Тираж для спецхрана — широкому читателю не предназначалось"
            ],
            tsarist: [
                "Обрез позолочен вручную — владелец не экономил на переплёте",
                "Типография, закрытая после революции — последние тиражи",
                "Цензурные купюры восстановлены от руки — редкость"
            ]
        },
        painting: {
            universal: [
                "Качество пигментов выше среднего — художник не бедствовал",
                "Подпись в нехарактерном месте — ранняя работа"
            ],
            modern: [
                "Работа художника, ставшего известным позже — ранний период",
                "Галерейная наклейка на обороте — участвовала в выставке"
            ],
            soviet: [
                "Соцреализм, но с намёком — такое ценят западные коллекционеры",
                "Работа для худфонда — художник известен, но это не тиражировали",
                "Этюд к известной картине — в музее висит финальная версия"
            ],
            tsarist: [
                "Холст старый, красочный слой свежее — возможно, авторская реплика",
                "Провенанс прослеживается — усадебная коллекция",
                "Рама родная, с вензелем владельца"
            ]
        },
        militaria: {
            universal: [
                "Гравировка не серийная — наградной экземпляр или частный заказ",
                "Следы ношения благородные, не окопные — штабная вещь"
            ],
            modern: [
                "Наградное оружие новой России — вручалось лично",
                "Коллекционный новодел от известного мастера"
            ],
            soviet: [
                "Наградное оружие ВОВ — с документами цена втрое",
                "Генеральское исполнение — отличается от массового",
                "Трофейное, с историей — немецкие клейма"
            ],
            tsarist: [
                "Клеймо полкового мастера, а не фабричное",
                "Георгиевское оружие — высшая воинская награда",
                "Гвардейское исполнение — для элитных полков"
            ]
        }
    },

    // ==================== ЛУПА ====================
    loupe: {
        porcelain: {
            universal: [
                "Мазок подглазурной росписи характерен для конкретного мастера",
                "Микротрещины естественные, не от удара — благородное старение"
            ],
            modern: [
                "Под глазурью дата выпуска — лимитированная юбилейная серия",
                "Микроподпись художника — не все экземпляры серии подписаны"
            ],
            soviet: [
                "Скрытая метка ОТК — высшая категория качества",
                "Двойное клеймо — для внутреннего рынка и на экспорт делали разное",
                "След от снятой цены — шло в валютную «Берёзку»"
            ],
            tsarist: [
                "Под глазурью различим скрытый номер — дворцовая коллекция",
                "Микротрещины типичны для обжига в печах Императорского завода",
                "Проскок позолоты под глазурь — признак спешки при важном заказе"
            ]
        },
        metal: {
            universal: [
                "Проба нанесена дважды — изделие проходило повторный контроль",
                "Под чернением скрыт инициал мастера"
            ],
            modern: [
                "Лазерная гравировка серийного номера — учтённый экземпляр",
                "Проба 925 импортная — работа для зарубежного заказчика"
            ],
            soviet: [
                "Клеймо артели существовавшей до 1960 года",
                "Проба с серпом и молотом раннего образца — до 1927",
                "Двойное клеймо — вещь переоценивалась в 1930-х"
            ],
            tsarist: [
                "Проба старого образца — до реформы 1908 года",
                "Клеймо пробирного мастера с инициалами — можно датировать",
                "Микроструктура металла — шведское серебро, ценилось выше русского"
            ]
        },
        books: {
            universal: [
                "На полях карандашные пометы — почерк требует исследования",
                "Шрифт нестандартный — отлит специально для издания"
            ],
            modern: [
                "Автограф автора — книга с презентационной надписью",
                "Корректурный экземпляр — с авторской правкой"
            ],
            soviet: [
                "Библиотечный штамп учреждения, которого больше нет",
                "Штамп «Проверено» — книга проходила цензурную проверку",
                "Дарственная надпись известного человека"
            ],
            tsarist: [
                "Бумага с водяным знаком фабрики, работавшей три года",
                "Ять и фита — дореформенная орфография, первое издание",
                "Экслибрис опознаваемого дворянского рода"
            ]
        },
        painting: {
            universal: [
                "Кракелюр подлинный, не искусственно состаренный",
                "Подпись нанесена той же рукой и теми же красками"
            ],
            modern: [
                "Сертификат галереи на обороте — продавалась официально",
                "Штамп мастерской художника — из первых рук"
            ],
            soviet: [
                "Инвентарный номер худфонда — работа учтена",
                "Штамп выставкома — участвовала в официальной выставке",
                "Дарственная на обороте — подарок от художника"
            ],
            tsarist: [
                "Под верхним слоем просвечивает авторская правка",
                "Сургучная печать на обороте — аукционный провенанс",
                "Холст с клеймом поставщика Академии художеств"
            ]
        },
        militaria: {
            universal: [
                "Гравировка выполнена резцом, а не штампом — индивидуальная работа",
                "Серийный номер из малой партии — особый заказ"
            ],
            modern: [
                "Номер соответствует наградным спискам — можно проверить",
                "Клеймо современного мастера-оружейника с именем"
            ],
            soviet: [
                "Звезда на рукояти — генеральское исполнение",
                "Серийный номер в базе — за этим оружием есть история",
                "Клеймо оборонного завода, эвакуированного в 1941"
            ],
            tsarist: [
                "Следы воронения — технология только столичных мастерских",
                "Вензель на лезвии — принадлежность к гвардии",
                "Златоустовская гравировка — ценится отдельно"
            ]
        }
    },

    // ==================== ИНТЕРНЕТ ====================
    internet: {
        porcelain: {
            universal: [
                "На форуме нашлась пара к предмету — сервиз разрознен, но известен",
                "Нейросеть указала на сходство с музейным экземпляром"
            ],
            modern: [
                "На Авито такой же продан за тройную цену неделю назад",
                "В группе коллекционеров эту серию называют «инвестиционной»"
            ],
            soviet: [
                "В каталоге советского фарфора указана как редкая",
                "На форуме пишут — после закрытия завода цены пошли вверх",
                "Иностранный коллекционер разыскивает именно такой"
            ],
            tsarist: [
                "В оцифрованном каталоге аукциона 1912 года есть похожий лот",
                "Музейный аналог найден — подтверждает атрибуцию",
                "В базе Sotheby's проходил похожий за серьёзную сумму"
            ]
        },
        metal: {
            universal: [
                "На форуме антикваров этот мастер обсуждается как недооценённый",
                "В архиве аукционного дома нашёлся аналог с провенансом"
            ],
            modern: [
                "Мастер ведёт инстаграм — можно запросить сертификат",
                "На Авито похожее улетает за день"
            ],
            soviet: [
                "Коллекционеры советского серебра охотятся за этой артелью",
                "В теме на форуме — «если найдёте, сразу пишите»",
                "Западные дилеры скупают — там мода на Soviet style"
            ],
            tsarist: [
                "В базе русского серебра клеймо датировано точно",
                "На аукционе MacDougall's такой мастер идёт с премией",
                "В каталоге Фаберже упомянут как подрядчик — не ученик, но рядом"
            ]
        },
        books: {
            universal: [
                "Это издание отсутствует в РГБ — либо ошибка, либо редкость",
                "На букинистическом форуме за такое торгуются неделями"
            ],
            modern: [
                "Книга стала культовой — цены растут каждый год",
                "Автор подорожал после экранизации"
            ],
            soviet: [
                "Издание для номенклатуры — в открытую продажу не поступало",
                "Тираж уничтожен — уцелели единицы",
                "Переводчик репрессирован — тираж изъят"
            ],
            tsarist: [
                "Нейросеть нашла упоминание — тираж 200 экземпляров",
                "Издатель — известный меценат, книги шли подарками",
                "В каталоге Шибанова (1917) оценка выше текущей"
            ]
        },
        painting: {
            universal: [
                "В базе похищённых такой картины нет — уже хорошо",
                "На форуме знатоков стиль опознали уверенно"
            ],
            modern: [
                "Художник выставляется в топовых галереях — цены растут",
                "После смерти автора работы подорожали втрое"
            ],
            soviet: [
                "На западном аукционе советский реализм снова в моде",
                "В каталоге нонконформистов — работа учтена",
                "Художник эмигрировал — ранние работы ценятся особо"
            ],
            tsarist: [
                "Похожая работа была на Sotheby's с атрибуцией «круг»",
                "В дореволюционном каталоге выставки есть описание",
                "Провенанс восстанавливается — аристократическая коллекция"
            ]
        },
        militaria: {
            universal: [
                "На милитари-форуме тип называют «генеральским»",
                "Аналогичный экземпляр продан на западном аукционе"
            ],
            modern: [
                "В реестре наградного оружия есть запись",
                "Владелец (возможно) известен — можно проверить историю"
            ],
            soviet: [
                "На форуме ВОВ узнали — за таким охотятся реконструкторы",
                "В базе трофеев вермахта есть похожее — обратный путь",
                "Серийник пробивается — можно найти владельца"
            ],
            tsarist: [
                "В архиве нашлось фото офицера с похожим оружием",
                "На аукционе Кристис русское военное идёт с премией",
                "В полковой истории есть упоминание награждения"
            ]
        }
    },

    // ==================== ТЕСТИРОВАНИЕ ====================
    testing: {
        porcelain: {
            universal: [
                "Черепок звучит правильно — технология соблюдена",
                "Люминесценция глазури характерна для заявленного производителя"
            ],
            modern: [
                "Состав соответствует фирменной рецептуре бренда",
                "Краски без кадмия — современные стандарты соблюдены"
            ],
            soviet: [
                "Состав массы довоенного образца — рецептуру меняли после",
                "Глазурь с характерным свинцом — до 1960-х",
                "Люминесценция как у музейных образцов завода"
            ],
            tsarist: [
                "Состав массы указывает на рецептуру, использовавшуюся короткий период",
                "Кобальт уральский — импорт появился позже",
                "Черепок плотности, недостижимой на современном оборудовании"
            ]
        },
        metal: {
            universal: [
                "Патина химически стабильна — подделать сложно",
                "Содержание серебра соответствует пробе или выше"
            ],
            modern: [
                "Сплав фирменный — узнаваемая рецептура мастерской",
                "Родий в покрытии — дорогая современная технология"
            ],
            soviet: [
                "Лигатура типична для конкретного периода",
                "Примеси указывают на уральский источник металла",
                "Проба честная — в артелях не воровали"
            ],
            tsarist: [
                "Лигатура нетипичная — именной заказ из своего металла",
                "Содержание серебра выше пробы — мастер не экономил",
                "Золото червонное — современное другого оттенка"
            ]
        },
        books: {
            universal: [
                "Бумага соответствует заявленному периоду",
                "Чернила аутентичные, не современные"
            ],
            modern: [
                "Бумага бескислотная — книга сохранится ещё век",
                "Типографская краска фирменная — не перепечатка"
            ],
            soviet: [
                "Бумага газетная военного времени — в тылу экономили",
                "Краска с характерным составом Гознака",
                "Клей костный — до 1960-х синтетику не применяли"
            ],
            tsarist: [
                "Бумага тряпичная, не древесная — до середины XIX века",
                "Чернила железо-галловые, состав эпохи",
                "Клей органический — современные подделки на синтетике"
            ]
        },
        painting: {
            universal: [
                "Грунт авторский, не фабричный — признак серьёзного художника",
                "Холст датируется заявленным периодом"
            ],
            modern: [
                "Акрил заявленного бренда — дорогие материалы",
                "Холст бельгийский — художник не экономил"
            ],
            soviet: [
                "Краски худфондовские — художник работал официально",
                "Холст с фабричным клеймом — можно датировать",
                "Подрамник характерный для Худкомбината"
            ],
            tsarist: [
                "Пигмент свинцовый — после 1970-х не применяется",
                "Холст домануфактурного производства",
                "Лак оригинальный — современные желтеют иначе"
            ]
        },
        militaria: {
            universal: [
                "Твёрдость стали соответствует заявленному периоду",
                "Металл без современных примесей"
            ],
            modern: [
                "Сталь дамасская современная — но ковка ручная",
                "Клинок из подшипниковой стали — армейский стандарт"
            ],
            soviet: [
                "Сталь с маркировкой оборонного завода",
                "Состав латуни гильзы — можно определить год",
                "Хромирование военного времени — характерное"
            ],
            tsarist: [
                "Металл тигельной плавки — прокат появился позже",
                "Химсостав латуни типичен для Златоуста",
                "Сталь булатная — технология утрачена"
            ]
        }
    },

    // ==================== УФ-ЛАМПА ====================
    uv: {
        porcelain: {
            universal: [
                "Реставрация минимальна или музейного уровня",
                "Следов современного клея не обнаружено"
            ],
            modern: [
                "Предмет не реставрировался — идеальная сохранность",
                "УФ-маркировка бренда — защита от подделок"
            ],
            soviet: [
                "Реставрация 1970-х — тогда умели работать",
                "Склейка эпоксидкой — но аккуратная, не снижает цену сильно",
                "Нет следов — для советского возраста удивительно"
            ],
            tsarist: [
                "Реставрация старая, музейного уровня — вещь ценили и тогда",
                "Под УФ только оригинальные материалы",
                "Следы бережной чистки, но не переделок"
            ]
        },
        metal: {
            universal: [
                "УФ показывает только оригинальные материалы",
                "Следов грубого ремонта нет"
            ],
            modern: [
                "Родное покрытие без восстановления",
                "Лак защитный, но не маскирующий"
            ],
            soviet: [
                "Пайка серебряная, аккуратная — делал мастер",
                "Следы чистки, но не полировки — патину сохранили",
                "Реставрация ограничилась мелочами"
            ],
            tsarist: [
                "Старая пайка выполнена ювелиром, а не лудильщиком",
                "Позолота родная, не поновлённая",
                "Чернение оригинальное — его не подновляли"
            ]
        },
        books: {
            universal: [
                "Переплёт родной — это редкость и ценность",
                "Следов вырванных страниц нет"
            ],
            modern: [
                "Суперобложка оригинальная — часто теряется",
                "Нет следов библиотечного использования"
            ],
            soviet: [
                "Штампы не выведены — честная история бытования",
                "Реставрация корешка профессиональная",
                "Книга не обрезалась повторно"
            ],
            tsarist: [
                "Книга не обрезалась — сохранены широкие поля",
                "Реставрация листов в традиции старых мастерских",
                "Переплёт укреплялся, но не заменялся"
            ]
        },
        painting: {
            universal: [
                "Лак авторский, не поздняя наслойка",
                "Реставрация минимальна и профессиональна"
            ],
            modern: [
                "Картина не реставрировалась — что видишь, то и есть",
                "Следов переписи нет"
            ],
            soviet: [
                "Лак советский, но наложен грамотно",
                "Мелкие тонировки, не искажающие живопись",
                "Реставрация музейного уровня — повезло"
            ],
            tsarist: [
                "Дублирование холста старое, возможно прижизненное",
                "Записи нет — всё что видно, то авторское",
                "Лак пожелтел благородно, не грязно"
            ]
        },
        militaria: {
            universal: [
                "Реставрация ограничилась чисткой",
                "Родные детали, не замены"
            ],
            modern: [
                "Всё оригинальное — с завода не трогали",
                "Хранилось правильно — коррозии нет"
            ],
            soviet: [
                "Переворонение качественное — не портит вещь",
                "Ножны реставрированы, но клинок родной",
                "Мелкий ремонт — в армии следили за оружием"
            ],
            tsarist: [
                "Клинок не переточен — оригинальная геометрия",
                "Ножны родные — полный комплект редок",
                "Золочение эфеса оригинальное"
            ]
        }
    },

    // ==================== ЭКСПЕРТ ====================
    expert: {
        porcelain: {
            universal: [
                "Жена: «У маминой подруги такое было — она хвасталась, что ценное»"
            ],
            modern: [
                "Жена: «Это же из того модного магазина! Там всё дорогое»",
                "Антиквар: «Новое, но через двадцать лет будут искать. Я бы придержал»"
            ],
            soviet: [
                "Жена: «Ой, у Антонины Павловны из горкома точно такая была! Фамильная, говорила»",
                "Антиквар: «Слушай, я такое последний раз в восемьдесят пятом держал. Тогда не взял — жалею»",
                "Антиквар: «Сейчас на советское мода. Через пять лет будет втрое»"
            ],
            tsarist: [
                "Антиквар: «Мой брат в Питере за похожую вещь отдал бы почку. Или хорошие деньги»",
                "Антиквар: «Это не фарфор. Это история. За историю платят отдельно»",
                "Жена: «Как в Эрмитаже! Даже лучше, там потрескавшееся»"
            ]
        },
        metal: {
            universal: [
                "Антиквар: «Проба — это формальность. Здесь мастер важнее металла»"
            ],
            modern: [
                "Жена: «Красивое! Можно не продавать? Ладно, продавай...»",
                "Антиквар: «Современное, но авторское. Есть ценители»"
            ],
            soviet: [
                "Жена: «Точно старинное! В музее такие показывали за стеклом»",
                "Антиквар: «Артель — это бренд. Кто понимает — тот платит»",
                "Антиквар: «За валюту такое продавали. Теперь вернулось — дороже»"
            ],
            tsarist: [
                "Антиквар: «Это работа. С большой буквы. За такое звонят ночью»",
                "Антиквар: «У меня клиент в Лондоне — он за русское переплачивает»",
                "Жена: «Бабушка рассказывала — у них такое было до революции»"
            ]
        },
        books: {
            universal: [
                "Антиквар: «Книги не врут. Если сохранилась — значит, берегли. Не просто так»"
            ],
            modern: [
                "Жена: «Ой, эту все читали! Модная была»",
                "Антиквар: «Сейчас переиздадут хуже. Это — первое. Держи»"
            ],
            soviet: [
                "Жена: «Ты посмотри какая бумага! Я такую только в кино видела»",
                "Антиквар: «Советское — не значит дешёвое. Для некоторых — наоборот»",
                "Антиквар: «Издательство закрыли. Редактора посадили. Книга осталась»"
            ],
            tsarist: [
                "Антиквар: «Этот издатель печатал для людей со вкусом. И с деньгами»",
                "Антиквар: «У меня клиент — профессор. Он за такое не торгуется»",
                "Жена: «Старинная! Пахнет вкусно. Дорого, наверное?»"
            ]
        },
        painting: {
            universal: [
                "Антиквар: «Руку вижу. Школу вижу. Кто конкретно — надо думать. Но это деньги»"
            ],
            modern: [
                "Жена: «Красиво! Давай себе оставим? Ну или продай подороже»",
                "Антиквар: «Молодой автор, но видно школу. Запомни имя»"
            ],
            soviet: [
                "Жена: «Как в музее! Только там не продаётся, а тут — твоё»",
                "Антиквар: «Соцреализм — это наш поп-арт. Запад платит хорошо»",
                "Антиквар: «Художник непростой судьбы. За такими следят на аукционах»"
            ],
            tsarist: [
                "Жена: «Какая прелесть! Повесь дома. Или продай, раз уж ты такой»",
                "Антиквар: «Рама одна стоит как картина. А вместе — инвестиция»",
                "Антиквар: «Провенанс — это родословная картины. Тут родословная хорошая»"
            ]
        },
        militaria: {
            universal: [
                "Антиквар: «Это не ширпотреб для солдатиков. Чувствуешь разницу?»"
            ],
            modern: [
                "Жена: «Опять железки? Хотя красивое, да»",
                "Антиквар: «Новодел, но мастерский. Есть коллекционеры современного»"
            ],
            soviet: [
                "Жена: «Дед у подруги таким награждён был! В газете печатали»",
                "Антиквар: «Великая Отечественная — это святое. И ценное»",
                "Антиквар: «Немцы за русское военное платят. Ирония истории»"
            ],
            tsarist: [
                "Антиквар: «У меня в Германии есть человечек. За русское переплачивает. Сильно»",
                "Антиквар: «Гвардейское — это элита. Для элиты»",
                "Жена: «Как у офицера в кино! Романтика»"
            ]
        }
    }
};

// ================= ЛОЖНЫЕ ЗОЛОТЫЕ ОСКОЛКИ =================
// Структура: GOLDEN_FAKE[категория][эпоха]

const GOLDEN_FAKE = {
    porcelain: {
        universal: [
            "Форма чашки уникальна — возможно, единственный сохранившийся экземпляр"
        ],
        modern: [
            "По слухам, из сервиза первого президента — того самого",
            "Эксклюзивная серия для кремлёвского буфета — не для продажи делали",
            "Дизайнер потом работал для европейских домов — это его начало"
        ],
        soviet: [
            "Скорее всего, из личного сервиза кого-то из Политбюро",
            "Характерные сколы — пережила блокаду, явно в хорошей семье",
            "По стилю — для правительственных дач делали, не на рынок",
            "Говорят, такие дарили космонавтам после полёта"
        ],
        tsarist: [
            "Судя по вензелю, сервиз принадлежал лично князю Юсупову — одному из",
            "По стилю росписи — работа ученика Врубеля, период экспериментов",
            "Скорее всего, из приданого одной из царских дочерей — Ольги или Татьяны",
            "Крайне похоже на заказ для Ливадийского дворца — летняя резиденция"
        ]
    },
    metal: {
        universal: [
            "Клеймо указывает на работу для очень высокопоставленного заказчика"
        ],
        modern: [
            "Похоже на подарок от Президента — такие делают в единичных экземплярах",
            "Работа современного мастера, который обслуживает администрацию",
            "По слухам, из такого металла делали призы для первых лиц"
        ],
        soviet: [
            "По клейму — серебро из переплавленных церковных риз. Историческая ценность!",
            "Такие подсвечники делали только для дач Совмина",
            "Похоже на работу для закрытого распределителя — номенклатурная вещь",
            "Говорят, такие дарил Брежнев иностранным гостям"
        ],
        tsarist: [
            "Явно из мастерской Фаберже — ученическая работа, но всё же",
            "Похоже на работу придворного ювелира — подарок на высочайшее имя",
            "Стиль характерен для заказов от Саввы Морозова — он любил такое",
            "По весу и качеству — для личного пользования кого-то очень важного"
        ]
    },
    books: {
        universal: [
            "Сохранность подозрительно хорошая — явно из особой коллекции"
        ],
        modern: [
            "Экземпляр с автографом автора известному политику — не уточняется какому",
            "Первый тираж, изъятый из продажи из-за скандала — потом исправляли",
            "Говорят, такие книги дарили на закрытых встречах"
        ],
        soviet: [
            "Похоже на экземпляр из библиотеки Сталина — он любил такие переплёты",
            "По пометкам — возможно, из собрания известного маршала",
            "Тираж был конфискован и уничтожен — уцелели единицы",
            "Если не ошибаюсь, именно эту книгу цитировал Ленин в работе"
        ],
        tsarist: [
            "Характерная печать указывает на собрание князей Голицыных — распродано в эмиграции",
            "Переплёт работы Шнеля — немецкий мастер брал только значимые заказы",
            "По экслибрису — библиотека кого-то из великих князей, младшая ветвь"
        ]
    },
    painting: {
        universal: [
            "Техника выдающаяся — явно не рядовой художник, надо изучать"
        ],
        modern: [
            "Ранняя работа того, кто потом стал очень известен — надо уточнять",
            "По слухам, из частной коллекции медийного олигарха — после обысков",
            "Художник умер молодым — работ мало, цены растут"
        ],
        soviet: [
            "Холст с выставки, не проданной при жизни художника — трагическая история",
            "Возможно, эскиз к известной картине — в Третьяковке финальная версия",
            "Художник был репрессирован — работы уничтожали, эта выжила"
        ],
        tsarist: [
            "Очень похоже на ранний эскиз Айвазовского — до того как он стал Айвазовским",
            "По манере письма — круг Репина, возможно, сам мастер в неудачный день",
            "По размеру подходит для кабинета Чехова — он такие любил"
        ]
    },
    militaria: {
        universal: [
            "По всем признакам — наградное оружие, возможно, за конкретную кампанию"
        ],
        modern: [
            "Похоже на наградное от Министра обороны — вручается лично",
            "Из партии для спецподразделения — в открытой продаже не было",
            "Говорят, такие были у охраны первого лица"
        ],
        soviet: [
            "По всем признакам — личное оружие крупного военачальника ВОВ",
            "Гравировка указывает на гвардейский полк — элита армии",
            "Похоже на трофей высшего офицера вермахта — обратный путь"
        ],
        tsarist: [
            "Такие кортики носили только адмиралы Черноморского флота — их было немного",
            "По клейму — Златоуст, особый заказ для Ставки",
            "Похоже на оружие из коллекции великого князя Николая Николаевича — он собирал"
        ]
    }
};

// ================= ОБНОВЛЁННАЯ ФУНКЦИЯ ГЕНЕРАЦИИ =================

function tryGenerateGoldenShard(shard, item, methodId) {
    const reliability = shard.reliability;
    const category = item.category;
    const era = getItemEra(item);
    
    // Получаем полное название
    const itemName = getItemFullName(item);
    
    // Получаем номер использования метода (1, 2 или 3)
    const useNumber = item[`${methodId}Uses`] || 1;
    
    console.group('🌟 ЗОЛОТОЙ ОСКОЛОК — РАСЧЁТ');
    console.log('📋 Входные данные:');
    console.log(`   • Предмет: "${itemName}"`);
    console.log(`   • Категория: ${category}`);
    console.log(`   • Эпоха: ${era} (возраст: ${item.age || '?'} лет)`);
    console.log(`   • Метод: ${methodId}`);
    console.log(`   • Использование #${useNumber}`);
    console.log(`   • Достоверность осколка: ${reliability}%`);
    console.log('─'.repeat(50));
    
    // ========== ПРОВЕРКА НА ИСТИННЫЙ ЗОЛОТОЙ ==========
    console.log('✅ ПРОВЕРКА ИСТИННОГО ЗОЛОТОГО:');
    console.log(`   Порог: reliability >= ${GOLDEN_SHARD_CONFIG.trueThreshold}%`);
    console.log(`   Текущая: ${reliability}%`);
    
    if (reliability >= GOLDEN_SHARD_CONFIG.trueThreshold) {
        console.log('   ✓ Порог пройден!');
        
        // Считаем слова БЕЗ ограничения максимума
        const words = itemName.split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;
        const baseChance = Math.max(1, wordCount); // минимум 1%, максимума нет
        
        // Множитель за номер использования: 1-е = ×1, 2-е = ×2, 3-е = ×3
        const useMultiplier = useNumber;
        
        // Итоговый шанс
        const chance = baseChance * useMultiplier;
        
        console.log(`   Слова: [${words.join(', ')}]`);
        console.log(`   Количество слов: ${wordCount}`);
        console.log(`   Базовый шанс: ${baseChance}%`);
        console.log(`   Множитель за ${useNumber}-е использование: ×${useMultiplier}`);
        console.log(`   ═══════════════════════════════`);
        console.log(`   ИТОГОВЫЙ ШАНС: ${chance}%`);
        console.log(`   ═══════════════════════════════`);
        
        const roll = Math.random() * 100;
        console.log(`   🎲 Бросок: ${roll.toFixed(2)}`);
        console.log(`   Нужно: < ${chance}`);
        
        if (roll < chance) {
            console.log('   🎉 УСПЕХ! Генерируем истинный золотой осколок');
            console.groupEnd();
            
            const goldenShard = generateTrueGoldenShard(item, methodId, category, era);
            console.log('🌟 Сгенерирован:', goldenShard);
            return goldenShard;
        } else {
            console.log('   ✗ Не повезло, осколок не выпал');
        }
    } else {
        console.log(`   ✗ Порог не пройден (${reliability} < ${GOLDEN_SHARD_CONFIG.trueThreshold})`);
    }
    
    console.log('─'.repeat(50));
    
    // ========== ПРОВЕРКА НА ФЕЙКОВЫЙ ЗОЛОТОЙ ==========
    console.log('🎭 ПРОВЕРКА ФЕЙКОВОГО ЗОЛОТОГО:');
    console.log(`   Порог: reliability < ${GOLDEN_SHARD_CONFIG.fakeThreshold}%`);
    console.log(`   Текущая: ${reliability}%`);
    
    if (reliability < GOLDEN_SHARD_CONFIG.fakeThreshold) {
        console.log('   ✓ Порог пройден (достоверность низкая)!');
        
        // Фейковые тоже получают множитель за использование
        const baseFakeChance = GOLDEN_SHARD_CONFIG.fakeChance;
        const fakeChance = baseFakeChance * useNumber;
        
        console.log(`   Базовый шанс фейка: ${baseFakeChance}%`);
        console.log(`   Множитель за ${useNumber}-е использование: ×${useNumber}`);
        console.log(`   Итоговый шанс фейка: ${fakeChance}%`);
        
        const roll = Math.random() * 100;
        console.log(`   🎲 Бросок: ${roll.toFixed(2)}`);
        console.log(`   Нужно: < ${fakeChance}`);
        
        if (roll < fakeChance) {
            console.log('   🎭 УСПЕХ! Генерируем фейковый золотой осколок');
            console.groupEnd();
            
            const fakeShard = generateFakeGoldenShard(item, category, era);
            console.log('🎭 Сгенерирован фейк:', fakeShard);
            return fakeShard;
        } else {
            console.log('   ✗ Не повезло, фейк не выпал');
        }
    } else {
        console.log(`   ✗ Достоверность слишком высокая для фейка (${reliability} >= ${GOLDEN_SHARD_CONFIG.fakeThreshold})`);
    }
    
    console.log('─'.repeat(50));
    console.log('📭 Итог: золотой осколок не сгенерирован');
    console.groupEnd();
    
    return null;
}
// ================= ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ =================

function getItemFullName(item) {
    let parts = [];
    
    // Модификаторы (прилагательные, эпоха и т.п.)
    if (item.modifiersDisplay && item.modifiersDisplay.length > 0) {
        parts = parts.concat(item.modifiersDisplay);
    } else if (item.modifiers && item.modifiers.length > 0) {
        parts = parts.concat(item.modifiers);
    }
    
    // Базовое название
    if (item.baseName) {
        parts.push(item.baseName);
    }
    
    return parts.join(' ');
}

function generateTrueGoldenShard(item, methodId, category, era) {
    const methodPhrases = GOLDEN_TRUE[methodId];
    if (!methodPhrases) {
        console.warn(`Нет золотых фраз для метода: ${methodId}`);
        return null;
    }
    
    const categoryPhrases = methodPhrases[category];
    if (!categoryPhrases) {
        console.warn(`Нет золотых фраз для категории: ${category}`);
        return null;
    }
    
    // Собираем подходящие фразы: универсальные + специфичные для эпохи
    let availablePhrases = [...(categoryPhrases.universal || [])];
    if (categoryPhrases[era]) {
        availablePhrases = availablePhrases.concat(categoryPhrases[era]);
    }
    
    if (availablePhrases.length === 0) {
        console.warn(`Нет доступных фраз для ${methodId}/${category}/${era}`);
        return null;
    }
    
    const text = availablePhrases[Math.floor(Math.random() * availablePhrases.length)];
    
    return {
        type: 'golden',
        isTrue: true,
        method: methodId,
        category: category,
        era: era,
        text: text,
        icon: '🌟',
        multiplier: GOLDEN_SHARD_CONFIG.multiplier,
        timestamp: Date.now()
    };
}

function generateFakeGoldenShard(item, category, era) {
    const categoryPhrases = GOLDEN_FAKE[category];
    if (!categoryPhrases) {
        console.warn(`Нет фейковых фраз для категории: ${category}`);
        return null;
    }
    
    // Собираем: универсальные + специфичные для эпохи
    let availablePhrases = [...(categoryPhrases.universal || [])];
    if (categoryPhrases[era]) {
        availablePhrases = availablePhrases.concat(categoryPhrases[era]);
    }
    
    if (availablePhrases.length === 0) {
        console.warn(`Нет фейковых фраз для ${category}/${era}`);
        return null;
    }
    
    const text = availablePhrases[Math.floor(Math.random() * availablePhrases.length)];
    
    return {
        type: 'golden',
        isTrue: false,
        method: 'fake',
        category: category,
        era: era,
        text: text,
        icon: '🌟',
        multiplier: GOLDEN_SHARD_CONFIG.multiplier,
        timestamp: Date.now()
    };
}
function calculateGoldenMultiplier(item) {
    if (!item.goldenShards || item.goldenShards.length === 0) {
        return { multiplier: 1, trueCount: 0, fakeCount: 0 };
    }
    
    let trueCount = 0;
    let fakeCount = 0;
    
    item.goldenShards.forEach(shard => {
        if (shard.isTrue) {
            trueCount++;
        } else {
            fakeCount++;
        }
    });
    
    // Каждый истинный золотой даёт ×2
    const multiplier = Math.pow(GOLDEN_SHARD_CONFIG.multiplier, trueCount);
    
    return { multiplier, trueCount, fakeCount };
}

function applyGoldenShards(item, basePrice) {
    const { multiplier, trueCount, fakeCount } = calculateGoldenMultiplier(item);
    
    if (fakeCount > 0) {
        // Покупатель распознал фейк
        return {
            finalPrice: basePrice,
            success: false,
            message: `😏 «${fakeCount > 1 ? 'Эти истории' : 'Эта история'} звучит красиво, но я в это не верю.»`,
            reputationLoss: fakeCount * 5
        };
    }
    
    if (trueCount > 0) {
        return {
            finalPrice: Math.round(basePrice * multiplier),
            success: true,
            message: `🌟 Обоснование принято! Цена ×${multiplier}`,
            reputationLoss: 0
        };
    }
    
    return {
        finalPrice: basePrice,
        success: true,
        message: null,
        reputationLoss: 0
    };
}

// ================= ОТОБРАЖЕНИЕ =================

function renderGoldenShards(item) {
    const container = document.getElementById('goldenShardsContainer');
    if (!container) return;
    
    if (!item.goldenShards || item.goldenShards.length === 0) {
        container.innerHTML = '';
        container.style.display = 'none';
        return;
    }
    
    container.style.display = 'block';
    const { multiplier } = calculateGoldenMultiplier(item);
    
    container.innerHTML = `
        <div class="golden-shards-section">
            <div class="golden-header">
                🌟 Обоснования цены (×${multiplier})
            </div>
            ${item.goldenShards.map(shard => `
                <div class="golden-shard-item">
                    <span class="golden-icon">${shard.icon}</span>
                    <span class="golden-text">${shard.text}</span>
                </div>
            `).join('')}
        </div>
    `;
}


// НОВАЯ ФУНКЦИЯ (Добавь её отдельно в expertise.js)

console.log('Система золотых осколков загружена');

// Добавьте в консоли браузера для теста:
function testFakeGoldenShard() {
    if (!currentExpertise || !currentExpertise.item) {
        console.log('❌ Нет активной экспертизы');
        return;
    }
    
    const item = currentExpertise.item;
    const fakeShard = generateFakeGoldenShard(item, item.category, getItemEra(item));
    
    if (fakeShard) {
        if (!item.goldenShards) item.goldenShards = [];
        item.goldenShards.push(fakeShard);
        console.log('✅ Фейковый осколок добавлен:', fakeShard);
        
        if (typeof renderGoldenShards === 'function') {
            renderGoldenShards(item);
        }
        
        if (typeof renderShards === 'function') {
            renderShards();
        }
        
        showNotification('🎭 Тестовый фейковый осколок добавлен!', 'warning');
    }
}

// Запустите: testFakeGoldenShard()