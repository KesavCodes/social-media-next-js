import Image from "next/image";
import Link from "next/link";

const PanelOptions = () => {
  const options = [
    { id: 1, optionName: "My Posts", src: "/posts.png" },
    { id: 2, optionName: "Activity", src: "/activity.png" },
    { id: 3, optionName: "Marketplace", src: "/market.png" },
    { id: 4, optionName: "Events", src: "/events.png" },
    { id: 5, optionName: "Albums", src: "/albums.png" },
    { id: 6, optionName: "Videos", src: "/videos.png" },
    { id: 7, optionName: "News", src: "/news.png" },
    { id: 8, optionName: "Courses", src: "/courses.png" },
    { id: 9, optionName: "Lists", src: "/lists.png" },
    { id: 10, optionName: "Settings", src: "/settings.png" },
  ];
  return (
    <div className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-md text-sm text-gray-500">
      {options.map((option) => {
        return (
          <>
            <Link
              href="/"
              key={option.id}
              className="flex items-center p-2 gap-4 rounded-lg hover:bg-slate-100"
            >
              <Image
                height={20}
                width={20}
                src={option.src}
                alt={`${option.optionName} icon`}
              />
              <span>{option.optionName}</span>
            </Link>
            <hr className="border-t-1 border-gray-50 w-36 self-center" />
          </>
        );
      })}
    </div>
  );
};

export default PanelOptions;
