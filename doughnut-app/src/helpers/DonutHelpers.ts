import Icons from "../Icons";

export const findIconSrc = (symbolId: string) => {
  const symbolIdWithoutPng = symbolId?.substring(
    0,
    symbolId.length - 4,
  ) as keyof typeof Icons;
  return Icons[symbolIdWithoutPng];
};

export const formatConnectionName = (connectionName: string) => {
  const split = connectionName.split("_");

  const capitalized = split.map((word) => {
    if (word === "the") return word;
    return word[0].toUpperCase() + word.substring(1);
  });

  console.log(capitalized);
  return capitalized.join(" ");
};
