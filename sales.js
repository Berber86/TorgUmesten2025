
        // ==============================================
        // СИСТЕМА ПРОДАЖИ
        // ==============================================
    function startSell(itemId) {
    const item = gameState.inventory.find(i => i.id === itemId);
    if (!item) return;
    
    // Проверяем, является ли предмет образцом
    if (item.isSample) {
        showSellSampleConfirmation(item, function() {
            // Продолжаем продажу после подтверждения
            proceedWithSell(item);
        });
        return;
    }
    
    // Если не образец - сразу продаём
    proceedWithSell(item);
}

function proceedWithSell(item) {
    currentSell = item;
    document.getElementById('sellModal').classList.remove('hidden');
    renderSellModal();
}
        

// В функции renderSellModal заменяем блок аукциона
function renderSellModal() {
    const item = currentSell;
    const skill = gameState.skills[item.category] || 0;
    const displayName = getDisplayName(item, skill);
    
    document.getElementById('sellItemName').textContent = displayName;
    
    if (!gameState.isTesterMode) {
        document.getElementById('sellItemValue').textContent = formatMoney(item.estimatedValue || item.realValue);
    } else {
        document.getElementById('sellItemValue').textContent = formatMoney(item.estimatedValue || item.realValue);
    }
    
    const channels = [];
    
    channels.push({
        id: 'avito',
        name: '📱 Авито',
        desc: 'Продажа через 15 дней. Ручная установка цены. Налог 1000р',
        html: `
            <div class="channel-card" style="border-style:dashed">
                <div class="channel-title">📱 Авито <span class="eyebrow small" style="margin-left:auto">15 дней • 50% звонок</span></div>
                <div class="channel-desc">Налог: ${item.avitoRepost ? '1000₽' : 'БЕСПЛАТНО (первая)'}</div>
                <div style="margin-top:10px">
                    <label class="field-label">Твоя цена</label>
                    <input type="number" id="avitoPrice" class="input" placeholder="₽" value="${item.estimatedValue || item.realValue}" style="margin-top:4px">
                </div>
                ${!item.authentic ? `
                    <div style="margin-top:10px;background:#fff0ef;border:1px solid #ffbbb6;border-radius:10px;padding:8px">
                        <label style="display:flex;gap:8px;align-items:center;font-size:12px;font-weight:700;color:#9a2a22">
                            <input type="checkbox" id="sellAsFake" onclick="event.stopPropagation()">
                            ⚠️ Выдать подделку за подлинник (×10, риск возврата)
                        </label>
                    </div>
                ` : ''}
                <button onclick="selectAvitoSale()" class="btn primary full" style="margin-top:12px">📱 Выставить на Авито</button>
            </div>
        `
    });
    
    if (item.authentic) {
        channels.push({
            id: 'auction',
            name: '🔨 Аукцион',
            desc: '15 дней, стартовая ставка 5000р, комиссия 15%',
            html: `
                <div class="channel-card" onclick="selectSellChannel('auction')">
                    <div class="channel-title">🔨 Аукцион <span class="mono small" style="margin-left:auto;background:var(--paper-2);padding:4px 8px;border-radius:999px">старт 5 000₽</span></div>
                    <div class="channel-desc">15 дней, авто-рост ставки. Стоимость выставления 1 000₽, комиссия 15%</div>
                    <div class="channel-price mono">~ ${formatMoney(Math.max(5000, Math.round(item.realValue*0.8)))} → потолок</div>
                </div>
            `
        });
    } else {
        channels.push({
            id: 'auction',
            name: '🔨 Аукцион',
            desc: 'Только для подлинников',
            html: `
                <div class="channel-card disabled">
                    <div class="channel-title">🔨 Аукцион <span class="eyebrow small" style="margin-left:auto">недоступно</span></div>
                    <div class="channel-desc">Аукцион не принимает подделки</div>
                    <div class="mono" style="margin-top:8px;font-size:16px;font-weight:900">ноу</div>
                </div>
            `
        });
    }
    
    if (gameState.reputation >= 30 && skill >= 3) {
        const price = Math.round(item.realValue * (0.9 + Math.random() * 0.2));
        const days = 2 + Math.floor(Math.random() * 4);
        channels.push({
            id: 'regular',
            name: '👤 Постоянный клиент',
            desc: `90-110% от реальной цены, ${days} дней`,
            html: `
                <div class="channel-card" onclick="selectSellChannel('regular', ${price})">
                    <div class="channel-title">👤 Постоянный клиент <span class="eyebrow small" style="margin-left:auto">${days} дн</span></div>
                    <div class="channel-desc">Встреча через ${days} дня, честная цена</div>
                    <div class="channel-price mono">${formatMoney(price)}</div>
                </div>
            `
        });
    }
    
    const commissionPrice = Math.round(item.realValue * (0.2 + Math.random() * 0.1));
    
    if (!item.hasOwnProperty('commissionDecision')) {
        const hash = item.id.split('_').reduce((sum, part) => sum + part.charCodeAt(0), 0);
        item.commissionDecision = (hash % 2) === 0;
    }
    
    let commissionHTML = '';
    if (item.commissionDecision) {
        commissionHTML = `
            <div class="channel-card" onclick="selectSellChannel('commission', ${commissionPrice})">
                <div class="channel-title">🏪 Комиссионка <span class="eyebrow small" style="margin-left:auto">мгновенно</span></div>
                <div class="channel-desc">20-30% от реальной цены, без ожиданий</div>
                <div class="channel-price mono">${formatMoney(commissionPrice)}</div>
            </div>
        `;
    } else {
        commissionHTML = `
            <div class="channel-card disabled">
                <div class="channel-title">🏪 Комиссионка</div>
                <div class="channel-desc">Комиссионка не заинтересована в этом товаре</div>
                <div class="mono" style="margin-top:8px">Это нам не надо</div>
            </div>
        `;
    }
    
    channels.push({
        id: 'commission',
        name: '🏪 Комиссионка',
        desc: item.commissionDecision ? '20-30% от реальной цены, мгновенно' : 'Отказ в покупке',
        html: commissionHTML
    });
    
    document.getElementById('sellChannels').innerHTML = channels.map(c => c.html).join('');
}

        function selectAvitoSale() {
            const item = currentSell;
            const playerPriceInput = document.getElementById('avitoPrice').value;
            const playerPrice = parseInt(playerPriceInput) || (item.estimatedValue || item.realValue);
            const sellAsFake = document.getElementById('sellAsFake') ? document.getElementById('sellAsFake').checked : false;
            const tax = item.avitoRepost ? 1000 : 0;

            if (gameState.money < tax) {
                showNotification('Недостаточно денег для налога!', 'error');
                return;
            }

            gameState.money -= tax;

            const saleItem = {
                ...item,
                channel: 'avito',
                playerPrice: sellAsFake ? playerPrice * 10 : playerPrice,
                daysLeft: 15,
                totalDays: 15,
                offers: [],
                soldAsAuthentic: sellAsFake ? true : item.soldAsAuthentic,
                isFraud: sellAsFake
            };

            gameState.sellingItems.push(saleItem);
            gameState.inventory = gameState.inventory.filter(i => i.id !== item.id);

            // Пересчитываем навыки после удаления предмета из инвентаря
            calculateSkillLevels();

            showNotification(`📱 Выставлено на Авито за ${formatMoney(saleItem.playerPrice)}${tax > 0 ? ` (налог ${tax}р)` : ''}`, 'success');
            closeSell();
            updateDisplay();
            renderInventory();
            saveGame();
        }



        function selectSellChannel(channel, price) {
    const item = currentSell;

    if (channel === 'commission') {
        // ПРОВЕРЯЕМ РЕШЕНИЕ КОМИССИОНКИ ДЛЯ ЭТОГО ТОВАРА
        if (!item.commissionDecision) {
            showNotification('🏪 Комиссионка не заинтересована в этом товаре', 'warning');
            return;
        }
        
        gameState.money += price;
        gameState.stats.sold++;
        gameState.stats.profit += (price - item.purchasePrice - (item.expertiseCost || 0));
        logDeal(item, price, 'Комиссионка');
        gameState.inventory = gameState.inventory.filter(i => i.id !== item.id);
        
        // Пересчитываем навыки после удаления предмета из инвентаря
        calculateSkillLevels();
        
        showNotification(`✅ Продано в комиссионку за ${formatMoney(price)}!`, 'success');
        closeSell();
        updateDisplay();
        renderInventory();
        saveGame();
        return;
    }

    if (channel === 'auction') {
        // ПРОВЕРКА ДЕНЕГ ДЛЯ ВЫСТАВЛЕНИЯ НА АУКЦИОН
        if (gameState.money < 1000) {
            showNotification('Недостаточно денег для оплаты выставления лота!', 'error');
            return;
        }

        // СПИСЫВАЕМ 1000р ЗА ВЫСТАВЛЕНИЕ
        gameState.money -= 1000;

        const saleItem = {
            ...item,
            channel: 'auction',
            startBid: 5000, // Фиксированная стартовая цена
            currentBid: 5000,
            daysLeft: 15,
            totalDays: 15
        };
        gameState.sellingItems.push(saleItem);
        gameState.inventory = gameState.inventory.filter(i => i.id !== item.id);
        
        // Пересчитываем навыки после удаления предмета из инвентаря
        calculateSkillLevels();
        
        showNotification(`🔨 Выставлено на аукцион за 1,000р! Стартовая цена: 5,000р`, 'success');
        closeSell();
        updateDisplay();
        renderInventory();
        saveGame();
        return;
    }

    if (channel === 'regular') {
        const days = 2 + Math.floor(Math.random() * 4);
        const saleItem = {
            ...item,
            channel: 'regular',
            salePrice: price,
            daysLeft: days,
            totalDays: days
        };
        gameState.sellingItems.push(saleItem);
        gameState.inventory = gameState.inventory.filter(i => i.id !== item.id);
        
        // Пересчитываем навыки после удаления предмета из инвентаря
        calculateSkillLevels();
        
        showNotification(`👤 Встреча назначена через ${days} дня!`, 'success');
        closeSell();
        updateDisplay();
        renderInventory();
        saveGame();
        return;
    }
}

        function acceptAvitoOffer(saleId, offerIdx) {
            const sale = gameState.sellingItems.find(s => s.id === saleId);
            if (!sale || !sale.offers[offerIdx]) return;

            const offer = sale.offers[offerIdx];

            if (sale.isFraud) {
                const fraudDetected = Math.random() < 0.3;
                if (fraudDetected) {
                    const returnDays = 2 + Math.floor(Math.random() * 4);
                    showNotification(`⚠️ Покупатель обнаружил подделку! Требование вернуть ${formatMoney(offer.price * 1.2)} через ${returnDays} дня!`, 'error');
                    sale.fraudReturn = {
                        amount: Math.round(offer.price * 1.2),
                        daysLeft: returnDays
                    };
                    gameState.money += offer.price;
                    saveGame();
                    renderSellingTab();
                    return;
                }
            }

            gameState.money += offer.price;
            gameState.stats.sold++;
            gameState.stats.profit += (offer.price - sale.purchasePrice - (sale.expertiseCost || 0));
            logDeal(sale, offer.price, 'Авито');
            gameState.sellingItems = gameState.sellingItems.filter(s => s.id !== saleId);
            showNotification(`✅ Продано через Авито за ${formatMoney(offer.price)}!`, 'success');
            updateDisplay();
            renderSellingTab();
            saveGame();
        }

        function rejectAvitoOffer(saleId, offerIdx) {
            const sale = gameState.sellingItems.find(s => s.id === saleId);
            if (!sale) return;

            sale.offers.splice(offerIdx, 1);
            showNotification('Предложение отклонено', 'info');
            renderSellingTab();
            saveGame();
        }

        function removeFromSale(saleId) {
            const sale = gameState.sellingItems.find(s => s.id === saleId);
            if (!sale) return;

            gameState.sellingItems = gameState.sellingItems.filter(s => s.id !== saleId);
            gameState.inventory.push(sale);
            
            // Пересчитываем навыки после возврата предмета в инвентарь
            calculateSkillLevels();
            
            showNotification('Товар снят с продажи', 'info');
            updateDisplay();
            renderInventory();
            renderSellingTab();
            saveGame();
        }
        


        function renderSellingTab() {
    const container = document.getElementById('sellingItems');
    const empty = document.getElementById('emptySelling');

    if (gameState.sellingItems.length === 0) {
        container.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');
    container.innerHTML = gameState.sellingItems.map(sale => {
        const skill = gameState.skills[sale.category] || 0;
        const displayName = getDisplayName(sale, skill);
        const icon = DETAILED_ICONS[sale.baseName] || CATEGORY_ICONS[sale.category] || '◫';
        
        let statusHTML = '';
        if (sale.channel === 'avito') {
            statusHTML = `
                <div class="sale-channel mono" style="background:#e0f0ff;color:#2a3a9a">📱 Авито • ${sale.daysLeft}/${sale.totalDays} дн • ${formatMoney(sale.playerPrice)}</div>
                <div style="margin-top:10px">
                    ${sale.offers && sale.offers.length > 0 ? `
                        <div class="stack" style="gap:8px">
                            ${sale.offers.map((offer, idx) => `
                                <div class="channel-card" style="padding:10px">
                                    <div class="small">💬 ${formatMoney(offer.price)} <span class="muted">(${offer.percent}%)</span></div>
                                    <div class="row gap" style="margin-top:8px">
                                        <button onclick="acceptAvitoOffer('${sale.id}', ${idx})" class="btn small primary" style="flex:1">Принять</button>
                                        <button onclick="rejectAvitoOffer('${sale.id}', ${idx})" class="btn small ghost" style="flex:1">Отказ</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<div class="muted small" style="margin-top:8px">Ожидание звонков...</div>'}
                    <button onclick="removeFromSale('${sale.id}')" class="btn small ghost" style="width:100%;margin-top:10px">🗑️ Снять с продажи</button>
                </div>
            `;
        } else if (sale.channel === 'auction') {
            const currentBidDisplay = sale.currentBid === 5000 ? "нет ставок" : formatMoney(sale.currentBid);
            const isNoBid = sale.currentBid === 5000;
            statusHTML = `
                <div class="sale-channel mono" style="background:#f3e8ff;color:#5b2a9a">🔨 Аукцион • ${sale.daysLeft}/${sale.totalDays} дн</div>
                <div style="margin-top:10px">
                    <div class="small muted">Старт: ${formatMoney(sale.startBid)}</div>
                    <div class="mono" style="font-size:16px;font-weight:900;margin-top:4px;${isNoBid ? 'color:var(--ink-muted)' : 'color:var(--accent-3)'}">${isNoBid ? '❌ нет ставок' : currentBidDisplay}</div>
                    <div class="small muted" style="margin-top:4px">Комиссия 15% при продаже</div>
                </div>
            `;
        } else if (sale.channel === 'regular') {
            statusHTML = `
                <div class="sale-channel mono" style="background:#e6f5e6;color:#2f6a2f">👤 Постоянный клиент • ${sale.daysLeft}/${sale.totalDays} дн</div>
                <div style="margin-top:10px">
                    <div class="mono" style="font-size:16px;font-weight:900">${formatMoney(sale.salePrice)}</div>
                    <div class="small muted">Встреча назначена</div>
                </div>
            `;
        }

        return `<div class="sale-card">
            <div class="sale-head">
                <div style="display:flex;gap:10px;align-items:center">
                    <div style="font-size:22px">${icon}</div>
                    <div class="sale-title">${displayName}</div>
                </div>
            </div>
            <div style="margin-top:12px">${statusHTML}</div>
        </div>`;
    }).join('');
}


function processSales() {
    const toRemove = [];
    
    gameState.sellingItems.forEach(sale => {
        if (sale.fraudReturn) {
            sale.fraudReturn.daysLeft--;
            if (sale.fraudReturn.daysLeft <= 0) {
                if (gameState.money >= sale.fraudReturn.amount) {
                    gameState.money -= sale.fraudReturn.amount;
                    showNotification(`😱 Покупатель обнаружил подделку! Требование вернуть ${formatMoney(sale.fraudReturn.amount)} с пеней!`, 'error');
                } else {
                    gameState.reputation -= 50;
                    showNotification(`💸 Не смогли вернуть деньги! Репутация разрушена! -50 репутации!`, 'error');
                }
                toRemove.push(sale.id);
                return;
            }
        }
        
        sale.daysLeft--;
        
       if (sale.channel === 'avito') {
    if (Math.random() < 0.5) {
        const discountBase = Math.random() * 100;
        const discountModified = sale.isFraud ?
            discountBase * (sale.playerPrice / (sale.realValue * 10)) :
            discountBase * (sale.playerPrice / sale.realValue);
        const offerPrice = Math.max(0, Math.round(sale.playerPrice * (1 - discountModified / 100)));
        const percent = Math.round((offerPrice / sale.playerPrice) * 100);
        sale.offers = sale.offers || [];
        sale.offers.push({ price: offerPrice, percent });
        
        // 👇 СПЕЦИАЛЬНАЯ ОБРАБОТКА ДЛЯ 0 РУБЛЕЙ
        if (offerPrice === 0) {
            // Берем случайное сообщение из константы
            const randomIndex = Math.floor(Math.random() * AVITO_ZERO_RUBLES_MESSAGES.length);
            const zeroMessage = AVITO_ZERO_RUBLES_MESSAGES[randomIndex];
            
            // Показываем специальное уведомление
            showNotification(`🤡 Предложение 0 рублей! ${zeroMessage}`, 'avito');
        } else {
            // Обычное уведомление
            showNotification(`📞 Звонок по Авито: предложение ${formatMoney(offerPrice)} (${percent}%)`, 'avito');
        }
    }
            
            if (sale.daysLeft <= 0) {
                sale.avitoRepost = true;
                gameState.inventory.push(sale);
                
                calculateSkillLevels();
                
                const repostMessages = [
                    "📱 Товар не продан на Авито. Пора выкладывать новое фото с котиком!",
                    "⏰ Время публикации истекло. Видимо, нужно было добавить «магические свойства» в описание!",
                    "💸 Не удалось продать. Может, стоит указать, что эта вещь принадлежала самому Гарри Поттеру?",
                    "🔄 Требуется новая публикация. На этот раз попробуем написать «срочно!» заглавными буквами!",
                    "📉 Объявление снято. Видимо, цена «я так хочу» никого не заинтересовала!"
                ];
                
                const randomMessage = repostMessages[Math.floor(Math.random() * repostMessages.length)];
                showNotification(`${randomMessage} (налог 1000р)`, 'warning');
                toRemove.push(sale.id);
            }
        }
        
        if (sale.channel === 'auction') {
            // НОВАЯ ЛОГИКА АУКЦИОНА
            
            // Если реальная стоимость меньше 5000 - не повышаем ставки
            if (sale.realValue < 5000) {
                // Предмет слишком дешевый для аукциона
                if (sale.daysLeft <= 0) {
                    // Возвращаем предмет в инвентарь
                    gameState.inventory.push(sale);
                    toRemove.push(sale.id);
                    // Уведомление не показываем согласно требованию
                }
            } else {
                // Реальная стоимость >= 5000 - повышаем ставки
                let growth = 0;
                
                // Базовая случайная ставка (1-299)
                const randomValue = 1 + Math.random() * 299;
                const growthPercent = Math.pow(randomValue, 0.25) / 100;
                const baseGrowth = Math.round(sale.realValue * growthPercent);
                
                // Если текущая ставка ниже реальной стоимости - добавляем бонус
                if (sale.currentBid < sale.realValue) {
                    const difference = sale.realValue - sale.currentBid;
                    const bonusGrowth = Math.round(difference / 7); // Бонус для выравнивания за 7 дней
                    growth = baseGrowth + bonusGrowth;
                } else {
                    growth = baseGrowth;
                }
                
                // Сохраняем старую цену для проверки изменения
                const oldBid = sale.currentBid;
                sale.currentBid += growth;
                
                // Уведомления о ставках не показываем согласно требованию
                
                if (sale.daysLeft <= 0) {
                    const finalPrice = Math.round(sale.currentBid * 0.85); // Комиссия 15%
                    gameState.money += finalPrice;
                    gameState.stats.sold++;
                    gameState.stats.profit += (finalPrice - sale.purchasePrice - (sale.expertiseCost || 0));
                    logDeal(sale, finalPrice, 'Аукцион');
                    
                    const soldMessages = [
                        `🔨 Аукцион завершен! Получено ${formatMoney(finalPrice)} (комиссия 15%)`,
                        `🎊 Продано с аукциона! ${formatMoney(finalPrice)} на счету!`,
                        `💼 Аукционный дом поработал на славу: ${formatMoney(finalPrice)}!`,
                        `🏆 Торги завершены! Ваш выигрыш: ${formatMoney(finalPrice)}!`
                    ];
                    const randomMessage = soldMessages[Math.floor(Math.random() * soldMessages.length)];
                    showNotification(randomMessage, 'success');
                    toRemove.push(sale.id);
                }
            }
        }
        
        if (sale.channel === 'regular') {
            if (sale.daysLeft <= 0) {
                gameState.money += sale.salePrice;
                gameState.stats.sold++;
                gameState.stats.profit += (sale.salePrice - sale.purchasePrice - (sale.expertiseCost || 0));
                logDeal(sale, sale.salePrice, 'Постоянный клиент');
                
                const clientMessages = [
                    `👤 Встреча состоялась! Получено ${formatMoney(sale.salePrice)}!`,
                    `🤝 Постоянный клиент не подвел: ${formatMoney(sale.salePrice)}!`,
                    `💼 Деловая встреча прошла успешно: ${formatMoney(sale.salePrice)}!`,
                    `🎩 Клиент оказался джентльменом: ${formatMoney(sale.salePrice)}!`
                ];
                const randomMessage = clientMessages[Math.floor(Math.random() * clientMessages.length)];
                showNotification(randomMessage, 'success');
                toRemove.push(sale.id);
            }
        }
    });
    
    gameState.sellingItems = gameState.sellingItems.filter(s => !toRemove.includes(s.id));
}


        function logDeal(item, salePrice, channel) {
            const skill = gameState.skills[item.category] || 0;
            gameState.dealsLog.push({
                displayName: getDisplayName(item, 0),
                trueName: getTrueName(item),
                sellerPrice: item.askingPrice,
                purchasePrice: item.purchasePrice,
                expertiseCost: item.expertiseCost || 0,
                estimatedValue: item.estimatedValue || item.realValue,
                salePrice,
                channel,
                realValue: item.realValue,
                authentic: item.authentic,
                soldAsAuthentic: item.soldAsAuthentic,
                defects: item.defects
            });
        }

