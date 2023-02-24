// remove hidden tag

function showField() {
    document.getElementById('hiddenField').hidden = false;
  }

// change content in header

function changeHeader(h_tag, order, change) {
  // reference the header element
  let header = document.getElementsByTagName(h_tag)[order];
  // change its content
  header.innerHTML = change;
}

// change select option tag value

function changeOption(id, change) {
  document.getElementById(id).value = change;
}

// implement select option tag value

function clickOption(id_option, change, input_ele) {
    document.getElementById(id_option).value = change;
    document.getElementById(input_ele).click()
  }

// confirm delete

function conDelete() {
  return confirm("Confirm removal")
}

// obtain specific child elements of element by referencing the parent's element
function obtainChildElements(parentElementIdentifier, childElementIdentifier) {
    const parentElement = document.querySelector(parentElementIdentifier);
    return parentElement.querySelectorAll(childElementIdentifier);
}

// Order table ascending or descending order by col_num
function orderTable(col_num) {
    // obtain reference to button
    alphabetize = document.querySelector('#order')

    // event listener for button
    alphabetize.addEventListener('click', () => {

    let tbody, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;

    tbody = document.querySelector('#order_rows')
    switching = true;

    // set sorting direction ascending
    dir = "asc"

    // loop until no switching has been done
    while (switching) {
        // no switching done by default
        switching = false;
        rows = tbody.rows;
        // loop through tbody rows
        for (i = 0; i < rows.length - 1; i += 1) {
            // by default no switch should occur
            shouldSwitch = false
            // compare element from current row and one from next
            x = rows[i].querySelectorAll("TD")[col_num];
            y = rows[i + 1].querySelectorAll("TD")[col_num];
            // check if two rows should switch place, direct is determined
            // by whether dir = asc or desc
            if (dir === "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                  //mark switch and break loop:
                  shouldSwitch= true;
                  break;
                }
              } else if (dir === "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                  //mark switch and break loop:
                  shouldSwitch = true;
                  break;
            }
          }
        }
        if (shouldSwitch) {
            //if switch marked, make switch, and record a switch being done
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            // increase switchcount by 1 each time a switch is done
            switchcount += 1;
        } else {
            // reverse dir value if no switching has done (indicates table has already been sorted the opposing direction)
            if (switchcount === 0 && dir === "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
})
} 

let deleteButtonArray = []
// delete row from table
function deleteRowFromTable(buttonClass, endpoint) {

    // obtain array of references to delete buttons 
    deleteButtons = document.querySelectorAll(buttonClass)

    // add event listener to each button
    deleteButtons.forEach(item => {
        if (!deleteButtonArray.includes(item)){
            item.addEventListener('click', (event) => {
                // prevent default form submission
                event.preventDefault();
                // confirm deletion 
                if(!confirm("Confirm removal")){
                    return;
                };
                // obtain parent form element for button
                form = event.target.parentElement;
                // use fetch to submit form data asynchronously
                const formData = new FormData(form);
                fetch(endpoint, {
                    'method': 'POST',
                    'body': formData
                })
                // obtain response to request
                .then((response) => {
                    // if fetch request successful remove row from user's view once deleted from database
                    if (!response.ok) {
                        // if fetch request unsuccesfull retrieve status code to show what the error was and send to catch statement
                        // (this replaces the default default error object for the catch statement)
                        throw new Error(`HTTP error: ${response.status}`);
                    } 
                    // obtain row element
                    let rowDelete = event.target.closest('tr');
                    // remove row element
                    rowDelete.remove();
                })
                .catch((error) => {
                    console.error(`Failed to fetch: ${error}`);
                    alert('Unable to delete, please try again later or please contact X email with your issue');
                });
            })
            deleteButtonArray.push(item);
        }
    })
}

// To identify whether cells have event listener or not (required when altering cells in a row that the user just added, that is
// rather than cells from a row that first rendered through the backend rather than created and added using JavaScript)
let cellsWithEventListeners = [];

function handleCellChanges(endpoint, cellValueName, formIdentifier) {

    // obtain array of references to forms co containing cellValueName
    let hiddenForms = document.querySelectorAll(formIdentifier);

    // add event listener to each form if it lacks an event listener
    hiddenForms.forEach(form => {
        // if curent item is not in cellsWithListeneres
        if(!cellsWithEventListeners.includes(form)){
            // add event listener, third argument ensures multiple listener events can't be triggered
            form.addEventListener('submit', () => handleForms(event, endpoint, cellValueName), { once: true });
            // add to array
            cellsWithEventListeners.push(form);
        }
    })
}

function handleForms(event, endpoint, cellValueName) {
    console.log("hello")
    // use fetch to submit data asynchronously
    const formData = new FormData(event.target);
    // submitted value
    let submittedValue = formData.get(cellValueName)
    // only prevent default form action is user entry error detected (serverside then handles error messages)
    if (cellValueName === "rep_number" || cellValueName === "weight_number"){
        // preventDefault if positive number given
        if (submittedValue.length > 0 && (!isNaN(submittedValue))){
            event.preventDefault();
        }
    }
    else if (cellValueName === "measurement_update"){
        // preventDefault if string is provided
        if (submittedValue.length > 0 && isNaN(submittedValue)){
            event.preventDefault()
        }
    } 
    
    fetch(endpoint, {
        'method': 'POST',
        'body': formData
    })
    .then(() => {
        
        // Obtain reference to table cell value
        let grandparentElement = event.target.closest('.fade');
        let cellValue = grandparentElement.previousElementSibling;
        // Update frontend table for user
        cellValue.innerHTML = formData.get(cellValueName);
    });  // hide and reset form
}

// compare two node's inner text
function compareValues (identifier1, identifier2) {
    if (identifier1 === identifier2){
        return true;
    }
    return false;
}

// new version of addRow

function addRow(formClass, endpoint, tbodyElementIdentifier) {

    // obtain reference to form
    let form = document.querySelector(formClass);

    // add event listener for form submit
    form.addEventListener('submit', (event) => {

        // check if user is adding exercise to a workout plan that is already rendered/revealed
        selectedWorkoutToView = document.querySelector('.wk_name_placeholder').textContent; 
        workoutToAddExerciseTo = document.querySelector('.add_exercise > select').value;

        // compare the users selected option with the wk_name_placeholdercontent, if differs then user is adding exercise to workout not rendered
        if (!(compareValues(selectedWorkoutToView, workoutToAddExerciseTo))){
            // if not identical return from function (page is reloaded with exercise added to workout plan)
            return;
        }

        // if identical then disable default response as table can be dynamically manipulated with JavaScript
        event.preventDefault();

        // use fetch to submit data asynchronously
        form = event.target; // ensure correct form is used
        const formData = new FormData(form);

        /* loop through all form entires except measurement */
        for (const [key, value] of Array.from(formData.entries()).slice(0, -1)) {
            if (value == ''){
                alert('Please ensure workout is selected and all fields besides measurement are filled.');
                return;
            }
        }

        fetch(endpoint, {
            'method': 'POST',
            'body': formData,
        })
        // check response is ok, if so, then retrieve information on the user's last exercise added to workout
        .then(response => {
            // send error message to catch statement if response fails
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            // send error message if user has no filled all inputs
            // fetch data for new row
            return fetch("get_last_user_created_row/", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        })
        // obtain relevant data for the new exercise added to the user's workout if fetch request was successful
        // .then(response => response.json())
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }
            return response.json()
        })
        // update frontend table for user
        .then(data => {
            
            // obtain reference to table body
            let tableBody = document.querySelector(tbodyElementIdentifier);

            // obtain highest number in the ids for repChange, weightChange, and measurementChange cells
            let obtainId = 0;
            tableBodyChildren = tableBody.children;

            for (let num = 0; num < tableBodyChildren.length; num += 1) {
                // obtain id name
                let containsIdNum = tableBodyChildren[num].querySelector('.access_reps');
                // obtain string number and convert to num
                let compareNum = Number(containsIdNum.getAttribute('data-bs-target').replace(/\D/g, ''))
                // replace obtainId value if lower
                if (obtainId < compareNum){
                    obtainId = compareNum
                }
            }

            // new id num to add to repChange, weightChange, and measurementChange ids in new row
            const changeIdNum = (obtainId + 1).toString();
            
            // obtain copy of table row
            let firstRow = tableBodyChildren[0];
            let copiedRow = firstRow.cloneNode(true);
            
            // array reference to cells for loop
            cells = copiedRow.children;

            // replace relevant data that user sees
            for (let cell = 0 ; cell < cells.length; cell += 1) { // loop through each row cell
                // exercise cell
                if (cell === 0){
                    cells[cell].innerHTML = data["track_ex__exercise"];
                }
                // muscle cell
                else if (cell === 1){
                    cells[cell].innerHTML = data["track_ex__muscle"];
                }
                // equipment cell
                else if (cell === 2){
                    cells[cell].innerHTML = data["track_ex__equipment"];
                }
                // Reps cell
                else if (cell === 3){
                    // reference rep button
                    repButton = cells[cell].querySelector('.access_reps');
                    // alter rep count
                    repButton.innerHTML = data["reps"];
                    // alter data-bs-target attribute
                    let repDBT = repButton.getAttribute('data-bs-target').slice(0, -1) + changeIdNum;
                    repButton.setAttribute('data-bs-target', repDBT);

                    // reference rep modal window
                    let repModal = cells[cell].querySelector('.modal');
                    // alter id value
                    repModal.setAttribute('id', repDBT.slice(1));

                    // reference input element that contains table row id
                    let repRowId = repModal.querySelector('[name="rep_row"]');
                    // change repRowId value attribute to new row id
                    repRowId.setAttribute('value', data["track_row"]) 
                }
                // Weight cell
                else if (cell === 4){
                    // reference weight button
                    let weightButton = cells[cell].querySelector('.access_weights');
                    // alter rep count
                    weightButton.innerHTML = data["weight"];
                    // alter data-bs-target attribute
                    let weightDBT = weightButton.getAttribute('data-bs-target').slice(0, -1) + changeIdNum;
                    weightButton.setAttribute('data-bs-target', weightDBT);

                    // reference measurement button
                    let measurementButton = cells[cell].querySelector('.access_measurement');
                    // alter measurement value
                    measurementButton.innerHTML = data["measurement"];
                    // alter data-bs-target attribute
                    let measurementDBT = measurementButton.getAttribute('data-bs-target').slice(0, -1) + changeIdNum;
                    measurementButton.setAttribute('data-bs-target', measurementDBT);

                    // reference the two modal elements in current cell
                    let modalArray = cells[cell].querySelectorAll('.modal')

                    // reference weight and measurement modal windows
                    let weightModal = modalArray[0];
                    let measurementModal = modalArray[1];

                    // alter id attribute value for weight and measurement
                    weightModal.setAttribute('id', weightDBT.slice(1));
                    measurementModal.setAttribute('id', measurementDBT.slice(1));

                    // reference weight input element tha t contains table row id
                    let weightRowId = weightModal.querySelector('[name="weight_row"]'); 
                    // change weightRowId value attribute to new row id
                    weightRowId.setAttribute('value', data["track_row"]);

                    // reference weight input element that contains table row id
                    let measurementRowId = measurementModal.querySelector('[name="measurement_row"]');
                    // change measurementRowId value attribute to new row id
                    measurementRowId.setAttribute('value', data["track_row"]);

                }
                else{
                    // delete button

                    // alter row id
                    let deleteRowId = cells[cell].querySelector('[name="delete"]');
                    deleteRowId = data["track_row"];
                }
            }
        
            // append row to to table
            tableBody.append(copiedRow);

            // clear user entered input
            formElements = obtainChildElements('.add_exercise', 'input');
            // clear ex name, reps, weight, and value 
            for (let i = 1; i < 5; i += 1){
                formElements[i].value = '';
              }

            // add handleCellChanges event listener function
            handleCellChanges("/home/customise-workouts", "rep_number", ".alter_rep_value");
            handleCellChanges("/home/customise-workouts", "weight_number", ".alter_weight_value");
            handleCellChanges("/home/customise-workouts", "measurement_update", ".alter_measurement_value");

            // add delete event
            deleteRowFromTable('.delete_button', "/home/customise-workouts");
        })
        .catch((error) => {
            console.error(`Failed to fetch: ${error}`);
            alert('Issue adding exercise to table, please try later or contact X email');
        });
    });
}

