import React, {
  useMemo,
  useState,
} from 'react';

import {
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Feather from '@expo/vector-icons/Feather';

import { BlurView } from 'expo-blur';

import { LinearGradient } from 'expo-linear-gradient';

import {
  useLocalSearchParams,
  useRouter,
} from 'expo-router';

import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import * as Haptics from 'expo-haptics';

import { MovieCard } from '@/components/MovieCard';

import { MOVIES } from '@/data/movies';

import { THEME } from '@/constants/theme';


/* ----------------------------------
   SMALL GLASS ICON BUTTON
----------------------------------- */

interface GlassIconButtonProps {
  icon:
    | 'arrow-left'
    | 'heart'
    | 'share-2'
    | 'plus'
    | 'check';
  active?: boolean;
  onPress?: () => void;
}

function GlassIconButton({
  icon,
  active = false,
  onPress,
}: GlassIconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.glassButton,

        active && {
          backgroundColor:
            'rgba(216,178,92,0.18)',

          borderColor:
            'rgba(216,178,92,0.42)',
        },

        pressed && {
          opacity: 0.65,

          transform: [
            {
              scale: 0.94,
            },
          ],
        },
      ]}
    >
      <BlurView
        intensity={55}
        tint="dark"
        experimentalBlurMethod={
          Platform.OS === 'android'
            ? 'dimezisBlurView'
            : undefined
        }
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.glassButtonTint} />

      <Feather
        name={icon}
        size={19}
        color={
          active
            ? THEME.goldLight
            : '#FFFFFF'
        }
      />
    </Pressable>
  );
}


/* ----------------------------------
   DETAIL ROW
----------------------------------- */

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.detailItem}>
      <Text style={styles.detailLabel}>
        {label}
      </Text>

      <Text style={styles.detailValue}>
        {value}
      </Text>
    </View>
  );
}


/* ----------------------------------
   SCREEN
----------------------------------- */

