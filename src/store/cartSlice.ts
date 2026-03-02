import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';

export interface CartItem {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    quantity: number;
    size: string;
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
            const existing = state.items.find(
                item => item.id === action.payload.id && item.size === action.payload.size
            );
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },
        removeFromCart: (state, action: PayloadAction<{ id: number; size: string }>) => {
            state.items = state.items.filter(
                item => !(item.id === action.payload.id && item.size === action.payload.size)
            );
        },
        updateQuantity: (state, action: PayloadAction<{ id: number; size: string; quantity: number }>) => {
            const item = state.items.find(
                i => i.id === action.payload.id && i.size === action.payload.size
            );
            if (item) {
                if (action.payload.quantity <= 0) {
                    state.items = state.items.filter(
                        i => !(i.id === action.payload.id && i.size === action.payload.size)
                    );
                } else {
                    item.quantity = action.payload.quantity;
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartCount = (state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

export default cartSlice.reducer;
