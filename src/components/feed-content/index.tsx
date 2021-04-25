import React from 'react';
import { SavedFeedItem } from '../../types';
import { ListGroup } from 'react-bootstrap';
import ContentItem from './item';

type Props = {
  content: SavedFeedItem[];
  id: string;
};

const FeedContent = ({ content, id }: Props) => {
  return (
    <ListGroup>
      {content.map((item) => (
        <ContentItem feedId={id} key={item.id} item={item} />
      ))}
    </ListGroup>
  );
};

export default FeedContent;
