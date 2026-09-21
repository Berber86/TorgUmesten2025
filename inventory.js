function renderInventory() {
    const container = document.getElementById('inventoryItems');
    const empty = document.getElementById('emptyInventory');
    
    // Фильтруем предметы в зависимости от настройки показа образцов
    let filteredItems = gameState.inventory;
    if (!gameState.showSamplesInInventory) {
        filteredItems = gameState.inventory.filter(item => !item.isSample);
    }
    
    if (filteredItems.length === 0) {
        container.classList.add('hidden');
        empty.classList.remove('hidden');
        
        // Обновляем текст пустого инвентаря в зависимости от фильтра
        if (!gameState.showSamplesInInventory && gameState.inventory.length > 0) {
            empty.innerHTML = `
                <div class="text-center text-gray-500 py-12">
                    <div class="text-4xl mb-4">🧠</div>
                    <div>Образцы скрыты. В инвентаре есть ${gameState.inventory.length} предметов.</div>
                    <div class="text-sm mt-2">Нажмите "Показать образцы", чтобы увидеть все предметы</div>
                </div>
            `;
        } else {
            empty.innerHTML = `
                <div class="text-center text-gray-500 py-12">
                    Ваш инвентарь пуст. Купите что-нибудь на рынке!
                </div>
            `;
        }
        
        return;
    }
    
    container.classList.remove('hidden');
    empty.classList.add('hidden');
    
    // Создаём HTML для кнопки фильтра
    const filterButtonHTML = `
        <div class="col-span-full mb-4">
            <button onclick="toggleSampleFilter()" 
                    class="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition">
                <span class="text-xl">🧠</span>
                <span>${gameState.showSamplesInInventory ? 'Скрыть образцы' : 'Показать образцы'}</span>
            </button>
            <div class="text-xs text-gray-600 mt-1">
                ${gameState.showSamplesInInventory ? 'Показаны все предметы' : 'Показаны только предметы для продажи'}
                • Образцов: ${gameState.inventory.filter(item => item.isSample).length}
            </div>
        </div>
    `;
    
    // Создаём HTML для всех предметов
    let itemsHTML = filterButtonHTML;
    
    filteredItems.forEach(item => {
        const skill = gameState.skills[item.category] || 0;
        const displayName = item.expertiseDone ? getTrueName(item) : getDisplayName(item, skill);
        const itemIcon = DETAILED_ICONS[item.baseName] || CATEGORY_ICONS[item.category];
        
        // Бейджик "ОБРАЗЕЦ"
        const sampleBadge = item.isSample ? `
            <div class="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                ОБРАЗЕЦ
            </div>
        ` : '';
        
        // 🔥 ДОБАВЛЕНО: Информация о реставрации для режима тестера
        const restorationInfo = renderRestorationInfo(item);
        
        // РЕЖИМ ИГРОКА: ОГРАНИЧЕННАЯ ИНФОРМАЦИЯ
        if (!gameState.isTesterMode) {
            let expertiseStatus = '';
            let expertiseDetails = '';
            let restorationStatus = '';
            
            if (item.expertiseDone) {
                // СТАТУС ЭКСПЕРТИЗЫ - ПРОСТОЙ ТЕКСТ
                expertiseStatus = `<div class="text-xs text-gray-600">Экспертиза не проведена</div>`;
                
                // УСТАНОВЛЕННЫЕ ИГРОКОМ ЗНАЧЕНИЯ В СИНЕЙ ПОДСВЕТКЕ
                const playerValue = item.estimatedValue || 0;
                const playerAuthenticity = item.soldAsAuthentic ? "Подлинник" : "Подделка";
                const playerAge = item.estimatedAge || "Не определен";
                
                expertiseStatus = `
                    <div class="bg-blue-100 border border-blue-300 rounded p-2 mb-2">
                        <div class="text-sm font-bold text-blue-800 text-center">Ваша оценка: ${formatMoney(playerValue)}</div>
                        <div class="text-sm text-blue-700 text-center">${playerAuthenticity}</div>
                        <div class="text-sm text-blue-700 text-center">Возраст: ${playerAge} лет</div>
                    </div>
                `;
                
                // ОБОБЩЕННАЯ ИНФОРМАЦИЯ О ДЕФЕКТАХ - ЦВЕТОВАЯ ИНДИКАЦИЯ
                const hasDefects = item.defects && item.defects.length > 0;
                if (hasDefects) {
                    restorationStatus = `<div class="text-xs text-red-600 font-semibold text-center mt-1">Есть дефекты</div>`;
                } else {
                    restorationStatus = `<div class="text-xs text-green-600 font-semibold text-center mt-1">Нет дефектов</div>`;
                }
            } else {
                // ДО ЭКСПЕРТИЗЫ - ТОЛЬКО БАЗОВАЯ ИНФОРМАЦИЯ
                expertiseStatus = `<div class="text-xs text-gray-600">Экспертиза не проведена</div>`;
                restorationStatus = `<div class="text-xs text-gray-500 text-center mt-1">Статус неизвестен</div>`;
            }
            
            // Кнопка образца
            const sampleButton = `
                <button onclick="toggleItemAsSample('${item.id}')" 
                        class="flex-1 ${item.isSample ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-gray-500 to-gray-700'} text-white py-2 rounded-lg text-sm hover:shadow-lg transition">
                    🧠 ${item.isSample ? 'Не образец' : 'Образец'}
                </button>
            `;
            
            itemsHTML += `
                <div class="card rounded-lg shadow-lg p-4 relative">
                    ${sampleBadge}
                    <div class="text-4xl mb-2 text-center">${itemIcon}</div>
                    <h3 class="font-bold mb-2 text-sm text-center">${displayName}</h3>
                    <div class="text-sm text-gray-600 mb-2 text-center">Куплено за: ${formatMoney(item.purchasePrice)}</div>
                    ${expertiseStatus}
                    ${expertiseDetails}
                    ${restorationStatus}
                    <div class="flex gap-2 mt-3">
                        ${!item.expertiseDone ? `<button onclick="startExpertise('${item.id}')" class="flex-1 bg-purple-500 text-white py-2 rounded-lg text-sm hover:bg-purple-600">🔍 Экспертиза</button>` : ''}
                        ${item.expertiseDone ? `<button onclick="startSell('${item.id}')" class="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm hover:bg-green-600">💰 Продать</button>` : ''}
                        ${item.expertiseDone ? `<button onclick="startRestoration('${item.id}')" class="flex-1 bg-yellow-500 text-white py-2 rounded-lg text-sm hover:bg-yellow-600">🛠️ Реставрировать</button>` : ''}
                        ${sampleButton}
                    </div>
                </div>
            `;
        } else {
            // РЕЖИМ ТЕСТЕРА - ПОЛНАЯ ИНФОРМАЦИЯ
            const expertiseStatus = item.expertiseDone ?
                `<div class="text-xs text-green-600">✅ Экспертиза завершена</div>
                 <div class="text-sm font-bold text-purple-600">Реальная стоимость: ${formatMoney(item.realValue || 0)}</div>` :
                `<div class="text-xs text-orange-600">⏳ Требуется экспертиза</div>`;
            
            let expertiseDetails = '';
            if (item.expertiseDone) {
                const marksDisplay = item.marks && item.marks.length > 0 ?
                    `<div class="text-xs text-blue-600">🏷️ Клейма: ${item.marks.join(', ')}</div>` :
                    `<div class="text-xs text-gray-500">🏷️ Клейма: отсутствуют</div>`;
                
                const authenticityDisplay = item.authentic ?
                    `<div class="text-xs text-green-600">✅ Подлинник</div>` :
                    `<div class="text-xs text-red-600">❌ Подделка</div>`;
                
                const ageDisplay = `<div class="text-xs text-purple-600">📅 Возраст: ${Math.round(item.age)} лет (оценка: ${item.estimatedAge || 'нет'})</div>`;
                
                let styleDisplay;
                if (!item.authentic && item.dominantStyle) {
                    const fakeAge = Math.min(326, item.age + 100);
                    const fakeStyle = assignDominantStyle({ age: fakeAge, category: item.category, authentic: false });
                    styleDisplay = `<div class="text-xs text-orange-600">🎨 Стиль: ${fakeStyle.name} (фейковый)</div>`;
                } else {
                    styleDisplay = item.dominantStyle ?
                        `<div class="text-xs text-orange-600">🎨 Стиль: ${item.dominantStyle.name}</div>` :
                        `<div class="text-xs text-gray-500">🎨 Стиль: не определен</div>`;
                }
                
                expertiseDetails = `
                    ${marksDisplay}
                    ${authenticityDisplay}
                    ${ageDisplay}
                    ${styleDisplay}
                `;
            }
            
            const restorationStatus = item.restored ?
                `<div class="text-xs text-green-600">✨ Отреставрирован</div>` :
                (item.defects && item.defects.length > 0 ?
                    `<div class="text-xs text-red-600">🛠️ ${item.defects.length} дефектов</div>` :
                    `<div class="text-xs text-green-600">✅ Нет дефектов</div>`);
            
            // Кнопка образца для режима тестера
            const sampleButton = `
                <button onclick="toggleItemAsSample('${item.id}')" 
                        class="flex-1 ${item.isSample ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-gray-500 to-gray-700'} text-white py-2 rounded-lg text-sm hover:shadow-lg transition">
                    🧠 ${item.isSample ? 'Не образец' : 'Образец'}
                </button>
            `;
            
            itemsHTML += `
                <div class="card rounded-lg shadow-lg p-4 relative">
                    ${sampleBadge}
                    <div class="text-4xl mb-2 text-center">${itemIcon}</div>
                    <h3 class="font-bold mb-2 text-sm text-center">${displayName}</h3>
                    <div class="text-sm text-gray-600 mb-2 text-center">Куплено за: ${formatMoney(item.purchasePrice)}</div>
                    ${expertiseStatus}
                    ${expertiseDetails}
                    ${restorationStatus}
                    ${restorationInfo}
                    <div class="flex gap-2 mt-3">
                        ${!item.expertiseDone ? `<button onclick="startExpertise('${item.id}')" class="flex-1 bg-purple-500 text-white py-2 rounded-lg text-sm hover:bg-purple-600">🔍 Экспертиза</button>` : ''}
                        ${item.expertiseDone ? `<button onclick="startSell('${item.id}')" class="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm hover:bg-green-600">💰 Продать</button>` : ''}
                        ${item.expertiseDone ? `<button onclick="startRestoration('${item.id}')" class="flex-1 bg-yellow-500 text-white py-2 rounded-lg text-sm hover:bg-yellow-600">🛠️ Реставрировать</button>` : ''}
                        ${sampleButton}
                    </div>
                </div>
            `;
        }
    });
    
    container.innerHTML = itemsHTML;
}
        