<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import { Graph } from '@antv/x6'
import { DagreLayout } from '@antv/layout'
import { Scroller } from '@antv/x6-plugin-scroller'
import { useSchemaStore } from '@/stores/schema'

const schemar = useSchemaStore()

let graph: Graph | null = null

const activeTab = ref('operation')

Graph.registerNode(
  'custom-node-width-port2',
  {
    inherit: 'rect',
    width: 200,
    height: 30,
    markup: [
      {
        tagName: 'rect', // 标签名称
        selector: 'body' // 选择器
      },
      {
        tagName: 'text',
        selector: 'label'
      }
    ],
    attrs: {
      body: {
        stroke: '#8f8f8f',
        strokeWidth: 5,
        strokeDasharray: '0 430 30',
        fill: '#fff'
      },
      label: {
        refX: 0.1,
        textAnchor: 'left'
      }
    },
    ports: {
      groups: {
        left: {
          position: 'left',
          attrs: {
            circle: {
              r: 0
            }
          }
        },
        right: {
          position: 'right',
          attrs: {
            circle: {
              r: 0
            }
          }
        }
      }
    }
  },
  true
)

Graph.registerNode(
  'custom-node-width-port8',
  {
    inherit: 'rect',
    width: 160,
    height: 50,
    markup: [
      {
        tagName: 'rect', // 标签名称
        selector: 'body' // 选择器
      },
      {
        tagName: 'text',
        selector: 'label'
      }
    ],
    attrs: {
      body: {
        stroke: '#8f8f8f',
        strokeWidth: 5,
        strokeDasharray: '0 370 50',
        fill: '#fff'
      },
      label: {
        refX: 0.1,
        textAnchor: 'left'
      }
    },
    ports: {
      groups: {
        top: {
          position: 'top',
          attrs: {
            circle: {
              r: 0
            }
          }
        },
        bottom: {
          position: 'bottom',
          attrs: {
            circle: {
              r: 0
            }
          }
        },
        right: {
          position: 'right',
          attrs: {
            circle: {
              r: 0
            }
          }
        }
      }
    }
  },
  true
)

const renderOperation = () => {
  const l = new DagreLayout({
    type: 'dagre',
    rankdir: 'LR',
    align: 'UL',
    nodesep: 4,
    ranksep: 80,
    controlPoints: true,
    sortByCombo: true,
    workerEnabled: true,
    edgeLabelSpace: true
  })

  const data = l.layout(schemar.info.operationData)
  l.destroy()

  graph!.fromJSON(data)
}

const renderEntity = () => {
  const l = new DagreLayout({
    type: 'dagre',
    rankdir: 'BT',
    align: 'UR',
    nodesep: 60,
    ranksep: 20,
    controlPoints: true,
    sortByCombo: true,
    workerEnabled: true,
    edgeLabelSpace: true
  })

  const data = l.layout(schemar.info.entityData)
  l.destroy()

  graph!.fromJSON(data)
}

const handleTabChange = () => {
  if (activeTab.value === 'operation') {
    renderOperation()
  } else {
    renderEntity()
  }

  setTimeout(() => {
    graph!.centerContent()
  }, 100)
}

onMounted(() => {
  graph = new Graph({
    container: document.getElementById('container')!,
    autoResize: true,
    background: {
      color: '#F2F7FA'
    },
    grid: {
      visible: true,
      type: 'doubleMesh',
      args: [
        {
          color: '#eee', // 主网格线颜色
          thickness: 1 // 主网格线宽度
        },
        {
          color: '#ddd', // 次网格线颜色
          thickness: 1, // 次网格线宽度
          factor: 4 // 主次网格线间隔
        }
      ]
    }
  })
  graph.use(
    new Scroller({
      enabled: true
    })
  )

  handleTabChange()
})

onBeforeMount(() => {
  graph?.dispose()
})
</script>

<template>
  <el-card class="box-card">
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="操作图" name="operation"></el-tab-pane>
      <el-tab-pane label="实体类型图" name="entity"></el-tab-pane>
    </el-tabs>
    <div style="height: 400px">
      <div id="container"></div>
    </div>
  </el-card>
</template>
