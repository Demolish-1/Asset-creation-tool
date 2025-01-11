class Database {
    constructor() {
        this.products = [];
    }

    addProduct(product) {
        if (product instanceof Product) {
            this.products.push(product);
            console.log(`Product '${product.name}' added to the database.`);
        } else {
            console.error("Error: Only Product instances can be added.");
        }
    }

    getAllProducts() {
        return this.products;
    }

    findProductByName(name) {
        return this.products.find(product => product.name === name) || null;
    }
}