export const getColor = (label: string) => {
  // TODO: add types
  const defaultColors: any = {
    design: 'border-none text-white px-2 bg-[#7193f1]',
    development: 'border-none px-2 bg-[#ffda6c]',
    feature: 'border-none text-white px-2 bg-[#00bcd4]',
    bugs: 'border-none px-2 bg-[#ef769f]',
    default: 'border-none text-white px-2 bg-[#000000]',
  };

  return defaultColors[label] || defaultColors.default;
};

const defaultInitializer = (index: number) => index;
export const createRange = (
  length: number,
  initializer: (index: number) => any = defaultInitializer
) => {
  return [...new Array(length)].map((_, index) => initializer(index));
};
