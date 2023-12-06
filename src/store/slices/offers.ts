import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {DetailedOffer, Offer} from '../../contracts/contaracts.ts';
import {ThunkApi} from '../store-types.ts';
import {REQUEST_STATUS, ServerRoutes} from '../../constants/constants.ts';
import {changeFavoriteStatus} from './favorites.ts';

interface OffersState {
  offers: Offer[];
  selectedOffer?: DetailedOffer | null;
  nearOffers: Offer[];
  requestStatus: REQUEST_STATUS;

}

const initialState: OffersState = {
  offers: [],
  selectedOffer: null,
  nearOffers:[],
  requestStatus: REQUEST_STATUS.IDLE,
};

const fetchAllOffers = createAsyncThunk<Offer[], undefined, ThunkApi >(
  'fetchAllOffers',
  async (_arg, {extra: api}) => {
    const response = await api.get<Offer[]>('/offers');
    return response.data;
  }
);

const fetchOffer = createAsyncThunk<DetailedOffer, Offer['id'], ThunkApi>(
  'fetchOffer',
  async (offerId, {extra: api}) => {
    const response = await api.get<DetailedOffer>(`${ServerRoutes.offer}${offerId}`);
    return response.data;
  }
);

const fetchNearOffers = createAsyncThunk<Offer[], Offer['id'], ThunkApi>(
  'fetchNearOffers',
  async (offerId, {extra: api}) => {
    const response = await api.get<Offer[]>(`${ServerRoutes.offer}${offerId}${ServerRoutes.nearByOffers}`);
    return response.data;
  }
);

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers:{
    removeSelectedOffer: (state) => {
      state.selectedOffer = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllOffers.fulfilled,(state: OffersState, action: PayloadAction<Offer[]>) => {
      state.requestStatus = REQUEST_STATUS.FULFILLED;
      state.offers = action.payload;
    });
    builder.addCase(fetchAllOffers.pending,(state: OffersState) => {
      state.requestStatus = REQUEST_STATUS.PENDING;
    });
    builder.addCase(fetchAllOffers.rejected,(state: OffersState) => {
      state.requestStatus = REQUEST_STATUS.REJECTED;
    });
    builder.addCase(fetchOffer.fulfilled, (state: OffersState, action: PayloadAction<DetailedOffer>) => {
      state.requestStatus = REQUEST_STATUS.FULFILLED;
      state.selectedOffer = action.payload;
    });
    builder.addCase(fetchOffer.pending, (state: OffersState) => {
      state.requestStatus = REQUEST_STATUS.PENDING;
    });
    builder.addCase(fetchOffer.rejected, (state: OffersState) => {
      state.requestStatus = REQUEST_STATUS.REJECTED;
    });
    builder.addCase(fetchNearOffers.fulfilled, (state, action) => {
      state.requestStatus = REQUEST_STATUS.FULFILLED;
      state.nearOffers = action.payload;
    });
    builder.addCase(fetchNearOffers.rejected, (state) => {
      state.requestStatus = REQUEST_STATUS.REJECTED;
    });
    builder.addCase(fetchNearOffers.pending, (state) => {
      state.nearOffers = [];
      state.requestStatus = REQUEST_STATUS.PENDING;
    });
    builder.addCase(changeFavoriteStatus.fulfilled, (state, action) => {
      const offersElement = state.offers.find((el) => el.id === action.payload.id)!;
      const selectedOfferElement = (state.selectedOffer) ? state.selectedOffer : undefined;
      const nearOffersElement = state.nearOffers.find((el) => el.id === action.payload.id);

      if(offersElement) {
        offersElement.isFavorite = action.payload.isFavorite;
      }
      if(selectedOfferElement) {
        if (state.selectedOffer!.id === action.payload.id) {
          state.selectedOffer!.isFavorite = action.payload.isFavorite;
        }
      }
      if (nearOffersElement) {
        nearOffersElement.isFavorite = action.payload.isFavorite;
      }
      state.requestStatus = REQUEST_STATUS.FULFILLED;
    });
  }
});

export const offersReducer = offersSlice.reducer;
export const offersActions = offersSlice.actions;
export {offersSlice, fetchAllOffers, fetchOffer, fetchNearOffers};
export type {OffersState};
