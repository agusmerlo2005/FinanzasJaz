import { useEffect, useState } from 'react'

// Botón para instalar la PWA (aparece solo si el navegador lo permite).
export default function InstallButton() {
  const [prompt, setPrompt] = useState(null)
  const [instalada, setInstalada] = useState(
    () => window.matchMedia?.('(display-mode: standalone)').matches,
  )

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault()
      setPrompt(e)
    }
    const onInstalada = () => setInstalada(true)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalada)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalada)
    }
  }, [])

  if (instalada || !prompt) return null

  async function instalar() {
    prompt.prompt()
    await prompt.userChoice
    setPrompt(null)
  }

  return (
    <button className="btn btn-oro" onClick={instalar} title="Instalar en tu dispositivo">
      ⬇ Instalar app
    </button>
  )
}
