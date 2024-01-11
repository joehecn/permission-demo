<script lang="ts" setup>
import { ref } from 'vue'
import type { Tree } from '@/types'

const customNodeClass = (data: Tree) => {
  if (data.isPenultimate) {
    return 'is-penultimate'
  }
  return null
}

const areaData: Tree[] = [
  {
    id: 4095,
    label: '区域资源: 100',
    disabled: true,
    children: [
      {
        id: 63,
        label: '设备: 20',
        disabled: true,
        children: [
          {
            id: 7,
            label: '门禁: 10',
            isPenultimate: true,
            disabled: true,
            children: [
              {
                id: 1,
                label: '只读',
                disabled: true
              },
              {
                id: 2,
                label: '可写',
                disabled: true
              },
              {
                id: 4,
                label: '控制',
                disabled: true
              }
            ]
          },
          {
            id: 56,
            label: '灯: 15',
            disabled: true,
            isPenultimate: true,
            children: [
              {
                id: 8,
                label: '只读',
                disabled: true
              },
              {
                id: 16,
                label: '可写',
                disabled: true
              },
              {
                id: 32,
                label: '控制',
                disabled: true
              }
            ]
          }
        ]
      },
      {
        id: 192,
        label: '文档: 20',
        disabled: true,
        isPenultimate: true,
        children: [
          {
            id: 64,
            label: '只读',
            disabled: true
          },
          {
            id: 128,
            label: '可写',
            disabled: true
          }
        ]
      },
      {
        id: 3840,
        label: '仪表盘: 20',
        disabled: true,
        children: [
          {
            id: 768,
            label: '中控面板: --',
            disabled: true,
            isPenultimate: true,
            children: [
              {
                id: 256,
                label: '只读',
                disabled: true
              },
              {
                id: 512,
                label: '可写',
                disabled: true
              }
            ]
          },
          {
            id: 3072,
            label: '数据图表: 10',
            disabled: true,
            isPenultimate: true,
            children: [
              {
                id: 1024,
                label: '只读',
                disabled: true
              },
              {
                id: 2048,
                label: '可写',
                disabled: true
              }
            ]
          }
        ]
      }
    ]
  }
]

const customManage = ref(false)
const checkList = ref<string[]>(['工位: 1000', '会议室: 10'])

const orgTreeData = [
  {
    id: 1,
    label: '公司',
    isPenultimate: true,
    children: [
      {
        id: 2,
        label: 'admin@club.com'
      }
    ]
  }
]

const orgTreeProps = {
  label: 'label',
  children: 'children',
  class: customNodeClass
}
</script>

<template>
  <div class="global-notes">
    <p>说明:</p>
    <ul>
      <li>-- 系统管理员 mega@mega.com --</li>
      <li>这个是基础版本配置, 未来要考虑收费模式</li>
      <li>如果不一致，必须同时满足所有相关条件: ( 灯: 15, 门: 10, 设备: 20 )</li>
    </ul>
  </div>

  <el-divider />

  <h1>创建公司管理员账号</h1>
  <div id="org-tree-wrap">
    <el-tree
      default-expand-all
      node-key="id"
      :data="orgTreeData"
      :props="orgTreeProps"
      :expand-on-click-node="false"
    >
      <template #default="{ node, data }">
        <span class="el-tree-node__label">
          <span>{{ node.label }}</span>
          <span v-if="!data.isPenultimate" style="display: inline-block; margin-left: 8px">
            <el-tag type="info">公司管理员 (功能角色)</el-tag>
          </span>
        </span>
      </template>
    </el-tree>
  </div>

  <el-divider />

  <h1>区域配置</h1>
  <p>层级: 7</p>
  <p>数量: 2000</p>
  <el-checkbox-group v-model="checkList">
    <el-checkbox label="工位: 1000" disabled></el-checkbox>
    <el-checkbox label="会议室: 10" disabled></el-checkbox>
    <el-checkbox label="教室: --" disabled></el-checkbox>
  </el-checkbox-group>
  <el-divider />
  <h1>组织配置</h1>
  <p>层级: 7</p>
  <p>数量: 100</p>
  <el-checkbox v-model="customManage" label="客户管理: --" disabled />
  <el-divider />
  <h1>资源配置</h1>
  <div id="area-tree-wrap">
    <el-tree
      node-key="id"
      show-checkbox
      default-expand-all
      :data="areaData"
      :default-checked-keys="[1, 4, 8, 32, 64, 128, 1024, 2048]"
      :expand-on-click-node="false"
      :props="{ class: customNodeClass }"
    />
  </div>
</template>

<style>
#area-tree-wrap .el-tree-node.is-expanded.is-penultimate > .el-tree-node__children {
  display: flex;
  flex-direction: row;
}
#area-tree-wrap .is-penultimate > .el-tree-node__children > div {
  width: 120px;
}
</style>
