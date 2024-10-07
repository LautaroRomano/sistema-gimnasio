import { createSlice, configureStore, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "@/types";

const initialState: { user: UserType | null; sessionToken: string | null } = {
  user: null,
  sessionToken: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: UserType }>) => {
      state.user = action.payload.user;
    },
    deleteUser: (state) => {
      localStorage.removeItem("sessionToken");
      state.user = null;
      state.sessionToken = null;
    },
    setSessionToken: (state, action: PayloadAction<string>) => {
      state.sessionToken = action.payload;
    },
  },
});

export const { setUser, deleteUser, setSessionToken } = userSlice.actions;

const store = configureStore({
  reducer: userSlice.reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
