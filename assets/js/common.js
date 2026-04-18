window.addEventListener('load', () => {
	const login_token = localStorage.getItem('login_token');
	if (!login_token) {
		window.location.href = 'index.html';
	}
});

const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

overlay.id = 'overlay';
overlay.className = 'fixed inset-0 bg-black/50 hidden md:hidden z-40';
document.body.appendChild(overlay);

function openSidebar() {
	sidebar.classList.remove('-translate-x-full');
	overlay.classList.remove('hidden');
	overlay.classList.add('flex');
}

function closeSidebar() {
	sidebar.classList.add('-translate-x-full');
	overlay.classList.add('hidden');
	overlay.classList.remove('flex');
}

menuBtn.addEventListener('click', openSidebar);
overlay.addEventListener('click', closeSidebar);

// Close sidebar when clicking any nav link on mobile
document.querySelectorAll('#sidebar a').forEach((link) => {
	link.addEventListener('click', () => {
		if (window.innerWidth < 768) closeSidebar();
	});
});
