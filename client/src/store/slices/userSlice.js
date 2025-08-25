import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: 'auth',
    initialState: {
        user: undefined,
    },
    reducers: {
        addUser: (store, action) => {
            store.user = action.payload
        },
        logoutUser: (store) => {
            store.user = null
        }
    }
})

export const { addUser, logoutUser } = userSlice.actions
export default userSlice.reducer