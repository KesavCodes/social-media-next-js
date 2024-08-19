import { useFormStatus } from "react-dom";

const AddPostButton = () => {
  const { pending } = useFormStatus();
  return pending ? (
    <div
      className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  ) : (
    <button
      className="rounded-md bg-blue-500 text-white px-3 py-1"
      disabled={pending}
    >
      send
    </button>
  );
};

export default AddPostButton;
