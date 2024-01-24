<script lang="ts" setup>
import { useSchemaStore } from '@/stores/schema'
const schemar = useSchemaStore()
</script>

<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>实体类型 {{ schemar.info.entities.length }}</span>
        <p class="note">使用此部分定义策略中使用的实体类型（主体和资源）</p>
        <!-- <el-button>JSON 格式化</el-button> -->
      </div>
    </template>

    <el-table :data="schemar.info.entities" style="width: 100%">
      <el-table-column prop="name" label="名称" />
      <el-table-column label="成员">
        <template #default="scope">
          <div v-for="item of scope.row.members" :key="item">
            {{ item }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
