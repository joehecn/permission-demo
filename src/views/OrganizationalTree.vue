<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, type Ref } from 'vue'
import { areaTreeData, travelTree, orgTreeData } from '@/utils'

import type { Tree } from '@/types'

const storageMap: Map<string, number[]> = reactive(new Map())

const getItem = (key: string) => {
  return storageMap.get(key) || []
}

const setItem = (key: string, value: number[]) => {
  storageMap.set(key, value)
  localStorage.setItem(key, JSON.stringify(value))
}

// area
const areaTreeRef = ref()

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

let currentArea: Tree | null = null

const checkedSelect = (id: number) => {
  if (!areaTreeRef.value) return false

  const checkedNodes = areaTreeRef.value.getCheckedNodes(true)
  const checkedIds = checkedNodes.map((node: Tree) => node.id)
  return checkedIds.includes(id)
}

const handleAreaTreeCurrentChange = (val: Tree) => {
  if (!val) return

  const checkedNodes = areaTreeRef.value.getCheckedNodes(true)
  const checkedIds = checkedNodes.map((node: Tree) => node.id)

  if (!checkedIds.includes(val.id)) return

  innerDrawer.value = true

  currentArea = val
  nextTick(() => {
    const defaultCheckedKeys = getItem(`org/${currentOrg.value?.id}/area/${val.id}`)
    areaResourceRef.value.setCheckedKeys(defaultCheckedKeys)
  })
}

const handleAreaTreeCheckChange = () => {
  areaTreeRef.value.setCurrentKey(null)
}
const handleAreaResourceCheckChange = () => {
  areaResourceRef.value.setCurrentKey(null)
}

const handleAreaTreeBeforeClose = (done: () => void) => {
  orgTreeRef.value.setCurrentKey(null)
  done()
}

// org
const orgTreeRef = ref()

const orgTreeProps = {
  label: 'label',
  children: 'children',
  class: 'area'
}

let currentOrg: Ref<Tree | null> = ref(null)

const handleOrgTreeCurrentChange = (val: Tree) => {
  if (!val) return

  drawer.value = true

  currentOrg.value = val
  nextTick(() => {
    const defaultCheckedKeys = getItem(`org/${val.id}`)
    areaTreeRef.value.setCheckedKeys(defaultCheckedKeys)
  })
}

// arawer
const drawer = ref(false)

const saveOrg = () => {
  const checkedNodes = areaTreeRef.value.getCheckedNodes(true)
  const checkedIds = checkedNodes.map((node: Tree) => node.id)

  setItem(`org/${currentOrg.value?.id}`, checkedIds)
}
const onSaveBtnClick = () => {
  saveOrg()

  orgTreeRef.value.setCurrentKey(null)
  drawer.value = false
}

// innerDrawer
const areaResourceRef = ref()

const innerDrawer = ref(false)

const areaResourceData: Tree[] = [
  {
    id: 4095,
    label: '区域资源',
    children: [
      {
        id: 63,
        label: '设备',
        children: [
          {
            id: 7,
            label: '门禁',
            isPenultimate: true,
            children: [
              {
                id: 1,
                label: '只读'
              },
              {
                id: 2,
                label: '可写',
                disabled: true
              },
              {
                id: 4,
                label: '控制'
              }
            ]
          },
          {
            id: 56,
            label: '灯',
            isPenultimate: true,
            children: [
              {
                id: 8,
                label: '只读'
              },
              {
                id: 16,
                label: '可写',
                disabled: true
              },
              {
                id: 32,
                label: '控制'
              }
            ]
          }
        ]
      },
      {
        id: 192,
        label: '文档',
        isPenultimate: true,
        children: [
          {
            id: 64,
            label: '只读'
          },
          {
            id: 128,
            label: '可写'
          }
        ]
      },
      {
        id: 3840,
        label: '仪表盘',
        disabled: true,
        children: [
          {
            id: 768,
            label: '中控面板',
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
            label: '数据图表',
            isPenultimate: true,
            children: [
              {
                id: 1024,
                label: '只读'
              },
              {
                id: 2048,
                label: '可写'
              }
            ]
          }
        ]
      }
    ]
  }
]

const onAreaResourceSaveBtnClick = () => {
  const checkedNodes = areaResourceRef.value.getCheckedNodes(true)
  const checkedIds = checkedNodes.map((node: Tree) => node.id)

  setItem(`org/${currentOrg.value?.id}/area/${currentArea!.id}`, checkedIds)

  areaResourceRef.value.setCurrentKey(null)
  areaTreeRef.value.setCurrentKey(null)
  innerDrawer.value = false

  saveOrg()
}

const handleAreaResourceBeforeClose = (done: () => void) => {
  areaResourceRef.value.setCurrentKey(null)
  areaTreeRef.value.setCurrentKey(null)
  done()
}

const hasKey = (key: string) => {
  return !!storageMap.get(key)
}

