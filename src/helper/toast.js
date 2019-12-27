// 全局状态下显示轻提示
let _toast

export function setToast(toastRef) {
  _toast = toastRef
}

export function showToast(text) {
  _toast.show(text)
}
