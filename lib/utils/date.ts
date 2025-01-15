import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

const TIME_ZONE = 'Asia/Tokyo';

/**
 * 日本時間のDateオブジェクトを作成する
 * @param date - 変換する日付（デフォルトは現在時刻）
 * @returns 日本時間のDateオブジェクト
 */
export const createJSTDate = (date: Date = new Date()): Date => {
  return utcToZonedTime(date, TIME_ZONE);
};

/**
 * 指定された日付の0時0分0秒のJST DateオブジェクトをUTCとして返す
 * @param date - 対象の日付（デフォルトは現在時刻）
 * @returns 日本時間の0時0分0秒のDateオブジェクト（UTC）
 */
export const startOfJSTDay = (date: Date = new Date()): Date => {
  // 1. JSTでの現在時刻を取得
  const jstDate = utcToZonedTime(date, TIME_ZONE);

  // 2. JSTでの年月日を取得
  const year = jstDate.getFullYear();
  const month = jstDate.getMonth();
  const day = jstDate.getDate();

  // 3. UTC+9の0時を表すUTC時刻を作成（UTC-9時）
  return new Date(Date.UTC(year, month, day, -9, 0, 0, 0));
};

/**
 * 日付文字列とHH:mm形式の時刻文字列からJST DateオブジェクトをUTCとして作成する
 * @param date - 対象の日付
 * @param time - HH:mm形式の時刻文字列
 * @returns 日本時間のDateオブジェクト（UTC）
 */
export const createTimeWithJST = (date: Date, time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const jstDate = createJSTDate(date);
  jstDate.setHours(hours, minutes, 0, 0);
  return zonedTimeToUtc(jstDate, TIME_ZONE);
};
