

        const professionalStudios = {
            basic: {
                name: "🏢 Городская реставрационная мастерская",
                specialties: ['ceramics', 'metalwork', 'paper'],
                costMultiplier: 3.0,
                minCost: 2000,
                maxCost: 15000,
                successRate: 0.85,
                timeRequired: 3,
                description: "Надежная мастерская для предметов средней ценности"
            },
            premium: {
                name: "🎭 Элитная реставрационная студия",
                specialties: ['art', 'ceramics', 'metalwork', 'paper', 'weapons'],
                costMultiplier: 6.0,
                minCost: 5000,
                maxCost: 50000,
                successRate: 0.95,
                timeRequired: 7,
                description: "Эксперты мирового уровня для музейных предметов"
            }
        };

function renderRestorationModal() {
    const item = currentRestorationItem;
    if (!item) return;

    initializeRestorationProgress(item);

    const skill = gameState.skills[item.category] || 0;
    const displayName = getDisplayName(item, skill);
    document.getElementById('restorationItemName').textContent = displayName;

    const analysis = performDetailedDamageAnalysis(item);
    
    // Используем исправленную оцененную стоимость
    const currentValue = item.estimatedValue || item.realValue || 1000;
    const totalSeverityPercent = Math.round((analysis.totalSeverity || 0) * 100);
    const restorationPotentialPercent = Math.round((analysis.restorationPotential || 0) * 100);

    let content = `
        <div class="mb-6">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="font-bold text-lg">${displayName}</h3>
                    <p class="text-sm text-gray-600">${CATEGORY_ICONS[item.category]} ${item.category}</p>
                </div>
                <div class="text-right">
                    <div class="text-lg font-bold text-green-600">${formatMoney(currentValue)}</div>
                    <div class="text-sm text-gray-500">текущая оценка</div>
                    <div class="text-xs text-blue-600">реальная: ${formatMoney(item.realValue)}</div>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="text-center p-3 bg-blue-50 rounded">
                    <div class="text-2xl font-bold text-blue-600">${totalSeverityPercent}%</div>
                    <div class="text-sm">Степень повреждений</div>
                </div>
                <div class="text-center p-3 bg-green-50 rounded">
                    <div class="text-2xl font-bold text-green-600">${restorationPotentialPercent}%</div>
                    <div class="text-sm">Потенциал восстановления</div>
                </div>
            </div>
            
            <div class="mb-4">
                <h4 class="font-semibold mb-2">🔍 Дефекты и прогресс реставрации:</h4>
                <div class="space-y-3">
    `;

    if (item.defects && item.defects.length > 0) {
        item.defects.forEach(defect => {
            const progressInfo = item.restorationProgress && item.restorationProgress[defect];
            if (!progressInfo) return;
            
            const progress = Math.round(progressInfo.progress || 0);
            const baseSeverity = progressInfo.baseSeverity || 0;
            const severityPercent = Math.round(baseSeverity * 100);
            const difficulty = progressInfo.difficulty || "medium";
            
            const difficultyColors = {
                "easy": "defect-easy",
                "medium": "defect-medium", 
                "hard": "defect-hard",
                "critical": "defect-critical"
            };
            
            const difficultyIcons = {
                "easy": "🟢",
                "medium": "🟡",
                "hard": "🟠",
                "critical": "🔴"
            };
            
            // Расчет текущего влияния на стоимость
            const currentSeverity = baseSeverity * (1 - (progress / 100));
            const currentSeverityPercent = Math.round(currentSeverity * 100);
            const valueImpact = Math.round((item.realValue || 1000) * baseSeverity * (progress / 100));
            
            content += `
                <div class="text-sm border-l-4 ${difficultyColors[difficulty]} pl-3 bg-gray-50 rounded-r p-2">
                    <div class="flex justify-between items-center mb-1">
                        <span class="font-semibold">${difficultyIcons[difficulty]} ${defect}</span>
                        <span class="text-xs px-2 py-1 rounded ${difficultyColors[difficulty]} bg-white border">
                            ${difficulty.toUpperCase()}
                        </span>
                    </div>
                    <div class="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Прогресс: ${progress}%</span>
                        <span>Исходный штраф: -${severityPercent}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3 mb-1">
                        <div class="bg-green-500 h-3 rounded-full transition-all" 
                             style="width: ${progress}%"></div>
                    </div>
                    <div class="text-xs text-gray-500">
                        Текущее влияние: -${currentSeverityPercent}% • Восстановлено: +${formatMoney(valueImpact)}
                        ${progress >= 100 ? '✅ Полностью устранен' : ''}
                    </div>
                </div>
            `;
        });
    } else {
        content += `<div class="text-sm text-gray-500">Дефектов не обнаружено</div>`;
    }

    content += `
                </div>
            </div>
            
            <div class="border-t pt-4">
                <h4 class="font-semibold mb-3">🛠️ Варианты реставрации</h4>
                <div class="space-y-3">
    `;

    // Самостоятельная реставрация
    const selfMethods = findAllRestorationMethods().filter(method => 
        skill >= method.skillReq && 
        method.fixes.some(fix => 
            item.defects && item.defects.some(defect => 
                defect.toLowerCase().includes(fix.toLowerCase())
            )
        )
    );
    
    if (selfMethods.length > 0) {
        content += `
            <div class="p-3 bg-purple-50 rounded-lg">
                <h5 class="font-semibold mb-2">🎓 Самостоятельная реставрация</h5>
                <div class="space-y-2">
        `;
        selfMethods.forEach(method => {
            const attemptCount = item.restorationAttempts || 0;
            const costMultiplier = Math.pow(method.costReduction || 0.7, attemptCount);
            const actualCost = Math.round((method.cost || 100) * costMultiplier);
            
            content += `
                <button onclick="attemptAdvancedRestoration('${item.id}', '${method.id}')" 
                    class="w-full text-left p-2 bg-white rounded border hover:bg-purple-100 transition">
                    <div class="flex justify-between items-center">
                        <span class="font-semibold">${method.name}</span>
                        <span class="text-green-600 font-bold">${formatMoney(actualCost)}</span>
                    </div>
                    <div class="flex justify-between text-sm text-gray-600">
                        <span>Риск: ${Math.round((method.risk || 0.2) * 100)}%</span>
                        <span>Уровень: ${method.skillReq || 1}</span>
                    </div>
                    ${attemptCount > 0 ? `<div class="text-xs text-gray-500 mt-1">Попыток: ${attemptCount} (скидка ${Math.round((1 - costMultiplier) * 100)}%)</div>` : ''}
                </button>
            `;
        });
        content += `</div></div>`;
    }
    
    // Профессиональная реставрация
    Object.entries(professionalStudios).forEach(([level, studio]) => {
        if (studio.specialties.includes(getItemSpecialty(item))) {
            const cost = calculateStudioCost(studio, item, analysis);
            content += `
                <div class="p-3 bg-blue-50 rounded-lg">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h5 class="font-semibold">${studio.name}</h5>
                            <p class="text-sm text-gray-600">${studio.description}</p>
                        </div>
                        <div class="text-right">
                            <div class="font-bold text-lg">${formatMoney(cost)}</div>
                            <div class="text-sm text-green-600">Успех: ${Math.round((studio.successRate || 0.85) * 100)}%</div>
                        </div>
                    </div>
                    <div class="flex justify-between text-sm text-gray-600 mb-2">
                        <span>⏱️ ${studio.timeRequired || 3} дней</span>
                        <span>🛠️ ${(studio.specialties || []).join(', ')}</span>
                    </div>
                    <button onclick="startProfessionalRestoration('${item.id}', '${level}')" 
                        class="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition">
                        Заказать реставрацию
                    </button>
                </div>
            `;
        }
    });

    content += `</div></div></div>`;

    document.getElementById('restorationContent').innerHTML = content;
}
