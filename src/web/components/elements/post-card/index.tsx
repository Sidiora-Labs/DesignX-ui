import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { Fragment, type ReactNode } from "react";

export type PostAuthor = {
  name: string;
  handle: string;
  avatar: string;
  url?: string;
};

export type PostMedia = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
};

export type Post = {
  author: PostAuthor;
  /** Body text. `#tags`, `@mentions` and URLs are highlighted. */
  text: string;
  media?: PostMedia[];
  url?: string;
  /** Rendered under the body, e.g. a timestamp. */
  meta?: ReactNode;
};

export type PostCardProps = {
  post?: Post;
  className?: string;
  userInfoPosition?: "top" | "bottom";
  avatarRounded?: string;
};

export const truncate = (str: string | null, length: number) => {
  if (!str || str.length <= length) {
    return str;
  }
  return `${str.slice(0, length - 3)}...`;
};

const TOKEN = /(https?:\/\/\S+|[#@][\w-]+)/g;

const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("rounded-md bg-container-high", className)} />
);

export const PostSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "flex size-full max-h-max min-w-72 flex-col gap-2 rounded-[28px] border border-outline-variant p-5",
      className
    )}
  >
    <div className="flex flex-row gap-2">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <Skeleton className="h-10 w-full" />
    </div>
    <Skeleton className="h-20 w-full" />
  </div>
);

export const PostNotFound = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "flex size-full flex-col items-center justify-center gap-2 rounded-[28px] border border-outline-variant p-5 text-muted-foreground text-sm",
      className
    )}
  >
    Post not found
  </div>
);

export const PostHeader = ({
  author,
  avatarRounded = "rounded-full",
}: {
  author: PostAuthor;
  avatarRounded?: string;
}) => {
  const avatar = (
    <img
      alt={author.name}
      className={cn("size-10 object-cover object-center", avatarRounded)}
      draggable={false}
      height={40}
      src={author.avatar}
      width={40}
    />
  );
  return (
    <div className="flex items-center gap-2.5">
      {author.url ? (
        <a aria-label={author.name} href={author.url} rel="noreferrer" target="_blank">
          {avatar}
        </a>
      ) : (
        avatar
      )}
      <div>
        <p className="font-medium text-foreground text-sm tracking-tight">{author.name}</p>
        <p className="text-muted-foreground text-xs">@{truncate(author.handle, 16)}</p>
      </div>
    </div>
  );
};

export const PostBody = ({ text }: { text: string }) => (
  <blockquote className="flex-1">
    <p className="whitespace-pre-line text-balance text-foreground text-sm leading-relaxed">
      {text.split(TOKEN).map((part, idx) => {
        const key = `${idx}-${part.slice(0, 8)}`;
        if (/^https?:\/\//.test(part)) {
          return (
            <a className="text-primary hover:underline" href={part} key={key} rel="noopener noreferrer" target="_blank">
              {part.replace(/^https?:\/\//, "")}
            </a>
          );
        }
        if (/^[#@]/.test(part)) {
          return (
            <span className="text-primary" key={key}>
              {part}
            </span>
          );
        }
        return <Fragment key={key}>{part}</Fragment>;
      })}
    </p>
  </blockquote>
);

export const PostMediaGrid = ({ media, alt }: { media: PostMedia[]; alt: string }) => {
  if (media.length === 0) {
    return null;
  }
  const img = (m: PostMedia, extra?: string) => (
    <img
      alt={m.alt ?? alt}
      className={cn("h-full w-full rounded-[18px] border border-outline-variant object-cover", extra)}
      draggable={false}
      height={m.height}
      key={m.src}
      src={m.src}
      width={m.width}
    />
  );
  if (media.length === 1) {
    return <div className="w-full">{img(media[0])}</div>;
  }
  return (
    <div className="grid w-full grid-cols-2 gap-2">
      {media.slice(0, 4).map((m, i) => img(m, i === 0 && media.length === 3 ? "row-span-2" : undefined))}
    </div>
  );
};

const DEMO_POST: Post = {
  author: {
    avatar: "/images/dx/people/p3.webp",
    handle: "dx_ui",
    name: "DX UI",
  },
  text: "Shipped 200 new motion components today. Copy, paste, own the code. #designx",
  url: "https://ui.designx.dev",
};

export function PostCard({
  post = DEMO_POST,
  className,
  userInfoPosition = "bottom",
  avatarRounded = "rounded-full",
}: PostCardProps) {
  const userInfo = <PostHeader author={post.author} avatarRounded={avatarRounded} />;
  return (
    <article
      className={cn(
        "group relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[28px] border border-outline-variant bg-card p-6 text-card-foreground",
        className
      )}
      data-post
    >
      {userInfoPosition === "top" && userInfo}
      <PostBody text={post.text} />
      <div className="flex w-full flex-col gap-4">
        {post.media ? <PostMediaGrid alt={post.text} media={post.media} /> : null}
        {post.meta ? <div className="text-muted-foreground text-xs">{post.meta}</div> : null}
        {userInfoPosition === "bottom" && userInfo}
      </div>
      {post.url ? (
        <a
          aria-label="Open post in a new tab"
          className="absolute right-6 bottom-6 z-10 flex size-8 items-center justify-center rounded-full border border-outline-variant bg-container-high text-foreground opacity-0 transition-all duration-200 ease-out group-hover:opacity-100 focus-visible:opacity-100 motion-safe:hover:scale-110"
          href={post.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <ExternalLink className="size-4" />
        </a>
      ) : null}
    </article>
  );
}

export default PostCard;
