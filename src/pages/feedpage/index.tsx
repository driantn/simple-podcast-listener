import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import useData, { loadFeedContent } from '../../store';
import FeedContent from '../../components/feed-content';

const FeedPage = () => {
  const { id } = useParams() as any;
  const { state, dispatch } = useData();

  useEffect(() => {
    loadFeedContent(dispatch, id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container fluid="md">
      <FeedContent content={state.feedContent} />
    </Container>
  );
};

export default FeedPage;
