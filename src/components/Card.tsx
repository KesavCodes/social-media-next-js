import React from "react";

const Card = ({
  children,
  additionalClasses,
}: {
  children: React.ReactNode;
  additionalClasses: string;
}) => {
  return <div className="bg-white p-4 rounded-lg shadow-md">{children}</div>;
};

export default Card;
