export const createFileUpload = (onFileUploaded: (files: FileList) => unknown) => {
  const input = document.createElement("input");
  input.setAttribute("multiple", "true");
  input.setAttribute("hidden", "true");
  input.setAttribute("type", "file");

  input.onchange = () => {
    const files = input.files;
    if (files !== null) {
      onFileUploaded(files);
    }

    input.remove();
  };

  document.body.appendChild(input);
  input.click();
}
