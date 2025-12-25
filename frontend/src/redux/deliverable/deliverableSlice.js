import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = '/backend';

export const createDeliverable = createAsyncThunk(
    'deliverable/create',
    async (deliverableData, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/deliverables/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(deliverableData),
            });
            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data.message || 'Failed to create deliverable');
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to create deliverable');
        }
    }
);

export const getDeliverables = createAsyncThunk(
    'deliverable/getAll',
    async (campaignId, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/deliverables/campaign/${campaignId}`, {
                credentials: 'include',
            });
            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data.message || 'Failed to fetch deliverables');
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch deliverables');
        }
    }
);

export const submitDraft = createAsyncThunk(
    'deliverable/submitDraft',
    async ({ id, draftData }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/deliverables/${id}/submit-draft`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(draftData),
            });
            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data.message || 'Failed to submit draft');
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to submit draft');
        }
    }
);

export const submitPostProof = createAsyncThunk(
    'deliverable/submitPostProof',
    async ({ id, postData }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/deliverables/${id}/submit-post`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(postData),
            });
            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data.message || 'Failed to submit post proof');
            }
            return data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to submit post proof');
        }
    }
);

const deliverableSlice = createSlice({
    name: 'deliverable',
    initialState: {
        deliverables: [],
        currentDeliverable: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearDeliverables: (state) => {
            state.deliverables = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDeliverables.fulfilled, (state, action) => {
                state.deliverables = action.payload.deliverables;
            })
            .addCase(submitDraft.fulfilled, (state, action) => {
                const index = state.deliverables.findIndex(d => d._id === action.payload.deliverable._id);
                if (index !== -1) {
                    state.deliverables[index] = action.payload.deliverable;
                }
            })
            .addCase(submitPostProof.fulfilled, (state, action) => {
                const index = state.deliverables.findIndex(d => d._id === action.payload.deliverable._id);
                if (index !== -1) {
                    state.deliverables[index] = action.payload.deliverable;
                }
            });
    },
});

export const { clearDeliverables } = deliverableSlice.actions;
export default deliverableSlice.reducer;

