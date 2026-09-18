export function PlayIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M6 4.5v15l13-7.5-13-7.5z" />
    </svg>
  );
}

export function PauseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
    </svg>
  );
}

export function PrevIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M6 5h2v14H6zM19 5v14l-11-7z" />
    </svg>
  );
}

export function NextIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M16 5h2v14h-2zM5 5v14l11-7z" />
    </svg>
  );
}

export function VolumeIcon({ level = 1, ...props }) {
  if (level === 0) {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
        <path d="M4 9v6h4l5 5V4L8 9H4zM17.7 12l2.6-2.6-1.4-1.4-2.6 2.6-2.6-2.6-1.4 1.4L14.9 12l-2.6 2.6 1.4 1.4 2.6-2.6 2.6 2.6 1.4-1.4L17.7 12z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M4 9v6h4l5 5V4L8 9H4z" />
      <path d="M16.5 12a4.5 4.5 0 00-2.5-4v8a4.5 4.5 0 002.5-4z" />
      {level > 0.5 && <path d="M18.5 5.5a10 10 0 010 13" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />}
    </svg>
  );
}

export function ShuffleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
    </svg>
  );
}

export function RepeatIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...props}>
      <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
    </svg>
  );
}

export function CloseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

export function PlusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...props}>
      <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
    </svg>
  );
}

export function RemoveIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...props}>
      <path d="M5 11h14v2H5z" />
    </svg>
  );
}

export function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
      <path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z" />
    </svg>
  );
}

export function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
      <path d="M10.5 3a7.5 7.5 0 105.9 12.1l4.75 4.75 1.4-1.4-4.75-4.75A7.5 7.5 0 0010.5 3zm0 2a5.5 5.5 0 110 11 5.5 5.5 0 010-11z" />
    </svg>
  );
}

export function LibraryIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
      <path d="M3 3h4v18H3zM10 3h4v18h-4zM17 3h4v18h-4z" />
    </svg>
  );
}
