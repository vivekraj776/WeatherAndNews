let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

let monthsFull = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

function getFormattedDate(date) {
    date = date.split("-");
    let newDate = new Date(date[1] + "-" + date[2] + "-" + date[0]);
    return (
        weekdays[newDate.getDay()] +
        ", " +
        newDate.getDate() +
        " " +
        monthsFull[newDate.getMonth()]
    );
}

// eslint-disable-next-line no-undef
module.exports = {
    getFormattedDate
}