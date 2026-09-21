// =============================================
// MISSING UI IMPLEMENTATIONS — REDESIGN 2026
// =============================================

function updateExpertiseAttentionDisplay(){
    const eye = document.getElementById('attentionEye');
    const val = document.getElementById('attentionValue');
    if(!val) return;
    const att = gameState.attention || 0;
    val.textContent = att + '⚡';
    if(eye){
        if(att > 80) eye.textContent = '👁️';
        else if(att > 50) eye.textContent = '👀';
        else if(att > 20) eye.textContent = '😶‍🌫️';
        else eye.textContent = '😵‍💫';
    }
    // also update header
    const headerAtt = document.getElementById('headerAttention');
    if(headerAtt) headerAtt.textContent = att + '⚡';
}

function renderShards(){
    const container = document.getElementById('shardsContainer');
    if(!container) return;
    if(!currentExpertise || !currentExpertise.item){
        container.innerHTML = '<div class="empty-state small muted">Нет данных экспертизы</div>';
        return;
    }
    const shards = currentExpertise.item.expertiseShards || [];
    if(shards.length===0){
        container.innerHTML = '<div class="empty-state small muted"><div class="empty-ico">◍</div><div class="empty-title" style="font-size:14px">Осколков пока нет</div><div class="empty-sub">Используй инструменты на рабочем столе</div></div>';
        return;
    }

    container.innerHTML = shards.map((shard, idx)=>{
        const reliability = shard.reliability || 0;
        const truthClass = shard.isTruthful ? 'truth' : (shard.category==='neutral' ? 'neutral' : 'lie');
        const icon = shard.icon || '◍';
        const type = shard.type || 'Наблюдение';
        // preserve line breaks
        const textHtml = (shard.text||'').replace(/\n/g,'<br>').replace(/•/g,'<span style="color:var(--ink-muted)">•</span>');
        const confMark = shard.visualData && shard.visualData.isConfused ? '<span class="eyebrow small" style="background:#fff3cd;border:1px solid #ffe08a;padding:2px 6px;border-radius:999px;margin-left:6px">сомнение</span>' : '';
        const goldMark = shard.isGolden ? '<span class="eyebrow small" style="background:var(--accent-2);color:#000;padding:2px 6px;border-radius:999px;margin-left:6px">★ важно</span>' : '';
        return `
            <div class="shard-item ${truthClass}" style="animation-delay:${idx*40}ms">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                    <div style="display:flex;gap:8px;align-items:center">
                        <span style="width:28px;height:28px;display:grid;place-items:center;background:var(--paper-2);border:1px solid var(--line);border-radius:8px;font-size:14px">${icon}</span>
                        <span style="font-weight:800;font-size:13px">${type}</span>
                        ${confMark}${goldMark}
                    </div>
                    <span class="mono small" style="background:var(--ink);color:var(--paper);padding:3px 7px;border-radius:999px;font-size:11px">${reliability}%</span>
                </div>
                <div style="font-size:13px;line-height:1.45;white-space:normal">${textHtml}</div>
            </div>
        `;
    }).join('');

    // append golden shards if any
    const item = currentExpertise.item;
    if(item.goldenShards && item.goldenShards.length>0){
        const goldHtml = item.goldenShards.map(gs=>`
            <div class="shard-item" style="background:linear-gradient(135deg,#fffbe6,#fff3b0);border-color:var(--accent-2)">
                <div style="display:flex;gap:8px;align-items:center">
                    <span style="font-size:16px">${gs.icon||'🌟'}</span>
                    <span style="font-weight:800;font-size:12px;letter-spacing:0.06em;text-transform:uppercase">Обоснование цены</span>
                </div>
                <div style="margin-top:6px;font-size:13px">${gs.text||''}</div>
            </div>
        `).join('');
        container.innerHTML += goldHtml;
    }
}

