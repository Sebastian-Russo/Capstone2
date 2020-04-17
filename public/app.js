// landing page
// area for user to sign up/sign in
// dashboard holds budget
// user signs in, retrieves their budget
// user signs up, creates new budget, saves it to that user
// budget design - is it one form, several forms depending on area etc...

const STATE = {
  user: {},
  // this isnt the schema, and empty array will be fine;
  budget: {
      costOfLiving: [],
      totalCost: 0,
      totalExpenses: 0,
      weeklyBudget: 0,
      weeklyItems: [],
      monthlyBudget: 0
  },
  route: 'landingPage',
  editing: false
};


//update state function 
const setState = (currentState=STATE, newState) => {
  Object.assign(currentState, newState);
};

function updateUser(object){
  Object.assign(state, {
    user: object
  });
};



/////// RENDER FUNCTIONS 

function renderWeeklyItems(state, element){
  const result = state.budget.weeklyItems.map(function(obj){ //.map(item =>{})
    return `<li> ${obj.item} : ${obj.amount} </li>`
  })
  element.html(result)
}

function renderWeeklyBudget(state, element){
  const result = `<div> Weekly Budget: ${state.weeklyBudget} </div>`
  element.html(result)
}

// render monthly budget function
function renderMonthlyBudget(state, element){
  const result = `<div> Monthly Budget: ${state.budget} </div>`
  element.html(result)
}

function renderCostOfLiving(state, element){
  const result = state.budget.costOfLiving.map(function(obj){ //.map(item =>{})
    return `<li> ${obj.item} : ${obj.amount} </li>`
  })
  element.html(result)
}


function renderTotalAmountCost(state, element){
  const { totalCost } = state.budget  // object destructuring 
  const result = `<div> ${totalCost} </div>`  // just show this div
  element.html(result)
}

function renderTotalAmountExpenses(state, element){
  const { totalExpenses } = state.budget
  const result = `<div> ${totalExpenses} </div>`
  element.html(result)
}



/////////////// EVENT HANDLERS FOR BUDGET 

// total sum of the key values of `costOfLiving` and `weeklyItems`
function totalCostHandler(){
  const totalCost = $('.total-cost-of-living');  // grab the class
  const total = STATE.budget.costOfLiving.reduce(function(acc, x){ // reduce method, x iterates through costOfLiving keys
    return acc + Number(x.amount) // change string to number, x.item and x.amount keys, only need amount 
  }, 0) // third arg, index to start at

  const newBudget = Object.assign({}, STATE.budget, {totalCost: total}) // 1st arg = target, 2nd arg = state.budget obj, 3rd arg = state.budget.totalCost     (i wonder if there's a new arg everytime you go into another obj within an obj in state)
  setState(STATE, {budget: newBudget}); // set state with what was just updated
  renderTotalAmountCost(STATE, totalCost); // render state to the class/div grabbed in the begging
}

function totalExpensesHandler(){
  const totalExpenses = $('.total-cost-weekly-items');
  const total = STATE.budget.weeklyItems.reduce(function(acc, x){
    return acc + Number(x.amount)
  }, 0)

  const newBudget = Object.assign({}, STATE.budget, {totalExpenses: total})
  setState(STATE, {budget: newBudget});
  renderTotalAmountExpenses(STATE, totalExpenses)
}

// function monthToWeeklyBudgetHandler(){
//   const month = STATE.budget.monthlyBudget
//   const week = month

//   setState(STATE, { weeklyBudget: week });
//   renderWeeklyBudget(STATE, weeklyBudget)
// }


function weeklyItemsHandler(){
  const weeklyItems = $('.weekly-items');
  $('.weekly-items-add').submit(function(event){
    event.preventDefault();
    const userInputItem = $('input[name="add-input-item"]').val(); // using the name attr of the input element to find the specific one that we want 
    const userInputAmount = $('input[name="add-input-amount"]').val();
    const newCost = Object.assign({}, STATE.budget, { // Obj.assign( 1st arg = target, 2nd arg = source, 3rd arg = a sepparte obj to overwrite current )
      weeklyItems: [...STATE.budget.weeklyItems, {item: userInputItem, amount: userInputAmount}]
    })
    setState(STATE, {budget: newCost});
    totalExpensesHandler();  // piggybacking off weeklyItemsHandler() to trigger function, which added $ amounts when adding items and amounts to list 
    renderWeeklyItems(STATE, weeklyItems);
  })
}

function weeklyBudgetHandler(){  
  const weeklyBudget = $('.weekly-budget');
  $('.weekly-budget-add').submit(function(event){
    event.preventDefault();
    // const userInput = $(event.currentTarget).find('#add-input').val();
    const userInput = $('input[name="add-weekly-input"]').val();

    setState(STATE, { weeklyBudget: userInput });
    renderWeeklyBudget(STATE, weeklyBudget)
    })
}

function monthlyBudgetHandler(){  
  const monthlyBudget = $('.monthly-budget');
  $('.monthly-budget-add').submit(function(event){
    event.preventDefault();
    //const userInput = $(event.currentTarget).find('#add-input').val();
    const userInput = $('input[name="add-monthly-input"]').val();

    setState(STATE, { budget: userInput });
    renderMonthlyBudget(STATE, monthlyBudget);
  })
}

