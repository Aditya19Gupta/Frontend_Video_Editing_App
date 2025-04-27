
import { configureStore } from '@reduxjs/toolkit';
import videoEditorReducer from './videoEditorSlice';

export const store = configureStore({
  reducer: {
    videoEditor: videoEditorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
