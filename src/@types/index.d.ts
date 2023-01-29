type CardItem = {
  id: string;
  title: string;
  label: string;
  description: string;
};

type Card = {
  id: string;
  title: string;
  description: string;
  label: string;
  // tags: string[]; -> TODO
};

type BoardItem = {
  id: string;
  name: string;
  cards: Card[];
};

type IBoard = {
  id: string;
  title: string;
  userId: string;
  starred: boolean;
  items?: BoardItem[];
};
