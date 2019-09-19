import _Quill from 'quill'
import quillEditor from './Editor.vue'

const Quill = window.Quill || _Quill
const install = (Vue) => {
  Vue.component(quillEditor.name, quillEditor)
}

const VueQuillEditor = { Quill, quillEditor, install }

export default VueQuillEditor
export { Quill, quillEditor, install }

