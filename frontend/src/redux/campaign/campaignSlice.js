import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = '/backend';

export const createCampaign = createAsyncThunk(
    'campaign/create',
    async (campaignData, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/campaigns/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(campaignData),
            });
            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data.message || 'Failed to create campaign');
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to create campaign');
        }
    }
);

export const getCampaigns = createAsyncThunk(
    'campaign/getAll',
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/campaigns/list`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data.message || 'Failed to fetch campaigns');
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch campaigns');
        }
    }
);

export const getCampaign = createAsyncThunk(
    'campaign/getOne',
    async (id, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/campaigns/${id}`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data.message || 'Failed to fetch campaign');
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch campaign');
        }
    }
);

export const updateCampaign = createAsyncThunk(
    'campaign/update',
    async ({ id, updates }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/campaigns/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(updates),
            });
            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data.message || 'Failed to update campaign');
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to update campaign');
        }
    }
);

export const assignCreators = createAsyncThunk(
    'campaign/assignCreators',
    async ({ id, creatorIds }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/campaigns/${id}/assign-creators`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ creatorIds }),
            });
            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data.message || 'Failed to assign creators');
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to assign creators');
        }
    }
);

export const acknowledgeBrief = createAsyncThunk(
    'campaign/acknowledgeBrief',
    async (id, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/campaigns/${id}/acknowledge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({}),
            });
            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data.message || 'Failed to acknowledge brief');
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to acknowledge brief');
        }
    }
);

const campaignSlice = createSlice({
    name: 'campaign',
    initialState: {
        campaigns: [],
        currentCampaign: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentCampaign: (state) => {
            state.currentCampaign = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCampaign.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCampaign.fulfilled, (state, action) => {
                state.loading = false;
                state.campaigns.unshift(action.payload.campaign);
            })
            .addCase(createCampaign.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getCampaigns.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCampaigns.fulfilled, (state, action) => {
                state.loading = false;
                state.campaigns = action.payload.campaigns;
            })
            .addCase(getCampaigns.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getCampaign.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCampaign.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCampaign = action.payload.campaign;
            })
            .addCase(getCampaign.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateCampaign.fulfilled, (state, action) => {
                const index = state.campaigns.findIndex(c => c._id === action.payload.campaign._id);
                if (index !== -1) {
                    state.campaigns[index] = action.payload.campaign;
                }
                if (state.currentCampaign?._id === action.payload.campaign._id) {
                    state.currentCampaign = action.payload.campaign;
                }
            })
            .addCase(assignCreators.fulfilled, (state, action) => {
                if (state.currentCampaign?._id === action.payload.campaign._id) {
                    state.currentCampaign = action.payload.campaign;
                }
            });
    },
});

export const { clearCurrentCampaign, clearError } = campaignSlice.actions;
export default campaignSlice.reducer;

