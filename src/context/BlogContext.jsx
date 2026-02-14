import { createContext, useContext, useReducer, useCallback } from 'react';
import * as storage from '../services/storage';

const BlogContext = createContext(null);

const initialState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
};

function blogReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_POSTS':
      return { ...state, loading: false, posts: action.payload, error: null };
    case 'SET_CURRENT_POST':
      return { ...state, loading: false, currentPost: action.payload, error: null };
    case 'CLEAR_CURRENT_POST':
      return { ...state, currentPost: null };
    case 'ADD_POST':
      return { ...state, loading: false, posts: [action.payload, ...state.posts] };
    case 'UPDATE_POST':
      return {
        ...state,
        loading: false,
        posts: state.posts.map((p) => (p.id === action.payload.id ? action.payload : p)),
        currentPost: state.currentPost?.id === action.payload.id ? action.payload : state.currentPost,
      };
    case 'DELETE_POST':
      return {
        ...state,
        loading: false,
        posts: state.posts.filter((p) => p.id !== action.payload),
        currentPost: state.currentPost?.id === action.payload ? null : state.currentPost,
      };
    default:
      return state;
  }
}

export function BlogProvider({ children }) {
  const [state, dispatch] = useReducer(blogReducer, initialState);

  const loadPosts = useCallback((publishedOnly = false) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      const posts = storage.fetchPosts(publishedOnly);
      dispatch({ type: 'SET_POSTS', payload: posts });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const loadPost = useCallback((id, publishedOnly = false) => {
    dispatch({ type: 'SET_LOADING' });
    const post = storage.fetchPost(id, publishedOnly);
    if (post) {
      dispatch({ type: 'SET_CURRENT_POST', payload: post });
      return post;
    } else {
      dispatch({ type: 'SET_ERROR', payload: 'Post not found' });
      return null;
    }
  }, []);

  const createPost = useCallback((postData) => {
    try {
      const post = storage.createPost(postData);
      dispatch({ type: 'ADD_POST', payload: post });
      return post;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const updatePost = useCallback((id, postData) => {
    try {
      const post = storage.updatePost(id, postData);
      dispatch({ type: 'UPDATE_POST', payload: post });
      return post;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const deletePost = useCallback((id) => {
    try {
      storage.deletePost(id);
      dispatch({ type: 'DELETE_POST', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const clearCurrentPost = useCallback(() => {
    dispatch({ type: 'CLEAR_CURRENT_POST' });
  }, []);

  const value = {
    ...state,
    loadPosts,
    loadPost,
    createPost,
    updatePost,
    deletePost,
    clearCurrentPost,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}

export function useBlog() {
  const context = useContext(BlogContext);
  if (!context) throw new Error('useBlog must be used within a BlogProvider');
  return context;
}
