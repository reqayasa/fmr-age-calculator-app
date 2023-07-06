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

const dateObj = new Date()

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let day = parseInt(dayInput.value, 10);
    let month = parseInt(monthInput.value, 10)
    let year = parseInt(yearInput.value, 10);

    let birthDate = {
        day: day,
        month: month,
        year: year,
    }

    const today = new Date();
    let dayToday = today.getDate();
    let monthToday = today.getMonth();
    let yearToday = today.getFullYear();
    let todayDate = {
        day: dayToday,
        month: monthToday,
        year: yearToday,
    }
    
    resetError(dayInput, monthInput, yearInput);
    
    let isValidForm = formValidation(day, month, year);

    if(! isValidForm)
        return;

    let isValidDate = dateValidation(day, month, year);

    if(! isValidDate)
        return setError([dayInput, monthInput, yearInput], wholeErrorMsg, true)
    
    let ageYear = yearToday - year;
    let ageMonth = monthToday - month;
    let ageDay = dayToday - day;
    
    if(ageDay < 0) {
        ageDay = day - dayToday;
        ageMonth--
    }

    if(ageMonth < 0) {
        ageMonth = 12,
        ageYear--
    }

    showResult(yearOutput, ageYear, 35);
    showResult(monthOutput, ageMonth, 125);
    showResult(dayOutput, ageDay, 75);
    // calculateAge(birthDate, todayDate)
} )

function showResult(htmlDOM, number, delay){
    let counts = setInterval(updated, delay);
    let upto = 0;
    function updated() {
        let count = htmlDOM;
        count.innerHTML = ++upto;
        if (upto === number) {
            clearInterval(counts);
        }
    }
}

function calculateAge(birthDate, todayDate) {
    let birthJulianDayNumber = getJulianDayNumber(birthDate.day, birthDate.month, birthDate.year);
    let todayJulianDayNumber = getJulianDayNumber(todayDate.day, todayDate.date, todayDate.year);

    return todayJulianDayNumber - birthJulianDayNumber
}

function formValidation(day, month, year) {
    let countNotValid = 0;
    const currentYear = dateObj.getFullYear();

    if(dayInput.value == null || dayInput.value == "") {
        setError(dayInput, emptyErrorMsg);
        countNotValid++;
    } else if (isNaN(day)) {
        setError(dayInput, dayErrorMsg);
        countNotValid++;
    }  else if (day < 1 || day > 31) {
        setError(dayInput, dayErrorMsg);
        countNotValid++
    }

    if(monthInput.value == null || monthInput.value == "") {
        setError(monthInput, emptyErrorMsg);
        countNotValid++;
    } else if (isNaN(month)) {
        setError(monthInput, monthErrorMsg);
        countNotValid++;
    }  else if (month < 1 || month > 12) {
        setError(monthInput, monthErrorMsg);
        countNotValid++;
    }

    if(yearInput.value == null || yearInput.value == "") {
        setError(yearInput, emptyErrorMsg);
        countNotValid++;
    } else if (isNaN(year)) {
        setError(yearInput, yearErrorMsg);
        countNotValid++;
    }  else if (year > currentYear) {
        setError(yearInput, yearErrorMsg);
        countNotValid++;
    }

    if(countNotValid > 0)
        return false;
    else 
        return true;
}

function dateValidation(day, month, year) {
    let originDateString = (year * 10000) + (month * 100) + day;

    let julianDayNumber = getJulianDayNumber(day, month, year);
    let reverseStepDateString = getCalenderDate(julianDayNumber).dateString();

    if(originDateString == reverseStepDateString)
        return true;
    else
        return false;
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
    let dateString = (year * 10000) + (month * 100) + day

    let a = Math.trunc(y / 100);
    let b = 0;

    // if Gregorian Calender (after 15 Oct 1582 = ) calculate b.
    if(dateString >= 15821015)
        b = 2 - a + Math.trunc(a / 4);

    // This date not exit
    if(dateString < 15821015 && dateString > 15821004)
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
        thisYear = c- 4716;
    else
        thisYear = c - 4715;

    let calenderDate = {
        day: thisDay,
        month: thisMonth,
        year: thisYear,
        dateString: function() {
            return ((thisYear * 10000) + (thisMonth * 100) + thisDay);
        }
    }

    return calenderDate;
}