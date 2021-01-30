import * as types from './types'
import { chatApi } from '../../services/api'

export function getChatList(senderId) {
  return {
    type: types.GET_CHAT_LIST,
    payload: chatApi.getChatList(senderId)
  }
}

export function logoutUser() {
  return {
    type: types.LOGOUT_USER,
    payload: true
  }
}