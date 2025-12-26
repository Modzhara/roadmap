const frameCount = 326; // кількість кадрів
const framePath = "frames/frame_";
const frameExt = ".webp";

const slider = document.getElementById("flipbook-slider");
const img = document.getElementById("flipbook-frame");
const nearStoreBtn = document.getElementById("near-store");
const flipbookContainer = document.getElementById("flipbook-container");

slider.max = frameCount;

// Флаг показу flipbook
let flipbookVisible = false;

// Масив для підвантажених кадрів
const frames = new Array(frameCount).fill(null);

// Функція підвантаження кадру
function loadFrame(index) {
	if (!frames[index]) {
		const frameNumber = String(index + 1).padStart(4, "0");
		const newImg = new Image();
		newImg.src = `${framePath}${frameNumber}${frameExt}`;
		frames[index] = newImg.src;
	}
	return frames[index];
}

// Показ/приховання flipbook
nearStoreBtn.addEventListener("click", () => {
	flipbookVisible = !flipbookVisible;

	if (flipbookVisible) {
		flipbookContainer.style.display = "block";
		slider.style.display = "block"; // показуємо слайдер
		nearStoreBtn.textContent = "Закрити";
		img.src = loadFrame(0);
	} else {
		flipbookContainer.style.display = "none";
		slider.style.display = "none"; // ховаємо слайдер
		nearStoreBtn.textContent = "Я d;t gjhex";
	}
});

// Ховаємо flipbook спочатку
flipbookContainer.style.display = "none";

// --- Drag & hold для перемотки кадрів ---
let isDragging = false;
let startX = 0;

function updateFrameByDelta(deltaX) {
	let currentIndex = parseInt(slider.value) - 1;
	const sensitivity = 2; // кількість пікселів для одного кадру
	const frameChange = Math.floor(deltaX / sensitivity);

	if (frameChange !== 0) {
		let newIndex = currentIndex + frameChange;
		if (newIndex < 0) newIndex = 0;
		if (newIndex >= frameCount) newIndex = frameCount - 1;

		slider.value = newIndex + 1;
		img.src = loadFrame(newIndex);

		// Підвантаження наступного кадру для плавності
		if (newIndex + 1 < frameCount) loadFrame(newIndex + 1);

		return frameChange * sensitivity; // скільки пікселів "спожито"
	}
	return 0;
}

flipbookContainer.addEventListener("mousedown", (e) => {
	isDragging = true;
	startX = e.clientX;
});

flipbookContainer.addEventListener("touchstart", (e) => {
	isDragging = true;
	startX = e.touches[0].clientX;
});

flipbookContainer.addEventListener("mousemove", (e) => {
	if (!isDragging) return;
	const delta = e.clientX - startX;
	const consumed = updateFrameByDelta(delta);
	startX += consumed;
});

flipbookContainer.addEventListener("touchmove", (e) => {
	if (!isDragging) return;
	const delta = e.touches[0].clientX - startX;
	const consumed = updateFrameByDelta(delta);
	startX += consumed;
});

// Припиняємо drag
flipbookContainer.addEventListener("mouseup", () => isDragging = false);
flipbookContainer.addEventListener("mouseleave", () => isDragging = false);
flipbookContainer.addEventListener("touchend", () => isDragging = false);
flipbookContainer.addEventListener("touchcancel", () => isDragging = false);

// --- Підключення слайдера ---
slider.addEventListener("input", () => {
	const index = slider.value - 1;
	img.src = loadFrame(index);
	if (index + 1 < frameCount) loadFrame(index + 1);
});
