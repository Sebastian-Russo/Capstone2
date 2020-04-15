// landing page
// area for user to sign up/sign in
// dashboard holds budget
// user signs in, retrieves their budget
// user signs up, creates new budget, saves it to that user
// budget design - is it one form, several forms depending on area etc...

const STATE = {
  user: null,
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
  const { totalCost } = state.budget
  const result = `<div> ${totalCost} </div>`
  element.html(result)
}

function renderTotalAmountExpenses(state, element){
  const { totalExpenses } = state.budget
  const result = `<div> ${totalExpenses} </div>`
  element.html(result)
}

/////////////// EVENT HANDLERS

// total sum of the key values of `costOfLiving` and `weeklyItems`
function totalCostHandler(){
  const totalCost = $('.total-cost-of-living');
  const total = STATE.budget.costOfLiving.reduce(function(acc, x){
    return acc + Number(x.amount)
  }, 0)

  const newBudget = Object.assign({}, STATE.budget, {totalCost: total})
  setState(STATE, {budget: newBudget});
  renderTotalAmountCost(STATE, totalCost);
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


function weeklyItemsHandler(){
  const weeklyItems = $('.weekly-items');
  $('.weekly-items-add').submit(function(event){
    event.preventDefault();
    const userInputItem = $('input[name="add-input-item"]').val(); // using the name attr of the input element to find the specific one that we want 
    console.log(userInputItem);
    const userInputAmount = $('input[name="add-input-amount"]').val();
    const newCost = Object.assign({}, STATE.budget, { // Obj.assign( 1st arg = target, 2nd arg = source, 3rd arg = a sepparte obj to overwrite current )
      weeklyItems: [...STATE.budget.weeklyItems, {item: userInputItem, amount: userInputAmount}]
    })
    setState(STATE, {budget: newCost});
    totalExpensesHandler();
    renderWeeklyItems(STATE, weeklyItems);
  })
}

function weeklyBudgetHandler(){  
  const weeklyBudget = $('.weekly-budget');
  $('.weekly-budget-add').submit(function(event){
    event.preventDefault();
    const userInput = $(event.currentTarget).find('#add-input').val();
    setState(STATE, { weeklyBudget: userInput });
    renderWeeklyBudget(STATE, weeklyBudget)
    })
}

function monthlyBudgetHandler(){  
  const monthlyBudget = $('.monthly-budget');
  $('.monthly-budget-add').submit(function(event){
    event.preventDefault();
    const userInput = $(event.currentTarget).find('#add-input').val();
    setState(STATE, { budget: userInput });
    renderMonthlyBudget(STATE, monthlyBudget)
    })
}

function costOfLivingHandler(){
  const costOfLiving = $('.cost-of-living');
  $('.cost-of-living-add').submit(function(event){
    event.preventDefault();
    const userInputItem = $('input[name="cost-input-item"]').val(); // using the name attr of the input element to find the specific one that we want 
    console.log(userInputItem);
    const userInputAmount = $('input[name="cost-input-amount"]').val();
    const newCost = Object.assign({}, STATE.budget, { // Obj.assign( 1st arg = target, 2nd arg = source, 3rd arg = ? )
      costOfLiving: [...STATE.budget.costOfLiving, {item: userInputItem, amount: userInputAmount}]
    })
    setState(STATE, {budget: newCost});
    totalCostHandler();
    renderCostOfLiving(STATE, costOfLiving);
  })
}


//load
$(weeklyItemsHandler);
$(weeklyBudgetHandler);
$(monthlyBudgetHandler);
$(costOfLivingHandler);


// BUDGET PAGE
// -- add css 
// -- fix weekly items add
// thats one page
// **make cost of living & weekly budget items add key values and produce sum total
// -- header (the bar at the top)

// **ON THIS STEP NOW--
// landing page (anybody arrives on before they sign in, welcome to...)
// sign in and sign up -did html, do i connect to server, or add more to app.js?

// make html dynamic in app.js (do this last)