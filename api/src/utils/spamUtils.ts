import levenshtein from "fast-levenshtein";

export const isSpam = (
  message: string,
  spamMessages: Map<string, number>
): string | null => {
  const spamList = Array.from(spamMessages.keys());
  const messageWords = message.split(/\s+/); // Order doesn't matter

  let bestMatch: string | null = null;
  let bestMatchPercentage = 0;

  for (const spamMessage of spamList) {
    const spamWords = spamMessage.split(/\s+/);

    const commonWordsCount = messageWords.filter((word) =>
      spamWords.includes(word.toLowerCase())
    ).length;

    const wordMatchPercentage = (commonWordsCount / messageWords.length) * 100;

    const distance = levenshtein.get(
      message.toLowerCase(),
      spamMessage.toLowerCase()
    );
    const maxLength = Math.max(message.length, spamMessage.length);
    const levenshteinPercentage = ((maxLength - distance) / maxLength) * 100;

    const lengthDifference = Math.abs(message.length - spamMessage.length);
    const lengthMatchPercentage = lengthDifference < 5 ? 100 : 0;

    const combinedMatchPercentage = Math.max(
      wordMatchPercentage,
      levenshteinPercentage,
      lengthMatchPercentage
    );

    if (combinedMatchPercentage > bestMatchPercentage) {
      bestMatchPercentage = combinedMatchPercentage;
      bestMatch = spamMessage;
    }
  }

  return bestMatchPercentage >= 80 ? bestMatch : null;
};
