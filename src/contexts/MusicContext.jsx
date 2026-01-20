import { createContext, useContext, useEffect, useState } from "react";

const MusicContext = createContext();

const songs = [
  {
    id: 1,
    title: "celestial-bliss-165870",
    artist: "EchoBR",
    url: "/songs/celestial-bliss-165870.mp3",

    duration: "3:22",
  },
  {
    id: 2,
    title: "fall-in-love-264570",
    artist: "EchoBR",
    url: "/songs/fall-in-love-264570.mp3",
    duration: "2:04",
  },
  {
    id: 3,
    title: "fly-away-196568",
    artist: "EchoBR",
    url: "/songs/fly-away-196568.mp3",
    duration: "1:32",
  },
  {
    id: 4,
    title: "forgotten-spell-337229",
    artist: "EchoBR",
    url: "/songs/forgotten-spell-337229.mp3",
    duration: "3:24",
  },
  {
    id: 5,
    title: "glacier-requiem-164453",
    artist: "EchoBR",
    url: "/songs/glacier-requiem-164453.mp3",
    duration: "3:34",
  },
  {
    id: 6,
    title: "i-want-you-433045",
    artist: "EchoBR",
    url: "/songs/i-want-you-433045.mp3",
    duration: "2:18",
  },
  {
    id: 7,
    title: "lemon-tree-274812",
    artist: "EchoBR",
    url: "/songs/lemon-tree-274812.mp3",
    duration: "2:53",
  },
  {
    id: 8,
    title: "red-seconds-suspense-dark-countdown-465792",
    artist: "EchoBR",
    url: "/songs/red-seconds-suspense-dark-countdown-465792.mp3",
    duration: "1:54",
  },
  
];
export const MusicProvider = ({ children }) => {
  const [allSongs, setAllSongs] = useState(songs);
  const [currentTrack, setCurrentTrack] = useState(songs[0]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const savedPlaylists = localStorage.getItem("musicPlayerPlaylists");
    if (savedPlaylists) {
      const playlists = JSON.parse(savedPlaylists);
      setPlaylists(playlists);
    }
  }, []);

  useEffect(() => {
    if (playlists.length > 0) {
      localStorage.setItem("musicPlayerPlaylists", JSON.stringify(playlists));
    } else {
      localStorage.removeItem("musicPlayerPlaylists");
    }
  }, [playlists]);

  const handlePlaySong = (song, index) => {
    setCurrentTrack(song);
    setCurrentTrackIndex(index);
    setIsPlaying(false);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => {
      const nextIndex = (prev + 1) % allSongs.length;
      setCurrentTrack(allSongs[nextIndex]);
      return nextIndex;
    });
    setIsPlaying(false);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => {
      const nextIndex = prev === 0 ? allSongs.length - 1 : prev - 1;
      setCurrentTrack(allSongs[nextIndex]);
      return nextIndex;
    });
    setIsPlaying(false);
  };

  const formatTime = (time) => {
    if (isNaN(time) || time === undefined) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const createPlaylist = (name) => {
    const newPlaylist = {
      id: Date.now(),
      name,
      songs: [],
    };

    setPlaylists((prev) => [...prev, newPlaylist]);
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists((prev) =>
      prev.filter((playlist) => playlist.id !== playlistId)
    );
  };

  const addSongToPlaylist = (playlistId, song) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.id === playlistId) {
          return { ...playlist, songs: [...playlist.songs, song] };
        } else {
          return playlist;
        }
      })
    );
  };

  const play = () => setIsPlaying(true);
  const pause = () => setIsPlaying(false);

  return (
    <MusicContext.Provider
      value={{
        allSongs,
        handlePlaySong,
        currentTrackIndex,
        currentTrack,
        setCurrentTime,
        currentTime,
        formatTime,
        duration,
        setDuration,
        nextTrack,
        prevTrack,
        play,
        pause,
        isPlaying,
        volume,
        setVolume,
        createPlaylist,
        playlists,
        addSongToPlaylist,
        setCurrentTrack,
        deletePlaylist,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const contextValue = useContext(MusicContext);
  if (!contextValue) {
    throw new Error("useMusic must be used inside of MusicProvider");
  }

  return contextValue;
};