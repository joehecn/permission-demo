export interface Tree {
  id: number
  label: string
  disabled?: boolean
  isPenultimate?: boolean
  children?: Tree[]
}
