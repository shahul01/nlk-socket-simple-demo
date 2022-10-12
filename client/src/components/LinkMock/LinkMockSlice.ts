import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ILinkMockState {
  clickedKeyRdx: string;
  isCurrentRef: boolean;
  keyAxes: object;
  sentLetter: {
    letter: string;
  };
  keyClickCount: number;
}

const initialState:ILinkMockState = {
  clickedKeyRdx: '', // COMMT: why?
  isCurrentRef: false,
  keyAxes: {},
  sentLetter: {
    letter: '',
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
    setSentLetter: (state, action) => {
      state.sentLetter.letter = action.payload?.letter;
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
  setSentLetter,
  incrementKeyClickCount

} = linkMockSlice.actions;

export default linkMockSlice.reducer;
