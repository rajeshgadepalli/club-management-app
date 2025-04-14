import moment from 'moment-timezone';
export const IST_TZ = 'Asia/Kolkata';
export const DATE_FORMAT = {
    YYYY_MM_DD: "YYYY-MM-DD",
    YYYY_MM_DD_HH_MM_SS: "YYYY-MM-DD HH:mm:ss",
    DD_MMM_YYYY: "DD-MMM-YYYY",
    HH_MM_A: "HH:mm"
}

export const isSameDay = (date1: Date, date2: Date): boolean => {
    const d1 = moment.tz(date1, IST_TZ);
    const d2 = moment.tz(date2, IST_TZ);
    return d1.format(DATE_FORMAT.YYYY_MM_DD) === d2.format(DATE_FORMAT.YYYY_MM_DD);
};

export const convertToISTDate = (utcDate: Date): string => {
    return moment.tz(utcDate, IST_TZ).format(DATE_FORMAT.YYYY_MM_DD);
};

export const convertToISTDateTime = (utcDate: Date): string => {
    return moment.tz(utcDate, IST_TZ).format(DATE_FORMAT.YYYY_MM_DD_HH_MM_SS);
};

export const formatDate = (date: Date): string => {
    return moment.tz(date, IST_TZ).format(DATE_FORMAT.DD_MMM_YYYY);
};

export const formatTime = (date: Date): string => {
    return moment.tz(date, IST_TZ).format(DATE_FORMAT.HH_MM_A);
};