export default function MovieDetailScreen() {
  const params =
    useLocalSearchParams<{
      id?: string | string[];
    }>();

  const router = useRouter();

  const insets = useSafeAreaInsets();

  const movieId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const movie =
    MOVIES.find(
      (item) => item.id === movieId
    ) ?? MOVIES[0];

  const [saved, setSaved] =
    useState(false);


  /* ----------------------------------
     SIMILAR MOVIES
  ----------------------------------- */

  const similarMovies = useMemo(() => {
    const sameGenre = MOVIES.filter(
      (item) =>
        item.id !== movie.id &&
        (
          item.genre === movie.genre ||
          item.tags.some((tag) =>
            movie.tags.includes(tag)
          )
        )
    );

    const others = MOVIES.filter(
      (item) =>
        item.id !== movie.id &&
        !sameGenre.some(
          (similar) =>
            similar.id === item.id
        )
    );

    return [
      ...sameGenre,
      ...others,
    ].slice(0, 6);
  }, [movie]);


  const toggleSaved = () => {
    Haptics.selectionAsync();

    setSaved((value) => !value);
  };


  const handleWatch = () => {
    Haptics.impactAsync(
      Haptics.ImpactFeedbackStyle.Medium
    );

    /*
      Plus tard :
      router.push(`/watch/${movie.id}`)
    */
  };


  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.scrollContent
        }
      >

        {/* ==============================
            HERO
        ============================== */}

        <View
          style={[
            styles.hero,

            {
              backgroundColor:
                movie.posterColor,
            },
          ]}
        >

          <LinearGradient
            colors={[
              movie.posterColor,
              '#191008',
              '#080808',
            ]}
            start={{
              x: 0,
              y: 0,
            }}
            end={{
              x: 1,
              y: 1,
            }}
            style={StyleSheet.absoluteFill}
          />


          {/* Decorative circles */}

          <View
            style={[
              styles.heroCircleLarge,

              {
                borderColor:
                  movie.accentColor,
              },
            ]}
          />

          <View
            style={[
              styles.heroCircleSmall,

              {
                backgroundColor:
                  movie.accentColor,
              },
            ]}
          />


          {/* Film artwork */}

          <View style={styles.heroArtwork}>
            <View
              style={[
                styles.artworkCircle,

                {
                  borderColor:
                    movie.accentColor,
                },
              ]}
            >
              <Feather
                name="film"
                size={74}
                color={
                  movie.accentColor
                }
              />
            </View>

            <Text
              style={[
                styles.artworkText,

                {
                  color:
                    movie.accentColor,
                },
              ]}
            >
              MBOA FLIX
            </Text>
          </View>


          {/* Full gradient overlay */}

          <LinearGradient
            colors={[
              'rgba(0,0,0,0.05)',
              'rgba(0,0,0,0.10)',
              '#050505',
            ]}
            locations={[
              0,
              0.48,
              1,
            ]}
            style={
              StyleSheet.absoluteFill
            }
          />


          {/* Navigation */}

          <View
            style={[
              styles.navigation,

              {
                paddingTop:
                  insets.top + 10,
              },
            ]}
          >
            <GlassIconButton
              icon="arrow-left"
              onPress={() => {
                Haptics.impactAsync(
                  Haptics
                    .ImpactFeedbackStyle
                    .Light
                );

                router.back();
              }}
            />

            <View
              style={
                styles.navigationRight
              }
            >
              <GlassIconButton
                icon={
                  saved
                    ? 'check'
                    : 'heart'
                }
                active={saved}
                onPress={toggleSaved}
              />

              <GlassIconButton
                icon="share-2"
                onPress={() =>
                  Haptics
                    .selectionAsync()
                }
              />
            </View>
          </View>


          {/* Bottom information */}

          <View style={styles.heroInfo}>
            <View
              style={
                styles.originalBadge
              }
            >
              <View
                style={
                  styles.originalDot
                }
              />

              <Text
                style={
                  styles.originalText
                }
              >
                MBOA ORIGINAL
              </Text>
            </View>

            <Text style={styles.title}>
              {movie.title}
            </Text>

            <View style={styles.heroMeta}>
              <View
                style={styles.rating}
              >
                <Feather
                  name="star"
                  size={13}
                  color={
                    THEME.goldLight
                  }
                />

                <Text
                  style={
                    styles.ratingText
                  }
                >
                  {movie.rating.toFixed(
                    1
                  )}
                </Text>
              </View>

              <View style={styles.dot} />

              <Text
                style={styles.metaText}
              >
                {movie.year}
              </Text>

              <View style={styles.dot} />

              <Text
                style={styles.metaText}
              >
                {movie.duration}
              </Text>
            </View>
          </View>
        </View>


        {/* ==============================
            MAIN CONTENT
        ============================== */}

        <View style={styles.content}>

          {/* Tags */}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.tags
            }
          >
            {movie.tags.map((tag) => (
              <View
                key={tag}
                style={styles.tag}
              >
                <Text
                  style={styles.tagText}
                >
                  {tag}
                </Text>
              </View>
            ))}
          </ScrollView>


          {/* ==============================
              ACTIONS
          ============================== */}

          <View style={styles.actions}>
            <Pressable
              onPress={handleWatch}
              style={({ pressed }) => [
                styles.watchButton,

                pressed &&
                  styles.pressed,
              ]}
            >
              <Feather
                name="play"
                size={19}
                color="#050505"
              />

              <Text
                style={
                  styles.watchButtonText
                }
              >
                Watch Now
              </Text>
            </Pressable>


            <GlassIconButton
              icon={
                saved
                  ? 'check'
                  : 'plus'
              }
              active={saved}
              onPress={toggleSaved}
            />
          </View>


          {/* ==============================
              SYNOPSIS
          ============================== */}

          <View style={styles.section}>
            <Text
              style={styles.sectionTitle}
            >
              Synopsis
            </Text>

            <Text
              style={
                styles.description
              }
            >
              {movie.description}
            </Text>
          </View>


          {/* ==============================
              FILM INFORMATION
          ============================== */}

          <View style={styles.infoCard}>
            <BlurView
              intensity={40}
              tint="dark"
              experimentalBlurMethod={
                Platform.OS ===
                'android'
                  ? 'dimezisBlurView'
                  : undefined
              }
              style={
                StyleSheet.absoluteFill
              }
            />

            <View
              style={
                styles.infoCardTint
              }
            />

            <View
              style={styles.infoGrid}
            >
              <DetailItem
                label="Year"
                value={`${movie.year}`}
              />

              <DetailItem
                label="Duration"
                value={movie.duration}
              />

              <DetailItem
                label="Genre"
                value={movie.genre}
              />

              <DetailItem
                label="Rating"
                value={`${movie.rating.toFixed(
                  1
                )}/10`}
              />
            </View>
          </View>


          {/* ==============================
              DIRECTOR
          ============================== */}

          {movie.director && (
            <View style={styles.section}>
              <Text
                style={
                  styles.sectionTitle
                }
              >
                Director
              </Text>

              <View
                style={
                  styles.directorCard
                }
              >
                <View
                  style={
                    styles.directorAvatar
                  }
                >
                  <Feather
                    name="video"
                    size={20}
                    color={THEME.gold}
                  />
                </View>

                <View
                  style={
                    styles.directorInfo
                  }
                >
                  <Text
                    style={
                      styles.directorName
                    }
                  >
                    {movie.director}
                  </Text>

                  <Text
                    style={
                      styles.directorRole
                    }
                  >
                    Film Director
                  </Text>
                </View>

                <Feather
                  name="chevron-right"
                  size={19}
                  color={
                    'rgba(255,255,255,0.32)'
                  }
                />
              </View>
            </View>
          )}


          {/* ==============================
              CAST
          ============================== */}

          {movie.cast &&
            movie.cast.length > 0 && (
              <View
                style={styles.section}
              >
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Cast
                </Text>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={
                    false
                  }
                  contentContainerStyle={
                    styles.castList
                  }
                >
                  {movie.cast.map(
                    (name, index) => (
                      <View
                        key={`${name}-${index}`}
                        style={
                          styles.castItem
                        }
                      >
                        <View
                          style={[
                            styles.castAvatar,

                            {
                              borderColor:
                                index === 0
                                  ? 'rgba(216,178,92,0.40)'
                                  : 'rgba(255,255,255,0.10)',
                            },
                          ]}
                        >
                          <Feather
                            name="user"
                            size={24}
                            color={
                              index === 0
                                ? THEME.gold
                                : 'rgba(255,255,255,0.55)'
                            }
                          />
                        </View>

                        <Text
                          style={
                            styles.castName
                          }
                          numberOfLines={2}
                        >
                          {name}
                        </Text>
                      </View>
                    )
                  )}
                </ScrollView>
              </View>
            )}


          {/* ==============================
              TRAILER
          ============================== */}

          <View style={styles.section}>
            <Text
              style={styles.sectionTitle}
            >
              Trailer
            </Text>

            <Pressable
              onPress={() =>
                Haptics.impactAsync(
                  Haptics
                    .ImpactFeedbackStyle
                    .Medium
                )
              }
              style={({ pressed }) => [
                styles.trailer,

                {
                  backgroundColor:
                    movie.posterColor,
                },

                pressed &&
                  styles.pressed,
              ]}
            >
              <LinearGradient
                colors={[
                  movie.posterColor,
                  '#120D09',
                  '#050505',
                ]}
                style={
                  StyleSheet.absoluteFill
                }
              />

              <View
                style={[
                  styles.trailerGlow,

                  {
                    backgroundColor:
                      movie.accentColor,
                  },
                ]}
              />

              <View
                style={
                  styles.trailerContent
                }
              >
                <View
                  style={
                    styles.playCircle
                  }
                >
                  <Feather
                    name="play"
                    size={24}
                    color="#050505"
                  />
                </View>

                <Text
                  style={
                    styles.trailerTitle
                  }
                >
                  Official Trailer
                </Text>

                <Text
                  style={
                    styles.trailerSubtitle
                  }
                >
                  Watch preview
                </Text>
              </View>
            </Pressable>
          </View>


          {/* ==============================
              MORE LIKE THIS
          ============================== */}

          <View style={styles.section}>
            <View
              style={
                styles.sectionHeader
              }
            >
              <Text
                style={
                  styles.sectionTitle
                }
              >
                More Like This
              </Text>

              <Pressable
                onPress={() =>
                  router.push(
                    '/explore'
                  )
                }
              >
                <Text
                  style={
                    styles.seeAll
                  }
                >
                  See all
                </Text>
              </Pressable>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.moreList
              }
            >
              {similarMovies.map(
                (item) => (
                  <MovieCard
                    key={item.id}
                    movie={item}
                    size="sm"
                    onPress={() =>
                      router.push(
                        `/movie/${item.id}`
                      )
                    }
                  />
                )
              )}
            </ScrollView>
          </View>


          {/* ==============================
              BRAND FOOTER
          ============================== */}

          <View style={styles.footer}>
            <View
              style={styles.footerLine}
            />

            <Text
              style={styles.footerBrand}
            >
              MBOA FLIX
            </Text>

            <Text
              style={styles.footerText}
            >
              Stories from Cameroon
            </Text>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}


