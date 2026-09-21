

// ==============================================
// ИСПРАВЛЕННАЯ ФУНКЦИЯ renderExpertiseModal
// ==============================================

function renderExpertiseModal() {
    const e = currentExpertise;
    const skill = gameState.skills[e.item.category] || 0;
    const displayName = getDisplayName(e.item, skill);
    
    document.getElementById('expertiseItemName').textContent = `${displayName}`;
    document.getElementById('expertiseItemDesc').textContent = `${CATEGORY_ICONS[e.item.category]} ${e.item.category} • уровень ${skill}`;
    
    updateExpertiseAttentionDisplay();
    
    const methods = [
        { id: 'visual', name: 'Визуальный осмотр', icon: '👁️', info: 'Дефекты и общее состояние' },
        { id: 'loupe', name: 'Лупа', icon: '🔍', info: 'Клейма и мелкие детали' },
        { id: 'internet', name: 'Интернет-поиск', icon: '💻', info: 'Поиск аналогов и мнений в сети' },
        { id: 'testing', name: 'Тестировать', icon: '🧪', info: 'Физические и химические тесты' },
        { id: 'uv', name: 'УФ-лампа', icon: '💡', info: 'Следы реставрации' },
        { id: 'expert', name: 'Эксперт', icon: '👨‍🔬', info: 'Полное заключение' }
    ];
    
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
        
        if (gameState.isTesterMode) {
            const canAfford = gameState.attention >= currentCost;
            return `
                <button onclick="${canAfford ? `useExpertiseMethod('${methodId}')` : ''}" ${!canAfford ? 'disabled' : ''} 
                    class="tactic-btn ${canAfford ? '' : ''}" style="${canAfford ? 'background:var(--ink);color:var(--paper);border-color:var(--ink)' : 'opacity:0.45'}"
                    title="${method.info}">
                    <div style="display:flex;gap:8px;align-items:center">
                        <span style="font-size:18px">${method.icon}</span>
                        <span style="font-size:12px;font-weight:700">${method.name}</span>
                    </div>
                    <div class="mono small" style="margin-top:4px;opacity:0.8">${currentCost}⚡${isIncreased ? ` +${currentCost-baseCost}` : ''}</div>
                </button>
            `;
        }
        
        if (!methodConfig) {
            const canAfford = gameState.attention >= currentCost;
            const canUse = methodId === 'reference' ? skill >= 3 : true;
            const useInfo = methodId === 'reference' && skill < 3 ? 'Требуется 3 ур' : '';
            return `
                <button onclick="${canUse && canAfford ? `useExpertiseMethod('${methodId}')` : ''}" 
                        ${!(canUse && canAfford) ? 'disabled' : ''} 
                        class="tactic-btn" title="${method.info}${useInfo ? '\n'+useInfo : ''}">
                    <div style="display:flex;gap:8px;align-items:center"><span style="font-size:18px">${method.icon}</span><span style="font-size:12px;font-weight:700">${method.name}</span></div>
                    <div class="mono small" style="margin-top:4px">${currentCost}⚡${isIncreased ? ` +${currentCost-baseCost}` : ''}</div>
                    ${useInfo ? `<div class="small" style="color:var(--danger);margin-top:2px">${useInfo}</div>` : ''}
                </button>
            `;
        }
        
        let maxUses = 0;
        if (skill >= methodConfig.third) maxUses = 3;
        else if (skill >= methodConfig.second) maxUses = 2;
        else if (skill >= methodConfig.first) maxUses = 1;
        
        const remainingUses = maxUses - currentUses;
        const canUse = remainingUses > 0;
        const canAfford = gameState.attention >= currentCost;
        
        let useInfo = '';
        if (skill < methodConfig.first) {
            useInfo = `нужен ${methodConfig.first} ур`;
        } else if (currentUses >= maxUses) {
            if (skill >= methodConfig.third) useInfo = 'лимит';
            else if (skill >= methodConfig.second) useInfo = `нужен ${methodConfig.third} ур для 3-го`;
            else useInfo = `нужен ${methodConfig.second} ур для 2-го`;
        } else {
            useInfo = `${remainingUses}/${maxUses}`;
        }
        
        let displayIcon = method.icon;
        let displayNameM = method.name;
        if (methodId === 'testing') {
            const useNumber = currentUses + 1;
            displayIcon = TESTING_ICONS[useNumber] || TESTING_ICONS[1];
            displayNameM = TESTING_NAMES[useNumber] || TESTING_NAMES[1];
        }
        
        const activeStyle = canUse && canAfford ? 'background:var(--ink);color:var(--paper);border-color:var(--ink)' : 'opacity:0.45';
        return `
            <button onclick="${canUse && canAfford ? `useExpertiseMethod('${methodId}')` : ''}" 
                    ${!(canUse && canAfford) ? 'disabled' : ''} 
                    class="tactic-btn" style="${activeStyle}" title="${method.info}\n${useInfo}">
                <div style="display:flex;gap:8px;align-items:center"><span style="font-size:18px">${displayIcon}</span><span style="font-size:12px;font-weight:700">${displayNameM}</span></div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px">
                    <span class="mono small">${currentCost}⚡${isIncreased ? ` +${currentCost-baseCost}` : ''}</span>
                    <span class="eyebrow small" style="${canUse ? 'color:var(--accent-3)' : 'color:var(--danger)'}">${useInfo}</span>
                </div>
            </button>
        `;
    }).join('');
    
    document.getElementById('expertiseMethods').innerHTML = methodsHTML;
    renderShards();
    
    renderGoldenShards(e.мitem);
    
    setTimeout(() => {
        if (currentExpertise && currentExpertise.item) {
            updateMethodVisuals();
        }
    }, 100);
    updateOfficeVisuals();
}


