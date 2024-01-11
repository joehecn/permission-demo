<script setup lang="ts">
import { areaTreeData } from '@/utils'
import type { Tree } from '@/types'

const customNodeClass = (data: Tree) => {
  if (data.children) {
    return 'node'
  }
  return 'area'
}

const areaTreeProps = {
  label: 'label',
  children: 'children',
  class: customNodeClass
}
</script>

<template>
  <div class="global-notes">
    <p>说明:</p>
    <ul>
      <li>-- 公司管理员 --</li>
      <li>配置区域树</li>
      <li>为区域分配区域类型: 普通, 工位, 会议室 (参看全局配置)</li>
      <li>区域 === 叶子节点 AND 叶子节点 === 区域</li>
    </ul>
  </div>
  <el-divider />
  <div id="area-tree-page">
    <el-tree
      :data="areaTreeData"
      :props="areaTreeProps"
      default-expand-all
      :expand-on-click-node="false"
    />
  </div>
</template>

<style>
#area-tree-page .area {
  color: #409eff;
}

#area-tree-page .area .el-tree-node__label {
  background-color: yellow;
  border: 1px solid #409eff;
  padding: 0 4px;
}
</style>