/* ----------------------------------
   STYLES
----------------------------------- */

const styles = StyleSheet.create({
  root: {
    flex: 1,

    backgroundColor:
      THEME.background,
  },

  scrollContent: {
    paddingBottom: 40,
  },


  /* HERO */

  hero: {
    height: 520,

    position: 'relative',

    overflow: 'hidden',
  },

  heroCircleLarge: {
    position: 'absolute',

    width: 360,
    height: 360,

    borderRadius: 180,

    borderWidth: 1.5,

    top: 20,
    right: -150,

    opacity: 0.30,
  },

  heroCircleSmall: {
    position: 'absolute',

    width: 120,
    height: 120,

    borderRadius: 60,

    top: 130,
    right: 50,

    opacity: 0.08,
  },

  heroArtwork: {
    position: 'absolute',

    left: 0,
    right: 0,

    top: 150,

    alignItems: 'center',

    opacity: 0.38,
  },

  artworkCircle: {
    width: 140,
    height: 140,

    borderRadius: 70,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 1,
  },

  artworkText: {
    marginTop: 15,

    fontSize: 11,

    fontWeight: '800',

    letterSpacing: 4,
  },


  /* NAV */

  navigation: {
    position: 'absolute',

    zIndex: 10,

    top: 0,
    left: 0,
    right: 0,

    paddingHorizontal: 18,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent:
      'space-between',
  },

  navigationRight: {
    flexDirection: 'row',

    gap: 9,
  },

  glassButton: {
    width: 44,
    height: 44,

    borderRadius: 22,

    alignItems: 'center',
    justifyContent: 'center',

    overflow: 'hidden',

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.14)',
  },

  glassButtonTint: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor:
      'rgba(15,15,15,0.45)',
  },


  /* HERO INFO */

  heroInfo: {
    position: 'absolute',

    left: 20,
    right: 20,

    bottom: 25,
  },

  originalBadge: {
    alignSelf: 'flex-start',

    flexDirection: 'row',

    alignItems: 'center',

    gap: 7,

    paddingHorizontal: 11,
    paddingVertical: 7,

    borderRadius: 100,

    backgroundColor:
      'rgba(255,255,255,0.07)',

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.10)',

    marginBottom: 13,
  },

  originalDot: {
    width: 6,
    height: 6,

    borderRadius: 3,

    backgroundColor:
      THEME.gold,
  },

  originalText: {
    color: '#FFFFFF',

    fontSize: 10,

    fontWeight: '800',

    letterSpacing: 1.5,
  },

  title: {
    color: '#FFFFFF',

    fontSize: 35,

    lineHeight: 40,

    fontWeight: '800',

    letterSpacing: -0.8,
  },

  heroMeta: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,

    marginTop: 12,
  },

  rating: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 5,
  },

  ratingText: {
    color: THEME.goldLight,

    fontSize: 14,

    fontWeight: '700',
  },

  metaText: {
    color:
      'rgba(255,255,255,0.62)',

    fontSize: 13,

    fontWeight: '500',
  },

  dot: {
    width: 3,
    height: 3,

    borderRadius: 2,

    backgroundColor:
      'rgba(255,255,255,0.35)',
  },


  /* CONTENT */

  content: {
    paddingHorizontal: 18,
  },

  tags: {
    paddingTop: 4,

    paddingBottom: 22,

    gap: 8,
  },

  tag: {
    paddingHorizontal: 12,

    paddingVertical: 7,

    borderRadius: 100,

    backgroundColor:
      'rgba(255,255,255,0.05)',

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.10)',
  },

  tagText: {
    color:
      'rgba(255,255,255,0.70)',

    fontSize: 11,

    fontWeight: '600',
  },


  /* ACTIONS */

  actions: {
    flexDirection: 'row',

    alignItems: 'center',

    gap: 12,

    marginBottom: 34,
  },

  watchButton: {
    flex: 1,

    height: 54,

    borderRadius: 18,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'center',

    gap: 9,

    backgroundColor:
      THEME.gold,
  },

  watchButtonText: {
    color: '#050505',

    fontSize: 15,

    fontWeight: '800',
  },

  pressed: {
    opacity: 0.72,

    transform: [
      {
        scale: 0.98,
      },
    ],
  },


  /* SECTIONS */

  section: {
    marginBottom: 34,
  },

  sectionTitle: {
    color: '#FFFFFF',

    fontSize: 20,

    fontWeight: '750',

    letterSpacing: -0.25,

    marginBottom: 13,
  },

  sectionHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent:
      'space-between',
  },

  description: {
    color:
      'rgba(255,255,255,0.64)',

    fontSize: 14,

    lineHeight: 23,
  },

  seeAll: {
    color: THEME.gold,

    fontSize: 12,

    fontWeight: '600',

    marginBottom: 13,
  },


  /* INFORMATION */

  infoCard: {
    marginBottom: 34,

    overflow: 'hidden',

    borderRadius: 24,

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.10)',
  },

  infoCardTint: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor:
      'rgba(15,15,15,0.65)',
  },

  infoGrid: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    padding: 18,

    rowGap: 20,
  },

  detailItem: {
    width: '50%',
  },

  detailLabel: {
    color:
      'rgba(255,255,255,0.35)',

    fontSize: 10,

    fontWeight: '600',

    textTransform: 'uppercase',

    letterSpacing: 1,
  },

  detailValue: {
    color: '#FFFFFF',

    fontSize: 14,

    fontWeight: '600',

    marginTop: 6,
  },


  /* DIRECTOR */

  directorCard: {
    minHeight: 72,

    flexDirection: 'row',

    alignItems: 'center',

    padding: 13,

    borderRadius: 21,

    backgroundColor:
      'rgba(255,255,255,0.035)',

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.08)',
  },

  directorAvatar: {
    width: 46,
    height: 46,

    borderRadius: 17,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor:
      'rgba(216,178,92,0.09)',

    borderWidth: 1,

    borderColor:
      'rgba(216,178,92,0.20)',
  },

  directorInfo: {
    flex: 1,

    marginLeft: 12,
  },

  directorName: {
    color: '#FFFFFF',

    fontSize: 14,

    fontWeight: '700',
  },

  directorRole: {
    color:
      'rgba(255,255,255,0.40)',

    fontSize: 11,

    marginTop: 4,
  },


  /* CAST */

  castList: {
    gap: 15,

    paddingRight: 10,
  },

  castItem: {
    width: 82,

    alignItems: 'center',
  },

  castAvatar: {
    width: 64,
    height: 64,

    borderRadius: 22,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor:
      'rgba(255,255,255,0.05)',

    borderWidth: 1,
  },

  castName: {
    marginTop: 8,

    color:
      'rgba(255,255,255,0.65)',

    fontSize: 10,

    lineHeight: 14,

    textAlign: 'center',
  },


  /* TRAILER */

  trailer: {
    height: 185,

    borderRadius: 26,

    overflow: 'hidden',

    borderWidth: 1,

    borderColor:
      'rgba(255,255,255,0.09)',
  },

  trailerGlow: {
    position: 'absolute',

    width: 180,
    height: 180,

    borderRadius: 90,

    right: -60,

    top: -70,

    opacity: 0.12,
  },

  trailerContent: {
    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',
  },

  playCircle: {
    width: 58,
    height: 58,

    borderRadius: 29,

    alignItems: 'center',

    justifyContent: 'center',

    backgroundColor:
      THEME.gold,

    marginBottom: 12,
  },

  trailerTitle: {
    color: '#FFFFFF',

    fontSize: 15,

    fontWeight: '700',
  },

  trailerSubtitle: {
    color:
      'rgba(255,255,255,0.40)',

    fontSize: 11,

    marginTop: 4,
  },


  /* MORE */

  moreList: {
    paddingRight: 10,
  },


  /* FOOTER */

  footer: {
    alignItems: 'center',

    paddingTop: 18,

    paddingBottom: 25,
  },

  footerLine: {
    width: 30,
    height: 2,

    borderRadius: 2,

    backgroundColor:
      THEME.gold,

    marginBottom: 14,
  },

  footerBrand: {
    color: THEME.gold,

    fontSize: 12,

    fontWeight: '800',

    letterSpacing: 3,
  },

  footerText: {
    color:
      'rgba(255,255,255,0.26)',

    fontSize: 10,

    marginTop: 7,
  },
});