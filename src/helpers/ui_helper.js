import toastr from "toastr";

export const showMessage = (msg, isError) => {
  toastr.options = {
    closeButton: true
  }
  if (isError) toastr.error(msg)
  else toastr.success(msg)
}