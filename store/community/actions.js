import * as types from './types';
import {communityApis} from '../../services/api';
import {type} from 'ramda';

export function getPostsList(data) {
  return {
    type: types.GET_POST_LIST,
    payload: communityApis.getPostsList(data),
  };
}

export function savePost(data) {
  return {
    type: types.SAVE_POST,
    payload: communityApis.savePost(data),
  };
}

export function updatePost(id, data) {
  return {
    type: types.UPDATE_POST,
    payload: communityApis.updatePost(id, data),
  };
}

export function deletePost(id) {
  return {
    type: types.DELETE_POST,
    payload: communityApis.deletePost(id),
  };
}

export function getInterestsList() {
  return {
    type: types.GET_INTERESTS_LIST,
    payload: communityApis.getInterestsList(),
  };
}

export function getPostByUserId() {
  return {
    type: types.GET_SELF_POSTS_LIST,
    payload: communityApis.getPostByUserId(),
  };
}

export function likePost(data) {
  return {
    type: types.LIKE_POST,
    payload: communityApis.likePost(data),
  };
}

export function unlikePost(id, postId) {
  return {
    type: types.UNLIKE_POST,
    payload: communityApis.unlikePost(id, postId),
  };
}

export function getPostDetails(postId) {
  return {
    type: types.GET_POST_DETAILS,
    payload: communityApis.getPostDetails(postId),
  };
}

export function removePostDetail() {
  return {
    type: types.REMOVE_POST_DETAILS,
    payload: true,
  };
}

export function postComment(data) {
  return {
    type: types.POST_COMMENT,
    payload: communityApis.postComment(data),
  };
}

export function logoutUser() {
  return {
    type: types.LOGOUT_USER,
    payload: true,
  };
}
