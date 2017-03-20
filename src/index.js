import createRegl from 'regl'
import mat4 from 'gl-mat4'
import vec3 from 'gl-vec3'

const regl = createRegl({
  pixelRatio: 0.5,
  attributes: {
    alpha: false,
    antialias: false
  }
})

document.querySelector('canvas').style.imageRendering = 'pixelated'

const camera = regl({
  uniforms: {
    projection: ({ viewportWidth, viewportHeight }) => {
      const ratio = viewportWidth / viewportHeight
      return mat4.ortho([], -10 * ratio, 10 * ratio, -10, 10, -100, 100)
    },
    view: ({ tick }) => {
      const t = tick / 80
      const eye = vec3.normalize([], [Math.cos(t), Math.sin(t) * 0.5 + 0.6, Math.sin(t)])
      const center = [0, 0, 0]
      const up = [0, 1, 0]
      return mat4.lookAt([], eye, center, up)
    },
    model: mat4.identity([])
  }
})

const model = regl({
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
  }
})

const ground = regl({
  frag: `
    void main() {
      gl_FragColor = vec4(1, 0, 1, 1);
    }
  `,

  attributes: {
    position: [
      [4, 0, 0],
      [-4, 0, 0],
      [0, 0, 4],
      [4, 0, 0],
      [-4, 0, 0],
      [0, 0, -4]
    ]
  },

  count: 6
})

const triangle = regl({
  frag: `
    void main() {
      gl_FragColor = vec4(1, 1, 1, 1);
    }
  `,

  attributes: {
    position: [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 2, 0]
    ]
  },

  count: 3
})

regl.frame(({ time }) => {
  camera(() => {
    model(() => {
      ground()
      triangle()
    })
  })
})
