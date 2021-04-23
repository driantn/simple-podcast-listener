import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ListGroup, Media, Button } from 'react-bootstrap';
import { FeedItem, FeedStatus } from '../../types';
import localDB from '../../utils/local-db';
import Progress from './styles';

type Props = {
  item: FeedItem;
  feedId: string;
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

const ContentItem = ({ item, feedId }: Props) => {
  const audioRef = useRef(new Audio());
  const intervalRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);

  const hasMediaSession = "mediaSession" in navigator;


  const loadSavedProgress = useCallback(async () => {
    if (!item.guid) return;
    const status: FeedStatus | null = await localDB('feedProgress').getItem(item.guid);
    if (!status) return;
     const currentPercentage = (status.progress / status.duration) * 100;
    setProgress(Number(currentPercentage.toFixed(2)));
    setDuration(status.duration);
  }, [item.guid]);

  const formatDuration = (duration: number) => {
   return new Date(duration * 1000).toISOString().substr(11, 8)
  }

  const updateProgress = async (updateDb: boolean = true) => {
    const { duration, ended, currentTime } = audioRef.current;
     if (!ended) {
        const currentPercentage = duration ? (currentTime / duration) * 100 : 0;
        setProgress(Number(currentPercentage.toFixed(2)));
        if (item.guid && updateDb)
        await localDB('feedProgress').setItem(item.guid, { progress: currentTime, duration });
      }
  }

  const startTimer = () => {
    intervalRef.current = window.setInterval(async () => {
      await updateProgress();
    }, 60 * 1000);
  };

  const updateMediaSession = async () => {
    if (!hasMediaSession) return;
    const feed: FeedItem | null = await localDB('feeds').getItem(feedId);
    // @ts-ignore
    window.navigator.mediaSession.metadata = new MediaMetadata({
    title: item.title,
    artist: item.creator,
    artwork: [
      { src: feed ? feed?.image?.url : '/logo512.png', sizes: '512x512', type: 'image/png' },
    ]
  });
  }

  const onClick = () => {
    if (!isPlaying) {
      if (!audioRef.current.src)
        audioRef.current.src = item.enclosure ? item.enclosure.url : '';
        audioRef.current.title=item.title || '';
        audioRef.current.volume = 1;
      audioRef.current.play();
      document.title = item.title || 'Simple Podcast Listener';
      audioRef.current.addEventListener('loadedmetadata', async () => {
        if (item.guid) {
          const feedStatus: FeedStatus | null = await localDB('feedProgress').getItem(item.guid);
          if (feedStatus) audioRef.current.currentTime = feedStatus.progress;
          await updateProgress(false);
        }
        setDuration(audioRef.current.duration);
        startTimer();
        await updateMediaSession();
      });
    } else {
      clearInterval(intervalRef.current);
      audioRef.current.pause();
    }

    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const player = audioRef.current;
    loadSavedProgress();
    return () => {
      setIsPlaying(false);
      clearInterval(intervalRef.current);
      player.pause();
    };
  }, [loadSavedProgress]);

  return (
    <ListGroup.Item key={item.pubDate}>
      <Progress progress={progress} />
      <Media className="position-relative">
        <Button className="m-2" variant="secondary" onClick={onClick}>
          {!isPlaying ? play : pause}
        </Button>
        <Media.Body>
          <h5>{item.title}</h5>
          <p className="mb-0">{new Date(item.pubDate || '').toDateString()}</p>
          {duration && (<p className="mb-0 font-weight-bold">Duration: {formatDuration(duration)}</p>)}
        </Media.Body>
      </Media>
    </ListGroup.Item>
  );
};

export default ContentItem;
