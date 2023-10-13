import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

type userType = {
  user: authUser | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
};

type authUser = {
  id: number;
  username: string;
  password: string;
};

const initialState: userType = {
  user: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/v1/api-token-auth/",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );
    const result = await response.json();
    if (result.id) {
      toast.success("Вы успешно авторизованы!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return result;
    } else {
      toast.error(result.message, { position: toast.POSITION.BOTTOM_RIGHT });
    }
  } catch (error: any) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    return thunkAPI.rejectWithValue(message);
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
