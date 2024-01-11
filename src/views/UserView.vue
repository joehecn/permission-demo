<script setup lang="ts">
import type { Tree } from '@/types'

const customClass = (data: Tree) => {
  if (data.isPenultimate) {
    return 'is-penultimate'
  }
  return null
}

const orgData = [
  {
    id: 1,
    label: '公司',
    isPenultimate: true,
    children: [
      {
        id: 2,
        label: '产品部',
        isPenultimate: true,
        children: [
          {
            id: 3,
            label: 'user1@club.com'
          }
        ]
      },
      {
        id: 4,
        label: '开发部',
        isPenultimate: true,
        children: [
          {
            id: 5,
            label: 'user2@club.com'
          },
          {
            id: 6,
            label: '前端组',
            isPenultimate: true,
            children: [
              {
                id: 7,
                label: 'user3@club.com'
              }
            ]
          },
          {
            id: 6,
            label: '后端组',
            isPenultimate: true,
            children: [
              {
                id: 7,
                label: 'user4@club.com'
              }
            ]
          }
        ]
      }
    ]
  }
]
</script>

<template>
  <div class="global-notes">
    <p>说明:</p>
    <ul>
      <li>-- 部门管理员 --</li>
    </ul>
  </div>

  <el-divider />

  <h1>用户管理</h1>
  <div id="org-tree-wrap">
    <el-tree
      default-expand-all
      node-key="id"
      :data="orgData"
      :props="{ class: customClass }"
      :expand-on-click-node="false"
    >
      <template #default="{ node, data }">
        <span class="el-tree-node__label">
          <span>{{ node.label }}</span>
          <span v-if="!data.isPenultimate" style="display: inline-block; margin-left: 8px">
            <el-tag type="info">普通用户 (功能角色)</el-tag>
            <span style="display: inline-block; margin-left: 8px"> </span>
            <el-tag>数据角色{{ node.label[4] }}</el-tag>
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>
