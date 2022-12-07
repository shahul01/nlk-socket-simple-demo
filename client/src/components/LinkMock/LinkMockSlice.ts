import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IKeyAxes } from '../../types/global';

export interface ILinkMockState {
  isAuto: boolean;
  isCurrentRef: boolean;
  keyAxes: IKeyAxes;
  clickedKeyRdx: {
    key: string;
  }
  cursorSpeed: number;
  keyClickCount: number;
}

// COMMT: why clickedKeyRdx: to pass clickedKey to itself (LinkMock) and other components like Keyboard
// COMMT: cursorSpeed - less num increases speed.
const initialState:ILinkMockState = {
  isAuto: false,
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
  clickedKeyRdx: {
    key: '',
  },
  cursorSpeed: 30,
  keyClickCount: 0,
};

export const linkMockSlice = createSlice({
  name: 'linkMock',
  initialState,
  reducers: {
    setIsAuto: (state, action) => {
      state.isAuto = action.payload;
    },
    toggleIsCurrentRef: state => {
      state.isCurrentRef = !state.isCurrentRef;
    },
    setKeyAxes: (state, action) => {
      state.keyAxes = action.payload;
    },
    setClickedKeyRdx: (state, action: PayloadAction<{key:string}>) => {
      state.clickedKeyRdx.key = action.payload?.key
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
  incrementKeyClickCount,
  setIsAuto

} = linkMockSlice.actions;

export default linkMockSlice.reducer;
