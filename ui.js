// Extracted UI functions

function formatMoney(amount) {
            if (isNaN(amount)) return "0₽";
            return amount.toLocaleString('ru-RU') + '₽';
        }

function getWeekday(dayNumber) {
    const weekdays = ['СБ', 'ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ'];
    return weekdays[(dayNumber - 1) % 7];
}

function showNotification(message, type = 'info') {
            const container = document.getElementById('notificationContainer');
            const colors = {
                success: 'bg-green-100 border-green-500 text-green-800',
                error: 'bg-red-100 border-red-500 text-red-800',
                warning: 'bg-yellow-100 border-yellow-500 text-yellow-800',
                info: 'bg-blue-100 border-blue-500 text-blue-800',
                avito: 'bg-orange-100 border-orange-500 text-orange-800 avito-notification'
            };

            const notification = document.createElement('div');
            notification.className = `notification ${colors[type]} border-2 rounded-lg p-4 mb-2 shadow-lg`;
            notification.textContent = message;
            container.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, type === 'avito' ? 8000 : 3000);
        }

function switchTab(tab) {
    ['market', 'inventory', 'selling', 'knowledge', 'stats', 'help'].forEach(t => {
        document.getElementById(`content-${t}`).classList.add('hidden');
        document.getElementById(`tab-${t}`).classList.remove('tab-active');
        document.getElementById(`tab-${t}`).classList.add('hover:bg-gray-100');
    });
    
    document.getElementById(`content-${tab}`).classList.remove('hidden');
    document.getElementById(`tab-${tab}`).classList.add('tab-active');
    document.getElementById(`tab-${tab}`).classList.remove('hover:bg-gray-100');
    
    if (tab === 'inventory') renderInventory();
    if (tab === 'selling') renderSellingTab();
    if (tab === 'knowledge') renderSkills();
    if (tab === 'stats') renderStats();
    if (tab === 'market') renderMarket();
}

function updateDisplay() {
    // Только обновляем то, что осталось после удаления шапки
    // Обновляем день в заголовке рынка
    const marketDayElement = document.getElementById('marketDay');
    if (marketDayElement) {
        marketDayElement.textContent = gameState.day;
    }
    
    // Внимание обновляется в модальном окне экспертизы отдельно
    // Полоска внимания в модальном окне экспертизы будет обновляться при вызове updateExpertiseAttentionDisplay()
}

function toggleDealDetails(rowId) {
            const row = document.getElementById(rowId);
            row.classList.toggle('hidden');
        }

function toggleDebugConsole() {
    const console = document.getElementById('debugConsole');
    console.classList.toggle('hidden');
}

function closeHaggle() {
            if (currentHaggle && currentHaggle.item) {
                gameState.marketItems = gameState.marketItems.filter(i => i.id !== currentHaggle.item.id);
                renderMarket();
            }
            document.getElementById('haggleModal').classList.add('hidden');
            currentHaggle = null;
            gameState.firstDealToday = false;
        }

function closeExpertise() {
            document.getElementById('expertiseModal').classList.add('hidden');
            currentExpertise = null;
        }

function closeSell() {
            document.getElementById('sellModal').classList.add('hidden');
            currentSell = null;
        }

function closeRestoration() {
            document.getElementById('restorationModal').classList.add('hidden');
            currentRestorationItem = null;
        }

