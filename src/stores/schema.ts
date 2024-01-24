import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const getEntityData = (name: string, members: string[], attributes: any) => {
  const nodeMap: Map<string, {
    top: boolean[],
    bottom: boolean[],
  }> = new Map()
  const edges: any = []
  const references: string[] = []

  members.forEach(m => {
    if (m === name) {
      edges.push({
        source: name,
        sourcePort: 'right2',
        target: name,
        targetPort: 'right1',
        labels: [
          {
            attrs: {
              label: {
                text: 'memberOf'
              },
              body: {
                ref: 'label',
                fill: 'rgba(255,255,255,0.8)'
              }
            }
          }
        ],
        router: {
          name: 'manhattan'
        },
        connector: 'rounded'
      })
    } else {
      edges.push({
        source: name,
        target: m,
        labels: [
          {
            attrs: {
              label: {
                text: 'memberOf'
              },
              body: {
                ref: 'label',
                fill: 'rgba(255,255,255,0.8)'
              }
            }
          }
        ],
        router: {
          name: 'manhattan'
        },
        connector: 'rounded'
      })

      const num1 = nodeMap.get(name) || { top: [] as boolean[], bottom: [] as boolean[] }
      num1.top.push(false)
      nodeMap.set(name, num1)

      const num2 = nodeMap.get(m) || { top: [] as boolean[], bottom: [] as boolean[] }
      num2.bottom.push(false)
      nodeMap.set(m, num2)
    }
  })

  for (const key in attributes) {
    const { name: n } = attributes[key]
    edges.push({
      source: name,
      target: n,
      attrs: {
        line: {
          stroke: '#8f8f8f',
          strokeDasharray: 5,
          targetMarker: 'classic'
        }
      },
      labels: [
        {
          attrs: {
            label: {
              fill: '#8f8f8f',
              text: 'references'
            },
            body: {
              ref: 'label',
              fill: 'rgba(255,255,255,0.8)'
            }
          }
        }
      ],
      router: {
        name: 'manhattan'
      },
      connector: 'rounded'
    })

    const num1 = nodeMap.get(name) || { top: [] as boolean[], bottom: [] as boolean[] }
    num1.top.push(false)
    nodeMap.set(name, num1)

    const num2 = nodeMap.get(n) || { top: [] as boolean[], bottom: [] as boolean[] }
    num2.bottom.push(false)
    nodeMap.set(n, num2)

    references.push(n)
  }

  return { nodeMap, edges, references }
}

const getOperationData = (name: string, principals: string[], resources: string[]) => {
  const nodes = [name, ...principals, ...resources]
  const edges: any = []

  principals.forEach(p => {
    edges.push({
      source: p,
      sourcePort: 'right',
      target: name,
      targetPort: 'left',
      attrs: {
        line: {
          targetMarker: {
            name: 'circle',
            r: 0.6
          }
        }
      }
    })
  })

  resources.forEach(r => {
    edges.push({
      source: name,
        sourcePort: 'right',
        target: r,
        targetPort: 'left',
        attrs: {
          line: {
            targetMarker: {
              name: 'circle',
              r: 0.6
            }
          }
        }
    })
  })

  return { nodes, edges }
}

export const useSchemaStore = defineStore('schema', () => {
  const schemaStr = localStorage.getItem('schema') || '{}'

  const schema: any = ref(JSON.parse(schemaStr))

  const info = computed(() => {
    const entities: {
      name: string, members: string[]
    }[] = []
    const operations: {
      name: string, principals: string[], resources: string[]
    }[] = []

    const entityMap: Map<string, {
      top: boolean[],
      bottom: boolean[],
    }> = new Map()
    const entityData: any = {
      nodes: [],
      edges: [],
    }

    const operationSet: Set<string> = new Set()
    const operationData: any = {
      nodes: [],
      edges: [],
    }

    const keys = Object.keys(schema.value)
    if (keys.length === 0) {
      return { nameSpace: '', entities, operations, operationData }
    }

    const nameSpace = keys[0]

    const { entityTypes, actions } = schema.value[nameSpace]
    
    for (const name in entityTypes) {
      const members = entityTypes[name].memberOfTypes || []
      const attributes = entityTypes[name].shape?.attributes || {}
      entities.push({ name, members })

      const { nodeMap, edges, references } = getEntityData(name, members, attributes)

      entityData.nodes.push({
        shape: 'custom-node-width-port8',
        id: name,
        label: `${name}\n- ${references}`,
        ports: [
          { id: 'top1', group: 'top' },
          { id: 'top2', group: 'top' },
          { id: 'top3', group: 'top' },
          { id: 'bottom1', group: 'bottom' },
          { id: 'bottom2', group: 'bottom' },
          { id: 'bottom3', group: 'bottom' },
          { id: 'right1', group: 'right' },
          { id: 'right2', group: 'right' }
        ]
      })

      for (const [key, value] of nodeMap) {
        const num = entityMap.get(key) || { top: [] as boolean[], bottom: [] as boolean[] }
        num.top.push(...value.top)
        num.bottom.push(...value.bottom)
        entityMap.set(key, num)
      }

      entityData.edges.push(...edges)
    }

    // node sort
    entityData.nodes.sort((a: any, b: any) => {
      const aName = a.id
      const bName = b.id
      const aNum = entityMap.get(aName) || { top: [] as boolean[], bottom: [] as boolean[] }
      const bNum = entityMap.get(bName) || { top: [] as boolean[], bottom: [] as boolean[] }
      if (aNum!.bottom.length === bNum!.bottom.length) {
        if (aNum!.top.length === bNum!.top.length) {
          return 0
        } else if (aNum!.top.length > bNum!.top.length) {
          return 1
        }
        return -1
      } else if (aNum!.bottom.length > bNum!.bottom.length) {
        return 1
      }
      return -1
    })

    // edges sort
    entityData.edges.sort((a: any, b: any) => {
      const aText = a.labels[0].attrs.label.text
      const bText = b.labels[0].attrs.label.text
      if (aText === bText) {
        return 0
      } else if (aText === 'memberOf') {
        return -1
      } else {
        return 1
      }
    })

    entityData.edges.forEach((edge: any) => {
      const { source, target } = edge

      if (source === target) return

      const num1 = entityMap.get(source)
      const num2 = entityMap.get(target)

      if (num1!.top.length === 1) {
        edge.sourcePort = 'top2'
      } else if (num1!.top[0] === false) {
        num1!.top[0] = true
        edge.sourcePort = 'top1'
      } else {
        edge.sourcePort = 'top3'
      }
      
      if (num2!.bottom.length === 1) {
        edge.targetPort = 'bottom2'
      } else {
        if (edge.sourcePort === 'top3') {
          edge.targetPort = 'bottom3'
        } else {
          edge.targetPort = 'bottom1'
        }
      }
    })

    for (const name in actions) {
      const { appliesTo } = actions[name]
      const principals = appliesTo.principalTypes || []
      const resources = appliesTo.resourceTypes || []
      operations.push({ name, principals, resources })

      const { nodes, edges } = getOperationData(name, principals, resources)
      nodes.forEach((n: string) => {
        if (!operationSet.has(n)) {
          operationSet.add(n)
          operationData.nodes.push({
            shape: 'custom-node-width-port2',
            id: n,
            label: n,
            ports: [
              { id: 'left', group: 'left' },
              { id: 'right', group: 'right' }
            ]
          })
        }
      })
      operationData.edges.push(...edges)
    }

    return { nameSpace, entities, operations, entityData, operationData }
  })

  function setSchema(sch: any) {
    schema.value = sch
  }

  return { schema, info, setSchema }
})