function renderSkills(){
    const container = document.getElementById('skillsDisplay');
    if(!container) return;
    const categories = [
        {id:'porcelain', name:'Фарфор', icon:'🏺', desc:'Чашки, вазы, сервизы — тонкость глазури'},
        {id:'metal', name:'Металл', icon:'🔧', desc:'Серебро, бронза, латунь — проба и патина'},
        {id:'painting', name:'Живопись', icon:'🎨', desc:'Масло, акварель, иконы — мазки и кракелюр'},
        {id:'books', name:'Книги', icon:'📚', desc:'Издания, рукописи, карты — бумага и переплёт'},
        {id:'militaria', name:'Милитария', icon:'🎖️', desc:'Оружие, награды, форма — сталь и клейма'}
    ];

    container.innerHTML = categories.map(cat=>{
        const lvl = gameState.skills[cat.id] || 0;
        const words = (()=>{
            // count words in inventory for this category
            let c=0;
            gameState.inventory.forEach(it=>{
                if(it.category===cat.id){
                    try{
                        const tn = getTrueName(it);
                        c+= tn.split(' ').filter(w=>w.trim().length>0).length;
                    }catch(e){}
                }
            });
            // add expertise exp
            if(gameState.expertiseExperience && gameState.expertiseExperience[cat.id]){
                c+= gameState.expertiseExperience[cat.id];
            }
            return c;
        })();
        const nextThresh = SKILL_LEVEL_THRESHOLDS[lvl+1] !== undefined ? SKILL_LEVEL_THRESHOLDS[lvl+1] : null;
        const currThresh = SKILL_LEVEL_THRESHOLDS[lvl] || 0;
        const progress = nextThresh ? Math.min(100, ((words - currThresh)/(nextThresh - currThresh))*100) : 100;
        const fillClass = lvl>=12 ? 'lvl-3' : lvl>=6 ? 'lvl-2' : 'lvl-1';

        return `
            <div class="skill-card">
                <div class="skill-top">
                    <div style="display:flex;gap:10px;align-items:center">
                        <div style="width:36px;height:36px;display:grid;place-items:center;background:var(--paper-2);border:1px solid var(--line);border-radius:10px;font-size:18px">${cat.icon}</div>
                        <div>
                            <div class="skill-name" style="font-size:16px">${cat.name}</div>
                            <div class="small muted" style="font-size:11px">${cat.desc}</div>
                        </div>
                    </div>
                    <div class="skill-level mono">ур ${lvl}</div>
                </div>
                <div class="skill-bar"><div class="skill-fill ${fillClass}" style="width:${progress}%"></div></div>
                <div class="skill-meta">
                    <span class="mono small">${words} слов</span>
                    <span class="small muted">${nextThresh ? `до ${lvl+1} ур: ${nextThresh-words} слов` : 'максимум'}</span>
                </div>
                <div class="small muted" style="margin-top:10px;line-height:1.4">
                    ${lvl>=1 ? '• Видишь дефекты<br>' : ''}
                    ${lvl>=2 ? '• Видишь клейма<br>' : ''}
                    ${lvl>=3 ? '• Доступен эксперт<br>' : ''}
                    ${lvl>=7 ? '• Открыта тактика «экспертная беседа»<br>' : ''}
                    ${lvl>=10 ? '• Точнее определяешь возраст<br>' : ''}
                </div>
            </div>
        `;
    }).join('');
}

function renderStats(){
    const tbody = document.getElementById('dealsLog');
    const empty = document.getElementById('emptyDeals');
    if(!tbody) return;
    if(!gameState.dealsLog || gameState.dealsLog.length===0){
        tbody.innerHTML='';
        if(empty) empty.classList.remove('hidden');
        return;
    }
    if(empty) empty.classList.add('hidden');
    tbody.innerHTML = gameState.dealsLog.slice().reverse().map((deal, idx)=>{
        const realIdx = gameState.dealsLog.length-1-idx;
        const profit = deal.salePrice - deal.purchasePrice - (deal.expertiseCost||0);
        const profitClass = profit>=0 ? 'color:var(--accent-3)' : 'color:var(--danger)';
        const rowId = `deal_${realIdx}`;
        return `
            <tr class="deal-row" onclick="toggleDealDetails('${rowId}_details')">
                <td><span style="font-weight:700">${deal.displayName}</span><div class="small muted">${deal.trueName||''}</div></td>
                <td class="mono" style="text-align:right">${formatMoney(deal.purchasePrice)}</td>
                <td class="mono" style="text-align:right">${formatMoney(deal.salePrice)}</td>
                <td><span class="eyebrow small" style="background:var(--paper-2);padding:4px 8px;border-radius:999px;border:1px solid var(--line)">${deal.channel}</span></td>
                <td class="mono" style="text-align:right;font-weight:900;${profitClass}">${profit>=0?'+':''}${formatMoney(profit)}</td>
            </tr>
            <tr id="${rowId}_details" class="hidden deal-details"><td colspan="5" style="background:var(--paper-2);padding:12px;border-radius:12px">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:12px">
                    <div>Продавец просил: <span class="mono">${formatMoney(deal.sellerPrice||0)}</span></div>
                    <div>Реальная цена: <span class="mono">${formatMoney(deal.realValue||0)}</span></div>
                    <div>Оценка: <span class="mono">${formatMoney(deal.estimatedValue||0)}</span></div>
                    <div>Экспертиза: <span class="mono">${formatMoney(deal.expertiseCost||0)}</span></div>
                    <div>Подлинность: ${deal.authentic ? '✅ подлинник' : '❌ подделка'} • Продано как: ${deal.soldAsAuthentic ? 'подлинник' : 'подделка'}</div>
                    <div>Дефекты: ${(deal.defects||[]).join(', ')||'нет'}</div>
                </div>
            </td></tr>
        `;
    }).join('');
}

