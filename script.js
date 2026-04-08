const SERVICES = [
    { id: 'b1', name: 'Bainha Simples (Calça)', price: 8, category: 'Bainhas', description: 'Acabamento padrão para calças jeans ou sarja.' },
    { id: 'b2', name: 'Bainha Original (Jeans)', price: 9, category: 'Bainhas', description: 'Mantém o acabamento original de fábrica.' },
    { id: 'b3', name: 'Bainha de Vestido/Saia', price: 7, category: 'Bainhas', description: 'Ajuste de comprimento para peças delicadas.' },
    { id: 'a1', name: 'Ajuste de Cintura', price: 9, category: 'Ajustes', description: 'Aperto ou folga na região do cós.' },
    { id: 'a2', name: 'Ajuste Lateral (Camisa)', price: 8, category: 'Ajustes', description: 'Ajuste de silhueta para camisas sociais ou blusas.' },
    { id: 'a3', name: 'Ajuste de Ombro', price: 5, category: 'Ajustes', description: 'Ajuste estrutural em blazers ou casacos.' },
    { id: 'z1', name: 'Troca de Zíper Comum', price: 7, category: 'Zíperes', description: 'Substituição de zíper em calças ou saias.' },
    { id: 'z2', name: 'Troca de Zíper Invisível', price: 15, category: 'Zíperes', description: 'Ideal para vestidos de festa e saias sociais.' },
    { id: 'z3', name: 'Pregar Botão', price: 5, category: 'Zíperes', description: 'Reposição de botões simples.' },
    { id: 'c1', name: 'Customização de Peça', price: 15, category: 'Customização', description: 'Transformação de peças antigas em novos modelos.' },
    { id: 'c2', name: 'Aplicação de Patch/Remendo', price: 9, category: 'Customização', description: 'Reparo decorativo ou funcional.' },
];

const CATEGORIES = [...new Set(SERVICES.map(s => s.category))];
let cart = [];
let activeCategory = CATEGORIES[0];

function init() {
    renderCategories();
    renderServices();
    updateCartUI();
    lucide.createIcons();
}

function renderCategories() {
    const container = document.getElementById('category-tabs');
    if (!container) return;
    
    container.innerHTML = CATEGORIES.map(cat => `
        <button onclick="setCategory('${cat}')" class="category-btn px-6 py-2 rounded-full text-sm font-medium transition-all bg-stone-100 text-stone-500 hover:bg-stone-200 ${cat === activeCategory ? 'active' : ''}">
            ${cat}
        </button>
    `).join('');
}

function setCategory(cat) {
    activeCategory = cat;
    renderCategories();
    renderServices();
}

function renderServices() {
    const container = document.getElementById('services-grid');
    if (!container) return;

    const filtered = SERVICES.filter(s => s.category === activeCategory);
    container.innerHTML = filtered.map(s => `
        <div class="group p-6 rounded-3xl border border-stone-100 bg-brand-cream/30 hover:bg-white hover:shadow-xl hover:border-brand-olive/20 transition-all duration-300">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-serif font-semibold text-stone-800">${s.name}</h3>
                <span class="text-lg font-medium text-brand-clay">R$ ${s.price}</span>
            </div>
            <p class="text-sm text-stone-500 mb-6 leading-relaxed">${s.description}</p>
            <button onclick="addToCart('${s.id}')" class="w-full py-3 rounded-xl border border-brand-olive text-brand-olive font-medium hover:bg-brand-olive hover:text-brand-cream transition-all flex items-center justify-center gap-2">
                <i data-lucide="plus" class="w-4 h-4"></i> Adicionar ao Pedido
            </button>
        </div>
    `).join('');
    lucide.createIcons();
}

function addToCart(id) {
    const service = SERVICES.find(s => s.id === id);
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...service, quantity: 1 });
    }
    updateCartUI();
    toggleCart(true);
}

function updateQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
    }
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    const countBadge = document.getElementById('cart-count');
    if (countBadge) {
        countBadge.innerText = count;
        countBadge.classList.toggle('hidden', count === 0);
    }

    const itemsContainer = document.getElementById('cart-items');
    if (!itemsContainer) return;

    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <div class="h-full flex flex-col items-center justify-center text-stone-400 gap-4">
                <i data-lucide="shopping-bag" class="w-12 h-12" stroke-width="1"></i>
                <p class="font-serif text-lg">Seu carrinho está vazio</p>
                <button onclick="toggleCart(false)" class="text-brand-olive font-medium underline underline-offset-4">Ver serviços</button>
            </div>
        `;
        document.getElementById('cart-footer').classList.add('hidden');
    } else {
        itemsContainer.innerHTML = cart.map(item => `
            <div class="flex gap-4 mb-6">
                <div class="flex-grow">
                    <h4 class="font-medium text-stone-800">${item.name}</h4>
                    <p class="text-sm text-stone-500 mb-2">R$ ${item.price.toFixed(2)} cada</p>
                    <div class="flex items-center gap-3">
                        <button onclick="updateQuantity('${item.id}', -1)" class="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50"><i data-lucide="minus" class="w-3 h-3"></i></button>
                        <span class="w-6 text-center font-medium">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.id}', 1)" class="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50"><i data-lucide="plus" class="w-3 h-3"></i></button>
                    </div>
                </div>
                <div class="text-right flex flex-col justify-between items-end">
                    <button onclick="removeFromCart('${item.id}')" class="text-stone-300 hover:text-red-400 transition-colors"><i data-lucide="x" class="w-4 h-4"></i></button>
                    <span class="font-medium text-brand-clay">R$ ${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
        `).join('');
        document.getElementById('cart-footer').classList.remove('hidden');
        document.getElementById('cart-total').innerText = `R$ ${total.toFixed(2)}`;
    }
    lucide.createIcons();
}

function toggleCart(open) {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (open) {
        sidebar.style.transform = 'translateX(0)';
        overlay.classList.remove('hidden');
        document.body.classList.add('cart-open');
    } else {
        sidebar.style.transform = 'translateX(100%)';
        overlay.classList.add('hidden');
        document.body.classList.remove('cart-open');
    }
}

function sendToWhatsApp() {
    const phoneNumber = "5585921588281";
    const intro = "Olá! Gostaria de solicitar um orçamento para os seguintes serviços:\n\n";
    const itemsList = cart.map(item => `• ${item.name} (${item.quantity}x) - R$ ${(item.price * item.quantity).toFixed(2)}`).join('\n');
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const footer = `\n\n*Total Estimado: R$ ${total.toFixed(2)}*`;
    
    const message = encodeURIComponent(intro + itemsList + footer);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

window.onload = init;