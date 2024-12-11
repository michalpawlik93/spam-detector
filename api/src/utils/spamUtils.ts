import levenshtein from "fast-levenshtein";

export const isSpam = (
  message: string,
  spamMessages: Map<string, number>
): string | null => {
  const spamList = Array.from(spamMessages.keys());

  let bestMatch: string | null = null;
  let bestMatchPercentage = 0;

  for (const spamMessage of spamList) {
    const sortedMessage = sortWords(message);
    const sortedSpamMessage = sortWords(spamMessage);

    const levenshteinPercentage = calculateLevenshteinPercentage(
      sortedMessage,
      sortedSpamMessage
    );

    const lengthDifference = Math.abs(message.length - spamMessage.length);
    const lengthMatchPercentage = lengthDifference < 5 ? 100 : 0;

    const combinedMatchPercentage = Math.max(
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

const calculateLevenshteinPercentage = (
  message: string,
  spamMessage: string
): number => {
  const distance = levenshtein.get(message, spamMessage);
  const maxLength = Math.max(message.length, spamMessage.length);
  return ((maxLength - distance) / maxLength) * 100;
};

const sortWords = (text: string): string => {
  return text.toLowerCase().split(/\s+/).sort().join(" ");
};
