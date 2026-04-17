        function nextDay() {
          // Получаем кнопку (с защитой от ошибок)
          const button = (event && event.target) ? event.target : document.getElementById('nextDayBtn');
          
          // =======================================================
          // 1. ЛОГИКА ВЫЖИВАНИЯ (ПРОВЕРКА ДЕНЕГ ПЕРЕД СПИСАНИЕМ)
          // =======================================================
          if (gameState.money < 500) {
            console.log("⚠️ Не хватает денег на аренду. Попытка выживания...");
            
            // Проверяем, существует ли функция выживания
            if (typeof checkRentAbilityAndSurvive === 'function') {
              const survived = checkRentAbilityAndSurvive();
              
              if (!survived) {
                // Игрок не смог или не захотел продавать мебель -> GAME OVER
                // Сбрасываем кнопку
                if (button) {
                  button.disabled = false;
                  button.textContent = '💀 Банкрот';
                }
                
                if (typeof checkGameOver === 'function') {
                  checkGameOver();
                } else {
                  alert("ВЫ БАНКРОТ. ИГРА ОКОНЧЕНА.");
                  location.reload();
                }
                return; // СТОП. Дальше код не идет.
              }
              // Если survived === true, значит мебель продана, деньги добавлены. Идем дальше.
            } else {
              // Если функции нет (старая версия), просто выдаем ошибку
              showNotification('Недостаточно денег для аренды!', 'error');
              return;
            }
          }
          
          // =======================================================
          // 2. СПИСАНИЕ АРЕНДЫ И ПЕРЕХОД
          // =======================================================
          if (button) {
            button.disabled = true;
            button.textContent = '⏳ Переход...';
          }
          
          gameState.money -= 500;
          gameState.day++;
          
          // Немедленное обновление UI
          if (typeof updateDisplay === 'function') updateDisplay();
          const dayEl = document.getElementById('marketDay');
          if (dayEl) dayEl.textContent = gameState.day;
          
          // =======================================================
          // 3. РАСЧЕТЫ НОВОГО ДНЯ (С ЗАДЕРЖКОЙ)
          // =======================================================
          setTimeout(() => {
            // --- РАСЧЕТ ЭНЕРГИИ (ИСПРАВЛЕННЫЙ) ---
            
            // 1. Получаем уровень (гарантированно число)
            // 1. Получаем уровень (ИСПРАВЛЕНО)
            let level = 0;
            // Мы проверяем переменную gameState напрямую, а не через window
            if (typeof gameState !== 'undefined' && typeof gameState.officeLevel !== 'undefined') {
              level = Number(gameState.officeLevel);
            }
            
            // 2. Ищем конфиг
            const configMap = window.OFFICE_CONFIG || OFFICE_CONFIG;
            let energyMod = 0;
            
            if (configMap) {
              // Ключи объекта - строки, поэтому преобразуем уровень в строку
              const config = configMap[String(level)];
              if (config) {
                energyMod = config.energyMod;
              } else {
                console.warn(`⚠️ Нет конфига для уровня ${level}, используем 0`);
              }
            }
            
            // 3. Считаем итог (База 100 + Модификатор)
            const newAttention = Math.max(10, 100 + energyMod);
            
            console.log(`⚡ ЭНЕРГИЯ: Уровень ${level}. Модификатор ${energyMod}. Итог: ${newAttention}`);
            
            // 4. Применяем
            gameState.attention = newAttention;
            
            // --- ОСТАЛЬНЫЕ ПРОЦЕССЫ ---
            gameState.eventCounter++;
            gameState.firstDealToday = true;
            
            if (typeof restoreExpertiseCosts === 'function') restoreExpertiseCosts();
            if (typeof processSales === 'function') processSales();
            
            if (gameState.eventCounter >= 3 && Math.random() < 0.3) {
              // if (typeof triggerRandomEvent === 'function') triggerRandomEvent();
              gameState.eventCounter = 0;
            }
            
            if (typeof generateMarket === 'function') generateMarket();
            
            // Обновляем визуал стола
            if (typeof updateOfficeVisuals === 'function') updateOfficeVisuals();
            
            // Обновляем весь UI (важно вызвать ПОСЛЕ изменения энергии)
            if (typeof updateDisplay === 'function') updateDisplay();
            
            // Сохраняем прогресс
            if (typeof saveGame === 'function') saveGame();
            
            // Разблокируем кнопку
            if (button) {
              button.disabled = false;
              button.textContent = '⏭️ Следующий день (-500р)';
            }
          }, 100);
        }
        
