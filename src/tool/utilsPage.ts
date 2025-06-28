export function scrollToDesignatedElement(eleId: string) {
  const targetEle = document.getElementById(eleId)
  if (targetEle) {
    const targetHeightOffset = targetEle.getBoundingClientRect().y - 70
    window.scrollBy({
      left: 0,
      top: targetHeightOffset,
      behavior: 'instant'
    })
  }
}
