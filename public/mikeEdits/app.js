/* -------------------------------------------------------------------------------- */

// ONLY read below here after you have started from the top of your app.js and addressed the comments.
// Some answers are below this line, so if you want to do it without having that input, 
// do not read below until you have made updates and shown me

/* -------------------------------------------------------------------------------- */



// this is what your STATE should look like structure wise. 
// I only set the "route" to budget for now since we are working on the budget page

const STATE = {
  user: null,
  budget: {
    weeklyItems: [],
    weeklyBudget: 0,
    costOfLiving: [],
    monthlyBudget: 0,
  },
  route: 'budget',
  editing: false
};

/* -----update state function----- */

const setState = (currentState=STATE, newState) => {
  Object.assign(currentState, newState);
  console.log(STATE)
};

/* -----RENDER FUNCTIONS----- */

const renderWeeklyBudget = () => {
  // nested object destructuring
  const { budget: { weeklyBudget } } = STATE;
  $("#weekly-budget-container").html(`
    <h2 class="section-title">Weekly Budget</h2>
    <form class="weekly-budget-add">
      <label for="weekly-budget-input">Update Weekly Budget</label>
      <input type="text" name="weekly-budget-input" class="add-input">
      <button id="weekly-budget-add-button" class="budget-button">Save</button>
    </form>
    <div class="weekly-budget-container">
      <div>Current Weekly Budget:</div>
      <div class="weekly-budget">${weeklyBudget}</div>
    </div>
  `);
};

const renderWeeklyItems = () => {
  // nested object destructuring
  const { budget: { weeklyItems } } = STATE;
  // since you should add the title of the section to the HTML, you don't need to worry about it here
  const items = weeklyItems.map(week => `<li> ${week.item}: ${week.amount} </li>`).join('');
  $('#weekly-items-container').html(`
    <h2 class="section-title">Weekly Items</h2>
    <form class="weekly-items-add">
      <label for="weekly-budget-item">Item</label>
      <input type="text" name="weekly-budget-item" class="add-input">
      <label for="weekly-budget-amount">Amount</label>
      <input type="text" name="weekly-budget-amount" class="add-input">
      <button id="weekly-items-add-button" class="budget-button">Add item</button>
    </form>
    <div class="display-container">
      <div>Current Weekly Items:</div>
      <ul class="weekly-items">${items}</ul>
    </div>
  `);
};

const renderMonthlyBudget = () => {
  // nested object destructuring
  const { budget: { monthlyBudget } } = STATE;
  $("#monthly-budget-container").html(`
    <h2 class="section-title">Monthly Budget</h2>
    <form class="monthly-budget-add">
      <label for="monthly-budget-input">Update Budget</label>
      <input type="text" name="monthly-budget-input" class="add-input">
      <button id="monthly-budget-add-button" class="budget-button">Save</button>
    </form>
    <div class="display-container">
      <div>Current Monthly Budget:</div>
      <div id="monthly-budget">${monthlyBudget}</div>
    </div>
  `);
};

const renderCostOfLiving = () => {
  // nested object destructuring
  const { budget: { costOfLiving } } = STATE;
  const items = costOfLiving.map(cost => `<li> ${cost.item} : ${cost.amount} </li>`).join('');
  $("#cost-of-living-container").html(`
    <h2 class="section-title">Cost of Living</h2>
    <form class="cost-of-living-add">
      <label for="cost-of-liv-item">Item</label>
      <input type="text" name="cost-of-liv-item" class="add-input">
      <label for="cost-of-liv-amount">Amount</label>
      <input type="text" name="cost-of-liv-amount" class="add-input">
      <button id="cost-of-living-add-button" class="budget-button">Add item</button>
    </form>
    <div class="display-container">
        <div>Current Cost of Living:</div>
        <ul id="cost-of-living-list">${items}</ul>
    </div>
  `);
};

const weeklyBudgetHandler = () => {  
  event.preventDefault();
  const { budget } = STATE;
  const userInput = $('input[name="weekly-budget-input"]').val();
  
  // make sure userInput is truthy
  if (!!userInput) {
    // only update the part of the state we are trying to change
    const newBudget = Object.assign({}, budget, { weeklyBudget: userInput })
    setState(STATE, { budget: newBudget });
    return renderPage();
  }
  
  // or else post an alert to have them update the fields
  alert("You can't leave fields blank");
};

const monthlyBudgetHandler = (event) => {  
  event.preventDefault();
  const { budget } = STATE;
  const userInput = $('input[name="monthly-budget-input"]').val();
  // make sure userInput is truthy
  if (!!userInput) {
    // only update the part of the state we are trying to change
    const newBudget = Object.assign({}, budget, { monthlyBudget: userInput })
    setState(STATE, { budget: newBudget});
    return renderPage();
  }

  // or else post an alert to have them update the fields
  alert("You can't leave fields blank");
};

const weeklyItemsHandler = (event) => {
  event.preventDefault();
  const { budget } = STATE;
  // make sure you read the answers to line 47 and 23 before asking what I did here
  const item = $('input[name="weekly-budget-item"]').val();
  const amount = $('input[name="weekly-budget-amount"]').val();

  // check that item and amount are truthy values
  if(!!item && !!amount){
  // use spread operator to create a new array that adds new item to already existing array
  // also use object shorthand ({item: item} can just be { item })
    const newBudget = Object.assign({}, budget, {
      weeklyItems: [...budget.weeklyItems, { item, amount }]
    });

    setState(STATE, { budget: newBudget });
    console.log(STATE);
    return renderPage();
  };

  // or else post an alert to have them update the fields
  alert("You can't leave fields blank");
};

const costOfLivingHandler = (event) => {
  event.preventDefault();
  const { budget } = STATE;
  const item = $('input[name="cost-of-liv-item"]').val();
  const amount = $('input[name="cost-of-liv-amount"]').val();

  // check that item and amount are truthy values
  if(!!item && !!amount) {
  // use spread operator to create a new array that adds new item to already existing array
  // also use object shorthand ({item: item} can just be { item })
    const newBudget = Object.assign({}, budget, {
      costOfLiving: [...budget.costOfLiving, { item, amount }]
    });
  
    setState(STATE, { budget: newBudget });
    return renderPage();
  }
  // or else post an alert to have them update the fields
  alert("You can't leave fields blank");
};

/* 
since this app will have a few pages, it's important to 
seperate how they get rendered
*/
const renderBudgetPage = () => {
  renderWeeklyItems();
  renderWeeklyBudget();
  renderCostOfLiving();
  renderMonthlyBudget();
};

// decide what to render based on what page the user is on
const renderPage = () => {
  const { route } = STATE;
  if (route === "budget") {
    return renderBudgetPage();
  }
  // else if (route === "landingPage") {
  //   return renderLandingPage()
  // } etc...
};

/* 
  We are going to need to change the listeners since these forms aren't going to be there to start,
  rather, they will be rendered with the budget page only
*/

$('#main').on('submit', '.weekly-items-add', weeklyItemsHandler);
$('#main').on('submit', '.weekly-budget-add', weeklyBudgetHandler);
$('#main').on('submit', '.cost-of-living-add', costOfLivingHandler);
$('#main').on('submit', '.monthly-budget-add', monthlyBudgetHandler);

// render the page to start. this will happen based on what route you are on.
$(renderPage);