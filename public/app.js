const STATE = {
  user: {},
  budget: {
    costOfLiving: [],
    monthlyBudget: 0,
    weeklyBudget: 0,
    weeklyItems: []
  },
  route: 'landingPage',
  editing: false,
  jwt: ''
};


/* ---------- UPDATE STATE ---------- */

/*
  NOTE: I changed the order of the arguments so that you don't need to give it STATE every time
  you call it. Makes the code cleaner. Also, I updated the setState function a bit.  I wanted
  you to get used to using Object.assign a bunch, but now we can just put it in one place
*/
const setState = (newItem, currentState=STATE) => {
  const newState = Object.assign({}, currentState, newItem);
  Object.assign(currentState, newState);

  // set the session storage with the STATE, this will stop you from losing progress every refresh
  sessionStorage.setItem('appState', JSON.stringify(STATE));
  // by putting this here, you do not need to specifically call a rerender after each action
  render();
};

/* 
  This function (updateUser) is redundant. Also, "state" is undefined in this. 
  BUT, I like where your head is at here.  Very DRY mentality.
  I'll throw in an additional state update function for budget to show you how it would go.
  NOTE: this will help you understand React Hooks later (but don't worry about that now)
*/

// const updateUser = object => {
//   Object.assign(state, {
//     user: object
//   });
// };

const setBudget = (newItem, currentBudget=STATE.budget) => {
  setState({ budget: Object.assign({}, currentBudget, newItem)});
};

/* ---------- TEMPLATE HELPERS ---------- */

const getTotal = list => list.reduce((acc, x) => {
  return acc + Number(x.amount)
}, 0);

const createList = (type, list) => {
  return list.map((obj, i) => (`
    <li class="list-item">
      <span class="list-span">${obj.item}: </span>
      <span class="list-span">$${obj.amount}</span>
      <span class="delete-button" data-type=${type} data-item-index=${i}>
        Delete
      </span>
    </li>
  `)).join("");
};

/* ---------- TEMPLATES ---------- */

const langingPageText = (`
  <div class="container" id="landing-page-text">
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
`);

const userActionForms = (`
  <div id="user-actions" class="container">
    <div id="login-container">
      <h4>Sign In</h4>
      <form class="login-form landing-form">
        <input type="text" class="login" name="username-login-input" placeholder="username">
        <input type="password" class="password" name="password-login-input" placeholder="password">
        </form>
        <button class="login-button">Submit</button>
    </div>

    <div id="sign-up-container">
      <h4>Sign Up</h4>
      <form class="sign-up-form landing-form">
        <input type="text" name="username-input" placeholder="username">
        <input type="text" name="first-name-input" placeholder="first name">
        <input type="text" name="last-name-input" placeholder="last name">
        <input type="email" name="email-input" placeholder="email">
        <input type="password" name="password-input" placeholder="password">
        </form>
        <button id="sign-up-button" class="form-buton" type="submit">Sign Up</button>
    </div>
  </div>
`);

const createBudgetPage = () => {
  const {
    weeklyItems,
    costOfLiving,
    monthlyBudget
  } = STATE.budget;

  const weeklyTotal = getTotal(weeklyItems);
  const weeklyItemsList = createList('weeklyItems', weeklyItems);

  const costOfLivingTotal = getTotal(costOfLiving);
  const costOfLivingList = createList('costOfLiving', costOfLiving);

  return (`
    <div class="container">
      <div id="available-funds" class="section">
        <div id="monthly-budget-container" class="section-container">
          <h3>Monthly Income</h3>
          <form id="monthly-budget-add" class="budget-form">
            <label for="add-monthly-input">$</label>
            <input type="text" name="add-monthly-input" placeholder=${monthlyBudget}>
            <button id="monthly-budget-add-button" class="add-button">Update</button>
          </form>
        </div>

        <div id="weekly-budget-container" class="section-container">
          <h3>Weekly "Spending Money"</h3>
          <div>$${monthlyBudget - costOfLivingTotal}</div>
        </div>
      </div>

      <div id="list-elements" class="section">
        <div id="cost-of-living-container" class="section-container">
          <h3>Cost of Living: $${costOfLivingTotal}</h3>
          <ul id="cost-of-living" class="item-list">${costOfLivingList}</ul>
          <form id="cost-of-living-add" class="budget-form">
            <input type="text" class="cost-of-living-add-item-input add-input" name="cost-input-item" placeholder="item">
            <input type="number" class="cost-of-living-add-amount-input add-input" name="cost-input-amount" placeholder="amount">
            <button id="cost-of-living-add-button">Add item</button>
          </form>
        </div>

        <div id="weekly-items-container" class="section-container">
          <h3>Weekly Items: $${weeklyTotal}</h3>
          <ul class="weekly-items">${weeklyItemsList}</ul>
          <form id="weekly-items-add" class="budget-form">
            <input type="text" name="add-input-item" placeholder="item">
            <input type="text" name="add-input-amount" placeholder="amount">
            <button id="weekly-items-add-button" class="add-button">Add item</button>
          </form>
        </div>
      </div>

      <div class="section-container">
        <button id="save-budget">Save Budget Information</button>
      </div>
    </div>
  `);
};

