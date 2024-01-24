<script setup lang="ts">
import { onUnmounted, ref, toRaw, watch } from 'vue'
import emitter from '@/my-monaco/emitter'
import MyMonaco from '@/my-monaco'

type Props = {
  language: string
  readOnly?: boolean
  theme?: string
  isInstruction?: boolean
  isSchema?: boolean
  formdata: any
  schemaId?: string
  schema?: any
  changedata?: any
}

interface Emits {
  (e: 'valuechange', value: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const _getEditorSchema = (schema: any) => {
  if (typeof schema === 'string') return schema

  const _schema = JSON.parse(JSON.stringify(schema || {}))

  if (JSON.stringify(_schema) === '{}') {
    return '\n{\n  \n}'
  }

  return `
${JSON.stringify(_schema, null, 2)}`
}

let instance: MyMonaco | null = null

const refEditor = ref()

watch(
  () => props.formdata,
  (newValue: any) => {
    const id = newValue.id || props.schemaId

    const code = _getEditorSchema(newValue)

    const option: any = {
      value: code,
      language: props.language,
      readOnly: !!props.readOnly,
      theme: props.theme || 'vs',
      automaticLayout: true, // 自适应布局
      minimap: {
        enabled: false // 不要小地图
      }
    }

    if (!instance) {
      emitter.on('changevalue', ({ domElement, message, value }: any) => {
        if (refEditor.value === domElement) {
          emit('valuechange', { message, value })
        }
      })

      instance = new MyMonaco(refEditor.value)
      instance.setInstance(option, {
        isSchema: props.isSchema,
        id,
        schema: toRaw(props.schema)
      })
    } else {
      // 指令 formdata 不变
      // 指令文件 formdata 不变
      // 设备文件 添加删除选项卡，切换 JSON,SCHEMA 视图，切换 Schema 选择框
      // console.log('---- dispose instance')
      instance.dispose()
      instance = new MyMonaco(refEditor.value)
      instance.setInstance(option, {
        isSchema: props.isSchema,
        id,
        schema: toRaw(props.schema)
      })
    }
  }
)

watch(
  () => props.changedata,
  (newValue: any) => {
    const code = _getEditorSchema(newValue)
    instance!.setValue(code)
  }
)

onUnmounted(() => {
  instance?.dispose()
  instance = null
})
</script>

<template>
  <div ref="refEditor" class="editor"></div>
</template>

<style scoped>
.editor {
  height: 300px;
}
</style>
