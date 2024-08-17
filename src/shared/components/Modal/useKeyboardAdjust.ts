// useKeyboardAdjust.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useKeyboardAdjust() {
    const viewportHeight = ref(window.innerHeight)

    const adjustHeight = () => {
        viewportHeight.value = window.visualViewport?.height ?? window.innerHeight
    }

    onMounted(() => {
        if ('visualViewport' in window) {
            window.visualViewport?.addEventListener('resize', adjustHeight)
        } else {
            window.addEventListener('resize', adjustHeight)
        }
        adjustHeight()
    })

    onUnmounted(() => {
        if ('visualViewport' in window) {
            window.visualViewport?.removeEventListener('resize', adjustHeight)
        } else {
            window.removeEventListener('resize', adjustHeight)
        }
    })

    return { viewportHeight }
}