<script lang="ts" setup>
import type { Tree } from '@/types'

const customNodeClass = (data: Tree) => {
  if (data.isPenultimate) {
    return 'is-penultimate'
  }
  return null
}

const data: Tree[] = [
  {
    id: 1,
    label: '用户管理',
    disabled: true,
    isPenultimate: true,
    children: [
      {
        id: 2,
        label: '用户列表',
        disabled: true
      },
      {
        id: 3,
        label: '查找',
        disabled: true
      },
      {
        id: 4,
        label: '新增',
        disabled: true
      },
      {
        id: 5,
        label: '编辑',
        disabled: true
      },
      {
        id: 6,
        label: '删除',
        disabled: true
      }
    ]
  }
]

const adminData: Tree[] = [
  {
    id: 11,
    label: '部门管理',
    disabled: true,
    isPenultimate: true,
    children: [
      {
        id: 12,
        label: '部门列表',
        disabled: true
      },
      {
        id: 13,
        label: '查找',
        disabled: true
      },
      {
        id: 14,
        label: '新增',
        disabled: true
      },
      {
        id: 15,
        label: '编辑',
        disabled: true
      },
      {
        id: 16,
        label: '删除',
        disabled: true
      }
    ]
  },
  ...data
]
</script>

<template>
  <div id="fun">
    <h1>功能角色</h1>
    <el-divider />
    <el-space wrap>
      <h4>公司管理员 (系统)</h4>
      <el-tag type="info">禁止删除</el-tag>
      <el-tag type="info">禁止修改权限</el-tag>
    </el-space>
    <el-tree
      node-key="id"
      show-checkbox
      default-expand-all
      :data="adminData"
      :default-checked-keys="[2, 3, 4, 5, 6, 12, 13, 14, 15, 16]"
      :expand-on-click-node="false"
      :props="{ class: customNodeClass }"
    />

    <el-space wrap>
      <h4>部门管理员</h4>
    </el-space>
    <el-tree
      node-key="id"
      show-checkbox
      default-expand-all
      :data="data"
      :default-checked-keys="[2, 3, 4, 5, 6]"
      :expand-on-click-node="false"
      :props="{ class: customNodeClass }"
    />

    <el-space wrap>
      <h4>普通用户 (系统)</h4>
      <el-tag type="info">禁止删除</el-tag>
      <el-tag type="info">禁止修改权限</el-tag>
    </el-space>
  </div>
</template>

<style>
/* .is-penultimate > .el-tree-node__content {
  color: #626aef;
} */

#fun .el-tree-node.is-expanded.is-penultimate > .el-tree-node__children {
  display: flex;
  flex-direction: row;
}
#fun .is-penultimate > .el-tree-node__children > div {
  width: 120px;
}
</style>
