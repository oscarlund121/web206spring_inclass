"use client"

import { useState } from "react";
import { Product } from "@/types/product";

type CartProps = {
    cart: Product[];
    cartItemCount: number;
};

export default function Cart({ cart, cartItemCount }: CartProps) {
    const [isOpen, setIsOpen] = useState(false);

    const total = cart.reduce((sum, p) => sum + p.price, 0);

    return (
        <div className="cart">
            <button className="cart__button" onClick={() => setIsOpen(!isOpen)} aria-label="Open cart">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {cartItemCount > 0 && (
                    <span className="cart__badge">{cartItemCount}</span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="cart__overlay" onClick={() => setIsOpen(false)} />
                    <div className="cart__popup">
                        <h3 className="cart__title">Your Cart</h3>
                        {cart.length === 0 ? (
                            <p className="cart__empty">Your cart is empty.</p>
                        ) : (
                            <>
                                <ul className="cart__list">
                                    {cart.map((item, index) => (
                                        <li key={index} className="cart__item">
                                            <span className="cart__item-name">{item.name}</span>
                                            <span className="cart__item-price">${item.price}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="cart__total">
                                    Total: <strong>${total.toFixed(2)}</strong>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
