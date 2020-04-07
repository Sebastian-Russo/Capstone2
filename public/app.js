// landing page
// area for user to sign up/sign in
// dashboard holds budget
// user signs in, retrieves their budget
// user signs up, creates new budget, saves it to that user
// budget design - is it one form, several forms depending on area etc...

const STATE = {
  user: null,
  costOfLiving: [{item: null, amount: null}],
  budget: null,
  weeklyBudget: null,
  route: 'landingPage',
  editing: false
};

//update state function 
const setState = (currentState=STATE, newState) => {
  Object.assign(currentState, newState);
};

// to update cost of living state 
function addItem(state, item){
  state.costOfLiving.push(item);
}



/////// RENDER FUNCTIONS 

function renderWeeklyBudget(state, element){
  const result = `<li> Weekly Budget: ${state.weeklyBudget} </li>`
  weeklyBudget.html(result)
}

// render monthly budget function
function renderMonthlyBudget(state, element){
  const result = `<li> Monthly Budget: ${state.budget} </li>`
  monthlyBudget.html(result)
}

// I realized my cost of living has two input fields, how would that work?
function renderCostOfLiving(state, element){
  const result = state.costOfLiving.map(function(item){ //.map(item =>{})
    return `<li> ${state.costOfLiving.item} : ${state.costOfLiving.amount} </li>`
  })
  element.html(result)
}






// event handlers

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