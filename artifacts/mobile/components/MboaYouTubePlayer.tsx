import React, {
  useMemo,
} from 'react';

import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import YoutubePlayer from 'react-native-youtube-iframe';

export interface MboaYouTubePlayerProps {
  videoId: string;
  width: number;
  height: number;
  playing: boolean;
  captionLanguage: 'fr' | 'en';
  preferCaptions: boolean;
  onChangeState?: (
    state: string
  ) => void;
  onError?: (
    error: string
  ) => void;
  title?: string;
}

export function MboaYouTubePlayer({
  videoId,
  width,
  height,
  playing,
  captionLanguage,
  preferCaptions,
  onChangeState,
  onError,
  title = 'MBOA FLIX YouTube player',
}: MboaYouTubePlayerProps) {
  const playerParams = useMemo(
    () => ({
      playsinline: true,
      cc_lang_pref:
        captionLanguage,
      cc_load_policy:
        preferCaptions ? 1 : 0,
    }),
    [
      captionLanguage,
      preferCaptions,
    ]
  );

  if (Platform.OS === 'web') {
    const params = new URLSearchParams({
      playsinline: '1',
      autoplay: playing ? '1' : '0',
      cc_lang_pref:
        captionLanguage,
      cc_load_policy:
        preferCaptions ? '1' : '0',
    });

    const src =
      `https://www.youtube.com/embed/${videoId}?${params.toString()}`;

    return (
      <View
        style={[
          styles.container,
          {
            width,
            height,
          },
        ]}
      >
        {React.createElement(
          'iframe',
          {
            src,
            title,
            width: '100%',
            height: '100%',
            frameBorder: 0,
            allow:
              'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
            allowFullScreen: true,
            style: {
              border: 0,
              display: 'block',
              width: '100%',
              height: '100%',
            },
          }
        )}
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
        },
      ]}
    >
      <YoutubePlayer
        height={height}
        width={width}
        play={playing}
        videoId={videoId}
        onChangeState={(state: string) =>
          onChangeState?.(
            String(state)
          )
        }
        onError={(error: string) =>
          onError?.(
            String(error)
          )
        }
        initialPlayerParams={
          playerParams as any
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
});
