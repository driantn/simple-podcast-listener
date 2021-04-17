import React from 'react';
import { Media, ListGroup, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { FeedItem } from '../../../types';
import Description from './styles';

type Props = {
  item: FeedItem;
};

const arrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="25"
    fill="currentColor"
    className="bi bi-arrow-right-square"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"
    />
  </svg>
);

const FeedListItem = ({ item }: Props) => {
  const history = useHistory();

  if (!item) return null;
  const { id, title, description, image, link } = item;

  const onClick = () => {
    history.push(`/feed/${id}`);
  };

  const onArrowClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(link, '_blank');
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
        <Button className="m-2" variant="secondary" onClick={onArrowClick}>
          {arrow}
        </Button>
      </Media>
    </ListGroup.Item>
  );
};

export default FeedListItem;
