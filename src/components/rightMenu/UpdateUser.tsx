"use client";

import { updateProfile } from "@/lib/actions";
import { User } from "@prisma/client";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useActionState } from "react";
import UpdateButton from "./UpdateButton";

const UpdateUser = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);
  const [cover, setCover] = useState<any>(user.cover);
  const [state, formAction] = useActionState(updateProfile, {
    success: false,
    error: false,
  });
  const router = useRouter();
  const handleModalClose = () => {
    setOpen(false);
    state.success && router.refresh();
  };
  return (
    <div>
      <span
        className="text-blue-500 cursor-pointer text-sm items-center font-medium"
        onClick={() => setOpen(true)}
      >
        Update
      </span>
      {open && (
        <div className="absolute w-screen h-screen top-0 left-0 bg-black bg-opacity-65 flex items-center justify-center z-50">
          <form
            action={(formData) => formAction({ formData, cover })}
            className="p-12 bg-white rounded-lg shadow-md flex flex-col gap-2 w-full md:w-1/2 xl:w-1/3 relative"
          >
            <div
              className="text-red-500 absolute top-2 right-3 font-bold cursor-pointer"
              onClick={handleModalClose}
            >
              X
            </div>
            <h1>Update Profile</h1>
            <div className="mt-4 text-xs text-gray-500">
              Use the navbar profile to change avatar or username.
            </div>

            <CldUploadWidget
              uploadPreset="social"
              onSuccess={(result) =>
                setCover(
                  typeof result?.info !== "string"
                    ? result?.info?.secure_url
                    : "/noCover.png"
                )
              }
            >
              {({ open }) => {
                return (
                  <div className="flex flex-col gap-4 my-4">
                    <label htmlFor="">Cover Picture</label>
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => open()}
                    >
                      <Image
                        src={cover || "/noCover.png"}
                        alt="cover img"
                        width={48}
                        height={32}
                        className="h-8 w-12 rounded-md object-cover shadow-sm"
                      />
                      <span className="text-xs underline text-gray-600">
                        change
                      </span>
                    </div>
                  </div>
                );
              }}
            </CldUploadWidget>

            <div className="flex flex-wrap justify-between gap-2 xl:gap-4">
              {/* INPUT */}
              <div className="flex flex-col gap-4">
                <label htmlFor="firstName" className="text-gray-500 text-xs ">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder={user.firstName || "John"}
                  defaultValue={user.firstName || ""}
                  className="ring-1 ring-gray-300 p-4 rounded-md text-sm"
                />
              </div>
              {/* INPUT */}
              <div className="flex flex-col gap-4">
                <label htmlFor="surName" className="text-gray-500 text-xs ">
                  Sur Name
                </label>
                <input
                  type="text"
                  name="surName"
                  placeholder={user.surName || "Doe"}
                  defaultValue={user.surName || ""}
                  className="ring-1 ring-gray-300 p-4 rounded-md text-sm"
                />
              </div>
              {/* INPUT */}
              <div className="flex flex-col gap-4">
                <label htmlFor="description" className="text-gray-500 text-xs ">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  placeholder={user.description || "Life is beautiful..."}
                  defaultValue={user.description || ""}
                  className="ring-1 ring-gray-300 p-4 rounded-md text-sm"
                />
              </div>
              {/* INPUT */}
              <div className="flex flex-col gap-4">
                <label htmlFor="city" className="text-gray-500 text-xs ">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder={user.city || "New York"}
                  defaultValue={user.city || ""}
                  className="ring-1 ring-gray-300 p-4 rounded-md text-sm"
                />
              </div>
              {/* INPUT */}
              <div className="flex flex-col gap-4">
                <label htmlFor="school" className="text-gray-500 text-xs ">
                  School
                </label>
                <input
                  type="text"
                  name="school"
                  placeholder={user.school || "MIT"}
                  defaultValue={user.school || ""}
                  className="ring-1 ring-gray-300 p-4 rounded-md text-sm"
                />
              </div>
              {/* INPUT */}
              <div className="flex flex-col gap-4">
                <label htmlFor="work" className="text-gray-500 text-xs ">
                  Work
                </label>
                <input
                  type="text"
                  name="work"
                  placeholder={user.work || "Apple Inc."}
                  defaultValue={user.work || ""}
                  className="ring-1 ring-gray-300 p-4 rounded-md text-sm"
                />
              </div>
              {/* INPUT */}
              <div className="flex flex-col gap-4">
                <label htmlFor="website" className="text-gray-500 text-xs ">
                  Website
                </label>
                <input
                  type="text"
                  name="website"
                  placeholder={user.website || "johnDoe.com"}
                  defaultValue={user.website || ""}
                  className="ring-1 ring-gray-300 p-4 rounded-md text-sm"
                />
              </div>
            </div>
            <UpdateButton />
            {state.success && (
              <span className="text-green-500">
                Profile has been updated successfully
              </span>
            )}
            {state.error && (
              <span className="text-red-500">
                Something went wrong. Not able to update the profile.
              </span>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateUser;
