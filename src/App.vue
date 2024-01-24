<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'

const route = useRoute()
const routeName = computed(() => route.name)
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>Demo</el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu :default-active="routeName" router>
            <el-menu-item index="setting" :route="{ name: 'setting' }">
              <span>全局配置</span>
            </el-menu-item>
            <el-menu-item index="functional-role" :route="{ name: 'functional-role' }">
              <span>功能角色</span>
            </el-menu-item>
            <el-menu-item index="area-tree" :route="{ name: 'area-tree' }">
              <span>区域树</span>
            </el-menu-item>
            <el-menu-item index="organizational-tree" :route="{ name: 'organizational-tree' }">
              <span>部门管理</span>
            </el-menu-item>
            <el-menu-item index="data-role" :route="{ name: 'data-role' }">
              <span>数据角色</span>
            </el-menu-item>
            <el-menu-item index="user" :route="{ name: 'user' }">
              <span>用户管理</span>
            </el-menu-item>
          </el-menu>

          <el-divider />

          <el-menu :default-active="routeName" router>
            <el-menu-item index="policies" :route="{ name: 'policies' }">
              <span>策略</span>
            </el-menu-item>
            <el-menu-item index="policy-templates" :route="{ name: 'policy-templates' }">
              <span>策略模板</span>
            </el-menu-item>
          </el-menu>

          <el-divider />

          <el-menu :default-active="routeName" router>
            <el-menu-item index="schema" :route="{ name: 'schema' }">
              <span>架构</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style>
.el-aside {
  border-right: 1px solid var(--el-menu-border-color);
}
.el-menu {
  border-right: unset;
}
</style>

<style scoped>
/* header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
