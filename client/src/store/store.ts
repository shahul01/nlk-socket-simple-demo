import { configureStore } from '@reduxjs/toolkit';
import linkMockReducer from '../components/LinkMock/LinkMockSlice';

export const store = configureStore({
  reducer: {
    linkMock: linkMockReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
