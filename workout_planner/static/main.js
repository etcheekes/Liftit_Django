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

// delete row from table
function deleteRowFromTable(buttonClass, endpoint) {

    // obtain array of references to delete buttons 
    deleteButtons = document.querySelectorAll(buttonClass)

    // add event listener to each button
    deleteButtons.forEach(item => {
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
    })
}

// To identify whether cells have event listener or not (required when altering cells in a row that the user just added, that is
// rather than cells from a row that first rendered through the flask backend rather than created and added using JavaScript)
let cellsWithEventListeners = [];
// reveal hidden form and submit form to alter cell value
function alterTableRowCell(buttonClass, endpoint, cellValueName) {

    // obtain array of references to buttons that reveal a hidden form once clicked
    selectedButtons = document.querySelectorAll(buttonClass);

    // add event listener to each button if it has not already got an event listener
    selectedButtons.forEach(item => {
        // check if current item is in cellsWithEventListeners
        if(!cellsWithEventListeners.includes(item)){
            // add event listener
            item.addEventListener('click', handleForm);
            // add to array
            cellsWithEventListeners.push(item);
        }
    })

    function handleForm(event) {

        // obtain reference to hidden form by: referencing button's parent node and referencing form through the parent node
        const btn = event.target;
        const btnParent = btn.parentNode;
        const form = btnParent.querySelector('form');

        // function expresssion for revealing form
        let formListener = (event) => {
        
            // use fetch to submit data asynchronously
            const formData = new FormData(form);
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
                // update table get value that the user submitted to update frontend table for user
                // if button was created using JavaScript, insert space before measurement (fixes alignment issue)
                if (btn.classList.contains("js_created")){
                    btn.innerHTML = `\u00A0${formData.get(cellValueName)}`;
                }
                else{
                    btn.innerHTML = formData.get(cellValueName);
                }
                form.style.display = "none";
            });  // hide and reset form
        }

        // reveal form if hidden, hide if revealed
        if (form.style.display === "none") {
            form.style.display = "inline";
            // add event listener to form, third argument ensures multiple listener events can't be triggered
            form.addEventListener('submit', formListener, { once: true });
        } else {
            form.style.display = "none";
    }
}   
}

// compare two node's inner text
function compareValues (identifier1, identifier2) {
    if (identifier1 === identifier2){
        return true;
    }
    return false;
}

// add row to table from form submit
function addRow(formClass, endpoint, tbodyElementIdentifier) {

    form = document.querySelector(formClass);

    // add event listener for form submit
    form.addEventListener('submit', (event) => {

        // if user is adding exercise to workout that is not currently rendered in table, then page reload and render workout
        // with new exercise added

        selectedWorkoutToView = document.querySelector('.wk_name_placeholder').textContent; 
        workoutToAddExerciseTo = document.querySelector('.add_exercise > select').value;

        // compare the users selected option with the wk_name_placeholdercontent, if differs then user is adding exercise to workout not selected
        if (compareValues(selectedWorkoutToView, workoutToAddExerciseTo)){
            // if identical then disable default response as table can be dynamically manipulated with JavaScript
            event.preventDefault();
        }

        // use fetch to submit data asynchronously
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
            
            // obtain reference to table 
            table = document.querySelector(tbodyElementIdentifier);

            // insert empty row at start of table
            const row = table.insertRow(0);

            // attach workout plan information to relevant rows
            const cellExercise = row.insertCell(0);
            cellExercise.innerHTML = data["track_ex__exercise"];

            const cellMuscle = row.insertCell(1);
            cellMuscle.innerHTML = data["track_ex__muscle"];

            const cellEquipment = row.insertCell(2);
            cellEquipment.innerHTML = data["track_ex__equipment"];

            // information needed for synchronising the backend and frontend from user altering reps, weight and measurement
            trackRow = data["track_row"];
            wkName = data["wk_name"];
        
            // Reps 
            const cellReps = row.insertCell(3);
            // create and append html td elements children
            alterReps(cellReps, trackRow, wkName, data["reps"]);
            // implement functionality for rep button
            alterTableRowCell(".access_reps", "customise-workouts", "rep_number");
            
            // Weight/measurement
            const cellWeightMeasuremet = row.insertCell(4);

            // create and append html weight td elements children
            alterWeight(cellWeightMeasuremet, trackRow, wkName, data["weight"]);
            // implement functionality for weight button
            alterTableRowCell('.access_weight', "customise-workouts", "weight_number");
    
            // create and append html measurement td elements children
            alterMeasurement(cellWeightMeasuremet, trackRow, wkName, data["measurement"]);
            // implement functionality for measurement button
            alterTableRowCell('.access_measurement', "customise-workouts", "measurement_update");

            // Delete option
            const cellDelete = row.insertCell(5);
            // create and append delete button
            toDelete(cellDelete, trackRow);
            // implement functionality for delete button
            deleteRowFromTable('.newlyAddedDeleteBtn', "customise-workouts");
        
            // clear user entered input
            formElements = obtainChildElements('.add_exercise', 'input');
            // clear ex name, reps, weight, and value 
            for (let i = 1; i < 5; i += 1){
                formElements[i].value = '';
              }

            // add google link to exercise name once the rest of row is added
            // tblCellGoogleSearch('table', 1);
            
        })
        .catch((error) => {
            console.error(`Failed to fetch: ${error}`);
            alert('Issue adding exercise to table, please try later or contact X email');
        });
    });
}

