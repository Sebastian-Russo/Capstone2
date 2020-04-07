// landing page
// area for user to sign up/sign in
// dashboard holds budget
// user signs in, retrieves their budget
// user signs up, creates new budget, saves it to that user
// budget design - is it one form, several forms depending on area etc...

const STATE = {
  user: null,
  // this isnt the schema, and empty array will be fine;
  costOfLiving: [{item: null, amount: null}],
  budget: null,
  weeklyBudget: null,
  route: 'landingPage',
  editing: false
};

/* 
  Don't forget, 'costOfLiving' and 'weeklyBudget' are part of your 'budget'.
  You need to make sure your state accounts for that.
*/

//update state function 
const setState = (currentState=STATE, newState) => {
  Object.assign(currentState, newState);
};

// to update cost of living state 
/* 
  MO: I see what you are going for here, and its the right idea, but you shouldn't
  name it something so generic if it is for such a specific item. Also, try to keep it
  so you only have one function updating the state. You want to create what you are going
  to add to the state first, then update the state with setState() (go to line 167-169 of mikeEdits/app.js)
*/

function addItem(state, item){
  state.costOfLiving.push(item);
}

/////// RENDER FUNCTIONS 

function renderWeeklyBudget(state, element){
  const result = `<li> Weekly Budget: ${state.weeklyBudget} </li>`
  // MO: you should change this to element
  weeklyBudget.html(result)
}

// render monthly budget function
function renderMonthlyBudget(state, element){
  const result = `<li> Monthly Budget: ${state.budget} </li>`
  // MO: you should change this to element
  monthlyBudget.html(result)
}

// I realized my cost of living has two input fields, how would that work?
/* 
  MO:
  your cost of living handler should look for each input field by name.
  you should name each input field for what it is (example: cost-of-liv-item);
  (go to lines 157 thru 175 of mikeEdits/app.js)
*/


function renderCostOfLiving(state, element){
  const result = state.costOfLiving.map(function(item){ //.map(item =>{})
    /* 
      MO: these will return 'undefined'. state.costOfLiving is an array of ojbects, not an object.
      *hint* you may want to change the callback argument so you aren't doing item.item
    */
    return `<li> ${state.costOfLiving.item} : ${state.costOfLiving.amount} </li>`
  })
  element.html(result)
}

// event handlers

/* 
  MO: these variables that you put before each function should actually go inside the function.
  Try to limit global vars as much as possible
*/

const weeklyBudget = $('.weekly-budget');
function weeklyBudgetHandler(){  
    $('.weekly-budget-add').submit(function(event){
    event.preventDefault();
    const userInput = $(event.currentTarget).find('#add-input').val();
    setState(STATE, { weeklyBudget: userInput });
    renderWeeklyBudget(STATE, weeklyBudget)
    })
}

const monthlyBudget = $('.monthly-budget');
function monthlyBudgetHandler(){  
    $('.monthly-budget-add').submit(function(event){
    event.preventDefault();
    const userInput = $(event.currentTarget).find('#add-input').val();
    setState(STATE, { budget: userInput });
    renderMonthlyBudget(STATE, monthlyBudget)
    })
}

const costOfLiving = $('.cost-of-living');
function costOfLivingHandler(){
  $('.cost-of-living-add').submit(function(event){
    event.preventDefault();
    const userInputItem = $(event.currentTarget).find('#add-input').val();
    const userInputAmount = $(event.currentTarget).find('#add-input').val();
    addItem(STATE, {costOfLiving: [{item: userInputItem}, {amount: userInputAmount}]});
    renderCostOfLiving(STATE, costOfLiving);
  })
}

//load
$(weeklyBudgetHandler);
$(monthlyBudgetHandler);
$(costOfLivingHandler);


// function renderList(state, element){
//   const result = state.items.map(function(item){
//       return `<li> ${item} </li>`
//   })
//   element.html(result)
// }
// state.budget.weeklyItems.map(item =>{})
// (`
//   <div>
//     <div>${item.title}</div>
//     <div>${item.amount}</div>
//   </div>
// `)
// add class and id 