// Configuration de base et données
const MEALS_DATA = [
    // --- Plats de Résistance (Plats Principaux) ---
    { id: 101, name: "Poulet Yassa", description: "Poulet mariné au citron et oignons confits, mijoté jusqu'à tendreté.", price: 13.90, category: "Plats de Résistance", image: "images/yassa_poulet.jpg", 
      options: { chili: true, base: ['Riz Blanc', 'Riz Jollof'] } },
      
    { id: 102, name: "Mafé au Bœuf", description: "Ragoût onctueux à la pâte d'arachide, avec bœuf et légumes racines.", price: 14.50, category: "Plats de Résistance", image: "images/mafe_boeuf.jpg",
      options: { chili: true, base: ['Riz Blanc', 'Riz Jollof'] } },

    { id: 103, name: "Riz Jollof & Poisson", description: "Riz cuisiné dans une sauce tomate épicée, accompagné de poisson frit (Tilapia).", price: 15.00, category: "Plats de Résistance", image: "images/riz_jollof_poisson.jpg",
      options: { chili: true, base: ['Riz Jollof'] } },

    { id: 104, name: "Akoumé & Adémè Dessi (Togo)", description: "Pâte de maïs (Akoumé) servie avec la sauce Adémè (légumes) et poisson fumé ou poulet.", price: 16.50, category: "Plats de Résistance", image: "images/akoume_ademe.jpg",
      options: { chili: true, base: ['Akoumé'] } },

    { id: 105, name: "Attiéké & Poisson (Côte d'Ivoire)", description: "Semoule de manioc cuite à la vapeur, servie avec du poisson frit, alloco et légumes frais. Le plat phare ivoirien !", price: 15.50, category: "Plats de Résistance", image: "images/attieke_poisson.jpg",
      options: { chili: true, base: ['Attiéké'] } },

    { id: 106, name: "Ayimolou (Riz & Haricots)", description: "Mélange réconfortant de riz et de haricots, servi avec une sauce tomate pimentée et du poisson ou œuf.", price: 12.50, category: "Plats de Résistance", image: "images/ayimolou.jpg",
      options: { chili: true, base: ['Riz Blanc'] } }, 
      
    { id: 107, name: "Khom (Pâte de Maïs)", description: "Pâte de maïs fermentée (Khom) traditionnellement mangée avec du piment, oignons et poisson ou viande de bœuf.", price: 13.50, category: "Plats de Résistance", image: "images/khom.jpg",
      options: { chili: true, base: ['Khom'] } }, 

    { id: 108, name: "Ablo (Togo)", description: "Galettes de riz et de maïs fermentés, légères et moelleuses, idéales avec une sauce pimentée et du poisson.", price: 12.00, category: "Plats de Résistance", image: "images/ablo.jpg",
      options: { chili: true, base: ['Ablo'] } },
    
    // --- Amuse-gueules & Entrées ---
    { id: 201, name: "African Tennis (Gâteaux de lune)", description: "Petits beignets ronds et sucrés, parfaits pour commencer ou en collation.", price: 4.00, category: "Amuse-gueules & Entrées", image: "images/african_tennis.jpg" },
    { id: 202, name: "Botokoin (Beignets Salés)", description: "Beignets de farine de blé salés et frits. Un classique togolais !", price: 4.50, category: "Amuse-gueules & Entrées", image: "images/botokoin.jpg" },
    { id: 203, name: "Akara-Gahou (Beignets de haricots)", description: "Beignets de haricots cornille épicés, légers et croustillants (3 pièces).", price: 5.00, category: "Amuse-gueules & Entrées", image: "images/akara.jpg" },
    
    // --- Accompagnements ---
    { id: 301, name: "Koliko (Frites d'Igname)", description: "Morceaux d'igname frits, croustillants et savoureux.", price: 6.00, category: "Accompagnements", image: "images/koliko.jpg" },
    { id: 302, name: "Alloco", description: "Bananes plantains mûres frites, le meilleur des accompagnements.", price: 6.00, category: "Accompagnements", image: "images/alloco.jpg" },
    { id: 303, name: "Riz Blanc Parfumé", description: "Riz basmati cuit à la perfection pour accompagner toutes nos sauces.", price: 3.50, category: "Accompagnements", image: "images/riz_blanc.jpg" },

    // --- Desserts ---
    { id: 401, name: "Deguê (Thiakhry)", description: "Dessert traditionnel à base de yaourt onctueux et de couscous de mil à la vanille.", price: 4.50, category: "Desserts", image: "images/degue.jpg" },
    { id: 402, name: "Beignets de Banane (Kanklo)", description: "Beignets de bananes bien mûres, légers et dorées.", price: 4.00, category: "Desserts", image: "images/beignets_banane.jpg" },
];

