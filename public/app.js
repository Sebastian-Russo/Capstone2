const STATE = {
  user: {},
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
  jwt: ''
};

/* ---------- CHECK/UPDATE STATE ---------- */

const setState = (newItem, currentState=STATE) => {
  const newState = Object.assign({}, currentState, newItem);
  Object.assign(currentState, newState);

  render();  // by putting this here, you do not need to specifically call a rerender after each action
};

// called when user adds input to budget and saves
const setBudget = (newItem, currentBudget=STATE.budget) => {
  setState({ budget: Object.assign({}, currentBudget, newItem)});
};

const checkForUser = () => {
  console.log('check for user', STATE.user.id)
  if (STATE.user.id) {
    return setState({ route: 'budgetPage' })
  };

  render();
};


/* ---------- BUDGET REQUESTS ---------- */

const updateUserWithBudgetId = budgetObj => {
  // if there is a jwt in state, use that, if not, get from cookies 
  const authToken = STATE.jwt.length ? STATE.jwt : Cookies.get('authToken');
  console.log('update user budget ajax', budgetObj.id, STATE.user.id, STATE.user.budget);

  const settings = {
    url: `/api/users/${STATE.user.id}`,
    method: 'PUT',
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    data: JSON.stringify({
      id: STATE.user.id,
      budget: budgetObj.id
    }),
    success: user => {
      toastr.success('Saved', 'Success!', {
        containerId: 'budget-success'
      })
      setState({ user })
    },
    error: function(err){
      console.error(err);
    }
  };

  $.ajax(settings);
}

const createBudget = () => { 
  const authToken = STATE.jwt.length ? STATE.jwt : Cookies.get('authToken');
  console.log('creating budget ajax request', 'authToken:', authToken)
  const settings = {
    url: "/api/budget",
    method: 'POST',
    data: JSON.stringify(STATE.budget),
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    success: updateUserWithBudgetId,
    error: function(err){
      console.error(err)
    }
  };

  $.ajax(settings);
}

