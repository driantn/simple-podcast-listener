import React, { useContext } from 'react';
import localDB from '../utils/local-db';
import { FeedItem } from '../types';

type Action = { type: string; payload?: any } | any;
type State = { feeds: FeedItem[]; feedContent: FeedItem[] };
type Dispatch = (action: Action) => void;

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
    case 'addItem': {
      return { ...state, feeds: [...state.feeds, payload] };
    }
    case 'loadFeeds': {
      return { ...state, feeds: payload };
    }
    case 'loadFeedContent':
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
    throw new Error('useData must be used within a CountProvider');
  }
  return contextValues;
};

export const loadInitialFeeds = (dispatch: Dispatch) => {
  const data: FeedItem[] = [];
  localDB('feeds')
    .iterate((value: FeedItem, key) => {
      data.push({ ...value, id: key });
    })
    .then(() => dispatch({ type: 'loadFeeds', payload: data }));
};

export const loadFeedContent = (dispatch: Dispatch, feedId: string) => {
  localDB('feedContent')
    .getItem(feedId)
    .then((data) => dispatch({ type: 'loadFeedContent', payload: data }));
};

export default useData;
