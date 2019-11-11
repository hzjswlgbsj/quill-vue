<template>
  <div class="quill-editor" :style="heightStyle">
    <slot name="toolbar"></slot>
    <div ref="editor"></div>
  </div>
</template>

<script>
import defaultOptions from './options'
import _Quill from 'quill'
// import { ImageDrop } from 'quill-image-drop-module'
// import ImageResize from 'quill-image-resize-module'
import MarkdownShortcuts from 'quill-markdown-shortcuts'
import 'quill-integrated-custom'
import { IframeCustom,  VideoCustom, ImageUploadHandle } from 'quill-integrated-custom'
// import imageUpload from 'quill-plugin-image-upload'
import Test from './Test'

const Size = _Quill.import('attributors/style/size')
const Font = _Quill.import('attributors/style/font')

// 增加字体大小
Size.whitelist = ['10px', '11px', '12px', '14px', '16px', '18px', '22px', '24px', '30px', '36px']

// 增加字体
Font.whitelist = [
  'Microsoft YaHei',
  'SimSun',
  'SimHei',
  'Hiragino',
  'PingFang',
  'STSong',
  'STFangsong',
  'STKaiti',
  'Arial',
  'Times New Roman',
  'Calibri',
  'Comic Sans MS',
  'Courier New'
]

// register Size、Font
_Quill.register(Size, true)
_Quill.register(Font, true)

// register modules
_Quill.register({
  // 'modules/imageDrop': ImageDrop,
  // 'modules/ImageResize': ImageResize,
  'modules/markdownShortcuts': MarkdownShortcuts,
  'modules/customIframe': IframeCustom,
  'modules/customVideo': VideoCustom,
  'modules/imageUploadHandle': ImageUploadHandle
  // 'modules/imageUpload': imageUpload
}, true)

const Quill = window.Quill || _Quill

// pollfill Object.assign
if (typeof Object.assign !== 'function') {
  Object.defineProperty(Object, 'assign', {
    value (target, varArgs) {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object')
      }
      const to = Object(target)
      for (let index = 1; index < arguments.length; index++) {
        const nextSource = arguments[index]
        if (nextSource != null) {
          for (const nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey]
            }
          }
        }
      }
      return to
    },
    writable: true,
    configurable: true
  })
}

export default {
  name: 'quill-vue',

  props: {
    content: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      required: false,
      default: () => ({})
    },
    disabled: {
      type: Boolean,
      default: false
    },
    minHeight: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      localContent: '',
      defaultOptions
    }
  },

  computed: {
    heightStyle () {
      if (this.minHeight) {
        return {
          'min-height': this.minHeight
        }
      }
    }
  },

  watch: {
    // Watch content change
    content (newVal, oldVal) {
      if (this.quill) {
        if (newVal && newVal !== this.localContent) {
          this.localContent = newVal
          this.quill.clipboard.dangerouslyPasteHTML(newVal)
        } else if (!newVal) {
          this.quill.setText('')
        }
      }
    },
    // Watch value change
    value (newVal, oldVal) {
      if (this.quill) {
        if (newVal && newVal !== this.localContent) {
          this.localContent = newVal
          this.quill.clipboard.dangerouslyPasteHTML(newVal)
        } else if (!newVal) {
          this.quill.setText('')
        }
      }
    },
    // Watch disabled change
    disabled (newVal, oldVal) {
      if (this.quill) {
        this.quill.enable(!newVal)
      }
    }
  },

  methods: {
    // Init Quill instance
    initialize () {
      if (this.$el) {
        // Options
        this._options = Object.assign({}, this.defaultOptions, this.options)

        // Add history config
        this._options.modules.history = {
          delay: 1000,
          maxStack: 50,
          userOnly: false
        }

        // Add some awesome Modules
        // this._options.modules.imageDrop = true
        // this._options.modules.ImageResize = {
        //   displayStyles: {
        //     backgroundColor: 'white',
        //     border: 'none',
        //     color: 'black'
        //   },
        //   handleStyles: {
        //     backgroundColor: 'black',
        //     border: 'none',
        //     color: 'white'
        //   },
        //   modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
        // }
        this._options.modules.markdownShortcuts = {}
        this._options.modules.customIframe = {
          width: '100%',
          height: '500px'
        }
        this._options.modules.customVideo = {
          width: '100%',
          height: '500px'
        }
        // this._options.modules.customVuecomp = {
        //   viewComponent: Test,
        //   formComponent: Test,
        //   createElementData: {
        //     props: {
        //       text: '测试'
        //     },
        //     on: {
        //       'test-click': (msg) => {
        //         alert(msg)
        //       }
        //     }
        //   }
        // }
        // this._options.modules.imageUploadHandle = {
        //   upload: file => {
        //     console.log('正在上传...', file)
        //     // return a Promise that resolves in a link to the uploaded image
        //     const ret = new Promise((resolve, reject) => {
        //       resolve('https://lib.sixtyden.com/201808020245150.jpg')
        //     })
        //
        //     ret.then((url) => {
        //       console.log('上传成功', url)
        //     })
        //
        //     return ret
        //   }
        // }

        // Instance
        this.quill = new Quill(this.$refs.editor, this._options)

        this.quill.enable(false)

        // Set editor content
        if (this.value || this.content) {
          this.quill.clipboard.dangerouslyPasteHTML(this.value || this.content)
        }

        // Disabled editor
        if (!this.disabled) {
          this.quill.enable(true)
        }

        // Mark model as touched if editor lost focus
        this.quill.on('selection-change', (range, oldRange, source) => {
          this.$emit('selection-change', {range, oldRange, source})
          if (!range) {
            this.$emit('blur', this.quill)
          } else {
            this.$emit('focus', this.quill)
          }
        })

        // Update model if text changes
        this.quill.on('text-change', (delta, oldDelta, source) => {
          console.log('**编辑器最原始的改变信息**', JSON.stringify(delta.ops))
          let html = this.$refs.editor.children[0].innerHTML
          const quill = this.quill
          const text = this.quill.getText()
          if (html === '<p><br></p>') html = ''
          this.localContent = html
          this.$emit('input', this.localContent)
          this.$emit('text-change', { html, text, quill, change: {delta, oldDelta, source} })
        })
        // Emit ready event
        this.$emit('ready', this.quill)
      }
    }
  },

  mounted () {
    this.initialize()
  },

  beforeDestroy () {
    this.quill = null
    delete this.quill
  }
}
</script>

<style>
pre,
code {
  font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
}
.quill-editor > .ql-snow .ql-editor pre.ql-syntax {
  background-color: #f0f0f0;
  color: #2c3e50a9;
}
.quill-editor > .ql-snow .ql-editor .ql-code-block-container {
  background-color: #f0f0f0;
  color: #2c3e50a9;
}
</style>
