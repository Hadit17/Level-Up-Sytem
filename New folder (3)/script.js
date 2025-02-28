// Player variables
let xp = 0, level = 1, gold = 0, totalTasks = 0, questCompleted = 0;
let playerName = "Hadit-San", playerAge = "N/A", playerWeight = "N/A", playerHeight = "N/A";
let inventory = [], shopItems = [];

// Load saved progress from localStorage
function loadProgress() {
  let savedData = JSON.parse(localStorage.getItem('gameData'));
  if (savedData) {
    xp = savedData.xp;
    level = savedData.level;
    gold = savedData.gold;
    totalTasks = savedData.totalTasks;
    questCompleted = savedData.questCompleted;
    inventory = savedData.inventory;
    shopItems = savedData.shopItems;
    playerName = savedData.playerName;
    playerAge = savedData.playerAge;
    playerWeight = savedData.playerWeight;
    playerHeight = savedData.playerHeight;
  }
  updateUI();  // Update UI with saved data
}

// Save progress to localStorage
function saveProgress() {
  const gameData = {
    xp, level, gold, totalTasks, questCompleted,
    inventory, shopItems,
    playerName, playerAge, playerWeight, playerHeight
  };
  localStorage.setItem('gameData', JSON.stringify(gameData));
}

// Show a specific section by ID
function showSection(sectionId) {
  document.querySelectorAll('.container').forEach(section => section.classList.add('hidden'));
  document.getElementById(sectionId).classList.remove('hidden');
}

// Add task (Daily or Side)
function addTask(type) {
  let taskInput = document.getElementById(type === 'daily' ? 'dailyTaskInput' : 'sideQuestInput');
  let taskText = taskInput.value.trim();
  if (!taskText) return;
  let taskList = document.getElementById(type === 'daily' ? 'dailyTaskList' : 'sideQuestList');
  let xpGain = type === 'daily' ? 10 : 5;
  let goldGain = type === 'daily' ? 5 : 2;
  let task = document.createElement('div');
  task.innerHTML = `${taskText} <button onclick='completeTask(this, ${xpGain}, ${goldGain})'>Complete</button>`;
  taskList.appendChild(task);
  taskInput.value = '';
}

// Complete task and update XP and Gold
function completeTask(button, xpGain, goldGain) {
  xp += xpGain;
  gold += goldGain;
  if (xp >= 100) {
    xp -= 100;
    level++;
  }
  updateUI();
  button.parentElement.remove();
  totalTasks++;
  updateUI();
  saveProgress(); // Save progress after completing task
  showNotification(`Task completed! You gained ${xpGain} XP and ${goldGain} Gold.`);
}

// Update all relevant UI elements
function updateUI() {
  document.getElementById('xp').textContent = xp;
  document.getElementById('gold').textContent = gold;
  document.getElementById('level').textContent = level;
  document.getElementById('xpFill').style.width = (xp / 100) * 100 + '%';
  document.getElementById('totalTasks').textContent = totalTasks;
  document.getElementById('questCompleted').textContent = questCompleted;
  document.getElementById('shopGold').textContent = gold;
}

// Update the profile with the new values
function updateProfile() {
  let nameInput = document.getElementById('nameInput').value.trim();
  let ageInput = document.getElementById('ageInput').value.trim();
  let weightInput = document.getElementById('weightInput').value.trim();
  let heightInput = document.getElementById('heightInput').value.trim();

  if (nameInput) playerName = nameInput;
  if (ageInput) playerAge = ageInput;
  if (weightInput) playerWeight = weightInput;
  if (heightInput) playerHeight = heightInput;

  document.getElementById('playerName').textContent = playerName;
  document.getElementById('playerAge').textContent = playerAge;
  document.getElementById('playerWeight').textContent = playerWeight;
  document.getElementById('playerHeight').textContent = playerHeight;

  saveProgress(); // Save progress after updating profile
  showNotification("Profile updated successfully!");
}

// Create and add item to shop
function createAndAddItem() {
  let itemName = document.getElementById('itemName').value.trim();
  let itemPrice = document.getElementById('itemPrice').value.trim();
  if (!itemName || !itemPrice) return;

  let item = { name: itemName, price: parseInt(itemPrice) };
  shopItems.push(item);

  let itemElement = document.createElement('div');
  itemElement.textContent = `${item.name} - ${item.price} Gold`;

  let buyButton = document.createElement('button');
  buyButton.textContent = "Buy";
  buyButton.onclick = () => buyItem(item);

  let removeButton = document.createElement('button');
  removeButton.textContent = "Remove";
  removeButton.onclick = () => removeItemFromShop(item, itemElement); 

  itemElement.appendChild(buyButton);
  itemElement.appendChild(removeButton);
  document.getElementById('shopItemsList').appendChild(itemElement);

  saveProgress(); // Save progress after adding item to shop
}

// Buy item from shop
function buyItem(item) {
  if (gold >= item.price) {
    gold -= item.price;
    inventory.push(item);
    updateUI();
    saveProgress(); // Save progress after buying item
    showNotification(`You bought ${item.name}!`);
    updateInventoryList();
  } else {
    showNotification('Not enough gold to buy this item.');
  }
}

// Remove item from shop
function removeItemFromShop(item, itemElement) {
  shopItems = shopItems.filter(i => i !== item);
  itemElement.remove();
  updateUI();
  saveProgress(); // Save progress after removing item from shop
}

// Update inventory list
function updateInventoryList() {
  let inventoryList = document.getElementById('inventoryList');
  inventoryList.innerHTML = '';
  inventory.forEach((item, index) => {
    let listItem = document.createElement('li');
    listItem.textContent = `${item.name} - ${item.price} Gold`;

    // Add "Use" button to each item
    let useButton = document.createElement('button');
    useButton.textContent = 'Use';
    useButton.onclick = () => useItem(index); // Pass the index of the item in the inventory
    listItem.appendChild(useButton);

    inventoryList.appendChild(listItem);
  });
}

// Use an item from inventory (removes it after use)
function useItem(index) {
  let item = inventory[index];
  inventory.splice(index, 1); // Remove the item from inventory
  updateInventoryList(); // Refresh the inventory list

  showNotification(`You used the ${item.name}!`);
  updateUI(); // Update the UI after using the item
  saveProgress(); // Save progress after using item
}

// Show notifications
function showNotification(message) {
  let notification = document.createElement('div');
  notification.classList.add('notification');
  notification.textContent = message;
  document.getElementById('notificationContainer').appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
}

// Reset progress
function resetProgress() {
  xp = 0;
  level = 1;
  gold = 0;
  totalTasks = 0;
  questCompleted = 0;
  inventory = [];
  shopItems = [];
  saveProgress(); // Save progress after resetting
  updateUI();
}

// Reset the shop
function resetShop() {
  shopItems = [];
  document.getElementById('shopItemsList').innerHTML = '';
  updateUI();
  saveProgress(); // Save progress after resetting shop
}

// Load the progress when the page is loaded
window.onload = function() {
  loadProgress();
};
