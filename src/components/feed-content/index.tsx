import React from 'react';
import { FeedItem } from '../../types';
import { ListGroup } from 'react-bootstrap';
import ContentItem from './item';

type Props = {
  content: FeedItem[];
  id: string;
};

const FeedContent = ({ content, id }: Props) => {
  return (
    <ListGroup>
      {content.map((item) => (
        <ContentItem feedId={id} key={item.pubDate} item={item} />
      ))}
    </ListGroup>
  );
};

export default FeedContent;