/* ---------- BUDGET REQUESTS ---------- */

const updateUserSuccess = user => {
  setState({ user });
};

const updateUserWithBudgetId = budgetObj => {
  console.log('budget updated', budgetObj.id);
  const settings = {
    url: `/api/users/${STATE.user.id}`,
    method: 'PUT',
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${STATE.jwt}`
    },
    data: JSON.stringify({
      id: STATE.user.id,
      budget: budgetObj.id
    }),
    success: updateUserSuccess,
    error: function(err){
      console.error(err);
    }
  };

  $.ajax(settings);
}

const createBudget = () => { 
  const settings = {
    url: "/api/budget",
    method: 'POST',
    data: JSON.stringify(STATE.budget),
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${STATE.jwt}`
    },
    success: updateUserWithBudgetId,
    error: function(err){
      console.error(err)
    }
  };

  $.ajax(settings);
}

const updateBudget = budgetId => {  
  const settings = {
    url: `/api/budget/${budgetId}`,
    method: 'PUT',
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${STATE.jwt}`
    },
    data: JSON.stringify(STATE.budget),
    success: updateUserWithBudgetId,
    error: function(err){
      console.error(err)
    }
  };

  $.ajax(settings);
};

const updateStateWithBudget = budget => {
  setState({ budget });
};

const getUserBudget = budgetId => {
  const settings = {
    url: `/api/budget/${budgetId}`,
    method: 'GET',
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${STATE.jwt}`
    },    
    success: updateStateWithBudget,
    error: function(err){
      console.error('error getting budget', err)
    }
  };

  $.ajax(settings);
};

/* ---------- SIGN UP, SIGN IN, AUTHENTICATION ---------- */

const refreshSuccess = token => {
  console.log('token refreshed');
  setState(Object.assign({}, STATE, { jwt: token.authToken }));
};

const refreshJwt = (user) => {
  const settings = {
    url: "/api/auth/refresh", 
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(user),
    success: refreshSuccess,
    error: function(err){
      console.error(err)
    }
  };

  $.ajax(settings);
};

const loginSuccess = token => {
  console.log('user signed in and made JWT');
  setState({ user: token.user, jwt: token.authToken, route: 'budgetPage' });
};

const userLogin = user => {
  console.log('logging in with', user);
  const settings = {
    url: "/api/auth/login", 
    method: 'POST',
    data: JSON.stringify(user),
    contentType: 'application/json',
    success: loginSuccess,
    error: function(err){
      console.error(err)
    }
  };

  $.ajax(settings);
};

const createUserSuccess = (newUser, userInfo) => {
  console.log('user created', newUser, userInfo);
  userLogin({
    username: userInfo.username,
    password: userInfo.password
  });
};

const createUser = userInfo => {
  const settings = {
    url: "/api/users",
    data: JSON.stringify(userInfo),
    contentType: 'application/json',
    type: 'POST',
    success: newUser => createUserSuccess(newUser, userInfo),
    error: function(err){
      console.error(err);
    }
  };

  $.ajax(settings);
};

/* ---------- EVENT HANDLER HELPERS ---------- */

