
/**
 * 日期时间格式
 */
export const formatMap = new Map([
	['datetime', 'yyyy-mm-dd hh:MM:ss'],
	['date', 'yyyy-mm-dd'],
	['time', 'hh:MM:ss'],
	['year-month', 'yyyy-mm'],
	['year', 'yyyy'],
	['month', 'mm'],
	['day', 'dd'],
	['hour-minute', 'hh:MM']
]);

/**
 * 展示的 日期时间格式
 */
export const formatShowMap = new Map([
	['datetime', 'yyyy.mm.dd hh:MM:ss'],
	['date', 'yyyy.mm.dd'],
	['time', 'hh:MM:ss'],
	['year-month', 'yyyy.mm'],
	['year', 'yyyy'],
	['month', 'mm'],
	['day', 'dd']
]);

// 年为'yyyy', 月为'mm', 日为'dd', 时为'hh', 分为'MM', 秒为'ss'

// datetime 完整日期格式
// date 日期选择
// time 时间选择
// year-month 年月选择

// -------- dayjs --------

/**
 * dayjs 日期时间格式 (展示的)
 */
export const dayjsFormatMap = new Map([
	['datetime', 'YYYY-MM-DD HH:mm:ss'],
	['date', 'YYYY-MM-DD'],
	['time', 'HH:mm:ss'],
	['year-month', 'YYYY-MM'],
	['year', 'YYYY'],
	['month', 'MM'],
	['day', 'DD'],
	['hour-minute', 'HH:mm']
]);
