import createRegl from 'regl'

const canvas = document.createElement('canvas')

canvas.width = 512
canvas.height = 320
canvas.style.width = '100%'
canvas.style.height = '62.5%'
canvas.style.imageRendering = 'pixelated'
canvas.style.background = 'black'
canvas.style.flex = '0 0 auto'

document.body.style.display = 'flex'
document.body.style.background = '#222'
document.body.style.margin = 0
document.body.appendChild(canvas)

const regl = createRegl(canvas)

const drawTriangle = regl({
  frag: `
  void main() {
    gl_FragColor = vec4(1, 0, 0, 1);
  }`,

  vert: `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0, 1);
  }`,

  attributes: {
    position: [[0, -1], [-1, 0], [1, 1]]
  },

  count: 3
})

drawTriangle()
