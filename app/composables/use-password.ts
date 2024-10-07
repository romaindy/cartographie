import { onMounted, onUnmounted } from 'vue'

export const usePassword = () => {
  const router = useRouter()
  let passcode = ''
  const debug = ref(false)

  function keyListener(e) {
    const code = e.keyCode || e.which
    passcode += String.fromCharCode(code)
    if (passcode.includes('admin')) {
      passcode = ''
      router.push('/administration')
    }
    if (passcode.includes('debug')) {
      passcode = ''
      debug.value = !debug.value
    }
  }

  onMounted(() => {
    document.addEventListener('keypress', keyListener)
  })

  onUnmounted(() => {
    document.removeEventListener('keypress', keyListener)
  })

  return { debug }
}
