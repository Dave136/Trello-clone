export default function BoardsSkeleton({ count }: { count: number }) {
  const boards = Array(count).fill({});

  return (
    <div className="pt-16 py-4 px-3">
      <div className="flex mb-3 items-center text-xl">
        <div className="animate-pulse rounded-full h-8 w-8 bg-base-300 bg-base" />
        <div className="animate-pulse w-52 h-8 ml-5 bg-base-300" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {boards.map((_, index) => (
          <div
            className="animate-pulse rounded-md h-32 bg-base-300"
            key={index}
          >
            <div className="h-32 w-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
