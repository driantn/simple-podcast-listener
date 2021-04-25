import React, { useState, useRef, useEffect } from 'react';
import { ListGroup, Media, Button } from 'react-bootstrap';
import { FeedItem, FeedStatus } from '../../types';
import localDB from '../../utils/local-db';
import { FEED_STATUS, FEEDS } from '../../constants';
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
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [duration, setDuration] = useState<number | null>(null);

  const hasMediaSession = 'mediaSession' in navigator;

  const calculateProgress = (status: FeedStatus) =>
    Number(((status.currentTime / status.duration) * 100).toFixed(2));

  const loadSavedStatus = async () => {
    if (!item.guid) return;
    const status: FeedStatus | null = await localDB(FEED_STATUS).getItem(
      item.guid
    );
    if (!status) return;
    setLoaderProgress(calculateProgress(status));
    setDuration(status.duration);
  };

  const formatDuration = (duration: number) =>
    new Date(duration * 1000).toISOString().substr(11, 8);

  const getPlayerData = () => {
    const { duration, ended, currentTime } = audioRef.current;

    return {
      finished: duration === currentTime,
      duration,
      ended,
      currentTime,
      viewPercentage: calculateProgress({ currentTime, duration }),
    };
  };

  const savePlayerStatus = async ({ currentTime, duration }: FeedStatus) => {
    if (!item || !item.guid) return;
    await localDB(FEED_STATUS).setItem(item.guid, {
      currentTime,
      duration,
    });
  };

  const updateProgress = async (updateDb: boolean = true) => {
    const { ended, viewPercentage, currentTime, duration } = getPlayerData();
    if (!ended) {
      setLoaderProgress(viewPercentage);
      if (updateDb) await savePlayerStatus({ currentTime, duration });
    }
  };

  const startTimer = () => {
    intervalRef.current = window.setInterval(async () => {
      await updateProgress();
    }, 5 * 1000);
  };

  const initMediaSession = async () => {
    if (!hasMediaSession) return;
    const feed: FeedItem | null = await localDB(FEEDS).getItem(feedId);
    // @ts-ignore
    window.navigator.mediaSession.metadata = new window.MediaMetadata({
      title: item.title,
      artwork: [
        {
          src: feed ? feed?.image?.url : '/logo512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    });
    // @ts-ignore
    window.navigator.mediaSession.setActionHandler('stop', () => {
      onPause();
    });
  };

  const onStart = () => {
    const { finished } = getPlayerData();
    const player = audioRef.current;
    (window as any).myPlayer = player;
    if (player.paused) {
      if (!player.src) player.src = item.enclosure ? item.enclosure.url : '';
      if (finished) player.currentTime = 0;
      player.volume = 1;
      player.play();
    } else {
      player.pause();
    }
  };

  const onEnded = async () => {
    const { currentTime, duration } = getPlayerData();
    await savePlayerStatus({ currentTime, duration });
  };

  const onLoadMetaData = async () => {
    const player = audioRef.current;
    if (item.guid) {
      const feedStatus: FeedStatus | null = await localDB(FEED_STATUS).getItem(
        item.guid
      );
      if (feedStatus)
        player.currentTime =
          feedStatus.currentTime === feedStatus.duration
            ? 0
            : feedStatus.currentTime;
      await updateProgress(false);
    }
    setDuration(player.duration);
    await initMediaSession();
  };

  const onPlay = () => {
    startTimer();
    setIsPlaying(true);
  };

  const onPause = () => {
    clearInterval(intervalRef.current);
    setIsPlaying(false);
  };

  const addEventListeners = () => {
    if (!audioRef.current) return;
    const player = audioRef.current;

    player.addEventListener('ended', onEnded);
    player.addEventListener('loadedmetadata', onLoadMetaData);
    player.addEventListener('play', onPlay);
    player.addEventListener('pause', onPause);
  };

  const removeEventListeners = () => {
    if (!audioRef.current) return;
    const player = audioRef.current;

    player.removeEventListener('ended', onEnded);
    player.removeEventListener('loadedmetadata', onLoadMetaData);
    player.addEventListener('play', onPlay);
    player.addEventListener('pause', onPause);
  };

  useEffect(() => {
    const player = audioRef.current;
    loadSavedStatus();
    addEventListeners();
    return () => {
      removeEventListeners();
      setIsPlaying(false);
      clearInterval(intervalRef.current);
      player.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ListGroup.Item key={item.pubDate}>
      <Progress progress={loaderProgress} />
      <Media className="position-relative">
        <Button className="m-2" variant="secondary" onClick={onStart}>
          {!isPlaying ? play : pause}
        </Button>
        <Media.Body>
          <h5>{item.title}</h5>
          <p className="mb-0">{new Date(item.pubDate || '').toDateString()}</p>
          {duration && (
            <p className="mb-0 font-weight-bold">
              Duration: {formatDuration(duration)}
            </p>
          )}
        </Media.Body>
      </Media>
    </ListGroup.Item>
  );
};

export default ContentItem;
