import { DateTimeValue } from "../core/constant/DateTime"

const getDayofWeekValue = (day: number): DateTimeValue => {
  switch (day) {
    case 1:
      return DateTimeValue.SUN
    case 2:
      return DateTimeValue.MON
    case 3:
      return DateTimeValue.TUE
    case 4:
      return DateTimeValue.WED
    case 5:
      return DateTimeValue.THU
    case 6:
      return DateTimeValue.FRI
    case 7:
      return DateTimeValue.SAT
    default:
      return DateTimeValue.UNKNOWN_DAY_OF_WEEK
  }
}

const isDayOfWeek = (day: number): boolean => {
  if (Number.isInteger(day) && day.isBewteen(DateTimeValue.SUN, DateTimeValue.SAT)) {
    return true
  } else {
    return false
  }
}

export {
  getDayofWeekValue,
  isDayOfWeek
}