function loadGame() {
  console.log("Загрузка сохраненной игры...");
  
  const saved = localStorage.getItem('udelka_save');
  if (saved) {
    try {
      gameState = JSON.parse(saved);
      
      // Инициализируем внимание если его нет
      if (gameState.attention === undefined) {
        gameState.attention = 100;
        console.log("Инициализировано внимание: 100");
      }
      
      // Инициализируем счетчики событий если их нет
      if (gameState.eventCounter === undefined) {
        gameState.eventCounter = 0;
      }
      
      if (gameState.firstDealToday === undefined) {
        gameState.firstDealToday = true;
      }
      
      // Инициализируем статистику если её нет
      if (!gameState.stats) {
        gameState.stats = { bought: 0, sold: 0, profit: 0 };
      }
      
      if (!gameState.dealsLog) {
        gameState.dealsLog = [];
      }
      
      // Инициализируем навыки если их нет
      if (!gameState.skills) {
        gameState.skills = { porcelain: 0, metal: 0, painting: 0, books: 0, militaria: 0 };
      }
      
      // Инициализируем массивы если их нет
      if (!gameState.inventory) {
        gameState.inventory = [];
      }
      
      if (!gameState.marketItems) {
        gameState.marketItems = [];
      }
      
      if (!gameState.sellingItems) {
        gameState.sellingItems = [];
      }
      
      // ⭐ НОВОЕ: Инициализируем систему тактик если нет
      if (gameState.successfulPurchases === undefined) {
        gameState.successfulPurchases = 0;
        console.log("Инициализированы успешные покупки: 0");
      }
      
      if (!gameState.unlockedTactics) {
        gameState.unlockedTactics = [];
        console.log("Инициализирован список открытых тактик: пустой");
      }
      
      if (gameState.nextTacticIndex === undefined) {
        // Восстанавливаем прогресс на основе успешных покупок
        gameState.nextTacticIndex = 0;
        for (let i = 0; i < TACTIC_UNLOCK_THRESHOLDS.length; i++) {
          if (gameState.successfulPurchases >= TACTIC_UNLOCK_THRESHOLDS[i]) {
            const tacticId = TACTIC_UNLOCK_ORDER[i];
            if (!gameState.unlockedTactics.includes(tacticId)) {
              gameState.unlockedTactics.push(tacticId);
            }
            gameState.nextTacticIndex = i + 1;
          } else {
            break;
          }
        }
        console.log(`Восстановлен прогресс тактик: открыто ${gameState.unlockedTactics.length}, следующая: ${gameState.nextTacticIndex}`);
      }
      
      // ВАЖНО: Исправляем отрицательные стоимости перед всем остальным
      console.log("Проверка целостности данных...");
      fixNegativeValues();
      
      // Миграция: инициализируем expertiseMethodCosts для существующих предметов
      console.log("Проверка системы экспертизы...");
      if (gameState.inventory) {
        gameState.inventory.forEach(item => {
          if (!item.expertiseShards) {
            item.expertiseShards = [];
          }
          if (!item.expertiseMethodCosts) {
            item.expertiseMethodCosts = { ...BASE_EXPERTISE_COSTS };
          }
          if (!item.restorationProgress && item.defects) {
            initializeRestorationProgress(item);
          }
        });
      }
      
      if (gameState.sellingItems) {
        gameState.sellingItems.forEach(item => {
          if (!item.expertiseShards) {
            item.expertiseShards = [];
          }
          if (!item.expertiseMethodCosts) {
            item.expertiseMethodCosts = { ...BASE_EXPERTISE_COSTS };
          }
        });
      }
      
      // Пересчитываем навыки на основе инвентаря
      console.log("Пересчет навыков...");
      calculateSkillLevels();
      
      // Исправляем существующие предметы (стили, клейма)
      console.log("Обновление исторических данных...");
      fixExistingItems();
      
      // Обновляем интерфейс
      console.log("Обновление интерфейса...");
      updateDisplay();
      
      // Генерируем рынок если пустой
      if (gameState.marketItems.length === 0) {
        console.log("Генерация нового рынка...");
        generateMarket();
      }
      
      renderMarket();
      
      // Рендерим все интерфейсы
      renderInventory();
      renderSellingTab();
      renderSkills();
      renderStats();
      
      console.log("Игра успешно загружена!");
      showNotification("✅ Игра загружена", 'success');
      
      // В самом конце функции loadGame() перед return true; добавьте:
      setTimeout(() => {
        switchTab('inventory');
      }, 100);
      
      return true;
      
    } catch (error) {
      console.error("Ошибка при загрузке игры:", error);
      showNotification("❌ Ошибка загрузки сохранения", 'error');
      return false;
    }
  } else {
    console.log("Сохраненная игра не найдена");
    return false;
  }
}

