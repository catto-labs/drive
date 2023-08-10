import { type Component } from "solid-js";

import cattoDriveBox from "@/assets/icon/box.png";
import cattoDriveCatto from "@/assets/icon/catto.png";

import SpinnerRingResize from "~icons/svg-spinners/ring-resize";

import { Motion } from "@motionone/solid";

const FullscreenLoader: Component<{
  finished: boolean
  message: string
}> = (props) => (
  <Motion.div class="bg-surface0 w-screen h-screen relative flex items-center justify-center"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ delay: 1, duration: 0.5 }}
  >
    <img
      src={cattoDriveBox}
      class="absolute mx-auto my-auto w-48 z-10"
    />

    <img
      src={cattoDriveCatto}
      class="absolute mx-auto my-auto w-41 transition-all"
      classList={{ "-mt-48": props.finished, "-mt-10": !props.finished }}
    />

    <div class="mt-56 text-center">
      <div class="inline-flex gap-x-2 mt-1">
        <SpinnerRingResize class="my-auto text-text" />
        <h1 class="text-lg font-semibold my-auto text-text">
          Loading...
        </h1>
      </div>
      <p class="text-subtext0">
        {props.message}
      </p>
    </div>
  </Motion.div>
);

export default FullscreenLoader;
