

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
    
    const currentValue = item.estimatedValue || item.realValue || 1000;
    const totalSeverityPercent = Math.round((analysis.totalSeverity || 0) * 100);
    const restorationPotentialPercent = Math.round((analysis.restorationPotential || 0) * 100);

    let content = `
        <div style="display:flex;flex-direction:column;gap:16px">
            <div class="row between" style="align-items:flex-start">
                <div>
                    <div class="eyebrow small">${CATEGORY_ICONS[item.category]} ${item.category}</div>
                    <div class="h3" style="margin-top:4px">${displayName}</div>
                </div>
                <div style="text-align:right">
                    <div class="mono" style="font-size:18px;font-weight:900;color:var(--accent-3)">${formatMoney(currentValue)}</div>
                    <div class="small muted">текущая оценка</div>
                    <div class="small" style="color:#5b6abf">реальная: ${formatMoney(item.realValue)}</div>
                </div>
            </div>
            
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
                <div class="stat-card" style="background:var(--paper-2)">
                    <div class="stat-label">Повреждения</div>
                    <div class="stat-num mono" style="color:#d45d2a">${totalSeverityPercent}%</div>
                </div>
                <div class="stat-card" style="background:var(--paper-2)">
                    <div class="stat-label">Потенциал</div>
                    <div class="stat-num mono" style="color:var(--accent-3)">${restorationPotentialPercent}%</div>
                </div>
            </div>
            
            <div>
                <div class="eyebrow small" style="margin-bottom:8px">ДЕФЕКТЫ И ПРОГРЕСС</div>
                <div class="stack" style="gap:10px">
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
            
            const currentSeverity = baseSeverity * (1 - (progress / 100));
            const currentSeverityPercent = Math.round(currentSeverity * 100);
            const valueImpact = Math.round((item.realValue || 1000) * baseSeverity * (progress / 100));
            
            content += `
                <div class="restoration-defect">
                    <div class="row between" style="margin-bottom:6px">
                        <span style="font-weight:700;font-size:13px">${difficultyIcons[difficulty]} ${defect}</span>
                        <span class="eyebrow small" style="background:var(--paper-2);padding:3px 8px;border-radius:999px;border:1px solid var(--line)">${difficulty.toUpperCase()}</span>
                    </div>
                    <div class="row between small muted" style="margin-bottom:6px">
                        <span>Прогресс: ${progress}%</span>
                        <span>Штраф: -${severityPercent}%</span>
                    </div>
                    <div class="progress-track" style="height:8px"><div class="progress-fill" style="width:${progress}%;background:var(--accent-3)"></div></div>
                    <div class="small muted" style="margin-top:6px">
                        Сейчас: -${currentSeverityPercent}% • Восстановлено: +${formatMoney(valueImpact)}
                        ${progress >= 100 ? ' • ✅ готово' : ''}
                    </div>
                </div>
            `;
        });
    } else {
        content += `<div class="muted small">Дефектов не обнаружено</div>`;
    }

    content += `
                </div>
            </div>
            
            <div>
                <div class="eyebrow small" style="margin-bottom:10px">ВАРИАНТЫ РЕСТАВРАЦИИ</div>
                <div class="stack" style="gap:12px">
    `;

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
            <div>
                <div class="small" style="font-weight:800;margin-bottom:8px">🎓 Самостоятельно</div>
                <div class="stack" style="gap:8px">
        `;
        selfMethods.forEach(method => {
            const attemptCount = item.restorationAttempts || 0;
            const costMultiplier = Math.pow(method.costReduction || 0.7, attemptCount);
            const actualCost = Math.round((method.cost || 100) * costMultiplier);
            
            content += `
                <button onclick="attemptAdvancedRestoration('${item.id}', '${method.id}')" class="restoration-option" style="text-align:left;width:100%;cursor:pointer">
                    <div>
                        <div style="font-weight:700;font-size:13px">${method.name}</div>
                        <div class="small muted">Риск ${Math.round((method.risk || 0.2) * 100)}% • Ур ${method.skillReq || 1}${attemptCount>0 ? ` • Попыток ${attemptCount} (-${Math.round((1-costMultiplier)*100)}%)` : ''}</div>
                    </div>
                    <div class="mono" style="font-weight:900;color:var(--accent-3)">${formatMoney(actualCost)}</div>
                </button>
            `;
        });
        content += `</div></div>`;
    }
    
    Object.entries(professionalStudios).forEach(([level, studio]) => {
        if (studio.specialties.includes(getItemSpecialty(item))) {
            const cost = calculateStudioCost(studio, item, analysis);
            content += `
                <div class="channel-card">
                    <div class="row between" style="align-items:flex-start">
                        <div>
                            <div style="font-weight:800;font-size:14px">${studio.name}</div>
                            <div class="small muted" style="margin-top:2px">${studio.description}</div>
                        </div>
                        <div style="text-align:right">
                            <div class="mono" style="font-weight:900">${formatMoney(cost)}</div>
                            <div class="small" style="color:var(--accent-3)">Успех ${Math.round((studio.successRate || 0.85) * 100)}%</div>
                        </div>
                    </div>
                    <div class="row between small muted" style="margin-top:8px">
                        <span>⏱️ ${studio.timeRequired || 3} дн</span>
                        <span>🛠️ ${(studio.specialties || []).join(', ')}</span>
                    </div>
                    <button onclick="startProfessionalRestoration('${item.id}', '${level}')" class="btn primary small full" style="margin-top:10px">Заказать реставрацию</button>
                </div>
            `;
        }
    });

    content += `</div></div></div>`;

    document.getElementById('restorationContent').innerHTML = content;
}

