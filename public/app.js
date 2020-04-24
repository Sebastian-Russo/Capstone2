// landing page
// area for user to sign up/sign in
// dashboard holds budget
// user signs in, retrieves their budget
// user signs up, creates new budget, saves it to that user
// budget design - is it one form, several forms depending on area etc...

const STATE = {
  user: {
    // id: "5e9a22970b377e32b85938d3", 
    // username: "jay", 
    // firstName: "jay", 
    // lastName: "jay", 
    // budget: "5ea18a7bddc7d553189582fd"
  },
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
function renderBudgetPage(){
  
  const monthlyCost = STATE.budget.costOfLiving.map(function(obj){ //.map(item =>{})
    return `<li> ${obj.item} : ${obj.amount} </li>`
  })

  const weeklyCost = STATE.budget.weeklyItems.map(function(obj){ //.map(item =>{})
    return `<li> ${obj.item} : ${obj.amount} </li>`
  })

  $('#budget-page').html(`
  <div class="container">
  <form class="cost-of-living-add">
    <label for="cost-input-item">Cost of Living Item</label>
    <input type="text" class="cost-of-living-add-item-input add-input" name="cost-input-item" placeholder="item">
    <label for="cost-input-amount">Cost of Living Amount</label>
    <input type="number" class="cost-of-living-add-amount-input add-input" name="cost-input-amount" placeholder="amount">
    <button class="cost-of-living-add-button">Add item</button>
  </form>

  <div class="item-list" >
    <h3>Cost of Living</h3>
    <ul class="cost-of-living">${monthlyCost}</ul>
    <div class="total-cost-of-living" >${STATE.budget.totalCost}</div>
  </div>
</div>

<div class="container">
  <form class="monthly-budget-add">
    <label for="add-monthly-input">Add Monthly Budget</label>
    <input type="text" class="monthly-budget-add-input" name="add-monthly-input" placeholder="amount">
    <button class="monthly-budget-add-button">Add item</button>
  </form>
  <div class="item-list"></div>
    <h3>Monthly Budget</h3>
    <div class="monthly-budget">
    <div> Monthly Budget: ${STATE.budget.monthlyBudget} </div>
    </div>
  </div>
</div>

<div class="container">
  <form class="weekly-budget-add">
    <label for="add-weekly-input">Add weekly Budget</label>
    <input type="text" class="weekly-budget-add-input" name="add-weekly-input" placeholder="amount">
    <button class="weekly-budget-add-button">Add item</button>
  </form>
  <div class="item-list">
    <h3>Weekly Budget</h3>
    <div class="weekly-budget">
      <div> Weekly Budget: ${STATE.budget.weeklyBudget} </div>
    </div>
  </div>
</div>

<div class="container">
  <form class="weekly-items-add">
    <label for="add-input-item">Weekley Items added</label>
    <input type="text" class="weekly-items-add-item-input add-input" name="add-input-item" placeholder="item">
    <label for="add-input-amount">Weekley Amount added</label>
    <input type="text" class="weekly-items-add-amount-input add-input" name="add-input-amount" placeholder="amount">
    <button class="weekly-items-add-button">Add item</button>
  </form>
  <div class="item-list">
    <h3>Weekly Items</h3>
    <ul class="weekly-items">${weeklyCost}</ul>
    <div class="total-cost-weekly-items" >${STATE.budget.totalExpenses}</div>
  </div>
</div>

<div class="container">
  <button id="save-budget">Save Budget Information</button>
</div>


</div>
  `)
};



/////////////// EVENT HANDLERS FOR BUDGET 

// total sum of the key values of `costOfLiving` and `weeklyItems`
function totalCostHandler(){
  const totalCost = $('.total-cost-of-living');  // grab the class
  const total = STATE.budget.costOfLiving.reduce(function(acc, x){ // reduce method, x iterates through costOfLiving keys
    return acc + Number(x.amount) // change string to number, x.item and x.amount keys, only need amount 
  }, 0) // third arg, index to start at

  const newBudget = Object.assign({}, STATE.budget, {totalCost: total}) // 1st arg = target, 2nd arg = state.budget obj, 3rd arg = state.budget.totalCost     (i wonder if there's a new arg everytime you go into another obj within an obj in state)
  setState(STATE, {budget: newBudget}); // set state with what was just updated
  renderBudgetPage();
}

function totalExpensesHandler(){
  const totalExpenses = $('.total-cost-weekly-items');
  const total = STATE.budget.weeklyItems.reduce(function(acc, x){
    return acc + Number(x.amount)
  }, 0)

  const newBudget = Object.assign({}, STATE.budget, {totalExpenses: total})
  setState(STATE, {budget: newBudget});
  renderBudgetPage();
}



function weeklyItemsHandler(){
  const weeklyItems = $('.weekly-items');
  $('body').on('submit', '.weekly-items-add', function(event){
    event.preventDefault();
    const userInputItem = $('input[name="add-input-item"]').val(); // using the name attr of the input element to find the specific one that we want 
    const userInputAmount = $('input[name="add-input-amount"]').val();
    
    const newCost = Object.assign({}, STATE.budget, { // Obj.assign( 1st arg = target, 2nd arg = source, 3rd arg = a sepparte obj to overwrite current )
      weeklyItems: [...STATE.budget.weeklyItems, {item: userInputItem, amount: userInputAmount}]
    })
    setState(STATE, {budget: newCost});
    totalExpensesHandler();  // piggybacking off weeklyItemsHandler() to trigger function, which added $ amounts when adding items and amounts to list 
    renderBudgetPage();
  })
}

function weeklyBudgetHandler(){  
  const weeklyBudget = $('.weekly-budget');
  $('body').on('submit', '.weekly-budget-add', function(event){
    event.preventDefault();
    // const userInput = $(event.currentTarget).find('#add-input').val();
    const userInput = $('input[name="add-weekly-input"]').val();
    // update state with budget, 3rd arg merges into 2nd without wiping everything out because it's specific to `weeklyBudget`
    const newBudget = Object.assign({}, STATE.budget, {
      weeklyBudget: userInput
    })
    setState(STATE, { budget: newBudget });
    renderBudgetPage();
  })
}

function monthlyBudgetHandler(){  
  const monthlyBudget = $('.monthly-budget');
  $('body').on('submit', '.monthly-budget-add', function(event){
    event.preventDefault();
    //const userInput = $(event.currentTarget).find('#add-input').val();
    const userInput = $('input[name="add-monthly-input"]').val();
    const newBudget = Object.assign({}, STATE.budget, {
      monthlyBudget: userInput
    })
    setState(STATE, { budget: newBudget });
    renderBudgetPage();
  })
}

function costOfLivingHandler(){
  const costOfLiving = $('.cost-of-living');
  $('body').on('submit', '.cost-of-living-add', function(event){
    event.preventDefault();

    const userInputItem = $('input[name="cost-input-item"]').val(); // using the name attr of the input element to find the specific one that we want 
    const userInputAmount = $('input[name="cost-input-amount"]').val();

    if (!!userInputItem && !!userInputAmount){

      const newCost = Object.assign({}, STATE.budget, { // Obj.assign( 1st arg = target, 2nd arg = source, 3rd arg = ? )
      costOfLiving: [...STATE.budget.costOfLiving, {item: userInputItem, amount: userInputAmount}]
    })
 
    setState(STATE, {budget: newCost});
    totalCostHandler(); // piggybacking on costOfLivingHandler() to trigger totalCostHandler 
    renderBudgetPage();
    }
  })
  //alert("You can't leave fields blank");
}



//////// EVENT HANDLERS FOR USER SIGN UP AND USER LOGIN AND BUDGET OBJ


// since the user is signed in, we're going to get their budget
// in our success handler, when we effectively update the user with the budget id
function updateUserSuccess(userObj){
  // update the user in the state with the budget id
  setState(STATE, {user: userObj});

  renderBudgetPage();
};

// take response in success handler
// save the id of the budget 
// then take user id from updateBudgetSuccess
// user.id find/make a put/update request to user endpoint with the id of the budget
// that way the user and budget will be linked to each other 
function updateUserWithBudgetSuccess(budgetObj){
  console.log('link budget obj to user obj', budgetObj)
  const settings = {
    url: `/api/users/${STATE.user.id}`,
    // because I'm grabbing the value from the object, it's just a string. unlike prviously below, i sent the whole object to create, so i didn't nee to add { } myself to update
    // `/user/router.js` put router has a condition: if(!(req.params.id && req.body.id && req.params.id == req.body.id)) 
    // send back id of budget obj we created, to link to user obj
    data: JSON.stringify({
      id: STATE.user.id,
      budget: budgetObj.id
    }),
    contentType: 'application/json',
    type: 'PUT',
    // then take that and update user with that information 
    success: updateUserSuccess,
    error: function(err){
      console.error(err)
    }
  };
  
  $.ajax(settings);
}

// create a post request, to create a budget
function createBudget(){ 
  console.log('budget created')
  const settings = {
    url: "/api/budget",
    // the other handlers have already updated the state with each click
    data: JSON.stringify(STATE.budget),
    contentType: 'application/json',
    type: 'POST',
    success: updateUserWithBudgetSuccess,
    error: function(err){
      console.error(err)
    }
  };

  $.ajax(settings);
}

function updateBudget(budgetObj){//////////////////////////////////////////////////////
  console.log('budget updated', budgetObj)
  const settings = {
    url: `/api/budget/${STATE.budget.id}`,
    data: JSON.stringify(STATE.user.budget),
    contentType: 'application/json',
    type: 'PUT',
    success: updateUserWithBudgetSuccess,
    error: function(err){
      console.error(err)
    }
  };

  $.ajax(settings);
}

// user creates budget, then we grab the info 
// if `#save-budget` is not in html code yet, so Jquery doesn't know how to put a listener on it if it doesn't exist yet
function userObjectHandler(){
  
  $('body').on('click', '#save-budget', function(event){
    event.preventDefault();
    // first thing `#save-budget` should do is update or create the budget 
    // all it's doing is making a request to the backend, does not need to update state 
    if(STATE.user.budget){
      
      updateBudget()
      console.log('updateBudget() was called')
    } else {
      createBudget()
      console.log('createBudget() was called')
    }
  })
}


// FLOW FOR USER SIGN UP 

function createUserSuccess(user){
  // (success callback for `createUser`) first thing we did is set the state with the user obj that we received, so now we have user information in our state
  setState(STATE, {user})
  renderBudgetPage();
}

// posting the user to your server so that the user exists in your database
// arg `user` comes from the `userSignUpHandler` what the user inputted
function createUser(user){
console.log('user created');
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

const updateStateWithBudget = budget => {
  setState(STATE, { budget }) // don't have to do { budget: budget } because same name 
  renderBudgetPage();
};

// when the user is signs in, it will automatically go get their budget
// in our success handler, we effectively update the user with the budget id
const getUserBudget = () => {
  //console.log('getting User Budget');
  const settings = {
    url: `/api/budget/${STATE.user.budget}`,
    contentType: 'application/json',
    type: 'GET',
    success: updateStateWithBudget,
    error: function(err){
      console.error('error getting budget', err)
    }
  };

  $.ajax(settings);
};

const checkBudget = () => {
  // if there's a user id, get the budget object with the associated id
  if (STATE.user.budget) {
    //console.log('getting budget');
    getUserBudget(STATE.user.budget);
    renderBudgetPage();
  } else {
    console.log('no budget');
    renderBudgetPage();
  }
};


//load
$(() => {
  checkBudget();
  userObjectHandler();
  userLoginHandler();
  userSignUpHandler();
  weeklyItemsHandler();
  weeklyBudgetHandler();
  monthlyBudgetHandler();
  costOfLivingHandler();
})



