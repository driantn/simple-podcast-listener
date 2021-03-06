import React from 'react';
import { Media, ListGroup, Dropdown } from 'react-bootstrap';
import Parser from 'rss-parser';
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from 'react-router-dom';
import { FeedItem } from '../../types';
import Description from './styles';
import localDB from '../../utils/local-db';
import useData, { REMOVE_ITEM } from '../../store';
import { FEEDS, FEED_CONTENT } from '../../constants';

type Props = {
  item: FeedItem;
};

const FeedListItem = ({ item }: Props) => {
  const history = useHistory();
  const { dispatch } = useData();

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
    const feed: FeedItem | null = await localDB(FEEDS).getItem(id);
    if (!feed?.feedUrl) return;

    const parser = new Parser();
    const feedContent = await parser.parseURL(feed.feedUrl);
    const { items = [] } = feedContent;
    const cleanItems = items?.slice(0, 50).map((item) => ({
      id: item.guid || uuidv4(),
      title: item.title,
      mediaUrl: item?.enclosure?.url || '',
      pubDate: item.pubDate || '',
    }));
    await localDB(FEED_CONTENT).setItem(id, cleanItems);
  };

  const onDelete = async () => {
    await localDB(FEEDS).removeItem(id);
    await localDB(FEED_CONTENT).removeItem(id);
    dispatch({ type: REMOVE_ITEM, payload: { id } });
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
          <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic" />

          <Dropdown.Menu>
            <Dropdown.Item onClick={onOpenFeed}>Open Feed</Dropdown.Item>
            <Dropdown.Item onClick={onReloadFeed}>
              Reload Feed Content
            </Dropdown.Item>
            <Dropdown.Item onClick={onDelete}>Delete item</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Media>
    </ListGroup.Item>
  );
};

export default FeedListItem;
