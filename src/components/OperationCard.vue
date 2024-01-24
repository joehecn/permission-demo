<script lang="ts" setup>
import { useSchemaStore } from '@/stores/schema'
const schemar = useSchemaStore()
</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>操作 {{ schemar.info.operations.length }}</span>
        <p class="note">使用此部分定义架构主体可以执行的操作</p>
        <!-- <el-button>JSON 格式化</el-button> -->
      </div>
    </template>

    <el-table :data="schemar.info.operations" style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column label="适用于主体类型">
        <template #default="scope">
          <div v-for="item of scope.row.principals" :key="item">
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="适用于资源类型">
        <template #default="scope">
          <div v-for="item of scope.row.resources" :key="item">
            {{ item }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
