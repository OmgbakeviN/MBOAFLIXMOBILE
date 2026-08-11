import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  KeyboardAvoidingView
} from 'react-native-keyboard-controller'

import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

import { THEME } from '@/constants/theme';
import {
  askNkap,
  NkapChatMessage,
} from '@/services/nkap';

interface UiMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

const SUGGESTIONS = [
  'Que visiter à Buea ?',
  'Parle-moi du Ndolé',
  'Who are some Cameroonian filmmakers?',
  'Explain the cultural diversity of Cameroon',
];

const WELCOME_MESSAGE: UiMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm Nkap, your Cameroon AI Guide. Ask me about Cameroonian cinema, food, history, cities, music, traditions or places to discover.",
};

function makeId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export default function NkapScreen() {
  const router = useRouter();
  const listRef = useRef<FlatList<UiMessage>>(null);

  const [messages, setMessages] = useState<UiMessage[]>([
    WELCOME_MESSAGE,
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const conversation = useMemo<NkapChatMessage[]>(
    () =>
      messages
        .filter((message) => message.id !== 'welcome')
        .map((message) => ({
          role: message.role,
          content: message.content,
        })),
    [messages]
  );

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const sendMessage = useCallback(
    async (rawText?: string) => {
      const cleanText = (rawText ?? input).trim();

      if (!cleanText || sending) return;

      Haptics.impactAsync(
        Haptics.ImpactFeedbackStyle.Light
      );

      const userMessage: UiMessage = {
        id: makeId(),
        role: 'user',
        content: cleanText,
      };

      const nextConversation: NkapChatMessage[] = [
        ...conversation,
        { role: 'user', content: cleanText },
      ];

      setMessages((current) => [
        ...current,
        userMessage,
      ]);
      setInput('');
      setSending(true);
      scrollToBottom();

      try {
        const answer = await askNkap(nextConversation);

        setMessages((current) => [
          ...current,
          {
            id: makeId(),
            role: 'assistant',
            content: answer,
          },
        ]);

        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
      } catch (error) {
        const text =
          error instanceof Error
            ? error.message
            : 'Nkap could not answer right now.';

        setMessages((current) => [
          ...current,
          {
            id: makeId(),
            role: 'assistant',
            content: `I couldn't connect right now.\n\n${text}`,
          },
        ]);

        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Error
        );
      } finally {
        setSending(false);
        scrollToBottom();
      }
    }, [conversation, input, sending, scrollToBottom]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.headerButton}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <View style={styles.identity}>
            <View style={styles.avatar}>
              <LinearGradient
                colors={['#F0CD72', '#C7922E']}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.avatarSpark}>✦</Text>
            </View>

            <View>
              <View style={styles.nameRow}>
                <Text style={styles.name}>Nkap</Text>
                <View style={styles.aiBadge}>
                  <Text style={styles.aiBadgeText}>AI</Text>
                </View>
              </View>
              <Text style={styles.tagline}>Your Cameroon AI Guide</Text>
            </View>
          </View>

          <Pressable
            onPress={() => {
              Haptics.selectionAsync();
              setMessages([WELCOME_MESSAGE]);
              setInput('');
            }}
            style={styles.headerButton}
          >
            <Text style={styles.resetText}>↻</Text>
          </Pressable>
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={
            Platform.OS === 'ios' ? 'interactive' : 'on-drag'
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messages}
          onContentSizeChange={scrollToBottom}
          ListHeaderComponent={
            <View style={styles.introCard}>
              <LinearGradient
                colors={['#211505', '#100C07', '#070707']}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.introGlow} />
              <Text style={styles.introEyebrow}>MBOA FLIX AI</Text>
              <Text style={styles.introTitle}>Ask about Cameroon.</Text>
              <Text style={styles.introText}>
                Cinema, food, history, cities, languages, music,
                traditions and places to discover.
              </Text>
              <Text style={styles.disclaimer}>
                AI can make mistakes. Verify important facts.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <MessageBubble message={item} />
          )}
          ListFooterComponent={
            <View>
              {sending && (
                <View style={[styles.row, styles.assistantRow]}>
                  <View style={styles.miniAvatar}>
                    <Text style={styles.miniSpark}>✦</Text>
                  </View>
                  <View style={styles.typingBubble}>
                    <ActivityIndicator size="small" color={THEME.gold} />
                    <Text style={styles.typingText}>Nkap is thinking...</Text>
                  </View>
                </View>
              )}

              {messages.length <= 1 && !sending && (
                <View style={styles.suggestions}>
                  <Text style={styles.suggestionLabel}>TRY ASKING</Text>
                  {SUGGESTIONS.map((suggestion) => (
                    <Pressable
                      key={suggestion}
                      onPress={() => sendMessage(suggestion)}
                      style={styles.suggestion}
                    >
                      <Text style={styles.suggestionSpark}>✦</Text>
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                      <Text style={styles.suggestionArrow}>›</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          }
        />

        <View style={styles.composerWrapper}>
          <BlurView
            intensity={75}
            tint="dark"
            experimentalBlurMethod={
              Platform.OS === 'android'
                ? 'dimezisBlurView'
                : undefined
            }
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.composerTint} />

          <View style={styles.composer}>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask Nkap about Cameroon..."
              placeholderTextColor="rgba(255,255,255,0.30)"
              multiline
              maxLength={1000}
              style={styles.input}
            />

            <Pressable
              disabled={sending || !input.trim()}
              onPress={() => sendMessage()}
              style={[
                styles.sendButton,
                (!input.trim() || sending) && styles.sendDisabled,
              ]}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#050505" />
              ) : (
                <Text style={styles.sendArrow}>↑</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function MessageBubble({ message }: { message: UiMessage }) {
  const assistant = message.role === 'assistant';

  return (
    <View
      style={[
        styles.row,
        assistant ? styles.assistantRow : styles.userRow,
      ]}
    >
      {assistant && (
        <View style={styles.miniAvatar}>
          <Text style={styles.miniSpark}>✦</Text>
        </View>
      )}

      <View
        style={[
          styles.bubble,
          assistant ? styles.assistantBubble : styles.userBubble,
        ]}
      >
        {assistant && <Text style={styles.messageName}>NKAP</Text>}
        <Text
          selectable
          style={[
            styles.messageText,
            !assistant && styles.userMessageText,
          ]}
        >
          {message.content}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: THEME.background },
  header: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 11,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  backText: { color: '#FFF', fontSize: 33, lineHeight: 35, marginTop: -3 },
  resetText: { color: THEME.goldLight, fontSize: 22 },
  identity: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 42, height: 42, borderRadius: 16, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  avatarSpark: { color: '#080808', fontSize: 23, fontWeight: '800' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { color: '#FFF', fontSize: 17, fontWeight: '800' },
  aiBadge: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 7, backgroundColor: 'rgba(216,178,92,0.12)', borderWidth: 1, borderColor: 'rgba(216,178,92,0.20)' },
  aiBadgeText: { color: THEME.gold, fontSize: 8, fontWeight: '800', letterSpacing: 0.7 },
  tagline: { color: 'rgba(255,255,255,0.38)', fontSize: 9, marginTop: 2 },
  messages: { paddingHorizontal: 15, paddingTop: 16, paddingBottom: 20 },
  introCard: { minHeight: 185, borderRadius: 27, overflow: 'hidden', padding: 20, justifyContent: 'flex-end', marginBottom: 22, borderWidth: 1, borderColor: 'rgba(216,178,92,0.15)' },
  introGlow: { position: 'absolute', width: 185, height: 185, borderRadius: 93, right: -55, top: -75, backgroundColor: 'rgba(216,178,92,0.12)' },
  introEyebrow: { color: THEME.gold, fontSize: 9, fontWeight: '800', letterSpacing: 1.8 },
  introTitle: { color: '#FFF', fontSize: 24, fontWeight: '800', marginTop: 5 },
  introText: { color: 'rgba(255,255,255,0.51)', fontSize: 12, lineHeight: 18, marginTop: 7, maxWidth: 300 },
  disclaimer: { color: 'rgba(255,255,255,0.25)', fontSize: 9, marginTop: 12 },
  row: { marginBottom: 14 },
  assistantRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingRight: 38 },
  userRow: { alignItems: 'flex-end', paddingLeft: 55 },
  miniAvatar: { width: 28, height: 28, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(216,178,92,0.10)', borderWidth: 1, borderColor: 'rgba(216,178,92,0.20)' },
  miniSpark: { color: THEME.gold, fontSize: 14, fontWeight: '800' },
  bubble: { maxWidth: '100%', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 12 },
  assistantBubble: { flex: 1, backgroundColor: 'rgba(255,255,255,0.045)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderBottomLeftRadius: 6 },
  userBubble: { backgroundColor: THEME.gold, borderBottomRightRadius: 6 },
  messageName: { color: THEME.gold, fontSize: 8, fontWeight: '800', letterSpacing: 1.2, marginBottom: 5 },
  messageText: { color: 'rgba(255,255,255,0.76)', fontSize: 13, lineHeight: 20 },
  userMessageText: { color: '#090909', fontWeight: '600' },
  typingBubble: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 14, borderRadius: 18, borderBottomLeftRadius: 6, backgroundColor: 'rgba(255,255,255,0.045)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  typingText: { color: 'rgba(255,255,255,0.42)', fontSize: 10 },
  suggestions: { marginTop: 6, marginBottom: 8 },
  suggestionLabel: { color: 'rgba(255,255,255,0.30)', fontSize: 8, fontWeight: '800', letterSpacing: 1.5, marginBottom: 10, marginLeft: 2 },
  suggestion: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, marginBottom: 9, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.075)' },
  suggestionSpark: { color: THEME.gold, fontSize: 14 },
  suggestionText: { flex: 1, color: 'rgba(255,255,255,0.67)', fontSize: 11, lineHeight: 16 },
  suggestionArrow: { color: 'rgba(255,255,255,0.30)', fontSize: 22 },
  composerWrapper: { overflow: 'hidden', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.07)' },
  composerTint: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,8,8,0.75)' },
  composer: { minHeight: 76, flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 14, paddingVertical: 11 },
  input: { flex: 1, minHeight: 50, maxHeight: 120, borderRadius: 19, color: '#FFF', fontSize: 13, lineHeight: 19, paddingHorizontal: 15, paddingTop: 14, paddingBottom: 12, backgroundColor: 'rgba(255,255,255,0.045)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.09)' },
  sendButton: { width: 50, height: 50, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: THEME.gold },
  sendDisabled: { opacity: 0.35 },
  sendArrow: { color: '#050505', fontSize: 24, lineHeight: 25, fontWeight: '800' },
});
