// Global variable to hold the current raindrop color
let currentRaindropColor = 'hsl(0, 0%, 100%)'; // Default color is white

class Raindrop {
    constructor(canvas, imageBrightnessData) {
        this.canvas = canvas; // The canvas element where raindrops will be drawn
        this.imageBrightnessData = imageBrightnessData; // Brightness data of the background image
        this.ctx = canvas.getContext('2d'); // The drawing context of the canvas
        this.resetRaindrop(); // Initialize the raindrop properties
    }

    resetRaindrop() {
        // Randomly position the raindrop on the x-axis within the canvas width
        this.x = Math.random() * this.canvas.width;
        this.y = 0; // Start at the top of the canvas
        this.speed = 0; // Initial speed is 0; it's incremented by velocity
        this.velocity = Math.random() * 5 + 3; // Random velocity for the raindrop
        this.size = Math.random() * 2 + 2; // Random size for the raindrop
        // Use the global current color for new and resetting raindrops
        this.color = currentRaindropColor;
    }

    update() {
        // Move the raindrop down by its speed and velocity
        this.y += this.speed + this.velocity;
        // Reset the raindrop if it goes beyond the canvas height
        if (this.y > this.canvas.height) {
            this.resetRaindrop();
        }
    }

    draw() {
        // Calculate the raindrop's position indices
        let yIndex = Math.floor(this.y);
        let xIndex = Math.floor(this.x);
        let brightness = 1; // Default brightness
        let outsideColor = 'rgba(0, 0, 0, 0.6)'; // Color used if the raindrop is outside the image area

        // Check if the raindrop is within the canvas area
        if (yIndex >= 0 && yIndex < this.canvas.height && xIndex >= 0 && xIndex < this.canvas.width) {
            // Get the brightness at the raindrop's position
            brightness = this.imageBrightnessData[yIndex * this.canvas.width + xIndex];
        }

        // Begin drawing the raindrop
        this.ctx.beginPath();
        // Set the fill color based on whether the raindrop is outside the image area
        this.ctx.fillStyle = (brightness === 1) ? outsideColor : this.color;
        // Draw the raindrop as a circle
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill(); // Fill the circle to make the raindrop visible
    }
}

function createImageBrightnessData(imageData) {
    // Create an array to hold brightness data for each pixel
    const brightnessData = new Uint8ClampedArray(imageData.width * imageData.height);
    // Loop through each pixel to calculate its brightness
    for (let y = 0; y < imageData.height; y++) {
        for (let x = 0; x < imageData.width; x++) {
            const index = (y * imageData.width + x) * 4; // Calculate the index in the imageData array
            // Extract the red, green, and blue values
            const red = imageData.data[index];
            const green = imageData.data[index + 1];
            const blue = imageData.data[index + 2];
            // Calculate brightness using a common formula
            const brightness = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
            // Store the brightness value
            brightnessData[y * imageData.width + x] = brightness;
        }
    }
    return brightnessData; // Return the array of brightness data
}

function startRainEffect(canvas, imageBrightnessData) {
    let raindrops = []; // Array to hold all raindrops
    // Create 10000 raindrops
    for (let i = 0; i < 10000; i++) {
        raindrops.push(new Raindrop(canvas, imageBrightnessData));
    }

    function animate() {
        const ctx = canvas.getContext('2d');
        // Clear the canvas before each animation frame
        ctx.fillStyle = 'rgba(0, 0, 0, 0.0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update and draw each raindrop
        for (let raindrop of raindrops) {
            raindrop.update();
            raindrop.draw();
        }

        // Request the next animation frame
        requestAnimationFrame(animate);
    }

    animate(); // Start the animation
}

function initializeCanvasWithImage(canvas, imageSrc) {
    const image = new Image(); // Create a new image object
    image.src = imageSrc; // Set the source of the image

    // Once the image is loaded, draw it on the canvas
    image.addEventListener('load', function () {
        const ctx = canvas.getContext('2d');
        // Set the canvas size to fill the window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Draw the image on the canvas
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        // Get the image data from the canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // Create brightness data from the image data
        const imageBrightnessData = createImageBrightnessData(imageData);

        // Start the rain effect using the brightness data
        startRainEffect(canvas, imageBrightnessData);
    });

    // Adjust the canvas size when the window is resized
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    });
}

// Listen for color picker changes and update the global color variable
document.getElementById('colorPicker').addEventListener('change', function () {
    currentRaindropColor = this.value; // Update the global raindrop color
});

document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('animationCanvas');
    // Array of images to choose from
    const images = ['salad.png', 'skull.png', 'american.png', 'ape.png', 'oohface.png', 'cat.png', 'retard2.png'];
    // Selects a random image from the array
    const randomImage = images[Math.floor(Math.random() * images.length)];
    // Initialize the canvas with the randomly selected image
    initializeCanvasWithImage(canvas, randomImage);
});
