import SocialHoverCard from "@/components/elements/social-hover-card";

export default function SocialHoverCardDemo() {
  return (
    <div className="text-sm">
      Designed by{" "}
      <SocialHoverCard
        profile={{
          id: "maya",
          name: "Maya Solis",
          handle: "maya",
          avatar: "/images/dx/people/p1.webp",
          banner: "/images/dx/photos/ph2.webp",
          bio: "Design lead at DesignX. Shapes the DX visual language.",
          stats: [
            { label: "Following", value: 312 },
            { label: "Followers", value: "18.4k" },
          ],
          verified: true,
        }}
      />{" "}
      and the DX team.
    </div>
  );
}