const deleteItem = (list, index) => {
  console.log(list);
  return list.filter((item, i) => i !== index);
};

/* ---------- EVENT HANDLERS ---------- */

const budgetSaveHandler = event => {
  event.preventDefault();
  if(STATE.user.budget){
    console.log('updating budget');
    updateBudget(STATE.user.budget);
  } else {
    console.log('creating new budget');
    createBudget();
  }
};

const weeklyItemsHandler = event => {
  event.preventDefault();
  const userInputItem = $('input[name="add-input-item"]').val();
  const userInputAmount = $('input[name="add-input-amount"]').val();
  
  if (!!userInputItem && !!userInputAmount){
    setBudget({
      weeklyItems: [...STATE.budget.weeklyItems, {item: userInputItem, amount: userInputAmount}]
    });
  } else {
    alert("You can't leave fields blank");
  }  
};

const monthlyBudgetHandler = event => {  
  event.preventDefault();
  const monthlyBudget = $('input[name="add-monthly-input"]').val();
  
  if (!!monthlyBudget){
    setBudget({ monthlyBudget });
  } else {
    alert("You can't leave fields blank");
  }
}

const costOfLivingHandler = event => {
  event.preventDefault();
  const userInputItem = $('input[name="cost-input-item"]').val(); 
  const userInputAmount = $('input[name="cost-input-amount"]').val();
  
  if (!!userInputItem && !!userInputAmount){
    setBudget({ 
      costOfLiving: [...STATE.budget.costOfLiving, {item: userInputItem, amount: userInputAmount}]
    });
  } else {
    alert("You can't leave fields blank");
  }
}

const deleteItemHandler = event => {
  event.preventDefault();
  const toDelete = $(event.target);
  const type = toDelete.data('type');
  const selected = toDelete.data('item-index');
  
  setBudget({
    [type]: deleteItem(STATE.budget[type], selected)
  });
}

const userSignUpHandler = event => {
  event.preventDefault();
  const user = {
    email: $('input[name="email-input').val(),
    username: $('input[name="username-input').val(),
    password: $('input[name="password-input').val(),
    lastName: $('input[name="last-name-input').val(),
    firstName: $('input[name="first-name-input').val()
  };

  createUser(user);
};

const userLoginHandler = event => {
  event.preventDefault();
  const user = {
    username: $('input[name="username-login-input"]').val(),
    password: $('input[name="password-login-input"]').val()
  };
  userLogin(user);
};

/* ---------- RENDER Functions ---------- */

const checkBudget = () => {
  if (STATE.user.budget && !STATE.budget.id) {
    getUserBudget(STATE.user.budget);
  } else {
    renderBudgetPage();
  }
};

const checkForUser = () => {
  if (STATE.user.id) {
    setState({ route: 'budgetPage' })
  };

  render();
};

const renderLoginPage = () => {
  $('#page').html('');
  $('#page').append(langingPageText, userActionForms);
}

const renderBudgetPage = () => {
  $('page').html('');
  const budgetTemplate = createBudgetPage();
  $('#page').html(budgetTemplate);
};

const render = () => {
  if (STATE.route === 'landingPage') {
    renderLoginPage()
  } else if (STATE.route === 'budgetPage') {
    checkBudget()
  }
};

/* ---------- LISTENERS ----------*/

// click events

$('body').on('click', '#save-budget', event => budgetSaveHandler(event));
$('body').on('click', '.delete-button', event => deleteItemHandler(event));

// form submits

$('body').on('submit', '.login-form', event => userLoginHandler(event));
$('body').on('submit', '.sign-up-form', event => userSignUpHandler(event));
$('body').on('submit', '#weekly-items-add', event => weeklyItemsHandler(event));
$('body').on('submit', '#cost-of-living-add', event => costOfLivingHandler(event));
$('body').on('submit', '#monthly-budget-add', event => monthlyBudgetHandler(event));

/* ---------- LOAD ----------*/

$(() => {
  // check session storage for state
  const appState = sessionStorage.getItem('appState');

  if (appState) {
    // if one exists, set the app STATE to the one stored
    setState(JSON.parse(appState));
  };

  checkForUser();
});