// État de l'application
let cart = {};
let currentMealId = null;
let searchDebounceTimer = null;

// --- Fonctions de Persistance (localStorage avec fallback) ---
function isLocalStorageAvailable() {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

function saveCart() {
    if (!isLocalStorageAvailable()) {
        console.warn("localStorage non disponible. Le panier ne sera pas sauvegardé.");
        return;
    }
    try {
        localStorage.setItem('ays_kitchen_cart', JSON.stringify(cart));
    } catch (e) {
        console.error("Erreur lors de la sauvegarde du panier:", e);
    }
}

function loadCart() {
    if (!isLocalStorageAvailable()) {
        console.warn("localStorage non disponible. Démarrage avec un panier vide.");
        return;
    }
    try {
        const saved = localStorage.getItem('ays_kitchen_cart');
        if (saved) {
            cart = JSON.parse(saved);
        }
    } catch (e) {
        console.error("Erreur lors du chargement du panier:", e);
        cart = {};
    }
}

// --- Fonctions Utilitaires ---
function groupMealsByCategory(meals) {
    return meals.reduce((acc, meal) => {
        const category = meal.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(meal);
        return acc;
    }, {});
}

function generateOrderId() {
    return '#' + Math.floor(Math.random() * 900000 + 100000);
}

function generateCartKey(mealId, options = {}) {
    const optionsString = JSON.stringify(options, Object.keys(options).sort());
    return `${mealId}_${optionsString}`;
}

function formatOptionsDisplay(options) {
    if (!options || Object.keys(options).length === 0) return '';
    
    const parts = [];
    if (options.chili) parts.push(options.chili);
    if (options.base) parts.push(options.base);
    
    return parts.length > 0 ? ` (${parts.join(', ')})` : '';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// --- Fonctions d'Interface Utilisateur ---
function showNotification(message, isError = false) {
    const box = document.getElementById('notification-box');
    box.textContent = message;
    box.classList.remove('hidden', 'bg-red-500', 'bg-green-500');
    box.classList.add(isError ? 'bg-red-500' : 'bg-green-500');
    
    box.setAttribute('role', isError ? 'alert' : 'status');
    
    setTimeout(() => {
        box.classList.add('hidden');
    }, 3000);
}

function openModal(id) {
    const modal = document.getElementById(id);
    modal.classList.add('open');
    
    setTimeout(() => {
        const firstInput = modal.querySelector('input, button');
        if (firstInput) firstInput.focus();
    }, 100);
    
    document.body.style.overflow = 'hidden';
}

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
    document.body.style.overflow = '';
}

function showLoading(show) {
    const indicator = document.getElementById('loading-indicator');
    indicator.style.display = show ? 'flex' : 'none';
}

// --- Rendu du Menu ---
function renderMealCard(meal) {
    const hasOptions = meal.options && (meal.options.chili || (meal.options.base && meal.options.base.length > 0));
    const buttonAction = hasOptions 
        ? `openOptionsModal(${meal.id}, this)` 
        : `addToCart(${meal.id}, this)`;
    const buttonText = hasOptions ? `Choisir options` : `Ajouter +`;
    
    return `
        <div id="meal-card-${meal.id}" class="bg-white rounded-xl shadow-xl hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col">
            <img src="${escapeHtml(meal.image)}" 
                 alt="Image de ${escapeHtml(meal.name)}" 
                 class="meal-image" 
                 onerror="this.onerror=null;this.src='https://placehold.co/400x200/9AE6B4/48BB78?text=Image+Non+Disponible';">
            
            <div class="p-5 flex flex-col justify-between flex-grow">
                <div>
                    <h4 class="text-xl font-bold text-gray-800 mb-2">${escapeHtml(meal.name)}</h4>
                    <p class="text-sm text-gray-600 mb-4">${escapeHtml(meal.description)}</p>
                </div>
                
                <div class="flex justify-between items-center pt-3 mt-auto">
                    <span class="text-2xl font-extrabold text-secondary-food">${meal.price.toFixed(2)} €</span>
                    <button 
                        onclick="${buttonAction}" 
                        class="add-to-cart-btn p-3 bg-primary-dark text-white text-sm font-semibold rounded-full hover:bg-green-700 active:bg-green-800 transition duration-150 shadow-lg"
                        aria-label="Ajouter ${escapeHtml(meal.name)} au panier">
                        ${buttonText}
                    </button>
                </div>
            </div>
        </div>
    `;
}

function displayMenu(meals = MEALS_DATA) {
    const container = document.getElementById('menu-container');
    container.innerHTML = '';
    
    if (meals.length === 0) {
        container.innerHTML = '<p class="text-xl text-center text-gray-500 py-12">Aucun plat trouvé correspondant à votre recherche.</p>';
        return;
    }

    const groupedMeals = groupMealsByCategory(meals);
    
    for (const category in groupedMeals) {
        const categorySection = document.createElement('section');
        categorySection.className = 'mb-10';
        categorySection.innerHTML = `
            <h3 class="text-2xl font-bold text-gray-700 mb-6 border-l-4 border-secondary-food pl-3">${escapeHtml(category)}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${groupedMeals[category].map(renderMealCard).join('')}
            </div>
        `;
        container.appendChild(categorySection);
    }
}

// --- Gestion des Options ---
function generateBaseOptionsHtml(availableBases) {
    return availableBases.map(option => {
        const safeId = option.replace(/\s/g, '-');
        return `
        <div>
            <input type="radio" 
                   id="base-${safeId}" 
                   name="base" 
                   value="${escapeHtml(option)}" 
                   class="option-radio" 
                   required>
            <label for="base-${safeId}" 
                   class="cursor-pointer px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 transition">
                ${escapeHtml(option)}
            </label>
        </div>
    `}).join('');
}

function openOptionsModal(mealId, buttonElement) {
    currentMealId = mealId;
    const meal = MEALS_DATA.find(m => m.id === mealId);
    if (!meal || !meal.options) return;

    document.getElementById('modal-meal-title').textContent = `Options pour ${meal.name}`;
    document.getElementById('options-meal-id').value = mealId;
    
    const chiliGroup = document.getElementById('chili-options-group');
    const baseGroup = document.getElementById('base-options-group');
    const baseOptionsContainer = baseGroup.querySelector('div.flex-wrap');
    const baseHelpText = document.getElementById('base-help-text');
    
    // Gestion du Piment
    chiliGroup.style.display = meal.options.chili ? 'block' : 'none';
    if (meal.options.chili) {
        document.querySelectorAll('#chili-options-group input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
    }
    
    // Gestion de la Base
    const availableBases = meal.options.base || [];
    
    if (availableBases.length > 1) {
        baseGroup.style.display = 'block';
        baseHelpText.classList.add('hidden');
        baseOptionsContainer.innerHTML = generateBaseOptionsHtml(availableBases);
    } else {
        baseGroup.style.display = 'none';
        if (availableBases.length === 1) {
            baseHelpText.classList.remove('hidden');
            baseHelpText.textContent = `Accompagnement imposé pour ce plat : ${availableBases[0]}.`;
        } else {
            baseHelpText.classList.add('hidden');
        }
    }
    
    openModal('options-modal');
}

function addMealWithOptions() {
    const mealId = parseInt(document.getElementById('options-meal-id').value);
    const meal = MEALS_DATA.find(m => m.id === mealId);
    if (!meal) return;
    
    const form = document.getElementById('options-form');
    const selectedOptions = {};
    let allValid = true;
    
    // Récupérer le piment
    if (meal.options.chili) {
        const selectedChili = form.querySelector('input[name="chili"]:checked');
        if (!selectedChili) {
            showNotification("Veuillez sélectionner le niveau de piment.", true);
            allValid = false;
        } else {
            selectedOptions.chili = selectedChili.value;
        }
    }
    
    // Récupérer la base
    if (meal.options.base && meal.options.base.length > 1) {
        const selectedBase = form.querySelector('input[name="base"]:checked');
        if (!selectedBase) {
            showNotification("Veuillez sélectionner l'accompagnement de base.", true);
            allValid = false;
        } else {
            selectedOptions.base = selectedBase.value;
        }
    } else if (meal.options.base && meal.options.base.length === 1) {
        selectedOptions.base = meal.options.base[0];
    }

    if (!allValid) return;

    const cartKey = generateCartKey(mealId, selectedOptions);

    if (cart[cartKey]) {
        cart[cartKey].quantity += 1;
    } else {
        cart[cartKey] = { item: meal, quantity: 1, options: selectedOptions };
    }
    
    closeModal('options-modal');
    saveCart();
    updateCartUI();
    showNotification(`${meal.name}${formatOptionsDisplay(selectedOptions)} ajouté au panier.`);
}

function addToCart(mealId, buttonElement) {
    const meal = MEALS_DATA.find(m => m.id === mealId);
    if (!meal) return;
    
    buttonElement.classList.add('btn-pop');
    setTimeout(() => {
        buttonElement.classList.remove('btn-pop');
    }, 100);

    const cartKey = generateCartKey(mealId, {});
    
    if (cart[cartKey]) {
        cart[cartKey].quantity += 1;
    } else {
        cart[cartKey] = { item: meal, quantity: 1, options: {} };
    }

    saveCart();
    updateCartUI();
    showNotification(`${meal.name} ajouté au panier.`);
}

function changeQuantity(cartKey, change) {
    if (!cart[cartKey]) return;

    cart[cartKey].quantity += change;

    if (cart[cartKey].quantity <= 0) {
        delete cart[cartKey];
    }
    
    saveCart();
    updateCartUI();
}

function removeFromCart(cartKey) {
    if (!cart[cartKey]) return;
    
    const mealName = cart[cartKey].item.name;
    const optionsDisplay = formatOptionsDisplay(cart[cartKey].options);
    
    if (confirm(`Voulez-vous vraiment retirer ${mealName}${optionsDisplay} du panier ?`)) {
        delete cart[cartKey];
        saveCart();
        updateCartUI();
        showNotification(`${mealName}${optionsDisplay} retiré du panier.`, true);
    }
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const emptyMessage = document.getElementById('empty-cart-message');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartCountMobile = document.getElementById('cart-count-mobile');

    let total = 0;
    let totalItems = 0;
    cartItemsContainer.innerHTML = '';

    for (const cartKey in cart) {
        const cartItem = cart[cartKey];
        const itemTotal = cartItem.item.price * cartItem.quantity;
        const optionsDisplay = formatOptionsDisplay(cartItem.options);
        
        total += itemTotal;
        totalItems += cartItem.quantity;

        const itemHtml = `
            <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg shadow-sm">
                <div class="flex-grow">
                    <h5 class="text-sm font-semibold text-gray-800">${escapeHtml(cartItem.item.name)}</h5>
                    ${optionsDisplay ? `<p class="text-xs text-gray-600">${escapeHtml(optionsDisplay)}</p>` : ''}
                    <span class="text-xs text-primary-dark">${cartItem.item.price.toFixed(2)} €/u</span>
                </div>
                <div class="flex flex-col items-end space-y-1">
                    <div class="flex items-center border border-gray-300 rounded-full">
                        <button onclick='changeQuantity(\`${cartKey}\`, -1)' 
                                class="p-1 text-gray-600 hover:bg-gray-200 rounded-full w-7 h-7 flex justify-center items-center text-lg leading-none" 
                                aria-label="Diminuer la quantité">-</button>
                        <span class="px-2 text-sm font-medium" aria-live="polite">${cartItem.quantity}</span>
                        <button onclick='changeQuantity(\`${cartKey}\`, 1)' 
                                class="p-1 text-gray-600 hover:bg-gray-200 rounded-full w-7 h-7 flex justify-center items-center text-lg leading-none" 
                                aria-label="Augmenter la quantité">+</button>
                    </div>
                    <span class="text-sm font-bold text-gray-800">${itemTotal.toFixed(2)} €</span>
                </div>
                <button onclick='removeFromCart(\`${cartKey}\`)' 
                        class="text-red-500 hover:text-red-700 ml-2 mt-1" 
                        aria-label="Supprimer du panier">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        `;
        cartItemsContainer.innerHTML += itemHtml;
    }

    cartTotalElement.textContent = total.toFixed(2) + ' €';
    checkoutBtn.disabled = total === 0;
    checkoutBtn.setAttribute('aria-disabled', total === 0);
    
    // Vérifier si l'élément existe avant de modifier son style
    if (emptyMessage) {
        emptyMessage.style.display = total === 0 ? 'block' : 'none';
    }

    if (totalItems > 0) {
        cartCountMobile.textContent = totalItems;
        cartCountMobile.classList.remove('opacity-0');
    } else {
        cartCountMobile.classList.add('opacity-0');
    }
}

// --- Gestion de la Commande ---
function openCheckoutModal() {
    if (Object.keys(cart).length === 0) {
        showNotification("Votre panier est vide. Ajoutez des plats pour commander.", true);
        return;
    }

    // Vérifier les infos client AVANT d'ouvrir la modale
    const clientName = document.getElementById("client-name").value.trim();
    const clientPhone = document.getElementById("client-phone").value.trim();
    const clientAddress = document.getElementById("client-address").value.trim();

    if (!clientName || !clientPhone || !clientAddress) {
        showNotification("⚠️ Veuillez d'abord remplir votre Nom, Telephone et Adresse en haut de la page !", true);
        
        // Faire défiler vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Faire clignoter les champs vides
        if (!clientName) {
            const nameField = document.getElementById("client-name");
            nameField.classList.add('border-red-500', 'animate-pulse');
            nameField.focus();
            setTimeout(function() {
                nameField.classList.remove('animate-pulse');
            }, 2000);
        } else if (!clientPhone) {
            const phoneField = document.getElementById("client-phone");
            phoneField.classList.add('border-red-500', 'animate-pulse');
            phoneField.focus();
            setTimeout(function() {
                phoneField.classList.remove('animate-pulse');
            }, 2000);
        } else if (!clientAddress) {
            const addressField = document.getElementById("client-address");
            addressField.classList.add('border-red-500', 'animate-pulse');
            addressField.focus();
            setTimeout(function() {
                addressField.classList.remove('animate-pulse');
            }, 2000);
        }
        
        return;
    }

    const modalCartItemsContainer = document.getElementById('modal-cart-items');
    const modalCartTotalElement = document.getElementById('modal-cart-total');
    let total = 0;
    
    modalCartItemsContainer.innerHTML = '';

    for (const cartKey in cart) {
        const item = cart[cartKey];
        const itemTotal = item.item.price * item.quantity;
        const optionsDisplay = formatOptionsDisplay(item.options);
        total += itemTotal;
        
        modalCartItemsContainer.innerHTML += `
            <div class="flex justify-between text-gray-700 text-sm border-b border-dashed pb-1">
                <span class="font-medium">${item.quantity} x ${escapeHtml(item.item.name)}${escapeHtml(optionsDisplay)}</span>
                <span class="font-semibold">${itemTotal.toFixed(2)} €</span>
            </div>
        `;
    }

    document.getElementById('order-id').textContent = generateOrderId();
    modalCartTotalElement.textContent = total.toFixed(2) + ' €';
    
    openModal('confirmation-modal');
}

function finalizeOrder() {
    // Récupérer les infos client
    const clientName = document.getElementById("client-name").value.trim();
    const clientPhone = document.getElementById("client-phone").value.trim();
    const clientAddress = document.getElementById("client-address").value.trim();

    // Validation des champs avec message plus visible
    if (!clientName || !clientPhone || !clientAddress) {
        // Fermer la modale pour montrer les champs à remplir
        closeModal('confirmation-modal');
        
        // Afficher notification d'erreur
        showNotification("⚠️ Veuillez remplir votre Nom, Telephone et Adresse en haut de la page avant de commander !", true);
        
        // Faire défiler vers le haut pour voir les champs
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Faire clignoter les champs vides
        if (!clientName) {
            const nameField = document.getElementById("client-name");
            nameField.classList.add('border-red-500', 'animate-pulse');
            setTimeout(function() {
                nameField.classList.remove('animate-pulse');
            }, 2000);
        }
        if (!clientPhone) {
            const phoneField = document.getElementById("client-phone");
            phoneField.classList.add('border-red-500', 'animate-pulse');
            setTimeout(function() {
                phoneField.classList.remove('animate-pulse');
            }, 2000);
        }
        if (!clientAddress) {
            const addressField = document.getElementById("client-address");
            addressField.classList.add('border-red-500', 'animate-pulse');
            setTimeout(function() {
                addressField.classList.remove('animate-pulse');
            }, 2000);
        }
        
        return;
    }

    // Vérifier que le panier n'est pas vide
    if (Object.keys(cart).length === 0) {
        showNotification("Votre panier est vide !", true);
        return;
    }

    // Préparer les données de la commande
    const orderId = document.getElementById('order-id').textContent;
    let orderDetails = "=== COMMANDE " + orderId + " ===\n\n";
    orderDetails += "Client : " + clientName + "\n";
    orderDetails += "Telephone : " + clientPhone + "\n";
    orderDetails += "Adresse : " + clientAddress + "\n\n";
    orderDetails += "=== DETAILS DE LA COMMANDE ===\n\n";

    let totalAmount = 0;

    for (const cartKey in cart) {
        const item = cart[cartKey];
        const itemTotal = item.item.price * item.quantity;
        const optionsDisplay = formatOptionsDisplay(item.options);
        totalAmount += itemTotal;

        orderDetails += item.quantity + " x " + item.item.name + optionsDisplay + "\n";
        orderDetails += "   Prix unitaire : " + item.item.price.toFixed(2) + " EUR\n";
        orderDetails += "   Sous-total : " + itemTotal.toFixed(2) + " EUR\n\n";
    }

    orderDetails += "========================\n";
    orderDetails += "TOTAL : " + totalAmount.toFixed(2) + " EUR\n";
    orderDetails += "========================\n\n";
    orderDetails += "Methode de paiement : Especes a la livraison\n";
    orderDetails += "Statut : En attente de confirmation";

    showNotification("Envoi de la commande " + orderId + "...");

    // Préparer les données pour l'envoi
    const formData = new FormData();
    formData.append('Nom_Client', clientName);
    formData.append('Telephone', clientPhone);
    formData.append('Adresse', clientAddress);
    formData.append('Numero_Commande', orderId);
    formData.append('Details_Commande', orderDetails);
    formData.append('Montant_Total', totalAmount.toFixed(2) + ' EUR');

    // Envoyer via fetch
    fetch('https://formspree.io/f/mblpppwy', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(function(response) {
        if (response.ok) {
            // Succès
            cart = {};
            saveCart();
            updateCartUI();
            closeModal('confirmation-modal');
            
            document.getElementById("client-name").value = '';
            document.getElementById("client-phone").value = '';
            document.getElementById("client-address").value = '';
            
            showNotification("Commande envoyee avec succes ! N: " + orderId);
        } else {
            showNotification("Erreur lors de l'envoi. Reessayez.", true);
        }
    })
    .catch(function(error) {
        console.error('Erreur:', error);
        showNotification("Erreur de connexion. Verifiez votre internet.", true);
    });
}

// --- Recherche avec Debouncing ---
function searchMeals() {
    const query = document.getElementById('meal-search').value.toLowerCase().trim();
    
    if (query.length === 0) {
        displayMenu(MEALS_DATA);
        return;
    }

    const filteredMeals = MEALS_DATA.filter(meal => 
        meal.name.toLowerCase().includes(query) ||
        meal.description.toLowerCase().includes(query) ||
        meal.category.toLowerCase().includes(query)
    );

    displayMenu(filteredMeals);
}

function debouncedSearch() {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(searchMeals, 300);
}

// --- Initialisation ---
function init() {
    loadCart();
    displayMenu();
    updateCartUI();
    
    // Écouteurs d'événements
    const mealSearch = document.getElementById('meal-search');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (mealSearch) mealSearch.addEventListener('input', debouncedSearch);
    if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckoutModal);

    // Gestion sidebar mobile
    const cartSidebar = document.getElementById('cart-sidebar');
    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart-btn');

    if (openCartBtn) {
        openCartBtn.addEventListener('click', function() {
            cartSidebar.classList.remove('translate-x-full');
            document.body.classList.add('cart-open');
        });
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function() {
            cartSidebar.classList.add('translate-x-full');
            document.body.classList.remove('cart-open');
        });
    }
    
    // Fermer le panier en cliquant sur l'overlay (mobile)
    document.body.addEventListener('click', function(e) {
        if (document.body.classList.contains('cart-open') && 
            !cartSidebar.contains(e.target) && 
            !openCartBtn.contains(e.target)) {
            cartSidebar.classList.add('translate-x-full');
            document.body.classList.remove('cart-open');
        }
    });
    
    // Gestion du formulaire d'options
    const optionsForm = document.getElementById('options-form');
    if (optionsForm) {
        optionsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addMealWithOptions();
        });
    }
    
    // Positionnement initial du panier mobile
    if (window.innerWidth < 640 && cartSidebar) {
        cartSidebar.classList.add('translate-x-full');
    }
    
    // Gestion du clavier pour fermer les modales (Échap)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal-overlay.open');
            openModals.forEach(function(modal) {
                closeModal(modal.id);
            });
            if (window.innerWidth < 640 && cartSidebar && !cartSidebar.classList.contains('translate-x-full')) {
                cartSidebar.classList.add('translate-x-full');
                document.body.classList.remove('cart-open');
            }
        }
    });
}

// Démarrer l'application quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}