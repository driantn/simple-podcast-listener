import React from 'react';
import { Media, ListGroup, Dropdown } from 'react-bootstrap';
import Parser from 'rss-parser';
import { useHistory } from 'react-router-dom';
import { FeedItem } from '../../../types';
import Description from './styles';
import localDB from '../../../utils/local-db';

type Props = {
  item: FeedItem;
};

const FeedListItem = ({ item }: Props) => {
  const history = useHistory();

  if (!item) return null;
  const { id, title, description, image, link } = item;

  const onClick = () => {
    history.push(`/feed/${id}`);
  };

  const onDropDownClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onOpenFeed = (e: React.MouseEvent) => {
    window.open(link, '_blank');
  };

  const onReloadFeed = async () => {
    const feed: FeedItem | null = await localDB('feeds').getItem(id);
    if (!feed?.feedUrl) return;

    const parser = new Parser();
    const feedContent = await parser.parseURL(feed.feedUrl);
    const { items } = feedContent;
    await localDB('feedContent').setItem(id, items?.slice(0, 50));
  };

  return (
    <ListGroup.Item onClick={onClick}>
      <Media>
        <img
          width={64}
          height={64}
          className="mr-3"
          src={image?.url}
          alt={title}
        />
        <Media.Body>
          <h5>{title}</h5>
          <Description>{description}</Description>
        </Media.Body>
        <Dropdown onClick={onDropDownClick}>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic" />

          <Dropdown.Menu>
            <Dropdown.Item onClick={onOpenFeed}>Open Feed</Dropdown.Item>
            <Dropdown.Item onClick={onReloadFeed}>
              Reload Feed Content
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Media>
    </ListGroup.Item>
  );
};

export default FeedListItem;
