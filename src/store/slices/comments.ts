import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Comment, CommentData, Offer} from '../../contracts/contaracts.ts';
import {REQUEST_STATUS, ServerRoutes} from '../../constants/constants.ts';
import {ThunkApi} from '../store-types.ts';

interface CommentsState {
  comments: Comment[];
  requestStatus: REQUEST_STATUS;
}

const initialState: CommentsState = {
  comments: [],
  requestStatus: REQUEST_STATUS.IDLE
};

const fetchComments = createAsyncThunk<Comment[], Offer['id'], ThunkApi>(
  'fetchComments',
  async (offerId, {extra: api}) => {
    const response = await api.get<Comment[]>(`${ServerRoutes.comments}${offerId}`);
    return response.data;
  }
);

const sendComment = createAsyncThunk<Comment, { comment: CommentData; offerId: Offer['id'] }, ThunkApi>(
  'sendComment',
  async ({comment,offerId}, {extra: api}) => {
    const response = await api.post<Comment>(`${ServerRoutes.comments}${offerId}`,comment);
    return response.data;
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchComments.fulfilled, (state: CommentsState, action: PayloadAction<Comment[]>) => {
      state.comments = action.payload;
      state.requestStatus = REQUEST_STATUS.FULFILLED;
    });
    builder.addCase(fetchComments.rejected, (state: CommentsState) => {
      state.requestStatus = REQUEST_STATUS.REJECTED;
    });
    builder.addCase(fetchComments.pending, (state: CommentsState) => {
      state.comments = [];
      state.requestStatus = REQUEST_STATUS.PENDING;

    });
    builder.addCase(sendComment.fulfilled, (state, action: PayloadAction<Comment>) => {
      state.comments.push(action.payload);
      state.requestStatus = REQUEST_STATUS.FULFILLED;
    });
    builder.addCase(sendComment.rejected, (state) => {
      state.requestStatus = REQUEST_STATUS.REJECTED;
    });
    builder.addCase(sendComment.pending, (state) => {
      state.requestStatus = REQUEST_STATUS.PENDING;
    });
  }
});

export const commentsReducer = commentsSlice.reducer;
export {commentsSlice, fetchComments, sendComment};

export type {CommentsState};
