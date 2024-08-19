import Image from "next/image";

const Ad = ({ size }: { size: "sm" | "md" | "lg" }) => {
  return (
    <section className="p-4 bg-white rounded-lg shadow-md text-sm">
      {/* TOP */}
      <header className="flex justify-between">
        <span className="text-gray-500 font-semibold">Sponsored Ad</span>
        <Image
          src="/more.png"
          alt="settings icon"
          width={20}
          height={20}
          className="w-5 h-5 rounded-full cursor-pointer"
        />
      </header>
      {/* CONTENT */}
      <div
        className={`flex flex-col mt-4 ${size === "sm" ? "gap-2" : "gap-4"}`}
      >
        <div
          className={`relative w-full ${
            size === "sm" ? "h-24" : size === "md" ? "h-36" : "h-48"
          }`}
        >
          <Image
            src="https://images.unsplash.com/photo-1698047681432-006d2449c631?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Ad image"
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <div className="flex items-center gap-4">
          <Image
            src="https://images.unsplash.com/photo-1698047681432-006d2449c631?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Ad image"
            width={24}
            height={24}
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="text-blue-500 font-medium">ReadySetGo career</span>
        </div>
        <p className={`${size === "sm" ? "text-xs" : "text-sm"}`}>
          {size === "sm"
            ? "lorem ipsum dolor sit amet, consectetur adip"
            : size === "md"
            ? "lorem ipsum d lorem ipsum lorem ipsum dolor sit amet, consectetur adip lorem ipsum dolor sit amet, consectetur adip"
            : "lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non ipsum metus, auctor lorem ipsum d lorem ipsum lorem ipsum dolor sit amet, consectetur adip lorem ipsum dolor sit amet, consectetur adip consectetur adip lorem ipsum dolor sit amet, consectetur adip"}
        </p>
        <button className="bg-gray-200 text-gray-500 p-2 text-xs rounded-lg">Learn more</button>
      </div>
    </section>
  );
};

export default Ad;
