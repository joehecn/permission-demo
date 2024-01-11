<script setup lang="ts">
import type { Tree } from '@/types'
import { nextTick, onMounted, reactive, ref, type Ref } from 'vue'
import {
  areaTreeData,
  orgTreeData,
  travelTree,
  findParent,
  filterData,
  addDisableds
} from '@/utils'

const storageMap: Map<string, number[]> = reactive(new Map())

const ids = travelTree(areaTreeData)
const refAreaTreeData = ref(areaTreeData)

const getItem = (key: string) => {
  return storageMap.get(key) || []
}

const setItem = (key: string, value: number[]) => {
  storageMap.set(key, value)
  localStorage.setItem(key, JSON.stringify(value))
}

const hasKey = (key: string) => {
  return !!storageMap.get(key)
}

const dataHasKey = (key: string) => {
  const checkedIds = storageMap.get(key)
  if (!checkedIds) return false

  for (const id of checkedIds) {
    const areaKey = `${key}/area/${id}`
    if (!storageMap.get(areaKey)) return false
  }

  return true
}

const customClass = (data: Tree) => {
  if (data.isPenultimate) {
    return 'is-penultimate'
  }
  return null
}

const customNodeClass = (data: Tree) => {
  if (data.children) {
    return 'node'
  }
  return 'area'
}

// data
const dataTreeRef = ref()

const data = [
  {
    id: 1,
    label: '公司',
    isPenultimate: true,
    children: [
      {
        id: 3,
        label: '产品部',
        isPenultimate: true,
        children: [
          {
            id: 7,
            label: '数据角色1'
          }
        ]
      },
      {
        id: 4,
        label: '开发部',
        isPenultimate: true,
        children: [
          {
            id: 8,
            label: '数据角色2'
          },
          {
            id: 5,
            label: '前端组',
            isPenultimate: true,
            children: [
              {
                id: 9,
                label: '数据角色3'
              }
            ]
          },
          {
            id: 6,
            label: '后端组',
            isPenultimate: true,
            children: [
              {
                id: 10,
                label: '数据角色4'
              }
            ]
          }
        ]
      }
    ]
  }
]

let currentData: Ref<Tree | null> = ref(null)
let currentParent: Ref<Tree | null> = ref(null)
const handleDataTreeCurrentChange = (val: Tree) => {
  if (!val) return

  if (val.children) return

  const parent = findParent(data, val.id)
  currentParent.value = parent

  const areas = getItem(`org/${parent!.id}`)
  const disableds = filterData(areas, ids)
  refAreaTreeData.value = addDisableds(areaTreeData, disableds)

  drawer.value = true

  currentData.value = val
  nextTick(() => {
    const defaultCheckedKeys = getItem(`data/${val.id}`)
    areaTreeRef.value.setCheckedKeys(defaultCheckedKeys)
  })
}

// arawer
const drawer = ref(false)

const saveOrg = () => {
  const checkedNodes = areaTreeRef.value.getCheckedNodes(true)
  const checkedIds = checkedNodes.map((node: Tree) => node.id)

  setItem(`data/${currentData.value?.id}`, checkedIds)
}
const onSaveBtnClick = () => {
  saveOrg()

  dataTreeRef.value.setCurrentKey(null)
  drawer.value = false
}

const orgTreeProps = {
  label: 'label',
  children: 'children',
  class: 'area'
}

// area
const areaTreeProps = {
  label: 'label',
  children: 'children',
  class: customNodeClass
}

const areaTreeRef = ref()

const handleAreaTreeBeforeClose = (done: () => void) => {
  dataTreeRef.value.setCurrentKey(null)
  done()
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

  const permissions = getItem(`org/${currentParent.value?.id}/area/${val.id}`)
  const disableds = filterData(permissions, resourceIds)
  refAreaResourceData.value = addDisableds(areaResourceData, disableds)

  innerDrawer.value = true

  currentArea = val
  nextTick(() => {
    const defaultCheckedKeys = getItem(`data/${currentData.value?.id}/area/${val.id}`)
    areaResourceRef.value.setCheckedKeys(defaultCheckedKeys)
  })
}

const handleAreaTreeCheckChange = () => {
  areaTreeRef.value.setCurrentKey(null)
}
const handleAreaResourceCheckChange = () => {
  areaResourceRef.value.setCurrentKey(null)
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
const resourceIds = travelTree(areaResourceData)
const refAreaResourceData = ref(areaResourceData)

const onAreaResourceSaveBtnClick = () => {
  const checkedNodes = areaResourceRef.value.getCheckedNodes(true)
  const checkedIds = checkedNodes.map((node: Tree) => node.id)

  setItem(`data/${currentData.value?.id}/area/${currentArea!.id}`, checkedIds)

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

const initStorageMap = () => {
  const orgIds = travelTree(orgTreeData)
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

  const dataIds = travelTree(data)
  dataIds.forEach((dataId) => {
    const value = localStorage.getItem(`data/${dataId}`)
    if (!value) return

    storageMap.set(`data/${dataId}`, JSON.parse(value))

    ids.forEach((id) => {
      const value = localStorage.getItem(`data/${dataId}/area/${id}`)
      if (!value) return

      storageMap.set(`data/${dataId}/area/${id}`, JSON.parse(value))
    })
  })
}

onMounted(() => {
  initStorageMap()
})
</script>

<template>
  <div class="global-notes">
    <p>说明:</p>
    <ul>
      <li>-- 部门管理员 --</li>
    </ul>
  </div>

  <el-divider />

  <h1>数据角色</h1>
  <div id="org-tree-wrap">
    <el-tree
      ref="dataTreeRef"
      check-on-click-node
      default-expand-all
      node-key="id"
      :data="data"
      :props="{ class: customClass }"
      :expand-on-click-node="false"
      @current-change="handleDataTreeCurrentChange"
    >
      <template #default="{ node, data }">
        <span class="el-tree-node__label">
          <span v-if="data.isPenultimate">{{ node.label }}</span>
          <span v-else>
            <el-tag>
              {{ node.label }}
              <el-badge
                style="margin-right: 3px"
                is-dot
                :type="dataHasKey(`data/${data.id}`) ? 'success' : 'warning'"
              >
              </el-badge>
            </el-tag>
          </span>
        </span>
      </template>
    </el-tree>

    <el-drawer
      v-model="drawer"
      :size="600"
      :title="currentData?.label + ' - 选择区域'"
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
              :data="refAreaTreeData"
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
                    :type="
                      hasKey(`data/${currentData?.id}/area/${data.id}`) ? 'success' : 'warning'
                    "
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
                  :data="refAreaResourceData"
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
</template>