// when clicking cell content, a google search in a new tab occurs with that cell's contents
function tblCellGoogleSearch(tbodyIdentifier, colNum) {

    // reference cells in specific column
    let cells = document.querySelectorAll(`${tbodyIdentifier} td:nth-child(${colNum})`);

    // for each cell 
    for (let i = 0; i < cells.length; i += 1){
        // if element already wrapped in <a> element then skip current loop iteration (tagName returns uppercase hence using A)
        if (cells[i].parentNode.tagName === "A"){
            // skip current loop iteration
            continue;
        }
        // save value
        cellContent = cells[i].textContent;
        // replace spaces with + so google search works
        // replace method uses regex where / / indicates blank space and g flag means replace all occurences 
        searchString = cellContent.replace(/ /g, "+");

        // reference current cell
        toEncase = cells[i];

        // anchor tag to wrap over current cell
        aWrapper = document.createElement("a")
        // attribute that creates an address using the specific string
        aWrapper.setAttribute("href", `http://www.google.com/search?q=${searchString}`);
        // attribute that makes so clicking the link opens the google search in a new tab
        aWrapper.setAttribute("target", "_blank");

        // place wrapper before the original element
        toEncase.insertAdjacentElement("beforebegin", aWrapper);
        
        // move original element to inside the wrapper
        aWrapper.appendChild(toEncase);
    }
}