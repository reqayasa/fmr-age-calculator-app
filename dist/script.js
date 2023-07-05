const form = document.getElementById('age-calculator');
const day = document.getElementById('day');
const month = document.getElementById('month');
const year = document.getElementById('year');

form.addEventListener('submit', (e) => {
    let messages =[];
    e.preventDefault();

    let isValid = formValidation();

    if(isValid) {
        console.log('start counting');
    }
} )

function formValidation() {
    let inputs = [day, month, year];
    let countNotValid = 0;
    resetError(inputs);

    inputs.forEach(input => {
        if(input.value == null || input.value == "") {
            setError(input, "This field is required");
            countNotValid++;
        }
    })

    console.log(countNotValid);
    if(countNotValid > 0)
        return false;


    if(countNotValid > 0)
        return false;
    else 
        return true;
}

function setError(input, message) {
    input.parentNode.classList.add('is-invalid');
    input.nextElementSibling.textContent = message;
}

function resetError(inputs) {
    inputs.forEach(input => {
        input.parentNode.classList.remove('is-invalid');
    });
}
