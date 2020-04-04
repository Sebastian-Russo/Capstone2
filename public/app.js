// landing page
// area for user to sign up/sign in
// dashboard holds budget
// user signs in, retrieves their budget
// user signs up, creates new budget, saves it to that user
// budget design - is it one form, several forms depending on area etc...

const STATE = {
  user: null,
  budget: null,
  route: 'landingPage',
  editing: false
};

//update state function 
const setState = (currentState=STATE, newState) => {
  Object.assign(currentState, newState);
};

// render monthly budget function
function renderMonthlyBudget(state, element){
  const result = `<li> Monthly Budget: ${state.budget} </li>`
  monthlyBudget.html(result)
}


// event handler
const monthlyBudget = $('.monthly-budget');
function monthlyBudgetHandler(){  
    $('.monthly-budget-add').submit(function(event){
    event.preventDefault();
    const userInput = $(event.currentTarget).find('#add-input').val();
    setState(STATE, { budget: userInput });
    renderMonthlyBudget(STATE, monthlyBudget)
    })
}

//load
$(monthlyBudgetHandler)








// function renderList(state, element){
//   const result = state.items.map(function(item){
//       return `<li> ${item} </li>`
//   })
//   element.html(result)
// }
//state.budget.weeklyItems.map(item =>{})
// (`
//   <div>
//     <div>${item.title}</div>
//     <div>${item.amount}</div>
//   </div>
// `)
// add class and id 