// Fix missing renderRestorationInfo
function renderRestorationInfo(item){
    if(!item.defects || item.defects.length===0) return '';
    if(!item.restorationProgress) return '';
    let totalProgress = 0;
    let count=0;
    Object.values(item.restorationProgress).forEach(p=>{
        if(p && typeof p.progress==='number'){ totalProgress+=p.progress; count++; }
    });
    if(count===0) return '';
    const avg = Math.round(totalProgress/count);
    if(avg===0) return `<div class="small muted">реставрация 0%</div>`;
    if(avg>=100) return `<div class="small" style="color:var(--accent-3)">✨ полностью отреставрирован</div>`;
    return `<div class="small muted">реставрация ${avg}%</div>`;
}

// Ensure startExpertise exists if missing (fallback)
if(typeof window.startExpertise === 'undefined'){
    window.startExpertise = function(itemId){
        const item = gameState.inventory.find(i=>i.id===itemId);
        if(!item) return;
        currentExpertise = { item, shards: [] };
        document.getElementById('expertiseModal').classList.remove('hidden');
        if(typeof renderExpertiseModal === 'function') renderExpertiseModal();
        renderShards();
        updateExpertiseAttentionDisplay();
    }
}

function resetGame(){
    if(confirm('Сбросить прогресс? Весь инвентарь и деньги исчезнут.')){
        localStorage.removeItem('udelka_save');
        localStorage.removeItem('expertise_zones_config');
        location.reload();
    }
}

function toggleGameMode(){
    gameState.isTesterMode = !gameState.isTesterMode;
    const btn = document.getElementById('modeBtn');
    if(btn){
        btn.innerHTML = gameState.isTesterMode ? '🧪' : '<span class="heart-toggle">❤️</span>';
        btn.title = gameState.isTesterMode ? 'Режим тестера' : 'Режим игрока';
    }
    if(gameState.isTesterMode){
        showNotification('🧪 Режим тестера: видишь правду', 'info');
    }else{
        showNotification('❤️ Режим игрока: погружение', 'success');
    }
    // show zones tab
    const zonesTab = document.getElementById('tab-zones');
    if(zonesTab) zonesTab.style.display = gameState.isTesterMode ? 'flex' : 'none';
    if(typeof saveGame === 'function') saveGame();
    if(typeof renderInventory === 'function') renderInventory();
    if(typeof renderMarket === 'function') renderMarket();
}

function toggleSampleFilter(){
    gameState.showSamplesInInventory = !gameState.showSamplesInInventory;
    if(typeof renderInventory === 'function') renderInventory();
    if(typeof saveGame === 'function') saveGame();
}

function toggleItemAsSample(itemId){
    const item = gameState.inventory.find(i=>i.id===itemId);
    if(!item) return;
    item.isSample = !item.isSample;
    showNotification(item.isSample ? '🧠 Помечен как образец' : '🧠 Снят с образцов', 'info');
    if(typeof calculateSkillLevels === 'function') calculateSkillLevels();
    renderInventory();
    if(typeof saveGame === 'function') saveGame();
}

function closeTacticUnlockModal(){
    const m = document.getElementById('tacticUnlockModal');
    if(m) m.classList.add('hidden');
}

// saveGame override to ensure header update
const _origSave = window.saveGame;
window.saveGame = function(){
    if(typeof _origSave === 'function') _origSave();
    else if(typeof gameState !== 'undefined') localStorage.setItem('udelka_save', JSON.stringify(gameState));
    if(typeof updateHeaderStats === 'function') updateHeaderStats();
}

// Ensure updateDisplay updates header
const _origUpdateDisplay = window.updateDisplay;
window.updateDisplay = function(){
    if(typeof _origUpdateDisplay === 'function') _origUpdateDisplay();
    if(typeof updateHeaderStats === 'function') updateHeaderStats();
}
