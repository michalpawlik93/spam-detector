import { useState } from "react";

export const Informations = () => {
  const [visibility, setVisibility] = useState([true, true, true]);

  const closeNotification = (index: number) => {
    const updatedVisibility = [...visibility];
    updatedVisibility[index] = false;
    setVisibility(updatedVisibility);
  };

  return (
    <div>
      {visibility[0] && (
        <div className="bg-orange-400 text-white p-3 rounded-lg mb-4 relative">
          <button
            className="absolute top-2 right-2 text-white text-xl"
            onClick={() => closeNotification(0)}
          >
            &times;
          </button>
          <p className="text-sm font-semibold">
            The current version of the software only supports active messages.
            Archived messages are not retrieved.
          </p>
        </div>
      )}
      {visibility[1] && (
        <div className="bg-blue-400 text-white p-3 rounded-lg mb-4 relative">
          <button
            className="absolute top-2 right-2 text-white text-xl"
            onClick={() => closeNotification(1)}
          >
            &times;
          </button>
          <p className="text-sm font-semibold">
            Start a chat conversation to view the first messages.
          </p>
        </div>
      )}
      {visibility[2] && (
        <div className="bg-blue-400 text-white p-3 rounded-lg mb-4 relative">
          <button
            className="absolute top-2 right-2 text-white text-xl"
            onClick={() => closeNotification(2)}
          >
            &times;
          </button>
          <p className="text-sm font-semibold">
            The algorithm uses the Levenshtein distance to detect spam messages.
          </p>
          <p className="text-sm">
            The Levenshtein distance measures the minimum number of
            single-character edits (insertions, deletions, or substitutions)
            required to transform one string into another. The implementation
            calculates a similarity percentage based on the distance and the
            length of the longest string. To improve accuracy, the words in both
            the input message and stored spam messages are sorted
            alphabetically, ensuring that variations in word order do not affect
            similarity calculations. This approach helps detect messages with
            rearranged words as spam while maintaining efficiency.
          </p>
        </div>
      )}
    </div>
  );
};
