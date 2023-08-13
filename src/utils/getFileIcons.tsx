import IconFileOutline from "~icons/mdi/file-outline";
import IconFileImageOutline from "~icons/mdi/file-image-outline";

export const getFileIcon = (file: any) => {
  const fileExtension = file.name.split(".").pop().toLowerCase();
  const imageFileExtensions = ["png", "jpg", "jpeg", "gif", "webp"];

  if (imageFileExtensions.indexOf(fileExtension) !== -1) {
    return <IconFileImageOutline class="text-xl" />;
  } else {
    return <IconFileOutline class="text-xl" />;
  }
};
