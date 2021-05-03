import { DayOfWeek, DayOfWeekTh } from "../core/constant/DateTime"

const getDayOfWeekValue = (day: number): DayOfWeek => {
    switch (day) {
        case 1:
            return DayOfWeek.SUN
        case 2:
            return DayOfWeek.MON
        case 3:
            return DayOfWeek.TUE
        case 4:
            return DayOfWeek.WED
        case 5:
            return DayOfWeek.THU
        case 6:
            return DayOfWeek.FRI
        case 7:
            return DayOfWeek.SAT
        default:
            return DayOfWeek.UNKNOWN_DAY_OF_WEEK
    }
}

const isDayOfWeek = (day: number): boolean => {
    return Number.isInteger(day) && day.isBetween(DayOfWeek.SUN, DayOfWeek.SAT);
}

const getDayOfWeekTh = (day: number): string => {
    switch (day) {
        case DayOfWeek.SUN:
            return DayOfWeekTh.SUN
        case DayOfWeek.MON:
            return DayOfWeekTh.MON
        case DayOfWeek.TUE:
            return DayOfWeekTh.TUE
        case DayOfWeek.WED:
            return DayOfWeekTh.WED
        case DayOfWeek.THU:
            return DayOfWeekTh.THU
        case DayOfWeek.FRI:
            return DayOfWeekTh.FRI
        case DayOfWeek.SAT:
            return DayOfWeekTh.SAT
        default:
            return DayOfWeekTh.UNKNOWN_DAY_OF_WEEK
    }
}

export {
    getDayOfWeekValue,
    isDayOfWeek,
    getDayOfWeekTh
}