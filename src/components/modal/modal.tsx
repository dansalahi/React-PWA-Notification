import { Transition } from "@headlessui/react";
import { FC, memo, useRef } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: JSX.Element[] | JSX.Element;
};

export const Modal: FC<Props> = memo(
  ({ onClose, children, isOpen }) => {
    const ref = useRef(null);

    const closeModal = (e: any) => {
      if (ref.current === e.target) {
        onClose();
      }
    };
    return (
      <Transition 
      appear={true}
      show={isOpen}
      enter="transition-opacity duration-75"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      >
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900 bg-opacity-80 pb-14 h-fit"
          ref={ref}
          onClick={closeModal}
          style={{ minHeight: "100%" }}
        >
          {isOpen && children}
        </div>
      </Transition>
    );
  }
);
