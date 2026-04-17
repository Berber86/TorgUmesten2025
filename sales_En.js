
        // ==============================================
        // SALES SYSTEM
        // ==============================================
    function startSell(itemId) {
    const item = gameState.inventory.find(i => i.id === itemId);
    if (!item) return;
    
    // Check if item is a sample
    if (item.isSample) {
        showSellSampleConfirmation(item, function() {
            // Continue with sale after confirmation
            proceedWithSell(item);
        });
        return;
    }
    
    // If not a sample - sell immediately
    proceedWithSell(item);
}

function proceedWithSell(item) {
    currentSell = item;
    document.getElementById('sellModal').classList.remove('hidden');
    renderSellModal();
}
        

// In renderSellModal function replace auction block
function renderSellModal() {
    const item = currentSell;
    const skill = gameState.skills[item.category] || 0;
    const displayName = getDisplayName(item, skill);
    
    document.getElementById('sellItemName').textContent = displayName;
    
    // PLAYER MODE: SHOW PLAYER'S ESTIMATE, NOT REAL VALUE
    if (!gameState.isTesterMode) {
        document.getElementById('sellItemValue').textContent = formatMoney(item.estimatedValue || item.realValue);
    } else {
        document.getElementById('sellItemValue').textContent = formatMoney(item.estimatedValue || item.realValue);
    }
    
    const channels = [];
    
    // Avito
    channels.push({
        id: 'avito',
        name: '📱 Avito',
        desc: 'Sale in 15 days. Manual price setting. Tax 1000р',
        html: `
            <div class="bg-blue-50 p-4 rounded-lg">
                <h3 class="font-bold mb-2">📱 Avito</h3>
                <div class="text-sm text-gray-600">15 days, 50% chance of a call per day</div>
                <div class="text-sm text-gray-600">Tax: ${item.avitoRepost ? '1000р' : 'FREE (first posting)'}</div>
                <div class="mt-2">
                    <label class="block text-xs mb-1">Set your sale price:</label>
                    <input type="number" id="avitoPrice" class="w-full border rounded p-2" placeholder="Your price" value="${item.estimatedValue || item.realValue}">
                </div>
                ${!item.authentic ? `
                    <div class="mt-2 bg-red-50 p-2 rounded border border-red-300">
                        <label class="flex items-center text-sm">
                            <input type="checkbox" id="sellAsFake" class="mr-2" onclick="event.stopPropagation()">
                            <span class="text-red-700 font-bold">⚠️ Sell forgery as authentic (×10 price, return risk)</span>
                        </label>
                    </div>
                ` : ''}
                <button onclick="selectAvitoSale()" class="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold">
                    📱 List on Avito
                </button>
            </div>
        `
    });
    
    // Auction - UPDATED LOGIC WITH "NO" MESSAGE FOR FORGERIES
    if (item.authentic) {
        channels.push({
            id: 'auction',
            name: '🔨 Auction',
            desc: '15 days, starting bid 5000р, 15% commission',
            html: `
                <div class="bg-purple-50 p-4 rounded-lg cursor-pointer hover:bg-purple-100" onclick="selectSellChannel('auction')">
                    <h3 class="font-bold">🔨 Auction</h3>
                    <div class="text-sm text-gray-600">15 days, automatic bid increase</div>
                    <div class="text-sm text-gray-600">Starting bid: 5,000р</div>
                    <div class="text-sm text-orange-600">Listing cost: 1,000р</div>
                    <div class="text-sm text-orange-600">Auction house commission: 15%</div>
                </div>
            `
        });
    } else {
        // FOR FORGERIES - "NO" MESSAGE
        channels.push({
            id: 'auction',
            name: '🔨 Auction',
            desc: 'For authentic items only',
            html: `
                <div class="bg-gray-100 p-4 rounded-lg cursor-not-allowed opacity-70">
                    <h3 class="font-bold text-gray-500">🔨 Auction</h3>
                    <div class="text-sm text-gray-500">15 days, automatic bid increase</div>
                    <div class="text-lg font-bold text-gray-500">no</div>
                    <div class="text-xs text-gray-500 mt-1">Auction doesn\'t accept forgeries</div>
                </div>
            `
        });
    }
    
    // Regular clients
    if (gameState.reputation >= 30 && skill >= 3) {
        const price = Math.round((item.estimatedValue || item.realValue) * (0.9 + Math.random() * 0.2));
        const days = 2 + Math.floor(Math.random() * 4);
        channels.push({
            id: 'regular',
            name: '👤 Regular client',
            desc: `90-110% of real value, ${days} days`,
            html: `
                <div class="bg-green-50 p-4 rounded-lg cursor-pointer hover:bg-green-100" onclick="selectSellChannel('regular', ${price})">
                    <h3 class="font-bold">👤 Regular client</h3>
                    <div class="text-sm text-gray-600">Meeting in ${days} days</div>
                    <div class="text-lg font-bold text-green-600">${formatMoney(price)}</div>
                </div>
            `
        });
    }
    
    // Pawn shop - UPDATED LOGIC
    const commissionPrice = Math.round(item.realValue * (0.2 + Math.random() * 0.1));
    
    // DETERMINISTIC PAWN SHOP DECISION FOR THIS ITEM
    if (!item.hasOwnProperty('commissionDecision')) {
        // Generate decision once and forever for this item
        const hash = item.id.split('_').reduce((sum, part) => sum + part.charCodeAt(0), 0);
        item.commissionDecision = (hash % 2) === 0; // 50% chance
    }
    
    let commissionHTML = '';
    if (item.commissionDecision) {
        // PAWN SHOP AGREES TO BUY
        commissionHTML = `
            <div class="bg-orange-50 p-4 rounded-lg cursor-pointer hover:bg-orange-100" onclick="selectSellChannel('commission', ${commissionPrice})">
                <h3 class="font-bold">🏪 Pawn shop</h3>
                <div class="text-sm text-gray-600">Instant sale</div>
                <div class="text-lg font-bold text-orange-600">${formatMoney(commissionPrice)}</div>
            </div>
        `;
    } else {
        // PAWN SHOP REFUSES
        commissionHTML = `
            <div class="bg-gray-100 p-4 rounded-lg cursor-not-allowed opacity-70">
                <h3 class="font-bold text-gray-500">🏪 Pawn shop</h3>
                <div class="text-sm text-gray-500">Instant sale</div>
                <div class="text-lg font-bold text-gray-500">We don\'t need this</div>
                <div class="text-xs text-gray-500 mt-1">Pawn shop isn\'t interested in this item</div>
            </div>
        `;
    }
    
    channels.push({
        id: 'commission',
        name: '🏪 Pawn shop',
        desc: item.commissionDecision ? '20-30% of real value, instantly' : 'Purchase refusal',
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
                showNotification('Not enough money for tax!', 'error');
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

            // Recalculate skills after removing item from inventory
            calculateSkillLevels();

            showNotification(`📱 Listed on Avito for ${formatMoney(saleItem.playerPrice)}${tax > 0 ? ` (tax ${tax}р)` : ''}`, 'success');
            closeSell();
            updateDisplay();
            renderInventory();
            saveGame();
        }



        function selectSellChannel(channel, price) {
    const item = currentSell;

    if (channel === 'commission') {
        // CHECK PAWN SHOP DECISION FOR THIS ITEM
        if (!item.commissionDecision) {
            showNotification('🏪 Pawn shop isn\'t interested in this item', 'warning');
            return;
        }
        
        gameState.money += price;
        gameState.stats.sold++;
        gameState.stats.profit += (price - item.purchasePrice - (item.expertiseCost || 0));
        logDeal(item, price, 'Pawn shop');
        gameState.inventory = gameState.inventory.filter(i => i.id !== item.id);
        
        // Recalculate skills after removing item from inventory
        calculateSkillLevels();
        
        showNotification(`✅ Sold to pawn shop for ${formatMoney(price)}!`, 'success');
        closeSell();
        updateDisplay();
        renderInventory();
        saveGame();
        return;
    }

    if (channel === 'auction') {
        // MONEY CHECK FOR AUCTION LISTING
        if (gameState.money < 1000) {
            showNotification('Not enough money to pay listing fee!', 'error');
            return;
        }

        // DEDUCT 1000р FOR LISTING
        gameState.money -= 1000;

        const saleItem = {
            ...item,
            channel: 'auction',
            startBid: 5000, // Fixed starting price
            currentBid: 5000,
            daysLeft: 15,
            totalDays: 15
        };
        gameState.sellingItems.push(saleItem);
        gameState.inventory = gameState.inventory.filter(i => i.id !== item.id);
        
        // Recalculate skills after removing item from inventory
        calculateSkillLevels();
        
        showNotification(`🔨 Listed at auction for 1,000р! Starting price: 5,000р`, 'success');
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
        
        // Recalculate skills after removing item from inventory
        calculateSkillLevels();
        
        showNotification(`👤 Meeting scheduled in ${days} days!`, 'success');
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
                    showNotification(`⚠️ Buyer discovered forgery! Demand to return ${formatMoney(offer.price * 1.2)} in ${returnDays} days!`, 'error');
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
            logDeal(sale, offer.price, 'Avito');
            gameState.sellingItems = gameState.sellingItems.filter(s => s.id !== saleId);
            showNotification(`✅ Sold via Avito for ${formatMoney(offer.price)}!`, 'success');
            updateDisplay();
            renderSellingTab();
            saveGame();
        }

        function rejectAvitoOffer(saleId, offerIdx) {
            const sale = gameState.sellingItems.find(s => s.id === saleId);
            if (!sale) return;

            sale.offers.splice(offerIdx, 1);
            showNotification('Offer rejected', 'info');
            renderSellingTab();
            saveGame();
        }

        function removeFromSale(saleId) {
            const sale = gameState.sellingItems.find(s => s.id === saleId);
            if (!sale) return;

            gameState.sellingItems = gameState.sellingItems.filter(s => s.id !== saleId);
            gameState.inventory.push(sale);
            
            // Recalculate skills after returning item to inventory
            calculateSkillLevels();
            
            showNotification('Item removed from sale', 'info');
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
                    <div class="font-bold">📱 Avito - Day ${sale.daysLeft}/${sale.totalDays}</div>
                    <div class="text-sm">Price: ${formatMoney(sale.playerPrice)}</div>
                    ${sale.offers && sale.offers.length > 0 ? `
                        <div class="mt-2 space-y-2">
                            ${sale.offers.map((offer, idx) => `
                                <div class="bg-white p-2 rounded border offer-item">
                                    <div class="text-sm">💬 Offer: ${formatMoney(offer.price)} (${offer.percent}%)</div>
                                    <div class="flex gap-2 mt-1">
                                        <button onclick="acceptAvitoOffer('${sale.id}', ${idx})" class="flex-1 bg-green-500 text-white py-1 px-2 rounded text-xs">✅ Accept</button>
                                        <button onclick="rejectAvitoOffer('${sale.id}', ${idx})" class="flex-1 bg-red-500 text-white py-1 px-2 rounded text-xs">❌ Reject</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<div class="text-sm text-gray-500 mt-2">Waiting for calls...</div>'}
                    <button onclick="removeFromSale('${sale.id}')" class="w-full mt-2 bg-gray-500 text-white py-1 rounded text-sm">🗑️ Remove from sale</button>
                </div>
            `;
        } else if (sale.channel === 'auction') {
            // DISPLAY "NO BIDS" FOR PRICE 5000
            const currentBidDisplay = sale.currentBid === 5000 ? "no bids" : formatMoney(sale.currentBid);
            
            statusHTML = `
                <div class="bg-purple-50 p-3 rounded">
                    <div class="font-bold">🔨 Auction - Day ${sale.daysLeft}/${sale.totalDays}</div>
                    <div class="text-sm">Starting bid: ${formatMoney(sale.startBid)}</div>
                    <div class="text-lg font-bold ${sale.currentBid === 5000 ? 'text-gray-600' : 'text-green-600'}">
                        ${sale.currentBid === 5000 ? '❌ Current: no bids' : `Current: ${formatMoney(sale.currentBid)}`}
                    </div>
                    <div class="text-xs text-gray-500 mt-1">15% commission on sale</div>
                </div>
            `;
        } else if (sale.channel === 'regular') {
            statusHTML = `
                <div class="bg-green-50 p-3 rounded">
                    <div class="font-bold">👤 Regular client - Day ${sale.daysLeft}/${sale.totalDays}</div>
                    <div class="text-lg font-bold text-green-600">Price: ${formatMoney(sale.salePrice)}</div>
                    <div class="text-xs text-gray-500 mt-1">Meeting scheduled</div>
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
                    showNotification(`😱 Buyer discovered forgery! Demand to return ${formatMoney(sale.fraudReturn.amount)} with penalty!`, 'error');
                } else {
                    gameState.reputation -= 50;
                    showNotification(`💸 Couldn't return money! Reputation ruined! -50 reputation!`, 'error');
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
        
        // 👇 SPECIAL PROCESSING FOR 0 RUBLES
        if (offerPrice === 0) {
            // Take random message from constant
            const randomIndex = Math.floor(Math.random() * AVITO_ZERO_RUBLES_MESSAGES.length);
            const zeroMessage = AVITO_ZERO_RUBLES_MESSAGES[randomIndex];
            
            // Show special notification
            showNotification(`🤡 0 ruble offer! ${zeroMessage}`, 'avito');
        } else {
            // Regular notification
            showNotification(`📞 Avito call: offer ${formatMoney(offerPrice)} (${percent}%)`, 'avito');
        }
    }
            
            if (sale.daysLeft <= 0) {
                sale.avitoRepost = true;
                gameState.inventory.push(sale);
                
                calculateSkillLevels();
                
                const repostMessages = [
                    "📱 Item not sold on Avito. Time for a new photo with a cat!",
                    "⏰ Listing expired. Probably should have added 'magical properties' to description!",
                    "💸 Failed to sell. Maybe should've mentioned this belonged to Harry Potter himself?",
                    "🔄 Reposting required. This time let's write 'urgent!' in caps!",
                    "📉 Listing removed. Apparently 'I really want this' price didn't interest anyone!"
                ];
                
                const randomMessage = repostMessages[Math.floor(Math.random() * repostMessages.length)];
                showNotification(`${randomMessage} (tax 1000р)`, 'warning');
                toRemove.push(sale.id);
            }
        }
        
        if (sale.channel === 'auction') {
            // NEW AUCTION LOGIC
            
            // If real value less than 5000 - don't increase bids
            if (sale.realValue < 5000) {
                // Item too cheap for auction
                if (sale.daysLeft <= 0) {
                    // Return item to inventory
                    gameState.inventory.push(sale);
                    toRemove.push(sale.id);
                    // Don't show notification as per requirement
                }
            } else {
                // Real value >= 5000 - increase bids
                let growth = 0;
                
                // Base random bid (1-299)
                const randomValue = 1 + Math.random() * 299;
                const growthPercent = Math.pow(randomValue, 0.25) / 100;
                const baseGrowth = Math.round(sale.realValue * growthPercent);
                
                // If current bid below real value - add bonus
                if (sale.currentBid < sale.realValue) {
                    const difference = sale.realValue - sale.currentBid;
                    const bonusGrowth = Math.round(difference / 7); // Bonus to equalize over 7 days
                    growth = baseGrowth + bonusGrowth;
                } else {
                    growth = baseGrowth;
                }
                
                // Save old price for change check
                const oldBid = sale.currentBid;
                sale.currentBid += growth;
                
                // Don't show bid notifications as per requirement
                
                if (sale.daysLeft <= 0) {
                    const finalPrice = Math.round(sale.currentBid * 0.85); // 15% commission
                    gameState.money += finalPrice;
                    gameState.stats.sold++;
                    gameState.stats.profit += (finalPrice - sale.purchasePrice - (sale.expertiseCost || 0));
                    logDeal(sale, finalPrice, 'Auction');
                    
                    const soldMessages = [
                        `🔨 Auction completed! Received ${formatMoney(finalPrice)} (15% commission)`,
                        `🎊 Sold at auction! ${formatMoney(finalPrice)} added!`,
                        `💼 Auction house did great work: ${formatMoney(finalPrice)}!`,
                        `🏆 Bidding finished! Your win: ${formatMoney(finalPrice)}!`
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
                logDeal(sale, sale.salePrice, 'Regular client');
                
                const clientMessages = [
                    `👤 Meeting completed! Received ${formatMoney(sale.salePrice)}!`,
                    `🤝 Regular client didn't let down: ${formatMoney(sale.salePrice)}!`,
                    `💼 Business meeting successful: ${formatMoney(sale.salePrice)}!`,
                    `🎩 Client turned out to be a gentleman: ${formatMoney(sale.salePrice)}!`
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