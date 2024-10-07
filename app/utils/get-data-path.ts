export function getDataPath() {
  return (
    (process.env.APPDATA
    || (process.platform == 'darwin'
      ? process.env.HOME + '/Library/Application Support'
      : process.env.HOME + '/.local/share')) + '/Cartographie'
  )
}
