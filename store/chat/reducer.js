import * as types from './types';
import _ from 'lodash';

const initialState = {
  chats: [],
  chatsUpdated: null,
};

export default function notificationReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_CHAT_LIST: {
      if (action.payload && action.payload.data && action.payload.status === 200) {
        let chats = (action.payload.data && action.payload.data.length > 0) ? action.payload.data : state.chats
        
        return {
          ...state,
          chats: chats,
          chatsUpdated: Date()
        }
      } else {
        return {
          ...state
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