import createRegl from 'regl'
import mat4 from 'gl-mat4'

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

const camera = regl({
  uniforms: {
    projection: () => mat4.ortho([], -10, 10, -10, 10, -100, 100),
    view: ({ tick }) => {
      const t = tick / 20
      const eye = [Math.cos(t), 2, Math.sin(t)]
      const center = [0, 0, 0]
      const up = [0, 1, 0]
      return mat4.lookAt([], eye, center, up)
    },
    model: mat4.identity([])
  }
})

const triangle = regl({
  vert: `
    uniform mat4 projection;
    uniform mat4 model;
    uniform mat4 view;
    attribute vec3 position;

    void main() {
      gl_Position = projection * view * model * vec4(position, 1.0);
    }
  `,

  uniforms: {
    model: mat4.identity([])
  },

  frag: `
    void main() {
      gl_FragColor = vec4(1, 1, 1, 1);
    }
  `,

  attributes: {
    position: [
      [1, -1, 0],
      [-1, -1, 0],
      [0, 5, 0]
    ]
  },

  count: 3
})

regl.frame(({ time }) => {
  camera(() => {
    triangle()
  })
})
