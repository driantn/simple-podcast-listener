import React, { useContext } from 'react';
import localDB from '../utils/local-db';
import { FeedItem } from '../types';
import { FEEDS, FEED_CONTENT } from '../constants';

type Action = { type: string; payload?: any } | any;
type State = { feeds: FeedItem[]; feedContent: FeedItem[] };
type Dispatch = (action: Action) => void;

export const ADD_ITEM = 'addItem';
export const REMOVE_ITEM = 'removeItem';
export const LOAD_FEEDS = 'loadFeeds';
export const LOAD_FEED_CONTENT = 'loadFeedContent';

const initialState: State = {
  feeds: [],
  feedContent: [],
};

const context = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const StateReducer = (state: State, action: Action): State => {
  const { type, payload } = action;
  switch (type) {
    case ADD_ITEM: {
      return { ...state, feeds: [...state.feeds, payload] };
    }
    case REMOVE_ITEM: {
      return {
        ...state,
        feeds: state.feeds.filter((item) => item.id !== payload.id),
      };
    }
    case LOAD_FEEDS: {
      return { ...state, feeds: payload };
    }
    case LOAD_FEED_CONTENT:
      return { ...state, feedContent: payload };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

export const DataProvider = ({ children }: any) => {
  const [state, dispatch] = React.useReducer(StateReducer, initialState);
  return (
    <context.Provider value={{ state, dispatch }}>{children}</context.Provider>
  );
};

const useData = () => {
  const contextValues = useContext(context);
  if (contextValues === undefined) {
    throw new Error('useData must be used within DataProvider');
  }
  return contextValues;
};

export const loadInitialFeeds = (dispatch: Dispatch) => {
  const data: FeedItem[] = [];
  localDB(FEEDS)
    .iterate((value: FeedItem, key) => {
      data.push({ ...value, id: key });
    })
    .then(() => dispatch({ type: LOAD_FEEDS, payload: data }));
};

export const loadFeedContent = (dispatch: Dispatch, feedId: string) => {
  localDB(FEED_CONTENT)
    .getItem(feedId)
    .then((data) => dispatch({ type: LOAD_FEED_CONTENT, payload: data ?? [] }));
};

export default useData;
