/**
 * 格式化字节数为可读单位
 * @param bytes 字节数
 * @param decimals 小数位数
 * @returns 格式化后的字符串，如 "1.5 GB"
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0)
    return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / k ** i).toFixed(decimals)} ${units[i]}`
}

/**
 * 格式化字节速率为可读单位
 * @param bytes 字节速率
 * @returns 格式化后的字符串，如 "1.5 GB/s"
 */
export function formatBytesPerSecond(bytes: number): string {
  return `${formatBytes(bytes)}/s`
}

/**
 * 格式化运行时间
 * @param seconds 秒数
 * @returns 格式化后的字符串，如 "2 天 3 小时 15 分钟"
 */
export function formatUptime(seconds: number): string {
  if (!seconds || seconds <= 0)
    return '0 秒'

  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  const parts: string[] = []
  if (days > 0)
    parts.push(`${days} 天`)
  if (hours > 0)
    parts.push(`${hours} 小时`)
  if (minutes > 0)
    parts.push(`${minutes} 分钟`)
  if (secs > 0 || parts.length === 0)
    parts.push(`${secs} 秒`)

  return parts.join(' ')
}

/**
 * 计算占用百分比
 * @param used 已使用量
 * @param total 总量
 * @returns 百分比（0-100）
 */
export function calcPercentage(used: number, total: number): number {
  if (total === 0)
    return 0
  return (used / total) * 100
}

/**
 * 根据占用百分比返回状态
 * @param percentage 百分比
 * @returns 状态类型
 */
export function getStatus(percentage: number): 'success' | 'warning' | 'error' {
  if (percentage < 60)
    return 'success'
  if (percentage < 80)
    return 'warning'
  return 'error'
}

/**
 * 格式化时间戳为可读日期时间
 * @param timestamp 时间戳字符串或 Date 对象
 * @returns 格式化后的字符串，如 "2024-01-15 14:30:00"
 */
export function formatDateTime(timestamp: string | Date | undefined): string {
  if (!timestamp)
    return '-'

  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp

  if (Number.isNaN(date.getTime()))
    return '-'

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