function initGame() {
  gameState.skills = { porcelain: 0, metal: 0, painting: 0, books: 0, militaria: 0 };
  gameState.attention = 100;
  gameState.isTesterMode = false;
  
  // 🔥 ИНИЦИАЛИЗИРУЕМ ОПЫТ ЭКСПЕРТИЗЫ
  gameState.expertiseExperience = { porcelain: 0, metal: 0, painting: 0, books: 0, militaria: 0 };
  
  // В функции initGame() добавляем:
  gameState.showSamplesInInventory = true;
  
  
  // ⭐ НОВОЕ: Инициализируем систему тактик
  gameState.successfulPurchases = 0;
  gameState.unlockedTactics = [];
  gameState.nextTacticIndex = 0;
  
  generateMarket();
  updateDisplay();
  saveGame();
  
  // Обновляем кнопку сердечка
  const heartButton = document.querySelector('.heart-toggle');
  if (heartButton) {
    heartButton.innerHTML = '❤️';
  }
}


        function submitExpertise() {
    const authenticityGuess = document.getElementById('authenticityGuess').value;
    const valueGuessInput = document.getElementById('valueGuess').value;
    const ageGuessInput = document.getElementById('ageGuess').value;
    const valueGuess = parseInt(valueGuessInput) || 0;
    const ageGuess = parseInt(ageGuessInput) || 0;

    // Проверяем, что все поля заполнены
    if (!authenticityGuess || valueGuessInput === '' || ageGuessInput === '') {
        showNotification('Заполните все поля оценки!', 'warning');
        return;
    }

    if (valueGuess === 0 || ageGuess === 0) {
        showNotification('Стоимость и возраст должны быть больше 0!', 'warning');
        return;
    }

    const item = currentExpertise.item;

    // ПРОВЕРКА ТРЕХ ПАРАМЕТРОВ
    const correctAuth = (authenticityGuess === 'true') === item.authentic;
    const valueDiff = Math.abs(valueGuess - item.realValue) / item.realValue;
    const accurateValue = valueDiff < 0.2; // В пределах 20%
    const ageDiff = Math.abs(ageGuess - item.age);
    const accurateAge = ageDiff <= 5; // В пределах ±5 лет от реального возраста

    // СЧИТАЕМ КОЛИЧЕСТВО УГАДАННЫХ ПАРАМЕТРОВ
    let correctParams = 0;
    if (correctAuth) correctParams++;
    if (accurateValue) correctParams++;
    if (accurateAge) correctParams++;

    // 🔥 МИНИМАЛЬНОЕ ИЗМЕНЕНИЕ: Добавляем опыт за экспертизу
    // За каждый угаданный параметр - +1 слово опыта в навык категории
    if (correctParams > 0) {
        // Инициализируем опыт от экспертизы, если нет
        if (!gameState.expertiseExperience) {
            gameState.expertiseExperience = { porcelain: 0, metal: 0, painting: 0, books: 0, militaria: 0 };
        }
        
        // Добавляем опыт за угаданные параметры
        gameState.expertiseExperience[item.category] += correctParams;
        
        console.log(`+${correctParams} опыта экспертизы для ${item.category}`);
    }

    // Сохраняем результаты экспертизы
    item.expertiseDone = true;
    item.estimatedValue = valueGuess;
    item.estimatedAge = ageGuess;
    item.soldAsAuthentic = authenticityGuess === 'true';

    // НАЧИСЛЕНИЕ БОНУСОВ РЕПУТАЦИИ
    let reputationBonus = 0;
    let notificationMessage = '';

    // В функции submitExpertise обновляем notificationMessage:
if (correctParams === 1) {
    reputationBonus = 1;
    notificationMessage = `✅ Угадан 1 параметр! +1 репутации и +1 опыт ${item.category}`;
} else if (correctParams === 2) {
    reputationBonus = 3;
    notificationMessage = `🎯 Угаданы 2 параметра! +3 репутации и +2 опыт ${item.category}`;
} else if (correctParams === 3) {
    reputationBonus = 6;
    notificationMessage = `🏆 Угаданы все 3 параметра! +6 репутации и +3 опыт ${item.category}`;
} else {
    notificationMessage = '❌ Не угаданы параметры экспертизы';
}

    // Начисляем репутацию
    if (reputationBonus > 0) {
        gameState.reputation += reputationBonus;
    }

    showNotification(notificationMessage, reputationBonus > 0 ? 'success' : 'info');

    // Показываем детализацию результатов (только в режиме тестера)
    if (gameState.isTesterMode) {
        const details = [
            `Подлинность: ${correctAuth ? '✅' : '❌'}`,
            `Стоимость: ${accurateValue ? '✅' : '❌'}`,
            `Возраст: ${accurateAge ? '✅' : '❌'}`
        ];
        showNotification(`Детали: ${details.join(' | ')}`, 'info');
    }

    closeExpertise();
    updateDisplay();
    renderInventory();
    
    // 🔥 ВАЖНО: Пересчитываем навыки с учетом нового опыта
    calculateSkillLevels();
    saveGame();
}





        function calculateSkillLevels() {
    // НОВАЯ СИСТЕМА: 18 уровней вместо 4
    
    // Сбрасываем все навыки
    Object.keys(gameState.skills).forEach(category => {
        gameState.skills[category] = 0;
    });
    
    // Считаем слова по категориям в инвентаре
    const wordCounts = { porcelain: 0, metal: 0, painting: 0, books: 0, militaria: 0 };
    
    gameState.inventory.forEach(item => {
        const trueName = getTrueName(item);
        const words = trueName.split(' ').filter(word => word.trim().length > 0).length;
        wordCounts[item.category] += words;
    });
    
    // Устанавливаем уровни навыков по новым порогам (18 УРОВНЕЙ)
    Object.keys(wordCounts).forEach(category => {
        const words = wordCounts[category];
        
        // Ищем максимальный уровень, для которого хватает слов
        let level = 0;
        for (let i = 1; i < SKILL_LEVEL_THRESHOLDS.length; i++) {
            if (words >= SKILL_LEVEL_THRESHOLDS[i]) {
                level = i;
            } else {
                break;
            }
        }
        
        gameState.skills[category] = Math.min(level, MAX_SKILL_LEVEL);
    });
    
    console.log('🎯 Навыки пересчитаны:', gameState.skills, 'Слов по категориям:', wordCounts);
}


