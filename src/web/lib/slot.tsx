import {
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { cn } from "@/lib/utils";

type AnyProps = Record<string, unknown>;

function mergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as { current: T | null }).current = node;
    }
  };
}

/**
 * Slot — merges its props onto its single child element (the `asChild` pattern).
 * className is joined, event handlers are chained, refs are merged.
 */
export function Slot({
  children,
  ref,
  ...props
}: HTMLAttributes<HTMLElement> & { children?: ReactNode; ref?: Ref<HTMLElement> }) {
  if (!isValidElement(children)) return null;
  const child = children as ReactElement<AnyProps>;
  const childProps = child.props;
  const merged: AnyProps = { ...props, ...childProps };
  for (const key of Object.keys(props)) {
    const ours = (props as AnyProps)[key];
    const theirs = childProps[key];
    if (/^on[A-Z]/.test(key) && typeof ours === "function" && typeof theirs === "function") {
      merged[key] = (...args: unknown[]) => {
        (theirs as (...a: unknown[]) => void)(...args);
        (ours as (...a: unknown[]) => void)(...args);
      };
    } else if (key === "style") {
      merged.style = { ...(ours as object), ...(theirs as object) };
    }
  }
  merged.className = cn(props.className, childProps.className as string | undefined);
  merged.ref = mergeRefs(ref, childProps.ref as Ref<HTMLElement> | undefined);
  return cloneElement(child, merged);
}
