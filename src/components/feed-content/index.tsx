import React from 'react';
import { FeedItem } from '../../types';
import { ListGroup } from 'react-bootstrap';
import ContentItem from './item';

type Props = {
  content: FeedItem[];
};

const FeedContent = ({ content }: Props) => {
  return (
    <ListGroup>
      {content.map((item) => (
        <ContentItem key={item.pubDate} item={item} />
      ))}
    </ListGroup>
  );
};

export default FeedContent;
