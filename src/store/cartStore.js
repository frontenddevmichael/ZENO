
import { create } from 'zustand'

export const useCartStore = create((set , get) => ({
    items: [],
    isOpen: false,

    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),
    clearCart: () => set({ items: [] }),
    removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
    updateQuantity: (id, qty) => {
        if (qty <= 0) {
            get().removeItem(id)
        } else {
            set((state) => ({ items: state.items.map(item => item.id === id ? { ...item, quantity: qty } : item) }))
        }
    },
    addItem :(newItem) => {
        const existing = get().items.find(i => i.id === newItem.id);
        if (existing){
            get().updateQuantity(existing.id, existing.quantity + 1)
        }else{
            set(state => ({ items: [...state.items, { ...newItem, quantity: 1 }] }))
        };

        get().openCart()
    },

    itemCount: () => {
        const items = get().items;

        return items.reduce((total, item) => {
            return total + item.quantity;
        }, 0);
    },

}))

