import {
  AlertShakeIcon,
  ArrowIcon,
  BadgeDollarIcon,
  BellIcon,
  ChevronIcon,
  CodeIcon,
  CopyIcon,
  GlobeIcon,
  InfoIcon,
  LockIcon,
  LogoutIcon,
  MenuIcon,
  PaperclipIcon,
  PlusMinusIcon,
  SendIcon,
  SidebarIcon,
  SpinnerIcon,
  TrashIcon,
  VolumeIcon,
  WaveformIcon,
} from "@/components/dx/animated-icons";

export default function AnimatedIconsDemo() {
  return (
    <div className="grid grid-cols-7 gap-2">
      <SidebarIcon />
      <CodeIcon />
      <LockIcon />
      <InfoIcon />
      <LogoutIcon />
      <BadgeDollarIcon />
      <CopyIcon text="npx @sidioralabs/designx-ui@latest init" />
      <WaveformIcon />
      <PlusMinusIcon />
      <ChevronIcon />
      <MenuIcon />
      <AlertShakeIcon />
      <GlobeIcon />
      <PaperclipIcon />
      <TrashIcon />
      <SendIcon />
      <BellIcon />
      <ArrowIcon />
      <VolumeIcon />
      <span className="grid size-10 place-items-center">
        <SpinnerIcon />
      </span>
    </div>
  );
}
