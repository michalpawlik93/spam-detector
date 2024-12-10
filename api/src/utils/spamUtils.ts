export const isSpam = (
  message: string,
  spamMessages: Map<string, number>
): boolean => {
  const spamList = Array.from(spamMessages.keys());
  const messageWords = message.split(/\s+/);
  const spamWords = spamList.flatMap((spamMessage) => spamMessage.split(/\s+/));
  const commonWordsCount = messageWords.filter((word) =>
    spamWords.includes(word.toLowerCase())
  ).length;

  const percentMatch = (commonWordsCount / messageWords.length) * 100;
  return percentMatch >= 80;
};
