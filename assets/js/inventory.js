let inventory = []
/* [
	{
		id: 101,
		name: 'Coca Cola 500ml',
		category: 'Soft Drink',
		hsn: '22021010',
		quantity: 240,
		lastUpdated: '2026-04-08',
		notes: 'Good condition',
	},
	{
		id: 102,
		name: 'Sprite 1L',
		category: 'Soft Drink',
		hsn: '22021010',
		quantity: 85,
		lastUpdated: '2026-04-09',
		notes: '',
	},
	{
		id: 103,
		name: 'Red Bull Energy',
		category: 'Energy Drink',
		hsn: '22021090',
		quantity: 12,
		lastUpdated: '2026-04-07',
		notes: 'Low stock',
	},
	{
		id: 104,
		name: 'Thums Up 250ml',
		category: 'Soft Drink',
		hsn: '22021010',
		quantity: 0,
		lastUpdated: '2026-04-05',
		notes: 'Out of stock',
	},
	{
		id: 105,
		name: 'Maaza Mango 600ml',
		category: 'Juice',
		hsn: '22029990',
		quantity: 65,
		lastUpdated: '2026-04-09',
		notes: '',
	},
	{
		id: 106,
		name: 'Bisleri 1L',
		category: 'Water',
		hsn: '22011010',
		quantity: 180,
		lastUpdated: '2026-04-08',
		notes: '',
	},
]; */

let editId = null;

function renderStats() {
	const totalDrinks = inventory.length;
	const totalBottles = inventory.reduce((sum, item) => sum + item.quantity, 0);
	const lowStock = inventory.filter(
		(i) => i.quantity > 0 && i.quantity < 30,
	).length;
	const outStock = inventory.filter((i) => i.quantity === 0).length;

	document.getElementById('statsContainer').innerHTML = `
		<div class="bg-zinc-900 rounded-3xl p-5 border border-zinc-700">
			<p class="text-xs text-orange-400">TOTAL ITEMS</p>
			<p class="text-4xl font-bold mt-1">${totalDrinks}</p>
		</div>
		<div class="bg-zinc-900 rounded-3xl p-5 border border-zinc-700">
			<p class="text-xs text-orange-400">TOTAL STOCK</p>
			<p class="text-4xl font-bold mt-1">${totalBottles}</p>
			<p class="text-xs text-zinc-400">bottles/crates</p>
		</div>
		<div class="bg-zinc-900 rounded-3xl p-5 border border-zinc-700">
			<p class="text-xs text-orange-400">LOW STOCK</p>
			<p class="text-4xl font-bold mt-1 text-amber-400">${lowStock}</p>
		</div>
		<div class="bg-zinc-900 rounded-3xl p-5 border border-zinc-700">
			<p class="text-xs text-orange-400">OUT OF STOCK</p>
			<p class="text-4xl font-bold mt-1 text-red-400">${outStock}</p>
		</div>`;
}

function getFilteredInventory() {
	const search = document
		.getElementById('searchInput')
		.value.toLowerCase()
		.trim();

	return inventory.filter((item) => {
		const matchSearch =
			!search ||
			item.name.toLowerCase().includes(search) ||
			item.hsn.includes(search);

		let matchStock = true;
		return matchSearch && matchStock;
	});
}

function renderMobileCards(filtered) {
	const container = document.getElementById('mobileCards');
	let html = '';

	filtered.forEach((item) => {
		let statusHTML = '';
		// if (item.quantity === 0) {
		// 	statusHTML = `<span class="px-4 py-1 text-xs rounded-3xl bg-red-500/20 text-red-400">Out of Stock</span>`;
		// } else if (item.quantity < 30) {
		// 	statusHTML = `<span class="px-4 py-1 text-xs rounded-3xl bg-amber-400/20 text-amber-400">Low Stock (${item.quantity})</span>`;
		// } else {
		// 	statusHTML = `<span class="px-4 py-1 text-xs rounded-3xl bg-emerald-400/20 text-emerald-400">In Stock</span>`;
		// }

		html += `
                <div class="drink-card rounded-3xl p-6 border border-zinc-700">
                    <div class="flex justify-between">
                        <div>
                            <h4 class="font-semibold text-lg">${item.name}</h4>
                            <p class="text-xs text-zinc-400 mt-1 font-mono">HSN: ${item.hsn}</p>
                        </div>
                        ${statusHTML}
                    </div>
                    <div class="mt-8 flex items-end justify-between">
                        <div>
                            <p class="text-xs text-zinc-400">Quantity</p>
                            <p class="text-4xl font-bold text-orange-400">${item.quantity}</p>
                        </div>
                        <div class="flex gap-2">
                            <button onclick="editItem(${item.id}); event.stopImmediatePropagation()" 
                                    class="w-11 h-11 bg-zinc-800 hover:bg-orange-500 hover:text-black rounded-2xl flex items-center justify-center text-xl">✏️</button>
                            <button onclick="deleteItem(${item.id}); event.stopImmediatePropagation()" 
                                    class="w-11 h-11 bg-zinc-800 hover:bg-red-500 hover:text-white rounded-2xl flex items-center justify-center text-xl">🗑️</button>
                        </div>
                    </div>
                </div>`;
	});

	container.innerHTML = html;
}