const orgHasKey = (key: string) => {
  const checkedIds = storageMap.get(key)
  if (!checkedIds) return false

  for (const id of checkedIds) {
    const areaKey = `${key}/area/${id}`
    if (!storageMap.get(areaKey)) return false
  }

  return true
}

const initStorageMap = () => {
  const orgIds = travelTree(orgTreeData)
  const ids = travelTree(areaTreeData)

  orgIds.forEach((orgId) => {
    const orgValue = localStorage.getItem(`org/${orgId}`)
    if (!orgValue) return

    storageMap.set(`org/${orgId}`, JSON.parse(orgValue))

    ids.forEach((id) => {
      const value = localStorage.getItem(`org/${orgId}/area/${id}`)
      if (!value) return

      storageMap.set(`org/${orgId}/area/${id}`, JSON.parse(value))
    })
  })
}

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
            label: 'p-admin@club.com'
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
            label: 'd-admin@club.com'
          },
          {
            id: 6,
            label: '前端组',
            isPenultimate: true,
            children: [
              {
                id: 7,
                label: 'df-admin@club.com'
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
                label: 'db-admin@club.com'
              }
            ]
          }
        ]
      }
    ]
  }
]

onMounted(() => {
  initStorageMap()
})
</script>

<template>
  <div class="global-notes">
    <p>说明:</p>
    <ul>
      <li>-- 公司管理员 --</li>
    </ul>
  </div>

  <el-divider />

  <h1>部门管理</h1>
  <div id="organizational-tree-page">
    <div id="org-tree">
      <el-tree
        ref="orgTreeRef"
        check-on-click-node
        default-expand-all
        node-key="id"
        :data="orgTreeData"
        :props="orgTreeProps"
        :expand-on-click-node="false"
        @current-change="handleOrgTreeCurrentChange"
      >
        <template #default="{ node, data }">
          <span class="el-tree-node__label">
            <span>{{ node.label }}</span>
            <el-badge
              style="margin-right: 3px"
              is-dot
              :type="orgHasKey(`org/${data.id}`) ? 'success' : 'warning'"
            >
            </el-badge>
          </span>
        </template>
      </el-tree>
    </div>

    <el-drawer
      v-model="drawer"
      :size="600"
      :title="currentOrg?.label + ' - 选择区域'"
      :show-close="false"
      :before-close="handleAreaTreeBeforeClose"
    >
      <div class="drawer-body">
        <div class="drawer-content">
          <div id="area-tree">
            <el-tree
              ref="areaTreeRef"
              default-expand-all
              node-key="id"
              show-checkbox
              :data="areaTreeData"
              :props="areaTreeProps"
              :expand-on-click-node="false"
              @current-change="handleAreaTreeCurrentChange"
              @check-change="handleAreaTreeCheckChange"
            >
              <template #default="{ node, data }">
                <span class="el-tree-node__label">
                  <span>{{ node.label }}</span>
                  <el-badge
                    v-if="checkedSelect(data.id)"
                    style="margin-right: 3px"
                    is-dot
                    :type="hasKey(`org/${currentOrg?.id}/area/${data.id}`) ? 'success' : 'warning'"
                  >
                  </el-badge>
                </span>
              </template>
            </el-tree>
          </div>
        </div>
        <div class="drawer-footer">
          <el-button type="primary" @click="onSaveBtnClick">Save</el-button>
        </div>

        <el-drawer
          v-model="innerDrawer"
          :title="currentArea?.label + ' - 选择区域资源'"
          :append-to-body="true"
          :show-close="false"
          :before-close="handleAreaResourceBeforeClose"
        >
          <div class="drawer-body">
            <div class="drawer-content">
              <div class="custom-tree-node-container">
                <el-tree
                  v-if="innerDrawer"
                  ref="areaResourceRef"
                  node-key="id"
                  show-checkbox
                  default-expand-all
                  :data="areaResourceData"
                  :expand-on-click-node="false"
                  :props="orgTreeProps"
                  @check-change="handleAreaResourceCheckChange"
                />
              </div>
            </div>
            <div class="drawer-footer">
              <el-button type="primary" @click="onAreaResourceSaveBtnClick">Save</el-button>
            </div>
          </div>
        </el-drawer>
      </div>
    </el-drawer>
  </div>

  <el-divider />

  <h1>创建部门管理员账号</h1>
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
            <el-tag type="info">部门管理员 (功能角色)</el-tag>
          </span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<style>
#organizational-tree-page #org-tree .area {
  color: #409eff;
}

#organizational-tree-page #org-tree .area .el-tree-node__label {
  border: 1px solid #409eff;
  padding: 0 4px;
}

#organizational-tree-page #org-tree .is-current > .el-tree-node__content {
  border: 1px solid #409eff;
}

#organizational-tree-page #area-tree .area {
  color: #409eff;
}

#organizational-tree-page #area-tree .area .el-tree-node__label {
  background-color: yellow;
  border: 1px solid #409eff;
  padding: 0 4px;
}

.drawer-body {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.drawer-content {
  flex: auto;
}

.drawer-footer {
  flex: none;
}
</style>