function costOfLivingHandler(){
  const costOfLiving = $('.cost-of-living');
  $('.cost-of-living-add').submit(function(event){
    event.preventDefault();

    const userInputItem = $('input[name="cost-input-item"]').val(); // using the name attr of the input element to find the specific one that we want 
    const userInputAmount = $('input[name="cost-input-amount"]').val();

    if (!! userInputItem && !!userInputAmount){
    const newCost = Object.assign({}, STATE.budget, { // Obj.assign( 1st arg = target, 2nd arg = source, 3rd arg = ? )
      costOfLiving: [...STATE.budget.costOfLiving, {item: userInputItem, amount: userInputAmount}]
    })
 
    setState(STATE, {budget: newCost});
    totalCostHandler(); // piggybacking on costOfLivingHandler() to trigger totalCostHandler 
    return renderCostOfLiving(STATE, costOfLiving);
    }
  })
  //alert("You can't leave fields blank");
}



//////// EVENT HANDLERS FOR USER SIGN UP AND USER LOGIN AND BUDGET OBJ

function updateBudgetSuccess(userBudgetObj){
  setState(STATE, {userBudgetObj})
}

// take response in success handler
// save the id of the budget 
// then take user id from updateBudgetSuccess
// user.id find/make a put/update request to user endpoint with the id of the budget
// that way the user and budget will be linked to each other 
function updateBudgetWithUserSuccess(userBudgetObj){
  
  const settings = {
    url: `/api/users/${STATE.user.id}`,
    // because I'm grabbing the value from the object, it's just a string. unlike prviously below, i sent the whole object, so i didn't nee to add { } myself 
    data: JSON.stringify({budget: userBudgetObj.id}),
    contentType: 'application/json',
    type: 'PUT',
    success: updateBudgetSuccess,
    error: function(err){
      console.error(err)
    }
  };
  
  $.ajax(settings);
}

// create a post request, to create a budget
// passing through `user` from successfully created user in the arg
function createUserBudgetObject(userBudgetObj){

  const settings = {
    url: "/api/budget",
    // want to send through a blank empty budget 
    data: JSON.stringify(userBudgetObj),
    contentType: 'application/json',
    type: 'POST',
    success: updateBudgetWithUserSuccess,
    error: function(err){
      console.error(err)
    }
  };
  
  $.ajax(settings);
}

// user creates budget, then we grab the info 
function userObjectHandler(){

  $('#save-budget').click(function(event){
    event.preventDefault();

    const userBudgetObj = STATE.budget
   
    createUserBudgetObject(userBudgetObj) 
  })
}



// FLOW FOR USER SIGN UP 

function createUserSuccess(user){
  // (success callback for `createUser`) first thing we did is set the state with the user obj that we received, so now we have user information in our state
  setState(STATE, {user})
  console.log(user)
}

// posting the user to your server so that the user exists in your database
// arg `user` comes from the `userSignUpHandler` what the user inputted
function createUser(user){
console.log(user)
  const settings = {
    url: "/api/users", // since it's in the server, you don't need a whole https//www.etc.com 
    data: JSON.stringify(user), // JSON.stringify() the object you're sending in app.js for POST AND PUT requests, because that's what your server expects/interacts with 
    contentType: 'application/json',
    type: 'POST',
    // if this request is successful, it's going to call a function (aka callback function), that means it's going to send back some information you're going to use 
    success: createUserSuccess,
    // error handler 
    error: function(err){
      console.error(err)
    }
  };
  // after validating^, creates a user object in database
  $.ajax(settings);
  // since it was successful, the server sent back part of the user object that was created (id, username, firstname, lastname) all back to the frontend, which we took and passed it through to our success
}

function userSignUpHandler(){
  // const userSignUpForm = ?
  $('.sign-up-form').submit(function(event){
    event.preventDefault();

    // created an object that's going to hold everything you need in the ajax request (got all this from the form the user inputted)
    const user = {
      username: $('input[name="username-input').val(),
      firstName: $('input[name="first-name-input').val(),
      lastName: $('input[name="last-name-input').val(),
      email: $('input[name="email-input').val(),
      password: $('input[name="password-input').val()
    }
    // uncontrolled inputs, once they hit submit, then it takes whatevers there and sends it up to the server
    // normal flow is to then set state
    // instead of setting state in your handler, we're going to pass all this information through to `createUser` 
    // arg `user`, function `userSignUpHandler()` is returning the result of `createUser()`
    createUser(user) 
  })
}


// If they sign in, you make your authentication requests to check the username/password and send back an auth token, which you should store in your state (or in session storage, if you wanna get fancy). You should also store their username and id (mongo id) in the state.

// If a login is successful, you should make a request to the budgets endpoint to look for the budget that belongs to that user, and return it

// When that is successful, you should make a post request to the budgets endpoint to create a new, blank budget with the userId stored on there so you can find it later

// auth functions 

function userLoginHandler(){

  $('.login-form').submit(function(event){
    event.preventDefault();

    const userNameLogin = $('input[name="username-login-input"]').val();
    const passwordLogin = $('input[name="password-loging-input"]').val();

    

  })

}




//load
$(userObjectHandler);
$(userLoginHandler);
$(userSignUpHandler);

$(weeklyItemsHandler);
$(weeklyBudgetHandler);
$(monthlyBudgetHandler);
$(costOfLivingHandler);


// BUDGET PAGE
// -- add css 
// -- fix weekly items add
// -- thats one page
// -- make cost of living & weekly budget items add key values and produce sum total
// -- header (the bar at the top)

// --landing page (anybody arrives on before they sign in, welcome to...) and user sign in
// ** watch mikes video 
// ** update weekly budgetHandler and monthly budgetHanlder 
// ** make functional ** explore /users/
// sign up page 

// make html dynamic in app.js (do this last)