function renderDesktopTable(filtered) {
	const tbody = document.getElementById('inventoryTableBody');
	let html = '';

	filtered.forEach((item) => {
		let status =
			item.quantity === 0
				? 'text-red-400'
				: item.quantity < 30
					? 'text-amber-400'
					: 'text-emerald-400';

		html += `
                <tr class="hover:bg-zinc-800/70">
                    <td class="px-6 py-5 font-medium">${item.name}</td>
                    <td class="px-6 py-5"><span class="px-4 py-1 bg-zinc-800 text-xs rounded-3xl">${item.category}</span></td>
                    <td class="px-6 py-5 font-mono text-zinc-300">${item.hsn}</td>
                    <td class="px-6 py-5 font-semibold ${status}">${item.quantity}</td>
                    <td class="px-6 py-5 text-xs text-zinc-400">${item.lastUpdated}</td>
                    <td class="px-6 py-5">
                        <div class="flex gap-3">
                            <button onclick="editItem(${item.id}); event.stopImmediatePropagation()" class="hover:text-orange-400">Edit</button>
                            <button onclick="deleteItem(${item.id}); event.stopImmediatePropagation()" class="text-red-400 hover:text-red-500">Delete</button>
                        </div>
                    </td>
                </tr>`;
	});
	tbody.innerHTML = html;
}

function renderInventory() {
	const filtered = getFilteredInventory();
	const isEmpty = filtered.length === 0;

	document.getElementById('emptyState').classList.toggle('hidden', !isEmpty);

	if (window.innerWidth < 768) {
		renderMobileCards(filtered);
	} else {
		renderDesktopTable(filtered);
	}
}

function openAddModal() {
	editId = null;
	document.getElementById('modalTitle').textContent = 'Add New Cold Drink';
	document.getElementById('submitBtn').textContent = 'Add Drink';
	document.getElementById('drinkForm').reset();
	document.getElementById('formQuantity').value = 50;
	document.getElementById('modalOverlay').classList.remove('hidden');
	document.getElementById('formName').focus();
}

function editItem(id) {
	const item = inventory.find((i) => i.id === id);
	if (!item) return;

	editId = id;
	document.getElementById('modalTitle').textContent = 'Edit Cold Drink';
	document.getElementById('submitBtn').textContent = 'Save Changes';

	document.getElementById('formName').value = item.name;
	document.getElementById('formHSN').value = item.hsn;
	document.getElementById('formQuantity').value = item.quantity;
	document.getElementById('formNotes').value = item.notes || '';

	document.getElementById('modalOverlay').classList.remove('hidden');
}

function handleFormSubmit(e) {
	e.preventDefault();

	const name = document.getElementById('formName').value.trim();
	const hsn = document.getElementById('formHSN').value.trim();
	const quantity = parseInt(document.getElementById('formQuantity').value) || 0;
	const notes = document.getElementById('formNotes').value.trim();

	if (!name || !hsn) {
		alert('Drink Name and HSN Code are required!');
		return;
	}

	if (editId !== null) {
		const item = inventory.find((i) => i.id === editId);
		if (item) {
			item.name = name;
			item.hsn = hsn;
			item.quantity = quantity;
			item.notes = notes;
			item.lastUpdated = '2026-04-09';
		}
	} else {
		const maxId = Math.max(...inventory.map((i) => i.id), 100);
		inventory.push({
			id: maxId + 1,
			name,
			hsn,
			quantity,
			lastUpdated: '2026-04-09',
			notes,
		});
	}

	closeModal();
	renderStats();
	renderInventory();
	showToast(
		editId ? '✅ Drink updated successfully' : '🥤 New cold drink added!',
	);
}

function closeModal() {
	document.getElementById('modalOverlay').classList.add('hidden');
	editId = null;
}

function deleteItem(id) {
	if (!confirm('Delete this cold drink from inventory?')) return;
	inventory = inventory.filter((i) => i.id !== id);
	renderStats();
	renderInventory();
	showToast('🗑️ Drink removed');
}

function showToast(message) {
	const toast = document.createElement('div');
	toast.style.cssText = `position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:#111; color:white; padding:16px 24px; border-radius:9999px; z-index:99999; box-shadow:0 10px 15px -3px rgb(0 0 0);`;
	toast.innerHTML = message;
	document.body.appendChild(toast);
	setTimeout(() => toast.remove(), 2800);
}

function refreshData() {
	showToast('🔄 Refreshing stock...');
	setTimeout(() => {
		renderStats();
		renderInventory();
	}, 600);
}

// Initialize App
function init() {
	renderStats();
	renderInventory();

	window.addEventListener('resize', renderInventory);
}

window.onload = init;
