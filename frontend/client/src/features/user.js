import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const register = createAsyncThunk(
	'/formapp/register',
	async ({ first_name, last_name, email, password }, thunkAPI) => {
		const body = JSON.stringify({
			first_name,
			last_name,
			email,
			password,
		});

		try {
			const res = await fetch('/api/formapp/register', {
				mode: 'no-cors',
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body,
			});

			const data = await res.json();

			if (res.status === 201) {
				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (err) {
			return thunkAPI.rejectWithValue(err.response.data);
		}
	}
);

const getUser = createAsyncThunk('/formapp/me', async (_, thunkAPI) => {
	try {
		const res = await fetch('/api/formapp/me', {
			mode: 'no-cors',
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		});

		const data = await res.json();

		if (res.status === 200) {
			return data;
		} else {
			return thunkAPI.rejectWithValue(data);
		}
	} catch (err) {
		return thunkAPI.rejectWithValue(err.response.data);
	}
});

export const login = createAsyncThunk(
	'/formapp/login',
	async ({ email, password }, thunkAPI) => {
		const body = JSON.stringify({
			email,
			password,
		});

		try {
			const res = await fetch('/api/formapp/login', {
				mode: 'no-cors',
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body,
			});

			const data = await res.json();

			if (res.status === 200) {
				const { dispatch } = thunkAPI;

				dispatch(getUser());

				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (err) {
			return thunkAPI.rejectWithValue(err.response.data);
		}
	}
);

export const checkAuth = createAsyncThunk(
	'/formapp/verify',
	async (_, thunkAPI) => {
		try {
			const res = await fetch('/api/formapp/verify', {
				mode: 'no-cors',
				method: 'GET',
				headers: {
					Accept: 'application/json',
				},
			});

			const data = await res.json();

			if (res.status === 200) {
				const { dispatch } = thunkAPI;

				dispatch(getUser());

				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (err) {
			return thunkAPI.rejectWithValue(err.response.data);
		}
	}
);

export const logout = createAsyncThunk('/formapp/logout', async (_, thunkAPI) => {
	try {
		const res = await fetch('/api/formapp/logout', {
			mode: 'no-cors',
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		});

		const data = await res.json();

		if (res.status === 200) {
			return data;
		} else {
			return thunkAPI.rejectWithValue(data);
		}
	} catch (err) {
		return thunkAPI.rejectWithValue(err.response.data);
	}
});

const initialState = {
	isAuthenticated: false,
	user: null,
	loading: false,
	registered: false,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		resetRegistered: state => {
			state.registered = false;
		},
	},
	extraReducers: builder => {
		builder
			.addCase(register.pending, state => {
				state.loading = true;
			})
			.addCase(register.fulfilled, state => {
				state.loading = false;
				state.registered = true;
			})
			.addCase(register.rejected, state => {
				state.loading = false;
			})
			.addCase(login.pending, state => {
				state.loading = true;
			})
			.addCase(login.fulfilled, state => {
				state.loading = false;
				state.isAuthenticated = true;
			})
			.addCase(login.rejected, state => {
				state.loading = false;
			})
			.addCase(getUser.pending, state => {
				state.loading = true;
			})
			.addCase(getUser.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(getUser.rejected, state => {
				state.loading = false;
			})
			.addCase(checkAuth.pending, state => {
				state.loading = true;
			})
			.addCase(checkAuth.fulfilled, state => {
				state.loading = false;
				state.isAuthenticated = true;
			})
			.addCase(checkAuth.rejected, state => {
				state.loading = false;
			})
			.addCase(logout.pending, state => {
				state.loading = true;
			})
			.addCase(logout.fulfilled, state => {
				state.loading = false;
				state.isAuthenticated = false;
				state.user = null;
			})
			.addCase(logout.rejected, state => {
				state.loading = false;
			});
	},
});

export const { resetRegistered } = userSlice.actions;
export default userSlice.reducer;