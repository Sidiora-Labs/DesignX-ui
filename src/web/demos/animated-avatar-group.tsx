import AnimatedAvatarGroup from "@/components/elements/animated-avatar-group";
import { getAllPeople } from "@/lib/demo-data";

export default function AnimatedAvatarGroupDemo() {
  return (
    <AnimatedAvatarGroup
      avatars={getAllPeople().map((p) => ({ src: p.avatar, alt: p.name }))}
      expandOnHover
      maxVisible={5}
    />
  );
}
