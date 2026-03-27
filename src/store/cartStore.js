import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            // --- UI Actions ---
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            // --- Cart Logic ---
            addItem: (newItem) => {
                const items = get().items;
                const existing = items.find((i) => i.id === newItem.id);

                if (existing) {
                    get().updateQuantity(existing.id, existing.quantity + 1);
                } else {
                    set({ items: [...items, { ...newItem, quantity: 1 }] });
                }

                // Auto-open drawer when adding
                get().openCart();
            },

            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((item) => item.id !== id)
                })),

            updateQuantity: (id, qty) => {
                if (qty <= 0) {
                    get().removeItem(id);
                } else {
                    set((state) => ({
                        items: state.items.map((item) =>
                            item.id === id ? { ...item, quantity: qty } : item
                        ),
                    }));
                }
            },

            clearCart: () => set({ items: [] }),

            // --- Computed Values (Selectors) ---
            itemCount: () => {
                return get().items.reduce((acc, item) => acc + item.quantity, 0);
            },

            total: () => {
                return get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            },
        }),
        {
            name: 'zeno-cart', 
        }
    )
);