import { runFlakes } from './snowflake'
self.onmessage = async (event) => {
  await runFlakes(event.data.canvas.getContext('2d'), 6)
}
