import { MessageType, ScreenShotResponse } from '@src/types.ts';

class ColorPicker {
	#image: HTMLImageElement;
	#canvas: HTMLCanvasElement;

	constructor() {
		this.#image = new Image();
		this.#canvas = window.document.createElement('canvas');
	}

	async initialize() {
		this.registerEvents();
		await this.takeScreenshot();
	}

	registerEvents() {
		this.#registerOnMouseMove();
		this.#registerChromeRuntimeMessage();
	}

	#registerOnMouseMove() {
		window.addEventListener('mousemove', (event) => {
			const x = event.clientX;
			const y = event.clientY;

			const color = this.getPixelColor(x, y);
			console.log(color);
		});
	}

	#registerChromeRuntimeMessage() {
		chrome.runtime.onMessage.addListener((request) => {
			if (request.type === MessageType.ScreenShotResponse) {
				this.attachImage(request);
			}
		});
	}

	getPixelColor(x: number, y: number) {
		const bound = this.#canvas.getBoundingClientRect();

		x = x - bound.left;
		y = y - bound.top;

		const pixelData = this.#canvas.getContext('2d')!.getImageData(x, y, 1, 1).data;

		return `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
	}

	async takeScreenshot() {
		await chrome.runtime.sendMessage({ type: MessageType.ScreenShot });
	}

	attachImage(response: ScreenShotResponse) {
		const onloadImageBind = this.onloadImage.bind(this);

		this.#image.onload = function () {
			onloadImageBind(response);
		};
		this.#image.src = response.dataUrl;
	}

	onloadImage(response: ScreenShotResponse) {
		this.#canvas.width = response.tabWidth;
		this.#canvas.height = response.tabHeight;
		this.#canvas
			.getContext('2d')!
			.drawImage(this.#image, 0, 0, this.#canvas.width, this.#canvas.height);
	}
}

const colorPicker = new ColorPicker();

async function initialize() {
	await colorPicker.initialize();
}

(async () => {
	await initialize();
})();
