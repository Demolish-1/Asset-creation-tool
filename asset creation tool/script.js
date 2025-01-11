// Theme Switching Functionality
document.getElementById('change-theme-button').addEventListener('click', function() {
    const themeSelector = document.getElementById('theme-selector');
    themeSelector.style.display = themeSelector.style.display === 'none' ? 'block' : 'none';
});

const themeOptions = document.querySelectorAll('.theme-option');
themeOptions.forEach(option => {
    option.addEventListener('click', function() {
        const selectedTheme = this.getAttribute('data-theme');
        document.getElementById('theme-stylesheet').setAttribute('href', selectedTheme);
        document.getElementById('theme-selector').style.display = 'none'; // Hide the theme selector after selection
    });
});

// Default images array    for picing random place holder image
const defaultImages = [
    'Assets/blankProductImage.png',
    'Assets/blankProduct2.png'
];

// Function to get a random default image
function getRandomDefaultImage() {
    const randomIndex = Math.floor(Math.random() * defaultImages.length);
    return defaultImages[randomIndex];
}

// Product Management Classes
class Product {
    constructor(name, price, description, picture, whatInTheBox, discount = null) {
        this.name = name;
        this.price = price;
        this.discount = discount;
        this.picture = picture; // This will hold the image data URL
        this.description = description;
        this.whatInTheBox = whatInTheBox;
    }

    getDiscountedPrice() {
        if (this.discount) {
            return (this.price - (this.price * (this.discount / 100))).toFixed(2);
        }
        return this.price.toFixed(2);
    }
}

class Database {
    constructor() {
        this.products = [];
    }

    addProduct(product) {
        this.products.push(product);
    }

    getAllProducts() {
        return this.products;
    }
}

const db = new Database();

// Handle drag and drop
const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('picture');

dropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropArea.classList.add('active');
});

dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('active');
});

dropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dropArea.classList.remove('active');

    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                fileInput.value = e.target.result; // Store the data URL in the hidden input
                dropArea.style.backgroundImage = `url(${e.target.result})`;
                dropArea.style.backgroundSize = 'cover';
                dropArea.style.backgroundPosition = 'center';
                dropArea.textContent = ''; // Clear the text
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please drop an image file.');
        }
    }
});

// Handle file input change
fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            dropArea.style.backgroundImage = `url(${e.target.result})`;
            dropArea.style.backgroundSize = 'cover';
            dropArea.style.backgroundPosition = 'center';
            dropArea.textContent = ''; // Clear the text
        };
        reader.readAsDataURL(file);
    }
});

// Handle form submission
document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const description = document.getElementById('description').value;
    let picture = fileInput.value; // Get the data URL from the hidden input
    const whatInTheBox = document.getElementById('whatInTheBox').value;
    const discount = parseFloat(document.getElementById('discount').value) || null;

    // Check if no image was uploaded and assign a random default image
    if (!picture) {
        picture = getRandomDefaultImage ();
    }

    const product = new Product(name, price, description, picture, whatInTheBox, discount);
    db.addProduct(product);
    displayProducts();
    showSuccessMessage(`Product '${name}' added successfully!`);

    // Clear the form
    this.reset();
    dropArea.style.backgroundImage = ''; // Reset the drop area
    dropArea.textContent = 'Drag & Drop your image here'; // Reset the text
});

// Function to display products
function displayProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    db.getAllProducts().forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        const discountedPrice = product.getDiscountedPrice();
        productItem.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: R${product.price.toFixed(2)} ${product.discount ? `(Discounted Price: R${discountedPrice})` : ''}</p>
            <p>Description: ${product.description}</p>
            <p>What's in the Box: ${product.whatInTheBox}</p>
            <img src="${product.picture}" alt="${product.name}" />
        `;

        productList.appendChild(productItem);
    });
}

// Function to show success message
function showSuccessMessage(message) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.style.display = 'block';
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}