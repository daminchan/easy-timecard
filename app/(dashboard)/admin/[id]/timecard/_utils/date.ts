/**
 * 時刻文字列（HH:mm形式）をDate型に変換する
 * @param baseDate - 基準となる日付
 * @param timeStr - 時刻文字列（HH:mm形式）
 * @returns 変換後のDate型、timeStrがnullの場合はnull
 * @example
 * ```tsx
 * // 2024-01-01の13:30を表すDateオブジェクトを作成
 * const baseDate = new Date('2024-01-01');
 * const date = createDateWithTime(baseDate, '13:30');
 * // => 2024-01-01T04:30:00.000Z (UTC)
 * ```
 */
export function createDateWithTime(baseDate: Date, timeStr: string | null): Date | null {
  if (!timeStr) return null;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return new Date(
    Date.UTC(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate(),
      hours - 9, // JST -> UTC の変換（-9時間）
      minutes
    )
  );
}
