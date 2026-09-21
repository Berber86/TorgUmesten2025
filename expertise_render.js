

// ==============================================
// ИСПРАВЛЕННАЯ ФУНКЦИЯ renderExpertiseModal
// ==============================================

function renderExpertiseModal() {
    const e = currentExpertise;
    const skill = gameState.skills[e.item.category] || 0;
    const displayName = getDisplayName(e.item, skill);
    
    document.getElementById('expertiseItemName').textContent = `Экспертиза: ${displayName}`;
    document.getElementById('expertiseItemDesc').textContent = `${CATEGORY_ICONS[e.item.category]} ${e.item.category}`;
    
    updateExpertiseAttentionDisplay();
    
    
    const methods = [
        { id: 'visual', name: 'Визуальный осмотр', icon: '👁️', info: 'Дефекты и общее состояние' },
        { id: 'loupe', name: 'Лупа', icon: '🔍', info: 'Клейма и мелкие детали' },
        { id: 'internet', name: 'Интернет-поиск', icon: '💻', info: 'Поиск аналогов и мнений в сети' },
        { id: 'testing', name: 'Тестировать', icon: '🧪', info: 'Физические и химические тесты' },
        { id: 'uv', name: 'УФ-лампа', icon: '💡', info: 'Следы реставрации' },
        { id: 'expert', name: 'Эксперт', icon: '👨‍🔬', info: 'Полное заключение' }
    ];
    
    
    // Инициализируем стоимости если их нет
    if (!e.item.expertiseMethodCosts) {
        e.item.expertiseMethodCosts = { ...BASE_EXPERTISE_COSTS };
    }
    
    const methodsHTML = methods.map(method => {
        const methodId = method.id;
        const methodConfig = METHOD_LEVELS[methodId];
        const currentUses = e.item[`${methodId}Uses`] || 0;
        const currentCost = e.item.expertiseMethodCosts[methodId];
        const baseCost = BASE_EXPERTISE_COSTS[methodId];
        const isIncreased = currentCost > baseCost;
        
        // Режим тестера - без ограничений
        if (gameState.isTesterMode) {
            const canAfford = gameState.attention >= currentCost;
            const buttonClass = canAfford ?
                'bg-purple-500 hover:bg-purple-600 text-white transform hover:scale-105' :
                'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60';
            
            return `
                <button onclick="${canAfford ? `useExpertiseMethod('${methodId}')` : ''}" ${!canAfford ? 'disabled' : ''} 
                    class="tactic-btn ${buttonClass} rounded-lg font-semibold transition-all duration-200 border-2 border-purple-700"
                    title="${method.info}">
                    <div class="text-xl mb-1">${method.icon}</div>
                    <div class="text-xs leading-tight">${method.name}</div>
                    <div class="text-xs mt-1 ${isIncreased ? 'text-orange-300' : 'opacity-80'}">
                        ${currentCost}⚡
                        ${isIncreased ? ` (+${currentCost - baseCost})` : ''}
                    </div>
                </button>
            `;
        }
        
        // Режим игрока
        
        // Для методов не из списка (например, reference) - старая логика
        if (!methodConfig) {
            const canAfford = gameState.attention >= currentCost;
            const canUse = methodId === 'reference' ? skill >= 3 : true;
            
            const buttonClass = canUse && canAfford ?
                'bg-purple-500 hover:bg-purple-600 text-white transform hover:scale-105' :
                'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60';
            
            let useInfo = '';
            if (methodId === 'reference') {
                useInfo = skill >= 3 ? '' : 'Требуется 3 уровень навыка';
            }
            
            return `
                <button onclick="${canUse && canAfford ? `useExpertiseMethod('${methodId}')` : ''}" 
                        ${!(canUse && canAfford) ? 'disabled' : ''} 
                        class="tactic-btn ${buttonClass} rounded-lg font-semibold transition-all duration-200 border-2 border-purple-700"
                        title="${method.info}${useInfo ? '\n' + useInfo : ''}">
                    <div class="text-xl mb-1">${method.icon}</div>
                    <div class="text-xs leading-tight">${method.name}</div>
                    <div class="text-xs mt-1 ${isIncreased ? 'text-orange-300' : 'opacity-80'}">
                        ${currentCost}⚡
                        ${isIncreased ? ` (+${currentCost - baseCost})` : ''}
                    </div>
                    ${useInfo ? `<div class="text-xs mt-1 text-red-500">${useInfo}</div>` : ''}
                </button>
            `;
        }
        
        // Для методов из списка - новая логика с уровнями
        
        // Определяем максимальное количество использований по уровню
        let maxUses = 0;
        if (skill >= methodConfig.third) maxUses = 3;
        else if (skill >= methodConfig.second) maxUses = 2;
        else if (skill >= methodConfig.first) maxUses = 1;
        
        const remainingUses = maxUses - currentUses;
        const canUse = remainingUses > 0;
        const canAfford = gameState.attention >= currentCost;
        
        // ФОРМИРУЕМ ИНФОРМАЦИЮ ОБ ИСПОЛЬЗОВАНИИ (ИСПРАВЛЕННОЕ)
        let useInfo = '';
        
        if (skill < methodConfig.first) {
            // Уровень слишком низкий для первого использования
            useInfo = `Требуется ${methodConfig.first} уровень`;
        } else if (currentUses >= maxUses) {
            // Достигнут лимит для текущего уровня
            if (skill >= methodConfig.third) {
                useInfo = 'Лимит исчерпан';
            } else if (skill >= methodConfig.second) {
                // Уровень 7-13, но 2 использования уже использованы
                useInfo = `Требуется ${methodConfig.third} уровень для 3-го`;
            } else {
                // Уровень 1-6, но 1 использование уже использовано
                useInfo = `Требуется ${methodConfig.second} уровень для 2-го`;
            }
        } else {
            // Есть доступные использования
            useInfo = `Осталось: ${remainingUses}/${maxUses}`;
        }
        
        // Особые иконки для тестирования
        let displayIcon = method.icon;
        let displayName = method.name;
        if (methodId === 'testing') {
            const useNumber = currentUses + 1;
            displayIcon = TESTING_ICONS[useNumber] || TESTING_ICONS[1];
            displayName = TESTING_NAMES[useNumber] || TESTING_NAMES[1];
        }
        
        const buttonClass = canUse && canAfford ?
            'bg-purple-500 hover:bg-purple-600 text-white transform hover:scale-105' :
            'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60';
        
        return `
            <button onclick="${canUse && canAfford ? `useExpertiseMethod('${methodId}')` : ''}" 
                    ${!(canUse && canAfford) ? 'disabled' : ''} 
                    class="tactic-btn ${buttonClass} rounded-lg font-semibold transition-all duration-200 border-2 border-purple-700"
                    title="${method.info}\n${useInfo}">
                <div class="text-xl mb-1">${displayIcon}</div>
                <div class="text-xs leading-tight">${displayName}</div>
                <div class="text-xs mt-1 ${isIncreased ? 'text-orange-300' : 'opacity-80'}">
                    ${currentCost}⚡
                    ${isIncreased ? ` (+${currentCost - baseCost})` : ''}
                </div>
                <div class="text-xs mt-1 ${canUse ? 'text-green-500' : 'text-red-500'}">
                    ${useInfo}
                </div>
            </button>
        `;
    }).join('');
    
    document.getElementById('expertiseMethods').innerHTML = methodsHTML;
    renderShards();
    
    renderGoldenShards(e.мitem);
    
    
    
    // 🔥 ДОБАВЛЕНО: Обновляем PNG при каждом обновлении модалки
    setTimeout(() => {
        if (currentExpertise && currentExpertise.item) {
            updateMethodVisuals();
        }
    }, 100);
    updateOfficeVisuals();
}

