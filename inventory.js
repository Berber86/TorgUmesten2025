function renderInventory() {
    const container = document.getElementById('inventoryItems');
    const empty = document.getElementById('emptyInventory');
    
    let filteredItems = gameState.inventory;
    if (!gameState.showSamplesInInventory) {
        filteredItems = gameState.inventory.filter(item => !item.isSample);
    }
    
    if (filteredItems.length === 0) {
        container.classList.add('hidden');
        empty.classList.remove('hidden');
        
        if (!gameState.showSamplesInInventory && gameState.inventory.length > 0) {
            empty.innerHTML = `
                <div class="empty-ico">🧠</div>
                <div class="empty-title">Образцы скрыты</div>
                <div class="empty-sub">В инвентаре ${gameState.inventory.length} предметов. Нажми «Показать образцы» чтобы увидеть все.</div>
            `;
        } else {
            empty.innerHTML = `
                <div class="empty-ico">◫</div>
                <div class="empty-title">Инвентарь пуст</div>
                <div class="empty-sub">Купи что-нибудь на рынке — и начнётся самое интересное</div>
            `;
        }
        return;
    }
    
    container.classList.remove('hidden');
    empty.classList.add('hidden');
    
    const filterButtonHTML = `
        <div class="filter-bar" style="grid-column:1/-1;display:flex;align-items:center;gap:10px;margin-bottom:4px">
            <button onclick="toggleSampleFilter()" class="btn small ${gameState.showSamplesInInventory ? 'primary' : 'ghost'}">
                <span>🧠</span> ${gameState.showSamplesInInventory ? 'Скрыть образцы' : 'Показать образцы'}
            </button>
            <div class="muted small">Образцов: ${gameState.inventory.filter(item => item.isSample).length} • Показано: ${filteredItems.length}</div>
        </div>
    `;
    
    let itemsHTML = filterButtonHTML;
    
    filteredItems.forEach(item => {
        const skill = gameState.skills[item.category] || 0;
        const displayName = item.expertiseDone ? getTrueName(item) : getDisplayName(item, skill);
        const itemIcon = DETAILED_ICONS[item.baseName] || CATEGORY_ICONS[item.category] || '◫';
        
        const sampleBadge = item.isSample ? `<div class="sample-ribbon">ОБРАЗЕЦ</div>` : '';
        const restorationInfo = typeof renderRestorationInfo === 'function' ? renderRestorationInfo(item) : '';
        
        if (!gameState.isTesterMode) {
            let expertiseStatus = '';
            let restorationStatus = '';
            
            if (item.expertiseDone) {
                const playerValue = item.estimatedValue || 0;
                const playerAuthenticity = item.soldAsAuthentic ? "Подлинник" : "Подделка";
                const playerAge = item.estimatedAge || "—";
                
                expertiseStatus = `
                    <div class="inv-estimate">
                        <div class="mono" style="font-size:15px;font-weight:900">${formatMoney(playerValue)}</div>
                        <div class="small muted">${playerAuthenticity} • ${playerAge} лет</div>
                    </div>
                `;
                
                const hasDefects = item.defects && item.defects.length > 0;
                if (hasDefects) {
                    restorationStatus = `<div class="status-chip bad">есть дефекты</div>`;
                } else {
                    restorationStatus = `<div class="status-chip good">без дефектов</div>`;
                }
            } else {
                expertiseStatus = `<div class="status-chip">экспертиза не проведена</div>`;
                restorationStatus = `<div class="status-chip">статус неизвестен</div>`;
            }
            
            itemsHTML += `
                <div class="inventory-card ${item.isSample ? 'sample' : ''}">
                    ${sampleBadge}
                    <div class="inv-media"><div class="emoji">${itemIcon}</div></div>
                    <div class="inv-body">
                        <div class="inv-title">${displayName}</div>
                        <div class="inv-price mono">Куплено за ${formatMoney(item.purchasePrice)}</div>
                        <div class="inv-status">
                            ${expertiseStatus}
                            ${restorationStatus}
                            ${restorationInfo ? `<div class="muted small" style="margin-top:6px">${restorationInfo}</div>` : ''}
                        </div>
                        <div class="inv-actions">
                            ${!item.expertiseDone ? `<button onclick="startExpertise('${item.id}')" class="btn small primary">🔍 Экспертиза</button>` : ''}
                            ${item.expertiseDone ? `<button onclick="startSell('${item.id}')" class="btn small primary">💰 Продать</button>` : ''}
                            ${item.expertiseDone ? `<button onclick="startRestoration('${item.id}')" class="btn small ghost">🛠️ Починить</button>` : ''}
                            <button onclick="toggleItemAsSample('${item.id}')" class="btn small ${item.isSample ? '' : 'ghost'}">🧠 ${item.isSample ? 'Не образец' : 'Образец'}</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const expertiseStatus = item.expertiseDone ?
                `<div class="status-chip good">✅ экспертиза • ${formatMoney(item.realValue || 0)}</div>` :
                `<div class="status-chip bad">⏳ нужна экспертиза</div>`;
            
            let expertiseDetails = '';
            if (item.expertiseDone) {
                const marksDisplay = item.marks && item.marks.length > 0 ?
                    `<div class="small">🏷️ ${item.marks.join(', ')}</div>` :
                    `<div class="small muted">🏷️ без клейм</div>`;
                const authenticityDisplay = item.authentic ?
                    `<div class="small" style="color:#2f6a2f">✅ подлинник</div>` :
                    `<div class="small" style="color:#9a2a22">❌ подделка</div>`;
                const ageDisplay = `<div class="small">📅 ${Math.round(item.age)} лет (оц: ${item.estimatedAge || '—'})</div>`;
                let styleDisplay;
                if (!item.authentic && item.dominantStyle) {
                    const fakeAge = Math.min(326, item.age + 100);
                    const fakeStyle = assignDominantStyle({ age: fakeAge, category: item.category, authentic: false });
                    styleDisplay = `<div class="small">🎨 ${fakeStyle.name} (фейк)</div>`;
                } else {
                    styleDisplay = item.dominantStyle ?
                        `<div class="small">🎨 ${item.dominantStyle.name}</div>` :
                        `<div class="small muted">🎨 стиль не определен</div>`;
                }
                expertiseDetails = `<div class="stack" style="gap:4px;margin-top:8px">${marksDisplay}${authenticityDisplay}${ageDisplay}${styleDisplay}</div>`;
            }
            
            const restorationStatus = item.restored ?
                `<div class="status-chip good">✨ отреставрирован</div>` :
                (item.defects && item.defects.length > 0 ?
                    `<div class="status-chip bad">🛠️ ${item.defects.length} дефектов</div>` :
                    `<div class="status-chip good">✅ без дефектов</div>`);
            
            itemsHTML += `
                <div class="inventory-card ${item.isSample ? 'sample' : ''}">
                    ${sampleBadge}
                    <div class="inv-media"><div class="emoji">${itemIcon}</div></div>
                    <div class="inv-body">
                        <div class="inv-title">${displayName}</div>
                        <div class="inv-price mono">Куплено за ${formatMoney(item.purchasePrice)}</div>
                        <div class="inv-status">
                            ${expertiseStatus}
                            ${expertiseDetails}
                            ${restorationStatus}
                            ${restorationInfo ? `<div style="margin-top:6px">${restorationInfo}</div>` : ''}
                        </div>
                        <div class="inv-actions">
                            ${!item.expertiseDone ? `<button onclick="startExpertise('${item.id}')" class="btn small primary">🔍 Экспертиза</button>` : ''}
                            ${item.expertiseDone ? `<button onclick="startSell('${item.id}')" class="btn small primary">💰 Продать</button>` : ''}
                            ${item.expertiseDone ? `<button onclick="startRestoration('${item.id}')" class="btn small ghost">🛠️ Починить</button>` : ''}
                            <button onclick="toggleItemAsSample('${item.id}')" class="btn small ${item.isSample ? '' : 'ghost'}">🧠 ${item.isSample ? 'Не образец' : 'Образец'}</button>
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    container.innerHTML = itemsHTML;
}

        