const updateBudget = budgetId => {  
  const authToken = STATE.jwt.length ? STATE.jwt : Cookies.get('authToken');
  console.log('update budget function', authToken, budgetId)
  const settings = {
    url: `/api/budget/${budgetId}`,
    method: 'PUT',
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${authToken}`
    },
    data: JSON.stringify(STATE.budget),
    success: updateUserWithBudgetId,
    error: err => {
      console.error(err)
    }
  };

  $.ajax(settings);
};


const getUserBudget = budgetId => {
  console.log('budget id', budgetId)
  const authToken = STATE.jwt.length ? STATE.jwt : Cookies.get('authToken');
    const settings = {
        url: `/api/budget/${budgetId}`,
        method: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },    
        success: (budget) => {
          console.log('budget id', budget)
          setState({ budget })
        },
        error: err => {
          console.error(err);
          if (err.status === 404) {
            console.error('NOT FOUND')
          }
        }
    };

  $.ajax(settings);
};


/* ---------- USER REQUESTS ---------- */

// LOGIN & TOKEN REFRESH 

const userLogin = (user) => {
  const settings = {
    url: "/api/auth/login", 
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(user),
    success: token => {
      const { user, authToken } = token;
      console.log('user signed in and made JWT', token);
      Cookies.set('userId', user.id);
      Cookies.set('budget', user.budget);
      Cookies.set('authToken', authToken);

      setState({ 
        user: token.user, 
        jwt: token.authToken,
        route: 'budgetPage' 
      });
    },    
    error: err => {
      console.error(err)
    }
  };

  $.ajax(settings);
};



// FLOW FOR USER TO LOGIN, AUTHENTICATION, AND TOKENIZE 


const refreshJwt = user => {
  console.log('logging in with', user);
  const settings = {
    url: "/api/auth/refresh", 
    method: 'POST',
    data: JSON.stringify(user),
    contentType: 'application/json',
    success: token => {
      console.log('token refreshed');
      setState(Object.assign({}, STATE, { jwt: token.authToken })) // only have to update jwt token, not the whole user or budget obj 
    },
    error: err => {
      console.error(err)
    }
  };

  $.ajax(settings);
};

// SIGN UP 

const createUser = userInfo => {
  const settings = {
    url: "/api/users",
    data: JSON.stringify(userInfo),
    contentType: 'application/json',
    type: 'POST',
    success: newUser => {
      console.log('user created', newUser, userInfo);
      userLogin({
        username: userInfo.username,
        password: userInfo.password
      });
    },
    error: err => {
      console.error(err);
    }
  };

  $.ajax(settings);
};


/* ---------- EVENT HANDLERS ---------- */

const landingPage = () => {
  setState({route: 'landingPage'})
}

const budgetPage = () => {
  setState({route: 'budgetPage'})
}

// logout 
const userLogout = () => {
  console.log('logout')
  Cookies.remove('userId');
  Cookies.remove('budget');
  Cookies.remove('authToken');

  setState({ 
    user: {},
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
    jwt: ''
  })
}

// saves new/updated budget 
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
    toastr.warning('Warning', 'You cannot leave fields blank!');
  }  
};

const monthlyBudgetHandler = event => {  
  event.preventDefault();
  const monthlyBudget = $('input[name="add-monthly-input"]').val();
  
  if (!!monthlyBudget){
    setBudget({ monthlyBudget });
  } else {
    toastr.warning('Warning', 'You cannot leave fields blank!');
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
    toastr.warning('Warning', 'You cannot leave fields blank!');
  }

}

const deleteItemHandler = event => {
  event.preventDefault();
  const toDelete = $(event.target);
  const type = toDelete.data('type');
  const selected = toDelete.data('item-index');
  const newList = STATE.budget[type].filter((item, i) => i !== selected) // deletes selected item
  console.log('target', event.target, 'type', type, 'selected', selected)
  
  setBudget({
    // [type]: deleteItem(STATE.budget[type], selected) // args: list, index 
    [type]: newList
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
  if (user.username && user.password && user.email){
    createUser(user);
  } else {
    toastr.warning('Warning', 'Please fill in all fields');
  }

};

const userLoginHandler = event => {
  event.preventDefault();
  const user = {
    username: $('input[name="username-login-input"]').val(),
    password: $('input[name="password-login-input"]').val()
  };

  if (user.username && user.password){
    userLogin(user);
  } else {
    toastr.warning('Warning', 'You cannot leave fields blank!')  
  }
  
};

const aboutHandler = () => {
  renderAboutPage();
}

/* ---------- RENDER Functions ---------- */

const checkBudget = () => {
    const expectedKeys = [
      "id",
      "totalCost",
      "weeklyItems",
      "weeklyBudget",
      "costOfLiving",
      "totalExpenses",
      "monthlyBudget"
    ];

    const actualKeys = Object.keys(STATE.budget);

    const budgetId = Cookies.get('budget'); // budget id is named 'budget' 

    // in case user has made any changes/inputs, check: 
    if (STATE.user.budget) { // if user budget id is there, then
      console.log('checking if user has made any changes to budget')
      expectedKeys.forEach(key => {
        if (!actualKeys.includes(key)) { // check that every key is included and return true, if it does not return true, then throw warning
          console.log('it\'s not here');
          return getUserBudget(STATE.user.budget);
        }
      });
    } else if (budgetId) {
        console.log('budgetId cookie here')
        return getUserBudget(budgetId)
    };

    return renderBudgetPage();
};

const renderLoginPage = () => {
  const userId = Cookies.get('userId');
  console.log('userId')
  if (userId) {
    return checkBudget();
  };

  if (window.matchMedia("(min-width: 670px)").matches) {
    console.log("big screens")
    $('#page').html('');
    $('#page').append(langingPageText, userActionForms);
  } else {
    console.log("mobile screens")
    $('#page').html('');
    $('#page').append(landingPageTextMobile , userActionForms);
  }

}

const renderAboutPage = () => {
  if (window.matchMedia("(min-width: 670px)").matches) {
    console.log("big screens")
    $('#page').html('');
    $('#page').append(langingPageText, userActionForms);
  } else {
    console.log("mobile screens")
    $('#page').html('');
    $('#page').append(landingPageTextMobile , userActionForms);
  }
}

const renderBudgetPage = () => {
  $('#page').html('');
  const budgetTemplate = createBudgetPage();
  $('#page').html(budgetTemplate);
};

const render = () => {
  const budgetId = Cookies.get('budget');
  if (STATE.route === 'budgetPage' || budgetId) {
      console.log('get budget id from cookies', budgetId);
    if (STATE.budget.id) {
      return renderBudgetPage(); 
    }
    return checkBudget();
  }

  renderLoginPage();
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
  <div class="container">
    <div class="box-1"
      <p>
        Welcome to the ultimate budget and saving calculator to help keep track your daily, weekly, and monthy, short term budget goals with 4 simple steps. 
        <br>
        <br>
        <div> 
          <img src="../images/mindmapHorizontal.png" alt="mind map" id="mindmap-image">
        </div>
        <br>
        <br>
        <span class="landing-text">First</span>, simply add in your monthly income after taxes. (What you actually get to keep).
        <br>
        <br>
        <span class="landing-text">Second</span>, your "Cost of living" is where you List all your fixed bills you have each month. 
        Examples: savings, rent, car payment, insurance, groceries (if consistent), phone/cable bills, etc. 
        <br>
        <br>
        <span class="landing-text">Third</span>, your "Spending money" is broken down by week. It calculates and keep track of what's left of your monthly income after your fixed "cost of living" items are added in. 
        <br>
        This is your monthly budget, which is your extra "Spending money". 
        This is what you have left after your expenses from your cost of living. When you make a purchase, if you log each item daily for the week, then it will help keep track of where your money goes. 
        <br>
        <br> 
        <span class="landing-text">Fourth</span>, if you find yourself going over your weekly limit, review where your spending habits you've logged each day. 
        <br>
        <br>
        Lastly, first couple weeks are crucial to log each purchase to build up a habit and monitor yourself. At the same time don't beat yourself up if you go over your limits, you're still finding your baseline.  
      </p>
  </div>
`);

const landingPageTextMobile = (`
  <div class="container">
    <div class="box-1"
      <p>
        Welcome to the ultimate budget and saving calculator to help keep track your daily, weekly, and monthy, short term budget goals with 4 simple steps. 
      </p>
      <br>
      <div> 
        <img src="../images/mindmapVertical.png" alt="mind map" id="mindmap-image">
      </div>
    </div>
  </div>
`);

// sign up and login forms
const userActionForms = (`
  <div class="container">
    <div class="container-login">
      <h4>Sign In</h4>
      <form class="form">
        <label for="username-login-input">Username</label>
        <input type="text" class="login" name="username-login-input" placeholder="username">
        <label for="password-login-input">Password</label>
        <input type="password" class="password" name="password-login-input" placeholder="password">
        <button class="login-button">Login</button>
      </form>
    </div>

    <div class="container-register">
      <h4>Sign Up</h4>
      <form class="form">
        <label for="username-input">Username</label>
        <input type="text" name="username-input" placeholder="username">
        <label for="first-name-input">First Name</label>
        <input type="text" name="first-name-input" placeholder="first name">
        <label for="last-name-input">Last Name</label>
        <input type="text" name="last-name-input" placeholder="last name">
        <label for="email-input">Email</label>
        <input type="email" name="email-input" placeholder="email">
        <label for="password">Password</label>
        <input type="password" name="password-input" placeholder="password">
        <button id="sign-up-button" class="form-buton" type="submit">Sign Up</button>
      </form>
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
                                    // data-type
  const weeklyItemsList = createList('weeklyItems', weeklyItems);

  const costOfLivingTotal = getTotal(costOfLiving);
  const costOfLivingList = createList('costOfLiving', costOfLiving);

  return (`
    <div class="container">
      <div id="available-funds" class="section">
        <div id="monthly-budget-container" class="budget-container-1">
          <h3>Monthly Income</h3>
          <form id="monthly-budget-add" class="budget-form">
            <label for="add-monthly-input">$</label>
            <input type="text" name="add-monthly-input" placeholder=${monthlyBudget}>
            <button id="monthly-budget-add-button" class="add-button">Update</button>
          </form>
        </div>

        <div id="weekly-budget-container" class="budget-container-2">
          <h3>Weekly "Spending Money"</h3>
          <div class="total">$${monthlyBudget - costOfLivingTotal}</div>
        </div>
      </div>

      <div id="list-elements" class="section">
        <div id="cost-of-living-container" class="budget-container-1">
          <h3>Cost of Living: $${costOfLivingTotal}</h3>
          <ul id="cost-of-living" class="item-list">${costOfLivingList}</ul>
          <form id="cost-of-living-add" class="budget-form">
            <input type="text" class="cost-of-living-add-item-input add-input" name="cost-input-item" placeholder="item">
            <input type="number" class="cost-of-living-add-amount-input add-input" name="cost-input-amount" placeholder="amount">
            <button id="cost-of-living-add-button">Add item</button>
          </form>
        </div>

        <div id="weekly-items-container" class="budget-container-2">
          <h3>Weekly Items: $${weeklyTotal}</h3>
          <ul class="weekly-items">${weeklyItemsList}</ul>
          <form id="weekly-items-add" class="budget-form">
            <input type="text" name="add-input-item" placeholder="item">
            <input type="text" name="add-input-amount" placeholder="amount">
            <button id="weekly-items-add-button" class="add-button">Add item</button>
          </form>
        </div>
      </div>

      <div class="budget-container-4">
        <button id="save-budget">Save Budget Information</button>
        <button id="logout"> Logout </button>
      </div>
    </div>
  `);
};

/* ---------- LISTENERS ----------*/

// click events
$('body').on('click', '#nav-button-about', () => aboutHandler());
$('body').on('click', '#nav-button-budget', () => budgetPage());
$('body').on('click', '#logout', () => userLogout());
$('body').on('click', '#save-budget', event => budgetSaveHandler(event));
$('body').on('click', '.delete-button', event => deleteItemHandler(event));

// form submits

$('body').on('submit', '.login-form', event => userLoginHandler(event));
$('body').on('submit', '.sign-up-form', event => userSignUpHandler(event));
$('body').on('submit', '#weekly-items-add', event => weeklyItemsHandler(event));
$('body').on('submit', '#cost-of-living-add', event => costOfLivingHandler(event));
$('body').on('submit', '#monthly-budget-add', event => monthlyBudgetHandler(event));

// window.addEventListener("resize", () => resizeMobile());
/* ---------- LOAD ----------*/

$(() => {
  checkForUser();
});

