<script setup lang="ts">
import type { NodeData } from '@/stores/nodes'
import { NBadge, NIcon, NList, NListItem, NProgress, NText } from 'naive-ui'
import { calcPercentage, formatBytes, formatBytesPerSecond, formatUptime, getStatus } from '@/utils/helper'
import { getOSImage, getOSName } from '@/utils/osImageHelper'
import { getRegionCode, getRegionDisplayName } from '@/utils/regionHelper'

const props = defineProps<{
  nodes: NodeData[]
}>()

const emit = defineEmits<{
  click: [node: NodeData]
}>()

// 计算国旗图标路径
function getFlagSrc(region: string): string {
  const code = getRegionCode(region)
  return `/images/flags/${code}.svg`
}

// 计算状态
function getCpuStatus(cpu: number): 'default' | 'error' | 'warning' | 'success' {
  return getStatus(cpu)
}

function getMemPercentage(ram: number, memTotal: number): number {
  return calcPercentage(ram, memTotal)
}

function getDiskPercentage(disk: number, diskTotal: number): number {
  return calcPercentage(disk, diskTotal)
}

function handleClick(node: NodeData) {
  emit('click', node)
}
</script>

<template>
  <div class="node-list-wrapper">
    <NList hoverable clickable bordered class="min-w-fit w-full">
      <template #header>
        <div class="node-list-header">
          <div class="node-list-header__status">
            <NText :depth="3" class="text-xs">
              状态
            </NText>
          </div>
          <div class="node-list-header__region">
            <NText :depth="3" class="text-xs">
              地区
            </NText>
          </div>
          <div class="node-list-header__name">
            <NText :depth="3" class="text-xs">
              节点
            </NText>
          </div>
          <div class="node-list-header__uptime">
            <NText :depth="3" class="text-xs">
              运行时间
            </NText>
          </div>
          <div class="node-list-header__os">
            <NText :depth="3" class="text-xs">
              系统
            </NText>
          </div>
          <div class="node-list-header__cpu">
            <NText :depth="3" class="text-xs">
              CPU
            </NText>
          </div>
          <div class="node-list-header__mem">
            <NText :depth="3" class="text-xs">
              内存
            </NText>
          </div>
          <div class="node-list-header__disk">
            <NText :depth="3" class="text-xs">
              硬盘
            </NText>
          </div>
          <div class="node-list-header__traffic">
            <NText :depth="3" class="text-xs">
              流量
            </NText>
          </div>
        </div>
      </template>
      <NListItem v-for="node in props.nodes" :key="node.uuid" @click="handleClick(node)">
        <div class="node-list-item">
          <!-- 在线状态指示器 -->
          <div class="node-list-item__status">
            <NBadge :type="node.online ? 'success' : 'error'" :value="node.online ? '在线' : '离线'" />
          </div>

          <!-- 国旗 -->
          <div class="node-list-item__region">
            <NIcon size="20">
              <img :src="getFlagSrc(node.region)" :alt="getRegionDisplayName(node.region)" class="rounded-sm">
            </NIcon>
          </div>

          <!-- 节点名称 -->
          <div class="node-list-item__name">
            <NText class="text-sm font-semibold">
              {{ node.name }}
            </NText>
          </div>

          <!-- 运行时间 -->
          <div class="node-list-item__uptime">
            <NText :depth="3" class="text-xs">
              {{ formatUptime(node.uptime ?? 0) }}
            </NText>
          </div>

          <!-- 操作系统 -->
          <div class="node-list-item__os">
            <div class="flex gap-1 items-center">
              <NIcon size="16">
                <img :src="getOSImage(node.os)" :alt="getOSName(node.os)">
              </NIcon>
              <NText :depth="3" class="text-xs">
                {{ getOSName(node.os) }}
              </NText>
            </div>
          </div>

          <!-- CPU -->
          <div class="node-list-item__cpu">
            <div class="flex flex-col gap-0.5">
              <div class="text-xs flex gap-1 items-center">
                <NText>{{ (node.cpu ?? 0).toFixed(1) }}%</NText>
              </div>
              <NProgress :show-indicator="false" :percentage="node.cpu ?? 0" :status="getCpuStatus(node.cpu ?? 0)" :height="4" />
            </div>
          </div>

          <!-- 内存 -->
          <div class="node-list-item__mem">
            <div class="flex flex-col gap-0.5">
              <div class="text-xs flex gap-1 items-center">
                <NText>{{ getMemPercentage(node.ram ?? 0, node.mem_total ?? 0).toFixed(1) }}%</NText>
                <NText :depth="3">
                  ({{ formatBytes(node.ram ?? 0) }}/{{ formatBytes(node.mem_total ?? 0) }})
                </NText>
              </div>
              <NProgress :show-indicator="false" :percentage="getMemPercentage(node.ram ?? 0, node.mem_total ?? 0)" :status="getStatus(getMemPercentage(node.ram ?? 0, node.mem_total ?? 0))" :height="4" />
            </div>
          </div>

          <!-- 硬盘 -->
          <div class="node-list-item__disk">
            <div class="flex flex-col gap-0.5">
              <div class="text-xs flex gap-1 items-center">
                <NText>{{ getDiskPercentage(node.disk ?? 0, node.disk_total ?? 0).toFixed(1) }}%</NText>
                <NText :depth="3">
                  ({{ formatBytes(node.disk ?? 0) }}/{{ formatBytes(node.disk_total ?? 0) }})
                </NText>
              </div>
              <NProgress :show-indicator="false" :percentage="getDiskPercentage(node.disk ?? 0, node.disk_total ?? 0)" :status="getStatus(getDiskPercentage(node.disk ?? 0, node.disk_total ?? 0))" :height="4" />
            </div>
          </div>

          <!-- 流量 -->
          <div class="node-list-item__traffic">
            <div class="flex flex-col gap-0.5">
              <div class="text-xs flex gap-1 items-center">
                <NText>↑{{ formatBytes(node.net_total_up ?? 0) }} ↓{{ formatBytes(node.net_total_down ?? 0) }}</NText>
              </div>
              <div class="text-xs flex gap-1 items-center">
                <NText>↑{{ formatBytesPerSecond(node.net_out ?? 0) }} ↓{{ formatBytesPerSecond(node.net_in ?? 0) }}</NText>
              </div>
            </div>
          </div>
        </div>
      </NListItem>
    </NList>
  </div>
</template>

<style scoped>
.node-list-wrapper {
  overflow-x: auto;
  min-width: 0;
}

:deep(.n-list__header) {
  padding: 0px !important;
}

.node-list-header,
.node-list-item {
  display: grid;
  grid-template-columns: 52px 32px minmax(200px, 1fr) minmax(180px, 0.6fr) 120px 180px 180px 180px minmax(180px, 0.5fr);
  align-items: center;
  gap: 12px;
}

.node-list-header {
  padding: 8px 16px;
  background-color: var(--n-color-hover);
  border-radius: var(--n-border-radius);
}

.node-list-header__status,
.node-list-item__status {
  display: flex;
  justify-content: center;
  align-items: center;
}

.node-list-header__region,
.node-list-item__region {
  display: flex;
  justify-content: center;
}

.node-list-header__name,
.node-list-item__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-list-header__uptime,
.node-list-item__uptime {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.node-list-header__os,
.node-list-item__os {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-list-header__cpu,
.node-list-item__cpu,
.node-list-header__mem,
.node-list-item__mem,
.node-list-header__disk,
.node-list-item__disk {
  min-width: 0;
}

.node-list-header__traffic,
.node-list-item__traffic {
  min-width: 0;
}
</style>
