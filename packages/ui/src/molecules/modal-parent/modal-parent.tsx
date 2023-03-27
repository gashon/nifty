import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import { FC, Fragment, ReactNode, PropsWithChildren } from 'react';
import { FiX } from 'react-icons/fi';

type ModalProps = {
  title: ReactNode;
  description?: ReactNode;
  onClose: () => void;
  open?: boolean;
};

export const ParentModal: FC<PropsWithChildren<ModalProps>> = ({
  title,
  description,
  onClose,
  children,
  open = false,
}) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10 font-[sans_serif]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-zinc-100 p-6 text-left align-middle shadow-xl transition-all dark:bg-zinc-900">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-zinc-700 dark:text-zinc-300"
                    data-testid="close-modal"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                <Dialog.Title
                  as="h3"
                  className="text-center text-2xl font-bold leading-6 text-black dark:text-white"
                >
                  {title}
                </Dialog.Title>
                {description && (
                  <Dialog.Description className="mt-3 mb-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
                    {description}
                  </Dialog.Description>
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
