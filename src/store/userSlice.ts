import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    email: string | null;
    isLoggedIn: boolean;
}

const initialState: UserState = {
    email: null,
    isLoggedIn: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
            state.isLoggedIn = true;
        },
        logoutUser: (state) => {
            state.email = null;
            state.isLoggedIn = false;
        },
    },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;