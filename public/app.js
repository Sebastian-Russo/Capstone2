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
      totalCost: null,
      totalExpenses: null,
      weeklyBudget: null,
      weeklyItems: [],
      monthlyBudget: null
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
  console.log(result);
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
    monthToWeeklyBudgetHandler();
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


//////// EVENT HANDLERS FOR USER SIGN UP AND USER LOGIN 

function userSignUpHandler(){
  // const userSignUpForm = ?
  $('.sign-up-form').submit(function(event){
    event.preventDefault();

    const userName = $('input[name="username-input').val();
    const userFirstName = $('input[name="first-name-input').val();
    const userLastName = $('input[name="last-name-input').val();
    const userEmail = $('input[name="email-name-input').val();
    const password = $('input[name="password-input').val();

    setState(STATE, {user: userName, userFirstName, userLastName, userEmail, password})
    // renderUser() ?
    console.log(user)
  })
}

function userLoginHandler(){
  // const userLogin = ?

  $('.login-form').submit(function(event){
    event.preventDefault();

    const userNameLogin = $('input[name="username-login-input"]').val();
    const passwordLogin = $('input[name="password-loging-input"]').val();

    setState(STATE, {user: userNameLogin, passwordLogin})
    // renderUser() ?

  })

}


//load
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