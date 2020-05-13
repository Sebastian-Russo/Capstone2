// landing page
// area for user to sign up/sign in
// dashboard holds budget
// user signs in, retrieves their budget
// user signs up, creates new budget, saves it to that user
// budget design - is it one form, several forms depending on area etc...

const STATE = {
  user: {
    id: "", 
    username: "", 
    firstName: "", 
    lastName: "", 
    budget: ""
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
  editing: false,
  jwt: ""
};


//update state function 
const setState = (currentState=STATE, newState) => {
  Object.assign(currentState, newState);
};

const updateUser = object => {
  Object.assign(state, {
    user: object
  });
};



/////// RENDER FUNCTIONS 

const renderLoginPage = () => {
  $('#page').html(`

  <div class="container" >
  <h2>Welcome</h2>
  <p>
    Here's your simple budget calculator to help you stay on track with your budget and monetary goals. List all your fixed bills you have each month; your "cost of living." This allows you to put aside that money already. 
    <br>
    <br>
    Examples: savings, rent, car payment, insurance, groceries (if consistent), phone/cable bills, etc. 
    <br>
    <br>
    Calculate and keep track of what's left. This is your monthly budget, which is your extra "spending money".  
    <br>
    <br>
    Your "spending money" is broken down week by week. This can be what you spend for fun, or unoccured expensenes. By adding each item daily for the week, it will help contiously keep track of what you spend your money on. 
    <br>
    <br> 
    If you find yourself going over your weekly limit, you can review where your spending habits focus. Then adjust how much you spend on those things, or be honest with yourself and give yourself more weekly spending money from your monthly budget you set for yourself. Or consider to yourself if you can curb habits.
    <br>
    <br>
    The first couple weeks are crucial to add each item to build the habit and monitor. At the same time don't beat yourself up if you go over your limits, you're still finding your baseline. Just make sure to adjust either your monthly budget or your spending habits. 
  </p>
</div>
  <div class="container">
  <h4>Sign In</h4>
  <form class="login-form">
    <label for="username-login-input">Username</label>
    <input type="text" class="login" name="username-login-input" placeholder="username">
    <label for="password-login-input">Password</label>
    <input type="text" class="password" name="password-login-input" placeholder="password">
    <button class="login-button">Login</button>
  </form>
 </div>
  
  <div class="container">
  <h4>Sign Up</h4>
  <form class="sign-up-form">
    <label for="username-input">Username</label>
    <input type="text" class="username-input add-input" name="username-input" placeholder="username">
    <label for="first-name-input">First Name</label>
    <input type="text" class="first-name-input add-input" name="first-name-input" placeholder="first name">
    <label for="last-name-input">Last Name</label>
    <input type="text" class="last-name-input add-input" name="last-name-input" placeholder="last name">
    <label for="email-input">Email</label>
    <input type="email" class="email-input add-input" name="email-input" placeholder="email">
    <label for="password">Password</label>
    <input type="password" class="password-input" name="password-input" placeholder="password">
    <button class="sign-up-button">Sign Up</button>
  </form>
</div>
  `)
}


const renderBudgetPage = () => {
  
  const monthlyCost = STATE.budget.costOfLiving.map(function(obj,i){ //.map(item =>{})
    return `
    <li class="list-item"> ${obj.item} : ${obj.amount} </li>
    <button class="delete-button" data-item-index=${i}>Delete Item</button>
    `
  })

  const weeklyCost = STATE.budget.weeklyItems.map(function(obj, i){ //.map(item =>{})
    return `
    <li> ${obj.item} : ${obj.amount} </li>
    <button class="delete-button" data-item-index=${i}>Delete Item</button>
    `
  })

  $('#page').html(`
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
  <div class="item-list">
    <h3>Weekly "Spending Money"</h3>
    <div class="weekly-budget">
      <div>Spending Money: ${STATE.budget.weeklyBudget} </div>
    </div>
  </div>
</div>

<div class="container">
  <form class="weekly-items-add">
    <label for="add-input-item">Weekly Items added</label>
    <input type="text" class="weekly-items-add-item-input add-input" name="add-input-item" placeholder="item">
    <label for="add-input-amount">Weekly Amount added</label>
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

const deleteItemHandler = () => {
  // click event listener
  $('body').on('click', '.delete-button', function(event){
    event.preventDefault();
    const selected = $(event.target).data('item-index');

    // for costOfMonth list
    const newItemsForMonth = STATE.budget.costOfLiving.filter((item, i) => i !== selected);
    // for weeklyItems list 
    const newItemsForWeek = STATE.budget.weeklyItems.filter((item, i) => i !== selected);
    
    const newState = Object.assign({}, STATE.budget, {
      costOfLiving: newItemsForMonth,
      weeklyItems: newItemsForWeek
    });
    setState(STATE, { budget: newState });

    updateBudget(); 
    totalCostHandler();
    totalExpensesHandler();
    renderBudgetPage();
  })
}

// total sum of the key values of `costOfLiving` and `weeklyItems`
const totalCostHandler = () => {
  const total = STATE.budget.costOfLiving.reduce(function(acc, x){ // reduce method, x iterates through costOfLiving keys
    return acc + Number(x.amount) // change string to number, x.item and x.amount keys, only need amount 
  }, 0) // third arg, index to start at

  const newBudget = Object.assign({}, STATE.budget, {totalCost: total}) // 1st arg = target, 2nd arg = state.budget obj, 3rd arg = state.budget.totalCost     (i wonder if there's a new arg everytime you go into another obj within an obj in state)
  setState(STATE, {budget: newBudget}); // set state with what was just updated
  renderBudgetPage();
}

const totalExpensesHandler = () => {
  const total = STATE.budget.weeklyItems.reduce(function(acc, x){
    return acc + Number(x.amount)
  }, 0)

  const newBudget = Object.assign({}, STATE.budget, {totalExpenses: total})
  setState(STATE, {budget: newBudget});
  renderBudgetPage();
}



const weeklyItemsHandler = () => {
  $('body').on('submit', '.weekly-items-add', function(event){
    event.preventDefault();
    const userInputItem = $('input[name="add-input-item"]').val(); // using the name attr of the input element to find the specific one that we want 
    const userInputAmount = $('input[name="add-input-amount"]').val();
    
    if (!!userInputItem && !!userInputAmount){
    const newCost = Object.assign({}, STATE.budget, { // Obj.assign( 1st arg = target, 2nd arg = source, 3rd arg = a sepparte obj to overwrite current )
      weeklyItems: [...STATE.budget.weeklyItems, {item: userInputItem, amount: userInputAmount}]
    })
    setState(STATE, {budget: newCost});
    totalExpensesHandler();  // piggybacking off weeklyItemsHandler() to trigger function, which added $ amounts when adding items and amounts to list 
    renderBudgetPage();
    } else {
      alert("You can't leave fields blank");
    }  
  })
}


const weeklyBudgetHandler = () => {  
  const monthlySpending = STATE.budget.monthlyBudget 
  const weeklySpending = Number(monthlySpending)/4
  const newBudget = Object.assign({}, STATE.budget, {
    weeklyBudget: weeklySpending
  })
  setState(STATE, { budget: newBudget });
  renderBudgetPage();
}


const monthlyBudgetHandler = () => {  
  $('body').on('submit', '.monthly-budget-add', function(event){
    event.preventDefault();
    //const userInput = $(event.currentTarget).find('#add-input').val();
    const userInput = $('input[name="add-monthly-input"]').val();
    
    if (!!userInput){
    const newBudget = Object.assign({}, STATE.budget, {
      monthlyBudget: userInput
    })
    setState(STATE, { budget: newBudget });
    weeklyBudgetHandler();
    renderBudgetPage();
    } else {
    alert("You can't leave fields blank");
    }
  })
}

const costOfLivingHandler = () => {
  $('body').on('submit', '.cost-of-living-add', function(event){
    event.preventDefault();

    const userInputItem = $('input[name="cost-input-item"]').val(); // using the name attr of the input element to find the specific one that we want 
    const userInputAmount = $('input[name="cost-input-amount"]').val();

    if (!!userInputItem && !!userInputAmount){
      // Obj.assign( 1st arg = target, 2nd arg = source, 3rd arg = ? )
      const newCost = Object.assign({}, STATE.budget, { 
      costOfLiving: [...STATE.budget.costOfLiving, {item: userInputItem, amount: userInputAmount}]
    })
    setState(STATE, {budget: newCost});
    totalCostHandler(); // piggybacking on costOfLivingHandler() to trigger totalCostHandler 
    renderBudgetPage();
    } else {
    alert("You can't leave fields blank");
    }
  })
}




//////// EVENT HANDLERS/ HTTP REQUESTS FOR USER SIGN UP AND USER LOGIN AND BUDGET OBJ

// FLOW FOR USER OBJ/DOCUMENT AND BUDGET OBJ/DOCUMENT TO UPDATE/CREATE/LINK TOGETHER 

// CREATE BUDGET AND LINK TO USER 
// since the user is signed in, we're going to get their budget
// in our success handler, when we effectively update the user with the budget id
const updateUserSuccess = userObj => {
  // update the user in the state with the budget id
  setState(STATE, {user: userObj});
  renderBudgetPage();
  totalCostHandler();
  totalExpensesHandler();
};

// take response in success handler
// save the id of the budget 
// then take user id from updateBudgetSuccess
// user.id find/make a put/update request to user endpoint with the id of the budget
// that way the user and budget will be linked to each other 
const updateUserWithBudgetSuccess = budgetObj => {
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
const createBudget = () => { 
  console.log('budget created')
  const settings = {
    url: "/api/budget",
    // the other handlers have already updated the state with each click
    data: JSON.stringify(STATE.budget),
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${STATE.jwt}`
    },
    type: 'POST',
    success: updateUserWithBudgetSuccess,
    error: function(err){
      console.error(err)
    }
  };

  $.ajax(settings);
}

