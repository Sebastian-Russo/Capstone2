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


/////////////// EVENT HANDLERS

function weeklyItemsHandler(){
  const weeklyItems = $('.weekly-items');
  $('.weekly-items-add').submit(function(event){
    event.preventDefault();
    const userInputItem = $('input[name="add-input-item"]').val(); // using the name attr of the input element to find the specific one that we want 
    console.log(userInputItem);
    const userInputAmount = $('input[name="add-input-amount"]').val();
    const newCost = Object.assign({}, STATE.budget, { // Obj.assign( 1st arg = target, 2nd arg = source, 3rd arg = ? )
      weeklyItems: [...STATE.budget.weeklyItems, {item: userInputItem, amount: userInputAmount}]
    })
    setState(STATE, {budget: newCost});
    console.log(STATE)
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
    console.log(STATE)
    renderCostOfLiving(STATE, costOfLiving);
  })
}


//load
$(weeklyItemsHandler);
$(weeklyBudgetHandler);
$(monthlyBudgetHandler);
$(costOfLivingHandler);

// BUDGET PAGE
// have render the right titles and layout
// print things to screen
// have amounts right
// add css
// fix weekly items add
// thats one page

// make html dynamic in app.js (do this last)

// header (the bar at the top)

// 2 more PAGES
// landing page (anybody arrives on before they sign in, welcome to...)
// sign in and sign up
