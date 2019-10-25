import Vue, { VNode } from 'vue'
import { editorChangeParams } from './interface'

export declare class QuillEditor extends Vue {
  /**
   * 编辑器初始内容
   */
  content?: string;
  /**
   * 编辑器双向绑定的值
   */
  value?: string;
  /**
   * 编辑器的options配置
   * @default {
      theme: 'snow',
      boundary: document.body,
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'font': [] }],
          [{ 'align': [] }],
          ['link', 'image', 'video-another', 'iframe', 'vuecomp', 'formula'],
          ['clean']
        ]
      },
      placeholder: 'Insert text here ...',
      readOnly: false
    }
   */
  options?: object;
  /**
   * 是否禁用输入
   * @default false
   */
  disabled?: boolean;
  /**
   * 编辑器的高度
   * @default '500px'
   */
  height?: string;
  /**
   * 编辑器发生改变时触发
   */
  $emit(eventName: 'change', params: editorChangeParams): this;
  /**
   * 编辑器失去焦点时触发
   */
  $emit(eventName: 'blur', quill: any): this;
  /**
   * 编辑器获得焦点时触发
   */
  $emit(eventName: 'focus', quill: any): this;
  /**
   * 编辑器初始化完成时触发
   */
  $emit(eventName: 'ready', quill: any): this;
  /**
   * slot插槽对象
   */
  $slots: {
    /**
     * 自定义toolbar
     */
    to0lbar: VNode[];
  };
}

export declare class Quill {}