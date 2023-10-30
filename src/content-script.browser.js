class ColorPicker {
  #image;
  #canvas;

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
    const self = this;

    window.addEventListener('mousemove', (event) => {
      const x = event.clientX;
      const y = event.clientY;

      const color = self.getPixelColor(x, y);

    });
  }

  #registerChromeRuntimeMessage() {
    const self = this;

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === 'screenCaptureUrl') {
        self.attachImage(request);
      }
    });
  }

  getPixelColor(x, y) {
    const bound = this.#canvas.getBoundingClientRect();

    x = x - bound.left;
    y = y - bound.top;

    const pixelData = this.#canvas.getContext('2d').getImageData(x, y, 1, 1).data;

    return `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
  }


  async takeScreenshot() {
    await chrome.runtime.sendMessage({type: 'screenCapture'});
  }

  attachImage(response) {

    const self = this;

    this.#image.onload = function () {
      self.onloadImage(response);
    }
    this.#image.src = response.dataUrl;
  }

  onloadImage(response) {
    this.#canvas.width = response.tabWidth;
    this.#canvas.height = response.tabHeight;
    this.#canvas.getContext('2d').drawImage(this.#image, 0, 0, this.#canvas.width, this.#canvas.height);
  }
}

const colorPicker = new ColorPicker();


async function initialize() {
  await colorPicker.initialize();
}

(async () => {
  await initialize();
})();
