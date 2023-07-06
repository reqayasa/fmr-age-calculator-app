const form = document.getElementById('age-calculator');
const dayInput = document.getElementById('day');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');

const dayOutput = document.getElementById('output-days');
const monthOutput = document.getElementById('output-months');
const yearOutput = document.getElementById('output-years');

const dayErrorMsg = "Must be a valid day";
const monthErrorMsg = "Must be a valid month";
const yearErrorMsg = "Must be in the past";
const emptyErrorMsg = "This field is required";
const wholeErrorMsg = "Must be a valid date";

class DateObj {
    constructor(day, month, year) {
        this.day     = parseInt(day, 10);
        this.month   = parseInt(month, 10);
        this.year    = parseInt(year, 10);
    }

    get julianDayNumber() {
        return getJulianDayNumber(this.day, this.month, this.year);
    }

    // get date string in format yyyymmdd withoute dash so it behave as integer not string
    get dateInt() {
        return (this.year * 10000) + (this.month * 100) + this.day;
    }
}

const todayDate = new Date();

const today = new DateObj(todayDate.getDate(),  todayDate.getMonth() + 1, todayDate.getFullYear())

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    resetError(dayInput, monthInput, yearInput);
    
    let isValidForm = formValidation(dayInput, monthInput, yearInput);
    if(! isValidForm)
        return;

    let birthDate = new DateObj(dayInput.value, monthInput.value, yearInput.value);

    let isValidDate = dateValidation(birthDate);
    if(! isValidDate)
        return
    
    // calculate age.
    let ageYear = today.year - birthDate.year;
    let ageMonth = today.month - birthDate.month;
    let ageDay = today.day - birthDate.day;
    
    if(ageDay < 0) {
        ageDay = birthDate.day - today.day;
        ageMonth--
    }

    if(ageMonth < 0) {
        ageMonth = (-ageMonth) % 12,
        ageYear--
    }

    showResult(yearOutput, ageYear, 35);
    showResult(monthOutput, ageMonth, 125);
    showResult(dayOutput, ageDay, 75);
} )

function showResult(htmlDOM, number, delay){
    let counts = setInterval(updated, delay);
    let upto = 0;
    htmlDOM.textContent = 0;
    function updated() {
        let count = htmlDOM;
        if (upto < number) {
            count.textContent = ++upto;
        } else 
            clearInterval(counts);
    }
}

// function calculateAge(birthDate, todayDate) {
//     let birthJulianDayNumber = birthDate.julianDayNumber;
//     let todayJulianDayNumber = todayDate.julianDayNumber;

//     // return age in days
//     return todayJulianDayNumber - birthJulianDayNumber
// }

function formValidation(day, month, year) {
    let countNotValid = 0;

    if(day.value == null || day.value == "") {
        setError(day, emptyErrorMsg);
        countNotValid++;
    } else if (isNaN(day.value)) {
        setError(day, dayErrorMsg);
        countNotValid++;
    }  else if (day.value < 1 || day.value > 31) {
        setError(day, dayErrorMsg);
        countNotValid++
    }

    if(month.value == null || month.value == "") {
        setError(month, emptyErrorMsg);
        countNotValid++;
    } else if (isNaN(month.value)) {
        setError(month, monthErrorMsg);
        countNotValid++;
    }  else if (month.value < 1 || month.value > 12) {
        setError(month, monthErrorMsg);
        countNotValid++;
    }

    if(year.value == null || year.value == "") {
        setError(year, emptyErrorMsg);
        countNotValid++;
    } else if (isNaN(year.value)) {
        setError(year, yearErrorMsg);
        countNotValid++;
    }  else if (year.value > today.year) {
        setError(year, yearErrorMsg);
        countNotValid++;
    }

    if(countNotValid > 0)
        return false;
    else 
        return true;
}

function dateValidation(dateObj) {
    let dateInt = dateObj.dateInt;
    let getDateInt = getCalenderDate(dateObj.julianDayNumber)

    if(dateObj.dateInt != getCalenderDate(dateObj.julianDayNumber)) {
        setError([dayInput, monthInput, yearInput], wholeErrorMsg, true);
        return false;
    }
    
    if(dateObj.dateInt >= today.dateInt) {
        setError([dayInput, monthInput, yearInput], yearErrorMsg, true);
        return false;
    }

    return true;
}

function setError(input, message, setToAll = false) {
    if(setToAll) {
        input.forEach(element => {
            element.parentNode.classList.add('is-invalid');
            element.nextElementSibling.textContent = "";
        });
        
        dayInput.nextElementSibling.textContent = message;
    } else {
        input.parentNode.classList.add('is-invalid');
        input.nextElementSibling.textContent = message;
    }
}

function resetError(...inputs) {
    inputs.forEach(input => {
        input.parentNode.classList.remove('is-invalid');
    });
}

function getJulianDayNumber (day, month, year) {
    let d = 1;
    let m = 1;
    let y = 1;

    if(month > 2) {
        d = day;
        m = month;
        y = year;
    } else {
        d = day;
        m = month + 12;
        y = year - 1;
    }

    // Date int with format YYYYMMDD for easy comparation
    let dateInt = (year * 10000) + (month * 100) + day

    let a = Math.trunc(y / 100);
    let b = 0;

    // if Gregorian Calender (after 15 Oct 1582 = ) calculate b.
    if(dateInt >= 15821015)
        b = 2 - a + Math.trunc(a / 4);

    // This date not exist.
    if(dateInt < 15821015 && dateInt > 15821004)
        setError([dayInput, monthInput, yearInput], wholeErrorMsg, true)

    let julianDayNumber = Math.trunc(365.25 * (y + 4716)) + Math.trunc(30.6001 * (m + 1)) + d + b - 1524.5;

    return julianDayNumber;
}

function getCalenderDate(julianDayNumber) {
    if(julianDayNumber < 0)
        return false;
    
    julianDayNumber += 0.5;

    let z = Math.trunc(julianDayNumber);
    let a = z;

    if(z >= 2299161) {
        let alfa = Math.trunc((z - 1867216.25)/36524.25);
        a = z + 1 + alfa - Math.trunc(alfa / 4);
    }

    let b = a + 1524;
    let c = Math.trunc((b - 122.1)/365.25);
    let d = Math.trunc(365.25 * c);
    let e = Math.trunc((b - d)/30.6001)
    let f = julianDayNumber - z;

    let thisDay = Math.trunc(b - d - Math.trunc(30.6001 * e) + f);
    let thisMonth;
    let thisYear;

    if(e < 14) 
        thisMonth = e - 1;
    else
        thisMonth = e - 13;

    if(thisMonth > 2)
        thisYear = c - 4716;
    else
        thisYear = c - 4715;

    return ((thisYear * 10000) + (thisMonth * 100) + thisDay);
}