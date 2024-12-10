export const isSpam = (
  message: string,
  spamMessages: Map<string, number>
): string | null => {
  const spamList = Array.from(spamMessages.keys());
  const messageWords = message.split(/\s+/); // order doesnt matter

  let bestMatch: string | null = null;
  let bestMatchPercentage = 0;

  for (const spamMessage of spamList) {
    const spamWords = spamMessage.split(/\s+/);
    const commonWordsCount = messageWords.filter((word) =>
      spamWords.includes(word.toLowerCase())
    ).length;

    const percentMatch = (commonWordsCount / messageWords.length) * 100;

    if (percentMatch > bestMatchPercentage) {
      bestMatchPercentage = percentMatch;
      bestMatch = spamMessage;
    }
  }

  return bestMatchPercentage >= 80 ? bestMatch : null;
};
