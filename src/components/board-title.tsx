import { Star } from 'phosphor-react';

type Props = {
  title: string;
  addition?: boolean;
  starred?: boolean;
  handleClick: () => void;
  starToggling?: () => void;
};

const BoardTitle = ({
  title,
  addition,
  starred,
  handleClick = () => {},
  starToggling = () => {},
}: Props) => (
  <div
    role="button"
    tabIndex={0}
    onKeyDown={() => {}}
    onClick={() => handleClick()}
    className={`h-32 rounded-md p-2 font-semibold flex ${
      addition
        ? 'bg-gray-200 text-gray-900'
        : 'bg-blue-500 text-white justify-between'
    }`}
  >
    <div className={addition ? 'm-auto' : ''}>{title}</div>
    {!addition && (
      <div
        role="button"
        tabIndex={-1}
        className="flex"
        onClick={(e) => {
          e.stopPropagation();
          starToggling();
        }}
        onKeyDown={() => {}}
      >
        <Star
          size={16}
          weight={starred ? 'fill' : 'thin'}
          className="transform transition-all text-white text-opacity-75 hover:text-opacity-100 hover:translate-x-px scale-100 hover:scale-110 mt-auto"
        />
        {/* {starred ? (
          <StarFilled className="transform transition-all text-white text-opacity-75 hover:text-opacity-100 hover:translate-x-px scale-100 hover:scale-110 mt-auto" />
        ) : (
          <StarOutlined className="transform transition-all text-white text-opacity-75 hover:text-opacity-100 hover:translate-x-px scale-100 hover:scale-110 mt-auto" />
        )} */}
      </div>
    )}
  </div>
);

export default BoardTitle;
