import Ad from "../Ad";
import PanelOptions from "./PanelOptions";
import ProfileCard from "./ProfileCard";

const LeftMenu = ({ type }: { type: "home" | "profile" }) => {
  return (
    <div className="flex flex-col gap-6">
      {type === "home" && <ProfileCard />}
      <PanelOptions />
      <Ad size="sm" />
    </div>
  );
};

export default LeftMenu;
