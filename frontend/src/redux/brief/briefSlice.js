import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = '/backend';

export const createBrief = createAsyncThunk(
    'brief/create',
    async (briefData, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/briefs/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(briefData),
            });
            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data.message || 'Failed to create brief');
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to create brief');
        }
    }
);

export const getBrief = createAsyncThunk(
    'brief/get',
    async (campaignId, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/briefs/${campaignId}`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data.message || 'Failed to fetch brief');
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch brief');
        }
    }
);

export const updateBrief = createAsyncThunk(
    'brief/update',
    async ({ id, sections }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/briefs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ sections }),
            });
            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data.message || 'Failed to update brief');
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update brief');
        }
    }
);

const briefSlice = createSlice({
    name: 'brief',
    initialState: {
        currentBrief: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearBrief: (state) => {
            state.currentBrief = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBrief.pending, (state) => {
                state.loading = true;
            })
            .addCase(createBrief.fulfilled, (state, action) => {
                state.loading = false;
                state.currentBrief = action.payload.brief;
            })
            .addCase(createBrief.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getBrief.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBrief.fulfilled, (state, action) => {
                state.loading = false;
                state.currentBrief = action.payload.brief;
            })
            .addCase(getBrief.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateBrief.fulfilled, (state, action) => {
                state.currentBrief = action.payload.brief;
            });
    },
});

export const { clearBrief } = briefSlice.actions;
export default briefSlice.reducer;

