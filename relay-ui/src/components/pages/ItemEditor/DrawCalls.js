export const setup = ({ canvas, w, h }) => {
  let ctx = canvas.getContext('2d')
  canvas.width = w
  canvas.height = h

  return {
    ctx
  }
}

export const clearAll = ({ ctx, color }) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

export const makeBorder = ({ ctx, color }) => {
  ctx.strokeStyle = color || 'rgba(0,0,0,0.5)'
  ctx.lineWidth = '1.0'
  ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

export const drawLines = ({ ctx, lines, width, height }) => {
  // ctx.strokeStyle = 'grey'
  // ctx.lineWidth = '1'

  for (var i = 0; i < lines.length; i++) {
    let line = lines[i]
    let currentLinePoints = line.points
    ctx.strokeStyle = line.strokeStyle || 'grey'
    ctx.lineWidth = line.lineWidth || '1.0'

    if (line.strokeStyle === 'white' || line.strokeStyle === 'rgba(255,255,255,1)') {
      ctx.globalCompositeOperation = 'xor'
    } else {
      ctx.globalCompositeOperation = 'source-over'
    }

    // let lWidth = line.width
    // let lHeight = line.height

    // let minWidth = Math.min(line.width, width)
    // let maxWidth = Math.max(line.width, width)

    // // let minHeight = Math.min(line.height, height)
    // // let maxHeight = Math.max(line.height, height)

    // let scale = minWidth / maxWidth

    // let aspect = lWidth / lHeight

    let width2 = width// * scale * aspect
    let height2 = height// * scale * aspect

    if (currentLinePoints && currentLinePoints.length) {
      for (var j = 0; j < currentLinePoints.length; j++) {
        let curPt = currentLinePoints[j]
        if (curPt && curPt.x && curPt.y) {
          if (j === 0) {
            ctx.beginPath()
            ctx.moveTo(width2 * 0.5 + width2 * 0.5 * curPt.x, height2 * 0.5 + height2 * -0.5 * curPt.y)
          } else if (j > 0 && j !== currentLinePoints.length - 1) {
            ctx.lineTo(width2 * 0.5 + width2 * 0.5 * curPt.x, height2 * 0.5 + height2 * -0.5 * curPt.y)
          } else if (j === currentLinePoints.length - 1) {
            ctx.stroke()
          }
        }
      }
    }
  }
}
