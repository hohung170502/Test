import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = {
  email: string;
  username: string;
  avatar: string;
  roles: string[];
  verified: boolean;
};

const initialState: User = {
  email: "",
  username: "",
  avatar: "/default-avatar.png",
  roles: [],
  verified: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      return action.payload;
    },
    updateAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
    updateRoles: (state, action: PayloadAction<string[]>) => {
      state.roles = action.payload;
    },
  },
});

export const { setUser, updateAvatar, updateRoles } = userSlice.actions;
export default userSlice.reducer;