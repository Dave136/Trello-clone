export default function BoardSkeleton({ count }: { count: number }) {
  const boards = Array(count).fill({});

  return (
    <div className="pt-16 h-full">
      <div className="grid grid-cols-5 gap-2.5 mx-2.5">
        {boards.map((_, index) => (
          <div
            className="animate-pulse bg-gray-200 rounded pl-4 pr-3 pt-3"
            key={index}
          >
            <div className="h-4" />
            <div className="h-16 mt-4" />
            <div className="h-16 mt-4 mb-10" />
          </div>
        ))}
      </div>
    </div>
  );
}
