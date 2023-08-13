import { type JSX, type FlowComponent, createSignal, onCleanup, batch } from "solid-js";
import { render } from "solid-js/web";
import { Dialog } from "@kobalte/core";

export interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const Modal: FlowComponent<ModalProps> & {
  Title: typeof Dialog["Title"]
  Description: typeof Dialog["Description"]
  CloseButton: typeof Dialog["CloseButton"]
} = (props) => (
  <Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay class="fixed inset-0 z-50 animate-fade-out ui-expanded:animate-fade-in animate-duration-150 ui-expanded:animate-duration-150 bg-text/75" />
      <div class="fixed inset-0 z-50 flex items-center justify-center">
        <Dialog.Content class="z-50 m-[16px] max-w-128 w-full animate-scale-out ui-expanded:animate-scale-in animate-duration-200 ui-expanded:animate-duration-200 rounded-lg bg-surface0 border border-surface1 p-4 shadow">
          {props.children}
        </Dialog.Content>
      </div>
    </Dialog.Portal>
  </Dialog.Root>
);

Modal.Title = Dialog.Title;
Modal.Description = Dialog.Description;
Modal.CloseButton = Dialog.CloseButton;

export const createModal = <T,>(createModalContent: (components: {
  Title: typeof Modal["Title"]
  Description: typeof Modal["Description"]
  CloseButton: typeof Modal["CloseButton"],
  data: T | null
}) => JSX.Element) => {
  const [data, setData] = createSignal<T | null>(null);
  const [open, setOpen] = createSignal(false);

  const portal = document.createElement("div");
  document.body.appendChild(portal);

  const dispose = render(() => (
    <Modal open={open()} onOpenChange={setOpen}>
      {createModalContent({
        Title: Modal.Title,
        Description: Modal.Description,
        CloseButton: Modal.CloseButton,
        data: data()
      })}
    </Modal>
  ), portal);

  const show = (new_data?: T) => batch(() => {
    setOpen(true);
    setData(() => (new_data ?? null));
  });

  const hide = () => batch(() => {
    setOpen(false);
    setData(null);
  });

  onCleanup(() => {
    dispose();
    portal.remove();
  });

  return [show, hide] as const;
};