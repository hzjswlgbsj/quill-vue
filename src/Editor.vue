<template>
  <div class="quill-editor" :style="heightStyle">
    <slot name="toolbar"></slot>
    <button ref="iframe">Iframe</button>
    <button ref="video">Video</button>
    <button ref="vuecomp">vuecomp</button>
    <div ref="editor"></div>
  </div>
</template>

<script>
import defaultOptions from './options'
import _Quill from 'quill'
import { ImageDrop } from 'quill-image-drop-module'
import ImageResize from 'quill-image-resize-module'
import MarkdownShortcuts from 'quill-markdown-shortcuts'
import IntegratedCustom from 'quill-integrated-custom-blot'
// import { IframeBlot, TweetBlot, VideoBlot, VuecompBlot, IntegratedCustom } from 'quill-integrated-custom-blot'
import Test from './Test'

// register modules
_Quill.register({
  'modules/imageDrop': ImageDrop,
  'modules/ImageResize': ImageResize,
  'modules/markdownShortcuts': MarkdownShortcuts,
  'modules/integratedCustom': IntegratedCustom
}, true)
// _Quill.register('formats/iframe', IframeBlot)
// _Quill.register('formats/tweet', TweetBlot)
// _Quill.register('formats/video', VideoBlot, true)
// _Quill.register('formats/vuecomp', VuecompBlot)

const Quill = window.Quill || _Quill

console.log('Quill.imports', Quill.imports)
// pollfill
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
    height: {
      type: String,
      default: '500px'
    }
  },

  data () {
    return {
      localContent: '',
      localOptions: {},
      defaultOptions
    }
  },

  computed: {
    heightStyle () {
      return {
        height: this.height
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
        this._options.modules.imageDrop = true
        this._options.modules.ImageResize = {
          displayStyles: {
            backgroundColor: 'white',
            border: 'none',
            color: 'black'
          },
          handleStyles: {
            backgroundColor: 'black',
            border: 'none',
            color: 'white'
          },
          modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
        }
        this._options.modules.markdownShortcuts = {}
        this._options.modules.integratedCustom = {}

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
        this.quill.on('selection-change', range => {
          if (!range) {
            this.$emit('blur', this.quill)
          } else {
            this.$emit('focus', this.quill)
          }
        })

        // Update model if text changes
        this.quill.on('text-change', (delta, oldDelta, source) => {
          let html = this.$refs.editor.children[0].innerHTML
          const quill = this.quill
          const text = this.quill.getText()
          if (html === '<p><br></p>') html = ''
          this.localContent = html
          this.$emit('input', this.localContent)
          this.$emit('change', { html, text, quill, change: {delta, oldDelta, source} })
        })
        // Emit ready event
        this.$emit('ready', this.quill)
      }
    }
  },

  mounted () {
    this.initialize()
    const integratedCustomModule = this.quill.getModule('integratedCustom')

    // 插入iframe
    integratedCustomModule.insertIframe(this.$refs.iframe, {
      width: '100%',
      height: '500px'
    })

    // 插入video
    // const src = 'https://lib.sixtyden.com/%E8%BF%BD%E5%85%89%E8%80%85mv.mp4';
    // const src = 'https://player.youku.com/embed/XMzQ4ODE3NDQ4MA=='; // youku播放地址
    // const src = 'https://www.youtube.com/watch?v=qI9xIe9KtVU'; // youtube播放地址
    integratedCustomModule.insertVideo(this.$refs.video, {
      width: '100%',
      height: '600px'
    })

    // 插入vue组件
    integratedCustomModule.insertVuecomp(this.$refs.vuecomp, {
      viewComponent: Test,
      formComponent: Test,
      createElementData: {
        props: {
          text: '测试'
        },
        on: {
          'test-click': (msg) => {
            alert(msg)
          }
        }
      }
    })
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
  color: #2c3e50;
}
</style>
