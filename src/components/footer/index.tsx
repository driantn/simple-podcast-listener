import React, { useState, useEffect } from 'react';
import Parser from 'rss-parser';
import { v4 as uuidv4 } from 'uuid';
import { useLocation, useHistory } from 'react-router-dom';
import {
  Button,
  Navbar,
  Modal,
  InputGroup,
  FormControl,
  Media,
  Alert,
} from 'react-bootstrap';
import isValidUrl from '../../utils/url-validator';
import localDB from '../../utils/local-db';
import { FeedItem } from '../../types';
import useData, { ADD_ITEM } from '../../store';
import { FEEDS, FEED_CONTENT } from '../../constants';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Footer = () => {
  const { dispatch } = useData();
  const [show, setShow] = useState(false);
  const onModalAction = () => {
    setShow(!show);
    setFeed(null);
  };
  const [feed, setFeed] = useState<FeedItem | null>(null);
  const [error, setError] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const query: any = useQuery();
  const history = useHistory();

  const onUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!isValidUrl(value)) return;
    setUrlValue(value);
  };

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFeed({ ...(feed as FeedItem), title: value });
  };

  const onSave = async () => {
    const { items, id, ...rest } = feed as FeedItem;
    await localDB(FEEDS).setItem(id, { ...rest });
    const cleanItems = items?.slice(0, 50).map((item) => ({
      id: item.guid || uuidv4(),
      title: item.title,
      mediaUrl: item.enclosure.url || '',
      pubDate: item.pubDate || '',
    }));
    await localDB(FEED_CONTENT).setItem(id, cleanItems);
    dispatch({ type: ADD_ITEM, payload: { id, ...rest } });
    onModalAction();
  };

  const onLoad = async () => {
    let parser = new Parser();
    let resp;
    try {
      resp = await parser.parseURL(urlValue);
    } catch (err) {
      setError(true);
      setFeed(null);
      setTimeout(() => setError(false), 5000);
      return;
    }

    const {
      title = '',
      description = '',
      items = [],
      image,
      feedUrl = urlValue,
      link = '',
    } = resp;

    setFeed({ id: uuidv4(), title, description, items, image, feedUrl, link });
  };

  useEffect(() => {
    if (query && query.get('quickAdd')) {
      query.delete('quickAdd');
      history.replace({
        search: query.toString(),
      });
      onModalAction();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Navbar fixed="bottom" style={{ maxWidth: '400px', margin: 'auto' }}>
      <Button variant="outline-light" block onClick={onModalAction}>
        Add
      </Button>
      <Modal show={show} onHide={onModalAction}>
        <Modal.Header closeButton>
          <Modal.Title>Add new feed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Paste rss feed url"
              aria-label="rss feed"
              aria-describedby="basic-addon2"
              onChange={onUrlChange}
            />
            <InputGroup.Append>
              <Button variant="outline-secondary" onClick={onLoad}>
                Load
              </Button>
            </InputGroup.Append>
          </InputGroup>
          {error && <Alert variant="danger">Something went wrong.</Alert>}
          {feed?.title && (
            <Media>
              <img
                width={64}
                height={64}
                className="mr-3"
                src={feed?.image?.url}
                alt={feed?.title}
              />
              <Media.Body>
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Feed title"
                    aria-label="rss feed"
                    aria-describedby="basic-addon2"
                    onChange={onTitleChange}
                    value={feed?.title}
                  />
                </InputGroup>
                <p>{feed?.description}</p>
              </Media.Body>
            </Media>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={onSave} disabled={!feed}>
            Save Feed
          </Button>
        </Modal.Footer>
      </Modal>
    </Navbar>
  );
};

export default Footer;
