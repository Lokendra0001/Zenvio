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
        removeUser: (store) => {
            store.user = null
        }
    }
})

export const { addUser, removeUser } = userSlice.actions
export default userSlice.reducer