import React, { useEffect, useState } from "react";

export default function ProductModal({ open, mode, initialProduct, onClose, onSubmit }) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [rating, setRating] = useState("");

    useEffect(() => {
        if (!open) return;
        setName(initialProduct?.name ?? "");
        setCategory(initialProduct?.category ?? "");
        setDescription(initialProduct?.description ?? "");
        setPrice(initialProduct?.price != null ? String(initialProduct.price) : "");
        setStock(initialProduct?.stock != null ? String(initialProduct.stock) : "");
        setRating(initialProduct?.rating != null ? String(initialProduct.rating) : "");
    }, [open, initialProduct]);

    if (!open) return null;

    const title = mode === "edit" ? "Редактирование товара" : "Добавление товара";

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Введите название товара");
            return;
        }
        if (!category.trim()) {
            alert("Введите категорию");
            return;
        }
        if (!description.trim()) {
            alert("Введите описание");
            return;
        }
        if (!price || Number(price) <= 0) {
            alert("Введите корректную цену");
            return;
        }
        if (!stock || Number(stock) < 0) {
            alert("Введите корректное количество");
            return;
        }

        onSubmit({
            id: initialProduct?.id,
            name: name.trim(),
            category: category.trim(),
            description: description.trim(),
            price: Number(price),
            stock: Number(stock),
            rating: rating ? Number(rating) : 0
        });
    };

    return (
        <div className="backdrop" onMouseDown={onClose}>
            <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <div className="modal__title">{title}</div>
                    <button className="iconBtn" onClick={onClose}>✕</button>
                </div>

                <form className="form" onSubmit={handleSubmit}>
                    <label className="label">
                        Название
                        <input
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Например, iPhone 15"
                            autoFocus
                        />
                    </label>

                    <label className="label">
                        Категория
                        <input
                            className="input"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="Например, Смартфоны"
                        />
                    </label>

                    <label className="label">
                        Описание
                        <textarea
                            className="input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Описание товара"
                            rows="3"
                        />
                    </label>

                    <label className="label">
                        Цена (₽)
                        <input
                            className="input"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="99990"
                            type="number"
                        />
                    </label>

                    <label className="label">
                        Количество на складе
                        <input
                            className="input"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            placeholder="10"
                            type="number"
                        />
                    </label>

                    <label className="label">
                        Рейтинг (0-5)
                        <input
                            className="input"
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                            placeholder="4.5"
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                        />
                    </label>

                    <div className="modal__footer">
                        <button type="button" className="btn" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" className="btn btn--primary">
                            {mode === "edit" ? "Сохранить" : "Добавить"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}