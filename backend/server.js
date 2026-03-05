const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');

const app = express();
const port = 3000;

let products = [
    { id: nanoid(6), name: "iPhone 15", category: "Смартфоны", description: "Последняя модель", price: 99990, stock: 15, rating: 4.8 },
    { id: nanoid(6), name: "MacBook Pro", category: "Ноутбуки", description: "Мощный ноутбук", price: 199990, stock: 8, rating: 4.9 },
    { id: nanoid(6), name: "AirPods Pro", category: "Аудио", description: "Наушники", price: 24990, stock: 25, rating: 4.7 },
    { id: nanoid(6), name: "iPad Air", category: "Планшеты", description: "Планшет", price: 59990, stock: 12, rating: 4.6 },
    { id: nanoid(6), name: "Apple Watch", category: "Аксессуары", description: "Часы", price: 39990, stock: 20, rating: 4.5 },
    { id: nanoid(6), name: "Magic Keyboard", category: "Аксессуары", description: "Клавиатура", price: 9990, stock: 30, rating: 4.4 },
    { id: nanoid(6), name: "Magic Mouse", category: "Аксессуары", description: "Мышь", price: 7990, stock: 35, rating: 4.3 },
    { id: nanoid(6), name: "Studio Display", category: "Мониторы", description: "5K дисплей", price: 149990, stock: 5, rating: 4.7 },
    { id: nanoid(6), name: "HomePod", category: "Аудио", description: "Колонка", price: 29990, stock: 18, rating: 4.5 },
    { id: nanoid(6), name: "GoPro Hero", category: "Камеры", description: "Камера", price: 34990, stock: 10, rating: 4.6 }
];

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}][${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

function findProductOr404(id, res) {
    const product = products.find(p => p.id === id);
    if (!product) {
        res.status(404).json({ error: "Товар не найден" });
        return null;
    }
    return product;
}

app.post("/api/products", (req, res) => {
    const { name, category, description, price, stock, rating } = req.body;
    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        category,
        description,
        price: Number(price),
        stock: Number(stock),
        rating: rating ? Number(rating) : 0
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.get("/api/products", (req, res) => {
    res.json(products);
});

app.get("/api/products/:id", (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;
    res.json(product);
});

app.patch("/api/products/:id", (req, res) => {
    const product = findProductOr404(req.params.id, res);
    if (!product) return;

    const { name, category, description, price, stock, rating } = req.body;
    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (rating !== undefined) product.rating = Number(rating);

    res.json(product);
});

app.delete("/api/products/:id", (req, res) => {
    const exists = products.some(p => p.id === req.params.id);
    if (!exists) {
        return res.status(404).json({ error: "Товар не найден" });
    }
    products = products.filter(p => p.id !== req.params.id);
    res.status(204).send();
});

app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});