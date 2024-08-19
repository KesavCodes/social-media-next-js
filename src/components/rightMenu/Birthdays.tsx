import Image from "next/image";
import Link from "next/link";

const Birthdays = () => {
  return (
    <section className="p-4 bg-white rounded-lg shadow-md text-sm">
      {/* TOP */}
      <div className="flex justify-between">
        <span className="text-gray-500 font-semibold">Birthdays</span>
      </div>
      {/* USER */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Image
            src="https://images.unsplash.com/photo-1689616977225-bf0ab4ae1ac5?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="profile pic"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium">Tony Start</span>
        </div>
        <button className="bg-blue-500 text-white px-2 py-1 text-xs rounded-md">
          Celebrate
        </button>
      </div>
      {/* USER */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Image
            src="https://images.unsplash.com/photo-1559532253-94d7e4f01119?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="profile pic"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium">Peter Parker</span>
        </div>
        <button className="bg-blue-500 text-white px-2 py-1 text-xs rounded-md">
          Celebrate
        </button>
      </div>
      {/* UPCOMING BIRTHDAYS */}
      <div className="flex p-4 mt-4 bg-slate-100 rounded-lg items-center gap-2">
        <Image src="/gift.png" alt="profile pic" width={24} height={24} />
        <Link className="flex flex-col gap-1 text-xs" href="/">
          <span className="text-gray-700 font-semibold">
            Upcoming Birthdays
          </span>
          <span className="text-gray-500">See other 18 upcoming birthdays</span>
        </Link>
      </div>
    </section>
  );
};

export default Birthdays;
