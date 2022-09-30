import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ILinkMockState {
  clickedKeyRdx: string;
}

const initialState:ILinkMockState = {
  clickedKeyRdx: 'hello from redux'
};

export const linkMockSlice = createSlice({
  name: 'linkMock',
  initialState,
  reducers: {
    setClickedKeyRdx: (state, action: PayloadAction<string>) => {
      state.clickedKeyRdx += action.payload
    },
  },
});

export const { setClickedKeyRdx } = linkMockSlice.actions;

export default linkMockSlice.reducer;
