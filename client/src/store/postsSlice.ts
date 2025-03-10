import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {IPostBox} from '../components/PostBox'

interface PostsState {
    posts: IPostBox[];
  }

const initialState: PostsState = {
    posts: [],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<IPostBox[]>) => {
        state.posts = action.payload; 
    },
    addPost: (state, action: PayloadAction<IPostBox>) => {
      state.posts.unshift(action.payload)
    },
  },
});

export const { addPost, setPosts } = postsSlice.actions;
export default postsSlice.reducer;