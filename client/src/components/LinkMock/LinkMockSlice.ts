import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ILinkMockState {
  clickedKeyRdx: string;
  isCurrentRef: boolean;
  keyAxes: object;
  sentText: {
    currLetter: string;
  };
  keyClickCount: number;
}

const initialState:ILinkMockState = {
  clickedKeyRdx: '', // COMMT: why?
  isCurrentRef: false,
  keyAxes: {},
  sentText: {
    currLetter: '',
  },
  keyClickCount: 0
};

export const linkMockSlice = createSlice({
  name: 'linkMock',
  initialState,
  reducers: {
    setClickedKeyRdx: (state, action: PayloadAction<string>) => {
      state.clickedKeyRdx += action.payload
    },
    toggleIsCurrentRef: state => {
      state.isCurrentRef = !state.isCurrentRef;
    },
    setKeyAxes: (state, action) => {
      state.keyAxes = action.payload;
    },
    setSentText: (state, action) => {
      state.sentText.currLetter = action.payload?.currLetter;
    },
    incrementKeyClickCount: state => {
      state.keyClickCount += 1;
    }
  },
});

export const {
  setClickedKeyRdx,
  toggleIsCurrentRef,
  setKeyAxes,
  setSentText,
  incrementKeyClickCount

} = linkMockSlice.actions;

export default linkMockSlice.reducer;
