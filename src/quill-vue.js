/*
* Vue-Quill index.js
* Author: hiliulin@aliyun.com
* Github: https://github.com/hzjswlgbsj/vue-quill
* Base: https://github.com/surmon-china/vue-quill-editor
*/

import _Quill from 'quill'
import QuillEditor from './Editor.vue'

const Quill = window.Quill || _Quill
const install = (Vue) => {
  Vue.component(QuillEditor.name, QuillEditor)
}

const VueQuillEditor = { Quill, QuillEditor, install }

export default VueQuillEditor
export { Quill, QuillEditor, install }
