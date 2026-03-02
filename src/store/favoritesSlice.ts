import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './index';

export interface FavoriteProduct {
    id: number;
    title: string;
    price: number;
    thumbnail: string;
    discountPercentage: number;
    rating?: number;
}

interface FavoritesState {
    items: FavoriteProduct[];
}

const initialState: FavoritesState = {
    items: [],
};

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        toggleFavorite: (state, action: PayloadAction<FavoriteProduct>) => {
            const index = state.items.findIndex(item => item.id === action.payload.id);
            if (index >= 0) {
                state.items.splice(index, 1);
            } else {
                state.items.push(action.payload);
            }
        },
        clearFavorites: (state) => {
            state.items = [];
        },
    },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state: RootState) => state.favorites.items;
export const selectIsFavorite = (id: number) => (state: RootState) =>
    state.favorites.items.some(item => item.id === id);

export default favoritesSlice.reducer;
