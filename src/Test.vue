<template>
  <div>
    <button click="handleClick">{{ text }}</button>
  </div>
</template>>

<script>
export default {
  name: 'Test',

  props: {
    text: {
      type: String,
      default: '测试按钮'
    }
  },

  data () {
    return {
      msg: 'vuecomp'
    }
  },

  methods: {
    handleClick () {
      this.$emit('test-click', '你点击了测试按钮哦！')
    }
  }
}
</script>
