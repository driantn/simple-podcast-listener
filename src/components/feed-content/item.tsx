import React, { useState, useRef, useEffect } from 'react';
import { FeedItem } from '../../types';
import { ListGroup, Media, Button } from 'react-bootstrap';
import Progress from './styles';

type Props = {
  item: FeedItem;
};

const pause = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    width="25"
    height="25"
    className="bi bi-pause-circle"
    viewBox="0 0 16 16"
  >
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
    <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z" />
  </svg>
);

const play = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="25"
    height="25"
    fill="currentColor"
    className="bi bi-play-circle"
    viewBox="0 0 16 16"
  >
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
    <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
  </svg>
);

const ContentItem = ({ item }: Props) => {
  const audioRef = useRef(new Audio());
  const intervalRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const startTimer = () => {
    intervalRef.current = window.setInterval(() => {
      const { duration, ended, currentTime } = audioRef.current;

      if (!ended) {
        const currentPercentage = duration ? (currentTime / duration) * 100 : 0;
        setProgress(Number(currentPercentage.toFixed(2)));
      }
    }, 60 * 1000);
  };

  const onClick = () => {
    if (!isPlaying) {
      if (!audioRef.current.src)
        audioRef.current.src = item.enclosure ? item.enclosure.url : '';
      audioRef.current.play();
      audioRef.current.addEventListener('loadedmetadata', () => {
        startTimer();
      });
    } else {
      clearInterval(intervalRef.current);
      audioRef.current.pause();
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const player = audioRef.current;
    return () => {
      clearInterval(intervalRef.current);
      player.pause();
    };
  }, []);

  return (
    <ListGroup.Item key={item.pubDate}>
      <Progress progress={progress} />
      <Media className="position-relative">
        <Button className="m-2" variant="secondary" onClick={onClick}>
          {!isPlaying ? play : pause}
        </Button>
        <Media.Body>
          <h5>{item.title}</h5>
          <p>{new Date(item.pubDate || '').toDateString()}</p>
        </Media.Body>
      </Media>
    </ListGroup.Item>
  );
};

export default ContentItem;