const updateBudget = () => {
  console.log('budget updated')
  
  const settings = {
    url: `/api/budget/${STATE.user.budget}`,
    data: JSON.stringify(STATE.budget),
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${STATE.jwt}`
    },
    type: 'PUT',
    success: updateUserWithBudgetSuccess,
    error: function(err){
      console.error(err)
    }
  };

  $.ajax(settings);
}



// user creates/updates and saves budget, grab input with listener
// if `#save-budget` is not in html code yet, so Jquery doesn't know how to put a listener on it if it doesn't exist yet
const userObjectHandler = () => {
  
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



// HANDLES GRABBING THE USER'S BUDGET (CREATED OR NOT) AFTER LOGIN

const updateStateWithBudget = budget => {
  setState(STATE, { budget }) // don't have to do { budget: budget } because same name 
  totalCostHandler();
  totalExpensesHandler();
  renderBudgetPage();
};

// when the user is signs in, it will automatically go get their budget
// in our success handler, we effectively update the user with the budget id
const getUserBudget = () => {
  console.log('getting User Budget');
  const settings = {
    url: `/api/budget/${STATE.user.budget}`,
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${STATE.jwt}`
    },    
    type: 'GET',
    success: updateStateWithBudget,
    error: function(err){
      console.error('error getting budget', err)
    }
  };

  $.ajax(settings);
};


// HANDLES GRABBING THE USER'S BUDGET (CREATED OR NOT) AFTER LOGIN
const checkBudget = () => {
  // if there's a user id, get the budget object with the associated id
  if (STATE.user.budget) {
    getUserBudget(STATE.user.budget);
    //renderBudgetPage();
  } else {
    console.log('no budget');
    // renderBudgetPage();
    renderLoginPage();
  }
};


// REFRESH JWT

const refreshSuccess = (token) => {
  setState(STATE, { user: token.user, jwt: token.authToken, route: 'budget' })
  checkBudget()
}

// refreshing the JWT  -- not complete -- do i pull 'user' from login? 
const refreshJwt = (user) => {
  console.log('refresh user login');

  const settings = {
    url: "/api/auth/refresh", 
    data: JSON.stringify(user), 
    contentType: 'application/json',
    type: 'POST',
    success: refreshSuccess,
    error: function(err){
      console.error(err)
    }
  };

  $.ajax(settings);
}


// FLOW FOR USER TO LOGIN AND AUTHENTICATION AND TOKENIZE 

const tokenSuccess = (token) => {
  setState(STATE, { user: token.user, jwt: token.authToken, route: 'budget' })
  checkBudget()
}
// sending the username and password we just registered. response gets some JSON containing our JWT
const obtainJwt = (user) => {
  console.log('user signed in and made JWT');

  const settings = {
    url: "/api/auth/login", 
    data: JSON.stringify(user), 
    contentType: 'application/json',
    type: 'POST',
    success: tokenSuccess,
    // error handler 
    error: function(err){
      console.error(err)
    }
  };

  $.ajax(settings);
}


const userLoginHandler = () => {
  $('.login-form').submit(function(event){
    event.preventDefault();
    const user = {
      username: $('input[name="username-login-input"]').val(),
      password: $('input[name="password-login-input"]').val()
    }
    if (!!user.username && !!user.password){
    obtainJwt(user); 
    } else {
      alert("You can't leave fields blank");
    }
  })
}



// FLOW FOR USER SIGN UP 

const createUserSuccess = user => {
  // (success callback for `createUser`) first thing we did is set the state with the user obj that we received, so now we have user information in our state
  setState(STATE, {user})
  renderBudgetPage();
}

// posting the user to your server so that the user exists in your database
// arg `user` comes from the `userSignUpHandler` what the user inputted
const createUser = user => {
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

const userSignUpHandler = () => {
  
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
    if (!!user.username && !!user.firstName && !!user.lastName && !!user.email && !!user.password){
    createUser(user) 
    } else {
    alert("You can't leave fields blank");
    }
  })
}


// SEPARATE PAGES 
// you want to add another page listener that says if route === ‘landingPage’ render landing page stuff, else if route === ‘budget’ render budget page stuff

const pageListener = () => {

  if (STATE.route === 'landingPage') {
    renderLoginPage()
  } else if (STATE.route === 'budget') {
    // checkBudget instead of renderBudgetPage because checkBudget calls renderBudgetPage after it requests the budget obj/document from user login
    checkBudget()
  }

}



//load
$(() => {
  deleteItemHandler();
  pageListener();
  checkBudget();
  userObjectHandler();
  userLoginHandler();
  userSignUpHandler();
  weeklyItemsHandler();
  monthlyBudgetHandler();
  costOfLivingHandler();
})



