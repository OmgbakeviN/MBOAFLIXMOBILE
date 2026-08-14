import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '@/context/AuthContext';

interface WatchlistContextValue {
  movieIds: string[];
  isReady: boolean;
  isSaved: (movieId: string) => boolean;
  addMovie: (movieId: string) => Promise<void>;
  removeMovie: (movieId: string) => Promise<void>;
  toggleMovie: (movieId: string) => Promise<void>;
  clearWatchlist: () => Promise<void>;
}

const WatchlistContext =
  createContext<WatchlistContextValue | undefined>(undefined);

function storageKey(email: string) {
  return `@mboa_flix_watchlist:${email.trim().toLowerCase()}`;
}

export function WatchlistProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isReady: authReady } = useAuth();
  const [movieIds, setMovieIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      if (!authReady) {
        return;
      }

      if (!user?.email) {
        if (!cancelled) {
          setMovieIds([]);
          setIsReady(true);
        }
        return;
      }

      setIsReady(false);

      try {
        const stored = await AsyncStorage.getItem(
          storageKey(user.email)
        );

        const parsed = stored
          ? (JSON.parse(stored) as unknown)
          : [];

        const nextIds = Array.isArray(parsed)
          ? parsed.filter(
              (value): value is string =>
                typeof value === 'string'
            )
          : [];

        if (!cancelled) {
          setMovieIds(Array.from(new Set(nextIds)));
        }
      } catch (error) {
        console.warn('Unable to restore MBOA FLIX watchlist.', error);
        if (!cancelled) {
          setMovieIds([]);
        }
      } finally {
        if (!cancelled) {
          setIsReady(true);
        }
      }
    };

    restore();

    return () => {
      cancelled = true;
    };
  }, [authReady, user?.email]);

  const persist = async (nextIds: string[]) => {
    if (!user?.email) {
      return;
    }

    try {
      await AsyncStorage.setItem(
        storageKey(user.email),
        JSON.stringify(nextIds)
      );
    } catch (error) {
      console.warn('Unable to persist MBOA FLIX watchlist.', error);
    }
  };

  const addMovie = async (movieId: string) => {
    if (!user?.email) return;

    const nextIds = movieIds.includes(movieId)
      ? movieIds
      : [...movieIds, movieId];

    setMovieIds(nextIds);
    await persist(nextIds);
  };

  const removeMovie = async (movieId: string) => {
    if (!user?.email) return;

    const nextIds = movieIds.filter((id) => id !== movieId);
    setMovieIds(nextIds);
    await persist(nextIds);
  };

  const toggleMovie = async (movieId: string) => {
    if (movieIds.includes(movieId)) {
      await removeMovie(movieId);
    } else {
      await addMovie(movieId);
    }
  };

  const clearWatchlist = async () => {
    if (!user?.email) return;

    setMovieIds([]);
    await persist([]);
  };

  const value = useMemo(
    () => ({
      movieIds,
      isReady,
      isSaved: (movieId: string) => movieIds.includes(movieId),
      addMovie,
      removeMovie,
      toggleMovie,
      clearWatchlist,
    }),
    [movieIds, isReady, user?.email]
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);

  if (!context) {
    throw new Error(
      'useWatchlist must be used inside WatchlistProvider.'
    );
  }

  return context;
}
