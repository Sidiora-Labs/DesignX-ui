import EventInvites from "@/components/elements/event-invites";
import { getAllPeople, photo } from "@/lib/demo-data";

const people = getAllPeople();

export default function EventInvitesDemo() {
  return (
    <EventInvites
      events={[
        { id: 1, title: "DX UI Launch Party", subtitle: "Fri, Jun 6 · 7 PM", location: "Lisbon", badge: "Hosting", image: photo(2), participants: people.slice(0, 4).map((p) => ({ avatar: p.avatar })) },
        { id: 2, title: "Motion Workshop", subtitle: "Sat, Jun 14 · 10 AM", location: "Berlin", badge: "Going", image: photo(6), participants: people.slice(4, 8).map((p) => ({ avatar: p.avatar })) },
        { id: 3, title: "Design Systems Meetup", subtitle: "Thu, Jun 26 · 6 PM", location: "Seoul", image: photo(13), participants: people.slice(8, 12).map((p) => ({ avatar: p.avatar })) },
      ]}
    />
  );
}
