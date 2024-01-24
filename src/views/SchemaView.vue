<script setup lang="ts">
import { ref } from 'vue'
import DiagramTab from '@/components/DiagramTab.vue'
import EntityCard from '@/components/EntityCard.vue'
import OperationCard from '@/components/OperationCard.vue'
import SchemaJson from '@/components/SchemaJson.vue'
import { useSchemaStore } from '@/stores/schema'

const schemar = useSchemaStore()

const mode = ref('可视模式')
</script>

<template>
  <div class="schema-page" style="max-width: 1000px">
    <h1>Schema</h1>
    <p>
      Schema
      为您的授权模型定义了用户类型、资源类型和操作。在保存策略之前，根据策略存储的验证模式设置对策略进行验证。
    </p>

    <div class="operate-group">
      <el-radio-group v-model="mode">
        <el-radio-button label="可视模式" />
        <el-radio-button label="JSON 模式" />
      </el-radio-group>
    </div>

    <div style="height: 16px"></div>

    <template v-if="mode === '可视模式'">
      <el-card header="详细信息">
        <p>命名空间</p>
        <p>{{ schemar.info.nameSpace }}</p>
      </el-card>

      <div style="height: 16px"></div>

      <DiagramTab />

      <div style="height: 16px"></div>

      <EntityCard />

      <div style="height: 16px"></div>

      <OperationCard />
    </template>

    <template v-else>
      <SchemaJson />
    </template>
  </div>
</template>

<style scoped>
.operate-group {
  display: flex;
  justify-content: space-between;
}
</style>

<style>
.schema-page .el-tabs {
  --el-tabs-header-height: 60px;
}

.schema-page .el-tabs__header {
  margin: 0 20px;
  /* height: 60px; */
}
</style>
