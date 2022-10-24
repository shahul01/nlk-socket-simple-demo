import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IKeyAxes } from '../../types/global';

export interface ILinkMockState {
  clickedKeyRdx: string;
  isCurrentRef: boolean;
  keyAxes: IKeyAxes;
  sentLetter: {
    letter: string;
  };
  keyClickCount: number;
}

const initialState:ILinkMockState = {
  clickedKeyRdx: '', // COMMT: why?
  isCurrentRef: false,
  keyAxes: {
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    forceUpdate: 0,
  },
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