// create interactive <td> element that alters (repetition number in view_plan.html)

function alterReps(cell, rowIdentifier, wkName, reps) {
    // Recreate rep button
    // create button
    const btnChangeReps = document.createElement("button");
    btnChangeReps.setAttribute("type", "submit");
    btnChangeReps.setAttribute("class", "access_reps");
    btnChangeReps.setAttribute("data-toggle", "tooltip");
    btnChangeReps.setAttribute("title", "Click to change");
    btnChangeReps.textContent = reps;

    // create form
    const formChangeReps = document.createElement("form");
    formChangeReps.setAttribute("action", "/view_plan");
    formChangeReps.setAttribute("method", "post");
    formChangeReps.setAttribute("style", "display: none;");

    // input elements for form
    const repNumber = document.createElement("input");
    repNumber.setAttribute("type", "number");
    repNumber.setAttribute("name", "rep_number");

    const repRow = document.createElement("input");
    repRow.setAttribute("type", "hidden");
    repRow.setAttribute("name", "rep_row");
    repRow.setAttribute("value", rowIdentifier);

    const getWkName = document.createElement("input");
    getWkName.setAttribute("type", "hidden");
    getWkName.setAttribute("name", "get_wk_name");
    getWkName.setAttribute("value", wkName);

    const subBtn = document.createElement("input");
    subBtn.setAttribute("type", "submit");
    subBtn.setAttribute("value", "ok");

    // attain CSRF input element from other form to then place in this form
    const csrfToken_copy = document.querySelector('form > input').cloneNode();
    
    // attach input elements to form 
    formChangeReps.append(csrfToken_copy, repNumber, repRow, getWkName, subBtn);

    // attach button and form to cell
    cell.append(btnChangeReps, formChangeReps);
}

function alterWeight(cell, rowIdentifier, wkName, weight) {
    // recreate weight button
    const btnChangeWeight = document.createElement("button");
    btnChangeWeight.setAttribute("type", "submit");
    btnChangeWeight.setAttribute("class", "access_weight");
    btnChangeWeight.setAttribute("data-toggle", "tooltip");
    btnChangeWeight.setAttribute("title", "Click to change");
    btnChangeWeight.textContent = weight;

    // create form
    const formChangeWeight = document.createElement("form");
    formChangeWeight.setAttribute("action", "/view_plan");
    formChangeWeight.setAttribute("method", "post");
    formChangeWeight.setAttribute("style", "display: none;");

    // input elements for form

    const weightNumber = document.createElement("input");
    weightNumber.setAttribute("type", "number");
    weightNumber.setAttribute("name", "weight_number");

    const weightRow = document.createElement("input");
    weightRow.setAttribute("type", "hidden");
    weightRow.setAttribute("name", "weight_row");
    weightRow.setAttribute("value", rowIdentifier);

    const getWkNameWeight = document.createElement("input");
    getWkNameWeight.setAttribute("type", "hidden");
    getWkNameWeight.setAttribute("name", "get_wk_name");
    getWkNameWeight.setAttribute("value", wkName);

    const weightBtn = document.createElement("input");
    weightBtn.setAttribute("type", "submit");
    weightBtn.setAttribute("value", "ok");

    // attain CSRF input element from other form to then place in this form
    const csrfToken_copy = document.querySelector('form > input').cloneNode();

    // attach input elements to form 
    formChangeWeight.append(csrfToken_copy, weightNumber, weightRow, getWkNameWeight, weightBtn)

    // create div element to place measurement in
    const divWeight = document.createElement("div");
    divWeight.style.display = "inline-block"
    divWeight.append(btnChangeWeight, formChangeWeight);

    // attach button and form to cell5
    cell.append(divWeight);
}

