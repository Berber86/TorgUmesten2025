
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
    
    // РЕЖИМ ИГРОКА: ПОКАЗЫВАЕМ ОЦЕНКУ ИГРОКА, А НЕ РЕАЛЬНУЮ СТОИМОСТЬ
    if (!gameState.isTesterMode) {
        document.getElementById('sellItemValue').textContent = formatMoney(item.estimatedValue || item.realValue);
    } else {
        document.getElementById('sellItemValue').textContent = formatMoney(item.estimatedValue || item.realValue);
    }
    
    const channels = [];
    
    // Авито
    channels.push({
        id: 'avito',
        name: '📱 Авито',
        desc: 'Продажа через 15 дней. Ручная установка цены. Налог 1000р',
        html: `
            <div class="bg-blue-50 p-4 rounded-lg">
                <h3 class="font-bold mb-2">📱 Авито</h3>
                <div class="text-sm text-gray-600">15 дней, 50% шанс звонка в день</div>
                <div class="text-sm text-gray-600">Налог: ${item.avitoRepost ? '1000р' : 'БЕСПЛАТНО (первая публикация)'}</div>
                <div class="mt-2">
                    <label class="block text-xs mb-1">Укажите цену продажи:</label>
                    <input type="number" id="avitoPrice" class="w-full border rounded p-2" placeholder="Ваша цена" value="${item.estimatedValue || item.realValue}">
                </div>
                ${!item.authentic ? `
                    <div class="mt-2 bg-red-50 p-2 rounded border border-red-300">
                        <label class="flex items-center text-sm">
                            <input type="checkbox" id="sellAsFake" class="mr-2" onclick="event.stopPropagation()">
                            <span class="text-red-700 font-bold">⚠️ Выдать подделку за подлинник (×10 к цене, риск возврата)</span>
                        </label>
                    </div>
                ` : ''}
                <button onclick="selectAvitoSale()" class="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold">
                    📱 Выставить на Авито
                </button>
            </div>
        `
    });
    
    // Аукцион - ОБНОВЛЕННАЯ ЛОГИКА С СООБЩЕНИЕМ "НОУ" ДЛЯ ПОДДЕЛОК
    if (item.authentic) {
        channels.push({
            id: 'auction',
            name: '🔨 Аукцион',
            desc: '15 дней, стартовая ставка 5000р, комиссия 15%',
            html: `
                <div class="bg-purple-50 p-4 rounded-lg cursor-pointer hover:bg-purple-100" onclick="selectSellChannel('auction')">
                    <h3 class="font-bold">🔨 Аукцион</h3>
                    <div class="text-sm text-gray-600">15 дней, автоматический рост ставки</div>
                    <div class="text-sm text-gray-600">Стартовая ставка: 5,000р</div>
                    <div class="text-sm text-orange-600">Стоимость выставления: 1,000р</div>
                    <div class="text-sm text-orange-600">Комиссия аукционного дома: 15%</div>
                </div>
            `
        });
    } else {
        // ДЛЯ ПОДДЕЛОК - СООБЩЕНИЕ "НОУ"
        channels.push({
            id: 'auction',
            name: '🔨 Аукцион',
            desc: 'Только для подлинников',
            html: `
                <div class="bg-gray-100 p-4 rounded-lg cursor-not-allowed opacity-70">
                    <h3 class="font-bold text-gray-500">🔨 Аукцион</h3>
                    <div class="text-sm text-gray-500">15 дней, автоматический рост ставки</div>
                    <div class="text-lg font-bold text-gray-500">ноу</div>
                    <div class="text-xs text-gray-500 mt-1">Аукцион не принимает подделки</div>
                </div>
            `
        });
    }
    
    // Постоянные клиенты
    if (gameState.reputation >= 30 && skill >= 3) {
        const price = Math.round(item.realValue * (0.9 + Math.random() * 0.2));
        const days = 2 + Math.floor(Math.random() * 4);
        channels.push({
            id: 'regular',
            name: '👤 Постоянный клиент',
            desc: `90-110% от реальной цены, ${days} дней`,
            html: `
                <div class="bg-green-50 p-4 rounded-lg cursor-pointer hover:bg-green-100" onclick="selectSellChannel('regular', ${price})">
                    <h3 class="font-bold">👤 Постоянный клиент</h3>
                    <div class="text-sm text-gray-600">Встреча через ${days} дня</div>
                    <div class="text-lg font-bold text-green-600">${formatMoney(price)}</div>
                </div>
            `
        });
    }
    
    // Комиссионка - ОБНОВЛЕННАЯ ЛОГИКА
    const commissionPrice = Math.round(item.realValue * (0.2 + Math.random() * 0.1));
    
    // ДЕТЕРМИНИРОВАННОЕ РЕШЕНИЕ КОМИССИОНКИ ДЛЯ ЭТОГО ТОВАРА
    if (!item.hasOwnProperty('commissionDecision')) {
        // Генерируем решение один раз и навсегда для этого предмета
        const hash = item.id.split('_').reduce((sum, part) => sum + part.charCodeAt(0), 0);
        item.commissionDecision = (hash % 2) === 0; // 50% шанс
    }
    
    let commissionHTML = '';
    if (item.commissionDecision) {
        // КОМИССИОНКА СОГЛАСНА КУПИТЬ
        commissionHTML = `
            <div class="bg-orange-50 p-4 rounded-lg cursor-pointer hover:bg-orange-100" onclick="selectSellChannel('commission', ${commissionPrice})">
                <h3 class="font-bold">🏪 Комиссионка</h3>
                <div class="text-sm text-gray-600">Мгновенная продажа</div>
                <div class="text-lg font-bold text-orange-600">${formatMoney(commissionPrice)}</div>
            </div>
        `;
    } else {
        // КОМИССИОНКА ОТКАЗЫВАЕТСЯ
        commissionHTML = `
            <div class="bg-gray-100 p-4 rounded-lg cursor-not-allowed opacity-70">
                <h3 class="font-bold text-gray-500">🏪 Комиссионка</h3>
                <div class="text-sm text-gray-500">Мгновенная продажа</div>
                <div class="text-lg font-bold text-gray-500">Это нам не надо</div>
                <div class="text-xs text-gray-500 mt-1">Комиссионка не заинтересована в этом товаре</div>
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
        
        let statusHTML = '';
        if (sale.channel === 'avito') {
            statusHTML = `
                <div class="bg-blue-50 p-3 rounded">
                    <div class="font-bold">📱 Авито - День ${sale.daysLeft}/${sale.totalDays}</div>
                    <div class="text-sm">Цена: ${formatMoney(sale.playerPrice)}</div>
                    ${sale.offers && sale.offers.length > 0 ? `
                        <div class="mt-2 space-y-2">
                            ${sale.offers.map((offer, idx) => `
                                <div class="bg-white p-2 rounded border offer-item">
                                    <div class="text-sm">💬 Предложение: ${formatMoney(offer.price)} (${offer.percent}%)</div>
                                    <div class="flex gap-2 mt-1">
                                        <button onclick="acceptAvitoOffer('${sale.id}', ${idx})" class="flex-1 bg-green-500 text-white py-1 px-2 rounded text-xs">✅ Принять</button>
                                        <button onclick="rejectAvitoOffer('${sale.id}', ${idx})" class="flex-1 bg-red-500 text-white py-1 px-2 rounded text-xs">❌ Отказать</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<div class="text-sm text-gray-500 mt-2">Ожидание звонков...</div>'}
                    <button onclick="removeFromSale('${sale.id}')" class="w-full mt-2 bg-gray-500 text-white py-1 rounded text-sm">🗑️ Снять с продажи</button>
                </div>
            `;
        } else if (sale.channel === 'auction') {
            // ОТОБРАЖЕНИЕ "НЕТ СТАВОК" ДЛЯ ЦЕНЫ 5000
            const currentBidDisplay = sale.currentBid === 5000 ? "нет ставок" : formatMoney(sale.currentBid);
            
            statusHTML = `
                <div class="bg-purple-50 p-3 rounded">
                    <div class="font-bold">🔨 Аукцион - День ${sale.daysLeft}/${sale.totalDays}</div>
                    <div class="text-sm">Стартовая ставка: ${formatMoney(sale.startBid)}</div>
                    <div class="text-lg font-bold ${sale.currentBid === 5000 ? 'text-gray-600' : 'text-green-600'}">
                        ${sale.currentBid === 5000 ? '❌ Текущая: нет ставок' : `Текущая: ${formatMoney(sale.currentBid)}`}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">Комиссия 15% при продаже</div>
                </div>
            `;
        } else if (sale.channel === 'regular') {
            statusHTML = `
                <div class="bg-green-50 p-3 rounded">
                    <div class="font-bold">👤 Постоянный клиент - День ${sale.daysLeft}/${sale.totalDays}</div>
                    <div class="text-lg font-bold text-green-600">Цена: ${formatMoney(sale.salePrice)}</div>
                    <div class="text-xs text-gray-500 mt-1">Встреча назначена</div>
                </div>
            `;
        }

        return `<div class="bg-white p-4 rounded-lg shadow">${displayName}${statusHTML}</div>`;
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

