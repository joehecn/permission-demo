import type { Tree } from '@/types'

export const orgTreeData: Tree[] = [
  {
    id: 1,
    label: '公司',
    children: [
      // {
      //   id: 2,
      //   label: '市场部'
      // },
      {
        id: 3,
        label: '产品部'
      },
      {
        id: 4,
        label: '开发部',
        children: [
          {
            id: 5,
            label: '前端组'
          },
          {
            id: 6,
            label: '后端组'
          }
        ]
      }
    ]
  }
]

export const areaTreeData: Tree[] = [
  {
    id: 1,
    label: '公司节点',
    children: [
      {
        id: 2,
        label: '公司区域 - 普通'
      },
      {
        id: 3,
        label: 'A栋节点',
        children: [
          {
            id: 4,
            label: 'A栋区域 - 普通'
          },
          {
            id: 5,
            label: 'A栋1层节点',
            children: [
              {
                id: 6,
                label: 'A栋1层区域 - 普通'
              },
              {
                id: 7,
                label: 'A栋1层区域 D0001 - 工位'
              }
              // {
              //   id: 8,
              //   label: 'A栋1层102房区域'
              // }
            ]
          },
          {
            id: 9,
            label: 'A栋2层节点',
            children: [
              {
                id: 10,
                label: 'A栋2层区域 - 普通'
              },
              {
                id: 11,
                label: 'A栋2层201房区域 - 普通'
              },
              {
                id: 12,
                label: 'A栋2层202房区域 - 普通'
              }
            ]
          }
        ]
      },
      {
        id: 13,
        label: 'B栋节点',
        children: [
          {
            id: 14,
            label: 'B栋区域 M01 - 会议室'
          }
          // {
          //   id: 15,
          //   label: 'B栋1层节点',
          //   children: [
          //     {
          //       id: 16,
          //       label: 'B栋1层区域'
          //     },
          //     {
          //       id: 17,
          //       label: 'B栋1层101房区域'
          //     },
          //     {
          //       id: 18,
          //       label: 'B栋1层102房区域'
          //     }
          //   ]
          // },
          // {
          //   id: 19,
          //   label: 'B栋2层节点',
          //   children: [
          //     {
          //       id: 20,
          //       label: 'B栋2层区域'
          //     },
          //     {
          //       id: 21,
          //       label: 'B栋2层201房区域'
          //     },
          //     {
          //       id: 22,
          //       label: 'B栋2层202房区域'
          //     }
          //   ]
          // }
        ]
      }
    ]
  }
]

export const travelTree = (tree: Tree[]): number[] => {
  const result: number[] = []
  const queue: Tree[] = JSON.parse(JSON.stringify(tree))

  while (queue.length) {
    const node = queue.shift()!

    result.push(node.id)

    if (node.children) {
      queue.push(...node.children)
    }
  }

  return result
}

export const findParent = (trees: Tree[], id: number): Tree | null => {
  const map = new Map<Tree, Tree>()

  const find = (trees: Tree[], id: number): Tree | null => {
    for (const tree of trees) {
      if (tree.id === id) {
        return tree
      }

      if (tree.children) {
        for (const child of tree.children) {
          map.set(child, tree)
        }
        const node = find(tree.children, id)

        if (node) {
          return node
        }
      }
    }

    return null
  }

  const node = find(trees, id)

  return map.get(node!) || null
}

export const filterData = (areas: number[], ids: number[]): number[] => {
  const result: number[] = []

  for (const id of ids) {
    if (!areas.includes(id)) {
      result.push(id)
    }
  }

  return result
}

export const addDisableds = (areaTreeData: Tree[], disableds: number[]): Tree[] => {
  const result: Tree[] = JSON.parse(JSON.stringify(areaTreeData))

  const travel = (tree: Tree[]): void => {
    for (const node of tree) {
      if (disableds.includes(node.id)) {
        node.disabled = true
      }

      if (node.children) {
        travel(node.children)
      }
    }
  }

  travel(result)

  return result
}