function alterMeasurement(cell, rowIdentifier, wkName, measurement) {

    // maintain space before measurement with \u00A0; (browsers may trim whitespace)
    
    // create button
    const btnChangeMeasurement = document.createElement("button");
    btnChangeMeasurement.setAttribute("type", "submit");
    btnChangeMeasurement.classList.add("access_measurement", "js_created") // js_created buttons require space " " to align if editing value in table
    // btnChangeMeasurement.setAttribute("class", "access_measurement");
    btnChangeMeasurement.setAttribute("data-toggle", "tooltip");
    btnChangeMeasurement.setAttribute("title", "Click to change");
    btnChangeMeasurement.textContent = measurement;

    // create form
    const formChangeMeasurement = document.createElement("form");
    formChangeMeasurement.setAttribute("action", "/view_plan");
    formChangeMeasurement.setAttribute("method", "post");
    formChangeMeasurement.setAttribute("style", "display: none;");

    // input elements for form

    const measurementType = document.createElement("input");
    measurementType.setAttribute("type", "text");
    measurementType.setAttribute("name", "measurement_update");

    const measurementRow = document.createElement("input");
    measurementRow.setAttribute("type", "hidden");
    measurementRow.setAttribute("name", "measurement_row");
    measurementRow.setAttribute("value", rowIdentifier);

    const getWkNameMeasurement = document.createElement("input");
    getWkNameMeasurement.setAttribute("type", "hidden");
    getWkNameMeasurement.setAttribute("name", "get_wk_name");
    getWkNameMeasurement.setAttribute("value", wkName);

    const measurementBtn = document.createElement("input");
    measurementBtn.setAttribute("type", "submit");
    measurementBtn.setAttribute("value", "ok");

    // attain CSRF input element from other form to then place in this form
    const csrfToken_copy = document.querySelector('form > input').cloneNode();

    // attach input elements to form 
    formChangeMeasurement.append(csrfToken_copy, measurementType, measurementRow, getWkNameMeasurement, measurementBtn);

    // create div element to place measurement in
    const divMeasure = document.createElement("div");
    divMeasure.style.display = "inline-block"
    divMeasure.append(btnChangeMeasurement, formChangeMeasurement);

    // attach button and form to cell5
    cell.append(divMeasure);
}

// create delete button to send form to server

function toDelete(cell, rowIdentifier) {
    // create delete form
    const form = document.createElement("form");
    form.setAttribute("action", "/view_plan");
    form.setAttribute("method", "post");
    form.setAttribute("onsubmit", "return conDelete()");
    // create input elements for delete form
    const delInput = document.createElement("input");
    delInput.setAttribute("type", "hidden");
    delInput.setAttribute("name", "delete");
    // attain CSRF input element from other form to then place in this form
    const csrfToken_copy = document.querySelector('form > input').cloneNode();
    // obtain id number for the row, this is used to identify the row in the wk_plan table to delete from the server
    delInput.setAttribute("value", rowIdentifier);
    // create button
    const delButton = document.createElement("button");
    delButton.setAttribute("type", "submit");
    delButton.setAttribute("class", "newlyAddedDeleteBtn");
    delButton.textContent = "Delete";
    // append inputs to form
    form.appendChild(delInput);
    form.appendChild(delButton);
    form.appendChild(csrfToken_copy);
    // append delete form to cell 4
    cell.appendChild(form);
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