import EmojiReaction from "@/components/elements/emoji-reaction";

export default function EmojiReactionDemo() {
  return (
    <EmojiReaction
      reactions={[
        { id: "fire", emoji: "🔥", label: "Fire", count: 12, reacted: true },
        { id: "heart", emoji: "❤️", label: "Love", count: 8 },
        { id: "rocket", emoji: "🚀", label: "Ship it", count: 5 },
      ]}
      showPicker
    />
  );
}
