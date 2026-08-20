// Gemini replies use light markdown (**bold**, `code`) even for short answers -
// this renders just enough of it to avoid showing raw asterisks/backticks,
// without pulling in a full markdown library for a one-line chat bubble.
const INLINE_PATTERN = /\*\*(.+?)\*\*|`(.+?)`/g;

const parseLine = (line: string, keyPrefix: string) => {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;

  INLINE_PATTERN.lastIndex = 0;
  while ((match = INLINE_PATTERN.exec(line)) !== null) {
    if (match.index > lastIndex) nodes.push(line.slice(lastIndex, match.index));
    if (match[1] !== undefined) {
      nodes.push(<strong key={`${keyPrefix}-${i++}`}>{match[1]}</strong>);
    } else {
      nodes.push(
        <code key={`${keyPrefix}-${i++}`} className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/15 font-mono text-[0.9em]">
          {match[2]}
        </code>
      );
    }
    lastIndex = INLINE_PATTERN.lastIndex;
  }
  if (lastIndex < line.length) nodes.push(line.slice(lastIndex));
  return nodes;
};

const ChatMessageText = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {parseLine(line, String(i))}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
};

export default ChatMessageText;
