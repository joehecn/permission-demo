<script setup lang="ts">
import { onMounted, ref } from 'vue'
import MyEditor from './MyEditor.vue'
import { useSchemaStore } from '@/stores/schema'

const schemar = useSchemaStore()

const formdata: any = ref(null)
const changedata: any = ref(null)
const ajvMessage = ref('')

const editorSchemaChange = async (e: Event) => {
  const { message, value } = e as unknown as {
    message: string | null
    value: string
  }

  if (message !== undefined) {
    ajvMessage.value = message || ''
  }

  // TODO: 问题1
  // why? { message: undefined, value: undefined }
  if (message === undefined && value === undefined) {
    console.error({ message, value })
  }

  if (value && !message) {
    changedata.value = JSON.parse(value)
  }
}

const saveSchema = () => {
  const sch = changedata.value
  schemar.setSchema(sch)
  localStorage.setItem('schema', JSON.stringify(sch))
}

onMounted(() => {
  formdata.value = schemar.schema
})
</script>

<template>
  <el-card class="schema-json-card">
    <template #header>
      <div class="card-header">
        <span>编辑 Schema</span>
        <!-- <el-button>JSON 格式化</el-button> -->
      </div>
    </template>

    <MyEditor
      language="json"
      :readOnly="false"
      :formdata="formdata"
      @valuechange="editorSchemaChange"
    ></MyEditor>

    <template #footer>
      <div class="card-footer">
        <span v-show="ajvMessage">Note: {{ ajvMessage }}</span>
      </div>
    </template>
  </el-card>
  <div class="btn-wrap">
    <el-button :disabled="!!ajvMessage" type="primary" @click="saveSchema">保存变更</el-button>
  </div>
</template>

<style scoped>
.btn-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.card-footer {
  color: red;
  font-size: 12px;
}
</style>

<style>
.schema-json-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
