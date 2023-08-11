import {
  createSignal,
  type Component,
  createEffect,
  on,
  Show,
  onCleanup,
} from "solid-js";

import cattoDriveBox from "@/assets/icon/box.png";
import cattoDriveCatto from "@/assets/icon/catto.png";

import SpinnerRingResize from "~icons/svg-spinners/ring-resize";

import { Motion, Presence } from "@motionone/solid";

const defaultLoaderData = {
  finished: true,
  message: "",
};

const [loaderData, setLoaderData] = createSignal(defaultLoaderData);
let endLoaderTimeout: ReturnType<typeof setTimeout> | undefined;

export const FullscreenLoaderEntry: Component = () => {
  const [showLoader, setShowLoader] = createSignal(true);
  createEffect(
    on(loaderData, (data) => {
      if (endLoaderTimeout) {
        clearTimeout(endLoaderTimeout);
        endLoaderTimeout = setTimeout(() => {
          setShowLoader(!data.finished);
          endLoaderTimeout = undefined;
        }, 1_000);
      }
      // If there was no timeout, give the value directly.
      else setShowLoader(!data.finished);
    })
  );

  return (
    <Presence exitBeforeEnter>
      <Show when={showLoader()}>
        <Motion.div
          class="z-50 bg-surface0 fixed inset-0 flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <img src={cattoDriveBox} class="absolute mx-auto my-auto w-48 z-10" />

          <img
            src={cattoDriveCatto}
            class="absolute mx-auto my-auto w-41 transition-all transition-duration-500"
            classList={{
              "-mt-48": loaderData().finished,
              "-mt-10": !loaderData().finished,
            }}
          />

          <div class="mt-56 text-center">
            <div class="inline-flex gap-x-2 mt-1">
              <Show when={!loaderData().finished}>
                <SpinnerRingResize class="my-auto text-text" />
              </Show>

              <h1 class="text-lg font-semibold my-auto text-text">
                {!loaderData().finished ? "Loading..." : "Welcome!"}
              </h1>
            </div>
            <p class="text-subtext0">{loaderData().message}</p>
          </div>
        </Motion.div>
      </Show>
    </Presence>
  );
};

const FullscreenLoader: Component<{
  message: string;
}> = (props) => {
  createEffect(
    on(
      () => props.message,
      (message) => {
        setLoaderData({ finished: false, message });
        onCleanup(() => {
          // If the message is different, that means that another
          // loader have taken the lead.
          if (props.message === loaderData().message) {
            setLoaderData(defaultLoaderData);
          }
        });
      }
    )
  );

  return <></>;
};

export default FullscreenLoader;
