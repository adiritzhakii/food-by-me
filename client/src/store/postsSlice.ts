import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPostBox } from '../components/PostBox';

interface PostsState {
  posts: IPostBox[];
  userPosts: IPostBox[];
}

const initialState: PostsState = {
  posts: [],
  userPosts: [],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<IPostBox[]>) => {
      state.posts = action.payload;
    },
    setUserPosts: (state, action: PayloadAction<IPostBox[]>) => {
      state.userPosts = action.payload;
    },
    addPost: (state, action: PayloadAction<IPostBox>) => {
      state.posts.unshift(action.payload);
      state.userPosts.unshift(action.payload);
    },
    updatePost: (state, action: PayloadAction<IPostBox>) => {
      const index = state.posts.findIndex(post => post._id === action.payload._id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
      const userIndex = state.userPosts.findIndex(post => post._id === action.payload._id);
      if (userIndex !== -1) {
        state.userPosts[userIndex] = action.payload;
      }
    },
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post._id !== action.payload);
      state.userPosts = state.userPosts.filter(post => post._id !== action.payload);
    },
  },
});

export const { addPost, setPosts, updatePost, deletePost, setUserPosts } = postsSlice.actions;
export default postsSlice.reducer;