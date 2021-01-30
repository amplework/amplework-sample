import * as types from './types';
import { DEFAULT_LOCALE } from '@config/locale';
import _ from 'lodash';

const initialState = {
  posts: [],
  postsUpdated: null,
  interests: [],
  postDetail: null,
  postDetailUpdated: null,
  selfPosts: [],
  selfPostsUpdated: null
};

export default function communityReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_POST_LIST: {
      if (action.payload && action.payload.data && action.payload.status === 200) {
        return {
          ...state,
          posts: action.payload.data,
          postsUpdated: Date()
        }
      } else {
        return {
          ...state
        }
      }
    }
    case types.GET_SELF_POSTS_LIST: {
      if (action.payload && action.payload.data && action.payload.status === 200) {
        return {
          ...state,
          selfPosts: action.payload.data,
          selfPostsUpdated: Date()
        }
      } else {
        return {
          ...state
        }
      }
    }
    case types.SAVE_POST: {
      if (action.payload && action.payload.data && action.payload.status === 200) {
        let data = action.payload.data
        let postsArray = state.posts
        postsArray.splice(0, 0, data);
        
        return {
          ...state,
          posts: postsArray,
          postsUpdated: Date()
        }
      } else {
        return {
          ...state
        }
      }
    }
    case types.UPDATE_POST: {
      if (action.payload && action.payload.data && action.payload.status === 200) {
        let posts = state.posts;
        let { data } = action.payload;
        console.log('data upadte post: ', data);
        let index = _.findIndex(posts, c => c.id == data.id)
        
        if(index != -1) {
          posts[index] = data
        }
        

        let postDetailLocal = state.postDetail
        console.log('postDetailLocal update post: ', postDetailLocal);
        
        if(postDetailLocal && postDetailLocal.id == data.id) {
          postDetailLocal = data
        }

        let selfPosts = state.selfPosts;
        let indexSelf = _.findIndex(selfPosts, c => c.id == data.id)
        if(indexSelf != -1) {
          selfPosts[indexSelf] = data
        }

        return {
          ...state,
          posts: posts,
          postsUpdated: Date(),
          selfPosts: selfPosts,
          selfPostsUpdated: (indexSelf != -1) ? Date() : state.selfPostsUpdated,
          postDetail: (postDetailLocal && postDetailLocal.id == data.id) ? postDetailLocal : null,
          postDetailUpdated: (postDetailLocal && postDetailLocal.id == data.id) ? Date() : state.postDetailUpdated,
        }
      } else {
        return {
          ...state
        }
      }
    }
    case types.DELETE_POST: {
      if (action.payload && action.payload.status === 204) {
        let deletedId = action.payload.id
        let postsArray = state.posts.filter(item => item.id !== deletedId)
        return {
          ...state,
          posts: postsArray,
          postsUpdated: Date()
        }
      } else {
        return {
          ...state
        }
      }
    }
    case types.GET_INTERESTS_LIST: {
      if (action.payload && action.payload.data && action.payload.status === 200) {
        return {
          ...state,
          interests: action.payload.data
        }
      } else {
        return {
          ...state
        }
      }
    }
    case types.LIKE_POST: {
      if (action.payload && action.payload.status === 200) {
        let posts = state.posts;
        let { data } = action.payload;
        let index = _.findIndex(posts, p => p.id == data.postId)
        if(index !== -1) {
          posts[index].isLiked = true;
          posts[index].likes = posts[index].likes + 1;
          posts[index].like = data
        }

        var postDetailLcl = state.postDetail
        if(postDetailLcl && postDetailLcl.id == data.postId) {
          postDetailLcl.isLiked = true;
          postDetailLcl.likes = postDetailLcl.likes + 1;
          postDetailLcl.like = data
        }
        
        let selfPosts = state.selfPosts;
        
        let indexSelf = _.findIndex(selfPosts, p => p.id == data.postId)
        
        if(indexSelf !== -1) {
          selfPosts[indexSelf].isLiked = true;
          selfPosts[indexSelf].likes = selfPosts[indexSelf].likes + 1;
          selfPosts[indexSelf].like = data
        }

        return {
          ...state,
          posts: posts,
          selfPosts: selfPosts,
          selfPostsUpdated: (indexSelf != -1) ? Date() : state.selfPostsUpdated,
          postDetail: (postDetailLcl && postDetailLcl.id == data.postId) ? postDetailLcl : null,
          postDetailUpdated: (postDetailLcl && postDetailLcl.id == data.postId) ? Date() : state.postDetailUpdated,
          postsUpdated: Date()
        }
      } else {
        return {
          ...state
        }
      }
    }
    case types.UNLIKE_POST: {
      if (action.payload && action.payload.status === 204) {
        let posts = state.posts;
        let { id } = action.payload;
        let index = _.findIndex(posts, p => p.id == id)

        if(index !== -1) {
          posts[index].isLiked = false;
          posts[index].likes = posts[index].likes - 1;
          delete posts[index].like
        }

        let postDetailUpdated = state.postDetail
        if(postDetailUpdated && postDetailUpdated.id == id) {
          postDetailUpdated.isLiked = false;
          postDetailUpdated.likes = (postDetailUpdated.likes > 0) ? postDetailUpdated.likes - 1 : 0;
          delete postDetailUpdated.like
        }

        let selfPosts = state.selfPosts;
        let indexSelf = _.findIndex(selfPosts, p => p.id == id)

        if(indexSelf !== -1) {
          selfPosts[indexSelf].isLiked = false;
          selfPosts[indexSelf].likes = (selfPosts[indexSelf].likes > 0) ? selfPosts[indexSelf].likes - 1 : 0;
          delete selfPosts[indexSelf].like
        }
        
        return {
          ...state,
          posts: posts,
          selfPosts: selfPosts,
          selfPostsUpdated: (indexSelf != -1) ? Date() : state.selfPostsUpdated,
          postsUpdated: Date(),
          postDetail: (postDetailUpdated && postDetailUpdated.id == id) ? postDetailUpdated : null,
          postDetailUpdated: (postDetailUpdated && postDetailUpdated.id == id) ? Date() : state.postDetailUpdated,
        }
      } else {
        return {
          ...state
        }
      }
    }
    case types.POST_COMMENT: {
      if (action.payload && action.payload.status === 200) {
        let posts = state.posts;
        let { data } = action.payload;
        
        let index = _.findIndex(posts, p => p.id == data.postId)
        
        if(index !== -1) {
          posts[index].comments = _.union(posts[index].comments, [data]) //[...posts[index].comments, data]
        }

        let postDetailUpdated = state.postDetail
        if(postDetailUpdated && postDetailUpdated.id == data.postId) {
          postDetailUpdated.comments = _.union(postDetailUpdated.comments, [data]) //[...postDetailUpdated.comments, data]
        }

        let selfPosts = state.selfPosts;
        
        let indexSelf = _.findIndex(selfPosts, p => p.id == data.postId)
        
        if(indexSelf !== -1) {
          selfPosts[indexSelf].comments = _.union(selfPosts[indexSelf].comments, [ data ]) //[...selfPosts[indexSelf].comments, data]
        }
        
        return {
          ...state,
          posts: posts,
          selfPosts: selfPosts,
          selfPostsUpdated: (indexSelf != -1) ? Date() : state.selfPostsUpdated,
          postsUpdated: Date(),
          postDetail: (postDetailUpdated && postDetailUpdated.id == data.postId) ? postDetailUpdated : null,
          postDetailUpdated: (postDetailUpdated && postDetailUpdated.id == data.postId) ? Date() : state.postDetailUpdated,
        }
      } else {
        return {
          ...state
        }
      }
    }
    case types.GET_POST_DETAILS: {
      if (action.payload && action.payload.data && action.payload.status === 200) {
        let { data } = action.payload;
        return {
          ...state,
          postDetail: data,
          postDetailUpdated: Date()
        }
      } else {
        return {
          ...state
        }
      }
    }
    case types.REMOVE_POST_DETAILS: {
      if(action.payload) {
        return {
          ...state,
          postDetail: null,
          postDetailUpdated: Date()
        }
      } else {
        return {
          ...state,
        }
      }
    }
    case types.LOGOUT_USER: {
      return initialState
    }
    default: {
      return {
        ...state
      };
    }
  }
}