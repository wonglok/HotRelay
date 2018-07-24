export const DataTypes = [
  {
    _id: 'vs-fs-shader',
    name: 'Shader Editor',

    makeOne () {
      return {
        _id: makeID(),
        name: this.name,
        type: this._id,
        ready: false,
        path: 'shader/my-first-shader',

        vs:
`void main ( void ) {
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  vec4 outputPos = projectionMatrix * mvPosition;
  gl_Position = outputPos;
}
`,
        fs:
`void main () {
  gl_FragColor = vec4(vec3(0.5), 1.0);
}`
      }
    }
  },
  {
    _id: 'sliders',
    name: 'Slider Editor',

    makeOne () {
      return {
        _id: makeID(),
        name: this.name,
        type: this._id,
        ready: false,
        path: 'slider/my-sliders',

        sliders: [
          {
            id: 's1',
            value: 0,
            min: 0,
            max: 100
          }
        ]
      }
    }
  },
  {
    _id: 'drawing',
    name: 'Drawing Editor',

    makeOne () {
      return {
        _id: makeID(),
        name: this.name,
        type: this._id,
        ready: false,
        path: 'drawing/my-drawings',

        undo: [],
        lines: []
      }
    }
  }
]

export const makeID = () => {
  return '_' + Math.random().toString(36).substring(2, 15)
}
