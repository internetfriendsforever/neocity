import createRegl from 'regl'
import mat4 from 'gl-mat4'
import vec3 from 'gl-vec3'

const regl = createRegl({
  pixelRatio: 0.25,
  attributes: {
    alpha: false,
    antialias: false
  }
})

document.querySelector('canvas').style.imageRendering = 'pixelated'

const reflection = regl.framebuffer({
  depth: false
})

const camera = regl({
  uniforms: {
    projection: ({ viewportWidth, viewportHeight }) => {
      const ratio = viewportWidth / viewportHeight
      return mat4.ortho([], -15 * ratio, 15 * ratio, -15, 15, -100, 100)
    },
    view: ({ tick }) => {
      const t = tick / 80
      const eye = vec3.normalize([], [Math.cos(t), Math.sin(t) * 0.25 + 0.25, Math.sin(t)])
      const center = [0, 0, 0]
      const up = [0, 1, 0]
      return mat4.lookAt([], eye, center, up)
    },
    yScale: 1
  }
})

const reflect = regl({
  uniforms: {
    yScale: -1.0
  },

  framebuffer: reflection
})

const model = regl({
  vert: `
    uniform mat4 projection;
    uniform mat4 model;
    uniform mat4 view;
    uniform float yScale;
    attribute vec3 position;
    varying vec2 reflectionPosition;

    void main() {
      vec4 worldSpacePosition = model * vec4(position, 1);
      worldSpacePosition.y *= yScale;
      reflectionPosition = vec4(projection * view * worldSpacePosition).xy / 2.0 + vec2(0.5, 0.5);
      gl_Position = projection * view * worldSpacePosition;
    }
  `,

  uniforms: {
    model: mat4.identity([])
  }
})

const ground = regl({
  frag: `
    precision mediump float;
    uniform sampler2D reflectionMap;
    varying vec2 reflectionPosition;

    void main() {
      vec3 color = texture2D(reflectionMap, reflectionPosition).rgb;

      color = mix(color, vec3(0.05, 0.0, 0.12), 0.8);

      gl_FragColor = vec4(color, 1);
    }
  `,

  attributes: {
    position: [
      [-10.0, 0.0, -10.0],
      [-10.0, 0.0, 10.0],
      [10.0, 0.0, -10.0],
      [10.0, 0.0, 10.0]
    ]
  },

  uniforms: {
    reflectionMap: reflection
  },

  elements: [
    [0, 1, 2],
    [1, 2, 3]
  ]
})

const triangle = regl({
  frag: `
    precision mediump float;
    uniform vec3 color;
    void main() {
      gl_FragColor = vec4(color, 1);
    }
  `,

  attributes: {
    position: [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 2, 0]
    ]
  },

  uniforms: {
    model: (context, { position }) => mat4.translate([], mat4.identity([]), position),
    color: regl.prop('color')
  },

  count: 3
})

const scene = () => {
  triangle([{
    position: [-1, 0, 4],
    color: [1, 0, 0]
  }, {
    position: [4, 0, -2],
    color: [0, 1, 0]
  }, {
    position: [-4, 0, -5],
    color: [0, 0, 1]
  }])
}

regl.frame(({ time, viewportWidth, viewportHeight }) => {
  camera(() => {
    model(() => {
      reflection.resize(viewportWidth, viewportHeight)

      reflect(() => {
        regl.clear({
          color: [0, 0, 0, 1]
        })

        scene()
      })

      ground()
      scene()
    })
  })
})
