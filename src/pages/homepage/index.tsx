import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Footer from '../../components/footer';
import List from '../../components/feed-list';
import useData, { loadInitialFeeds } from '../../store';

const Homepage = () => {
  const { state, dispatch } = useData();

  useEffect(() => {
    loadInitialFeeds(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container fluid="md">
      <Footer />
      <List items={state.feeds} />
    </Container>
  );
};

export default Homepage;
