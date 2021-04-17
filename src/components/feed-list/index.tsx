import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { FeedItem } from '../../types';
import ListItem from './item';

type Props = {
  items: FeedItem[];
};

const FeedList = ({ items }: Props) => {
  if (!items.length) return null;
  return (
    <ListGroup>
      {items.map((item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </ListGroup>
  );
};

export default FeedList;
